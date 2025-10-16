import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ShoppingCart, CheckCircle, Clock, Plus } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface DashboardHomeProps {
  user: any;
  accessToken: string;
  onNavigate: (page: string) => void;
}

export function DashboardHome({ user, accessToken, onNavigate }: DashboardHomeProps) {
  const [stats, setStats] = useState({
    active: 0,
    completed: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accessToken) {
      fetchStats();
    }
  }, [accessToken]);

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-37c26183/orders/user`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const orders = data.orders || [];
        
        setStats({
          active: orders.filter((o: any) => o.status === 'in-progress').length,
          completed: orders.filter((o: any) => o.status === 'completed').length,
          pending: orders.filter((o: any) => o.status === 'pending').length,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Active Orders',
      value: stats.active,
      icon: ShoppingCart,
      gradient: 'from-purple-500 to-purple-700',
      bgGradient: 'from-purple-500/10 to-purple-700/10',
    },
    {
      title: 'Completed Orders',
      value: stats.completed,
      icon: CheckCircle,
      gradient: 'from-green-500 to-green-700',
      bgGradient: 'from-green-500/10 to-green-700/10',
    },
    {
      title: 'Pending Orders',
      value: stats.pending,
      icon: Clock,
      gradient: 'from-orange-500 to-orange-700',
      bgGradient: 'from-orange-500/10 to-orange-700/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl mb-2">
          Welcome back, <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">{user?.user_metadata?.name || 'User'}</span> 👋
        </h1>
        <p className="text-gray-400">Manage your orders and explore our services</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className={`backdrop-blur-xl bg-gradient-to-br ${stat.bgGradient} border-purple-500/30 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-gray-400">{stat.title}</CardTitle>
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl text-white">{loading ? '...' : stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Action */}
      <Card className="backdrop-blur-xl bg-card/80 border-purple-500/30">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/50">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl mb-2 text-white">Ready to start a new project?</h3>
          <p className="text-gray-400 mb-6">Browse our services and place your order in just a few clicks</p>
          <Button
            onClick={() => onNavigate('services')}
            className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-lg shadow-purple-500/30"
          >
            Browse Services
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
