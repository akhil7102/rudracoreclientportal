import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { MessageSquare, Send } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface SupportProps {
  accessToken: string;
}

export function Support({ accessToken }: SupportProps) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    message: '',
    contact: '', // email or mobile number
  });

  useEffect(() => {
    if (accessToken) {
      fetchTickets();
    }
  }, [accessToken]);

  const fetchTickets = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-37c26183/tickets/user`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.category || !formData.message || !formData.contact) {
      toast.error('Please fill in all fields including email/mobile number');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-37c26183/tickets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success('Support ticket created successfully!');
        setFormData({ subject: '', category: '', message: '', contact: '' });
        fetchTickets();
      } else {
        toast.error('Failed to create ticket');
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string; color: string }> = {
      open: { variant: 'default', label: 'Open', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
      'in-progress': { variant: 'default', label: 'In Progress', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' },
      resolved: { variant: 'default', label: 'Resolved', color: 'bg-green-500/20 text-green-400 border-green-500/50' },
      closed: { variant: 'secondary', label: 'Closed', color: 'bg-gray-500/20 text-gray-400 border-gray-500/50' },
    };

    const config = statusConfig[status] || statusConfig.open;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl mb-2">
          <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Support</span> Center
        </h1>
        <p className="text-gray-400">Get help with your orders and services</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Create Ticket Form */}
        <Card className="backdrop-blur-xl bg-card/80 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Create Support Ticket</CardTitle>
            <CardDescription className="text-gray-400">
              Submit a ticket and our team will get back to you soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-white">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your issue"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="backdrop-blur-xl bg-input-background border-purple-500/30 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-white">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="backdrop-blur-xl bg-input-background border-purple-500/30 text-white">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-xl bg-popover border-purple-500/30">
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="order">Order Update</SelectItem>
                    <SelectItem value="payment">Payment Issue</SelectItem>
                    <SelectItem value="general">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact" className="text-white">
                  Email or Mobile Number <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="contact"
                  placeholder="your.email@example.com or +91XXXXXXXXXX"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="backdrop-blur-xl bg-input-background border-purple-500/30 text-white placeholder:text-gray-500"
                  required
                />
                <p className="text-xs text-gray-400">We'll use this to contact you regarding your ticket</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-white">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="min-h-[120px] backdrop-blur-xl bg-input-background border-purple-500/30 text-white placeholder:text-gray-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-lg shadow-purple-500/30"
                disabled={submitting}
              >
                {submitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Ticket
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Previous Tickets */}
        <Card className="backdrop-blur-xl bg-card/80 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Your Tickets</CardTitle>
            <CardDescription className="text-gray-400">
              View and track your support tickets
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Loading tickets...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-700/20 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-gray-400">No tickets yet</p>
                <p className="text-sm text-gray-500 mt-2">Your submitted tickets will appear here</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white">{ticket.subject}</h4>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{ticket.message}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-purple-400 capitalize">{ticket.category}</span>
                      <span className="text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
