<template>
  <div class="wrap">
    <!-- 身份：两列发丝线表格，不加框 -->
    <div class="grid2">
      <div class="field">
        <span class="field__k">国籍</span>
        <span class="field__v">{{ store.data.主角.国籍 || '—' }}</span>
      </div>
      <div class="field">
        <span class="field__k">性别</span>
        <span class="field__v">{{ store.data.主角.性别 || '—' }}</span>
      </div>
      <div class="field">
        <span class="field__k">出生</span>
        <span class="field__v field__v--num">{{ store.data.主角.出生日期 || '—' }}</span>
      </div>
      <div class="field">
        <span class="field__k">身高体重</span>
        <span class="field__v field__v--num">{{ height_weight }}</span>
      </div>
    </div>

    <!-- 位置：资源层级做主角，两条细线跟在后面 -->
    <section class="block">
      <h4 class="block__h">位置</h4>

      <div class="tier">
        <span class="tier__v">{{ store.data.主角.事业.资源层级 }}</span>
        <span class="tier__sub">{{ tier_note }}</span>
      </div>

      <div class="meter">
        <div class="meter__row">
          <span class="meter__k">人气</span>
          <span class="meter__v">{{ store.data.主角.事业.人气 }}</span>
        </div>
        <div class="bar">
          <div class="bar__fill bar__fill--accent" :style="{ width: pct(store.data.主角.事业.人气) }"></div>
        </div>
      </div>

      <div class="meter">
        <div class="meter__row">
          <span class="meter__k">实力</span>
          <span class="meter__v">{{ store.data.主角.事业.实力 }}</span>
        </div>
        <div class="bar">
          <div class="bar__fill bar__fill--muted" :style="{ width: pct(store.data.主角.事业.实力) }"></div>
        </div>
      </div>
    </section>

    <section v-if="store.data.主角.体型外貌" class="block">
      <h4 class="block__h">外貌</h4>
      <p class="prose">{{ store.data.主角.体型外貌 }}</p>
    </section>

    <section v-if="store.data.主角.过往经历" class="block">
      <h4 class="block__h">过往</h4>
      <p class="prose">{{ store.data.主角.过往经历 }}</p>
    </section>

    <section v-if="store.data.主角.当前位置" class="block">
      <h4 class="block__h">现在</h4>
      <p class="prose">{{ store.data.主角.当前位置 }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../../store';

const store = useDataStore();

function pct(v: number) {
  return `${Math.max(0, Math.min(100, v))}%`;
}

const height_weight = computed(() => {
  const h = store.data.主角.身高;
  const w = store.data.主角.体重;
  if (h && w) return `${h}cm / ${w.toFixed(1)}kg`;
  const raw = store.data.主角.身高体重;
  if (raw) return raw;
  if (h) return `${h}cm`;
  if (w) return `${w.toFixed(1)}kg`;
  return '—';
});

/** 层级说明书，只用一句话，不评价 */
const tier_note = computed(() => {
  switch (store.data.主角.事业.资源层级) {
    case '素人':
      return '还没进到会被分配资源的名单里';
    case '练习生':
      return '公司内部有编号，对外没有名字';
    case '新人':
      return '能收到行程，但挑不了行程';
    case '上升期':
      return '开始有人来找你，条件还是公司开';
    case '一线':
      return '行程要谈，谈的时候你有话可以讲';
    case '顶流':
      return '很多事不必谈，会有人先替你想好';
    default:
      return '';
  }
});
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── 身份：无框发丝线表格 ── */
.grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 18px;
}

.field {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  padding: 7px 0;
  border-bottom: 0.5px solid var(--c-border);
}

.field__k {
  font-size: 10.5px;
  color: var(--c-text-faint);
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

.field__v {
  font-size: 12.5px;
  color: var(--c-text);
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.field__v--num {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}

/* ── 区块标题：极小的字，全部大写感，靠字距撑起来 ── */
.block__h {
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.16em;
  color: var(--c-text-faint);
  margin-bottom: 9px;
}

/* ── 资源层级：整形，一整行给它 ── */
.tier {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-bottom: 13px;
  margin-bottom: 13px;
  border-bottom: 0.5px solid var(--c-border);
}

.tier__v {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.tier__sub {
  font-size: 11px;
  color: var(--c-text-muted);
  line-height: 1.5;
}

.meter {
  display: flex;
  flex-direction: column;
  gap: 5px;

  & + & {
    margin-top: 12px;
  }
}

.meter__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.meter__k {
  font-size: 11px;
  color: var(--c-text-muted);
}

.meter__v {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--c-text);
  font-variant-numeric: tabular-nums;
}

.prose {
  font-size: 12px;
  line-height: 1.75;
  color: var(--c-text-muted);
  white-space: pre-wrap;
  letter-spacing: 0.01em;
}
</style>
