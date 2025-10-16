import { useState, useEffect } from 'react';
import { SignIn } from './components/SignIn';
import { Register } from './components/Register';
import { Sidebar } from './components/Sidebar';
import { MobileHeader } from './components/MobileHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DashboardHome } from './components/DashboardHome';
import { Services } from './components/Services';
import { OrderForm } from './components/OrderForm';
import { MyOrders } from './components/MyOrders';
import { Support } from './components/Support';
import { ProfileSettings } from './components/ProfileSettings';
import { NeonBackground } from './components/NeonBackground';
import { supabase } from './utils/supabase/client';
import { Toaster } from './components/ui/sonner';

type Page = 'signin' | 'register' | 'dashboard' | 'services' | 'order-form' | 'my-orders' | 'support' | 'profile';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('signin');
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<any>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (session && session.user) {
        setUser(session.user);
        setAccessToken(session.access_token);
        setCurrentPage('dashboard');
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignInSuccess = (token: string, userData: any) => {
    setAccessToken(token);
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleRegisterSuccess = () => {
    setCurrentPage('signin');
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAccessToken('');
      setCurrentPage('signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handlePlaceOrder = (service: any) => {
    setSelectedService(service);
    setCurrentPage('order-form');
  };

  const handleOrderComplete = () => {
    setCurrentPage('my-orders');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <NeonBackground />
        <div className="text-center relative z-10">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/50">
            <span className="text-white text-xl">R</span>
          </div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Auth pages (no sidebar)
  if (currentPage === 'signin' || currentPage === 'register') {
    return (
      <>
        <NeonBackground />
        {currentPage === 'signin' && (
          <SignIn
            onSignInSuccess={handleSignInSuccess}
            onSwitchToRegister={() => setCurrentPage('register')}
          />
        )}
        {currentPage === 'register' && (
          <Register
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToSignIn={() => setCurrentPage('signin')}
          />
        )}
        <Toaster />
      </>
    );
  }

  // Authenticated pages (with sidebar)
  return (
    <>
      <NeonBackground />
      <div className="min-h-screen">
        {/* Desktop Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onSignOut={handleSignOut}
          userName={user?.user_metadata?.name}
        />
        
        {/* Mobile Header */}
        <MobileHeader />
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
        
        <div className="lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto">
            {currentPage === 'dashboard' && (
              <DashboardHome
                user={user}
                accessToken={accessToken}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'services' && (
              <Services onPlaceOrder={handlePlaceOrder} />
            )}

            {currentPage === 'order-form' && selectedService && (
              <OrderForm
                service={selectedService}
                accessToken={accessToken}
                onBack={() => setCurrentPage('services')}
                onComplete={handleOrderComplete}
              />
            )}

            {currentPage === 'my-orders' && (
              <MyOrders accessToken={accessToken} />
            )}

            {currentPage === 'support' && (
              <Support accessToken={accessToken} />
            )}

            {currentPage === 'profile' && (
              <ProfileSettings user={user} onSignOut={handleSignOut} />
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
