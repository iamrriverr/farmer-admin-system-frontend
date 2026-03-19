<template>
  <BaseModal
    v-model="isOpen"
    title="上傳文件"
    size="md"
    confirm-text="確認上傳"
    :confirm-disabled="!isFormValid || isUploading"
    @confirm="handleSubmit"
    @close="handleClose"
  >
    <div class="upload-form">
      <!-- 拖拽上傳區 -->
      <div
        class="drop-zone"
        :class="{ 'drop-zone-active': isDragging, 'drop-zone-has-file': selectedFile }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
        @click="fileInputRef?.click()"
      >
        <input
          ref="fileInputRef"
          type="file"
          class="file-input-hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
          @change="handleFileSelect"
        />

        <template v-if="!selectedFile">
          <div class="drop-zone-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p class="drop-title">拖曳文件至此，或<span class="drop-link">點擊選取</span></p>
          <p class="drop-hint">支援 PDF、Word、Excel、PowerPoint、TXT</p>
        </template>

        <template v-else>
          <div class="file-preview">
            <span class="file-type-badge" :class="getFileIconClass(selectedFile.type)">
              {{ getFileIconLabel(selectedFile.type) }}
            </span>
            <div class="file-preview-info">
              <p class="file-preview-name">{{ selectedFile.name }}</p>
              <p class="file-preview-size">{{ formatFileSize(selectedFile.size) }}</p>
            </div>
            <button class="file-remove-btn" @click.stop="removeFile">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </template>
      </div>

      <!-- 表單欄位 -->
      <div class="form-group">
        <label class="form-label required">文件標題</label>
        <input v-model="formData.title" type="text" class="form-input" placeholder="請輸入文件標題" required />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label required">分類</label>
          <select v-model="formData.category" class="form-select" required>
            <option value="">請選擇分類</option>
            <option v-for="cat in CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">所屬部門</label>
          <select v-model="formData.department" class="form-select">
            <option value="">公開（無限制）</option>
            <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">標籤</label>
        <div class="tag-input-wrapper">
          <div class="tag-list">
            <span v-for="tag in formData.tags" :key="tag" class="tag-item">
              {{ tag }}
              <button class="tag-remove" @click="removeTag(tag)">×</button>
            </span>
          </div>
          <input
            v-model="tagInput"
            type="text"
            class="tag-input"
            placeholder="輸入標籤後按 Enter"
            @keyup.enter="addTag"
          />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">說明</label>
        <textarea v-model="formData.description" class="form-textarea" rows="2" placeholder="選填，簡短描述文件內容" />
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import BaseModal from '@/components/base/BaseModal.vue';

const CATEGORIES = ['業務規章', '業務流程', '法規', '內部知識'];

