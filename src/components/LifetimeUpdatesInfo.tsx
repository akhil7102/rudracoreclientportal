import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { CheckCircle, Zap, Lock, Wrench, Star } from 'lucide-react';

interface LifetimeUpdatesInfoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LifetimeUpdatesInfo({ open, onOpenChange }: LifetimeUpdatesInfoProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-xl bg-popover border-purple-500/30 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">What is Lifetime Updates?</DialogTitle>
          <DialogDescription className="text-gray-400">
            Lifetime updates mean that once you purchase a product or service, you'll continue to receive all future updates, improvements, and new features without paying anything extra—ever.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <h3 className="text-lg text-white mb-4">Why Choose Lifetime Subscription?</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-1">💡 One-Time Payment</h4>
                  <p className="text-sm text-gray-400">Pay once, use forever. No renewal fees.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-1">🚀 Continuous Upgrades</h4>
                  <p className="text-sm text-gray-400">Always get access to the latest versions and enhancements.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-1">🔒 Better Value</h4>
                  <p className="text-sm text-gray-400">Save long-term compared to monthly or yearly plans.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-1">🛠️ Full Support Access</h4>
                  <p className="text-sm text-gray-400">Enjoy priority support and new tools as soon as they drop.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-1">🌟 Future-Proof Investment</h4>
                  <p className="text-sm text-gray-400">You stay ahead with every innovation RudraCore rolls out.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-purple-500/20 to-purple-700/20 border border-purple-500/50 rounded-lg">
            <p className="text-sm text-center text-white">
              <strong>In short:</strong> A lifetime subscription means you're in for the long run—<strong>max value, zero recurring cost.</strong>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
