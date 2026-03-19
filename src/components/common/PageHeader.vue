<template>
    <div class="page-header">
        <div class="header-left">
            <h1 class="page-title">{{ title }}</h1>
            <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
        </div>
        <div class="header-right">
            <slot name="action" />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
    subtitle?: string;
}>();
</script>

<style scoped>
.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
}

.header-left {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.page-title {
    margin: 0;
    font-size: 1.875rem;
    font-weight: 600;
    color: var(--text-primary);
}

.page-subtitle {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.header-right {
    display: flex;
    gap: 0.75rem;
    align-items: center;
}
</style>
