// src/components/pwa/SplashScreen.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "Finding best PG near you...",
    "Checking availability near Chandigarh University...",
    "Verifying premium listings...",
    "Preparing your experience...",
  ];

  useEffect(() => {
    // Progress animation
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 3, 100));
    }, 80);

    // Rotate messages
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % messages.length);
    }, 800);

    // Auto complete after 2.8 seconds
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2800);

    return () => {
      clearInterval(interval);
      clearInterval(messageInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", padding: "24px" }}>
        {/* Logo Animation */}
        <motion.img
          src="/ranjeet.png"
          alt="EasyToRent"
          initial={{ scale: 0.6, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          style={{
            width: "160px",
            height: "160px",
            objectFit: "contain",
            marginBottom: "32px",
          }}
        />

        {/* Brand Name - Netflix Style */}
        <div style={{ marginBottom: "48px" }}>
          {"EasyToRent".split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: index * 0.07, duration: 0.5 }}
              style={{
                display: "inline-block",
                fontSize: "clamp(32px, 8vw, 54px)",
                fontWeight: 800,
                background: "linear-gradient(135deg, #FFFFFF 0%, #FF8C00 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "12px",
            letterSpacing: "2px",
            marginBottom: "32px",
            textTransform: "uppercase",
          }}
        >
          Find Your Perfect PG
        </motion.p>

        {/* Progress Bar */}
        <div
          style={{
            width: "200px",
            height: "2px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "2px",
            overflow: "hidden",
            margin: "0 auto 16px",
          }}
        >
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #f97316, #FF8C00)",
              borderRadius: "2px",
            }}
          />
        </div>

        {/* Loading Message */}
        <motion.p
          key={messages[messageIndex]}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 0.6, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "11px",
          }}
        >
          {messages[messageIndex]}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default SplashScreen;