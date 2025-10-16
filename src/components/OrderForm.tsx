import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, ArrowRight, Check, Upload, Sparkles, Smartphone, Info, ShieldCheck } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import confetti from 'canvas-confetti';
import { getDeviceType } from '../utils/deviceDetection';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from './ui/alert-dialog';
import { LifetimeUpdatesInfo } from './LifetimeUpdatesInfo';
import qrCodeImage from 'figma:asset/7d8cc35a9cd8e4475106f6d84b8a474b63e06979.png';

interface OrderFormProps {
  service: any;
  accessToken: string;
  onBack: () => void;
  onComplete: () => void;
}

export function OrderForm({ service, accessToken, onBack, onComplete }: OrderFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customNotes: '',
    lifetimeUpdates: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [showLifetimeInfo, setShowLifetimeInfo] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showDeviceAlert, setShowDeviceAlert] = useState(false);
  const [deviceMessage, setDeviceMessage] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'initiate' | 'processing'>('initiate');
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const totalPrice = formData.lifetimeUpdates ? service.lifetimePrice : service.price;
  
  // Create UPI link
  const upiLink = `upi://pay?pa=8019533580@superyes&pn=RudraCore&am=${totalPrice}&cu=INR&tn=${encodeURIComponent(service.title)}`;

  const handleUPIPayment = () => {
    const deviceType = getDeviceType();
    
    if (deviceType === 'mobile-with-upi') {
      // Mobile with UPI app - redirect directly
      setIsRedirecting(true);
      setPaymentStep('processing');
      
      toast.info('Redirecting to UPI payment...', {
        description: `Amount: ₹${totalPrice}`,
        duration: 3000,
      });

      setTimeout(() => {
        window.location.href = upiLink;
        
        setTimeout(() => {
          setIsRedirecting(false);
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

  const handleDeviceAlertConfirm = () => {
    setShowDeviceAlert(false);
    setShowQRCode(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-37c26183/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            serviceId: service.id,
            serviceName: service.title,
            price: totalPrice,
            customNotes: formData.customNotes,
            lifetimeUpdates: formData.lifetimeUpdates,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        toast.success('Order placed successfully!');
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        toast.error(data.error || 'Failed to place order');
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
      setSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl text-white mb-2">Service Selected</h3>
        <p className="text-gray-400">Review your selected service</p>
      </div>

      <Card className="backdrop-blur-xl bg-purple-500/10 border-purple-500/30">
        <CardHeader>
          <div className={`w-14 h-14 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
            {(() => {
              const Icon = service.icon;
              return <Icon className="w-7 h-7 text-white" />;
            })()}
          </div>
          <CardTitle className="text-white">{service.title}</CardTitle>
          <CardDescription className="text-gray-400">{service.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl text-white">₹{service.price}</span>
            <span className="text-gray-400">base price</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={() => setStep(2)}
          className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-lg shadow-purple-500/30"
        >
          Continue <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl text-white mb-2">Custom Requirements</h3>
        <p className="text-gray-400">Add any custom notes or requirements</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-white">Custom Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Tell us about any specific requirements, features, or preferences..."
            value={formData.customNotes}
            onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
            className="min-h-[120px] backdrop-blur-xl bg-input-background border-purple-500/30 text-white placeholder:text-gray-500"
          />
        </div>

        <div className="flex items-center space-x-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <Checkbox
            id="lifetime"
            checked={formData.lifetimeUpdates}
            onCheckedChange={(checked) => setFormData({ ...formData, lifetimeUpdates: checked as boolean })}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Label htmlFor="lifetime" className="text-white cursor-pointer">
                Add Lifetime Updates
              </Label>
              <button
                type="button"
                onClick={() => setShowLifetimeInfo(true)}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Get ongoing support and updates for ₹{service.lifetimePrice - service.price} more
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => setStep(1)}
          variant="outline"
          className="border-purple-500/50 hover:bg-purple-500/10 text-purple-400"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button
          onClick={() => setStep(3)}
          className="flex-1 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-lg shadow-purple-500/30"
        >
          Continue <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl text-white mb-2">Review & Confirm Order</h3>
        <p className="text-gray-400">Review your order summary before proceeding to payment</p>
      </div>

      <Card className="backdrop-blur-xl bg-card/80 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Service</span>
              <span className="text-white">{service.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Base Price</span>
              <span className="text-white">₹{service.price}</span>
            </div>
            {formData.lifetimeUpdates && (
              <div className="flex justify-between">
                <span className="text-gray-400">Lifetime Updates</span>
                <span className="text-white">₹{service.lifetimePrice - service.price}</span>
              </div>
            )}
            {formData.customNotes && (
              <div className="pt-3 border-t border-purple-500/30">
                <span className="text-gray-400 block mb-2">Custom Notes</span>
                <p className="text-sm text-white bg-purple-500/10 p-3 rounded-lg">
                  {formData.customNotes}
                </p>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-purple-500/30">
              <span className="text-white">Total Amount</span>
              <span className="text-2xl text-purple-400">₹{totalPrice}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={() => setStep(2)}
          variant="outline"
          className="border-purple-500/50 hover:bg-purple-500/10 text-purple-400"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button
          onClick={() => setStep(4)}
          className="flex-1 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-lg shadow-purple-500/30"
        >
          Proceed to Payment <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl text-white mb-2">Complete Payment via UPI</h3>
        <p className="text-gray-400">Pay securely with UPI to confirm your order</p>
      </div>

      <Card className="backdrop-blur-xl bg-card/80 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Payment Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Service</span>
              <span className="text-white">{service.title}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-purple-500/30">
              <span className="text-white">Total Amount</span>
              <span className="text-2xl text-purple-400">₹{totalPrice}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {!showQRCode && paymentStep === 'initiate' && (
        <>
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-purple-400 mt-0.5" />
              <div>
                <p className="text-sm text-purple-400 mb-1">Secure UPI Payment</p>
                <p className="text-xs text-gray-400">
                  Pay securely using any UPI app - PhonePe, GPay, Paytm, or any other UPI-enabled app.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleUPIPayment}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105"
            size="lg"
            disabled={isRedirecting}
          >
            <Smartphone className="w-5 h-5 mr-2" />
            {isRedirecting ? 'Redirecting...' : `Pay ₹${totalPrice} with UPI`}
          </Button>

          <p className="text-xs text-center text-gray-500">
            You'll be redirected to your UPI app or shown a QR code
          </p>
        </>
      )}

      {showQRCode && (
        <div className="space-y-6">
          <Card className="backdrop-blur-xl bg-card/80 border-purple-500/30">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/50">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg text-purple-400 mb-2">Scan QR Code to Pay</h3>
                <p className="text-sm text-gray-400">Use any UPI app to scan and pay</p>
              </div>
              
              <div className="mb-6">
                <div className="bg-white p-4 rounded-lg mx-auto w-fit shadow-xl">
                  <img 
                    src={qrCodeImage} 
                    alt="UPI Payment QR Code" 
                    className="w-64 h-64 object-contain"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <p className="text-sm text-purple-400 mb-2">Payment Details:</p>
                <div className="space-y-1 text-xs text-gray-400">
                  <p>UPI ID: <span className="text-gray-200">8019533580@superyes</span></p>
                  <p>Name: <span className="text-gray-200">RudraCore</span></p>
                  <p>Amount: <span className="text-purple-400">₹{totalPrice}</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="border-t border-purple-500/20 pt-6">
        <p className="text-sm text-gray-400 mb-3 text-center">
          {showQRCode ? 'Completed the payment?' : 'Already completed the payment?'}
        </p>
        <Button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white shadow-lg shadow-green-500/30"
          size="lg"
          disabled={submitting || isRedirecting}
        >
          {submitting ? 'Submitting...' : 'I have completed the payment'}
        </Button>
      </div>

      {!showQRCode && (
        <Button
          onClick={() => setStep(3)}
          variant="outline"
          className="w-full border-purple-500/50 hover:bg-purple-500/10 text-purple-400"
          disabled={submitting || isRedirecting}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      )}
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl">
              Place <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Order</span>
            </h1>
            <p className="text-gray-400">Step {step} of 4</p>
          </div>
        </div>

        {/* Steps */}
        <Card className="backdrop-blur-xl bg-card/80 border-purple-500/30">
          <CardContent className="p-8">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
          </CardContent>
        </Card>
      </div>

      {/* Lifetime Updates Info Dialog */}
      <LifetimeUpdatesInfo
        open={showLifetimeInfo}
        onOpenChange={setShowLifetimeInfo}
      />

      {/* Device Alert Dialog */}
      <AlertDialog open={showDeviceAlert} onOpenChange={setShowDeviceAlert}>
        <AlertDialogContent className="backdrop-blur-xl bg-popover border-purple-500/30">
          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-purple-500/50">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-purple-400">Payment Method</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-gray-400">
            {deviceMessage}
          </AlertDialogDescription>
          <div className="flex justify-center mt-4">
            <AlertDialogAction
              onClick={handleDeviceAlertConfirm}
              className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white"
            >
              OK
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Redirecting Alert */}
      <AlertDialog open={isRedirecting && paymentStep === 'processing'}>
        <AlertDialogContent className="backdrop-blur-xl bg-popover border-purple-500/30">
          <div className="flex flex-col items-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-purple-500/50 animate-pulse">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl text-purple-400 mb-2">
              Redirecting to UPI Payment
            </h3>
            <p className="text-gray-400">
              Please complete your payment in your UPI app...
            </p>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
