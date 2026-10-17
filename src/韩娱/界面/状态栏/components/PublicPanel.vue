<template>
  <div class="wrap">
    <div class="heat">
      <div class="heat__head">
        <span class="heat__k">热度</span>
        <span class="heat__v" :class="heat_class">{{ store.data.舆论.热度 }}</span>
      </div>
      <div class="bar">
        <div class="bar__fill" :class="heat_bar_class" :style="{ width: pct(store.data.舆论.热度) }"></div>
      </div>
      <div class="heat__foot">
        <span class="tag" :class="`tag--${rating_tone}`">{{ store.data.舆论.风评 }}</span>
        <span v-if="store.data.舆论.危机倒计时" class="crisis">{{ store.data.舆论.危机倒计时 }}</span>
      </div>
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
        <span class="fan-power">
          应援力
          <b>{{ store.data.粉丝.应援力 }}</b>
        </span>
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

const heat_class = computed(() => (store.data.舆论.热度 >= 70 ? 'heat__v--hot' : ''));

const heat_bar_class = computed(() => {
  const h = store.data.舆论.热度;
  if (h >= 70) return 'bar__fill--danger';
  if (h >= 40) return 'bar__fill--warning';
  return 'bar__fill--primary';
});
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.heat {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.heat__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.heat__k {
  font-size: 0.72rem;
  color: var(--c-text-muted);
}

.heat__v {
  font-family: var(--font-mono);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--c-text);
}

.heat__v--hot {
  color: var(--c-danger);
}

.heat__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 3px;
}

.tag {
  font-size: 0.68rem;
  padding: 1px 8px;
  border-radius: 999px;
  border: 1px solid currentcolor;
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
  font-size: 0.7rem;
  color: var(--c-danger);
  font-family: var(--font-mono);
}

.block__h {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: var(--c-text-faint);
  margin-bottom: 7px;
}

.issues {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.issue {
  font-size: 0.78rem;
  color: var(--c-text);
  padding-left: 11px;
  position: relative;
  line-height: 1.5;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.62em;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--c-warning);
  }
}

.fan-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 5px;
}

.fan-size {
  font-size: 0.78rem;
  color: var(--c-text);
}

.fan-power {
  font-size: 0.68rem;
  color: var(--c-text-muted);

  b {
    font-family: var(--font-mono);
    color: var(--c-accent);
    font-size: 0.8rem;
  }
}

.comp {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 12px;
  margin-top: 10px;
}

.comp__meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.comp__k {
  font-size: 0.68rem;
  color: var(--c-text-faint);
}

.comp__v {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--c-text-muted);
}

.comp__bar {
  margin-top: 2px;
  height: 3px;
}
</style>
