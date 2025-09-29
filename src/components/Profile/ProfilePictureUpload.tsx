import React, { useState } from "react";
import { Upload, X, Camera } from "lucide-react";
import { Button } from "../ui/button";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const ProfilePictureUpload: React.FC = () => {
  const { t } = useI18nNamespace("Profile/profilePictureUpload");
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelection(files[0]);
  };

  const handleFileSelection = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            <span className="font-medium">{t("upload.click")}</span>{" "}
            {t("upload.drag")}
          </p>
          <p className="text-sm text-gray-500 mb-4">{t("upload.fileTypes")}</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="profile-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("profile-upload")?.click()}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Upload className="w-4 h-4 mr-1" />
            {t("upload.chooseFile")}
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm">
            <img
              src={previewUrl || ""}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{selectedFile.name}</p>
            <p className="text-sm text-gray-500">
              {(selectedFile.size / (1024 * 1024)).toFixed(1)}{" "}
              {t("preview.sizeUnit")}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="text-gray-400 hover:text-red-500"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
