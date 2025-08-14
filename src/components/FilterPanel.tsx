import React from 'react';
import { Search, MapPin, DollarSign, Clock, Briefcase } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    keywords: string;
    location: string;
    platform: string;
    remote_only: boolean;
    salary_min: string;
    posted_within_hours: number;
  };
  onChange: (filters: any) => void;
}

export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const handleInputChange = (field: string, value: any) => {
    onChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <Search className="h-5 w-5" />
        <span>Filters</span>
      </h3>

      <div className="space-y-4">
        {/* Keywords */}
        <div>
          <label className="block text-blue-200 text-sm font-medium mb-2">
            Keywords
          </label>
          <input
            type="text"
            value={filters.keywords}
            onChange={(e) => handleInputChange('keywords', e.target.value)}
            placeholder="React, Node.js, Python..."
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-blue-200 text-sm font-medium mb-2">
            Location
          </label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="San Francisco, Remote..."
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Platform */}
        <div>
          <label className="block text-blue-200 text-sm font-medium mb-2">
            Platform
          </label>
          <select
            value={filters.platform}
            onChange={(e) => handleInputChange('platform', e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Platforms</option>
            <option value="indeed">Indeed</option>
            <option value="linkedin">LinkedIn</option>
            <option value="glassdoor">Glassdoor</option>
          </select>
        </div>

        {/* Remote Only */}
        <div>
          <label className="flex items-center space-x-3 text-blue-200">
            <input
              type="checkbox"
              checked={filters.remote_only}
              onChange={(e) => handleInputChange('remote_only', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
            />
            <span>Remote jobs only</span>
          </label>
        </div>

        {/* Minimum Salary */}
        <div>
          <label className="block text-blue-200 text-sm font-medium mb-2">
            Minimum Salary ($)
          </label>
          <input
            type="number"
            value={filters.salary_min}
            onChange={(e) => handleInputChange('salary_min', e.target.value)}
            placeholder="80000"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Posted Within */}
        <div>
          <label className="block text-blue-200 text-sm font-medium mb-2">
            Posted Within
          </label>
          <select
            value={filters.posted_within_hours}
            onChange={(e) => handleInputChange('posted_within_hours', parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>1 hour</option>
            <option value={6}>6 hours</option>
            <option value={24}>24 hours</option>
            <option value={72}>3 days</option>
            <option value={168}>1 week</option>
          </select>
        </div>
      </div>
    </div>
  );
}