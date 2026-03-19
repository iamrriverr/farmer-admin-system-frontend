import { computed, ref } from 'vue';

interface PreviewOptions {
  fileName: string;
  fileUrl: string;
  highlightText?: string;
}

// 全局狀態：控制預覽模態框的顯示與數據
const isOpen = ref(false);
const currentFile = ref<PreviewOptions>({
  fileName: '',
  fileUrl: '',
  highlightText: '',
});

/**
 * 文件預覽 Composable
 * 用於跨組件開啟文件預覽視窗
 */
export function useFilePreview() {
  // 開啟預覽視窗
  const openPreview = (options: PreviewOptions) => {
    currentFile.value = { ...options };
    isOpen.value = true;
  };

  // 關閉預覽視窗
  const closePreview = () => {
    isOpen.value = false;
    // 延遲清除數據，避免過渡動畫期間出現內容閃爍
    setTimeout(() => {
      currentFile.value = { fileName: '', fileUrl: '', highlightText: '' };
    }, 300);
  };

  // 計算文件類型
  const fileType = computed(() => {
    const ext = currentFile.value.fileName.toLowerCase().split('.').pop() || '';
    if (ext === 'pdf') return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
    if (['txt', 'md', 'json', 'xml', 'csv', 'js', 'ts', 'vue', 'html', 'css'].includes(ext))
      return 'text';
    return 'unknown';
  });

  return {
    isOpen,
    currentFile,
    fileType,
    openPreview,
    closePreview,
  };
}
