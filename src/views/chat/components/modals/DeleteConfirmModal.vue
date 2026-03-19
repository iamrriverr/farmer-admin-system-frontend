<script setup lang="ts">
interface Emits {
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}

const emit = defineEmits<Emits>();

const handleConfirm = (): void => {
  emit('confirm');
};

const handleCancel = (): void => {
  emit('cancel');
};

const handleOverlayClick = (event: Event): void => {
  if (event.target === event.currentTarget) {
    handleCancel();
  }
};
</script>

<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container">
      <!-- Icon -->
      <div class="modal-icon-container">
        <svg class="modal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <h3 class="modal-title">確定要刪除此對話嗎？</h3>
        <p class="modal-description">刪除後將無法恢復此對話記錄</p>
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <button class="btn-cancel" @click="handleCancel">取消</button>
        <button class="btn-confirm" @click="handleConfirm">刪除</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 遮罩層 */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(0 0 0 / 20%);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* 彈窗容器 */
.modal-container {
  width: 90%;
  max-width: 400px;
  padding: 1.5rem;
  background-color: var(--bg-primary);
  border-radius: 1rem;
  box-shadow:
    0 20px 25px -5px rgb(0 0 0 / 10%),
    0 10px 10px -5px rgb(0 0 0 / 4%);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Icon 容器 */
.modal-icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.modal-icon {
  width: 3rem;
  height: 3rem;
  color: var(--warning);
}

/* 內容區域 */
.modal-content {
  margin-bottom: 1.5rem;
  text-align: center;
}

.modal-title {
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-description {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* 按鈕區域 */
.modal-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.btn-cancel {
  color: var(--text-primary);
  background-color: var(--bg-secondary);
}

.btn-cancel:hover {
  background-color: var(--bg-tertiary);
}

.btn-confirm {
  color: white;
  background-color: var(--error);
}

.btn-confirm:hover {
  background-color: var(--error-hover);
}
</style>
