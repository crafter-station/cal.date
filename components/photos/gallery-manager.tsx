"use client";

import { useState, useCallback, useTransition } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Plus, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { compressGalleryImage } from "@/lib/utils/compress-image";

interface Photo {
  id: string;
  url: string;
}

interface OptimisticPhoto extends Photo {
  isOptimistic?: boolean;
  status?: "uploading" | "success" | "error";
}

interface GalleryManagerProps {
  photos: Photo[];
  onAdd: (photo: Photo) => void;
  onRemove: (id: string) => void;
  maxPhotos?: number;
  className?: string;
}

export function GalleryManager({
  photos,
  onAdd,
  onRemove,
  maxPhotos = 6,
  className,
}: GalleryManagerProps) {
  const [optimisticPhotos, setOptimisticPhotos] = useState<OptimisticPhoto[]>([]);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();

  const allPhotos: OptimisticPhoto[] = [
    ...photos.filter(p => !removingIds.has(p.id)),
    ...optimisticPhotos,
  ];

  const uploadFile = async (file: File, tempId: string, previewUrl: string) => {
    try {
      const compressedFile = await compressGalleryImage(file);
      
      const formData = new FormData();
      formData.append("file", compressedFile);

      const response = await fetch("/api/photos/gallery", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const { photo } = await response.json();

      setOptimisticPhotos(prev => 
        prev.map(p => p.id === tempId ? { ...p, status: "success" } : p)
      );

      setTimeout(() => {
        setOptimisticPhotos(prev => prev.filter(p => p.id !== tempId));
        startTransition(() => {
          onAdd(photo);
        });
      }, 500);
    } catch {
      setOptimisticPhotos(prev => 
        prev.map(p => p.id === tempId ? { ...p, status: "error" } : p)
      );
      setTimeout(() => {
        setOptimisticPhotos(prev => prev.filter(p => p.id !== tempId));
      }, 2000);
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (allPhotos.length >= maxPhotos) return;
      
      const file = acceptedFiles[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        const tempId = `temp-${Date.now()}`;
        
        setOptimisticPhotos(prev => [
          ...prev,
          { id: tempId, url: previewUrl, isOptimistic: true, status: "uploading" }
        ]);
        
        uploadFile(file, tempId, previewUrl);
      }
    },
    [allPhotos.length, maxPhotos]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    disabled: allPhotos.length >= maxPhotos,
  });

  const handleRemove = async (id: string) => {
    const photoToRemove = photos.find(p => p.id === id);
    if (!photoToRemove) return;

    setRemovingIds(prev => new Set(prev).add(id));

    try {
      const response = await fetch(`/api/photos/gallery?id=${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        startTransition(() => {
          onRemove(id);
        });
      } else {
        setRemovingIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    } catch {
      setRemovingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
    
    setRemovingIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const canAddMore = allPhotos.length < maxPhotos;
  const placeholderCount = Math.max(0, 6 - allPhotos.length - (canAddMore ? 1 : 0));

  return (
    <div className={cn("grid grid-cols-3 gap-3", className)}>
      {allPhotos.map((photo) => (
        <div
          key={photo.id}
          className={cn(
            "group relative aspect-square overflow-hidden rounded-xl bg-neutral-100 transition-all duration-200",
            photo.status === "error" && "ring-2 ring-red-500",
            removingIds.has(photo.id) && "scale-95 opacity-50"
          )}
        >
          <Image
            src={photo.url}
            alt="Gallery photo"
            fill
            className={cn(
              "object-cover transition-opacity",
              photo.status === "uploading" && "opacity-70"
            )}
            unoptimized
          />
          
          {photo.status === "uploading" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          )}

          {photo.status === "success" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 animate-in fade-in duration-200">
              <Check className="h-6 w-6 text-white" />
            </div>
          )}

          {!photo.isOptimistic && !removingIds.has(photo.id) && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute right-2 top-2 h-7 w-7 rounded-full opacity-0 transition-all group-hover:opacity-100 hover:scale-110"
              onClick={() => handleRemove(photo.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      ))}

      {canAddMore && (
        <div
          {...getRootProps()}
          className={cn(
            "flex aspect-square cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 transition-all duration-200",
            isDragActive && "border-[#e85a77] bg-[#e85a77]/5 scale-105"
          )}
        >
          <input {...getInputProps()} />
          <Plus className={cn(
            "h-6 w-6 transition-colors",
            isDragActive ? "text-[#e85a77]" : "text-neutral-400"
          )} />
        </div>
      )}

      {Array.from({ length: placeholderCount }).map((_, i) => (
        <div
          key={`placeholder-${i}`}
          className="aspect-square rounded-xl bg-neutral-100"
        />
      ))}
    </div>
  );
}
