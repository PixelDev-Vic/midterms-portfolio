"use client";

// Client component — contains all interactive UI (drag-and-drop, state, etc.)
// Auth is enforced in the parent Server Component (page.tsx); this component
// is only rendered after the server-side cookie check has passed.

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, ImagePlus, Loader2, Tag } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminUploadClient() {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [customTitle, setCustomTitle] = useState("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      setUploadProgress(`Uploading ${i + 1} of ${acceptedFiles.length}...`);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", customTitle);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        successCount++;
      } catch (err) {
        console.error("Upload failed for", file.name, err);
        failCount++;
      }
    }

    setUploading(false);
    if (failCount === 0) {
      setUploadProgress(`Success! ${successCount} files uploaded.`);
      setCustomTitle("");
    } else {
      setUploadProgress(`Done. ${successCount} success, ${failCount} failed.`);
    }

    setTimeout(() => setUploadProgress(""), 5000);
  }, [customTitle]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      // NOTE: client-side <input accept="..."> filters are NOT a security control.
      // Real validation is enforced server-side in /api/upload/route.ts.
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
    },
    maxSize: 10 * 1024 * 1024, // UI hint only — hard limit enforced server-side
  });

  return (
    <div className="min-h-screen flex items-center justify-center py-20" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-3xl w-full px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <p className="section-label mb-4">Internal Tool</p>
          <h1 className="headline-lg" style={{ color: "var(--text-primary)" }}>Studio Uploads</h1>
          <p className="body-large mt-4" style={{ color: "var(--text-secondary)" }}>Name your project and push it to the portfolio.</p>
        </motion.div>

        <div className="mb-6 max-w-md mx-auto">
          <div className="relative">
            <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
            <input
              type="text"
              placeholder="Display Name (e.g. Urban Motion Concept)"
              className="w-full pl-11 pr-4 py-3 rounded-2xl border outline-none transition-all focus:border-[var(--accent)]"
              style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              disabled={uploading}
            />
          </div>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 ${isDragActive ? "dropzone-active" : ""}`}
          style={{
            borderColor: isDragActive ? "var(--accent)" : "var(--border-strong)",
            background: isDragActive ? "rgba(0,113,227,0.04)" : "var(--bg-secondary)",
          }}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: isDragActive ? "rgba(0,113,227,0.15)" : "var(--border)",
                color: isDragActive ? "var(--accent)" : "var(--text-tertiary)",
              }}
            >
              {uploading ? <Loader2 size={28} className="animate-spin" /> : <Upload size={28} />}
            </div>

            {uploading || uploadProgress ? (
              <p className="text-md font-medium" style={{ color: "var(--accent)" }}>
                {uploadProgress}
              </p>
            ) : (
              <div>
                <p className="text-md font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                  {isDragActive ? "Drop to upload" : "Drag & drop files here"}
                </p>
                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                  JPG, PNG, WEBP, GIF up to 10MB
                </p>
              </div>
            )}
          </div>

          {!uploading && (
            <button
              onClick={open}
              className="mt-8 flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full mx-auto transition-transform active:scale-95"
              style={{ background: "var(--accent)", color: "#fff", border: "none", cursor: "pointer" }}
            >
              <ImagePlus size={18} />
              Browse Files
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
