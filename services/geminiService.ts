import { GoogleGenAI } from "@google/genai";
import { MOCK_ALBUMS } from '../constants';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateChatResponse = async (
  history: { role: 'user' | 'model'; text: string }[],
  userMessage: string
): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
        return "抱歉，暂时无法连接服务器。请检查API配置。";
    }

    const systemInstruction = `
      你叫 "Nova"，是 KANO (家具品牌) 的智能电子画册助手。
      你的目标是协助用户浏览我们的家具产品电子画册。
      
      这是我们目前的产品画册数据 (JSON):
      ${JSON.stringify(MOCK_ALBUMS)}
      
      行为准则:
      1. 必须使用中文回答。
      2. 主要回答关于画册内容、发布时间、系列分类的问题。
      3. 如果用户询问推荐，根据他们的需求（如“木制”、“现代”、“沙发”）推荐相应的画册系列。
      4. 保持语气专业、优雅、有帮助。
      5. 如果用户询问列表之外的产品，礼貌地告知我们目前没有该系列的电子画册。
      6. 不要编造数据。
    `;

    const model = 'gemini-2.5-flash';
    
    const contents = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));

    contents.push({
        role: 'user',
        parts: [{ text: userMessage }]
    });

    const response = await ai.models.generateContent({
      model,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "抱歉，我现在有点混乱，请稍后再试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "非常抱歉，处理您的请求时发生了错误。";
  }
};