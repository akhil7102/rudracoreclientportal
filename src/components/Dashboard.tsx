import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { FolderOpen, Plus } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Project {
  id: string;
  projectName: string;
  description: string;
  uiLevel: string;
  price: number;
  status: string;
  progress: number;
  createdAt: string;
}

interface DashboardProps {
  user: any;
  accessToken: string;
  onSignOut: () => void;
  onRequestProject: () => void;
  onProfileClick: () => void;
}

export function Dashboard({ user, accessToken, onSignOut, onRequestProject, onProfileClick }: DashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accessToken) {
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-37c26183/projects/user`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        setProjects(data.projects || []);
      } else {
        console.error('Failed to fetch projects:', data.error);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string }> = {
      pending: { variant: 'secondary', label: 'Pending' },
      'in-progress': { variant: 'default', label: 'In Progress' },
      completed: { variant: 'default', label: 'Completed' },
      declined: { variant: 'destructive', label: 'Declined' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen">
      <Header
        userName={user?.user_metadata?.name}
        userEmail={user?.email}
        onSignOut={onSignOut}
        onProfileClick={onProfileClick}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">My Projects</h1>
            <p className="text-gray-400">Manage and track your project requests</p>
          </div>
          <Button onClick={onRequestProject} className="gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg shadow-cyan-500/30">
            <Plus className="w-4 h-4" />
            Request New Project
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading your projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <Card className="text-center py-12 backdrop-blur-xl bg-card/80 border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full flex items-center justify-center">
                  <FolderOpen className="w-8 h-8 text-cyan-400" />
                </div>
              </div>
              <h3 className="text-xl mb-2 text-gray-200">You have no requested projects yet.</h3>
              <p className="text-gray-400 mb-6">
                Start by requesting your first project and we'll get back to you soon.
              </p>
              <Button onClick={onRequestProject} className="gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg shadow-cyan-500/30">
                <Plus className="w-4 h-4" />
                Request a New Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="backdrop-blur-xl bg-card/80 border-cyan-500/30 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-gray-200">{project.projectName}</CardTitle>
                    {getStatusBadge(project.status)}
                  </div>
                  <CardDescription className="line-clamp-2 text-gray-400">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">UI Level:</span>
                    <span className="text-cyan-400">{project.uiLevel}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-purple-400">₹{project.price}</span>
                  </div>
                  {project.status !== 'declined' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Progress:</span>
                        <span className="text-cyan-400">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="hidden" />
                    </div>
                  )}
                  <div className="text-xs text-gray-500 pt-2 border-t border-cyan-500/20">
                    Requested on {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}