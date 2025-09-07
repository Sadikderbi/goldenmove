'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (imagePath: string) => void;
  currentImage?: string;
}

export default function ImageUpload({ onImageSelect, currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    // Create a local URL for the image
    const fileName = `${Date.now()}-${file.name}`;
    const imagePath = `/images/products/${fileName}`;
    
    // In a real app, you'd upload to server here
    // For now, just use the local path
    onImageSelect(imagePath);
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Image du produit</label>
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-200"
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Upload...' : 'Choisir image'}
        </label>
        {currentImage && (
          <img src={currentImage} alt="Preview" className="w-16 h-16 object-cover rounded" />
        )}
      </div>
      <input
        type="text"
        placeholder="Ou entrez le chemin de l'image"
        value={currentImage || ''}
        onChange={(e) => onImageSelect(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2"
      />
    </div>
  );
}