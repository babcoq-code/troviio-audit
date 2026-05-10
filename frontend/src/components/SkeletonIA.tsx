"use client";

import * as React from "react";

/* ── Variantes ───────────────────────────────────────── */

export function SkeletonLine({
  width = "100%",
  height = 16,
  className = "",
}: {
  width?: string | number;
  height?: number;
  className?: string;
}): React.JSX.Element {
  return (
    <div
      aria-hidden="true"
      className={`shimmer rounded-md ${className}`}
      style={{ width, height, backgroundColor: "rgba(255,255,255,0.06)" }}
    />
  );
}

export function SkeletonCard({
  width = "100%",
  height = 200,
  className = "",
}: {
  width?: string | number;
  height?: number;
  className?: string;
}): React.JSX.Element {
  return (
    <div
      aria-hidden="true"
      className={`shimmer rounded-2xl ${className}`}
      style={{ width, height, backgroundColor: "rgba(255,255,255,0.06)" }}
    />
  );
}

export function SkeletonProductCard({
  className = "",
}: {
  className?: string;
}): React.JSX.Element {
  return (
    <div
      aria-hidden="true"
      className={`rounded-2xl border overflow-hidden ${className}`}
      style={{
        borderColor: "var(--border)",
        backgroundColor: "rgba(255,255,255,0.03)",
      }}
    >
      {/* Image placeholder */}
      <div
        className="shimmer"
        style={{
          aspectRatio: "4/3",
          backgroundColor: "rgba(255,255,255,0.05)",
        }}
      />
      {/* Content */}
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div
              className="shimmer rounded-md"
              style={{
                width: "40%",
                height: 12,
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
            />
            <div
              className="shimmer rounded-md"
              style={{
                width: "80%",
                height: 18,
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
            />
          </div>
          {/* Score circle skeleton */}
          <div
            className="shimmer rounded-full shrink-0"
            style={{
              width: 40,
              height: 40,
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          />
        </div>
        {/* Reasons */}
        <div className="space-y-2">
          <div
            className="shimmer rounded-md"
            style={{
              width: "90%",
              height: 14,
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          />
          <div
            className="shimmer rounded-md"
            style={{
              width: "75%",
              height: 14,
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          />
          <div
            className="shimmer rounded-md"
            style={{
              width: "60%",
              height: 14,
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          />
        </div>
        {/* Price */}
        <div
          className="shimmer rounded-md"
          style={{
            width: "35%",
            height: 24,
            backgroundColor: "rgba(255,255,255,0.06)",
          }}
        />
        {/* Button */}
        <div
          className="shimmer rounded-full"
          style={{
            width: "100%",
            height: 44,
            backgroundColor: "rgba(255,255,255,0.06)",
          }}
        />
      </div>
    </div>
  );
}
