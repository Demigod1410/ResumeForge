"use client";

import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";
import type { ChangeEvent, DragEvent } from "react";
import { useState, useRef } from "react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFormats: string;
}

export function FileUpload({ onFileSelect, acceptedFormats }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>, over: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(over);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      className={cn(
        "relative flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/90 backdrop-blur-sm p-12 text-center transition-all group hover:border-accent/50 hover:shadow-lg",
        isDragOver && "border-primary bg-accent/10 shadow-xl"
      )}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => handleDrag(e, true)}
      onDragLeave={(e) => handleDrag(e, false)}
      onDragEnd={(e) => handleDrag(e, false)}
      onDrop={handleDrop}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
      <UploadCloud className="mb-4 h-12 w-12 text-muted-foreground group-hover:text-accent transition-colors z-10" />
      <p className="text-lg font-semibold text-foreground z-10">
        Drag & drop or click to upload
      </p>
      <p className="mt-1 text-sm text-muted-foreground z-10">
        Supported formats: {acceptedFormats}
      </p>
      <input
        ref={inputRef}
        id="file-upload-input"
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      />
    </div>
  );
}
