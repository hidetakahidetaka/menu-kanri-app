
import React from 'react';

interface ImageUploaderProps {
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreviewUrl: string | null;
  processing: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imagePreviewUrl, processing }) => {
  return (
    <div className="mb-6 p-6 bg-white rounded-xl shadow-lg">
      <label htmlFor="imageUpload" className={`block w-full px-4 py-3 text-center text-white font-semibold rounded-lg transition-colors duration-200 ease-in-out
        ${processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'}`}>
        {processing ? '処理中...' : 'メニュー画像を選択'}
      </label>
      <input
        type="file"
        id="imageUpload"
        accept="image/png, image/jpeg, image/webp"
        onChange={onImageUpload}
        className="hidden"
        disabled={processing}
      />
      {imagePreviewUrl && (
        <div className="mt-6 border border-gray-300 rounded-lg p-2 bg-gray-50">
          <img src={imagePreviewUrl} alt="Menu preview" className="max-w-full max-h-96 mx-auto rounded object-contain" />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
