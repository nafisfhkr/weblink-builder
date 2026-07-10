export async function processImageToBase64(file: File, maxWidth = 1000): Promise<{ url: string; storageKey: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Resize if needed
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to Blob and upload to Cloudinary via our API
        canvas.toBlob(async (blob) => {
          if (!blob) {
            reject(new Error("Failed to create blob from canvas"));
            return;
          }

          try {
            const formData = new FormData();
            formData.append("file", blob, file.name || "image.jpg");

            const res = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });

            if (!res.ok) {
              const errorData = await res.json().catch(() => ({}));
              reject(new Error(errorData.error || "Failed to upload image to server"));
              return;
            }

            const data = await res.json();
            resolve({
              url: data.url,
              storageKey: data.public_id || `cloud_${Date.now()}`
            });
          } catch (err) {
            reject(err);
          }
        }, "image/jpeg", 0.8);
      };
      
      img.onerror = () => reject(new Error("Failed to load image for processing"));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
