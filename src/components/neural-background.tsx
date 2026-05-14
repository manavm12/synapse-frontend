"use client";

import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

export function NeuralBackground() {
  const init = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="neural-bg"
      className="absolute inset-0 z-0"
      init={init}
      options={{
        fullScreen: false,
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        particles: {
          number: { value: 60, density: { enable: true } },
          color: { value: ["#7c3aed", "#22d3ee", "#a78bfa"] },
          opacity: {
            value: { min: 0.2, max: 0.6 },
            animation: { enable: true, speed: 0.5, sync: false },
          },
          size: {
            value: { min: 1, max: 3 },
          },
          links: {
            enable: true,
            color: "#7c3aed",
            opacity: 0.15,
            distance: 160,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.6,
            direction: "none",
            random: true,
            outModes: { default: "bounce" },
          },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "grab" },
          },
          modes: {
            grab: { distance: 140, links: { opacity: 0.4 } },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
