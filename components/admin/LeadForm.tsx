import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface LeadFormProps {
  addItem: (type: string, newItem: any) => void;
  leadData: any[];
}

export const LeadForm: React.FC<LeadFormProps> = ({ addItem, leadData }) => {
  const [formData, setFormData] = useState({
    name: '',
    projects: 0,
    followers: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const maxId = leadData.length > 0 ? Math.max(...leadData.map((i: any) => i.id || 0)) : 0;
    const newLead = {
      ...formData,
      id: maxId + 1,
    };
    addItem('leadData', newLead);
    setFormData({ name: '', projects: 0, followers: '' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Lead</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="projects">Projects</Label>
            <Input
              id="projects"
              type="number"
              value={formData.projects}
              onChange={(e) => setFormData({ ...formData, projects: parseInt(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="followers">Followers</Label>
            <Input
              id="followers"
              value={formData.followers}
              onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
              placeholder="e.g., 1.2M"
              required
            />
          </div>
          <Button type="submit">
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
