import axios from 'axios';

class JobScrapingService {
  constructor() {
    this.platformConfigs = {
      indeed: {
        baseUrl: 'https://api.indeed.com/ads/apisearch',
        rateLimit: 1000 // ms between requests
      },
      linkedin: {
        baseUrl: 'https://api.linkedin.com/v2/jobs',
        rateLimit: 2000
      },
      glassdoor: {
        baseUrl: 'https://api.glassdoor.com/api/api.htm',
        rateLimit: 1500
      }
    };
    
    this.lastRequestTime = {};
  }

  async fetchJobsFromPlatform(platform, options = {}) {
    const { location = 'remote', keywords = [] } = options;
    
    console.log(`🔍 Fetching jobs from ${platform} for location: ${location}`);

    // Rate limiting
    await this.respectRateLimit(platform);

    switch (platform.toLowerCase()) {
      case 'indeed':
        return this.fetchFromIndeed(location, keywords);
      case 'linkedin':
        return this.fetchFromLinkedIn(location, keywords);
      case 'glassdoor':
        return this.fetchFromGlassdoor(location, keywords);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  async respectRateLimit(platform) {
    const config = this.platformConfigs[platform];
    const lastRequest = this.lastRequestTime[platform] || 0;
    const timeSinceLastRequest = Date.now() - lastRequest;
    
    if (timeSinceLastRequest < config.rateLimit) {
      const waitTime = config.rateLimit - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime[platform] = Date.now();
  }

  // Mock Indeed API (replace with real API when available)
  async fetchFromIndeed(location, keywords) {
    try {
      // This is a simulation - replace with real Indeed API calls
      const mockJobs = this.generateMockJobs('indeed', location, keywords, 15);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      return mockJobs;
    } catch (error) {
      console.error('Error fetching from Indeed:', error);
      return [];
    }
  }

  // Mock LinkedIn API (replace with real API when available)
  async fetchFromLinkedIn(location, keywords) {
    try {
      const mockJobs = this.generateMockJobs('linkedin', location, keywords, 12);
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      return mockJobs;
    } catch (error) {
      console.error('Error fetching from LinkedIn:', error);
      return [];
    }
  }

  // Mock Glassdoor API (replace with real API when available)
  async fetchFromGlassdoor(location, keywords) {
    try {
      const mockJobs = this.generateMockJobs('glassdoor', location, keywords, 8);
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 1000));
      return mockJobs;
    } catch (error) {
      console.error('Error fetching from Glassdoor:', error);
      return [];
    }
  }

  generateMockJobs(platform, location, keywords, count) {
    const companies = [
      'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Tesla', 
      'Spotify', 'Stripe', 'Airbnb', 'Uber', 'Shopify', 'Atlassian', 'Slack'
    ];

    const jobTitles = [
      'Senior Frontend Developer', 'Full Stack Engineer', 'Backend Developer',
      'React Developer', 'Node.js Developer', 'DevOps Engineer', 'Cloud Architect',
      'Mobile Developer', 'UI/UX Designer', 'Product Manager', 'Data Engineer',
      'Machine Learning Engineer', 'Software Architect', 'Site Reliability Engineer'
    ];

    const locations = location === 'remote' ? 
      ['Remote', 'Remote - US', 'Remote - Europe', 'Remote - Worldwide'] :
      [location, `${location}, US`, `${location} Metro Area`, `Near ${location}`];

    const requirements = [
      ['React', 'JavaScript', 'TypeScript', 'Node.js'],
      ['Python', 'Django', 'PostgreSQL', 'AWS'],
      ['Java', 'Spring Boot', 'Microservices', 'Docker'],
      ['React Native', 'iOS', 'Android', 'Mobile Development'],
      ['Vue.js', 'Angular', 'CSS', 'HTML5'],
      ['Go', 'Kubernetes', 'Docker', 'DevOps'],
      ['PHP', 'Laravel', 'MySQL', 'Redis']
    ];

    const jobs = [];
    
    for (let i = 0; i < count; i++) {
      const company = companies[Math.floor(Math.random() * companies.length)];
      const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      const jobLocation = locations[Math.floor(Math.random() * locations.length)];
      const jobRequirements = requirements[Math.floor(Math.random() * requirements.length)];
      
      // Random salary range
      const baseSalary = 80000 + Math.floor(Math.random() * 120000);
      const salaryRange = 20000 + Math.floor(Math.random() * 40000);

      // Random posted time within last 24 hours
      const hoursAgo = Math.floor(Math.random() * 24);
      const postedAt = new Date();
      postedAt.setHours(postedAt.getHours() - hoursAgo);

      jobs.push({
        external_id: `${platform}_${company}_${Date.now()}_${i}`,
        title: title,
        company: company,
        location: jobLocation,
        description: this.generateJobDescription(title, company, jobRequirements),
        requirements: jobRequirements,
        salary_min: baseSalary,
        salary_max: baseSalary + salaryRange,
        currency: 'USD',
        job_type: Math.random() > 0.2 ? 'full-time' : 'contract',
        is_remote: jobLocation.toLowerCase().includes('remote'),
        url: `https://${platform}.com/jobs/${company.toLowerCase().replace(/\s+/g, '-')}-${title.toLowerCase().replace(/\s+/g, '-')}-${i}`,
        posted_at: postedAt.toISOString(),
        expires_at: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toISOString(), // 30 days from now
        industry: 'Technology'
      });
    }

    return jobs;
  }

  generateJobDescription(title, company, requirements) {
    const descriptions = [
      `Join ${company} as a ${title} and work on cutting-edge technology that impacts millions of users worldwide.`,
      `We're looking for a talented ${title} to join our growing team at ${company}. You'll be working on innovative projects.`,
      `${company} is seeking an experienced ${title} to help build the next generation of our platform.`,
      `Exciting opportunity for a ${title} at ${company}. Work with a collaborative team on challenging technical problems.`
    ];

    const baseDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
    const reqText = `\n\nKey Requirements:\n${requirements.map(req => `• ${req}`).join('\n')}`;
    
    const benefits = `\n\nWhat we offer:\n• Competitive salary and equity\n• Flexible remote work options\n• Health, dental, and vision insurance\n• Professional development budget\n• Unlimited PTO`;

    return baseDesc + reqText + benefits;
  }
}

export const jobScrapingService = new JobScrapingService();