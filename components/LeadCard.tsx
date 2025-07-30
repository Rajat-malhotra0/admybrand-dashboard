"use client";

import React from "react";
import Card from "./Card";
import { Users, Heart, MessageCircle, Share2, TrendingUp, Star, ExternalLink } from "lucide-react";

interface LeadMetrics {
  followers: number;
  engagement: number;
  avgLikes: number;
  avgComments: number;
  reachRate: number;
}

interface LeadCardProps {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  platform: "instagram" | "tiktok" | "youtube" | "linkedin";
  tier: "nano" | "micro" | "macro" | "mega";
  metrics: LeadMetrics;
  collaborationStatus: "active" | "pending" | "completed";
  rating: number;
  category: string;
  costPerPost?: number;
  roi?: number;
  className?: string;
}

const LeadCard: React.FC<LeadCardProps> = ({
  id,
  name,
  handle,
  avatar,
  platform,
  tier,
  metrics,
  collaborationStatus,
  rating,
  category,
  costPerPost,
  roi,
  className = ""
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "nano": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "micro": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "macro": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "mega": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPlatformIcon = (platform: string) => {
    // In a real app, you'd use actual platform icons
    return <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>;
  };

  return (
    <Card className={`p-5 hover:shadow-lg transition-all duration-200 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <img
              src={avatar}
              alt={name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
              }}
            />
            <div className="absolute -bottom-1 -right-1">
              {getPlatformIcon(platform)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-primary truncate">{name}</h3>
            <p className="text-sm text-text-muted truncate">@{handle}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTierColor(tier)}`}>
                {tier.toUpperCase()}
              </span>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs text-text-muted">{rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(collaborationStatus)}`}>
          {collaborationStatus.toUpperCase()}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-text-primary">
              {formatNumber(metrics.followers)}
            </span>
          </div>
          <p className="text-xs text-text-muted">Followers</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-text-primary">
              {metrics.engagement.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-text-muted">Engagement</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-text-primary">
              {formatNumber(metrics.avgLikes)}
            </span>
          </div>
          <p className="text-xs text-text-muted">Avg Likes</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <MessageCircle className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-text-primary">
              {formatNumber(metrics.avgComments)}
            </span>
          </div>
          <p className="text-xs text-text-muted">Avg Comments</p>
        </div>
      </div>

      {/* Category and ROI */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-text-muted bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          {category}
        </span>
        {roi && (
          <div className="flex items-center space-x-1">
            <span className="text-xs text-text-muted">ROI:</span>
            <span className={`text-xs font-medium ${roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {roi > 0 ? '+' : ''}{roi.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Cost and Actions */}
      <div className="flex items-center justify-between">
        {costPerPost && (
          <div className="text-sm">
            <span className="text-text-muted">Cost:</span>
            <span className="font-semibold text-text-primary ml-1">
              ${costPerPost.toLocaleString()}
            </span>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 text-text-muted hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Profile"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button 
            className="p-2 text-text-muted hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default LeadCard;
