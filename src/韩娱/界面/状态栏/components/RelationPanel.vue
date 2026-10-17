<template>
  <div class="wrap">
    <section class="block">
      <h4 class="block__h">恋爱线</h4>
      <p v-if="!lovers.length" class="empty">还没有一条线走到需要记下来的程度</p>
      <div v-else class="cards">
        <article v-for="l in lovers" :key="l.name" class="card">
          <div class="card__head">
            <span class="card__name">{{ l.name }}</span>
            <span class="card__stage" :class="`card__stage--${l.stage_tone}`">{{ l.关系阶段 }}</span>
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
              <div class="bar__fill bar__fill--primary" :style="{ width: pct(l.信任度) }"></div>
            </div>
            <span class="mini__v">{{ l.信任度 }}</span>
          </div>
          <div class="mini">
            <span class="mini__k">隐蔽</span>
            <div class="bar mini__bar">
              <div class="bar__fill bar__fill--info" :style="{ width: pct(l.隐蔽度) }"></div>
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
            <div class="bar__fill bar__fill--warning" :style="{ width: pct(r.张力) }"></div>
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
  gap: 14px;
}

.block__h {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: var(--c-text-faint);
  margin-bottom: 7px;
}

.empty {
  font-size: 0.74rem;
  color: var(--c-text-faint);
  font-style: normal;
}

.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.card {
  padding: 9px 10px;
  background: var(--c-surface-raised);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
}

.card__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 7px;
}

.card__name {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-text);
}

.card__stage {
  font-size: 0.66rem;
  padding: 1px 7px;
  border-radius: 999px;
  border: 1px solid currentcolor;
}

.card__stage--cool {
  color: var(--c-text-muted);
}

.card__stage--warm {
  color: var(--c-warning);
}

.card__stage--hot {
  color: var(--c-accent);
}

.mini {
  display: grid;
  grid-template-columns: 32px 1fr 24px;
  gap: 8px;
  align-items: center;
  margin-bottom: 4px;
}

.mini__k {
  font-size: 0.66rem;
  color: var(--c-text-faint);
}

.mini__bar {
  height: 4px;
}

.mini__v {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  color: var(--c-text-muted);
  text-align: right;
}

.mini__v--hot {
  color: var(--c-danger);
}

.warn {
  margin-top: 6px;
  font-size: 0.68rem;
  color: var(--c-danger);
}

.rel {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.rel__row {
  display: grid;
  grid-template-columns: 1fr auto 64px 22px;
  gap: 7px;
  align-items: center;
}

.rel__name {
  font-size: 0.76rem;
  color: var(--c-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag {
  font-size: 0.64rem;
  padding: 0 6px;
  border-radius: 999px;
  border: 1px solid currentcolor;
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
  height: 4px;
}

.rel__v {
  font-family: var(--font-mono);
  font-size: 0.64rem;
  color: var(--c-text-faint);
  text-align: right;
}
</style>
