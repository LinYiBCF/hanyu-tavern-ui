<template>
  <div class="wrap">
    <div class="net" :class="`net--${net_tone}`">
      <div class="net__head">
        <span class="net__k">积蓄</span>
        <span class="net__nums">
          <span class="net__v">{{ krw(store.data.主角.财务.积蓄.数值) }}</span>
          <span class="net__cny">≈ {{ cny_of(store.data.主角.财务.积蓄.数值) }}</span>
        </span>
      </div>
      <p class="net__hint">{{ net_hint }}</p>
    </div>

    <section class="flow">
      <div class="flow__row">
        <span class="flow__k">收入</span>
        <span class="flow__nums">
          <span class="flow__v flow__v--in">{{ krw(store.data.主角.财务.收入.数值) }}</span>
          <span class="flow__cny">≈ {{ cny_of(store.data.主角.财务.收入.数值) }}</span>
        </span>
        <span class="flow__cycle">/ {{ store.data.主角.财务.收入.周期 }}</span>
      </div>
      <p v-if="store.data.主角.财务.收入.备注" class="flow__note">{{ store.data.主角.财务.收入.备注 }}</p>
      <p v-else class="flow__note flow__note--empty">未写来源</p>
    </section>

    <section class="flow">
      <div class="flow__row">
        <span class="flow__k">支出</span>
        <span class="flow__nums">
          <span class="flow__v flow__v--out">{{ krw(store.data.主角.财务.支出.数值) }}</span>
          <span class="flow__cny">≈ {{ cny_of(store.data.主角.财务.支出.数值) }}</span>
        </span>
        <span class="flow__cycle">/ {{ store.data.主角.财务.支出.周期 }}</span>
      </div>
      <p v-if="store.data.主角.财务.支出.备注" class="flow__note">{{ store.data.主角.财务.支出.备注 }}</p>
      <p v-else class="flow__note flow__note--empty">未写去向</p>
    </section>

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
  gap: 12px;
}

.net {
  padding: 9px 11px;
  border-radius: var(--radius);
  border-left: 3px solid currentcolor;
  background: var(--c-surface-raised);
}

.net--ok {
  color: var(--c-primary);
}

.net--warn {
  color: var(--c-warning);
}

.net--bad {
  color: var(--c-danger);
}

.net__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.net__k {
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  color: var(--c-text-faint);
}

.net__nums {
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
}

.net__v {
  font-family: var(--font-mono);
  font-size: 1.05rem;
  font-weight: 700;
}

.net__cny {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  opacity: 0.62;
}

.net__hint {
  margin-top: 5px;
  font-size: 0.72rem;
  color: var(--c-text-muted);
  line-height: 1.5;
}

.flow {
  padding: 8px 11px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  background: var(--c-surface-sunken);
}

.flow__row {
  display: flex;
  align-items: baseline;
  gap: 7px;
}

.flow__k {
  font-size: 0.72rem;
  color: var(--c-text-muted);
  flex-shrink: 0;
}

.flow__nums {
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  margin-left: auto;
}

.flow__v {
  font-family: var(--font-mono);
  font-size: 0.88rem;
}

.flow__v--in {
  color: var(--c-primary);
}

.flow__v--out {
  color: var(--c-accent);
}

.flow__cny {
  font-family: var(--font-mono);
  font-size: 0.64rem;
  color: var(--c-text-faint);
}

.flow__cycle {
  font-size: 0.7rem;
  color: var(--c-text-faint);
  flex-shrink: 0;
}

.flow__note {
  margin-top: 4px;
  font-size: 0.73rem;
  color: var(--c-text-muted);
  line-height: 1.5;
}

.flow__note--empty {
  color: var(--c-text-faint);
  font-style: italic;
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

.guard {
  font-size: 0.72rem;
  color: var(--c-text-faint);
  line-height: 1.55;
  border-top: 1px dashed var(--c-border);
  padding-top: 9px;
}
</style>
