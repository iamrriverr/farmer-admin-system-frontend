import { onBeforeUnmount, onMounted, ref } from 'vue';

interface ScrollSpyOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * 滾動監聽 Composable
 * 用於追蹤當前可見的訊息（用戶問題）
 */
export function useScrollSpy(options: ScrollSpyOptions = {}) {
  const { threshold = 0.5, rootMargin = '-20% 0px -80% 0px' } = options;

  const currentMessageId = ref<string | null>(null);
  const currentMessageContent = ref<string>('');

  let observer: IntersectionObserver | null = null;

  /**
   * 截斷文字
   */
  const truncateText = (text: string, maxLength: number = 40): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  /**
   * Intersection Observer 回調
   */
  const handleIntersection = (entries: IntersectionObserverEntry[]): void => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement;
        const messageId = element.dataset.messageId;
        const role = element.dataset.role;

        // 只追蹤用戶問題
        if (role === 'user' && messageId) {
          currentMessageId.value = messageId;
          const content = element.textContent || '';
          currentMessageContent.value = truncateText(content);
        }
      }
    });
  };

  /**
   * 初始化 Observer
   */
  const initObserver = (): void => {
    if (typeof window === 'undefined') return;

    observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });
  };

  /**
   * 觀察元素
   */
  const observe = (element: HTMLElement): void => {
    if (observer) {
      observer.observe(element);
    }
  };

  /**
   * 取消觀察元素
   */
  const unobserve = (element: HTMLElement): void => {
    if (observer) {
      observer.unobserve(element);
    }
  };

  /**
   * 清理
   */
  const cleanup = (): void => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  onMounted(() => {
    initObserver();
  });

  onBeforeUnmount(() => {
    cleanup();
  });

  return {
    currentMessageId,
    currentMessageContent,
    observe,
    unobserve,
    cleanup,
  };
}
