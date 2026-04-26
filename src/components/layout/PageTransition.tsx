import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

/**
 * PageTransition
 *
 * Wraps route content with a smooth fade/slide animation.
 * Requires framer-motion. If not installed, installs as:
 *   npm install framer-motion
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

