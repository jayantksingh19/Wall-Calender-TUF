"use client";
/**
 * HolidayTooltip
 *
 * A fixed-position tooltip that follows the mouse on holiday dots.
 * Rendered at the top of the tree so it escapes any overflow:hidden containers.
 *
 * Props:
 *   tip  {{ label: string, x: number, y: number } | null}
 */
export default function HolidayTooltip({ tip }) {
  if (!tip) return null;

  return (
    <div
      className="wc-tip"
      role="tooltip"
      style={{ top: tip.y + 14, left: tip.x }}
    >
      {tip.label}
    </div>
  );
}
