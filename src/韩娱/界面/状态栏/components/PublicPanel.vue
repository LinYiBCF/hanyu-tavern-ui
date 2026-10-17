<template>
  <div class="wrap">
    <!-- 风评卡 -->
    <div class="rank">
      <div class="rank__tag">PUBLIC SENTIMENT</div>
      <div class="rank__hero">
        <span class="rank__n" :class="{ 'rank__n--hot': store.data.舆论.热度 >= 70 }">
          {{ store.data.舆论.热度 }}
        </span>
        <span class="rank__u">% 热度</span>
        <span class="tag" :class="`tag--${rating_tone}`">{{ store.data.舆论.风评 }}</span>
      </div>
      <div class="track">
        <div class="track__fill" :class="heat_fill_class" :style="{ width: pct(store.data.舆论.热度) }"></div>
      </div>
      <p v-if="store.data.舆论.危机倒计时" class="crisis">
        <span class="crisis__k">倒计时</span>
        <span class="crisis__v">{{ store.data.舆论.危机倒计时 }}</span>
      </p>
    </div>

    <!-- 当前议题 -->
    <div v-if="store.data.舆论.当前议题.length" class="card">
      <div class="card__h">当前议题</div>
      <ul class="issues">
        <li v-for="(issue, i) in store.data.舆论.当前议题" :key="i" class="issue">{{ issue }}</li>
      </ul>
    </div>

    <!-- 粉丝 -->
    <div class="card">
      <div class="card__h">粉丝</div>
      <div class="fan__head">
        <span class="fan__size">{{ store.data.粉丝.规模 || '尚未成气候' }}</span>
        <span class="fan__power">应援力 {{ store.data.粉丝.应援力 }}</span>
      </div>
      <div class="track">
        <div class="track__fill" :style="{ width: pct(store.data.粉丝.应援力) }"></div>
      </div>

      <div class="comp">
        <div v-for="c in composition" :key="c.k" class="comp__item">
          <div class="comp__meta">
            <span class="comp__k">{{ c.k }}</span>
            <span class="comp__v">{{ c.v }}</span>
          </div>
          <div class="track comp__track">
            <div class="track__fill track__fill--light" :style="{ width: pct(c.v) }"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="empty_hint" class="hint">{{ empty_hint }}</div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../../store';

const store = useDataStore();

function pct(v: number) {
  return `${Math.max(0, Math.min(100, v))}%`;
}

const composition = computed(() => {
  const c = store.data.粉丝.构成;
  return [
    { k: '唯粉', v: c.唯粉 },
    { k: '团粉', v: c.团粉 },
    { k: '站姐', v: c.站姐 },
    { k: '数据粉', v: c.数据粉 },
    { k: '战斗粉', v: c.战斗粉 },
  ];
});

const empty_hint = computed(() => {
  const a = store.data.舆论;
  if (!a.热度 && !a.危机倒计时 && !a.当前议题.length) return '当前无发酵中的公共危机议题';
  return '';
});

const rating_tone = computed(() => {
  switch (store.data.舆论.风评) {
    case '正向':
      return 'ok';
    case '负面':
      return 'warn';
    case '高危':
      return 'bad';
    default:
      return 'mid';
  }
});

const heat_fill_class = computed(() => {
  const h = store.data.舆论.热度;
  if (h >= 70) return 'track__fill--danger';
  if (h >= 40) return 'track__fill--warn';
  return '';
});
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── 风评卡 ── */
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
  flex-wrap: wrap;
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

.rank__n--hot {
  color: var(--c-danger);
}

.rank__u {
  font-size: 12px;
  color: var(--c-text-muted);
}

.tag {
  margin-left: auto;
  font-size: 10.5px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--c-sunken);
  white-space: nowrap;
}

.tag--ok {
  color: var(--c-success);
}

.tag--mid {
  color: var(--c-text-muted);
}

.tag--warn {
  color: var(--c-warning);
}

.tag--bad {
  color: var(--c-danger);
}

.crisis {
  display: flex;
  align-items: baseline;
  gap: 9px;
  margin-top: 4px;
  padding: 9px 12px;
  border-radius: var(--radius-sm);
  background: #fff1f2;
}

.crisis__k {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: var(--c-danger);
  flex-shrink: 0;
}

.crisis__v {
  font-size: 12px;
  color: var(--c-danger);
  line-height: 1.55;
}

/* ── 卡片 ── */
.card {
  padding: 14px;
  border: 1px solid var(--c-border);
  border-radius: 16px;
  background: #ffffff;
}

.card__h {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--c-text-faint);
  margin-bottom: 10px;
}

.issues {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.issue {
  position: relative;
  padding-left: 13px;
  font-size: 12.5px;
  color: var(--c-text);
  line-height: 1.65;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.66em;
    width: 3.5px;
    height: 3.5px;
    border-radius: 50%;
    background: var(--c-text-faint);
  }
}

/* ── 粉丝 ── */
.fan__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.fan__size {
  font-size: 13px;
  font-weight: 600;
  color: var(--c-text);
}

.fan__power {
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 600;
  color: var(--c-text-muted);
  font-variant-numeric: tabular-nums;
}

.comp {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 18px;
  margin-top: 14px;
}

.comp__meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 4px;
}

.comp__k {
  font-size: 11px;
  color: var(--c-text-faint);
}

.comp__v {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--c-text-muted);
  font-variant-numeric: tabular-nums;
}

.comp__track {
  height: 4px;
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

.track__fill--light {
  background: var(--c-text-faint);
}

.track__fill--warn {
  background: var(--c-warning);
}

.track__fill--danger {
  background: var(--c-danger);
}

.hint {
  padding: 3px 0;
  text-align: center;
  font-size: 12px;
  color: var(--c-text-faint);
}
</style>
