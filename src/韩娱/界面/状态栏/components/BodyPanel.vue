<template>
  <div class="wrap">
    <!-- 状态：一行字，一个点 -->
    <div class="state">
      <span class="state__dot" :class="`state__dot--${state_tone}`"></span>
      <span class="state__label">{{ store.data.身体.状态 }}</span>
      <span class="state__sub">{{ state_hint }}</span>
    </div>

    <!-- 体重：第一个放大数字 -->
    <div class="weight">
      <div class="weight__head">
        <span class="weight__k">体重</span>
        <span class="weight__v">
          <span v-if="store.data.主角.体重 > 0" class="weight__num">{{ weight_text }}</span>
          <span v-else class="weight__num weight__num--empty">—</span>
          <span
            v-if="store.data.主角.体重 > 0 && store.data.主角.体重趋势 === '升'"
            class="tri tri--up"
            >▲</span
          >
          <span
            v-if="store.data.主角.体重 > 0 && store.data.主角.体重趋势 === '降'"
            class="tri tri--down"
            >▼</span
          >
        </span>
      </div>
      <p v-if="store.data.主角.体重原因" class="weight__why">{{ store.data.主角.体重原因 }}</p>
      <p v-else class="weight__why weight__why--empty">秤上的数字每天都在往上走一点</p>
      <p v-if="store.data.主角.体重 > 0" class="weight__daily">
        <span class="weight__daily-k">日底盘</span>
        <span class="weight__daily-v" :class="`weight__daily-v--${base_tone}`">+{{ base_rate }}</span>
        <span class="weight__daily-kg">kg / 天</span>
        <span v-if="loop_warning" class="weight__loop">· {{ loop_warning }}</span>
      </p>
    </div>

    <!-- 疲劳：第二个放大数字 -->
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

const fatigue_class = computed(() => {
  const f = store.data.身体.疲劳;
  if (f >= 70) return 'bar__fill--danger';
  if (f >= 40) return 'bar__fill--warning';
  return 'bar__fill--accent';
});

const fatigue_hint = computed(() => {
  const f = store.data.身体.疲劳;
  if (f >= 85) return '彩排会比正式演出更容易出事';
  if (f >= 70) return '再连一个宣传期，接下来就只剩医院和公告';
  if (f >= 40) return '睡不够，但还不会在镜头前露出来';
  return '今天还有余量';
});

const base_rate = computed(() => {
  const f = store.data.身体.疲劳;
  let r = 0.1;
  if (f >= 71) r = 0.3;
  else if (f >= 46) r = 0.2;
  if (store.data.身体.状态 === '透支' || store.data.身体.状态 === '伤病') r += 0.1;
  return r.toFixed(1);
});

const base_tone = computed(() => {
  const f = store.data.身体.疲劳;
  if (f >= 71) return 'hot';
  if (f >= 46) return 'warm';
  return 'calm';
});

const loop_warning = computed(() => {
  const f = store.data.身体.疲劳;
  const rising = store.data.主角.体重趋势 === '升';
  const bad_public = ['负面', '高危'].includes(store.data.舆论.风评) || store.data.舆论.热度 >= 70;
  if (rising && bad_public) return '这一圈正在自己转';
  if (f >= 46) return '越累涨得越快';
  return '';
});
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── 状态：极小的一行，不做成卡片 ── */
.state {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 0.5px solid var(--c-border);
}

.state__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.state__dot--ok {
  background: #34c759;
  box-shadow: 0 0 6px rgba(52, 199, 89, 0.5);
}

.state__dot--mid {
  background: #aeaeb2;
}

.state__dot--warn {
  background: #ff9500;
  box-shadow: 0 0 6px rgba(255, 149, 0, 0.5);
}

.state__dot--bad {
  background: #ff3b30;
  box-shadow: 0 0 6px rgba(255, 59, 48, 0.5);
}

.state__label {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.state__sub {
  font-size: 11px;
  color: var(--c-text-muted);
  line-height: 1.4;
}

/* ── 体重 ── */
.weight {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.weight__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.weight__k {
  font-size: 10.5px;
  color: var(--c-text-faint);
  letter-spacing: 0.04em;
}

.weight__v {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
}

.weight__num {
  font-family: var(--font-mono);
  font-size: 30px;
  font-weight: 300;
  letter-spacing: -0.03em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.weight__num--empty {
  color: var(--c-text-faint);
}

.tri {
  font-size: 11px;
  line-height: 1;
  transform: translateY(-4px);
}

.tri--up {
  color: var(--c-danger);
}

.tri--down {
  color: #248a3d;
}

.weight__why {
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--c-text-muted);
}

.weight__why--empty {
  color: var(--c-text-faint);
}

.weight__daily {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
  padding-top: 7px;
  border-top: 0.5px solid var(--c-border);
  font-size: 10.5px;
  line-height: 1.5;
}

.weight__daily-k {
  color: var(--c-text-faint);
  letter-spacing: 0.04em;
}

.weight__daily-v {
  font-family: var(--font-mono);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.weight__daily-v--calm {
  color: var(--c-text-muted);
}

.weight__daily-v--warm {
  color: #c96a00;
}

.weight__daily-v--hot {
  color: var(--c-danger);
}

.weight__daily-kg {
  color: var(--c-text-faint);
}

.weight__loop {
  color: #c96a00;
}

/* ── 疲劳 ── */
.fatigue {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 16px;
  border-top: 0.5px solid var(--c-border);
}

.fatigue__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.fatigue__k {
  font-size: 10.5px;
  color: var(--c-text-faint);
  letter-spacing: 0.04em;
}

.fatigue__v {
  font-family: var(--font-mono);
  font-size: 22px;
  font-weight: 300;
  letter-spacing: -0.02em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.fatigue__v--hot {
  color: var(--c-danger);
}

.fatigue__hint {
  margin-top: 2px;
  font-size: 11px;
  color: var(--c-text-faint);
  line-height: 1.55;
}

/* ── 伤病 ── */
.block__h {
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.16em;
  color: var(--c-text-faint);
  margin-bottom: 9px;
}

.prose {
  font-size: 12px;
  line-height: 1.75;
  color: var(--c-text-muted);
  white-space: pre-wrap;
}
</style>
