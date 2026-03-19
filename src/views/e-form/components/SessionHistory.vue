<template>
  <!-- 觸發按鈕（固定在右上方，由父層呼叫） -->
  <!-- 側邊抽屜 -->
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="isOpen" class="drawer-overlay" @click.self="close">
        <div class="drawer-panel">
          <!-- 標頭 -->
          <div class="drawer-header">
            <div class="drawer-title-wrap">
              <svg class="title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="drawer-title">生成歷程</h3>
            </div>
            <button class="drawer-close" @click="close">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="close-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- 歷程列表 -->
          <div class="drawer-body">
            <div v-if="sessions.length === 0" class="empty-state">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="empty-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>尚無生成歷程</span>
            </div>

            <div v-else class="session-list">
              <div v-for="session in sessions" :key="session.id" class="session-card"
                :class="{ expanded: expandedId === session.id }" @click="toggleExpand(session.id)">
                <!-- 摘要列 -->
                <div class="session-summary">
                  <div class="session-left">
                    <div class="session-business">{{ session.businessTypeName }}</div>
                    <div class="session-meta">
                      <span class="meta-item">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="meta-icon">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {{ session.templateIds.length }} 張表單
                      </span>
                      <span class="meta-dot">·</span>
                      <span class="meta-item">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="meta-icon">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {{ session.createdBy }}
                      </span>
                    </div>
                  </div>
                  <div class="session-right">
                    <span class="session-time">{{ formatTime(session.createdAt) }}</span>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="chevron-icon"
                      :class="{ rotated: expandedId === session.id }">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <!-- 展開詳情 -->
                <Transition name="expand">
                  <div v-if="expandedId === session.id" class="session-detail">
                    <div class="detail-label">使用表單：</div>
                    <div class="detail-templates">
                      <span v-for="name in session.templateNames" :key="name" class="tmpl-chip">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="chip-icon">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {{ name }}
                      </span>
                    </div>
                    <div class="detail-time">生成時間：{{ session.createdAt }}</div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { FormSessionRecord } from '@/types/form';

defineProps<{
  isOpen: boolean;
  sessions: FormSessionRecord[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const expandedId = ref<string | null>(null);

function close() {
  emit('close');
}

function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? null : id;
}

function formatTime(dateStr: string): string {
  // 只顯示日期部分
  return dateStr.split(' ')[0] ?? dateStr;
}
</script>

<style scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgb(0 0 0 / 40%);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: flex-end;
}

.drawer-panel {
  width: 360px;
  max-width: 90vw;
  height: 100%;
  background: var(--bg-secondary);
  border-left: 1px solid var(--border-primary);
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 32px rgb(0 0 0 / 25%);
}

/* 標頭 */
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.25rem 1rem;
  border-bottom: 1px solid var(--border-primary);
  flex-shrink: 0;
}

.drawer-title-wrap {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.title-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--primary);
}

.drawer-title {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--text-primary);
}

.drawer-close {
  padding: 0.4rem;
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.drawer-close:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.close-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Body */
.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

/* Empty */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  opacity: 0.4;
}

/* 歷程列表 */
.session-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.session-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 0.625rem;
  cursor: pointer;
  overflow: hidden;
}

.session-card:hover {
  border-color: color-mix(in srgb, var(--primary) 40%, transparent);
  transition: border-color 0.2s ease;
}

.session-card.expanded {
  border-color: var(--primary);
}

.session-summary {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
}

.session-left {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  min-width: 0;
}

.session-business {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
}

.session-meta {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.meta-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.meta-dot {
  color: var(--border-primary);
  font-size: 0.75rem;
}

.session-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.375rem;
  flex-shrink: 0;
}

.session-time {
  font-size: 0.8rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

.chevron-icon {
  width: 1rem;
  height: 1rem;
  color: var(--text-secondary);
  transition: transform 0.25s ease;
}

.rotated {
  transform: rotate(180deg);
}

/* 展開詳情 */
.session-detail {
  padding: 0 1rem 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid var(--border-primary);
  padding-top: 0.75rem;
}

.detail-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.detail-templates {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.tmpl-chip {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.625rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--primary);
  background: color-mix(in srgb, var(--primary) 10%, transparent);
  border-radius: 1rem;
}

.chip-icon {
  width: 0.8125rem;
  height: 0.8125rem;
}

.detail-time {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* 抽屜動畫 */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease;
}

.drawer-enter-active .drawer-panel,
.drawer-leave-active .drawer-panel {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .drawer-panel,
.drawer-leave-to .drawer-panel {
  transform: translateX(100%);
}

/* 展開動畫 */
.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.25s ease, max-height 0.25s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 200px;
}
</style>
