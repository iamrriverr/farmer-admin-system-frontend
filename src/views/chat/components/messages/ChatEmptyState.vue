<template>
  <div class="empty-state">
    <!-- 空狀態圖示 -->
    <div class="empty-state-icon">
      <svg class="icon-chat" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    </div>

    <!-- 歡迎內容 -->
    <div class="welcome-content">
      <h2 class="welcome-title">開始新對話</h2>
      <p class="welcome-description">選擇以下服務，或在下方輸入框中輸入訊息開始與 AI 對話</p>
    </div>

    <!-- 建議服務網格 -->
    <div class="suggestion-grid">
      <button class="suggestion-card">
        <span class="suggestion-icon">🔍</span>
        <div class="suggestion-text">
          <h3 class="suggestion-title">幫我查找內部業務、法規知識</h3>
          <p class="suggestion-description">搜尋公司內部文件、政策法規</p>
        </div>
      </button>
      <button class="suggestion-card">
        <span class="suggestion-icon">📋</span>
        <div class="suggestion-text">
          <h3 class="suggestion-title">辦理業務手續</h3>
          <p class="suggestion-description">協助處理各類業務申請流程</p>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ========== 空狀態容器 ========== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 3rem 1rem;
}

/* ========== 空狀態圖示 ========== */
.empty-state-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  margin-bottom: 2rem;
  background-color: var(--primary-light);
  border-radius: 9999px;
}

.icon-chat {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--primary);
}

/* ========== 歡迎內容 ========== */
.welcome-content {
  max-width: 32rem;
  margin-bottom: 3rem;
  text-align: center;
}

.welcome-title {
  margin-bottom: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.025em;
}

.welcome-description {
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* ========== 建議服務網格 ========== */
.suggestion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 1.25rem;
  width: 100%;
  max-width: 48rem;
}

/* ========== 建議卡片 ========== */
.suggestion-card {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  padding: 1.75rem 1.5rem;
  text-align: left;
  cursor: pointer;
  background-color: var(--bg-primary);
  border: 1.5px solid var(--border-primary);
  border-radius: 1rem;

  border: 1.5px solid var(--border-primary);
  border-radius: 1rem;
}

.suggestion-card:hover {
  background-color: var(--bg-secondary);
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgb(0 173 104 / 10%);
  transform: translateY(-2px);
  transition:
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.2s ease;
}

.suggestion-card:active {
  transform: translateY(0);
}

/* ========== 建議圖示 ========== */
.suggestion-icon {
  flex-shrink: 0;
  font-size: 2rem;
  line-height: 1;
}

/* ========== 建議文字 ========== */
.suggestion-text {
  flex: 1;
  min-width: 0;
}

.suggestion-title {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-primary);
}

.suggestion-description {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

/* ========== 響應式設計 ========== */
@media (width <=768px) {
  .empty-state {
    padding: 2rem 1rem;
  }

  .empty-state-icon {
    width: 4rem;
    height: 4rem;
    margin-bottom: 1.5rem;
  }

  .icon-chat {
    width: 2rem;
    height: 2rem;
  }

  .welcome-title {
    font-size: 1.5rem;
  }

  .welcome-description {
    font-size: 1rem;
  }

  .suggestion-grid {
    grid-template-columns: 1fr;
  }

  .suggestion-card {
    padding: 1.25rem 1rem;
  }
}
</style>
