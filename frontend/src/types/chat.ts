export type ChatRole = "user" | "assistant" | "system";
export type ChatState = "idle" | "loading" | "response" | "error";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  category?: string;
}

export interface ChatRequestBody {
  message: string;
  history?: ChatMessage[];
  category?: string;
}

export interface ChatStreamOptions {
  category?: string;
  history?: ChatMessage[];
  timeoutMs?: number;
  maxRetries?: number;
}

export interface UseChatStreamReturn {
  state: ChatState;
  messages: ChatMessage[];
  streamedResponse: string;
  error: string | null;
  sendMessage: (message: string, options?: ChatStreamOptions) => Promise<void>;
  abort: () => void;
  reset: () => void;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}
