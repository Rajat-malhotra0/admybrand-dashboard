import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface CampaignStatsFormProps {
  addItem: (type: string, newItem: any) => void;
  campaignStats: any[];
}

export const CampaignStatsForm: React.FC<CampaignStatsFormProps> = ({ addItem, campaignStats }) => {
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    icon: 'TrendingUp',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const maxId = campaignStats.length > 0 ? Math.max(...campaignStats.map((s: any) => s.id || 0)) : 0;
    const newStat = {
      ...formData,
      id: maxId + 1,
    };
    addItem('campaignStats', newStat);
    setFormData({ title: '', value: '', icon: 'TrendingUp', description: '' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Campaign Stat</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="icon">Icon</Label>
            <select
              id="icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full p-2 border border-border rounded bg-background text-foreground"
            >
              <option value="TrendingUp">TrendingUp</option>
              <option value="Users">Users</option>
              <option value="Eye">Eye</option>
              <option value="Target">Target</option>
            </select>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <Button type="submit">
            <Plus className="w-4 h-4 mr-2" />
            Add Stat
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
