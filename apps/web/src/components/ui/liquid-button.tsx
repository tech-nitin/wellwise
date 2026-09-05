"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export function LiquidButton({
  children,
  variant = "primary",
  className,
  ...props
}: LiquidButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (variant === "secondary") {
    return (
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all duration-300 cursor-pointer overflow-hidden border border-[#142B3A]/80 bg-[#F5F0E6] text-[#142B3A] hover:border-[#142B3A] hover:bg-[#DDD2C0]/40 hover:-translate-y-0.5 shadow-2xs hover:shadow-xs select-none",
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all duration-300 cursor-pointer overflow-hidden bg-[#D96B3B] text-white hover:-translate-y-0.5 shadow-xs hover:shadow-md select-none border border-[#D96B3B]/30",
        className
      )}
      {...props}
    >
      {/* Liquid Wave Container */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
        initial={false}
      >
        {/* Animated Liquid Wave rising from bottom */}
        <motion.div
          initial={{ y: "105%" }}
          animate={{ y: isHovered ? "0%" : "105%" }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0 bg-[#A9533D] flex items-start justify-center"
        >
          {/* Wave curvature curve */}
          <div className="w-[140%] h-6 bg-[#A9533D] rounded-t-[100%] -translate-y-2 shrink-0 opacity-90" />
        </motion.div>
      </motion.div>

      {/* Button Content */}
      <span className={cn(
        "relative z-10 flex items-center gap-2 transition-colors duration-200 text-white font-bold"
      )}>
        {children}
      </span>
    </button>
  );
}
