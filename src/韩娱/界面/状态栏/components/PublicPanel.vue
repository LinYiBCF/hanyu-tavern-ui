<template>
  <div class="wrap">
    <!-- 热度：一个数字 + 一条线 + 一个风评胶囊 -->
    <div class="heat">
      <div class="heat__head">
        <span class="heat__n" :class="{ 'heat__n--hot': store.data.舆论.热度 >= 70 }">
          {{ store.data.舆论.热度 }}
        </span>
        <span class="tag" :class="`tag--${rating_tone}`">{{ store.data.舆论.风评 }}</span>
      </div>
      <div class="bar heat__bar">
        <div class="bar__fill" :class="heat_bar_class" :style="{ width: pct(store.data.舆论.热度) }"></div>
      </div>
      <p v-if="store.data.舆论.危机倒计时" class="crisis">
        <span class="crisis__k">倒计时</span>
        <span class="crisis__v">{{ store.data.舆论.危机倒计时 }}</span>
      </p>
    </div>

    <section v-if="store.data.舆论.当前议题.length" class="block">
      <h4 class="block__h">当前议题</h4>
      <ul class="issues">
        <li v-for="(issue, i) in store.data.舆论.当前议题" :key="i" class="issue">{{ issue }}</li>
      </ul>
    </section>

    <section class="block">
      <h4 class="block__h">粉丝</h4>
      <div class="fan-head">
        <span class="fan-size">{{ store.data.粉丝.规模 || '尚未成气候' }}</span>
        <span class="fan-power">{{ store.data.粉丝.应援力 }}</span>
      </div>
      <div class="bar">
        <div class="bar__fill bar__fill--accent" :style="{ width: pct(store.data.粉丝.应援力) }"></div>
      </div>

      <div class="comp">
        <div v-for="c in composition" :key="c.k" class="comp__item">
          <div class="comp__meta">
            <span class="comp__k">{{ c.k }}</span>
            <span class="comp__v">{{ c.v }}</span>
          </div>
          <div class="bar comp__bar">
            <div class="bar__fill bar__fill--muted" :style="{ width: pct(c.v) }"></div>
          </div>
        </div>
      </div>
    </section>
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

const heat_bar_class = computed(() => {
  const h = store.data.舆论.热度;
  if (h >= 70) return 'bar__fill--danger';
  if (h >= 40) return 'bar__fill--warning';
  return 'bar__fill--accent';
});
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.heat {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.heat__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.heat__n {
  font-family: var(--font-mono);
  font-size: 32px;
  font-weight: 300;
  letter-spacing: -0.03em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.heat__n--hot {
  color: var(--c-danger);
}

.heat__bar {
  margin-top: 4px;
  height: 2px;
}

.tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.04);
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.tag--ok {
  color: #248a3d;
}

.tag--mid {
  color: var(--c-text-muted);
}

.tag--warn {
  color: #c96a00;
}

.tag--bad {
  color: var(--c-danger);
}

.crisis {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 6px;
  padding: 7px 10px;
  border-radius: var(--radius-sm);
  background: rgba(255, 59, 48, 0.06);
}

.crisis__k {
  font-size: 9.5px;
  letter-spacing: 0.14em;
  color: var(--c-danger);
  opacity: 0.75;
  flex-shrink: 0;
}

.crisis__v {
  font-size: 11.5px;
  color: var(--c-danger);
  line-height: 1.5;
}

.block__h {
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.16em;
  color: var(--c-text-faint);
  margin-bottom: 9px;
}

.issues {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.issue {
  font-size: 12px;
  color: var(--c-text);
  padding-left: 12px;
  position: relative;
  line-height: 1.6;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.68em;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--c-text-faint);
  }
}

.fan-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 7px;
}

.fan-size {
  font-size: 12.5px;
  color: var(--c-text);
}

.fan-power {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--c-text);
  font-variant-numeric: tabular-nums;
}

.comp {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 11px 18px;
  margin-top: 15px;
}

.comp__meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 4px;
}

.comp__k {
  font-size: 10.5px;
  color: var(--c-text-faint);
}

.comp__v {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--c-text-muted);
  font-variant-numeric: tabular-nums;
}

.comp__bar {
  height: 2px;
}
</style>
