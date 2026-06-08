"use client";

import type { PointerEvent, ReactNode } from "react";

export function InteractiveHero({ children }: { children: ReactNode }) {
  function updateGradient(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.min(100, Math.max(0, ((event.clientY - bounds.top) / bounds.height) * 100));
    const shiftX = ((x - 50) / 50) * 22;
    const shiftY = ((y - 50) / 50) * 18;
    const counterShiftX = shiftX * -0.45;
    const counterShiftY = shiftY * -0.45;
    const deskShiftX = shiftX * 0.16;
    const deskShiftY = shiftY * 0.14;

    event.currentTarget.style.setProperty("--hero-x", `${x.toFixed(2)}%`);
    event.currentTarget.style.setProperty("--hero-y", `${y.toFixed(2)}%`);
    event.currentTarget.style.setProperty("--hero-shift-x", `${shiftX.toFixed(2)}px`);
    event.currentTarget.style.setProperty("--hero-shift-y", `${shiftY.toFixed(2)}px`);
    event.currentTarget.style.setProperty("--hero-counter-shift-x", `${counterShiftX.toFixed(2)}px`);
    event.currentTarget.style.setProperty("--hero-counter-shift-y", `${counterShiftY.toFixed(2)}px`);
    event.currentTarget.style.setProperty("--desk-shift-x", `${deskShiftX.toFixed(2)}px`);
    event.currentTarget.style.setProperty("--desk-shift-y", `${deskShiftY.toFixed(2)}px`);
    event.currentTarget.style.setProperty("--hero-saturation", "1.19");
    event.currentTarget.style.setProperty("--hero-sheen-opacity", "0.84");
    event.currentTarget.style.setProperty("--hero-film-opacity", "0.54");
  }

  function resetGradient(event: PointerEvent<HTMLElement>) {
    event.currentTarget.style.setProperty("--hero-x", "50%");
    event.currentTarget.style.setProperty("--hero-y", "46%");
    event.currentTarget.style.setProperty("--hero-shift-x", "0px");
    event.currentTarget.style.setProperty("--hero-shift-y", "0px");
    event.currentTarget.style.setProperty("--hero-counter-shift-x", "0px");
    event.currentTarget.style.setProperty("--hero-counter-shift-y", "0px");
    event.currentTarget.style.setProperty("--desk-shift-x", "0px");
    event.currentTarget.style.setProperty("--desk-shift-y", "0px");
    event.currentTarget.style.setProperty("--hero-saturation", "1.05");
    event.currentTarget.style.setProperty("--hero-sheen-opacity", "0.66");
    event.currentTarget.style.setProperty("--hero-film-opacity", "0.42");
  }

  return (
    <section
      className="landingHero"
      onPointerEnter={updateGradient}
      onPointerMove={updateGradient}
      onPointerLeave={resetGradient}
    >
      {children}
    </section>
  );
}
