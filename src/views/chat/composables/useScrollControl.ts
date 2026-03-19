import { nextTick, onMounted, onUnmounted, type Ref, ref } from 'vue';

export function useScrollControl(scrollElementRef: Ref<HTMLElement | null>) {
  const showScrollButton = ref(false);

  // 檢查滾動位置
  const checkScrollPosition = () => {
    if (!scrollElementRef.value) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollElementRef.value;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    // 距離底部超過 200px 顯示按鈕
    showScrollButton.value = distanceFromBottom > 200;
  };

  // 執行滾動
  const scrollToBottom = async (smooth = true) => {
    await nextTick();
    if (scrollElementRef.value) {
      scrollElementRef.value.scrollTo({
        top: scrollElementRef.value.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  const handleScroll = () => {
    checkScrollPosition();
  };

  onMounted(() => {
    if (scrollElementRef.value) {
      scrollElementRef.value.addEventListener('scroll', handleScroll);
      // 初始化檢查
      checkScrollPosition();
    }
  });

  onUnmounted(() => {
    if (scrollElementRef.value) {
      scrollElementRef.value.removeEventListener('scroll', handleScroll);
    }
  });

  return {
    showScrollButton,
    scrollToBottom,
    checkScrollPosition, // 匯出以便外部手動呼叫
  };
}
