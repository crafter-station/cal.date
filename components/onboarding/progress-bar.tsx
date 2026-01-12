"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-stone-400">
          Profile completion
        </span>
        <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-stone-200" />
          <span className="text-xs tabular-nums text-stone-600">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-stone-100">
        <div
          className="h-full rounded-full bg-stone-800 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
