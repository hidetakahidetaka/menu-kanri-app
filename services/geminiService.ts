
import { RawMenuItem } from '../types';

export const extractMenuItemsFromImage = async (base64ImageData: string, mimeType: string): Promise<RawMenuItem[]> => {
  try {
    const response = await fetch('/api/call-gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64ImageData, mimeType }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `サーバーエラーが発生しました (${response.status})` }));
      throw new Error(errorData.error || `サーバーエラーが発生しました (${response.status})`);
    }

    const parsedData = await response.json();

    if (!Array.isArray(parsedData)) {
      throw new Error("APIからのレスポンスが予期された配列形式ではありません。");
    }

    // Validate structure of parsed data
    const menuItems: RawMenuItem[] = parsedData.map((item: any, index: number) => {
      if (typeof item.name !== 'string' || typeof item.price !== 'number') {
        console.warn(`インデックス ${index} のアイテムの形式が無効です:`, item);
        return { name: item.name || "無名アイテム", price: Number(item.price) || 0 };
      }
      return {
        name: item.name,
        price: Number(item.price) // Ensure price is a number
      };
    });
    
    return menuItems;

  } catch (error) {
    console.error("バックエンド関数の呼び出し中にエラー:", error);
    if (error instanceof Error) {
        throw new Error(`メニューアイテムの抽出に失敗しました: ${error.message}`);
    }
    throw new Error("サーバーとの通信中に不明なエラーが発生しました。");
  }
};