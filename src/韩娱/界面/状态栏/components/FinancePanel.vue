<template>
  <div class="wrap">
    <!-- 积蓄：整组唯一放大的数字 -->
    <div class="net">
      <div class="net__head">
        <span class="net__k">积蓄</span>
        <span class="net__v" :class="`net__v--${net_tone}`">{{ krw(store.data.主角.财务.积蓄.数值) }}</span>
      </div>
      <p class="net__cny">≈ {{ cny_of(store.data.主角.财务.积蓄.数值) }}</p>
      <p class="net__hint">{{ net_hint }}</p>
    </div>

    <div class="flows">
      <div class="flow">
        <div class="flow__row">
          <span class="flow__k">收入</span>
          <span class="flow__v">{{ krw(store.data.主角.财务.收入.数值) }}</span>
          <span class="flow__cycle">/ {{ store.data.主角.财务.收入.周期 }}</span>
        </div>
        <div class="flow__sub">
          <span class="flow__cny">≈ {{ cny_of(store.data.主角.财务.收入.数值) }}</span>
          <span class="flow__note">{{ store.data.主角.财务.收入.备注 || '未写来源' }}</span>
        </div>
      </div>

      <div class="flow">
        <div class="flow__row">
          <span class="flow__k">支出</span>
          <span class="flow__v">{{ krw(store.data.主角.财务.支出.数值) }}</span>
          <span class="flow__cycle">/ {{ store.data.主角.财务.支出.周期 }}</span>
        </div>
        <div class="flow__sub">
          <span class="flow__cny">≈ {{ cny_of(store.data.主角.财务.支出.数值) }}</span>
          <span class="flow__note">{{ store.data.主角.财务.支出.备注 || '未写去向' }}</span>
        </div>
      </div>
    </div>

    <section v-if="store.data.主角.财务.积蓄.备注" class="block">
      <h4 class="block__h">积蓄说明</h4>
      <p class="prose">{{ store.data.主角.财务.积蓄.备注 }}</p>
    </section>

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
  gap: 22px;
}

/* ── 积蓄 ── */
.net {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--c-border);
}

.net__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.net__k {
  font-size: 11px;
  font-weight: 550;
  color: var(--c-text-faint);
  letter-spacing: 0.05em;
}

.net__v {
  font-family: var(--font-mono);
  font-size: 34px;
  font-weight: 400;
  letter-spacing: -0.04em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.net__v--ok {
  color: var(--c-text);
}

.net__v--warn {
  color: var(--c-warning);
}

.net__v--bad {
  color: var(--c-danger);
}

.net__cny {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  color: var(--c-text-faint);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.net__hint {
  margin-top: 5px;
  font-size: 12px;
  font-weight: 500;
  color: var(--c-text-muted);
  line-height: 1.65;
}

/* ── 收支 ── */
.flows {
  display: flex;
  flex-direction: column;
}

.flow {
  padding: 13px 0;
  border-bottom: 1px solid var(--c-border);

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.flow__row {
  display: flex;
  align-items: baseline;
  gap: 9px;
}

.flow__k {
  font-size: 11.5px;
  font-weight: 550;
  color: var(--c-text-muted);
  flex-shrink: 0;
}

.flow__v {
  font-family: var(--font-mono);
  font-size: 17px;
  font-weight: 500;
  letter-spacing: -0.015em;
  margin-left: auto;
  font-variant-numeric: tabular-nums;
  color: var(--c-text);
}

.flow__cycle {
  font-size: 10.5px;
  font-weight: 550;
  color: var(--c-text-faint);
  flex-shrink: 0;
  width: 22px;
  text-align: left;
}

.flow__sub {
  display: flex;
  align-items: baseline;
  gap: 11px;
  margin-top: 5px;
}

.flow__cny {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 500;
  color: var(--c-text-faint);
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.flow__note {
  font-size: 11.5px;
  font-weight: 500;
  color: var(--c-text-faint);
  line-height: 1.55;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.block__h {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--c-text-faint);
  margin-bottom: 10px;
}

.prose {
  font-size: 12.5px;
  line-height: 1.8;
  color: var(--c-text-muted);
  white-space: pre-wrap;
  font-weight: 500;
}

.guard {
  font-size: 11.5px;
  font-weight: 500;
  color: var(--c-text-faint);
  line-height: 1.65;
  border-top: 1px solid var(--c-border);
  padding-top: 14px;
}
</style>
