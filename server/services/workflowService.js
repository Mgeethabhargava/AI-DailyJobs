import { jobScrapingService } from './jobScrapingService.js';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class WorkflowService {
  constructor() {
    this.activeWorkflows = new Map();
  }

  // N8N-style workflow execution
  async startJobFetchWorkflow(config) {
    const workflowId = uuidv4();
    const { platforms, location, keywords } = config;

    console.log(`🔄 Starting workflow ${workflowId} with config:`, config);

    // Store workflow status
    this.activeWorkflows.set(workflowId, {
      id: workflowId,
      status: 'running',
      startedAt: new Date(),
      config,
      progress: {
        total: platforms.length,
        completed: 0,
        failed: 0
      }
    });

    // Execute workflow asynchronously
    this.executeJobFetchWorkflow(workflowId, config).catch(error => {
      console.error(`Workflow ${workflowId} failed:`, error);
      const workflow = this.activeWorkflows.get(workflowId);
      if (workflow) {
        workflow.status = 'failed';
        workflow.error = error.message;
      }
    });

    return workflowId;
  }

  async executeJobFetchWorkflow(workflowId, config) {
    const { platforms, location, keywords } = config;
    const workflow = this.activeWorkflows.get(workflowId);

    try {
      console.log(`📥 Executing job fetch for platforms: ${platforms.join(', ')}`);

      // Step 1: Fetch jobs from each platform
      for (const platform of platforms) {
        try {
          console.log(`🔍 Fetching jobs from ${platform}...`);
          
          const jobs = await jobScrapingService.fetchJobsFromPlatform(
            platform, 
            { location, keywords }
          );

          // Step 2: Process and store jobs
          if (jobs && jobs.length > 0) {
            await this.processAndStoreJobs(jobs, platform);
            console.log(`✅ Successfully processed ${jobs.length} jobs from ${platform}`);
          } else {
            console.log(`⚠️ No jobs found from ${platform}`);
          }

          // Update progress
          workflow.progress.completed++;
          
        } catch (error) {
          console.error(`❌ Error fetching from ${platform}:`, error.message);
          workflow.progress.failed++;
        }
      }

      // Step 3: Clean up old jobs
      await this.cleanupOldJobs();

      // Mark workflow as completed
      workflow.status = 'completed';
      workflow.completedAt = new Date();
      
      console.log(`✅ Workflow ${workflowId} completed successfully`);

    } catch (error) {
      console.error(`❌ Workflow ${workflowId} failed:`, error);
      workflow.status = 'failed';
      workflow.error = error.message;
      throw error;
    }
  }

  async processAndStoreJobs(jobs, platform) {
    for (const jobData of jobs) {
      try {
        // Check if job already exists
        const { data: existingJob } = await supabase
          .from('jobs')
          .select('id')
          .eq('external_id', jobData.external_id)
          .eq('platform', platform)
          .single();

        if (existingJob) {
          console.log(`Job ${jobData.external_id} already exists, skipping...`);
          continue;
        }

        // Create or get company
        let companyId = null;
        if (jobData.company) {
          const { data: company, error: companyError } = await supabase
            .from('companies')
            .upsert({
              name: jobData.company,
              industry: jobData.industry || 'Technology'
            }, {
              onConflict: 'name',
              ignoreDuplicates: false
            })
            .select('id')
            .single();

          if (!companyError && company) {
            companyId = company.id;
          }
        }

        // Insert job
        const jobToInsert = {
          external_id: jobData.external_id,
          title: jobData.title,
          company_id: companyId,
          location: jobData.location,
          description: jobData.description,
          requirements: jobData.requirements || [],
          salary_min: jobData.salary_min,
          salary_max: jobData.salary_max,
          currency: jobData.currency || 'USD',
          job_type: jobData.job_type || 'full-time',
          is_remote: jobData.is_remote || false,
          platform: platform,
          external_url: jobData.url,
          posted_at: new Date(jobData.posted_at || Date.now()),
          expires_at: jobData.expires_at ? new Date(jobData.expires_at) : null,
          relevance_score: this.calculateRelevanceScore(jobData)
        };

        const { error: insertError } = await supabase
          .from('jobs')
          .insert(jobToInsert);

        if (insertError) {
          console.error('Error inserting job:', insertError);
        }

      } catch (error) {
        console.error('Error processing job:', error);
      }
    }
  }

  calculateRelevanceScore(jobData) {
    let score = 50; // Base score

    // Higher score for remote jobs
    if (jobData.is_remote) score += 20;

    // Higher score for jobs with salary information
    if (jobData.salary_min || jobData.salary_max) score += 15;

    // Higher score for recent posts
    const hoursAgo = (Date.now() - new Date(jobData.posted_at || Date.now())) / (1000 * 60 * 60);
    if (hoursAgo < 6) score += 15;
    else if (hoursAgo < 24) score += 10;

    // Score based on keywords in title
    const title = (jobData.title || '').toLowerCase();
    const highValueKeywords = ['senior', 'lead', 'architect', 'principal', 'staff'];
    const techKeywords = ['react', 'node', 'python', 'aws', 'kubernetes'];
    
    highValueKeywords.forEach(keyword => {
      if (title.includes(keyword)) score += 10;
    });

    techKeywords.forEach(keyword => {
      if (title.includes(keyword)) score += 5;
    });

    return Math.min(100, Math.max(0, score));
  }

  async cleanupOldJobs() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { error } = await supabase
      .from('jobs')
      .delete()
      .lt('posted_at', sevenDaysAgo.toISOString());

    if (error) {
      console.error('Error cleaning up old jobs:', error);
    } else {
      console.log('✅ Old jobs cleanup completed');
    }
  }

  getWorkflowStatus(workflowId) {
    return this.activeWorkflows.get(workflowId);
  }

  getAllWorkflows() {
    return Array.from(this.activeWorkflows.values());
  }
}

export const workflowService = new WorkflowService();