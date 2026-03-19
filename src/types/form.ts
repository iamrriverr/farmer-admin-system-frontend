/**
 * 電子表單 E-form 相關型別定義
 * 採用 PDF 座標映射方案
 */

// --- 欄位座標定義（對應 DB: form_fields）---

export interface FormFieldCoord {
  id: string;
  templateId: string;
  fieldKey: string;   // 語意鍵，如 applicant_name、applicant_phone
  label: string;      // 顯示標籤，如「申請人姓名」
  page: number;       // 位於 PDF 第幾頁（1-based）
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  fontSize: number;   // 填入文字大小（預設 10）
  required: boolean;
}

// --- 表單模板（對應 DB: form_templates）---

export interface EFormTemplate {
  id: string;
  businessTypeId: string;
  name: string;         // 如「貸款授信申請書」
  pdfFileName: string;  // 原始 PDF 檔名
  fields: FormFieldCoord[];
  active: boolean;
}

// --- 業務別（對應 DB: business_types）---

export interface EFormBusinessType {
  id: string;
  name: string;         // 如「貸款業務」
  description?: string;
  templates: EFormTemplate[];
  active: boolean;
}

// --- 語意鍵 → 前端輸入欄位映射 ---

export interface ApplicantFieldDef {
  key: string;
  label: string;
  type: 'text' | 'date' | 'tel' | 'id';
  required: boolean; // 任一表單 required → 聯集亦 required
}

// 已知語意鍵（可擴充）
export type ApplicantFieldKey =
  | 'applicant_name'
  | 'applicant_phone'
  | 'applicant_id_number'
  | 'applicant_birth_date'
  | 'applicant_address'
  | 'applicant_email'
  | 'institution_name'
  | 'institution_tax_id'
  | string; // 允許擴充

// --- 單次使用流程狀態（前端流程暫存）---

export interface EFormSession {
  businessTypeId: string;
  selectedTemplateIds: string[];
  unionFields: ApplicantFieldDef[];
  applicantData: Record<string, string>;
}

// --- 歷程紀錄（對應 DB: form_sessions，不含個資）---

export interface FormSessionRecord {
  id: string;
  businessTypeId: string;
  businessTypeName: string;
  templateIds: string[];
  templateNames: string[];
  createdBy: string;
  createdAt: string;
}
