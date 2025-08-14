import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';
import { jobRoutes } from './routes/jobs.js';
import { workflowService } from './services/workflowService.js';
import { jobScrapingService } from './services/jobScrapingService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// Make supabase available to all routes
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Routes
app.use('/api/jobs', jobRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// N8N-style workflow trigger endpoint
app.post('/api/workflows/trigger-job-fetch', async (req, res) => {
  try {
    const { platforms, location, keywords } = req.body;
    
    console.log('Triggering job fetch workflow:', { platforms, location, keywords });
    
    // Start the workflow
    const workflowId = await workflowService.startJobFetchWorkflow({
      platforms: platforms || ['indeed', 'linkedin', 'glassdoor'],
      location: location || 'remote',
      keywords: keywords || ['software engineer', 'developer', 'frontend', 'backend']
    });
    
    res.json({ 
      success: true, 
      workflowId,
      message: 'Job fetch workflow started successfully' 
    });
  } catch (error) {
    console.error('Error triggering workflow:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Schedule automatic job fetching every hour
cron.schedule('0 * * * *', async () => {
  console.log('Starting scheduled job fetch...');
  try {
    await workflowService.startJobFetchWorkflow({
      platforms: ['indeed', 'linkedin', 'glassdoor'],
      location: 'remote',
      keywords: ['software engineer', 'developer', 'react', 'node.js']
    });
    console.log('Scheduled job fetch completed successfully');
  } catch (error) {
    console.error('Error in scheduled job fetch:', error);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Job Aggregator API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔄 Workflow trigger: http://localhost:${PORT}/api/workflows/trigger-job-fetch`);
});