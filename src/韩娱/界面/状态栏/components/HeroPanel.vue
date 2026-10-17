<template>
  <div class="wrap">
    <!-- 身份四格 -->
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

    <!-- 人气与实力两条 -->
    <div class="metrics">
      <div class="metric">
        <div class="metric__head">
          <span class="metric__k">综合人气指数</span>
          <span class="metric__badge">{{ pop_delta }}</span>
        </div>
        <div class="metric__body">
          <strong class="metric__n">{{ pop_text }}</strong>
          <span class="metric__u">/ 100</span>
        </div>
        <div class="track">
          <div class="track__fill track__fill--green" :style="{ width: pct(store.data.主角.事业.人气) }"></div>
        </div>
        <div class="metric__foot">{{ pop_hint }}</div>
      </div>

      <div class="metric">
        <div class="metric__head">
          <span class="metric__k">实测实力评级</span>
          <span class="metric__badge metric__badge--blue">{{ skill_grade }}</span>
        </div>
        <div class="metric__body">
          <strong class="metric__n">{{ store.data.主角.事业.实力 }}</strong>
          <span class="metric__u">/ 100</span>
        </div>
        <div class="track">
          <div class="track__fill track__fill--blue" :style="{ width: pct(store.data.主角.事业.实力) }"></div>
        </div>
        <div class="metric__foot">{{ skill_hint }}</div>
      </div>
    </div>

    <!-- 资源层级分布 -->
    <div class="card">
      <div class="card__tag">RESOURCE TIER</div>
      <div class="card__title">{{ store.data.主角.事业.资源层级 }}</div>
      <div class="card__sub">{{ tier_note }}</div>
      <div class="bars">
        <div v-for="b in resource_bars" :key="b.label" class="bars__row">
          <span class="bars__k">{{ b.label }}</span>
          <div class="bars__track">
            <div class="bars__fill" :style="{ width: b.value + '%' }"></div>
          </div>
          <span class="bars__v">{{ b.state }}</span>
        </div>
      </div>
    </div>

    <!-- 个人属性与认知 -->
    <div class="card card--plain">
      <div class="card__tag">PROFILE</div>
      <div class="attrs">
        <div class="attrs__row">
          <span class="attrs__k">身份定位</span>
          <span class="attrs__v">{{ store.data.主角.身份 || '尚未确定' }}</span>
        </div>
        <div class="attrs__row">
          <span class="attrs__k">所属社</span>
          <span class="attrs__v">{{ store.data.主角.所属社 || '无所属' }}</span>
        </div>
        <div class="attrs__row">
          <span class="attrs__k">公众形象</span>
          <span class="attrs__v">{{ store.data.舆论.风评 || '中立' }}</span>
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

const pop_text = computed(() => store.data.主角.事业.人气.toFixed(1));

const pop_delta = computed(() => {
  const v = store.data.主角.事业.人气;
  if (v === 0) return '未入列';
  if (v >= 85) return 'S 级关注';
  if (v >= 65) return 'A 级关注';
  if (v >= 40) return 'B 级关注';
  if (v >= 20) return 'C 级关注';
  return '低位';
});

const pop_hint = computed(() => {
  const v = store.data.主角.事业.人气;
  if (v === 0) return '还没有人替你转发';
  if (v < 20) return '认识你的人集中在同一个论坛里';
  if (v < 40) return '已有固定的一批人，还撑不起场面';
  if (v < 65) return '名字开始离开粉圈往外传';
  if (v < 85) return '代言方会主动来问档期';
  return '你说一句话，隔天全行业都在讨论';
});

const skill_grade = computed(() => {
  const v = store.data.主角.事业.实力;
  if (v === 0) return 'UNRATED';
  if (v >= 90) return 'ACE';
  if (v >= 75) return 'A';
  if (v >= 55) return 'B';
  if (v >= 35) return 'C';
  return 'D';
});

const skill_hint = computed(() => {
  const v = store.data.主角.事业.实力;
  if (v === 0) return '没有可参照的现场记录';
  if (v < 35) return '还在练，还上不了大台';
  if (v < 55) return '上台能完成，但没人会为这一段单独鼓掌';
  if (v < 75) return '能扛住一段副歌，再多就会露';
  if (v < 90) return '现场与录音差别不大，公司敢给你麦';
  return '开麦就是卖点，别人会拿你的舞台当标准';
});

