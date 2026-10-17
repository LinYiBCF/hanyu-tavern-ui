<template>
  <header class="head">
    <div class="head__top">
      <div class="head__who">
        <span class="head__name">{{ name_display }}</span>
        <span v-if="role_line" class="head__role">{{ role_line }}</span>
      </div>
      <div class="head__time">
        <span class="head__date">{{ store.data.世界.日期 }}</span>
        <span class="head__clock">{{ store.data.世界.时间 }}</span>
        <span class="head__slot">{{ store.data.世界.时段 }}</span>
      </div>
    </div>

    <div class="head__mid">
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

const name_display = computed(() => {
  const name = store.data.主角.姓名;
  return name || '未命名';
});

const role_line = computed(() => {
  const parts = [store.data.主角.身份, store.data.主角.所属社].filter(Boolean);
  return parts.join(' · ');
});
</script>

<style lang="scss" scoped>
.head {
  padding: 12px 14px 10px;
  background: linear-gradient(160deg, var(--c-surface-raised), var(--c-surface));
  border-bottom: 1px solid var(--c-border);
}

.head__top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.head__who {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
}

.head__name {
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--c-text);
  white-space: nowrap;
}

.head__role {
  font-size: 0.74rem;
  color: var(--c-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.head__time {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-shrink: 0;
}

.head__date {
  font-family: var(--font-mono);
  font-size: 0.76rem;
  color: var(--c-primary);
}

.head__clock {
  font-family: var(--font-mono);
  font-size: 0.76rem;
  color: var(--c-primary);
  opacity: 0.82;
}

.head__slot {
  font-size: 0.72rem;
  color: var(--c-text-muted);
}

.head__mid {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 8px;
}

.chip {
  font-size: 0.68rem;
  padding: 2px 7px;
  border-radius: 999px;
  border: 1px solid var(--c-border-strong);
  background: var(--c-surface-sunken);
  color: var(--c-text-muted);
  white-space: nowrap;
}

.chip--ghost {
  border-style: dashed;
  opacity: 0.72;
}

.chip--scene {
  border-color: var(--c-accent-dim);
  color: var(--c-accent);
}

.head__news {
  display: flex;
  gap: 7px;
  margin-top: 9px;
  padding-top: 9px;
  border-top: 1px dashed var(--c-border);
}

.head__news-tag {
  flex-shrink: 0;
  font-size: 0.66rem;
  color: var(--c-warning);
  letter-spacing: 0.1em;
}

.head__news-text {
  font-size: 0.74rem;
  color: var(--c-text-muted);
  line-height: 1.45;
}
</style>
