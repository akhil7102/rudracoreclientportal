import { useState } from 'react';
import { Header } from './Header';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Check, Smartphone, ShieldCheck, QrCode, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { projectId } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { getDeviceType } from '../utils/deviceDetection';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import qrCodeImage from 'figma:asset/7d8cc35a9cd8e4475106f6d84b8a474b63e06979.png';

interface RequestProjectProps {
  user: any;
  accessToken: string;
  onSignOut: () => void;
  onBack: () => void;
  onProfileClick: () => void;
}

const UI_LEVELS = [
  {
    id: 'low',
    name: 'Low Level UI',
    price: 284,
    description: 'Basic layout with minimal detailing.',
    features: ['Clean and simple layout', 'Essential UI components', 'Basic responsive design', 'Standard color schemes'],
    upiLink: 'upi://pay?pa=8019533580@superyes&pn=RudraCore&am=284&cu=INR&tn=Low%20Level%20UI%20Design'
  },
  {
    id: 'medium',
    name: 'Medium Level UI',
    price: 349,
    description: 'Enhanced visuals and better layout quality.',
    features: ['Modern layout design', 'Custom UI components', 'Advanced responsive design', 'Premium color schemes', 'Smooth animations'],
    upiLink: 'upi://pay?pa=8019533580@superyes&pn=RudraCore&am=349&cu=INR&tn=Medium%20Level%20UI%20Design'
  },
  {
    id: 'high',
    name: 'High Level UI',
    price: 429,
    description: 'Premium, high-quality UI with detailed components.',
    features: ['Premium layout design', 'Fully custom components', 'Advanced animations', 'Micro-interactions', 'Custom illustrations', 'Full accessibility support'],
    upiLink: 'upi://pay?pa=8019533580@superyes&pn=RudraCore&am=429&cu=INR&tn=High%20Level%20UI%20Design'
  }
];

