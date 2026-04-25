/**
 * EasyToRent — Premium Splash Screen (Teal/Midnight Navy Cinematic Intro)
 * Extra Large Logo — Orange Brand Text
 */

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

/* ─────────────────────────────────────────────
   CONFIG
───────────────────────────────────────────── */
const BRAND_NAME = "EasyToRent";
const TAGLINE = "Find Your Perfect PG";
const LOADING_MESSAGES = [
  "Finding best PG near you...",
  "Checking availability...",
  "Verifying premium listings...",
  "Preparing your experience...",
];
const STORAGE_KEY = "etr_splash_alt_v1";
const FULL_DURATION = 3200;
const MINIMAL_DURATION = 900;

/* ─────────────────────────────────────────────
   INLINE STYLES (CSS-in-JS)
───────────────────────────────────────────── */
const GLOBAL_STYLES = `
  @keyframes etr-bgDrift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes etr-scanLine {
    0%   { top: -2px; }
    100% { top: 100%; }
  }
  @keyframes etr-glowOrb {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.12); }
  }
  @keyframes etr-dotPop {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
    40%           { transform: scale(1.3); opacity: 1; }
  }
  @keyframes etr-floatBubble {
    0%   { transform: translateY(0) translateX(0); opacity: 0; }
    20%  { opacity: 0.8; }
    100% { transform: translateY(-280px) translateX(var(--etr-dx)); opacity: 0; }
  }
  @keyframes etr-shimmer {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(300%); }
  }
  @keyframes etr-tagIn {
    0%   { opacity: 0; letter-spacing: 0.55em; }
    100% { opacity: 1; letter-spacing: 0.22em; }
  }
  @keyframes etr-lineGrow {
    0%   { width: 0; opacity: 0; }
    100% { width: 80px; opacity: 1; }
  }
  @keyframes etr-ringPulse {
    0%, 100% { opacity: 0.25; transform: scale(1); }
    50%       { opacity: 0.55; transform: scale(1.06); }
  }
  @keyframes etr-ringPulse2 {
    0%, 100% { opacity: 0.12; transform: scale(1); }
    50%       { opacity: 0.32; transform: scale(1.1); }
  }
  @keyframes etr-logoGlow {
    0%, 100% { filter: drop-shadow(0 0 30px rgba(255,100,0,0.4)); }
    50%       { filter: drop-shadow(0 0 60px rgba(255,100,0,0.8)); }
  }
  .etr-bg-drift {
    animation: etr-bgDrift 14s ease infinite;
  }
  .etr-scan-line {
    animation: etr-scanLine 6s linear 1s infinite;
  }
  .etr-orb-1 { animation: etr-glowOrb 5s ease-in-out infinite; }
  .etr-orb-2 { animation: etr-glowOrb 7s ease-in-out 1s infinite; }
  .etr-ring-1 { animation: etr-ringPulse  3.5s ease-in-out 1.2s infinite; }
  .etr-ring-2 { animation: etr-ringPulse2 4s   ease-in-out 1.5s infinite; }
  .etr-tagline { animation: etr-tagIn 1s ease-out 1.9s both; }
  .etr-line    { animation: etr-lineGrow 0.6s ease-out 1.8s both; }
  .etr-dot-1   { animation: etr-dotPop 1.2s ease-in-out 0s   infinite; }
  .etr-dot-2   { animation: etr-dotPop 1.2s ease-in-out 0.2s infinite; }
  .etr-dot-3   { animation: etr-dotPop 1.2s ease-in-out 0.4s infinite; }
  .etr-logo-glow { animation: etr-logoGlow 3s ease-in-out infinite; }
`;

