import { Header } from './Header';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ArrowLeft, Mail, User as UserIcon, Calendar, Shield, LogOut } from 'lucide-react';

interface ProfileProps {
  user: any;
  accessToken: string;
  onSignOut: () => void;
  onBack: () => void;
}

export function Profile({ user, accessToken, onSignOut, onBack }: ProfileProps) {
  const isAdmin = false; // Removed admin functionality - user panel only
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      <Header
        userName={user?.user_metadata?.name}
        userEmail={user?.email}
        onSignOut={onSignOut}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 gap-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <div className="space-y-6">
            {/* Profile Header */}
            <Card className="backdrop-blur-xl bg-card/80 border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-500/30">
                    <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
                      <UserIcon className="w-10 h-10 text-cyan-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{user?.user_metadata?.name || 'User'}</CardTitle>
                    <CardDescription className="text-base mt-1 text-gray-400">{user?.email}</CardDescription>
                    <div className="mt-2">
                      <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/50 text-cyan-400">
                        <UserIcon className="w-3 h-3 mr-1" />
                        Client
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Account Information */}
            <Card className="backdrop-blur-xl bg-card/80 border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
              <CardHeader>
                <CardTitle className="text-cyan-400">Account Information</CardTitle>
                <CardDescription className="text-gray-400">Your account details and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Full Name</p>
                    <p className="text-gray-200">{user?.user_metadata?.name || 'Not set'}</p>
                  </div>
                </div>

                <Separator className="bg-cyan-500/20" />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Email Address</p>
                    <p className="text-gray-200">{user?.email}</p>
                  </div>
                </div>

                <Separator className="bg-cyan-500/20" />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Account Created</p>
                    <p className="text-gray-200">{formatDate(user?.created_at)}</p>
                  </div>
                </div>

                <Separator className="bg-cyan-500/20" />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Account Type</p>
                    <p className="text-gray-200">Client</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="backdrop-blur-xl bg-card/80 border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
              <CardHeader>
                <CardTitle className="text-cyan-400">Account Actions</CardTitle>
                <CardDescription className="text-gray-400">Manage your account</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={onSignOut}
                  className="w-full gap-2 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 shadow-lg shadow-red-500/20"
                  size="lg"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}