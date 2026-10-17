<template>
  <nav class="tabs" role="tablist">
    <button
      v-for="tab in props.tabs"
      :key="tab.id"
      type="button"
      class="tab"
      :class="{ 'tab--active': model === tab.id }"
      :aria-selected="model === tab.id"
      role="tab"
      @click="model = tab.id"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  tabs: { id: string; label: string }[];
}>();

const model = defineModel<string>({ required: true });
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  gap: 2px;
  padding: 6px 10px 0;
  background: var(--c-surface-raised);
  border-bottom: 1px solid var(--c-border);
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.tab {
  flex: 1 0 auto;
  padding: 6px 10px 7px;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--c-text-muted);
  font-family: var(--font-ui);
  font-size: 0.76rem;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition:
    color 0.18s ease,
    border-color 0.18s ease;
  white-space: nowrap;

  &:hover {
    color: var(--c-text);
  }
}

.tab--active {
  color: var(--c-primary);
  border-bottom-color: var(--c-primary);
  font-weight: 600;
}
</style>
