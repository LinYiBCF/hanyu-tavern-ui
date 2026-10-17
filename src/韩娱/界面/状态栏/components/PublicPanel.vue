<template>
  <div class="wrap">
    <!-- 热度 -->
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
  gap: 22px;
}

.heat {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.heat__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.heat__n {
  font-family: var(--font-mono);
  font-size: 42px;
  font-weight: 400;
  letter-spacing: -0.04em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.heat__n--hot {
  color: var(--c-danger);
}

.heat__bar {
  height: 3px;
}

.tag {
  font-size: 10.5px;
  font-weight: 650;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--c-sunken);
  letter-spacing: 0.03em;
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
  background: rgba(224, 52, 43, 0.07);
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
  font-weight: 550;
  color: var(--c-danger);
  line-height: 1.55;
}

.block__h {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--c-text-faint);
  margin-bottom: 11px;
}

.issues {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.issue {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--c-text);
  padding-left: 13px;
  position: relative;
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

.fan-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.fan-size {
  font-size: 13px;
  font-weight: 600;
  color: var(--c-text);
}

.fan-power {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 600;
  color: var(--c-text);
  font-variant-numeric: tabular-nums;
}

.comp {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 13px 22px;
  margin-top: 17px;
}

.comp__meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 5px;
}

.comp__k {
  font-size: 11px;
  font-weight: 550;
  color: var(--c-text-faint);
}

.comp__v {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--c-text-muted);
  font-variant-numeric: tabular-nums;
}

.comp__bar {
  height: 3px;
}
</style>
