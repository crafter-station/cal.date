"use client";

import { cn } from "@/lib/utils";
import { THEMES, type ThemeId } from "@/lib/themes";
import { Check } from "lucide-react";

interface ThemePickerProps {
  value: ThemeId;
  onChange: (theme: ThemeId) => void;
  className?: string;
}

export function ThemePicker({ value, onChange, className }: ThemePickerProps) {
  const themes = Object.values(THEMES);

  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3", className)}>
      {themes.map((theme) => {
        const isSelected = value === theme.id;
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onChange(theme.id as ThemeId)}
            className={cn(
              "group relative flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all duration-200",
              isSelected
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border hover:border-primary/30 hover:bg-muted/50"
            )}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex gap-1">
                {theme.preview.map((color, i) => (
                  <div
                    key={i}
                    className="h-5 w-5 rounded-full shadow-sm ring-1 ring-black/5"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              {isSelected && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{theme.name}</p>
              <p className="text-xs text-muted-foreground">{theme.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
