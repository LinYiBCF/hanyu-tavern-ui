<template>
  <div class="wrap">
    <section class="block">
      <h4 class="block__h">恋爱线</h4>
      <p v-if="!lovers.length" class="empty">还没有一条线走到需要记下来的程度</p>
      <div v-else class="lines">
        <article v-for="l in lovers" :key="l.name" class="line">
          <div class="line__head">
            <span class="line__name">{{ l.name }}</span>
            <span class="line__stage" :class="`line__stage--${l.stage_tone}`">{{ l.关系阶段 }}</span>
          </div>

          <div class="mini">
            <span class="mini__k">好感</span>
            <div class="bar mini__bar">
              <div class="bar__fill bar__fill--accent" :style="{ width: pct(l.好感度) }"></div>
            </div>
            <span class="mini__v">{{ l.好感度 }}</span>
          </div>
          <div class="mini">
            <span class="mini__k">信任</span>
            <div class="bar mini__bar">
              <div class="bar__fill bar__fill--muted" :style="{ width: pct(l.信任度) }"></div>
            </div>
            <span class="mini__v">{{ l.信任度 }}</span>
          </div>
          <div class="mini">
            <span class="mini__k">隐蔽</span>
            <div class="bar mini__bar">
              <div class="bar__fill bar__fill--muted" :style="{ width: pct(l.隐蔽度) }"></div>
            </div>
            <span class="mini__v">{{ l.隐蔽度 }}</span>
          </div>
          <div class="mini">
            <span class="mini__k">曝险</span>
            <div class="bar mini__bar">
              <div class="bar__fill" :class="risk_class(l.曝光风险)" :style="{ width: pct(l.曝光风险) }"></div>
            </div>
            <span class="mini__v" :class="{ 'mini__v--hot': l.曝光风险 >= 70 }">{{ l.曝光风险 }}</span>
          </div>

          <p v-if="l.曝光风险 >= 70" class="warn">已经进到会被拍到的距离</p>
        </article>
      </div>
    </section>

    <section class="block">
      <h4 class="block__h">关系网</h4>
      <p v-if="!relations.length" class="empty">暂时没有需要标记立场的人</p>
      <div v-else class="rel">
        <div v-for="r in relations" :key="r.name" class="rel__row">
          <span class="rel__name">{{ r.name }}</span>
          <span class="tag" :class="`tag--${r.tone}`">{{ r.立场 }}</span>
          <div class="bar rel__bar">
            <div class="bar__fill bar__fill--muted" :style="{ width: pct(r.张力) }"></div>
          </div>
          <span class="rel__v">{{ r.张力 }}</span>
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

function risk_class(v: number) {
  if (v >= 70) return 'bar__fill--danger';
  if (v >= 40) return 'bar__fill--warning';
  return 'bar__fill--muted';
}

const lovers = computed(() =>
  _.entries(store.data.恋爱线)
    .map(([name, v]) => ({
      name,
      ...v,
      stage_tone:
        v.关系阶段 === '恋人' || v.关系阶段 === '纠缠'
          ? 'hot'
          : v.关系阶段 === '暧昧'
            ? 'warm'
            : 'cool',
    }))
    .sort((a, b) => b.好感度 - a.好感度),
);

const relations = computed(() =>
  _.entries(store.data.关系网)
    .map(([name, v]) => ({
      name,
      ...v,
      tone: v.立场 === '支持' ? 'ok' : v.立场 === '敌意' ? 'bad' : 'mid',
    }))
    .sort((a, b) => b.张力 - a.张力),
);
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.block__h {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--c-text-faint);
  margin-bottom: 11px;
}

.empty {
  font-size: 12px;
  font-weight: 500;
  color: var(--c-text-faint);
  line-height: 1.65;
}

/* ── 恋爱线 ── */
.lines {
  display: flex;
  flex-direction: column;
}

.line {
  padding: 14px 0;
  border-bottom: 1px solid var(--c-border);

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.line__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 11px;
}

.line__name {
  font-size: 15.5px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--c-text);
}

.line__stage {
  font-size: 10px;
  font-weight: 650;
  padding: 2.5px 9px;
  border-radius: 999px;
  background: var(--c-sunken);
  white-space: nowrap;
}

.line__stage--cool {
  color: var(--c-text-muted);
}

.line__stage--warm {
  color: var(--c-warning);
}

.line__stage--hot {
  color: var(--c-primary);
  background: var(--c-primary-dim);
}

.mini {
  display: grid;
  grid-template-columns: 30px 1fr 28px;
  gap: 11px;
  align-items: center;

  & + & {
    margin-top: 7px;
  }
}

.mini__k {
  font-size: 10.5px;
  font-weight: 550;
  color: var(--c-text-faint);
  letter-spacing: 0.04em;
}

.mini__bar {
  height: 3px;
}

.mini__v {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--c-text-muted);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.mini__v--hot {
  color: var(--c-danger);
}

.warn {
  margin-top: 9px;
  font-size: 11px;
  font-weight: 600;
  color: var(--c-danger);
  letter-spacing: 0.01em;
}

/* ── 关系网 ── */
.rel {
  display: flex;
  flex-direction: column;
}

.rel__row {
  display: grid;
  grid-template-columns: 1fr auto 60px 24px;
  gap: 10px;
  align-items: center;
  padding: 9px 0;
  border-bottom: 1px solid var(--c-border);

  &:last-child {
    border-bottom: none;
  }
}

.rel__name {
  font-size: 12.5px;
  font-weight: 550;
  color: var(--c-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag {
  font-size: 10px;
  font-weight: 650;
  padding: 1.5px 8px;
  border-radius: 999px;
  background: var(--c-sunken);
  white-space: nowrap;
}

.tag--ok {
  color: var(--c-success);
}

.tag--mid {
  color: var(--c-text-muted);
}

.tag--bad {
  color: var(--c-danger);
}

.rel__bar {
  height: 3px;
}

.rel__v {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 600;
  color: var(--c-text-faint);
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>
