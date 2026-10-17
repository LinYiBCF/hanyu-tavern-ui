<template>
  <div class="wrap">
    <!-- 一位：整个面板唯一放大的数字 -->
    <div class="rank">
      <div class="rank__tag">MUSIC SHOW WINS</div>
      <div class="rank__hero">
        <span class="rank__n">{{ store.data.成绩.一位 }}</span>
        <span class="rank__u">座一位</span>
      </div>
      <div class="track">
        <div class="track__fill" :style="{ width: one_pct }"></div>
      </div>
    </div>

    <div class="bento">
      <div v-for="item in rows" :key="item.k" class="cell">
        <span class="cell__k">{{ item.k }}</span>
        <span class="cell__v" :class="{ 'cell__v--num': !item.long }">{{ item.v || '未入榜' }}</span>
      </div>
    </div>

    <div v-if="empty_hint" class="hint">{{ empty_hint }}</div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../../store';

const store = useDataStore();

const rows = computed(() => [
  { k: '音源', v: store.data.成绩.音源 },
  { k: '销量', v: store.data.成绩.销量 },
  { k: '直拍', v: store.data.成绩.直拍 },
  { k: '品牌评价', v: store.data.成绩.品牌评价, long: true },
]);

const empty_hint = computed(() => {
  const g = store.data.成绩;
  if (!g.音源 && !g.销量 && !g.一位 && !g.直拍 && !g.品牌评价) {
    return '暂无正式专辑与回归发行数据';
  }
  return '';
});

/** 一位不是线性的：十座以上已经算这条赛道站稳了 */
const one_pct = computed(() => `${Math.min(100, store.data.成绩.一位 * 8)}%`);
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── 一位卡 ── */
.rank {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border: 1px solid var(--c-border);
  border-radius: 16px;
  background: var(--c-bar);
}

.rank__tag {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--c-text-faint);
}

.rank__hero {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.rank__n {
  font-family: var(--font-mono);
  font-size: 42px;
  font-weight: 700;
  letter-spacing: -0.05em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: var(--c-text);
}

.rank__u {
  font-size: 12px;
  font-weight: 500;
  color: var(--c-text-muted);
}

.track {
  height: 6px;
  border-radius: 3px;
  background: var(--c-border);
  overflow: hidden;
}

.track__fill {
  height: 100%;
  border-radius: 3px;
  background: var(--c-text);
  transition: width 0.5s var(--ease);
}

/* ── Bento 方格 ── */
.bento {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 12px;
  background: var(--c-sunken);
}

.cell__k {
  font-size: 12px;
  color: var(--c-text-faint);
  flex-shrink: 0;
}

.cell__v {
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text);
  text-align: right;
  line-height: 1.4;
}

.cell__v--num {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.hint {
  padding: 30px 0;
  text-align: center;
  font-size: 12px;
  color: var(--c-text-faint);
}
</style>
