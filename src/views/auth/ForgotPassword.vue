<script setup lang="ts">
import { useRouter } from 'vue-router';

import logoImage from '@/assets/images/national_farmers_logo.png';
import BaseButton from '@/components/base/BaseButton.vue';
import { ICONS } from '@/constants';

/**
 * 忘記密碼頁面
 * 顯示管理員聯繫資訊，引導使用者聯繫管理員重置密碼
 */

const router = useRouter();

/**
 * 返回登入頁面
 */
const goToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="forgot-password-page">
    <!-- Logo 區域 -->
    <div class="logo-section">
      <img :src="logoImage" alt="農會標誌" class="logo-image" />
      <h1 class="logo-text">忘記密碼</h1>
    </div>

    <!-- 說明區域 -->
    <div class="info-wrapper">
      <!-- 標題 -->
      <div class="info-header">
        <svg class="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="ICONS.INFO" />
        </svg>
        <h2 class="header-title">密碼重置說明</h2>
      </div>

      <!-- 說明內容 -->
      <div class="info-content">
        <p class="info-text">如果您忘記密碼，請聯繫以下人員：</p>

        <!-- 聯繫人列表 -->
        <div class="contact-list">
          <!-- 系統管理員 -->
          <div class="contact-item">
            <div class="contact-header">
              <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="ICONS.USER"
                />
              </svg>
              <span class="contact-role">系統管理員</span>
            </div>
            <div class="contact-details">
              <div class="contact-detail">
                <span class="detail-label">姓名：</span>
                <span class="detail-value">張先生</span>
              </div>
              <div class="contact-detail">
                <span class="detail-label">分機：</span>
                <span class="detail-value">1234</span>
              </div>
            </div>
          </div>

          <!-- IT 部門 -->
          <div class="contact-item">
            <div class="contact-header">
              <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="ICONS.SETTINGS"
                />
              </svg>
              <span class="contact-role">IT 部門</span>
            </div>
            <div class="contact-details">
              <div class="contact-detail">
                <span class="detail-label">姓名：</span>
                <span class="detail-value">李小姐</span>
              </div>
              <div class="contact-detail">
                <span class="detail-label">分機：</span>
                <span class="detail-value">5678</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 提示訊息 -->
        <div class="notice">
          <svg class="notice-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="ICONS.SHIELD_CHECK"
            />
          </svg>
          <p class="notice-text">管理員將為您重置密碼為預設密碼，重新登入後請立即修改。</p>
        </div>
      </div>

      <!-- 返回按鈕 -->
      <BaseButton variant="outline" size="lg" full-width @click="goToLogin">
        返回登入頁面
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.forgot-password-page {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: center;
  width: 100%;
  padding: 2rem;
}

/* Logo 區域 */
.logo-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;
}

.logo-image {
  width: 5rem;
  height: 5rem;
  object-fit: contain;
}

.logo-text {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.05em;
}

/* 說明區域 */
.info-wrapper {
  width: 100%;
  max-width: 28rem;
}

/* 標題 */
.info-header {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--primary);
}

.header-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
}

/* 說明內容 */
.info-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-text {
  margin: 0;
  font-size: 0.9375rem;
  color: rgb(255 255 255 / 80%);
}

/* 聯繫人列表 */
.contact-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-item {
  padding: 1rem;
  background: rgb(255 255 255 / 3%);
  border: 1px solid rgb(255 255 255 / 8%);
  border-radius: 0.5rem;
}

.contact-header {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.75rem;
}

.contact-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: var(--primary);
}

.contact-role {
  font-size: 0.9375rem;
  font-weight: 600;
  color: white;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding-left: 1.625rem;
}

.contact-detail {
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.detail-label {
  color: rgb(255 255 255 / 60%);
}

.detail-value {
  color: rgb(255 255 255 / 90%);
}

/* 提示訊息 */
.notice {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: rgb(0 173 104 / 10%);
  border: 1px solid rgb(0 173 104 / 25%);
  border-radius: 0.5rem;
}

.notice-icon {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--primary);
}

.notice-text {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: rgb(255 255 255 / 80%);
}

/* 響應式 */
@media (width <= 640px) {
  .forgot-password-page {
    gap: 2rem;
    padding: 1.5rem;
  }

  .logo-image {
    width: 4rem;
    height: 4rem;
  }

  .logo-text {
    font-size: 1.5rem;
  }

  .info-wrapper {
    max-width: 100%;
  }
}
</style>
