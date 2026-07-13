export interface ImageUploadMetadata {
  url: string;
  storageKey: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  aspectRatio?: number;
}

export async function processImageToBase64(file: File): Promise<ImageUploadMetadata> {
  return new Promise((resolve, reject) => {
    try {
      const formData = new FormData();
      formData.append("file", file, file.name || "image.jpg");

      fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || "Failed to upload image to server");
          }
          const data = await res.json();
          
          let aspectRatio: number | undefined;
          if (data.width && data.height) {
            aspectRatio = data.width / data.height;
          }

          resolve({
            url: data.url,
            storageKey: data.public_id || `cloud_${Date.now()}`,
            width: data.width,
            height: data.height,
            format: data.format,
            bytes: data.bytes,
            aspectRatio: aspectRatio,
          });
        })
        .catch(reject);
    } catch (err) {
      reject(err);
    }
  });
}
