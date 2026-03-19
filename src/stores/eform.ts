import { defineStore } from 'pinia';
import type {
  EFormBusinessType,
  EFormTemplate,
  FormFieldCoord,
  ApplicantFieldDef,
  FormSessionRecord,
} from '@/types/form';

// 語意鍵 → 輸入欄位定義的映射表
const FIELD_DEF_MAP: Record<string, Omit<ApplicantFieldDef, 'required'>> = {
  applicant_name:       { key: 'applicant_name',       label: '申請人姓名',   type: 'text' },
  applicant_id_number:  { key: 'applicant_id_number',  label: '身分證字號',   type: 'id'   },
  applicant_birth_date: { key: 'applicant_birth_date', label: '出生日期',     type: 'date' },
  applicant_phone:      { key: 'applicant_phone',      label: '聯絡電話',     type: 'tel'  },
  applicant_address:    { key: 'applicant_address',    label: '戶籍地址',     type: 'text' },
  applicant_email:      { key: 'applicant_email',      label: 'E-mail',       type: 'text' },
  institution_name:     { key: 'institution_name',     label: '機構/公司名稱', type: 'text' },
  institution_tax_id:   { key: 'institution_tax_id',   label: '統一編號',     type: 'text' },
};

import { MOCK_BUSINESS_TYPES, MOCK_SESSIONS } from '@/mock/eform';

// --- Store ---

interface EFormState {
  businessTypes: EFormBusinessType[];
  sessions: FormSessionRecord[];
}

export const useEFormStore = defineStore('eform', {
  state: (): EFormState => ({
    businessTypes: import.meta.env.VITE_USE_MOCK === 'true' ? MOCK_BUSINESS_TYPES : [],
    sessions: import.meta.env.VITE_USE_MOCK === 'true' ? MOCK_SESSIONS : [],
  }),

  getters: {
    /** 依業務別 ID 取得業務別資料 */
    getBusinessType: (state) => (id: string) =>
      state.businessTypes.find((bt) => bt.id === id),

    /** 依業務別及選取的模板 IDs 計算聯集欄位 */
    getUnionFields:
      (state) =>
      (templateIds: string[]): ApplicantFieldDef[] => {
        // 蒐集所有選中模板的欄位
        const allFields: FormFieldCoord[] = [];
        for (const bt of state.businessTypes) {
          for (const tmpl of bt.templates) {
            if (templateIds.includes(tmpl.id)) {
              allFields.push(...tmpl.fields);
            }
          }
        }

        // 依 fieldKey 聯集：任一表單 required→聯集亦 required
        const unionMap = new Map<string, ApplicantFieldDef>();
        for (const f of allFields) {
          const existing = unionMap.get(f.fieldKey);
          const def = FIELD_DEF_MAP[f.fieldKey] ?? {
            key: f.fieldKey,
            label: f.label,
            type: 'text' as const,
          };
          if (existing) {
            // 任一 required → 聯集 required
            if (f.required) existing.required = true;
          } else {
            unionMap.set(f.fieldKey, { ...def, required: f.required });
          }
        }

        // 按照 FIELD_DEF_MAP 中的順序輸出（未定義的排最後）
        const ORDER = Object.keys(FIELD_DEF_MAP);
        return [...unionMap.values()].sort((a, b) => {
          const ai = ORDER.indexOf(a.key);
          const bi = ORDER.indexOf(b.key);
          return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
        });
      },

    /** 取得指定模板物件 */
    getTemplate:
      (state) =>
      (templateId: string): EFormTemplate | undefined => {
        for (const bt of state.businessTypes) {
          const t = bt.templates.find((t) => t.id === templateId);
          if (t) return t;
        }
      },
  },

  actions: {
    /** 新增生成歷程（Mock：不呼叫 API） */
    addSession(
      payload: Omit<FormSessionRecord, 'id' | 'createdAt'>,
    ): FormSessionRecord {
      const now = new Date().toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const record: FormSessionRecord = {
        ...payload,
        id: `S${String(this.sessions.length + 1).padStart(3, '0')}`,
        createdAt: now,
      };
      this.sessions.unshift(record);
      return record;
    },
  },
});
