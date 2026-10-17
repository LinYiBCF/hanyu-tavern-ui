<template>
  <div class="wrap">
    <!-- 身份四格 + 当前位置 -->
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

      <!-- 当前位置：紧贴出生下方，独占一行 -->
      <div class="cell cell--wide">
        <span class="cell__k">当前位置</span>
        <span class="cell__v">{{ store.data.主角.当前位置 || '—' }}</span>
      </div>
    </div>

    <!-- 人气与实力：双圆环并排 -->
    <div class="rings">
      <div class="ring-card">
        <div class="ring-card__head">
          <span class="ring-card__k">综合人气指数</span>
          <span class="ring-card__badge">{{ pop_delta }}</span>
        </div>
        <GaugeRing :value="store.data.主角.事业.人气" :display="pop_text" :size="92" :stroke="9" color="#1a9c5b" />
        <div class="ring-card__foot">{{ pop_hint }}</div>
      </div>

      <div class="ring-card">
        <div class="ring-card__head">
          <span class="ring-card__k">实测实力评级</span>
          <span class="ring-card__badge ring-card__badge--blue">{{ skill_grade }}</span>
        </div>
        <GaugeRing :value="store.data.主角.事业.实力" :display="skill_display" :size="92" :stroke="9" color="#0071e3" />
        <div class="ring-card__foot">{{ skill_hint }}</div>
      </div>
    </div>

    <!-- 资源层级：左侧四环，右侧具体内容 -->
    <div class="card">
      <div class="card__tag">RESOURCE TIER</div>
      <div class="card__title">{{ store.data.主角.事业.资源层级 }}</div>
      <div class="card__sub">{{ tier_note }}</div>

      <div class="res">
        <div class="res__rings">
          <div v-for="b in resource_bars" :key="b.label" class="res__ring">
            <GaugeRing :value="b.value" :display="b.value" :size="58" :stroke="6.5" :color="b.color" />
            <span class="res__ring-k">{{ b.label }}</span>
            <span class="res__ring-v">{{ b.state }}</span>
          </div>
        </div>

        <div class="res__list">
          <div v-for="b in resource_bars" :key="b.label" class="res__row">
            <span class="res__row-k">{{ b.label }}</span>
            <span class="res__row-v" :class="{ 'res__row-v--empty': !b.detail }">
              {{ b.detail || b.state }}
            </span>
          </div>
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
    <div v-if="store.data.主角.体型外貌" class="bio">
      <div class="bio__row">
        <span class="bio__k">体型外貌</span>
        <p class="bio__v">{{ store.data.主角.体型外貌 }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../../store';
import GaugeRing from './GaugeRing.vue';

const store = useDataStore();

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

const pop_text = computed(() => store.data.主角.事业.人气.toFixed(1));

const skill_display = computed(() => String(store.data.主角.事业.实力));

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
  const detail = store.data.主角.事业.资源详情;
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
    { label: '奢牌代言', value: brand, state: state_of(brand), color: '#a67c00', detail: detail.奢牌代言 },
    { label: '影视资源', value: acting, state: state_of(acting), color: '#c2457e', detail: detail.影视资源 },
    { label: '综艺常驻', value: show, state: state_of(show), color: '#1a9c5b', detail: detail.综艺常驻 },
    { label: '时尚封面', value: cover, state: state_of(cover), color: '#2f6fb5', detail: detail.时尚封面 },
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

/* ── 身份四格 + 当前位置 ── */
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
  min-height: 34px;
  padding: 8px 12px;
  border-radius: 12px;
  background: var(--c-sunken);
}

.cell--wide {
  grid-column: 1 / -1;
  align-items: flex-start;

  .cell__k {
    padding-top: 1px;
  }

  .cell__v {
    white-space: normal;
    line-height: 1.5;
    text-align: right;
  }
}

.cell__k {
  font-size: 12px;
  font-weight: 400;
  color: var(--c-text-faint);
  white-space: nowrap;
  flex-shrink: 0;
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

/* ── 人气 / 实力：双圆环并排 ── */
.rings {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.ring-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 13px 12px 12px;
  border-radius: 14px;
  background: var(--c-card);
  border: 1px solid var(--c-divider);
  min-width: 0;
}

.ring-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  width: 100%;
}

.ring-card__k {
  font-size: 11.5px;
  font-weight: 500;
  color: var(--c-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ring-card__badge {
  font-size: 9.5px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 999px;
  background: #eefaf2;
  color: var(--c-success);
  white-space: nowrap;
  flex-shrink: 0;
}

.ring-card__badge--blue {
  background: var(--c-primary-dim);
  color: var(--c-primary);
}

.ring-card__foot {
  font-size: 11px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--c-text-faint);
  text-align: center;
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

/* ── 资源：左四环 + 右清单 ── */
.res {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-top: 12px;
}

.res__rings {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex-shrink: 0;
}

.res__ring {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  width: 58px;
}

.res__ring-k {
  font-size: 10px;
  font-weight: 500;
  color: var(--c-text-muted);
  white-space: nowrap;
  text-align: center;
}

.res__ring-v {
  font-size: 9px;
  font-weight: 500;
  color: var(--c-text-faint);
  white-space: nowrap;
}

.res__list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0;
  flex: 1;
  min-width: 0;
  padding-top: 2px;
}

.res__row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 5px 0;
  border-bottom: 1px solid var(--c-divider);

  &:last-child {
    border-bottom: none;
  }
}

.res__row-k {
  font-size: 10.5px;
  font-weight: 400;
  color: var(--c-text-faint);
  white-space: nowrap;
  flex-shrink: 0;
  width: 52px;
}

.res__row-v {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--c-text);
  line-height: 1.45;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.res__row-v--empty {
  color: var(--c-text-faint);
  font-weight: 400;
}

@media (max-width: 560px) {
  .res {
    flex-direction: column;
    gap: 10px;
  }

  .res__rings {
    width: 100%;
    justify-content: space-between;
  }

  .res__row-k {
    width: auto;
  }
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
