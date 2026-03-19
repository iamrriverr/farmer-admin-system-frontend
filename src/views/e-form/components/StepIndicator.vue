<template>
  <div class="step-indicator">
    <div v-for="(step, index) in steps" :key="step.id" class="step-wrapper">
      <!-- 步驟節點 -->
      <div class="step-node" :class="{
        'step-completed': currentStep > step.id,
        'step-active': currentStep === step.id,
        'step-pending': currentStep < step.id,
      }">
        <!-- 完成圖示 -->
        <svg v-if="currentStep > step.id" class="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
        <span v-else class="step-number">{{ step.id }}</span>
      </div>

      <!-- 步驟標籤 -->
      <div class="step-label" :class="{ 'label-active': currentStep === step.id }">
        {{ step.label }}
      </div>

      <!-- 連接線（最後一步不畫） -->
      <div v-if="index < steps.length - 1" class="step-connector"
        :class="{ 'connector-done': currentStep > step.id }" />
    </div>
  </div>
</template>

<script setup lang="ts">
const STEPS = [
  { id: 1, label: '選擇業務別與表單' },
  { id: 2, label: '填入申請人資訊' },
  { id: 3, label: '生成與下載' },
];

defineProps<{ currentStep: number }>();

const steps = STEPS;
</script>

<style scoped>
.step-indicator {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0.625rem 1rem 0.75rem;
  gap: 0;
}

.step-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  max-width: 180px;
}

/* 節點 */
.step-node {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;
}

.step-pending {
  background: var(--bg-tertiary);
  border: 2px solid var(--border-primary);
  color: var(--text-secondary);
}

.step-active {
  background: var(--primary);
  border: 2px solid var(--primary);
  color: white;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 20%, transparent);
}

.step-completed {
  background: var(--primary);
  border: 2px solid var(--primary);
  color: white;
}

/* 數字與勾勾 */
.step-number {
  line-height: 1;
}

.check-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* 標籤：全部顯示 */
.step-label {
  margin-top: 0.375rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-align: center;
  white-space: nowrap;
}

.label-active {
  opacity: 1;
  max-height: 2rem;
  color: var(--primary);
  font-weight: 600;
  transition: color 0.3s;
}

/* 連接線：絕對定位在節點的右半側 */
.step-connector {
  position: absolute;
  top: 1.25rem; /* 節點高度一半 (2.5rem / 2) */
  left: calc(50% + 1.25rem);
  width: calc(100% - 1.25rem);
  height: 1.5px;
  background: var(--border-primary);
}

.connector-done {
  background: var(--primary);
  transition: background 0.3s ease;
}
</style>
