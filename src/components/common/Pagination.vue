<template>
    <div class="pagination">
        <div class="pagination-info">顯示 {{ startIndex }}-{{ endIndex }} 筆，共 {{ total }} 筆</div>
        <div class="pagination-controls">
            <button class="pagination-btn" :disabled="currentPage === 1" @click="$emit('page-change', currentPage - 1)">
                &lt;
            </button>
            <button v-for="page in visiblePages" :key="page"
                :class="['pagination-btn', { active: page === currentPage }]" @click="$emit('page-change', page)">
                {{ page }}
            </button>
            <button class="pagination-btn" :disabled="currentPage === totalPages"
                @click="$emit('page-change', currentPage + 1)">
                &gt;
            </button>
            <span class="pagination-jump">
                跳至
                <input v-model.number="jumpPageModel" type="number" min="1" :max="totalPages"
                    @keyup.enter="handleJump" />
                頁
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
    currentPage: number;
    totalPages: number;
    total: number;
    startIndex: number;
    endIndex: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    (e: 'page-change', page: number): void;
}>();

const jumpPageModel = ref<number>();

const visiblePages = computed(() => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(props.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return pages;
});

const handleJump = () => {
    if (jumpPageModel.value && jumpPageModel.value >= 1 && jumpPageModel.value <= props.totalPages) {
        emit('page-change', jumpPageModel.value);
        jumpPageModel.value = undefined;
    }
};
</script>

<style scoped>
.pagination {
    display: flex;
    gap: 2rem;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.pagination-info {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.pagination-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.pagination-btn {
    min-width: 2.5rem;
    height: 2.5rem;
    padding: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-primary);
    cursor: pointer;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    border-radius: 0.375rem;
}

.pagination-btn:hover:not(:disabled) {
    color: var(--primary);
    border-color: var(--primary);
    transition: color 0.2s ease, border-color 0.2s ease;
}

.pagination-btn.active {
    color: white;
    background: var(--primary);
    border-color: var(--primary);
}

.pagination-btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.pagination-jump {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-left: 1rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.pagination-jump input {
    width: 4rem;
    padding: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-primary);
    text-align: center;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    border-radius: 0.375rem;
}

.pagination-jump input:focus {
    outline: none;
    border-color: var(--primary);
    transition: border-color 0.2s ease;
}
</style>