export function RequestProject({ user, accessToken, onSignOut, onBack, onProfileClick }: RequestProjectProps) {
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showDeviceAlert, setShowDeviceAlert] = useState(false);
  const [deviceMessage, setDeviceMessage] = useState('');

  const selectedLevelData = UI_LEVELS.find(level => level.id === selectedLevel);

  const handleUPIPayment = () => {
    if (!selectedLevelData) return;

    const deviceType = getDeviceType();
    
    if (deviceType === 'mobile-with-upi') {
      // Mobile with UPI app - redirect directly
      setIsRedirecting(true);
      
      toast.info('Redirecting to UPI payment...', {
        description: `Amount: ₹${selectedLevelData.price}`,
        duration: 3000,
      });

      setTimeout(() => {
        window.location.href = selectedLevelData.upiLink;
        
        setTimeout(() => {
          handleSubmitProject();
        }, 2000);
      }, 1000);
    } else if (deviceType === 'mobile-no-upi') {
      // Mobile without UPI app - show alert then QR code
      setDeviceMessage('No UPI apps have been detected on your mobile. Please click OK to continue paying via QR code.');
      setShowDeviceAlert(true);
    } else {
      // Desktop - show alert then QR code
      setDeviceMessage('You are using a desktop to continue the payment. Please click OK to continue paying via QR code.');
      setShowDeviceAlert(true);
    }
  };

  const handleAlertConfirm = () => {
    setShowDeviceAlert(false);
    setShowQRCode(true);
  };

  const handleSubmitProject = async () => {
    if (!projectName || !description || !selectedLevel) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-37c26183/projects`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            projectName,
            description,
            uiLevel: selectedLevelData?.name,
            price: selectedLevelData?.price,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIsRedirecting(false);
        setStep('success');
      } else {
        console.error('Failed to submit project:', data.error);
        toast.error('Failed to submit project. Please try again.');
        setIsRedirecting(false);
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      toast.error('Failed to submit project. Please try again.');
      setIsRedirecting(false);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen">
        <Header
          userName={user?.user_metadata?.name}
          userEmail={user?.email}
          onSignOut={onSignOut}
          onProfileClick={onProfileClick}
        />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="text-center backdrop-blur-xl bg-card/80 border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
                <CardContent className="pt-12 pb-12">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-cyan-500/20 border border-green-500/50 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                      <Check className="w-10 h-10 text-green-400" />
                    </div>
                  </div>
                  <h2 className="text-3xl mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Project Request Submitted!</h2>
                  <p className="text-gray-400 mb-6">
                    Your project details have been submitted successfully.
                  </p>
                  
                  <div className="bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border border-cyan-500/20 rounded-lg p-6 mb-6 text-left">
                    <h3 className="text-lg mb-4 text-cyan-400">Project Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Project Name:</span>
                        <span className="text-gray-200">{projectName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">UI Level:</span>
                        <span className="text-gray-200">{selectedLevelData?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Amount:</span>
                        <span className="text-purple-400">₹{selectedLevelData?.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-purple-500/30 rounded-lg p-6 mb-8 text-left">
                    <h3 className="text-lg mb-3 text-purple-400">📸 Next Steps - Important!</h3>
                    <div className="space-y-3 text-sm text-gray-300">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full flex items-center justify-center text-xs shadow-lg shadow-cyan-500/30">1</span>
                        <p>Take a screenshot of your UPI payment confirmation from your payment app</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full flex items-center justify-center text-xs shadow-lg shadow-cyan-500/30">2</span>
                        <p>Join our Discord server using the button below</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full flex items-center justify-center text-xs shadow-lg shadow-cyan-500/30">3</span>
                        <p>Raise a ticket in Discord and upload your payment screenshot</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full flex items-center justify-center text-xs shadow-lg shadow-cyan-500/30">4</span>
                        <p>Our team will verify your payment and start working on your project</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      onClick={() => window.open('https://discord.gg/hj3nTUS9CE', '_blank')}
                      size="lg"
                      className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white gap-2 shadow-lg shadow-[#5865F2]/30"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                      Join Discord Server & Raise Ticket
                    </Button>
                    
                    <Button 
                      onClick={onBack} 
                      size="lg"
                      variant="outline"
                      className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="min-h-screen">
        <Header
          userName={user?.user_metadata?.name}
          userEmail={user?.email}
          onSignOut={onSignOut}
          onProfileClick={onProfileClick}
        />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setStep('form')}
              className="mb-6 gap-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <Card className="backdrop-blur-xl bg-card/80 border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
              <CardHeader>
                <CardTitle className="text-cyan-400">Complete Payment via UPI</CardTitle>
                <CardDescription className="text-gray-400">
                  Review your order and pay securely with UPI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border border-cyan-500/20 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg text-cyan-400">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Project:</span>
                      <span className="text-gray-200">{projectName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">UI Level:</span>
                      <span className="text-gray-200">{selectedLevelData?.name}</span>
                    </div>
                    <div className="border-t border-cyan-500/20 pt-3 flex justify-between">
                      <span className="text-gray-200">Total Amount:</span>
                      <span className="text-xl text-purple-400">₹{selectedLevelData?.price}</span>
                    </div>
                  </div>
                </div>

                {!showQRCode ? (
                  <>
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-cyan-500/30 rounded-lg p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <ShieldCheck className="w-6 h-6 text-cyan-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-cyan-400 mb-1">Secure UPI Payment</p>
                          <p className="text-xs text-gray-400">
                            Pay securely using any UPI app - PhonePe, GPay, Paytm, or any other UPI-enabled app.
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 text-xs text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg py-2">
                            <Check className="w-3 h-3" />
                            100% Secure
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 text-xs text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg py-2">
                            <Check className="w-3 h-3" />
                            Instant
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 text-xs text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg py-2">
                            <Check className="w-3 h-3" />
                            All UPI Apps
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleUPIPayment}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-105"
                      size="lg"
                      disabled={isRedirecting || loading}
                    >
                      <Smartphone className="w-5 h-5 mr-2" />
                      {isRedirecting ? 'Redirecting...' : `Pay ₹${selectedLevelData?.price} with UPI`}
                    </Button>

                    <p className="text-xs text-center text-gray-500">
                      You'll be redirected to your UPI app or shown a QR code
                    </p>
                  </>
                ) : (
                  <>
                    {/* QR Code Display */}
                    <div className="bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border border-cyan-500/30 rounded-lg p-8">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 rounded-full mb-4 shadow-lg shadow-cyan-500/30">
                          <QrCode className="w-8 h-8 text-cyan-400" />
                        </div>
                        <h3 className="text-lg text-cyan-400 mb-2">Scan QR Code to Pay</h3>
                        <p className="text-sm text-gray-400">Use any UPI app to scan and pay</p>
                      </div>
                      
                      {/* Actual QR Code Image */}
                      <div className="bg-white p-4 rounded-lg mx-auto w-fit shadow-xl">
                        <img 
                          src={qrCodeImage} 
                          alt="UPI Payment QR Code" 
                          className="w-64 h-64 object-contain"
                        />
                      </div>

                      <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                        <p className="text-sm text-cyan-400 mb-2">Payment Details:</p>
                        <div className="space-y-1 text-xs text-gray-400">
                          <p>UPI ID: <span className="text-gray-200">8019533580@superyes</span></p>
                          <p>Name: <span className="text-gray-200">RudraCore</span></p>
                          <p>Amount: <span className="text-purple-400">₹{selectedLevelData?.price}</span></p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Manual Confirmation */}
                <div className="border-t border-cyan-500/20 pt-6">
                  <p className="text-sm text-gray-400 mb-3 text-center">
                    {showQRCode ? 'Completed the payment?' : 'Already completed the payment?'}
                  </p>
                  <Button
                    onClick={handleSubmitProject}
                    variant="outline"
                    className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                    disabled={loading || isRedirecting}
                  >
                    {loading ? 'Submitting...' : 'I have completed the payment'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Device Alert Dialog */}
        <AlertDialog open={showDeviceAlert} onOpenChange={setShowDeviceAlert}>
          <AlertDialogContent className="backdrop-blur-xl bg-card/95 border-cyan-500/30">
            <AlertDialogHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  {deviceMessage.includes('desktop') ? (
                    <Monitor className="w-8 h-8 text-cyan-400" />
                  ) : (
                    <Smartphone className="w-8 h-8 text-cyan-400" />
                  )}
                </div>
              </div>
              <AlertDialogTitle className="text-center text-cyan-400">Payment Method</AlertDialogTitle>
              <AlertDialogDescription className="text-center text-gray-400">
                {deviceMessage}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction 
                onClick={handleAlertConfirm}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg shadow-cyan-500/30"
              >
                OK, Show QR Code
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Redirecting Overlay */}
        <AnimatePresence>
          {isRedirecting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="backdrop-blur-xl bg-card/90 border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/20 p-8 max-w-md mx-4"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg shadow-cyan-500/50">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl text-cyan-400 mb-2">
                    Redirecting to UPI Payment
                  </h3>
                  <p className="text-gray-400">
                    Please complete your payment in your UPI app...
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        userName={user?.user_metadata?.name}
        userEmail={user?.email}
        onSignOut={onSignOut}
        onProfileClick={onProfileClick}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 gap-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <Card className="mb-8 backdrop-blur-xl bg-card/80 border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
            <CardHeader>
              <CardTitle className="text-cyan-400">Request a New Project</CardTitle>
              <CardDescription className="text-gray-400">
                Fill in the details below to submit your project request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="projectName" className="text-gray-300">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="Enter your project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-input-background border-cyan-500/30 text-foreground placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">Project Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project requirements in detail..."
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-input-background border-cyan-500/30 text-foreground placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/30"
                />
              </div>
            </CardContent>
          </Card>

          <div className="mb-8">
            <h3 className="text-xl mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Choose UI Design Level</h3>
            <div className="grid gap-6 md:grid-cols-3">
              {UI_LEVELS.map((level) => (
                <motion.div
                  key={level.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`cursor-pointer transition-all backdrop-blur-xl bg-card/80 border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/20 ${
                      selectedLevel === level.id
                        ? 'ring-2 ring-cyan-500 shadow-2xl shadow-cyan-500/30'
                        : ''
                    }`}
                    onClick={() => setSelectedLevel(level.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg text-gray-200">{level.name}</CardTitle>
                        {selectedLevel === level.id && (
                          <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="text-3xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">₹{level.price}</div>
                      <CardDescription className="text-gray-400">{level.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {level.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={() => setStep('payment')}
              disabled={!projectName || !description || !selectedLevel}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg shadow-cyan-500/30"
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}