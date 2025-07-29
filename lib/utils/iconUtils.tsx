import React from 'react';
import { 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  TrendingUp,
  BarChart2,
  Users,
  Eye,
  Heart,
  MessageSquare,
  Share,
  Target
} from 'lucide-react';

// Icon mapping from string names to components
const iconMap = {
  'thumbs-up': ThumbsUp,
  'message-circle': MessageCircle,
  'message-square': MessageSquare,
  'share': Share,
  'share2': Share2,
  'trending-up': TrendingUp,
  'bar-chart-2': BarChart2,
  'users': Users,
  'eye': Eye,
  'heart': Heart,
  'target': Target,
} as const;

export type IconName = keyof typeof iconMap;

interface IconProps {
  className?: string;
}

export const getIconComponent = (iconName: string, className: string = "w-6 h-6 text-blue-500"): React.ReactNode => {
  const IconComponent = iconMap[iconName as IconName];
  
  if (!IconComponent) {
    // Fallback to a default icon if the icon name is not found
    return <TrendingUp className={className} />;
  }
  
  return <IconComponent className={className} />;
};
