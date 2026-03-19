<template>
  <div class="applicant-form">
    <div class="form-header">
      <div class="form-header-info">
        <svg class="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <div>
          <p class="header-title">填入申請人基本資訊</p>
          <p class="header-sub">以下欄位由所選 {{ selectedCount }} 張表單合併，填入一次自動套用至所有表單</p>
        </div>
      </div>
    </div>

    <div class="fields-grid">
      <div v-for="field in unionFields" :key="field.key" class="field-group">
        <label :for="`field-${field.key}`" class="field-label">
          {{ field.label }}
          <span v-if="field.required" class="required-mark">*</span>
        </label>
        <input :id="`field-${field.key}`" :type="inputType(field.type)" :placeholder="placeholder(field)"
          :value="modelValue[field.key] ?? ''" :required="field.required" class="field-input"
          :class="{ 'field-error': fieldError(field.key) }"
          @input="onInput(field.key, ($event.target as HTMLInputElement).value)" @blur="onBlur(field.key)" />
        <!-- 驗證錯誤訊息 -->
        <Transition name="err-fade">
          <span v-if="fieldError(field.key)" class="error-msg">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="err-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ fieldError(field.key) }}
          </span>
        </Transition>
      </div>
    </div>

    <div class="form-note">
      <svg class="note-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      標示 <span class="req-inline">*</span> 為必填欄位。填入資料將自動套用至所有選取的表單。
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ApplicantFieldDef } from '@/types/form';

const props = defineProps<{
  unionFields: ApplicantFieldDef[];
  modelValue: Record<string, string>;
  selectedCount: number;
  showErrors?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: Record<string, string>): void;
}>();

// 追蹤已觸碰過的欄位（blur 後才顯示錯誤，避免使用者還沒輸入就出現紅字）
const touchedFields = ref<Set<string>>(new Set());

// ── 驗證規則 ────────────────────────────────────────────
/**
 * 前端 UX 驗證規則（說明）：
 *  - applicant_name:       至少 2 字元
 *  - applicant_id_number:  台灣身分證格式 —— 1 大寫英文 + 9 數字（共 10 碼）
 *                          第 2 碼限 1（男）或 2（女）
 *                          輸入時自動將首字母轉大寫，減少格式問題
 *  - applicant_phone:      台灣手機格式 —— 09 開頭共 10 碼
 *                          若為市話則 2-3 碼區號 + 7-8 碼號碼（不強制，提示長度即可）
 *  - applicant_birth_date: date input 瀏覽器原生驗證，不另加規則
 *  - applicant_email:      標準 email 格式
 *  - institution_tax_id:  統一編號 —— 8 位數字
 */
function validate(key: string, value: string, required: boolean): string {
  // 空白 + required
  if (!value.trim()) {
    return required ? '此欄位為必填' : '';
  }

  switch (key) {
    case 'applicant_name':
      if (value.trim().length < 2) return '姓名至少需 2 個字元';
      break;

    case 'applicant_id_number': {
      // 台灣身分證：大寫字母 + [12] + 8 位數字，共 10 碼
      const ID_PATTERN = /^[A-Z][12]\d{8}$/;
      if (!ID_PATTERN.test(value)) {
        return '格式錯誤（範例：A123456789，首碼大寫英文 + 9 位數字）';
      }
      break;
    }

    case 'applicant_phone': {
      // 台灣手機：09xxxxxxxx（10碼）
      // 一般市話：(0x)xxxxxxxx 等，這裡至少確保只有數字且 8-10 碼
      const digits = value.replace(/[\s\-()]/g, '');
      if (!/^\d{8,10}$/.test(digits)) {
        return '電話格式錯誤（手機 09xxxxxxxx，共 10 碼）';
      }
      if (digits.length === 10 && !digits.startsWith('09')) {
        return '手機號碼應以 09 開頭';
      }
      break;
    }

    case 'applicant_email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'E-mail 格式錯誤';
      }
      break;

    case 'institution_tax_id':
      if (!/^\d{8}$/.test(value)) {
        return '統一編號應為 8 位數字';
      }
      break;
  }

  return ''; // 無錯誤
}

// 取得特定欄位的錯誤訊息（只有「觸碰過」或「showErrors 觸發」才顯示）
function fieldError(key: string): string {
  const field = props.unionFields.find((f) => f.key === key);
  if (!field) return '';
  const shouldShow = props.showErrors || touchedFields.value.has(key);
  if (!shouldShow) return '';
  return validate(key, props.modelValue[key] ?? '', field.required);
}

// 輸入時：自動大寫身分證首字母，然後 emit
function onInput(key: string, raw: string) {
  let value = raw;
  if (key === 'applicant_id_number' && value.length >= 1) {
    // 自動將首字母轉大寫
    value = value.charAt(0).toUpperCase() + value.slice(1);
  }
  emit('update:modelValue', { ...props.modelValue, [key]: value });
}

// Blur 時標記為已觸碰
function onBlur(key: string) {
  touchedFields.value.add(key);
}

function inputType(type: ApplicantFieldDef['type']): string {
  if (type === 'date') return 'date';
  if (type === 'tel') return 'tel';
  return 'text';
}

function placeholder(field: ApplicantFieldDef): string {
  const map: Record<string, string> = {
    applicant_name: '請輸入姓名（至少 2 字元）',
    applicant_id_number: '如：A123456789',
    applicant_birth_date: '',
    applicant_phone: '如：0912345678',
    applicant_address: '請輸入完整戶籍地址',
    applicant_email: '如：example@email.com',
    institution_name: '請輸入機構或公司名稱',
    institution_tax_id: '請輸入 8 位統一編號',
  };
  return map[field.key] ?? `請輸入 ${field.label}`;
}
</script>

<style scoped>
.applicant-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header */
.form-header {
  padding: 1rem 1.25rem;
  background: color-mix(in srgb, var(--primary) 6%, var(--bg-secondary));
  border: 1px solid color-mix(in srgb, var(--primary) 20%, transparent);
  border-radius: 0.625rem;
}

.form-header-info {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.header-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--primary);
  flex-shrink: 0;
}

.header-title {
  margin: 0 0 0.2rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
}

.header-sub {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

/* Fields grid */
.fields-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem 1.5rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.required-mark {
  color: var(--error);
  font-size: 0.875rem;
}

.field-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  color: var(--text-primary);
  background: var(--bg-tertiary);
  border: 1.5px solid var(--border-primary);
  border-radius: 0.5rem;
  outline: none;
}

.field-input:focus {
  border-color: var(--primary);
  transition: border-color 0.2s ease;
}

.field-input.field-error {
  border-color: var(--error);
}

/* 錯誤訊息 */
.error-msg {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: var(--error);
  margin-top: 0.1rem;
}

.err-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
}

/* Note */
.form-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
  border-radius: 0.5rem;
}

.note-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.req-inline {
  color: var(--error);
  font-weight: 600;
}

/* 錯誤訊息淡入淡出 */
.err-fade-enter-active,
.err-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.err-fade-enter-from,
.err-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
