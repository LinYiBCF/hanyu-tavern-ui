<template>
  <div class="wrap">
    <!-- 身份：Bento 方格 -->
    <div class="bento">
      <div class="cell">
        <span class="cell__k">国籍</span>
        <span class="cell__v">{{ store.data.主角.国籍 || '—' }}</span>
      </div>
      <div class="cell">
        <span class="cell__k">性别</span>
        <span class="cell__v">{{ store.data.主角.性别 || '—' }}</span>
      </div>
      <div class="cell">
        <span class="cell__k">出生</span>
        <span class="cell__v cell__v--num">{{ store.data.主角.出生日期 || '—' }}</span>
      </div>
      <div class="cell">
        <span class="cell__k">身高体重</span>
        <span class="cell__v cell__v--num">{{ height_weight }}</span>
      </div>
    </div>

    <!-- 资源等级卡 -->
    <div class="rank">
      <div class="rank__tag">RESOURCE LEVEL</div>
      <div class="rank__title">{{ store.data.主角.事业.资源层级 }}</div>
      <div class="rank__sub">{{ tier_note }}</div>
    </div>

    <!-- 人气与实力 -->
    <div class="metrics">
      <div class="metric">
        <div class="metric__meta">
          <span class="metric__k">人气 (Popularity)</span>
          <strong class="metric__v">{{ store.data.主角.事业.人气 }} / 100</strong>
        </div>
        <div class="track">
          <div class="track__fill" :style="{ width: pct(store.data.主角.事业.人气) }"></div>
        </div>
      </div>

      <div class="metric">
        <div class="metric__meta">
          <span class="metric__k">实力 (Vocal &amp; Dance)</span>
          <strong class="metric__v">{{ store.data.主角.事业.实力 }} / 100</strong>
        </div>
        <div class="track">
          <div class="track__fill track__fill--light" :style="{ width: pct(store.data.主角.事业.实力) }"></div>
        </div>
      </div>
    </div>

    <!-- 文本速览 -->
    <div v-if="has_bio" class="bio">
      <div v-if="store.data.主角.体型外貌" class="bio__row">
        <span class="bio__k">体型外貌</span>
        <p class="bio__v">{{ store.data.主角.体型外貌 }}</p>
      </div>
      <div v-if="store.data.主角.过往经历" class="bio__row">
        <span class="bio__k">过往经历</span>
        <p class="bio__v">{{ store.data.主角.过往经历 }}</p>
      </div>
      <div v-if="store.data.主角.当前位置" class="bio__row">
        <span class="bio__k">当前位置</span>
        <p class="bio__v">{{ store.data.主角.当前位置 }}</p>
      </div>
    </div>
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

const has_bio = computed(
  () =>
    Boolean(store.data.主角.体型外貌) ||
    Boolean(store.data.主角.过往经历) ||
    Boolean(store.data.主角.当前位置),
);

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
  gap: 12px;
}

/* ── Bento 方格 ── */
.bento {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 12px;
  background: var(--c-sunken);
}

.cell__k {
  font-size: 12px;
  font-weight: 400;
  color: var(--c-text-faint);
  flex-shrink: 0;
}

.cell__v {
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cell__v--num {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 11.5px;
}

/* ── 资源等级卡 ── */
.rank {
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

.rank__title {
  margin: 4px 0 2px;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.15;
  color: var(--c-text);
}

.rank__sub {
  font-size: 11.5px;
  color: var(--c-text-muted);
  line-height: 1.5;
}

/* ── 指标 ── */
.metrics {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric__meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.metric__k {
  font-size: 11.5px;
  color: var(--c-text-muted);
}

.metric__v {
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 600;
  color: var(--c-text);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

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

.track__fill--light {
  background: var(--c-text-faint);
}

/* ── 文本卡 ── */
.bio {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 14px;
  background: var(--c-sunken);
}

.bio__row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bio__k {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--c-text-faint);
}

.bio__v {
  font-size: 12px;
  line-height: 1.5;
  color: #3a3a3c;
  white-space: pre-wrap;
}
</style>
