<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="modelValue" class="modal-overlay" @click.self="handleClose">
                <div class="modal-container" :class="sizeClass">
                    <div class="modal-header">
                        <h3 class="modal-title">{{ title }}</h3>
                        <button class="modal-close" @click="handleClose">
                            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="modal-body">
                        <slot />
                    </div>

                    <div v-if="showFooter" class="modal-footer">
                        <slot name="footer">
                            <button class="btn btn-secondary" @click="handleClose">
                                {{ cancelText }}
                            </button>
                            <button class="btn btn-primary" :disabled="confirmDisabled" @click="handleConfirm">
                                {{ confirmText }}
                            </button>
                        </slot>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    modelValue: boolean;
    title: string;
    size?: 'sm' | 'md' | 'lg';
    showFooter?: boolean;
    confirmText?: string;
    cancelText?: string;
    confirmDisabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    showFooter: true,
    confirmText: '確認',
    cancelText: '取消',
    confirmDisabled: false,
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'confirm'): void;
    (e: 'close'): void;
}>();

const sizeClass = computed(() => `modal-${props.size}`);

const handleClose = () => {
    emit('update:modelValue', false);
    emit('close');
};

const handleConfirm = () => {
    emit('confirm');
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: rgb(0 0 0 / 75%);
    backdrop-filter: blur(4px);
}

.modal-container {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: 90vh;
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 0.75rem;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 30%);
}

.modal-sm {
    max-width: 400px;
}

.modal-md {
    max-width: 500px;
}

.modal-lg {
    max-width: 700px;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-primary);
}

.modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
}

.modal-close {
    padding: 0.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    background: transparent;
    border: none;
    border-radius: 0.375rem;
    transition: background-color 0.2s ease, color 0.2s ease;
}

.modal-close:hover {
    color: var(--text-primary);
    background: var(--bg-tertiary);
}

.icon {
    width: 1.25rem;
    height: 1.25rem;
}

.modal-body {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
}

.modal-footer {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    justify-content: flex-end;
    padding: 1.5rem;
    border-top: 1px solid var(--border-primary);
}

.btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
    border-radius: 0.5rem;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
}

.btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.btn-primary {
    color: white;
    background: var(--primary);
}

.btn-primary:hover:not(:disabled) {
    background: var(--primary-hover);
}

.btn-secondary {
    color: var(--text-primary);
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
}

.btn-secondary:hover {
    background: var(--bg-primary);
}

/* 動畫 */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
    transition:
        transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
        opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    opacity: 0;
    transform: scale(0.95);
}

/* 響應式 */
@media (width <=640px) {
    .modal-container {
        max-width: 100% !important;
        max-height: 100vh;
        border-radius: 0;
    }

    .modal-overlay {
        padding: 0;
    }
}
</style>
