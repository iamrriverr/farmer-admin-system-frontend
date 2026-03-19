<template>
  <div class="business-selector">
    <!-- 業務別下拉 -->
    <div class="selector-section">
      <label class="field-label" for="business-select">選擇業務別</label>
      <div class="select-wrapper">
        <select id="business-select" class="base-select" :value="selectedBusinessId" @change="onBusinessChange">
          <option value="">-- 請選擇業務別 --</option>
          <option v-for="bt in businessTypes" :key="bt.id" :value="bt.id">
            {{ bt.name }}
          </option>
        </select>
        <svg class="select-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <p v-if="selectedBusiness?.description" class="business-desc">
        {{ selectedBusiness.description }}
      </p>
    </div>

    <!-- 表單列表（選了業務別才顯示） -->
    <Transition name="slide-down">
      <div v-if="selectedBusiness" class="templates-section">
        <div class="templates-header">
          <span class="templates-title">此業務別包含以下表單</span>
          <span class="templates-hint">請勾選本次需要產出的表單</span>
        </div>

        <div class="template-list">
          <label v-for="tmpl in selectedBusiness.templates" :key="tmpl.id" class="template-item"
            :class="{ 'template-checked': selectedTemplateIds.includes(tmpl.id) }">
            <input type="checkbox" class="template-checkbox" :value="tmpl.id"
              :checked="selectedTemplateIds.includes(tmpl.id)" @change="onTemplateToggle(tmpl.id)" />
            <div class="template-info">
              <div class="template-filename">
                <svg class="doc-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {{ tmpl.pdfFileName }}
              </div>
            </div>
            <div class="template-field-count">
              <span class="count-badge">{{ tmpl.fields.length }} 欄位</span>
            </div>
          </label>
        </div>

        <div v-if="selectedTemplateIds.length === 0" class="no-selection-hint">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="hint-icon">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          請至少勾選一張表單才能繼續
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEFormStore } from '@/stores/eform';

const props = defineProps<{
  selectedBusinessId: string;
  selectedTemplateIds: string[];
}>();

const emit = defineEmits<{
  (e: 'update:selectedBusinessId', id: string): void;
  (e: 'update:selectedTemplateIds', ids: string[]): void;
}>();

const eformStore = useEFormStore();

const businessTypes = computed(() => eformStore.businessTypes.filter((b) => b.active));

const selectedBusiness = computed(() =>
  businessTypes.value.find((b) => b.id === props.selectedBusinessId) ?? null,
);


function onBusinessChange(e: Event) {
  const val = (e.target as HTMLSelectElement).value;
  emit('update:selectedBusinessId', val);
  // 切換業務別時預設全選
  const bt = eformStore.businessTypes.find((b) => b.id === val);
  emit('update:selectedTemplateIds', bt ? bt.templates.map((t) => t.id) : []);
}

function onTemplateToggle(id: string) {
  const current = [...props.selectedTemplateIds];
  const idx = current.indexOf(id);
  if (idx === -1) {
    current.push(id);
  } else {
    current.splice(idx, 1);
  }
  emit('update:selectedTemplateIds', current);
}
</script>

<style scoped>
.business-selector {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* --- 下拉 --- */
.selector-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.select-wrapper {
  position: relative;
  width: 100%;
  max-width: 360px;
}

.base-select {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  appearance: none;
  font-size: 0.9375rem;
  color: var(--text-primary);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
  cursor: pointer;
  outline: none;
}

.base-select:focus {
  border-color: var(--primary);
  transition: border-color 0.2s ease;
}

.select-arrow {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: var(--text-secondary);
  pointer-events: none;
}

.business-desc {
  margin: 0.25rem 0 0;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

/* --- 表單列表 --- */
.templates-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.templates-header {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}

.templates-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
}

.templates-hint {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.template-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.template-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--bg-tertiary);
  border: 1.5px solid var(--border-primary);
  border-radius: 0.625rem;
  cursor: pointer;
  user-select: none;
}

.template-item:hover {
  border-color: color-mix(in srgb, var(--primary) 50%, transparent);
  background: color-mix(in srgb, var(--primary) 5%, var(--bg-tertiary));
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.template-checked {
  border-color: var(--primary) !important;
  background: color-mix(in srgb, var(--primary) 8%, var(--bg-tertiary)) !important;
}

.template-checkbox {
  width: 1.125rem;
  height: 1.125rem;
  accent-color: var(--primary);
  cursor: pointer;
  flex-shrink: 0;
}

.template-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.template-filename {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-primary);
}

.doc-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: var(--primary);
  flex-shrink: 0;
}

.template-field-count {
  flex-shrink: 0;
}

.count-badge {
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--primary);
  background: color-mix(in srgb, var(--primary) 12%, transparent);
  border-radius: 1rem;
}

/* --- 聯集預覽 --- */
.union-preview {
  padding: 1rem 1.25rem;
  background: color-mix(in srgb, var(--primary) 5%, var(--bg-secondary));
  border: 1px solid color-mix(in srgb, var(--primary) 25%, transparent);
  border-radius: 0.625rem;
}

.union-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 0.75rem;
}

.union-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.union-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.field-chip {
  padding: 0.3125rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-primary);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.chip-required {
  color: var(--primary);
  border-color: color-mix(in srgb, var(--primary) 40%, transparent);
  background: color-mix(in srgb, var(--primary) 8%, var(--bg-tertiary));
}

.chip-req-mark {
  color: var(--error);
  font-size: 0.875rem;
}

/* --- 提示 --- */
.no-selection-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
  border: 1px dashed var(--border-primary);
  border-radius: 0.5rem;
}

.hint-icon {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
}

/* --- 動畫 --- */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