/* ─────────────────────────────────────────────
   FLOATING BUBBLES
───────────────────────────────────────────── */
const Bubbles = () => {
  const items = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => ({
        id: i,
        size: Math.random() * 3 + 1,
        bottom: Math.random() * 30,
        left: Math.random() * 90 + 5,
        dx: (Math.random() - 0.5) * 80,
        opacity: Math.random() * 0.4 + 0.15,
        duration: Math.random() * 10 + 7,
        delay: Math.random() * 8,
      })),
    []
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {items.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            bottom: `${p.bottom}%`,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: `rgba(255,100,0,${p.opacity})`,
            "--etr-dx": `${p.dx}px`,
            animation: `etr-floatBubble ${p.duration}s ease-in ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   LOGO COMPONENT — EXTRA LARGE, CLEAN, NO BOX
───────────────────────────────────────────── */
const LogoDisplay = ({ isReturn }) => {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const rxSpring = useSpring(rotateX, { damping: 25, stiffness: 400 });
  const rySpring = useSpring(rotateY, { damping: 25, stiffness: 400 });

  const onMove = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      rotateY.set(((e.clientX - cx) / rect.width) * 10);
      rotateX.set(((e.clientY - cy) / rect.height) * -10);
    },
    [rotateX, rotateY]
  );
  const onLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Outer glow rings — subtle, behind logo */}
      <div
        className="etr-ring-2"
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          border: "1px solid rgba(255,100,0,0.12)",
          pointerEvents: "none",
        }}
      />
      <div
        className="etr-ring-1"
        style={{
          position: "absolute",
          width: 340,
          height: 340,
          borderRadius: "50%",
          border: "1px solid rgba(255,100,0,0.25)",
          pointerEvents: "none",
        }}
      />

      {/* 3D Logo Container — NO BOX, just logo */}
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ 
          rotateX: rxSpring, 
          rotateY: rySpring, 
          transformStyle: "preserve-3d", 
          perspective: 1000,
          cursor: "pointer",
        }}
        initial={{ scale: 0.65, opacity: 0, filter: "blur(18px)" }}
        animate={{
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          transition: {
            type: "spring",
            stiffness: 220,
            damping: 22,
            delay: isReturn ? 0 : 0.15,
          },
        }}
      >
        {/* Logo Image — Extra Large, Clean, No Background Box */}
        <img 
          src="/ranjeet.png" 
          alt="EasyToRent" 
          className="etr-logo-glow"
          style={{ 
            width: 220,
            height: 220,
            maxWidth: '70vw',
            maxHeight: '70vh',
            objectFit: 'contain',
            display: 'block',
          }} 
        />
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   BRAND TEXT — ORANGE COLOR, letter-by-letter drop from top
───────────────────────────────────────────── */
const BrandText = ({ isReturn }) => {
  const letterVariants = {
    hidden: {
      opacity: 0,
      y: -28,
      rotateX: 80,
      scale: 0.8,
      filter: "blur(8px)",
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.55,
        delay: isReturn ? 0.05 : 0.7 + i * 0.07,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 1,
        perspective: 500,
        marginTop: 32,
      }}
    >
      {BRAND_NAME.split("").map((ch, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterVariants}
          style={{
            display: "inline-block",
            fontSize: "clamp(36px, 7vw, 58px)",
            fontWeight: 800,
            letterSpacing: "-0.01em",
            color: "#FF8C00", // Orange color for all letters
            textShadow: "0 0 20px rgba(255,140,0,0.5)",
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   LOADING INDICATOR
───────────────────────────────────────────── */
const Loader = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.9, duration: 0.5 }}
    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 32 }}
  >
    <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
      {["etr-dot-1", "etr-dot-2", "etr-dot-3"].map((cls, i) => (
        <div
          key={i}
          className={cls}
          style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,140,0,0.8)" }}
        />
      ))}
    </div>
    <motion.p
      key={message}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 0.7, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        color: "rgba(255,255,255,0.45)",
        fontSize: 11.5,
        fontWeight: 300,
        letterSpacing: "0.07em",
        margin: 0,
        height: 16,
      }}
    >
      {message}
    </motion.p>
  </motion.div>
);

/* ─────────────────────────────────────────────
   CINEMATIC BACKGROUND
───────────────────────────────────────────── */
const Background = () => (
  <>
    {/* Base gradient */}
    <div
      className="etr-bg-drift"
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(135deg, #020c18 0%, #071a2e 35%, #062520 65%, #020c18 100%)",
        backgroundSize: "300% 300%",
      }}
    />

    {/* Grid overlay */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.8, delay: 0.3 }}
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "linear-gradient(rgba(255,100,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,100,0,0.04) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    />

    {/* Ambient orbs */}
    <div
      className="etr-orb-1"
      style={{
        position: "absolute",
        top: -60,
        left: -60,
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,100,0,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }}
    />
    <div
      className="etr-orb-2"
      style={{
        position: "absolute",
        bottom: -80,
        right: -40,
        width: 360,
        height: 360,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,80,0,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }}
    />

    {/* Scan line */}
    <div
      className="etr-scan-line"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,100,0,0.3), transparent)",
        zIndex: 2,
        pointerEvents: "none",
      }}
    />

    {/* Vignette */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        boxShadow: "inset 0 0 100px rgba(0,0,0,0.65)",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  </>
);

/* ─────────────────────────────────────────────
   MAIN SPLASH COMPONENT
───────────────────────────────────────────── */
export const SplashScreen = ({ children }) => {
  const [show, setShow] = useState(true);
  const [ready, setReady] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [isReturn, setIsReturn] = useState(false);

  // Inject keyframes once
  useEffect(() => {
    if (document.getElementById("etr-styles")) return;
    const s = document.createElement("style");
    s.id = "etr-styles";
    s.textContent = GLOBAL_STYLES;
    document.head.appendChild(s);
  }, []);

  // Returning user check
  useEffect(() => {
    setIsReturn(sessionStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  // Cycle messages
  useEffect(() => {
    if (!show || isReturn) return;
    const t = setInterval(
      () => setMsgIndex((p) => (p + 1) % LOADING_MESSAGES.length),
      750
    );
    return () => clearInterval(t);
  }, [show, isReturn]);

  // Auto-dismiss
  useEffect(() => {
    if (!show) return;
    const duration = isReturn ? MINIMAL_DURATION : FULL_DURATION;
    const t = setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setShow(false);
      setTimeout(() => setReady(true), 200);
    }, duration);
    return () => clearTimeout(t);
  }, [show, isReturn]);

  return (
    <>
      <AnimatePresence mode="wait">
        {show && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: -12,
              filter: "blur(10px)",
              transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] },
            }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            <Background />
            <Bubbles />

            {/* Main content */}
            <div
              style={{
                position: "relative",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "48px 24px 56px",
                textAlign: "center",
              }}
            >
              {/* Logo — Clean, Large, No Box */}
              <LogoDisplay isReturn={isReturn} />

              {/* Brand Text — ORANGE COLOR */}
              <BrandText isReturn={isReturn} />

              {/* Horizontal accent line */}
              <div
                className="etr-line"
                style={{
                  marginTop: 14,
                  height: 1,
                  background: "linear-gradient(90deg, transparent, rgba(255,140,0,0.7), transparent)",
                  width: 0,
                  opacity: 0,
                }}
              />

              {/* Tagline */}
              <div
                className="etr-tagline"
                style={{
                  marginTop: 10,
                  color: "rgba(255,140,0,0.7)",
                  fontSize: 11,
                  fontWeight: 400,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  opacity: 0,
                }}
              >
                {TAGLINE}
              </div>

              {/* Loader — only for first-time */}
              {!isReturn && (
                <Loader message={LOADING_MESSAGES[msgIndex]} />
              )}

              {/* Bottom pill badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: isReturn ? 0.3 : 1.6, duration: 0.8 }}
                style={{
                  marginTop: 32,
                  padding: "4px 14px",
                  border: "1px solid rgba(255,140,0,0.2)",
                  borderRadius: 20,
                  background: "rgba(255,140,0,0.05)",
                }}
              >
                <span
                  style={{
                    color: "rgba(255,140,0,0.5)",
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  Premium Rental Platform
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* App content reveal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: ready ? 1 : 0,
          y: ready ? 0 : 20,
        }}
        transition={{ duration: 0.9, ease: [0.23, 0.86, 0.38, 0.98], delay: 0.1 }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default SplashScreen;