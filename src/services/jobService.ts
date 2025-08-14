const API_BASE_URL = 'http://localhost:3001/api';

class JobService {
  async getJobs(filters = {}) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(`${API_BASE_URL}/jobs?${params}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  async getJobById(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching job:', error);
      return { success: false, error: error.message };
    }
  }

  async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/stats/summary`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { success: false, error: error.message };
    }
  }

  async triggerJobFetch(config: {
    platforms: string[];
    location: string;
    keywords: string[];
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/workflows/trigger-job-fetch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      return await response.json();
    } catch (error) {
      console.error('Error triggering workflow:', error);
      return { success: false, error: error.message };
    }
  }
}

export const jobService = new JobService();