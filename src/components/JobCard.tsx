import React from 'react';
import { MapPin, DollarSign, Clock, ExternalLink, Building } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  location: string;
  description: string;
  salary_min?: number;
  salary_max?: number;
  currency: string;
  is_remote: boolean;
  platform: string;
  external_url: string;
  posted_at: string;
  relevance_score: number;
  companies?: {
    name: string;
    logo_url?: string;
    industry: string;
  };
}

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const formatSalary = (min?: number, max?: number, currency = 'USD') => {
    if (!min && !max) return null;
    if (min && max) {
      return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
    }
    return min ? `$${(min / 1000).toFixed(0)}k+` : `Up to $${(max! / 1000).toFixed(0)}k`;
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just posted';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return 'bg-blue-500';
      case 'indeed': return 'bg-green-500';
      case 'glassdoor': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-gray-400';
  };


  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
              {job.title}
            </h3>
            <div className={`px-2 py-1 rounded text-xs text-white font-medium ${getPlatformColor(job.platform)}`}>
              {job.platform}
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-blue-200">
            <div className="flex items-center space-x-1">
              <Building className="h-4 w-4" />
              <span>{job.companies?.name || 'Company'}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
              {job.is_remote && (
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
                  Remote
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className={`text-sm font-medium ${getRelevanceColor(job.relevance_score)}`}>
            {job.relevance_score}% match
          </div>
          <div className="text-blue-300 text-sm">
            {getTimeAgo(job.posted_at)}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-blue-100 mb-4 line-clamp-3 leading-r
}elaxed">
        {job.description?.substring(0, 200)}...
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {formatSalary(job.salary_min, job.salary_max, job.currency) && (
            <div className="flex items-center space-x-1 text-green-400">
              <DollarSign className="h-4 w-4" />
              <span className="font-semibold">
                {formatSalary(job.salary_min, job.salary_max, job.currency)}
              </span>
            </div>
          )}
          
          <div className="flex items-center space-x-1 text-blue-300">
            <Clock className="h-4 w-4" />
            <span>{getTimeAgo(job.posted_at)}</span>
          </div>
        </div>

        <a
          href={job.external_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
        >
          <span>View Job</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}