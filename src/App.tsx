import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Clock, Building, Filter, RefreshCw, Smartphone, Database } from 'lucide-react';
import JobCard from './components/JobCard';
import WorkflowStatus from './components/WorkflowStatus';
import StatsCard from './components/StatsCard';
import FilterPanel from './components/FilterPanel';
import { jobService } from './services/jobService';

function App() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    keywords: '',
    location: '',
    platform: '',
    remote_only: false,
    salary_min: '',
    posted_within_hours: 24
  });

  useEffect(() => {
    loadJobs();
    loadStats();
  }, [filters]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobs(filters);
      if (response.success) {
        setJobs(response.data);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await jobService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleTriggerWorkflow = async () => {
    try {
      setTriggering(true);
      const response = await jobService.triggerJobFetch({
        platforms: ['indeed', 'linkedin', 'glassdoor'],
        location: filters.location || 'remote',
        keywords: filters.keywords ? filters.keywords.split(',').map(k => k.trim()) : ['software engineer', 'developer']
      });

      if (response.success) {
        // Refresh jobs after a delay
        setTimeout(() => {
          loadJobs();
          loadStats();
        }, 3000);
      }
    } catch (error) {
      console.error('Error triggering workflow:', error);
    } finally {
      setTriggering(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Job Aggregator Platform</h1>
                <p className="text-blue-200">Real-time job fetching with N8N workflows</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 text-white transition-all duration-200"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>

              <button
                onClick={handleTriggerWorkflow}
                disabled={triggering}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg text-white font-semibold transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${triggering ? 'animate-spin' : ''}`} />
                <span>{triggering ? 'Fetching...' : 'Trigger Job Fetch'}</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatsCard
                title="Total Jobs"
                value={stats.totalJobs}
                icon={Building}
                gradient="from-blue-500 to-blue-600"
              />
              <StatsCard
                title="Remote Jobs"
                value={stats.remoteJobs}
                icon={MapPin}
                gradient="from-green-500 to-green-600"
              />
              <StatsCard
                title="Indeed"
                value={stats.platformDistribution?.indeed || 0}
                icon={Search}
                gradient="from-purple-500 to-purple-600"
              />
              <StatsCard
                title="LinkedIn"
                value={stats.platformDistribution?.linkedin || 0}
                icon={Building}
                gradient="from-orange-500 to-orange-600"
              />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-80 space-y-6">
            {/* Filter Panel */}
            {showFilters && (
              <FilterPanel 
                filters={filters} 
                onChange={handleFilterChange}
              />
            )}

            {/* Workflow Status */}
            <WorkflowStatus />

            {/* Mobile App Info */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Smartphone className="h-6 w-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Flutter Mobile App</h3>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed">
                The Flutter mobile app code has been generated and is ready for deployment. 
                It includes real-time job viewing, filtering, and push notifications.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Android Support
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  iOS Support
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Offline Support
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 animate-pulse">
                    <div className="h-6 bg-white/20 rounded mb-4"></div>
                    <div className="h-4 bg-white/20 rounded mb-2"></div>
                    <div className="h-4 bg-white/20 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-12 text-center">
                <Search className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Jobs Found</h3>
                <p className="text-blue-200">Try adjusting your filters or trigger a new job fetch.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    {jobs.length} Jobs Found
                  </h2>
                  <div className="text-sm text-blue-200">
                    Updated {new Date().toLocaleTimeString()}
                  </div>
                </div>

                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;