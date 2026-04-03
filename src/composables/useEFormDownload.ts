import { generateBatch, generatePdf } from '@/api/form';

/**
 * 電子表單下載組合式函式 (Composable)
 * 封裝生成 PDF/ZIP 並觸發瀏覽器下載的邏輯
 */
export function useEFormDownload() {
  /**
   * 下載單一 PDF
   * @param templateId 模板 ID
   * @param applicantData 申請人填寫的數據
   */
  const downloadSingle = async (templateId: string, applicantData: Record<string, string>) => {
    try {
      // 1. 呼叫 API 生成並獲取 URL
      const response = await generatePdf({
        templateId,
        applicantData,
      });

      // 2. 獲取後端產生的暫存下載連結
      // 注意：response.data 的型別需符合 ApiResponse<{ downloadUrl: string; ... }>
      const { downloadUrl } = response.data;

      if (!downloadUrl) {
        throw new Error('未獲取到下載連結');
      }

      // 3. 觸發下載 (另開視窗下載實體檔案)
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('[useEFormDownload] 單一檔案下載失敗：', error);
      // TODO: 整合 Message.error 提示使用者
    }
  };

  /**
   * 批次打包下載 ZIP
   * @param templateIds 被選取的模板 ID 列表
   * @param applicantData 申請人填寫的數據
   */
  const downloadAll = async (templateIds: string[], applicantData: Record<string, string>) => {
    try {
      // 1. 呼叫批次生成 API
      const response = await generateBatch({
        templateIds,
        applicantData,
      });

      const { downloadUrl } = response.data;

      if (!downloadUrl) {
        throw new Error('未獲取到批次下載連結');
      }

      // 2. 觸發下載 (ZIP 通常直接在當前視窗跳轉下載即可)
      window.location.href = downloadUrl;
    } catch (error) {
      console.error('[useEFormDownload] 批次下載失敗：', error);
      // TODO: 整合 Message.error
    }
  };

  return {
    downloadSingle,
    downloadAll,
  };
}
