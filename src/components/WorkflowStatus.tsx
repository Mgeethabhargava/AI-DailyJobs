import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function WorkflowStatus() {
  const [workflows, setWorkflows] = useState([]);

  // Mock workflow status for demonstration
  useEffect(() => {
    const mockWorkflows = [
      {
        id: 'workflow-1',
        status: 'completed',
        startedAt: new Date(Date.now() - 300000), // 5 minutes ago
        progress: { total: 3, completed: 3, failed: 0 }
      },
      {
        id: 'workflow-2', 
        status: 'running',
        startedAt: new Date(Date.now() - 60000), // 1 minute ago
        progress: { total: 3, completed: 1, failed: 0 }
      }
    ];
    setWorkflows(mockWorkflows);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'running': return <Activity className="h-4 w-4 text-blue-400 animate-pulse" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'running': return 'text-blue-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <Activity className="h-5 w-5" />
        <span>N8N Workflows</span>
      </h3>

      <div className="space-y-3">
        {workflows.length === 0 ? (
          <p className="text-blue-200 text-sm">No active workflows</p>
        ) : (
          workflows.map((workflow) => (
            <div key={workflow.id} className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(workflow.status)}
                  <span className={`text-sm font-medium ${getStatusColor(workflow.status)}`}>
                    {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                  </span>
                </div>
                <span className="text-xs text-blue-300">
                  {Math.floor((Date.now() - workflow.startedAt.getTime()) / 60000)}m ago
                </span>
              </div>

              {workflow.progress && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-blue-200">
                    <span>Progress</span>
                    <span>{workflow.progress.completed}/{workflow.progress.total}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full transition-all duration-200"
                      style={{ width: `${(workflow.progress.completed / workflow.progress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="text-xs text-blue-300 space-y-1">
          <p>• Automated job fetching every hour</p>
          <p>• Multi-platform data collection</p>
          <p>• Real-time deduplication</p>
        </div>
      </div>
    </div>
  );
}