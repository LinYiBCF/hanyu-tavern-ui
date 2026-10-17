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
  gap: 0;
  padding: 0 9px;
  border-bottom: 0.5px solid var(--c-border);
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.tab {
  flex: 1 0 auto;
  padding: 10px 11px 9px;
  border: none;
  border-bottom: 1.5px solid transparent;
  background: transparent;
  color: var(--c-text-faint);
  font-family: var(--font-ui);
  font-size: 11.5px;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    color: var(--c-text-muted);
  }
}

.tab--active {
  color: var(--c-text);
  border-bottom-color: var(--c-text);
  font-weight: 600;
}
</style>
