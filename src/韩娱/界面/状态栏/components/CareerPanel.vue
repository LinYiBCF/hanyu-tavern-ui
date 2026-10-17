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

    <!-- 既往成就：可折叠 -->
    <div class="ach">
      <button
        type="button"
        class="ach__head"
        :aria-expanded="ach_open"
        @click="ach_open = !ach_open"
      >
        <span class="ach__head-l">
          <span class="ach__tag">既往成就</span>
          <span class="ach__count">{{ achievements.length }} 项</span>
        </span>
        <svg class="ach__chev" :class="{ 'ach__chev--open': ach_open }" viewBox="0 0 24 24">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <transition name="ach-slide">
        <div v-show="ach_open" class="ach__body">
          <ol v-if="achievements.length" class="ach__list">
            <li v-for="(a, i) in achievements" :key="i" class="ach__item">
              <span class="ach__date">{{ a.日期 || '—' }}</span>
              <span class="ach__text">{{ a.内容 || '—' }}</span>
            </li>
          </ol>
          <div v-else class="ach__empty">还没有拿得出手的成就</div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../../store';
import { useSafeStorage } from '../../useSafeStorage';

const store = useDataStore();

/** 折叠状态只存本地，不写进 stat_data，避免触发变量回写 */
const ach_open = useSafeStorage<boolean>('韩娱状态栏:achievements_open', true);

const rows = computed(() => [
  { k: '音源', v: store.data.成绩.音源 },
  { k: '销量', v: store.data.成绩.销量 },
  { k: '直拍', v: store.data.成绩.直拍 },
  { k: '品牌评价', v: store.data.成绩.品牌评价, long: true },
]);

const achievements = computed(() => store.data.成绩.既往成就 ?? []);

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

/* ── 既往成就（可折叠） ── */
.ach {
  border: 1px solid var(--c-border);
  border-radius: 14px;
  background: var(--c-card);
  overflow: hidden;
}

.ach__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 12px 14px;
  border: none;
  background: transparent;
  font-family: var(--font-ui);
  text-align: left;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.2s var(--ease);

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}

.ach__head-l {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.ach__tag {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--c-text);
  white-space: nowrap;
}

.ach__count {
  font-size: 10px;
  font-weight: 500;
  padding: 1.5px 7px;
  border-radius: 999px;
  background: var(--c-sunken);
  color: var(--c-text-faint);
  white-space: nowrap;
}

.ach__chev {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  fill: none;
  stroke: var(--c-text-faint);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.3s var(--ease);
}

.ach__chev--open {
  transform: rotate(180deg);
}

.ach__body {
  padding: 0 14px 10px;
}

.ach__list {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ach__item {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 7px 0;
  border-top: 1px solid var(--c-divider);
}

.ach__date {
  flex-shrink: 0;
  width: 72px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 500;
  color: var(--c-text-faint);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.ach__text {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.55;
  color: var(--c-text-body);
  min-width: 0;
}

.ach__empty {
  padding: 12px 0 4px;
  font-size: 11.5px;
  color: var(--c-text-faint);
  border-top: 1px solid var(--c-divider);
}

.ach-slide-enter-active,
.ach-slide-leave-active {
  transition:
    opacity 0.25s var(--ease),
    max-height 0.3s var(--ease);
  overflow: hidden;
  max-height: 640px;
}

.ach-slide-enter-from,
.ach-slide-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
