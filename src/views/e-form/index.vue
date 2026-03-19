<template>
  <div class="eform-page">
    <PageHeader title="電子表單生成" subtitle="選擇業務別和所需表單，填入申請人基本資訊，系統將自動套用至各表單對應欄位">
      <template #action>
        <!-- 歷程按鈕 -->
        <button class="btn-history" @click="showHistory = true">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="btn-icon">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          生成歷程
          <span v-if="eformStore.sessions.length" class="history-badge">{{ eformStore.sessions.length }}</span>
        </button>
      </template>
    </PageHeader>

    <!-- 步驟進度條 -->
    <div class="step-card">
      <StepIndicator :current-step="currentStep" />
    </div>

    <!-- 步驟內容 -->
    <div class="content-card">
      <Transition name="step-slide" mode="out-in">
        <!-- 步驟 1 -->
        <div v-if="currentStep === 1" key="step1" class="step-content">
          <BusinessSelector v-model:selected-business-id="selectedBusinessId"
            v-model:selected-template-ids="selectedTemplateIds" />
        </div>

        <!-- 步驟 2 -->
        <div v-else-if="currentStep === 2" key="step2" class="step-content">
          <ApplicantForm v-model="applicantData" :union-fields="unionFields"
            :selected-count="selectedTemplateIds.length" :show-errors="showFormErrors" />
        </div>

        <!-- 步驟 3 -->
        <div v-else key="step3" class="step-content">
          <GenerateResult :templates="selectedTemplates" :business-type-name="selectedBusinessType?.name ?? ''"
            :filled-data="applicantData" @restart="handleRestart" />
        </div>
      </Transition>
    </div>

    <!-- 導覽按鈕（全步驟顯示） -->
    <div class="nav-footer">
      <button class="btn-secondary" :disabled="currentStep === 1" @click="prevStep">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="btn-icon">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        上一步
      </button>

      <div class="nav-info">
        <span class="step-count">步驟 {{ currentStep }} / 3</span>
        <span v-if="currentStep === 1 && selectedTemplateIds.length > 0" class="nav-hint">
          已選 {{ selectedTemplateIds.length }} 張表單
        </span>
      </div>

      <!-- 步驟 1、2：下一步 / 生成表單 -->
      <button v-if="currentStep < 3" class="btn-primary" :disabled="!canProceed" @click="nextStep">
        {{ currentStep === 2 ? '生成表單' : '下一步' }}
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="btn-icon">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <!-- 步驟 3：重新開始 -->
      <button v-else class="btn-restart-nav" @click="handleRestart">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="btn-icon">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        重新開始
      </button>
    </div>

    <!-- 側邊歷程抽屜 -->
    <SessionHistory :is-open="showHistory" :sessions="eformStore.sessions" @close="showHistory = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useEFormStore } from '@/stores/eform';
import { useUserStore } from '@/stores/user';
import PageHeader from '@/components/common/PageHeader.vue';
import StepIndicator from './components/StepIndicator.vue';
import BusinessSelector from './components/BusinessSelector.vue';
import ApplicantForm from './components/ApplicantForm.vue';
import GenerateResult from './components/GenerateResult.vue';
import SessionHistory from './components/SessionHistory.vue';
import type { ApplicantFieldDef, EFormTemplate } from '@/types/form';

const eformStore = useEFormStore();
const userStore = useUserStore();

// 步驟狀態
const currentStep = ref(1);

// 步驟 1：業務別與表單選取
const selectedBusinessId = ref('');
const selectedTemplateIds = ref<string[]>([]);

// 步驟 2：申請人填寫資料
const applicantData = ref<Record<string, string>>({});
const showFormErrors = ref(false);

// 側邊歷程
const showHistory = ref(false);

// Computed
const selectedBusinessType = computed(() =>
  eformStore.businessTypes.find((b) => b.id === selectedBusinessId.value) ?? null,
);

const selectedTemplates = computed<EFormTemplate[]>(() => {
  if (!selectedBusinessType.value) return [];
  return selectedBusinessType.value.templates.filter((t) =>
    selectedTemplateIds.value.includes(t.id),
  );
});

const unionFields = computed<ApplicantFieldDef[]>(() =>
  selectedTemplateIds.value.length > 0
    ? eformStore.getUnionFields(selectedTemplateIds.value)
    : [],
);

const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return selectedBusinessId.value !== '' && selectedTemplateIds.value.length > 0;
  }
  if (currentStep.value === 2) {
    // 必填欄位全部填入
    return unionFields.value.every(
      (f) => !f.required || !!applicantData.value[f.key]?.trim(),
    );
  }
  return false;
});

// 步驟導覽
function nextStep() {
  if (currentStep.value === 2) {
    // 驗證必填
    showFormErrors.value = true;
    if (!canProceed.value) return;
    // 生成完成 → 存入歷程
    eformStore.addSession({
      businessTypeId: selectedBusinessId.value,
      businessTypeName: selectedBusinessType.value?.name ?? '',
      templateIds: selectedTemplateIds.value,
      templateNames: selectedTemplates.value.map((t) => t.name),
      createdBy: userStore.user?.name ?? userStore.user?.username ?? '使用者',
    });
  }
  currentStep.value++;
}

function prevStep() {
  showFormErrors.value = false;
  currentStep.value--;
}

function handleRestart() {
  currentStep.value = 1;
  selectedBusinessId.value = '';
  selectedTemplateIds.value = [];
  applicantData.value = {};
  showFormErrors.value = false;
}
</script>

<style scoped>
.eform-page {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* 歷程按鈕 */
.btn-history {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.125rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
  cursor: pointer;
  position: relative;
}

.btn-history:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: color-mix(in srgb, var(--primary) 6%, var(--bg-tertiary));
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.history-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.3rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
  background: var(--primary);
  border-radius: 1rem;
}

/* 內容卡片 */
.content-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 0.875rem;
  padding: 1.75rem;
  min-height: 300px;
}

.step-content {
  width: 100%;
}

/* 導覽 Footer */
.nav-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 0.875rem;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-secondary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-primary);
  transition: background-color 0.2s ease;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background: var(--primary);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
  transition: background-color 0.2s ease;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

.btn-restart-nav {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-restart-nav:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: color-mix(in srgb, var(--primary) 6%, var(--bg-tertiary));
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.nav-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.step-count {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.nav-hint {
  font-size: 0.8rem;
  color: var(--primary);
}

/* 步驟切換動畫 */
.step-slide-enter-active,
.step-slide-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.step-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.step-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
