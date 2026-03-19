/**
 * E-form API（電子表單）
 * 採用 PDF 座標映射方案
 *
 * TODO: 後端整合後替換各函式內容
 * 目前皆為 stub，實際資料由 stores/eform.ts + mock/eform.ts 提供
 */

import type {
  ApiResponse,
  EFormBusinessType,
  EFormTemplate,
  FormFieldCoord,
  FormSessionRecord,
  PaginationParams,
  PaginationResponse,
} from '@/types';
import { httpClient } from '@/utils/request';

// ---------------------------------------------------------------------------
// 業務別
// ---------------------------------------------------------------------------

/**
 * 取得所有啟用中的業務別（含子模板清單）
 */
export const getBusinessTypes = async (): Promise<ApiResponse<EFormBusinessType[]>> =>
  httpClient.get<EFormBusinessType[]>('/eform/business-types');

/**
 * 取得單一業務別
 */
export const getBusinessType = async (id: string): Promise<ApiResponse<EFormBusinessType>> =>
  httpClient.get<EFormBusinessType>(`/eform/business-types/${id}`);

// ---------------------------------------------------------------------------
// 表單模板
// ---------------------------------------------------------------------------

/**
 * 取得業務別下的所有表單模板
 */
export const getTemplates = async (businessTypeId: string): Promise<ApiResponse<EFormTemplate[]>> =>
  httpClient.get<EFormTemplate[]>('/eform/templates', { params: { businessTypeId } });

/**
 * 取得單一表單模板（含所有欄位定義）
 */
export const getTemplate = async (templateId: string): Promise<ApiResponse<EFormTemplate>> =>
  httpClient.get<EFormTemplate>(`/eform/templates/${templateId}`);

// ---------------------------------------------------------------------------
// 欄位座標
// ---------------------------------------------------------------------------

/**
 * 取得指定模板的欄位座標清單
 */
export const getFieldCoords = async (templateId: string): Promise<ApiResponse<FormFieldCoord[]>> =>
  httpClient.get<FormFieldCoord[]>(`/eform/templates/${templateId}/fields`);

/**
 * 計算選取模板的聯集欄位（後端計算，避免前端重複邏輯）
 * @param templateIds 選取的模板 ID 陣列
 */
export const getUnionFields = async (
  templateIds: string[]
): Promise<ApiResponse<FormFieldCoord[]>> =>
  httpClient.post<FormFieldCoord[]>('/eform/union-fields', { templateIds });

// ---------------------------------------------------------------------------
// 生成 & 下載
// ---------------------------------------------------------------------------

/**
 * 生成 PDF（後端疊加座標填入，回傳暫存下載 URL）
 */
export const generatePdf = async (payload: {
  templateId: string;
  applicantData: Record<string, string>;
}): Promise<ApiResponse<{ downloadUrl: string; expiresAt: string }>> =>
  httpClient.post('/eform/generate', payload);

/**
 * 批次生成 PDF（多張表單一次生成，回傳打包 ZIP URL）
 */
export const generateBatch = async (payload: {
  templateIds: string[];
  applicantData: Record<string, string>;
}): Promise<ApiResponse<{ downloadUrl: string; expiresAt: string }>> =>
  httpClient.post('/eform/generate/batch', payload);

// ---------------------------------------------------------------------------
// 生成歷程
// ---------------------------------------------------------------------------

/**
 * 取得當前使用者的生成歷程
 */
export const getSessions = async (
  params: PaginationParams & { businessTypeId?: string }
): Promise<ApiResponse<PaginationResponse<FormSessionRecord>>> =>
  httpClient.get<PaginationResponse<FormSessionRecord>>('/eform/sessions', { params });

/**
 * 取得單一歷程詳情
 */
export const getSession = async (sessionId: string): Promise<ApiResponse<FormSessionRecord>> =>
  httpClient.get<FormSessionRecord>(`/eform/sessions/${sessionId}`);
