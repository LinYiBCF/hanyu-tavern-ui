<template>
  <div class="wrap">
    <div class="grid2">
      <div class="field">
        <span class="field__k">国籍</span>
        <span class="field__v">{{ store.data.主角.国籍 || '未填' }}</span>
      </div>
      <div class="field">
        <span class="field__k">性别</span>
        <span class="field__v">{{ store.data.主角.性别 || '未填' }}</span>
      </div>
      <div class="field">
        <span class="field__k">出生</span>
        <span class="field__v">{{ store.data.主角.出生日期 || '未填' }}</span>
      </div>
      <div class="field">
        <span class="field__k">身高体重</span>
        <span class="field__v">{{ height_weight }}</span>
      </div>
    </div>

    <section class="block">
      <h4 class="block__h">位置</h4>
      <div class="stat">
        <div class="stat__row">
          <span class="stat__k">资源层级</span>
          <span class="stat__v stat__v--hl">{{ store.data.主角.事业.资源层级 }}</span>
        </div>
        <div class="stat__row">
          <span class="stat__k">人气</span>
          <span class="stat__v">{{ store.data.主角.事业.人气 }}</span>
        </div>
        <div class="bar">
          <div class="bar__fill bar__fill--primary" :style="{ width: pct(store.data.主角.事业.人气) }"></div>
        </div>
        <div class="stat__row stat__row--gap">
          <span class="stat__k">实力</span>
          <span class="stat__v">{{ store.data.主角.事业.实力 }}</span>
        </div>
        <div class="bar">
          <div class="bar__fill bar__fill--info" :style="{ width: pct(store.data.主角.事业.实力) }"></div>
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
  return '未填';
});
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 12px;
}

.field {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 4px;
  border-bottom: 1px dashed var(--c-border);
}

.field__k {
  font-size: 0.7rem;
  color: var(--c-text-faint);
  flex-shrink: 0;
}

.field__v {
  font-size: 0.78rem;
  color: var(--c-text);
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.block__h {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: var(--c-text-faint);
  margin-bottom: 7px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.stat__row--gap {
  margin-top: 6px;
}

.stat__k {
  font-size: 0.72rem;
  color: var(--c-text-muted);
}

.stat__v {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--c-text);
}

.stat__v--hl {
  color: var(--c-primary);
  font-weight: 600;
}

.prose {
  font-size: 0.78rem;
  line-height: 1.65;
  color: var(--c-text-muted);
  white-space: pre-wrap;
}
</style>
