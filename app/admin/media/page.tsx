'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Upload, Trash2, ExternalLink, Image as ImageIcon, FileText, Search } from 'lucide-react';

interface MediaFile {
  name: string;
  id: string;
  updated_at: string;
  metadata: {
    size: number;
    mimetype: string;
  };
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [search, setSearch] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchFiles();
  }, []);

  async function fetchFiles() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .storage
        .from('cms-assets')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (error) throw error;
      setFiles(data as any || []);
    } catch (error: any) {
      toast.error('Failed to load media files');
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cms-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      toast.success('File uploaded successfully');
      fetchFiles();
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const { error } = await supabase.storage
        .from('cms-assets')
        .remove([fileName]);

      if (error) throw error;
      toast.success('File deleted');
      fetchFiles();
    } catch (error: any) {
      toast.error('Failed to delete file');
    }
  };

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage.from('cms-assets').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Manager</h1>
          <p className="text-slate-500">Upload and manage assets for your landing page.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search files..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <div className="relative">
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              onChange={handleUpload}
              disabled={isUploading}
            />
            <Button asChild disabled={isUploading}>
              <label htmlFor="file-upload" className="cursor-pointer gap-2">
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload File
              </label>
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredFiles.map((file) => {
            const isImage = file.metadata.mimetype.startsWith('image/');
            const url = getPublicUrl(file.name);
            
            return (
              <Card key={file.id} className="group overflow-hidden border-slate-200 hover:border-primary/30 transition-all shadow-sm hover:shadow-md">
                <div className="aspect-square bg-slate-50 relative flex items-center justify-center overflow-hidden">
                  {isImage ? (
                    <img src={url} alt={file.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <FileText className="w-12 h-12 text-slate-300" />
                  )}
                  
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      onClick={() => copyToClipboard(url)}
                      title="Copy URL"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      onClick={() => handleDelete(file.name)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium truncate text-slate-700" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase mt-1">
                    {(file.metadata.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {!isLoading && filteredFiles.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No files found</h3>
          <p className="text-slate-500">Upload your first asset to get started.</p>
        </div>
      )}
    </div>
  );
}
