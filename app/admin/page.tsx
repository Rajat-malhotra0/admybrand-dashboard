"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Save, Trash2, Edit, RefreshCw, Moon, Sun } from "lucide-react";
import { usePlatformData } from "@/hooks/usePlatformData";
import { dashboardApi } from "@/lib/api/dashboard";
import { useTheme } from "@/contexts/ThemeContext";
import { CampaignStatsForm } from "@/components/admin/CampaignStatsForm";
import { InfluencerForm } from "@/components/admin/InfluencerForm";

// Fallback data structure for when database is unavailable
const fallbackData = {
  campaignStats: [],
  influencerData: [],
  demographicsData: [],
  interestsData: [],
};

export default function AdminPage() {
  const { theme, toggleTheme } = useTheme();
  const [data, setData] = useState(fallbackData);
  const [selectedPlatform, setSelectedPlatform] = useState("LinkedIn");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>("");
  const [useBackend, setUseBackend] = useState(true);
  
  // Influencer tab state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadDataType, setUploadDataType] = useState('influencers');
  
  // Fetch platform data from backend
  const { data: platformData, isLoading, error, refresh } = usePlatformData(selectedPlatform, useBackend);
  const platforms = ["LinkedIn", "Instagram", "Facebook"];
  
  // Get current data - use backend data if available, otherwise use local data
  const getCurrentData = () => {
    if (useBackend && platformData && !error) {
      return platformData;
    }
    return data;
  };
  
  const currentData = getCurrentData();
  
  // Simple follower count parser
  const parseFollowerCount = (followers: string): number => {
    const num = parseFloat(followers.replace(/[^0-9.]/g, ''));
    if (followers.includes('M')) return num * 1000000;
    if (followers.includes('K')) return num * 1000;
    return num;
  };

  // Derived values for influencer tab - use current data (backend if available)
  const sortedInfluencers = useMemo(() => {
    const sorted = [...currentData.influencerData].sort((a, b) => {
      // Sort by follower count using parseFollowerCount for accurate parsing
      const aFollowers = parseFollowerCount(a.followers);
      const bFollowers = parseFollowerCount(b.followers);
      
      if (sortOrder === "asc") {
        return aFollowers - bFollowers;
      } else {
        return bFollowers - aFollowers;
      }
    });
    return sorted;
  }, [currentData.influencerData, sortOrder]);
  
  const paginatedInfluencers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedInfluencers.slice(startIndex, endIndex);
  }, [sortedInfluencers, currentPage, itemsPerPage]);

  // Save data to localStorage (you can replace this with API calls)
  const saveData = () => {
    localStorage.setItem("dashboardData", JSON.stringify(data));
    alert("Data saved successfully!");
  };

  // Load data from localStorage
  const loadData = () => {
    const savedData = localStorage.getItem("dashboardData");
    if (savedData) {
      setData(JSON.parse(savedData));
      alert("Data loaded successfully!");
    }
  };

  // Reset to initial data
  const resetData = () => {
    setData(fallbackData);
    localStorage.removeItem("dashboardData");
    alert("Data reset to defaults!");
  };

  // Generic update function
  const updateItem = (type: string, id: number | string, updatedItem: any) => {
    setData(prev => ({
      ...prev,
      [type]: prev[type as keyof typeof prev].map((item: any, index: number) => 
        (item.id ? item.id === id : index === id) ? updatedItem : item
      ),
    }));
  };

  // Generic add function
  const addItem = async (type: string, newItem: any) => {
    if (useBackend && type === "influencerData") {
      try {
        // Add to backend
        await dashboardApi.createInfluencer({
          name: newItem.name,
          projects: newItem.projects,
          followers: newItem.followers,
          platform: selectedPlatform
        });
        // Refresh platform data to get updated list
        refresh();
        alert(`${newItem.name} added successfully to backend!`);
      } catch (error) {
        console.error('Error adding influencer to backend:', error);
        alert('Failed to add to backend. Added to local data instead.');
      }
    }
    
    // Always update local state as well
    setData(prev => ({
      ...prev,
      [type]: [...prev[type as keyof typeof prev], newItem],
    }));
  };

  // Generic delete function
  const deleteItem = async (type: string, id: number | string) => {
    if (useBackend && type === "influencerData" && typeof id === 'number') {
      try {
        // Delete from backend
        await dashboardApi.deleteInfluencer(id);
        // Refresh platform data to get updated list
        refresh();
        alert('Influencer deleted successfully from backend!');
      } catch (error) {
        console.error('Error deleting influencer from backend:', error);
        alert('Failed to delete from backend. Removed from local data instead.');
      }
    }
    
    // Always update local state as well
    setData(prev => ({
      ...prev,
      [type]: prev[type as keyof typeof prev].filter((item: any, index: number) => 
        item.id ? item.id !== id : index !== id
      ),
    }));
  };

  // File upload handlers
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dataType', uploadDataType);
    formData.append('platform', selectedPlatform);

    try {
      const response = await fetch('http://localhost:5000/api/upload/file', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(`Upload successful: ${result.message}`);
        if (useBackend) {
          refresh(); // Refresh data if using backend
        }
      } else {
        alert(`Upload error: ${result.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + (error.message || 'Network error'));
    } finally {
      setUploading(false);
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const downloadTemplate = async (dataType: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/upload/template/${dataType}`);
      const template = await response.json();
      
      if (response.ok) {
        // Create and download CSV template
        const blob = new Blob([template.csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${dataType}_template.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to download template');
      }
    } catch (error) {
      console.error('Template download failed:', error);
      alert('Template download failed');
    }
  };


  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-foreground">Dashboard Admin</h1>
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-4 w-4" />
                  Light
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  Dark
                </>
              )}
            </Button>
          </div>
          
          {/* Platform Selection and Backend Toggle */}
          <div className="mb-6 p-4 bg-card rounded-lg border border-border">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useBackend"
                  checked={useBackend}
                  onChange={(e) => setUseBackend(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="useBackend">Use Backend Data</Label>
              </div>
              
              {useBackend && (
                <div className="flex items-center space-x-2">
                  <Label>Platform:</Label>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="px-3 py-1 border border-border rounded bg-background text-foreground"
                  >
                    {platforms.map(platform => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {useBackend && (
                <Button onClick={() => refresh()} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              )}
              
              {useBackend && isLoading && (
                <span className="text-sm text-muted-foreground">Loading...</span>
              )}
              
              {useBackend && error && (
                <span className="text-sm text-destructive">Error loading data</span>
              )}
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button onClick={saveData} variant="default">
              <Save className="w-4 h-4 mr-2" />
              Save Data
            </Button>
            <Button onClick={loadData} variant="outline">
              Load Data
            </Button>
            <Button onClick={resetData} variant="destructive">
              Reset Data
            </Button>
          </div>
        </div>

        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stats">Campaign Stats</TabsTrigger>
            <TabsTrigger value="influencers">Influencers</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="interests">Interests</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Form */}
              <CampaignStatsForm addItem={addItem} campaignStats={currentData.campaignStats} />

              {/* Current Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Campaign Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentData.campaignStats.map((stat: any) => (
                      <div key={stat.id} className="flex items-center justify-between p-3 bg-muted rounded">
                        <div>
                          <h4 className="font-medium text-foreground">{stat.title}</h4>
                          <p className="text-sm text-muted-foreground">{stat.value} - {stat.description}</p>
                        </div>
                        <Button
                          onClick={() => deleteItem("campaignStats", stat.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="influencers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Form */}
              <InfluencerForm addItem={addItem} influencerData={currentData.influencerData} />

              {/* Current Influencers */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Influencers</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Pagination and Sort Controls */}
                  <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
<div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Items per page:</label>
                      <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                          setItemsPerPage(parseInt(value));
                          setCurrentPage(1); // Reset to first page
                        }}>
                        <SelectTrigger aria-label="Items per page">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
<div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Follower count:</label>
                      <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>                
                        <SelectTrigger aria-label="Follower sort order">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="desc">High → Low</SelectItem>
                          <SelectItem value="asc">Low → High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {paginatedInfluencers.map((influencer) => (
                      <div key={influencer.id} className="flex items-center justify-between p-3 bg-muted rounded">
                        <div>
                          <h4 className="font-medium text-foreground">{influencer.name}</h4>
                          <p className="text-sm text-muted-foreground">{influencer.projects} projects - {influencer.followers} followers</p>
                        </div>
                        <Button
                          onClick={() => deleteItem("influencerData", influencer.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination Controls */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing {Math.min((currentPage - 1) * itemsPerPage + 1, sortedInfluencers.length)} to {Math.min(currentPage * itemsPerPage, sortedInfluencers.length)} of {sortedInfluencers.length} influencers
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        variant="outline"
                        size="sm"
                      >
                        Previous
                      </Button>
                      <span className="px-3 py-1 text-sm">
                        Page {currentPage} of {Math.ceil(sortedInfluencers.length / itemsPerPage)}
                      </span>
                      <Button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(sortedInfluencers.length / itemsPerPage)))}
                        disabled={currentPage >= Math.ceil(sortedInfluencers.length / itemsPerPage)}
                        variant="outline"
                        size="sm"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Demographics Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentData.demographicsData.map((demo: any, index: number) => (
                    <div key={index} className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded">
                      <div>
                        <Label>Age Group</Label>
                        <Input
                          value={demo.label}
                          onChange={(e) => {
                            const updated = {...demo, label: e.target.value};
                            updateItem("demographicsData", index, updated);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Male</Label>
                        <Input
                          type="number"
                          value={demo.male}
                          onChange={(e) => {
                            const updated = {...demo, male: parseInt(e.target.value)};
                            updateItem("demographicsData", index, updated);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Female</Label>
                        <Input
                          type="number"
                          value={demo.female}
                          onChange={(e) => {
                            const updated = {...demo, female: parseInt(e.target.value)};
                            updateItem("demographicsData", index, updated);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Interests Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentData.interestsData.map((interest: any, index: number) => (
                    <div key={index} className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                      <div>
                        <Label>Interest</Label>
                        <Input
                          value={interest.label}
                          onChange={(e) => {
                            const updated = {...interest, label: e.target.value};
                            updateItem("interestsData", index, updated);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Value</Label>
                        <Input
                          type="number"
                          value={interest.value}
                          onChange={(e) => {
                            const updated = {...interest, value: parseInt(e.target.value)};
                            updateItem("interestsData", index, updated);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* File Upload Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>File Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="upload-data-type">Data Type</Label>
                  <Select value={uploadDataType} onValueChange={setUploadDataType}>
                    <SelectTrigger id="upload-data-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="influencers">Influencers</SelectItem>
                      <SelectItem value="campaigns">Campaigns</SelectItem>
                      <SelectItem value="demographics">Demographics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="file-upload">File (CSV/JSON)</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button 
                    onClick={uploadFile} 
                    disabled={!file || uploading}
                    variant="default"
                  >
                    {uploading ? 'Uploading...' : 'Upload File'}
                  </Button>
                  <Button 
                    onClick={() => downloadTemplate(uploadDataType)}
                    variant="outline"
                  >
                    Download Template
                  </Button>
                </div>
              </div>
              
              {file && (
                <div className="p-3 bg-blue-50 rounded border">
                  <p className="text-sm text-blue-800">
                    Selected file: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
              )}
              
              <div className="text-sm text-gray-600">
                <p><strong>Supported formats:</strong> CSV, JSON</p>
                <p><strong>Max file size:</strong> 10MB</p>
                <p>Download a template to see the expected format for each data type.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export/Import JSON */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Raw Data (JSON)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={JSON.stringify(data, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setData(parsed);
                } catch (error) {
                  // Invalid JSON, ignore
                }
              }}
              className="min-h-[200px] font-mono text-sm"
            />
            <p className="text-sm text-gray-600 mt-2">
              Edit the JSON directly or use the forms above. Data is automatically saved to localStorage.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
