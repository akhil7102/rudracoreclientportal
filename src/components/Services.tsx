import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Code, ShoppingBag, MessageSquare, Bot, Smartphone, LayoutDashboard, Puzzle, ArrowRight, Info, HelpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { LifetimeUpdatesInfo } from './LifetimeUpdatesInfo';
import { useState } from 'react';

interface ServicesProps {
  onPlaceOrder: (service: any) => void;
}

export function Services({ onPlaceOrder }: ServicesProps) {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showLifetimeInfo, setShowLifetimeInfo] = useState(false);

  const services = [
    {
      id: 'fullstack-web',
      title: 'Full Stack Web Development',
      description: 'Build fast, modern, and responsive websites.',
      icon: Code,
      price: 249,
      lifetimePrice: 499,
      gradient: 'from-blue-500 to-blue-700',
      details: 'Get a fully responsive, modern website built with the latest technologies. Includes mobile optimization, SEO-friendly structure, and fast loading speeds.',
    },
    {
      id: 'minecraft-store',
      title: 'Minecraft Store Development',
      description: 'Create custom stores to sell ranks, keys, and in-game items.',
      icon: ShoppingBag,
      price: 129,
      lifetimePrice: 399,
      gradient: 'from-green-500 to-green-700',
      details: 'Custom-designed online store for your Minecraft server. Integrated payment systems, automated delivery, and beautiful modern UI.',
    },
    {
      id: 'discord-server',
      title: 'Discord Server Development',
      description: 'Fully structured community or brand servers.',
      icon: MessageSquare,
      price: 89,
      lifetimePrice: 189,
      gradient: 'from-indigo-500 to-indigo-700',
      details: 'Complete Discord server setup with organized channels, roles, permissions, and custom branding. Perfect for communities and brands.',
    },
    {
      id: 'discord-bot',
      title: 'Discord Bot Development',
      description: 'Smart, scalable bots for moderation, automation, and engagement.',
      icon: Bot,
      price: 169,
      lifetimePrice: 399,
      gradient: 'from-purple-500 to-purple-700',
      details: 'Custom Discord bots with moderation tools, automation features, custom commands, and engaging interactive elements.',
    },
    {
      id: 'app-dev',
      title: 'App Development',
      description: 'Android & desktop apps built for simplicity and speed.',
      icon: Smartphone,
      price: 299,
      lifetimePrice: 499,
      gradient: 'from-pink-500 to-pink-700',
      details: 'Native Android and desktop applications with modern UI, optimized performance, and seamless user experience.',
    },
    {
      id: 'admin-dashboard',
      title: 'Admin Dashboards',
      description: 'Powerful admin panels to manage your data and analytics.',
      icon: LayoutDashboard,
      price: 159,
      lifetimePrice: 269,
      gradient: 'from-orange-500 to-orange-700',
      details: 'Comprehensive admin dashboard with data visualization, analytics, user management, and customizable modules.',
    },
    {
      id: 'minecraft-plugin',
      title: 'Minecraft Plugin Development',
      description: 'Custom-coded plugins tailored for your server.',
      icon: Puzzle,
      price: 199,
      lifetimePrice: 399,
      gradient: 'from-teal-500 to-teal-700',
      details: 'Tailored Minecraft plugins with custom features, optimized performance, and full documentation.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl mb-2">
            Our <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Services</span>
          </h1>
          <p className="text-gray-400">Explore our range of digital services tailored for your needs</p>
        </div>
        <Button
          onClick={() => setShowLifetimeInfo(true)}
          variant="outline"
          className="border-purple-500/50 hover:bg-purple-500/10 text-purple-400 gap-2"
        >
          <HelpCircle className="w-4 h-4" />
          What is Lifetime Updates?
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Card
              key={service.id}
              className="backdrop-blur-xl bg-card/80 border-purple-500/30 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all group"
            >
              <CardHeader>
                <div className={`w-14 h-14 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-white">{service.title}</CardTitle>
                <CardDescription className="text-gray-400">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl text-white">₹{service.price}</span>
                    <span className="text-gray-400 text-sm">one-time</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>🕒 Lifetime updates: <span className="text-purple-400">₹{service.lifetimePrice}</span></span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowLifetimeInfo(true);
                      }}
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <HelpCircle className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => onPlaceOrder(service)}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-lg shadow-purple-500/30"
                  >
                    Order Now
                  </Button>
                  <Button
                    onClick={() => setSelectedService(service)}
                    variant="outline"
                    className="border-purple-500/50 hover:bg-purple-500/10 text-purple-400"
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lifetime Updates Info */}
      <LifetimeUpdatesInfo
        open={showLifetimeInfo}
        onOpenChange={setShowLifetimeInfo}
      />

      {/* Service Details Modal */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="backdrop-blur-xl bg-popover border-purple-500/30">
          {selectedService && (
            <>
              <DialogHeader>
                <div className={`w-14 h-14 bg-gradient-to-br ${selectedService.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  {(() => {
                    const Icon = selectedService.icon;
                    return <Icon className="w-7 h-7 text-white" />;
                  })()}
                </div>
                <DialogTitle className="text-white">{selectedService.title}</DialogTitle>
                <DialogDescription className="text-gray-400">
                  {selectedService.details}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl text-white">₹{selectedService.price}</span>
                    <span className="text-gray-400">one-time payment</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Lifetime updates available for ₹{selectedService.lifetimePrice}
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setSelectedService(null);
                    onPlaceOrder(selectedService);
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-lg shadow-purple-500/30"
                >
                  Place Order <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
