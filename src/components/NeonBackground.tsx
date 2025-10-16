import { motion } from 'motion/react';

export function NeonBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0B001A]">
      {/* Gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B001A] via-[#1a0033] to-[#0B001A]" />
      
      {/* Animated grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(108, 31, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(108, 31, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(108, 31, 255, 0.4) 0%, transparent 70%)'
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, transparent 70%)'
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 left-1/2 w-72 h-72 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)'
        }}
        animate={{
          x: [0, 60, 0],
          y: [0, -60, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Scan line effect */}
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30"
        animate={{
          y: ['0vh', '100vh']
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}
