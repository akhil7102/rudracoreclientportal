import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface RegisterProps {
  onRegisterSuccess: () => void;
  onSwitchToSignIn: () => void;
}

export function Register({ onRegisterSuccess, onSwitchToSignIn }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-37c26183/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password, name }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      onRegisterSuccess();
    } catch (err: any) {
      console.error('Registration error:', err);
      setError('Failed to register. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md backdrop-blur-xl bg-card/80 border-purple-500/30 shadow-2xl shadow-purple-500/10">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/50">
              <span className="text-white text-xl">R</span>
            </div>
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Create Your Account</CardTitle>
          <CardDescription className="text-gray-400">
            Join RudraCore today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-input-background border-purple-500/30 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input-background border-purple-500/30 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-input-background border-purple-500/30 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/30"
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 p-3 rounded-md">
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-lg shadow-purple-500/30 transition-all" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
            
            <div className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignIn}
                className="text-purple-400 hover:text-purple-300 hover:underline transition-colors"
              >
                Sign In
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}