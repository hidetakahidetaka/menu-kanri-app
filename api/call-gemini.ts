
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
// VercelではExpressライクなリクエスト・レスポンスオブジェクトが渡されます
// import type { VercelRequest, VercelResponse } from '@vercel/node';

const { API_KEY } = process.env;

const PROMPT_TEXT = `あなたは専門のOCRおよびデータ抽出AIです。提供された飲食店のメニュー画像を分析し、すべての個別の飲食物アイテムと価格を抽出してください。
情報をJSONオブジェクトの配列として返してください。各オブジェクトには「name」（文字列）と「price」（数値）の2つのプロパティが必要です。
価格が数値でない場合や不明な場合は0としてください。
例: \`\`\`json
[
  {"name": "豚骨ラーメン", "price": 1200},
  {"name": "枝豆", "price": 450},
  {"name": "チャーハンセット", "price": 1000}
]
\`\`\`
価格がアイテムに明確に関連付けられていない場合、またはアイテムがカテゴリヘッダーである場合は、それを省略するか、価格を0に設定してください。個別の注文可能なアイテムに焦点を当ててください。価格が数値であることを確認してください。メニューのテキストが主に日本語の場合、アイテム名も日本語で抽出してください。`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (!API_KEY) {
    return res.status(500).json({ error: "APIキーがサーバーに設定されていません。" });
  }
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    // Vercelではリクエストボディが自動でパースされます
    const { base64ImageData, mimeType } = req.body;
    if (!base64ImageData || !mimeType) {
        return res.status(400).json({ error: "画像データまたはMIMEタイプがありません。" });
    }

    const imagePart = {
      inlineData: { mimeType, data: base64ImageData },
    };

    const textPart = { text: PROMPT_TEXT };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: [{ parts: [imagePart, textPart] }],
      config: {
        responseMimeType: "application/json",
      }
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);

    return res.status(200).json(parsedData);

  } catch (error) {
    console.error("Error in Vercel function:", error);
    const errorMessage = error instanceof Error ? error.message : "サーバーで不明なエラーが発生しました。";
    return res.status(500).json({ error: `メニュー画像の処理に失敗しました: ${errorMessage}` });
  }
}
