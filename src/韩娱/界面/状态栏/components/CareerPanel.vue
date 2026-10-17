<template>
  <div class="wrap">
    <!-- 一位：整个面板唯一放大的数字 -->
    <div class="hero">
      <div class="hero__line">
        <span class="hero__n">{{ store.data.成绩.一位 }}</span>
        <span class="hero__u">座一位</span>
      </div>
      <div class="bar hero__bar">
        <div class="bar__fill bar__fill--accent" :style="{ width: one_pct }"></div>
      </div>
    </div>

    <div class="rows">
      <div v-for="item in rows" :key="item.k" class="row">
        <span class="row__k">{{ item.k }}</span>
        <span class="row__v">{{ item.v || '—' }}</span>
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
  gap: 24px;
}

.hero {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hero__line {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.hero__n {
  font-family: var(--font-mono);
  font-size: 52px;
  font-weight: 400;
  letter-spacing: -0.045em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: var(--c-text);
}

.hero__u {
  font-size: 11.5px;
  font-weight: 550;
  color: var(--c-text-faint);
  letter-spacing: 0.06em;
}

.hero__bar {
  height: 3px;
}

.rows {
  display: flex;
  flex-direction: column;
}

.row {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 16px;
  align-items: baseline;
  padding: 10px 0;
  border-bottom: 1px solid var(--c-border);

  &:last-child {
    border-bottom: none;
  }
}

.row__k {
  font-size: 11px;
  font-weight: 550;
  color: var(--c-text-faint);
  letter-spacing: 0.05em;
}

.row__v {
  font-size: 13px;
  font-weight: 550;
  color: var(--c-text);
  line-height: 1.55;
}
</style>
