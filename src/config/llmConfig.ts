// new-datapresso-interface/src/config/llmConfig.ts
export interface Provider {
  id: string;
  name: string;
  apiKeyFormatRegex?: RegExp; // 正则表达式用于格式验证
  placeholderForKey?: string; // API Key 输入框的占位符
  requiresApiKey: boolean; // 是否需要API Key
}

export const SUPPORTED_PROVIDERS: Provider[] = [
  { 
    id: 'openai', 
    name: 'OpenAI', 
    apiKeyFormatRegex: /^sk-[a-zA-Z0-9]{20}T3BlbkFJ[a-zA-Z0-9]{20}$/, // 示例: sk-xxxxxxxxxxxxT3BlbkFJxxxxxxxxxxxx (51 chars)
    placeholderForKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    requiresApiKey: true,
  },
  { 
    id: 'anthropic', 
    name: 'Anthropic', 
    apiKeyFormatRegex: /^sk-ant-api\d{2}-[a-zA-Z0-9\-_]{90,}$/, // 示例: sk-ant-api03-xxxxxxxxxxxxx... (更长)
    placeholderForKey: 'sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx...',
    requiresApiKey: true,
  },
  { 
    id: 'deepseek', 
    name: 'DeepSeek',
    // 假设 DeepSeek 的 key 格式，如果未知，可以先不加 regex 或使用通用格式
    apiKeyFormatRegex: /^[a-zA-Z0-9\-_]{32,}$/, // 示例通用格式
    placeholderForKey: '请输入 DeepSeek API Key',
    requiresApiKey: true,
  },
  { 
    id: 'local', 
    name: '本地模型',
    requiresApiKey: false, // 本地模型通常不需要key
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    apiKeyFormatRegex: /^[a-zA-Z0-9\-_]{38,}$/, // Google AI Keys are typically around 39 chars, no 'sk-' prefix
    placeholderForKey: '请输入您的 Google AI Studio API Key',
    requiresApiKey: true,
  },
  // 可以根据需要添加更多服务商
];

export const PREDEFINED_MODELS: Record<string, string[]> = {
  openai: ['gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
  anthropic: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307', 'claude-2.1', 'claude-2.0', 'claude-instant-1.2'],
  deepseek: ['deepseek-chat', 'deepseek-coder'], // 示例模型
  gemini: ['gemini-1.5-pro-latest', 'gemini-1.5-flash-latest', 'gemini-1.0-pro', 'gemini-pro-vision'], // Added Gemini models
  local: ['local-model-1', 'local-model-2', 'chatglm3-6b'], // 示例本地模型
};

// 辅助函数，根据ID获取服务商配置
export const getProviderById = (id: string): Provider | undefined => {
  return SUPPORTED_PROVIDERS.find(p => p.id === id);
};