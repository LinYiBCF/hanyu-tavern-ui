<template>
  <div class="wrap">
    <!-- 状态 -->
    <div class="state">
      <span class="state__dot" :class="`state__dot--${state_tone}`"></span>
      <span class="state__label">{{ store.data.身体.状态 }}</span>
      <span class="state__sub">{{ state_hint }}</span>
    </div>

    <!-- 体重卡 -->
    <div class="rank">
      <div class="rank__tag">BODY WEIGHT</div>
      <div class="rank__hero">
        <span class="rank__n">
          <template v-if="store.data.主角.体重 > 0">{{ weight_text }}</template>
          <template v-else>—</template>
        </span>
        <span v-if="store.data.主角.体重 > 0" class="rank__u">kg</span>
        <span v-if="store.data.主角.体重 > 0 && store.data.主角.体重趋势 === '升'" class="tri tri--up">▲</span>
        <span v-if="store.data.主角.体重 > 0 && store.data.主角.体重趋势 === '降'" class="tri tri--down">▼</span>
      </div>
      <p class="rank__hint">{{ store.data.主角.体重原因 || '秤上的数字每天都在往上走一点' }}</p>

      <div v-if="store.data.主角.体重 > 0" class="daily">
        <span class="daily__k">日底盘</span>
        <span class="daily__v" :class="`daily__v--${base_tone}`">+{{ base_rate }}</span>
        <span class="daily__kg">kg / 天</span>
        <span v-if="loop_warning" class="daily__loop">· {{ loop_warning }}</span>
      </div>
    </div>

    <!-- 疲劳卡 -->
    <div class="fatigue">
      <div class="fatigue__head">
        <span class="fatigue__k">疲劳</span>
        <span class="fatigue__v" :class="{ 'fatigue__v--hot': store.data.身体.疲劳 >= 70 }">
          {{ store.data.身体.疲劳 }}<span class="fatigue__u">/100</span>
        </span>
      </div>
      <div class="track">
        <div class="track__fill" :class="fatigue_class" :style="{ width: pct(store.data.身体.疲劳) }"></div>
      </div>
      <p class="fatigue__hint">{{ fatigue_hint }}</p>
    </div>

    <!-- 伤病 -->
    <div v-if="store.data.身体.伤病" class="card">
      <div class="card__h">伤病</div>
      <p class="card__p">{{ store.data.身体.伤病 }}</p>
    </div>
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
  return w.toFixed(1);
});

const fatigue_class = computed(() => {
  const f = store.data.身体.疲劳;
  if (f >= 70) return 'track__fill--danger';
  if (f >= 40) return 'track__fill--warn';
  return '';
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
  gap: 12px;
}

/* ── 状态 ── */
.state {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 14px;
  border-radius: 12px;
  background: var(--c-sunken);
}

.state__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.state__dot--ok {
  background: var(--c-ok);
  box-shadow: 0 0 7px rgba(52, 199, 89, 0.5);
}

.state__dot--mid {
  background: #c7c7cc;
}

.state__dot--warn {
  background: var(--c-warning);
  box-shadow: 0 0 7px rgba(249, 115, 22, 0.45);
}

.state__dot--bad {
  background: var(--c-danger);
  box-shadow: 0 0 7px rgba(225, 29, 72, 0.45);
}

.state__label {
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: var(--c-text);
}

.state__sub {
  font-size: 11.5px;
  color: var(--c-text-muted);
  line-height: 1.45;
}

/* ── 体重卡 ── */
.rank {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  gap: 6px;
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
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--c-text-faint);
}

.tri {
  font-size: 13px;
  line-height: 1;
  transform: translateY(-4px);
}

.tri--up {
  color: var(--c-danger);
}

.tri--down {
  color: var(--c-success);
}

.rank__hint {
  font-size: 11.5px;
  color: var(--c-text-muted);
  line-height: 1.55;
}

.daily {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 4px;
  padding-top: 9px;
  border-top: 1px solid #efefef;
  font-size: 11px;
  line-height: 1.55;
}

.daily__k {
  color: var(--c-text-faint);
}

.daily__v {
  font-family: var(--font-mono);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.daily__v--calm {
  color: var(--c-text-muted);
}

.daily__v--warm {
  color: var(--c-warning);
}

.daily__v--hot {
  color: var(--c-danger);
}

.daily__kg {
  color: var(--c-text-faint);
}

.daily__loop {
  color: var(--c-warning);
  font-weight: 600;
}

/* ── 疲劳 ── */
.fatigue {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  border: 1px solid var(--c-border);
  border-radius: 16px;
  background: #ffffff;
}

.fatigue__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.fatigue__k {
  font-size: 11.5px;
  color: var(--c-text-faint);
}

.fatigue__v {
  font-family: var(--font-mono);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: var(--c-text);
}

.fatigue__v--hot {
  color: var(--c-danger);
}

.fatigue__u {
  margin-left: 2px;
  font-size: 11px;
  font-weight: 500;
  color: var(--c-text-faint);
}

.fatigue__hint {
  font-size: 11px;
  color: var(--c-text-faint);
  line-height: 1.55;
}

/* ── 伤病卡 ── */
.card {
  padding: 12px 14px;
  border-radius: 14px;
  background: var(--c-sunken);
}

.card__h {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--c-text-faint);
  margin-bottom: 4px;
}

.card__p {
  font-size: 12px;
  line-height: 1.55;
  color: #3a3a3c;
  white-space: pre-wrap;
}

/* ── 通用条 ── */
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

.track__fill--warn {
  background: var(--c-warning);
}

.track__fill--danger {
  background: var(--c-danger);
}
</style>
