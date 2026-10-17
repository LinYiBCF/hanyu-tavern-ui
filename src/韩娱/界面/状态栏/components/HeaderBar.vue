<template>
  <header class="head">
    <div class="head__top">
      <span class="head__gen">{{ store.data.世界.世代 }}</span>
      <span class="head__sep">/</span>
      <span class="head__field">{{ store.data.世界.当前场域 }}</span>
      <span v-if="store.data.世界.当前场景" class="head__scene">{{ store.data.世界.当前场景 }}</span>
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
  padding: 16px 24px 13px;
  border-bottom: 1px solid var(--c-border);
}

.head__top {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 7px;
}

.head__gen {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--c-text-faint);
}

.head__sep {
  font-size: 10px;
  color: var(--c-border-strong);
}

.head__field {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--c-text);
  letter-spacing: 0.005em;
}

.head__scene {
  font-size: 11.5px;
  font-weight: 600;
  padding: 2.5px 9px;
  border-radius: 999px;
  background: var(--c-primary-dim);
  color: var(--c-primary);
  white-space: nowrap;
}

.head__news {
  display: flex;
  gap: 8px;
  margin-top: 11px;
  padding-top: 11px;
  border-top: 1px solid var(--c-border);
}

.head__news-tag {
  flex-shrink: 0;
  font-size: 9.5px;
  font-weight: 650;
  letter-spacing: 0.12em;
  color: var(--c-text-faint);
  padding-top: 2px;
}

.head__news-text {
  font-size: 12px;
  font-weight: 500;
  color: var(--c-text-muted);
  line-height: 1.6;
}
</style>
