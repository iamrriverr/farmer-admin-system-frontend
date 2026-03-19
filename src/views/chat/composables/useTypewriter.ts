import { onUnmounted, type Ref, ref, watch } from 'vue';

/**
 * 打字機效果配置選項
 */
export interface UseTypewriterOptions {
  speed?: number; // 每個字符的延遲時間（毫秒）
  enabled?: boolean; // 是否啟用打字機效果
  onComplete?: () => void; // 完成回調
}

/**
 * 打字機效果返回值
 */
export interface UseTypewriterReturn {
  displayedText: Ref<string>; // 當前顯示的文本
  isTyping: Ref<boolean>; // 是否正在打字
  progress: Ref<number>; // 進度（0-100）
  start: () => void; // 開始打字
  stop: () => void; // 停止打字
  skip: () => void; // 跳過動畫，直接顯示完整文本
  reset: () => void; // 重置
}

/**
 * 打字機效果 Composable
 * 用於逐字符顯示文本
 */
export const useTypewriter = (
  sourceText: Ref<string>,
  options: UseTypewriterOptions = {}
): UseTypewriterReturn => {
  const { speed = 30, enabled = true, onComplete } = options;

  const displayedText = ref('');
  const isTyping = ref(false);
  const progress = ref(0);

  let intervalId: ReturnType<typeof setInterval> | null = null;
  let currentIndex = 0;

  /**
   * 開始打字動畫
   */
  const start = (): void => {
    if (!enabled || !sourceText.value) {
      displayedText.value = sourceText.value;
      progress.value = 100;
      return;
    }

    // 清理之前的定時器
    stop();

    isTyping.value = true;
    currentIndex = 0;
    displayedText.value = '';
    progress.value = 0;

    intervalId = setInterval(() => {
      if (currentIndex < sourceText.value.length) {
        displayedText.value += sourceText.value[currentIndex];
        currentIndex++;
        progress.value = Math.round((currentIndex / sourceText.value.length) * 100);
      } else {
        stop();
        isTyping.value = false;
        progress.value = 100;
        onComplete?.();
      }
    }, speed);
  };

  /**
   * 停止打字動畫
   */
  const stop = (): void => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  /**
   * 跳過動畫，直接顯示完整文本
   */
  const skip = (): void => {
    stop();
    displayedText.value = sourceText.value;
    isTyping.value = false;
    progress.value = 100;
    onComplete?.();
  };

  /**
   * 重置
   */
  const reset = (): void => {
    stop();
    displayedText.value = '';
    isTyping.value = false;
    progress.value = 0;
    currentIndex = 0;
  };

  // 監聽源文本變化，自動開始打字
  watch(
    sourceText,
    (newText) => {
      if (newText && enabled) {
        start();
      } else if (newText) {
        displayedText.value = newText;
        progress.value = 100;
      }
    },
    { immediate: true }
  );

  // 組件卸載時清理
  onUnmounted(() => {
    stop();
  });

  return {
    displayedText,
    isTyping,
    progress,
    start,
    stop,
    skip,
    reset,
  };
};