/** 资源四路的粗分档，只看层级与舆论，不做精确测算 */
const resource_bars = computed(() => {
  const tier = store.data.主角.事业.资源层级;
  const heat = store.data.主角.事业.人气;
  const favor = store.data.舆论.风评;
  const tier_base: Record<string, number> = {
    素人: 4,
    练习生: 10,
    新人: 28,
    上升期: 48,
    一线: 72,
    顶流: 92,
  };
  const base = tier_base[tier] ?? 4;
  const adjust = (delta: number) => Math.max(0, Math.min(100, Math.round(base + delta)));

  const state_of = (v: number) => {
    if (v >= 75) return '领先';
    if (v >= 45) return '在列';
    if (v >= 20) return '接触中';
    return '未启动';
  };

  const brand = adjust(heat >= 60 ? 10 : heat >= 30 ? 0 : -8);
  const acting = adjust(tier === '一线' || tier === '顶流' ? 4 : -18);
  const show = adjust(favor === '正面' ? 8 : favor === '负面' || favor === '高危' ? -14 : 0);
  const cover = adjust(heat >= 80 ? 8 : -6);

  return [
    { label: '奢牌代言', value: brand, state: state_of(brand) },
    { label: '影视资源', value: acting, state: state_of(acting) },
    { label: '综艺常驻', value: show, state: state_of(show) },
    { label: '时尚封面', value: cover, state: state_of(cover) },
  ];
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
  gap: 10px;
  padding-bottom: 4px;
}

/* ── 身份四格 ── */
.bento {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 12px;
  background: var(--c-sunken);
}

.cell__k {
  font-size: 12px;
  font-weight: 400;
  color: var(--c-text-faint);
  white-space: nowrap;
}

.cell__v {
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text);
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cell__v--num {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

/* ── 人气 / 实力 ── */
.metrics {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 13px 15px;
  border-radius: 14px;
  background: var(--c-card);
  border: 1px solid var(--c-divider);
}

.metric__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.metric__k {
  font-size: 11.5px;
  font-weight: 500;
  color: var(--c-text-muted);
}

.metric__badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  background: #eefaf2;
  color: var(--c-success);
  white-space: nowrap;
}

.metric__badge--blue {
  background: var(--c-primary-dim);
  color: var(--c-primary);
}

.metric__body {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.metric__n {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--c-text);
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.metric__u {
  font-size: 11px;
  font-weight: 400;
  color: var(--c-text-faint);
}

.metric__foot {
  font-size: 11px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--c-text-faint);
}

.track {
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  overflow: hidden;
}

.track__fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s var(--ease);
}

.track__fill--green {
  background: var(--c-ok);
}

.track__fill--blue {
  background: var(--c-primary);
}

/* ── 卡片 ── */
.card {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 14px 15px;
  border-radius: 14px;
  background: var(--c-card);
  border: 1px solid var(--c-divider);
}

.card--plain {
  gap: 9px;
}

.card__tag {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--c-text-faint);
}

.card__title {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--c-text);
  margin-top: 3px;
  line-height: 1.2;
}

.card__sub {
  font-size: 11.5px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--c-text-muted);
}

.bars {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-top: 10px;
}

.bars__row {
  display: grid;
  grid-template-columns: 66px 1fr 40px;
  align-items: center;
  gap: 9px;
}

.bars__k {
  font-size: 11px;
  font-weight: 400;
  color: var(--c-text-muted);
  white-space: nowrap;
}

.bars__track {
  height: 4px;
  border-radius: 2px;
  background: #e5e7eb;
  overflow: hidden;
}

.bars__fill {
  height: 100%;
  border-radius: 2px;
  background: var(--c-text);
  transition: width 0.5s var(--ease);
}

.bars__v {
  font-size: 10px;
  font-weight: 500;
  color: var(--c-text-faint);
  text-align: right;
  white-space: nowrap;
}

/* ── 属性 ── */
.attrs {
  display: flex;
  flex-direction: column;
}

.attrs__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 7px 0;
  border-bottom: 1px solid var(--c-divider);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 2px;
  }
}

.attrs__k {
  font-size: 11.5px;
  font-weight: 400;
  color: var(--c-text-faint);
  white-space: nowrap;
}

.attrs__v {
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text);
  text-align: right;
}

/* ── 文本卡 ── */
.bio {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 12px 14px;
  border-radius: 14px;
  background: var(--c-sunken);
}

.bio__row {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.bio__k {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--c-text-faint);
}

.bio__v {
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.62;
  color: var(--c-text-body);
}
</style>
