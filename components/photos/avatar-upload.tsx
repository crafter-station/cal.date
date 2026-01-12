"use client";

import { useState, useCallback, useTransition, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Camera, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { compressAvatar } from "@/lib/utils/compress-image";

interface AvatarUploadProps {
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  className?: string;
}

export function AvatarUpload({
  currentUrl,
  onUpload,
  onRemove,
  className,
}: AvatarUploadProps) {
  const [optimisticUrl, setOptimisticUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [imageError, setImageError] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setImageError(false);
  }, [currentUrl]);

  const uploadFile = async (file: File, previewUrl: string) => {
    setUploadStatus("uploading");
    setImageError(false);
    
    try {
      const compressedFile = await compressAvatar(file);
      
      const formData = new FormData();
      formData.append("file", compressedFile);

      const response = await fetch("/api/photos/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { url } = await response.json();
      
      setUploadStatus("success");
      setTimeout(() => setUploadStatus("idle"), 1500);
      
      startTransition(() => {
        onUpload(url);
        setOptimisticUrl(null);
      });
    } catch {
      setUploadStatus("error");
      setTimeout(() => {
        setOptimisticUrl(null);
        setUploadStatus("idle");
      }, 2000);
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setOptimisticUrl(previewUrl);
      setImageError(false);
      uploadFile(file, previewUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    disabled: uploadStatus === "uploading",
  });

  const handleRemove = async () => {
    if (!onRemove) return;
    
    const previousUrl = currentUrl;
    startTransition(() => {
      onRemove();
    });
    setImageError(false);

    try {
      const response = await fetch("/api/photos/avatar", { method: "DELETE" });
      if (!response.ok) {
        startTransition(() => {
          if (previousUrl) onUpload(previousUrl);
        });
      }
    } catch {
      startTransition(() => {
        if (previousUrl) onUpload(previousUrl);
      });
    }
  };

  const displayUrl = optimisticUrl || currentUrl;
  const isUploading = uploadStatus === "uploading";
  const showImage = displayUrl && !imageError;

  return (
    <div className={cn("relative", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative h-32 w-32 cursor-pointer overflow-hidden rounded-full bg-neutral-100 ring-4 ring-white shadow-lg transition-all duration-200",
          isDragActive && "ring-[#e85a77] scale-105",
          uploadStatus === "error" && "ring-red-500"
        )}
      >
        <input {...getInputProps()} />
        
        {showImage ? (
          <Image
            src={displayUrl}
            alt="Avatar"
            fill
            className={cn(
              "object-cover transition-opacity duration-200",
              isUploading && "opacity-80"
            )}
            unoptimized
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Camera className="h-8 w-8 text-neutral-400" />
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}

        {uploadStatus === "success" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 animate-in fade-in duration-200">
            <Check className="h-8 w-8 text-white" />
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all hover:bg-black/30 hover:opacity-100">
          <Camera className="h-6 w-6 text-white" />
        </div>
      </div>

      {currentUrl && onRemove && !isUploading && !isPending && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute -right-1 -top-1 h-8 w-8 rounded-full transition-transform hover:scale-110"
          onClick={(e) => {
            e.stopPropagation();
            handleRemove();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
