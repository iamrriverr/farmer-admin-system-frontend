<script setup lang="ts">
import { computed } from 'vue';

/**
 * 通用輸入框組件
 * 支援文字、密碼等類型，包含錯誤提示與禁用狀態
 */

interface Props {
  modelValue: string;
  type?: 'text' | 'password' | 'email' | 'number';
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  error: '',
  label: '',
  required: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  blur: [];
  focus: [];
}>();

const hasError = computed(() => !!props.error);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleBlur = () => {
  emit('blur');
};

const handleFocus = () => {
  emit('focus');
};
</script>

<template>
  <div class="base-input">
    <label v-if="label" class="input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="['input-field', { error: hasError, disabled }]"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />
    <span v-if="hasError" class="error-message">{{ error }}</span>
  </div>
</template>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.required-mark {
  margin-left: 0.125rem;
  color: var(--error);
}

.input-field {
  width: 100%;
  padding: 0.875rem 1.125rem;
  font-size: 0.9375rem;
  color: var(--text-primary);
  outline: none;
  background: var(--bg-tertiary);
  border: 2px solid var(--border-primary);
  border-radius: 0.5rem;
  transition: none; /* 預設不設置過渡，防止主題切換黑閃 */
}

.input-field::placeholder {
  color: var(--text-tertiary);
}

.input-field:focus {
  border-color: var(--primary);
  transition: border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-field.error {
  border-color: var(--error);
}

.input-field.error:focus {
  border-color: var(--error);
}

.input-field.disabled {
  cursor: not-allowed;
  background: var(--bg-secondary);
  opacity: 0.5;
}

.error-message {
  margin-top: -0.25rem;
  font-size: 0.8125rem;
  color: var(--error);
}
</style>
