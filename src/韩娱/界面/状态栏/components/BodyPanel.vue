<template>
  <div class="wrap">
    <div class="state" :class="`state--${state_tone}`">
      <span class="state__label">{{ store.data.身体.状态 }}</span>
      <span class="state__sub">{{ state_hint }}</span>
    </div>

    <div class="weight" :class="`weight--${trend_tone}`">
      <div class="weight__head">
        <span class="weight__k">体重</span>
        <span class="weight__v">
          <span v-if="store.data.主角.体重 > 0" class="weight__num">{{ weight_text }}</span>
          <span v-else class="weight__num weight__num--empty">未填</span>
          <span v-if="store.data.主角.体重 > 0 && store.data.主角.体重趋势 === '升'" class="tri tri--up">▲</span>
          <span v-if="store.data.主角.体重 > 0 && store.data.主角.体重趋势 === '降'" class="tri tri--down">▼</span>
        </span>
      </div>
      <p v-if="store.data.主角.体重原因" class="weight__why">{{ store.data.主角.体重原因 }}</p>
      <p v-else class="weight__why weight__why--empty">秤上的数字每天都在往上走一点</p>
    </div>

    <div class="fatigue">
      <div class="fatigue__head">
        <span class="fatigue__k">疲劳</span>
        <span class="fatigue__v" :class="{ 'fatigue__v--hot': store.data.身体.疲劳 >= 70 }">
          {{ store.data.身体.疲劳 }}
        </span>
      </div>
      <div class="bar">
        <div class="bar__fill" :class="fatigue_class" :style="{ width: pct(store.data.身体.疲劳) }"></div>
      </div>
      <p class="fatigue__hint">{{ fatigue_hint }}</p>
    </div>

    <section v-if="store.data.身体.伤病" class="block">
      <h4 class="block__h">伤病</h4>
      <p class="prose">{{ store.data.身体.伤病 }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../../store';

const store = useDataStore();

function pct(v: number) {
  return `${Math.max(0, Math.min(100, v))}%`;
}

const state_tone = computed(() => {
  switch (store.data.身体.状态) {
    case '良好':
      return 'ok';
    case '疲惫':
      return 'mid';
    case '透支':
      return 'warn';
    default:
      return 'bad';
  }
});

const state_hint = computed(() => {
  switch (store.data.身体.状态) {
    case '良好':
      return '还撑得住排期';
    case '疲惫':
      return '靠车上那点睡撑着';
    case '透支':
      return '再推一场就会出事';
    default:
      return '已经在用伤换行程';
  }
});

const weight_text = computed(() => {
  const w = store.data.主角.体重;
  if (!w) return '';
  return `${w.toFixed(1)} kg`;
});

const trend_tone = computed(() => {
  switch (store.data.主角.体重趋势) {
    case '升':
      return 'up';
    case '降':
      return 'down';
    default:
      return 'flat';
  }
});

const fatigue_class = computed(() => {
  const f = store.data.身体.疲劳;
  if (f >= 70) return 'bar__fill--danger';
  if (f >= 40) return 'bar__fill--warning';
  return 'bar__fill--primary';
});

const fatigue_hint = computed(() => {  const f = store.data.身体.疲劳;
  if (f >= 85) return '彩排会比正式演出更容易出事';
  if (f >= 70) return '再连一个宣传期，接下来就只剩医院和公告';
  if (f >= 40) return '睡不够，但还不会在镜头前露出来';
  return '今天还有余量';
});
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.state {
  display: flex;
  align-items: baseline;
  gap: 9px;
  padding: 9px 11px;
  border-radius: var(--radius);
  border-left: 3px solid currentcolor;
  background: var(--c-surface-raised);
}

.state__label {
  font-size: 0.92rem;
  font-weight: 700;
}

.state__sub {
  font-size: 0.72rem;
  color: var(--c-text-muted);
}

.state--ok {
  color: var(--c-success);
}

.state--mid {
  color: var(--c-text-muted);
}

.state--warn {
  color: var(--c-warning);
}

.state--bad {
  color: var(--c-danger);
}

.fatigue {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.weight {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 9px 11px;
  border-radius: var(--radius);
  border-left: 3px solid var(--c-border);
  background: var(--c-surface-raised);
}

.weight--up {
  border-left-color: var(--c-danger);
}

.weight--down {
  border-left-color: var(--c-success);
}

.weight__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.weight__k {
  font-size: 0.72rem;
  color: var(--c-text-muted);
}

.weight__v {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
}

.weight__num {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--c-text);
}

.weight__num--empty {
  font-weight: 400;
  color: var(--c-text-faint);
}

.tri {
  font-size: 0.72rem;
  line-height: 1;
  transform: translateY(-1px);
}

.tri--up {
  color: var(--c-danger);
}

.tri--down {
  color: var(--c-success);
}

.weight__why {
  font-size: 0.72rem;
  line-height: 1.5;
  color: var(--c-text-muted);
}

.weight__why--empty {
  color: var(--c-text-faint);
}

.fatigue__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.fatigue__k {
  font-size: 0.72rem;
  color: var(--c-text-muted);
}

.fatigue__v {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--c-text);
}

.fatigue__v--hot {
  color: var(--c-danger);
}

.fatigue__hint {
  margin-top: 3px;
  font-size: 0.72rem;
  color: var(--c-text-faint);
  line-height: 1.5;
}

.block__h {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: var(--c-text-faint);
  margin-bottom: 6px;
}

.prose {
  font-size: 0.78rem;
  line-height: 1.65;
  color: var(--c-text-muted);
  white-space: pre-wrap;
}
</style>
