<template>
  <header class="head">
    <div class="head__chips">
      <span class="chip chip--ghost">{{ store.data.世界.世代 }}</span>
      <span class="chip">{{ store.data.世界.当前场域 }}</span>
      <span v-if="store.data.世界.当前场景" class="chip chip--scene">{{ store.data.世界.当前场景 }}</span>
    </div>

    <div v-if="store.data.世界.行业大事" class="head__news">
      <span class="head__news-tag">行业</span>
      <span class="head__news-text">{{ store.data.世界.行业大事 }}</span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useDataStore } from '../../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.head {
  padding: 12px 15px 11px;
  border-bottom: 1px solid var(--c-border);
}

.head__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.chip {
  font-size: 10.5px;
  padding: 3px 9px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.035);
  color: var(--c-text-muted);
  white-space: nowrap;
  letter-spacing: 0.01em;
}

.chip--ghost {
  background: transparent;
  border: 0.5px dashed var(--c-border-strong);
  color: var(--c-text-faint);
}

.chip--scene {
  background: rgba(0, 113, 227, 0.07);
  color: var(--c-primary);
}

.head__news {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 0.5px solid var(--c-border);
}

.head__news-tag {
  flex-shrink: 0;
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--c-text-faint);
  padding-top: 1px;
}

.head__news-text {
  font-size: 11.5px;
  color: var(--c-text-muted);
  line-height: 1.5;
}
</style>
