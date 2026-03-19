import { onUnmounted, type Ref, ref } from 'vue';

/**
 * 流式響應配置選項
 */
export interface UseStreamingOptions {
  url?: string; // SSE 端點 URL
  onChunk?: (chunk: string) => void; // 接收到數據塊時的回調
  onComplete?: (fullText: string) => void; // 完成時的回調
  onError?: (error: Error) => void; // 錯誤回調
}

/**
 * 流式響應返回值
 */
export interface UseStreamingReturn {
  streamingContent: Ref<string>; // 流式內容
  isStreaming: Ref<boolean>; // 是否正在流式傳輸
  error: Ref<Error | null>; // 錯誤信息
  start: (url: string, data?: Record<string, unknown>) => void; // 開始流式響應
  stop: () => void; // 停止流式響應
  reset: () => void; // 重置
}

/**
 * 流式響應 Composable
 * 使用 Server-Sent Events (SSE) 實現流式響應
 */
export const useStreaming = (options: UseStreamingOptions = {}): UseStreamingReturn => {
  const { onChunk, onComplete, onError } = options;

  const streamingContent = ref('');
  const isStreaming = ref(false);
  const error = ref<Error | null>(null);

  let eventSource: EventSource | null = null;

  /**
   * 開始流式響應
   */
  const start = (url: string, data?: Record<string, unknown>): void => {
    // 清理之前的連接
    stop();

    // 重置狀態
    streamingContent.value = '';
    isStreaming.value = true;
    error.value = null;

    try {
      // 構建 URL（如果有參數）
      let fullUrl = url;
      if (data) {
        const params = new URLSearchParams(data as Record<string, string>);
        fullUrl = `${url}?${params.toString()}`;
      }

      // 創建 EventSource
      eventSource = new EventSource(fullUrl);

      // 監聽消息事件
      eventSource.onmessage = (event) => {
        try {
          const chunk = event.data;

          // 累積內容
          streamingContent.value += chunk;

          // 調用回調
          onChunk?.(chunk);
        } catch (err) {
          console.error('解析 SSE 數據失敗:', err);
        }
      };

      // 監聽完成事件
      eventSource.addEventListener('done', () => {
        const fullText = streamingContent.value;
        stop();
        onComplete?.(fullText);
      });

      // 監聽錯誤事件
      eventSource.onerror = () => {
        const errorObj = new Error('流式響應錯誤');
        error.value = errorObj;
        isStreaming.value = false;
        onError?.(errorObj);
        stop();
      };
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('啟動流式響應失敗');
      error.value = errorObj;
      isStreaming.value = false;
      onError?.(errorObj);
    }
  };

  /**
   * 停止流式響應
   */
  const stop = (): void => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    isStreaming.value = false;
  };

  /**
   * 重置
   */
  const reset = (): void => {
    stop();
    streamingContent.value = '';
    error.value = null;
  };

  // 組件卸載時清理
  onUnmounted(() => {
    stop();
  });

  return {
    streamingContent,
    isStreaming,
    error,
    start,
    stop,
    reset,
  };
};

/**
 * 使用 Fetch API 實現流式響應（備選方案）
 * 適用於不支持 SSE 的場景
 */
export const useStreamingFetch = (options: UseStreamingOptions = {}): UseStreamingReturn => {
  const { onChunk, onComplete, onError } = options;

  const streamingContent = ref('');
  const isStreaming = ref(false);
  const error = ref<Error | null>(null);

  let abortController: AbortController | null = null;

  /**
   * 開始流式響應（使用 Fetch）
   */
  const start = async (url: string, data?: Record<string, unknown>): Promise<void> => {
    // 清理之前的請求
    stop();

    // 重置狀態
    streamingContent.value = '';
    isStreaming.value = true;
    error.value = null;

    abortController = new AbortController();

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('無法獲取響應流');
      }

      // 讀取流
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          const fullText = streamingContent.value;
          isStreaming.value = false;
          onComplete?.(fullText);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        streamingContent.value += chunk;
        onChunk?.(chunk);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // 用戶主動取消，不視為錯誤
        return;
      }

      const errorObj = err instanceof Error ? err : new Error('流式響應失敗');
      error.value = errorObj;
      isStreaming.value = false;
      onError?.(errorObj);
    }
  };

  /**
   * 停止流式響應
   */
  const stop = (): void => {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
    isStreaming.value = false;
  };

  /**
   * 重置
   */
  const reset = (): void => {
    stop();
    streamingContent.value = '';
    error.value = null;
  };

  // 組件卸載時清理
  onUnmounted(() => {
    stop();
  });

  return {
    streamingContent,
    isStreaming,
    error,
    start,
    stop,
    reset,
  };
};
