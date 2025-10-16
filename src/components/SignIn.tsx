import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { supabase } from '../utils/supabase/client';

interface SignInProps {
  onSignInSuccess: (accessToken: string, user: any) => void;
  onSwitchToRegister: () => void;
}

export function SignIn({ onSignInSuccess, onSwitchToRegister }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        onSignInSuccess(data.session.access_token, data.user);
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError('Failed to sign in. Please try again.');
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
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Welcome to RudraCore</CardTitle>
          <CardDescription className="text-gray-400">
            Sign in to your client portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
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
                className="bg-input-background border-purple-500/30 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/30"
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 p-3 rounded-md">
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-lg shadow-purple-500/30 transition-all" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <div className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-purple-400 hover:text-purple-300 hover:underline transition-colors"
              >
                Register
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}