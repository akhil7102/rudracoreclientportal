export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Check for mobile devices
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
}

export function hasUPIApp(): boolean {
  if (typeof window === 'undefined') return false;
  
  // For mobile devices, we can't reliably detect if UPI app is installed
  // But we can check if it's Android or iOS which typically have UPI apps
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
  
  // Return true for Android (common UPI apps), false for iOS and others
  return isAndroid;
}

export function getDeviceType(): 'mobile-with-upi' | 'mobile-no-upi' | 'desktop' {
  if (!isMobileDevice()) {
    return 'desktop';
  }
  
  if (hasUPIApp()) {
    return 'mobile-with-upi';
  }
  
  return 'mobile-no-upi';
}
