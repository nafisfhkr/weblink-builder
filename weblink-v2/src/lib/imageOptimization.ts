export interface OptimizeOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "limit" | "fit" | "cover" | "contain";
  quality?: "auto" | number;
  format?: "auto" | "webp" | "jpg" | "png";
  dpr?: "auto" | number;
}

export function getOptimizedImageUrl(url: string, options: OptimizeOptions = {}): string {
  if (!url || !url.includes("cloudinary.com")) {
    return url;
  }

  const {
    width,
    height,
    crop = "limit", // Default to limit so we don't upscale or aggressively crop by default
    quality = "auto",
    format = "auto",
    dpr = "auto",
  } = options;

  const transformations: string[] = [];

  if (crop) transformations.push(`c_${crop}`);
  if (width) transformations.push(`w_${Math.round(width)}`);
  if (height) transformations.push(`h_${Math.round(height)}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  if (dpr) transformations.push(`dpr_${dpr}`);

  const transformString = transformations.join(",");

  // Cloudinary URLs usually look like:
  // https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/folder/image.jpg
  // We want to insert transformations after /upload/

  const uploadStr = "/upload/";
  const uploadIndex = url.indexOf(uploadStr);

  if (uploadIndex === -1) {
    return url; // Couldn't parse, return original
  }

  // Check if transformations already exist (if it has /upload/c_, etc.)
  const afterUpload = url.substring(uploadIndex + uploadStr.length);
  
  // If we already have some typical cloudinary parameters (like v12345 or other transforms)
  // we just prefix our transformations before the rest of the path.
  // Example: /upload/v123... -> /upload/c_limit,w_800/v123...
  
  return url.substring(0, uploadIndex + uploadStr.length) + transformString + "/" + afterUpload;
}
