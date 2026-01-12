import imageCompression from "browser-image-compression";

interface CompressOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const { maxSizeMB = 1, maxWidthOrHeight = 1920 } = options;

  if (!file.type.startsWith("image/")) {
    return file;
  }

  const compressedFile = await imageCompression(file, {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    fileType: file.type as "image/jpeg" | "image/png" | "image/webp",
  });

  return new File([compressedFile], file.name, {
    type: compressedFile.type,
  });
}

export async function compressAvatar(file: File): Promise<File> {
  return compressImage(file, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 512,
  });
}

export async function compressGalleryImage(file: File): Promise<File> {
  return compressImage(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
  });
}
