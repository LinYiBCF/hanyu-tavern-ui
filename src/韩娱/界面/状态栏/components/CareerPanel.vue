<template>
  <div class="wrap">
    <div class="rows">
      <div v-for="item in rows" :key="item.k" class="row">
        <span class="row__k">{{ item.k }}</span>
        <span class="row__v">{{ item.v || '暂无' }}</span>
      </div>
    </div>

    <div class="ones">
      <span class="ones__k">一位</span>
      <span class="ones__n">{{ store.data.成绩.一位 }}</span>
      <span class="ones__u">座</span>
      <div class="ones__bar">
        <div class="bar__fill bar__fill--accent" :style="{ width: one_pct }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../../store';

const store = useDataStore();

const rows = computed(() => [
  { k: '音源', v: store.data.成绩.音源 },
  { k: '销量', v: store.data.成绩.销量 },
  { k: '直拍', v: store.data.成绩.直拍 },
  { k: '品牌评价', v: store.data.成绩.品牌评价 },
]);

/** 一位不是线性的：十座以上已经算这条赛道站稳了 */
const one_pct = computed(() => `${Math.min(100, store.data.成绩.一位 * 8)}%`);
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.row {
  display: grid;
  grid-template-columns: 68px 1fr;
  gap: 10px;
  align-items: baseline;
  padding-bottom: 6px;
  border-bottom: 1px dashed var(--c-border);
}

.row__k {
  font-size: 0.72rem;
  color: var(--c-text-faint);
}

.row__v {
  font-size: 0.78rem;
  color: var(--c-text);
  line-height: 1.5;
}

.ones {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
  padding: 9px 10px;
  background: var(--c-surface-raised);
  border-radius: var(--radius);
}

.ones__k {
  font-size: 0.72rem;
  color: var(--c-text-muted);
}

.ones__n {
  font-family: var(--font-mono);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--c-accent);
}

.ones__u {
  font-size: 0.68rem;
  color: var(--c-text-faint);
}

.ones__bar {
  flex: 1 1 100%;
  height: 4px;
  background: var(--c-surface-sunken);
  border-radius: 2px;
  overflow: hidden;
}

.ones__bar .bar__fill {
  height: 100%;
}
</style>
