"use client";

import { useState } from "react";
import { UploadCloud, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function DirectUploader() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);
    // The API now handles the folder and title logic

    try {
      const res = await fetch("/api/upload", { 
        method: "POST", 
        body: formData 
      });

      if (res.ok) {
        setSuccess(true);
        // Refresh the page after 2 seconds to show the new item in the grid
        setTimeout(() => window.location.reload(), 2000);
      } else {
        throw new Error("Upload failed on server");
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Please check your connection and Cloudinary settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 border-2 border-dashed border-gray-700 rounded-3xl bg-black/20 text-center">
      <label className="cursor-pointer">
        <input type="file" className="hidden" onChange={uploadFile} disabled={loading} />
        
        {loading ? (
          <Loader2 className="mx-auto animate-spin text-blue-500 mb-4" size={40} />
        ) : success ? (
          <CheckCircle className="mx-auto text-green-500 mb-4" size={40} />
        ) : (
          <UploadCloud className="mx-auto text-gray-500 mb-4" size={40} />
        )}

        <p className="text-white font-medium">
          {loading ? "Uploading heavy media..." : success ? "Upload complete!" : "Upload to Portfolio"}
        </p>
        <p className="text-gray-500 text-sm mt-2">Images, GIFs, or long MP4s</p>
      </label>
    </div>
  );
}
