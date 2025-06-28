import React from 'react';

interface ImageUploaderProps {
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreviewUrls: string[];
  processing: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imagePreviewUrls, processing }) => {
  return (
    <div className="mb-6 p-6 bg-white rounded-xl shadow-lg">
      <label htmlFor="imageUpload" className={`block w-full px-4 py-3 text-center text-white font-semibold rounded-lg transition-colors duration-200 ease-in-out
        ${processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'}`}>
        {processing ? '処理中...' : 'メニュー画像を選択 (複数可)'}
      </label>
      <input
        type="file"
        id="imageUpload"
        accept="image/png, image/jpeg, image/webp"
        onChange={onImageUpload}
        className="hidden"
        disabled={processing}
        multiple // Allow multiple file selection
      />
      {imagePreviewUrls.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {imagePreviewUrls.map((url, index) => (
              <div key={index} className="relative aspect-square border border-gray-300 rounded-md overflow-hidden shadow-sm">
                <img 
                  src={url} 
                  alt={`Menu preview ${index + 1}`} 
                  className="w-full h-full object-cover" 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;