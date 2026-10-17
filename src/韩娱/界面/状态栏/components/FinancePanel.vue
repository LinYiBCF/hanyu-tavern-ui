<template>
  <div class="wrap">
    <!-- 积蓄：整组唯一放大的数字 -->
    <div class="rank">
      <div class="rank__tag">BALANCE</div>
      <div class="rank__hero">
        <span class="rank__n" :class="`rank__n--${net_tone}`">{{ krw(store.data.主角.财务.积蓄.数值) }}</span>
        <span class="rank__u">≈ {{ cny_of(store.data.主角.财务.积蓄.数值) }}</span>
      </div>
      <p class="rank__hint">{{ net_hint }}</p>
    </div>

    <!-- 收支 Bento -->
    <div class="bento">
      <div class="cell">
        <div class="cell__head">
          <span class="cell__k">收入</span>
          <span class="cell__cycle">/ {{ store.data.主角.财务.收入.周期 }}</span>
        </div>
        <span class="cell__v">{{ krw(store.data.主角.财务.收入.数值) }}</span>
        <span class="cell__cny">≈ {{ cny_of(store.data.主角.财务.收入.数值) }}</span>
        <span class="cell__note">{{ store.data.主角.财务.收入.备注 || '未写来源' }}</span>
      </div>

      <div class="cell">
        <div class="cell__head">
          <span class="cell__k">支出</span>
          <span class="cell__cycle">/ {{ store.data.主角.财务.支出.周期 }}</span>
        </div>
        <span class="cell__v">{{ krw(store.data.主角.财务.支出.数值) }}</span>
        <span class="cell__cny">≈ {{ cny_of(store.data.主角.财务.支出.数值) }}</span>
        <span class="cell__note">{{ store.data.主角.财务.支出.备注 || '未写去向' }}</span>
      </div>
    </div>

    <!-- 月净流 -->
    <div class="flow">
      <span class="flow__k">月净流</span>
      <span class="flow__v" :class="`flow__v--${net_tone}`">{{ krw(Math.round(monthly_net)) }}</span>
    </div>

    <div v-if="store.data.主角.财务.积蓄.备注" class="card">
      <div class="card__h">积蓄说明</div>
      <p class="card__p">{{ store.data.主角.财务.积蓄.备注 }}</p>
    </div>

    <p class="guard">{{ guard_hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { cny_of, krw } from '../../currency';
import { useDataStore } from '../../store';

const store = useDataStore();

/** 按周期把收支折成月口径，只为给一句判断，不写回变量 */
function to_month(v: number, cycle: string) {
  if (cycle === '年') return v / 12;
  if (cycle === '季') return v / 3;
  return v;
}

const monthly_net = computed(() => {
  const f = store.data.主角.财务;
  return to_month(f.收入.数值, f.收入.周期) - to_month(f.支出.数值, f.支出.周期);
});

const net_tone = computed(() => {
  const save = store.data.主角.财务.积蓄.数值;
  if (save < 0) return 'bad';
  if (monthly_net.value < 0) return 'warn';
  return 'ok';
});

const net_hint = computed(() => {
  const save = store.data.主角.财务.积蓄.数值;
  if (save < 0) return '已经是负数，这笔账会跟着合约走';
  if (save === 0) return '手上是空的，一次意外就要借';
  if (monthly_net.value < 0) return '每个月都在往外流，撑得住的月份不多';
  return '手上有余量，但余量不等于安全';
});

const guard_hint = computed(() => {
  const save = store.data.主角.财务.积蓄.数值;
  const net = monthly_net.value;
  if (save < 0 && net < 0) return '既在欠又在亏，接下来任何一次中断都会先算成钱。';
  if (save < 0) return '负债还没清，收入只要断一个月就会立刻被催。';
  if (net < 0) return '现金流是负的，积蓄在被慢慢吃掉，不会有人提前通知你。';
  return '这三栏只在剧情里真的有钱进出时才变，不会自己涨。';
});
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── 积蓄卡 ── */
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
  gap: 10px;
  flex-wrap: wrap;
}

.rank__n {
  font-family: var(--font-mono);
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.15;
  font-variant-numeric: tabular-nums;
}

.rank__n--ok {
  color: var(--c-text);
}

.rank__n--warn {
  color: var(--c-warning);
}

.rank__n--bad {
  color: var(--c-danger);
}

.rank__u {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--c-text-faint);
  font-variant-numeric: tabular-nums;
}

.rank__hint {
  font-size: 11.5px;
  color: var(--c-text-muted);
  line-height: 1.55;
}

/* ── Bento ── */
.bento {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.cell {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--c-sunken);
  min-width: 0;
}

.cell__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.cell__k {
  font-size: 12px;
  color: var(--c-text-faint);
}

.cell__cycle {
  font-size: 10px;
  color: var(--c-text-faint);
}

.cell__v {
  font-family: var(--font-mono);
  font-size: 14.5px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--c-text);
  font-variant-numeric: tabular-nums;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cell__cny {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--c-text-faint);
  font-variant-numeric: tabular-nums;
}

.cell__note {
  font-size: 10.5px;
  color: var(--c-text-muted);
  line-height: 1.45;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── 月净流 ── */
.flow {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 12px;
  background: var(--c-sunken);
}

.flow__k {
  font-size: 11.5px;
  color: var(--c-text-faint);
}

.flow__v {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.flow__v--ok {
  color: var(--c-success);
}

.flow__v--warn {
  color: var(--c-warning);
}

.flow__v--bad {
  color: var(--c-danger);
}

/* ── 卡片与文字 ── */
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

.guard {
  padding-top: 10px;
  border-top: 1px solid #efefef;
  font-size: 11px;
  color: var(--c-text-faint);
  line-height: 1.6;
}
</style>