const MIME_MAP: Record<string, { label: string; cls: string }> = {
  'application/pdf': { label: 'PDF', cls: 'icon-pdf' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { label: 'DOC', cls: 'icon-word' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { label: 'XLS', cls: 'icon-excel' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { label: 'PPT', cls: 'icon-ppt' },
  'text/plain': { label: 'TXT', cls: 'icon-txt' },
};
const getFileIconLabel = (mime: string) => MIME_MAP[mime]?.label ?? 'FILE';
const getFileIconClass = (mime: string) => MIME_MAP[mime]?.cls ?? 'icon-default';
const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface Props {
  modelValue: boolean;
  departments: string[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', file: File, formData: any): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const isUploading = ref(false);
const isDragging = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const tagInput = ref('');

const defaultForm = () => ({ title: '', category: '', department: '', tags: [] as string[], description: '' });
const formData = ref(defaultForm());

const isFormValid = computed(
  () => selectedFile.value !== null && formData.value.title.trim() !== '' && formData.value.category !== ''
);

// 當檔案選取時，自動帶入原始檔名作為標題建議
watch(selectedFile, (file) => {
  if (file && !formData.value.title) {
    formData.value.title = file.name.replace(/\.[^.]+$/, ''); // 去除副檔名
  }
});

const handleFileSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) selectedFile.value = file;
};

const handleDrop = (e: DragEvent) => {
  isDragging.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (file) selectedFile.value = file;
};

const removeFile = () => {
  selectedFile.value = null;
  if (fileInputRef.value) fileInputRef.value.value = '';
};

const addTag = () => {
  const tag = tagInput.value.trim();
  if (tag && !formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag);
  }
  tagInput.value = '';
};

const removeTag = (tag: string) => {
  formData.value.tags = formData.value.tags.filter((t) => t !== tag);
};

const handleSubmit = () => {
  if (!isFormValid.value || !selectedFile.value) return;
  emit('submit', selectedFile.value, { ...formData.value });
  handleClose();
};

const handleClose = () => {
  formData.value = defaultForm();
  selectedFile.value = null;
  tagInput.value = '';
};
</script>

<style scoped>
.upload-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ── 拖拽區 ── */
.drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 7rem;
  padding: 1.5rem;
  cursor: pointer;
  background: var(--bg-tertiary);
  border: 2px dashed var(--border-primary);
  border-radius: 0.75rem;
  transition: all 0.2s;
}

.drop-zone:hover,
.drop-zone-active {
  border-color: var(--primary);
  background: rgba(var(--primary-rgb), 0.04);
}

.drop-zone-has-file {
  border-style: solid;
  border-color: var(--primary);
  background: rgba(var(--primary-rgb), 0.04);
}

.file-input-hidden { display: none; }

.drop-zone-icon svg {
  width: 2.5rem;
  height: 2.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-tertiary);
}

.drop-title {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.drop-link {
  margin-left: 0.25rem;
  color: var(--primary);
  cursor: pointer;
}

.drop-hint {
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

/* ── 已選檔案預覽 ── */
.file-preview {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  width: 100%;
}

.file-type-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 0.625rem;
  font-weight: 700;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

.icon-pdf    { color: #ef4444; background: rgba(239, 68, 68, 0.12); }
.icon-word   { color: #3b82f6; background: rgba(59, 130, 246, 0.12); }
.icon-excel  { color: #22c55e; background: rgba(34, 197, 94, 0.12); }
.icon-ppt    { color: #f97316; background: rgba(249, 115, 22, 0.12); }
.icon-txt    { color: var(--text-secondary); background: var(--bg-tertiary); }
.icon-default{ color: var(--text-secondary); background: var(--bg-tertiary); }

.file-preview-info {
  flex: 1;
  min-width: 0;
}

.file-preview-name {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.file-preview-size {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.file-remove-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 0.25rem;
  transition: all 0.15s;
}

.file-remove-btn:hover {
  color: var(--error);
  background: rgba(239, 68, 68, 0.1);
}

.file-remove-btn svg { width: 0.875rem; height: 0.875rem; }

/* ── 表單 ── */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-label.required::after {
  content: ' *';
  color: var(--error);
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
}

.form-textarea { resize: none; font-family: inherit; }

/* ── 標籤輸入 ── */
.tag-input-wrapper {
  padding: 0.375rem 0.5rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
  transition: border-color 0.2s;
}

.tag-input-wrapper:focus-within {
  border-color: var(--primary);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.25rem;
}

.tag-item {
  display: inline-flex;
  gap: 0.25rem;
  align-items: center;
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  color: var(--primary);
  background: rgba(var(--primary-rgb), 0.1);
  border-radius: 0.25rem;
}

.tag-remove {
  padding: 0;
  font-size: 0.875rem;
  line-height: 1;
  color: inherit;
  cursor: pointer;
  background: transparent;
  border: none;
  opacity: 0.7;
}

.tag-remove:hover { opacity: 1; }

.tag-input {
  width: 100%;
  padding: 0.25rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  background: transparent;
  border: none;
  outline: none;
}

.tag-input::placeholder { color: var(--text-tertiary); }
</style>
