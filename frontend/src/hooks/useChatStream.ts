"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ChatMessage, ChatRequestBody, ChatState,
  ChatStreamOptions, UseChatStreamReturn,
} from "@/types/chat";

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_RETRIES = 2;

function createMessageId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => { window.setTimeout(resolve, ms); });
}

async function readStream(
  response: Response,
  onChunk: (chunk: string) => void,
  signal: AbortSignal,
): Promise<string> {
  if (!response.body) {
    const text = await response.text();
    onChunk(text);
    return text;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullText = "";

  try {
    while (true) {
      if (signal.aborted) throw new DOMException("Aborted", "AbortError");
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      onChunk(chunk);
    }
    const trailing = decoder.decode();
    if (trailing) { fullText += trailing; onChunk(trailing); }
    return fullText;
  } finally {
    reader.releaseLock();
  }
}

export function useChatStream(): UseChatStreamReturn {
  const [state, setState] = useState<ChatState>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamedResponse, setStreamedResponse] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | number | null>(null);
  const mountedRef = useRef<boolean>(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    if (timeoutRef.current) { window.clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    if (mountedRef.current) setState("idle");
  }, []);

  const reset = useCallback(() => {
    abort();
    if (!mountedRef.current) return;
    setState("idle"); setMessages([]); setStreamedResponse(""); setError(null);
  }, [abort]);

  const sendMessage = useCallback(async (
    message: string,
    options?: ChatStreamOptions
  ) => {
    const trimmed = message.trim();
    if (!trimmed) return;

    abort();

    const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const maxRetries = options?.maxRetries ?? DEFAULT_MAX_RETRIES;

    const userMsg: ChatMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
      category: options?.category,
    };

    const history = options?.history ?? messages;
    setMessages((prev) => [...prev, userMsg]);
    setStreamedResponse("");
    setError(null);
    setState("loading");

    let attempt = 0;
    let lastError: unknown = null;

    while (attempt <= maxRetries) {
      const controller = new AbortController();
      abortRef.current = controller;
      timeoutRef.current = window.setTimeout(() => controller.abort(), timeoutMs);

      try {
        const body: ChatRequestBody = {
          message: trimmed,
          history: history,
          category: options?.category,
        };

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/plain, text/event-stream, application/json",
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(`API error ${response.status}`);

        if (timeoutRef.current) { window.clearTimeout(timeoutRef.current); timeoutRef.current = null; }

        let accumulated = "";
        setState("response");

        const fullText = await readStream(
          response,
          (chunk) => {
            accumulated += chunk;
            if (mountedRef.current) setStreamedResponse(accumulated);
          },
          controller.signal,
        );

        const assistantMsg: ChatMessage = {
          id: createMessageId(),
          role: "assistant",
          content: fullText,
          createdAt: new Date().toISOString(),
          category: options?.category,
        };

        if (mountedRef.current) {
          setMessages((prev) => [...prev, assistantMsg]);
          setStreamedResponse("");
          setState("response");
          setError(null);
        }

        abortRef.current = null;
        return;

      } catch (err) {
        lastError = err;
        if (timeoutRef.current) { window.clearTimeout(timeoutRef.current); timeoutRef.current = null; }
        if (err instanceof DOMException && err.name === "AbortError") {
          if (attempt >= maxRetries) break;
        }
        if (attempt < maxRetries) await sleep(500 * (attempt + 1));
        attempt++;
      }
    }

    const fallback: ChatMessage = {
      id: createMessageId(),
      role: "assistant",
      content: "Désolé, le service IA est momentanément indisponible. Réessaie dans quelques secondes.",
      createdAt: new Date().toISOString(),
    };

    if (mountedRef.current) {
      setError(lastError instanceof Error ? lastError.message : "Erreur inattendue.");
      setMessages((prev) => [...prev, fallback]);
      setStreamedResponse("");
      setState("error");
    }

    abortRef.current = null;
  }, [abort, messages]);

  return { state, messages, streamedResponse, error, sendMessage, abort, reset, setMessages };
}
