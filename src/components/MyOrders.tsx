import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';
import { Eye, Package } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface MyOrdersProps {
  accessToken: string;
}

export function MyOrders({ accessToken }: MyOrdersProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (accessToken) {
      fetchOrders();
    }
  }, [accessToken]);

  const fetchOrders = async () => {
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
        setOrders(data.orders || []);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string; color: string }> = {
      pending: { variant: 'secondary', label: 'Pending', color: 'text-yellow-500' },
      'in-progress': { variant: 'default', label: 'In Progress', color: 'text-blue-500' },
      completed: { variant: 'default', label: 'Completed', color: 'text-green-500' },
      cancelled: { variant: 'destructive', label: 'Cancelled', color: 'text-red-500' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    if (filter === 'active') return order.status === 'in-progress' || order.status === 'pending';
    if (filter === 'completed') return order.status === 'completed';
    if (filter === 'cancelled') return order.status === 'cancelled';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl mb-2">
          My <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Orders</span>
        </h1>
        <p className="text-gray-400">Track and manage your service orders</p>
      </div>

      {/* Tabs */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="bg-purple-500/10 border border-purple-500/30">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {loading ? (
            <Card className="backdrop-blur-xl bg-card/80 border-purple-500/30">
              <CardContent className="p-12 text-center">
                <p className="text-gray-400">Loading your orders...</p>
              </CardContent>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <Card className="backdrop-blur-xl bg-card/80 border-purple-500/30">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-700/20 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl mb-2 text-white">No orders found</h3>
                <p className="text-gray-400">You haven't placed any orders yet</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="backdrop-blur-xl bg-card/80 border-purple-500/30">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-purple-500/30 hover:bg-purple-500/5">
                        <TableHead className="text-gray-400">Order ID</TableHead>
                        <TableHead className="text-gray-400">Service</TableHead>
                        <TableHead className="text-gray-400">Price</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                        <TableHead className="text-gray-400">Date</TableHead>
                        <TableHead className="text-gray-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow
                          key={order.id}
                          className="border-purple-500/30 hover:bg-purple-500/5"
                        >
                          <TableCell className="text-white">
                            #{order.id.slice(-8).toUpperCase()}
                          </TableCell>
                          <TableCell className="text-white">{order.serviceName}</TableCell>
                          <TableCell className="text-purple-400">₹{order.price}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => setSelectedOrder(order)}
                              variant="ghost"
                              size="sm"
                              className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="backdrop-blur-xl bg-popover border-purple-500/30 max-w-2xl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white text-2xl">
                  Order #{selectedOrder.id.slice(-8).toUpperCase()}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Order details and progress information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Service</p>
                    <p className="text-white">{selectedOrder.serviceName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Price</p>
                    <p className="text-white">₹{selectedOrder.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Status</p>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Order Date</p>
                    <p className="text-white">
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {selectedOrder.customNotes && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Custom Notes</p>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                      <p className="text-white text-sm">{selectedOrder.customNotes}</p>
                    </div>
                  </div>
                )}

                {selectedOrder.status !== 'cancelled' && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-purple-400">{selectedOrder.progress || 0}%</span>
                    </div>
                    <Progress value={selectedOrder.progress || 0} className="hidden" />
                  </div>
                )}

                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <p className="text-sm text-gray-400 text-center">
                    Need help? Contact our support team for assistance with your order.
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
