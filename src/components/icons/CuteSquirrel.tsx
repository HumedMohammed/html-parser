import { motion } from "framer-motion";
import React from "react";

interface CuteSquirrelProps {
  className?: string;
  size?: number;
}

export const CuteSquirrel: React.FC<CuteSquirrelProps> = ({
  className = "",
  size = 32,
}) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.1,
        rotate: [0, -5, 5, -5, 0],
      }}
      transition={{
        duration: 0.6,
        rotate: {
          duration: 0.5,
          ease: "easeInOut",
        },
      }}
      className={`inline-block ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tail */}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          d="M15 75 Q5 65 8 50 Q12 35 25 30 Q35 28 40 35"
          stroke="url(#tailGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Body */}
        <motion.ellipse
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          cx="50"
          cy="65"
          rx="18"
          ry="22"
          fill="url(#bodyGradient)"
        />

        {/* Head */}
        <motion.circle
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          cx="50"
          cy="40"
          r="20"
          fill="url(#headGradient)"
        />

        {/* Ears */}
        <motion.ellipse
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: -30 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          cx="40"
          cy="25"
          rx="6"
          ry="12"
          fill="url(#earGradient)"
          transform-origin="40 25"
        />
        <motion.ellipse
          initial={{ scale: 0, rotate: 45 }}
          animate={{ scale: 1, rotate: 30 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          cx="60"
          cy="25"
          rx="6"
          ry="12"
          fill="url(#earGradient)"
          transform-origin="60 25"
        />

        {/* Inner ears */}
        <ellipse cx="40" cy="27" rx="3" ry="6" fill="#FFB6C1" />
        <ellipse cx="60" cy="27" rx="3" ry="6" fill="#FFB6C1" />

        {/* Eyes */}
        <motion.circle
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          cx="44"
          cy="37"
          r="4"
          fill="#2D3748"
        />
        <motion.circle
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          cx="56"
          cy="37"
          r="4"
          fill="#2D3748"
        />

        {/* Eye highlights */}
        <motion.circle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.8 }}
          cx="45"
          cy="36"
          r="1.5"
          fill="white"
        />
        <motion.circle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.8 }}
          cx="57"
          cy="36"
          r="1.5"
          fill="white"
        />

        {/* Nose */}
        <motion.ellipse
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          cx="50"
          cy="44"
          rx="2"
          ry="1.5"
          fill="#FF69B4"
        />

        {/* Mouth */}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          d="M48 47 Q50 49 52 47"
          stroke="#8B4513"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cheeks */}
        <motion.circle
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 0.3, delay: 1 }}
          cx="38"
          cy="45"
          r="4"
          fill="#FFB6C1"
        />
        <motion.circle
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 0.3, delay: 1 }}
          cx="62"
          cy="45"
          r="4"
          fill="#FFB6C1"
        />

        {/* Arms */}
        <motion.ellipse
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          cx="35"
          cy="58"
          rx="4"
          ry="10"
          fill="url(#bodyGradient)"
          transform="rotate(-20 35 58)"
        />
        <motion.ellipse
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          cx="65"
          cy="58"
          rx="4"
          ry="10"
          fill="url(#bodyGradient)"
          transform="rotate(20 65 58)"
        />

        {/* Paws */}
        <motion.circle
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1.1 }}
          cx="32"
          cy="68"
          r="3"
          fill="#8B4513"
        />
        <motion.circle
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1.1 }}
          cx="68"
          cy="68"
          r="3"
          fill="#8B4513"
        />

        {/* Belly */}
        <motion.ellipse
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          cx="50"
          cy="68"
          rx="10"
          ry="15"
          fill="url(#bellyGradient)"
        />

        {/* Floating hearts */}
        <motion.g
          animate={{
            y: [0, -5, 0],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <path
            d="M75 25 C75 22, 77 20, 80 20 C83 20, 85 22, 85 25 C85 28, 80 33, 80 33 C80 33, 75 28, 75 25 Z"
            fill="#FF69B4"
            opacity="0.8"
          />
        </motion.g>

        <motion.g
          animate={{
            y: [0, -3, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <path
            d="M20 35 C20 33, 21 32, 23 32 C25 32, 26 33, 26 35 C26 37, 23 40, 23 40 C23 40, 20 37, 20 35 Z"
            fill="#FF1493"
            opacity="0.6"
          />
        </motion.g>

        {/* Gradients */}
        <defs>
          <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DEB887" />
            <stop offset="50%" stopColor="#D2B48C" />
            <stop offset="100%" stopColor="#CD853F" />
          </linearGradient>

          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DEB887" />
            <stop offset="100%" stopColor="#D2B48C" />
          </linearGradient>

          <linearGradient
            id="bellyGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#F5DEB3" />
            <stop offset="100%" stopColor="#DEB887" />
          </linearGradient>

          <linearGradient id="tailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="50%" stopColor="#A0522D" />
            <stop offset="100%" stopColor="#CD853F" />
          </linearGradient>

          <linearGradient id="earGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DEB887" />
            <stop offset="100%" stopColor="#D2B48C" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};
