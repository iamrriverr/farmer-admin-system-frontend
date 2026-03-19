<script setup lang="ts">
// 打字指示器組件 - 顯示 AI 正在輸入的動畫
</script>

<template>
  <div class="typing-indicator">
    <div class="typing-indicator-avatar">
      <svg class="avatar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    </div>
    <div class="typing-indicator-content">
      <div class="typing-dots">
        <span class="dot" />
        <span class="dot" />
        <span class="dot" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========== 打字指示器容器 ========== */
.typing-indicator {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  width: 100%;
  max-width: 52rem;
  padding: 0 1rem;
  margin: 0 auto 2rem;
}

/* ========== 頭像 ========== */
.typing-indicator-avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: var(--primary);
  border-radius: 9999px;
}

.avatar-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: white;
}

/* ========== 內容區域 ========== */
.typing-indicator-content {
  display: flex;
  align-items: center;
  min-height: 2rem;
  padding: 0.5rem 1rem;
  background-color: var(--bg-secondary);
  border-radius: 1rem;
}

/* ========== 跳動的點 ========== */
.typing-dots {
  display: flex;
  gap: 0.375rem;
  align-items: center;
}

.dot {
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--text-tertiary);
  border-radius: 9999px;
  animation: typing-bounce 1.4s infinite ease-in-out;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing-bounce {
  0%,
  60%,
  100% {
    opacity: 0.7;
    transform: translateY(0);
  }

  30% {
    opacity: 1;
    transform: translateY(-0.5rem);
  }
}

/* ========== 響應式設計 ========== */
@media (width <=768px) {
  .typing-indicator {
    padding: 0 0.75rem;
  }
}
</style>
