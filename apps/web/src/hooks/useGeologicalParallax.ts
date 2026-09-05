"use client";

import { useEffect, useRef } from "react";

interface UseGeologicalParallaxOptions {
  enabled?: boolean;
}

/**
 * Centralized geological atmospheric parallax controller.
 * Tracks mouse cursor and window scroll, smoothly damping coordinates via requestAnimationFrame.
 * Sets CSS custom properties on the target element or documentElement for GPU-accelerated translate3d.
 * Respects prefers-reduced-motion.
 */
export function useGeologicalParallax<T extends HTMLElement = HTMLDivElement>(
  options: UseGeologicalParallaxOptions = {}
) {
  const containerRef = useRef<T | null>(null);
  const { enabled = true } = options;

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Zero out any offsets
      const target = containerRef.current || document.documentElement;
      target.style.setProperty("--geo-shift-fore-x", "0px");
      target.style.setProperty("--geo-shift-fore-y", "0px");
      target.style.setProperty("--geo-shift-mid-x", "0px");
      target.style.setProperty("--geo-shift-mid-y", "0px");
      target.style.setProperty("--geo-shift-deep-x", "0px");
      target.style.setProperty("--geo-shift-deep-y", "0px");
      target.style.setProperty("--mouse-shift-x", "0px");
      target.style.setProperty("--mouse-shift-y", "0px");
      return;
    }

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    let targetScrollProgress = 0;
    let currentScrollProgress = 0;

    let animationFrameId: number;
    let isRunning = true;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalized from -1 to 1 across viewport
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      const scrollableHeight = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      targetScrollProgress = window.scrollY / scrollableHeight;
    };

    const updateLoop = () => {
      if (!isRunning) return;

      // Smooth lerp damping (0.05 for fluid, organic drift)
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.08;

      // Foreground: 12-15px mouse shift + ~24px scroll shift
      const foreX = currentMouseX * 14;
      const foreY = currentMouseY * 14 + (currentScrollProgress - 0.5) * 24;

      // Middle: 8-10px mouse shift + ~16px scroll shift
      const midX = currentMouseX * 9;
      const midY = currentMouseY * 9 + (currentScrollProgress - 0.5) * 16;

      // Deep: 3-5px mouse shift + ~8px scroll shift
      const deepX = currentMouseX * 4;
      const deepY = currentMouseY * 4 + (currentScrollProgress - 0.5) * 8;

      const targetEl = containerRef.current || document.documentElement;

      targetEl.style.setProperty("--mouse-shift-x", `${foreX.toFixed(2)}px`);
      targetEl.style.setProperty("--mouse-shift-y", `${foreY.toFixed(2)}px`);
      targetEl.style.setProperty("--geo-shift-fore-x", `${foreX.toFixed(2)}px`);
      targetEl.style.setProperty("--geo-shift-fore-y", `${foreY.toFixed(2)}px`);
      targetEl.style.setProperty("--geo-shift-mid-x", `${midX.toFixed(2)}px`);
      targetEl.style.setProperty("--geo-shift-mid-y", `${midY.toFixed(2)}px`);
      targetEl.style.setProperty("--geo-shift-deep-x", `${deepX.toFixed(2)}px`);
      targetEl.style.setProperty("--geo-shift-deep-y", `${deepY.toFixed(2)}px`);

      animationFrameId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial trigger
    handleScroll();
    animationFrameId = requestAnimationFrame(updateLoop);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [enabled]);

  return containerRef;
}
