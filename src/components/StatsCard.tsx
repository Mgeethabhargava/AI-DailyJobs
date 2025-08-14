import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  gradient: string;
}

export default function StatsCard({ title, value, icon: Icon, gradient }: StatsCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-200 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
        </div>
        <div className={`w-10 h-10 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}