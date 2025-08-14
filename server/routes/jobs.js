import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all jobs with filtering
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      platform, 
      location, 
      keywords, 
      salary_min,
      remote_only,
      posted_within_hours = 24
    } = req.query;

    let query = req.supabase
      .from('jobs')
      .select(`
        *,
        companies (
          name,
          logo_url,
          industry
        )
      `)
      .order('posted_at', { ascending: false });

    // Apply filters
    if (platform) {
      query = query.eq('platform', platform);
    }

    if (location && location !== 'remote') {
      query = query.ilike('location', `%${location}%`);
    }

    if (remote_only === 'true') {
      query = query.eq('is_remote', true);
    }

    if (keywords) {
      const keywordArray = keywords.split(',').map(k => k.trim());
      query = query.or(
        keywordArray.map(keyword => 
          `title.ilike.%${keyword}%,description.ilike.%${keyword}%`
        ).join(',')
      );
    }

    if (salary_min) {
      query = query.gte('salary_min', parseInt(salary_min));
    }

    // Filter by posted within hours
    const hoursAgo = new Date();
    hoursAgo.setHours(hoursAgo.getHours() - parseInt(posted_within_hours));
    query = query.gte('posted_at', hoursAgo.toISOString());

    // Pagination
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;
    query = query.range(from, to);

    const { data: jobs, error, count } = await query;

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: jobs || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil((count || 0) / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: job, error } = await req.supabase
      .from('jobs')
      .select(`
        *,
        companies (
          name,
          logo_url,
          industry,
          description as company_description
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Job not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get job statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    
    const hoursAgo = new Date();
    hoursAgo.setHours(hoursAgo.getHours() - parseInt(hours));

    // Total jobs in timeframe
    const { count: totalJobs } = await req.supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .gte('posted_at', hoursAgo.toISOString());

    // Jobs by platform
    const { data: platformStats } = await req.supabase
      .from('jobs')
      .select('platform')
      .gte('posted_at', hoursAgo.toISOString());

    // Remote jobs count
    const { count: remoteJobs } = await req.supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('is_remote', true)
      .gte('posted_at', hoursAgo.toISOString());

    // Platform distribution
    const platformDistribution = platformStats?.reduce((acc, job) => {
      acc[job.platform] = (acc[job.platform] || 0) + 1;
      return acc;
    }, {}) || {};

    res.json({
      success: true,
      data: {
        totalJobs: totalJobs || 0,
        remoteJobs: remoteJobs || 0,
        platformDistribution,
        timeframe: `${hours} hours`
      }
    });
  } catch (error) {
    console.error('Error fetching job stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export { router as jobRoutes };