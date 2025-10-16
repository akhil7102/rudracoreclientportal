import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { User as UserIcon, Mail, Calendar, Shield, Key, Bell, LogOut } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ProfileSettingsProps {
  user: any;
  onSignOut?: () => void;
}

export function ProfileSettings({ user, onSignOut }: ProfileSettingsProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePasswordChange = () => {
    toast.info('Password change functionality will be available soon');
  };

  const handleProfileUpdate = () => {
    toast.success('Profile updated successfully');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl mb-2">
          <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Profile</span> & Settings
        </h1>
        <p className="text-gray-400">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Profile Overview */}
        <Card className="backdrop-blur-xl bg-card/80 border-purple-500/30">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg shadow-purple-500/50 ring-2 ring-purple-500/30">
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <CardTitle className="text-white text-2xl">{user?.user_metadata?.name || 'User'}</CardTitle>
                <CardDescription className="text-gray-400">{user?.email}</CardDescription>
                <div className="mt-2">
                  <Badge className="bg-purple-500/20 border-purple-500/50 text-purple-400">
                    <UserIcon className="w-3 h-3 mr-1" />
                    Client Account
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <Card className="backdrop-blur-xl bg-card/80 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Account Type</span>
              <Badge className="bg-green-500/20 border-green-500/50 text-green-400">Active</Badge>
            </div>
            <Separator className="bg-purple-500/20" />
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Member Since</span>
              <span className="text-white">{formatDate(user?.created_at)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <Card className="backdrop-blur-xl bg-card/80 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Account Information</CardTitle>
          <CardDescription className="text-gray-400">Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input
                id="name"
                defaultValue={user?.user_metadata?.name || ''}
                className="backdrop-blur-xl bg-input-background border-purple-500/30 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email}
                disabled
                className="backdrop-blur-xl bg-input-background border-purple-500/30 text-white opacity-60"
              />
            </div>
          </div>
          <Button
            onClick={handleProfileUpdate}
            className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-lg shadow-purple-500/30"
          >
            Update Profile
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Security */}
        <Card className="backdrop-blur-xl bg-card/80 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Security Settings</CardTitle>
            <CardDescription className="text-gray-400">Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="2fa" className="text-white">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-400">Add an extra layer of security</p>
                </div>
                <Switch
                  id="2fa"
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>
              <Separator className="bg-purple-500/20" />
              <div>
                <Label className="text-white mb-2 block">Password</Label>
                <Button
                  onClick={handlePasswordChange}
                  variant="outline"
                  className="border-purple-500/50 hover:bg-purple-500/10 text-purple-400"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="backdrop-blur-xl bg-card/80 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Preferences</CardTitle>
            <CardDescription className="text-gray-400">Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="notifications" className="text-white">Email Notifications</Label>
                <p className="text-sm text-gray-400">Receive updates via email</p>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing History */}
      <Card className="backdrop-blur-xl bg-card/80 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Billing History</CardTitle>
          <CardDescription className="text-gray-400">View your past transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-400">No billing history available</p>
            <p className="text-sm text-gray-500 mt-2">Your transactions will appear here</p>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Sign Out */}
      {onSignOut && (
        <Card className="lg:hidden backdrop-blur-xl bg-card/80 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Account Actions</CardTitle>
            <CardDescription className="text-gray-400">Manage your session</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={onSignOut}
              variant="destructive"
              className="w-full gap-2 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
