
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { OrderItem, RawMenuItem, SortConfig, SortableKey, SortDirection } from './types';
import { fileToBase64 } from './utils/imageUtils';
import { extractMenuItemsFromImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import MenuTable from './components/MenuTable';
import SummaryDisplay from './components/SummaryDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

const App: React.FC = () => {
  const [uploadedImageFiles, setUploadedImageFiles] = useState<File[]>([]);
  const [uploadedImagePreviews, setUploadedImagePreviews] = useState<string[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'ascending' });

  useEffect(() => {
    // Clean up all object URLs when component unmounts or images change
    return () => {
      uploadedImagePreviews.forEach(URL.revokeObjectURL);
    };
  }, [uploadedImagePreviews]);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length > 0) {
      // Clean up old previews before creating new ones
      uploadedImagePreviews.forEach(URL.revokeObjectURL);
      
      setUploadedImageFiles(files);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setUploadedImagePreviews(newPreviews);
      setOrderItems([]);
      setError(null);
    }
  }, [uploadedImagePreviews]);

  const processImages = useCallback(async () => {
    if (uploadedImageFiles.length === 0) {
      setError("まず画像ファイルを選択してください。");
      return;
    }

    setIsLoading(true);
    setError(null);
    setOrderItems([]);

    try {
      const allExtractedItems = await Promise.all(
        uploadedImageFiles.map(async (file) => {
          const base64ImageData = await fileToBase64(file);
          return extractMenuItemsFromImage(base64ImageData, file.type);
        })
      );

      // Flatten the array of arrays and deduplicate items by name
      const flattenedItems = allExtractedItems.flat();
      const uniqueItemsMap = new Map<string, RawMenuItem>();
      flattenedItems.forEach(item => {
        if (!uniqueItemsMap.has(item.name)) {
          uniqueItemsMap.set(item.name, item);
        }
      });
      const uniqueRawItems = Array.from(uniqueItemsMap.values());
      
      const newOrderItems: OrderItem[] = uniqueRawItems.map((item) => ({
        ...item,
        id: crypto.randomUUID(), // Generate unique ID
        quantityOrdered: 0,
        quantityReceived: 0,
      }));

      setOrderItems(newOrderItems);
      if (newOrderItems.length === 0) {
        setError("メニューアイテムが抽出されませんでした。別の画像を試すか、画像の品質を確認してください。");
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || "画像の処理中にエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImageFiles]);

  const handleOrderItemChange = useCallback((id: string, field: 'quantityOrdered' | 'quantityReceived', value: string) => {
    setOrderItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const numericValue = parseInt(value, 10);
          return {
            ...item,
            [field]: isNaN(numericValue) || numericValue < 0 ? 0 : numericValue,
          };
        }
        return item;
      })
    );
  }, []);
  
  const clearAll = useCallback(() => {
    uploadedImagePreviews.forEach(URL.revokeObjectURL);
    setUploadedImageFiles([]);
    setUploadedImagePreviews([]);
    setOrderItems([]);
    setError(null);
    setIsLoading(false);
    setSortConfig({ key: 'name', direction: 'ascending' });
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
    }
  }, [uploadedImagePreviews]);

  const requestSort = useCallback((key: SortableKey) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  const sortedItems = useMemo(() => {
    const sortableItems = [...orderItems];
    sortableItems.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortableItems;
  }, [orderItems, sortConfig]);

  const { totalAmount, totalQuantityOrdered, totalQuantityReceived } = useMemo(() => {
    return orderItems.reduce(
      (acc, item) => {
        acc.totalAmount += item.price * item.quantityOrdered;
        acc.totalQuantityOrdered += item.quantityOrdered;
        acc.totalQuantityReceived += item.quantityReceived;
        return acc;
      },
      { totalAmount: 0, totalQuantityOrdered: 0, totalQuantityReceived: 0 }
    );
  }, [orderItems]);

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-4xl">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 py-2">
          メニュー注文抽出 & 管理
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          飲食店のメニュー画像をアップロードして、品目と価格を抽出し、注文を管理しましょう。
        </p>
      </header>

      <ImageUploader 
        onImageUpload={handleImageUpload} 
        imagePreviewUrls={uploadedImagePreviews}
        processing={isLoading}
      />

      {uploadedImageFiles.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-center gap-4 my-6">
            <button
                onClick={processImages}
                disabled={isLoading || uploadedImageFiles.length === 0}
                className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
                {isLoading ? '処理中...' : 'メニューを処理'}
            </button>
            <button
                onClick={clearAll}
                disabled={isLoading && uploadedImageFiles.length === 0 && orderItems.length === 0}
                className="w-full sm:w-auto px-8 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 disabled:bg-gray-300 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
            >
                クリア
            </button>
        </div>
      )}
      
      {isLoading && <LoadingSpinner />}
      <ErrorMessage message={error} />

      {!isLoading && orderItems.length > 0 && (
        <>
          <MenuTable 
            items={sortedItems} 
            onItemChange={handleOrderItemChange} 
            processing={isLoading} 
            requestSort={requestSort}
            sortConfig={sortConfig}
          />
          <SummaryDisplay
            totalAmount={totalAmount}
            totalQuantityOrdered={totalQuantityOrdered}
            totalQuantityReceived={totalQuantityReceived}
          />
        </>
      )}
      
      {!isLoading && uploadedImageFiles.length === 0 && orderItems.length === 0 && !error && (
        <div className="text-center p-10 bg-white rounded-xl shadow-lg mt-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-4 text-xl font-semibold text-gray-700">準備完了</h3>
            <p className="mt-1 text-gray-500">開始するには、上部のボタンからメニュー画像をアップロードしてください。</p>
        </div>
      )}

      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Menu Order Extractor. Gemini API を活用しています。</p>
        <p className="mt-1">画像のアップロードと処理は、ユーザーのブラウザとGemini API間で行われます。プライバシーにご留意ください。</p>
      </footer>
    </div>
  );
};

export default App;