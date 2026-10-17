<template>
  <div class="ap-scope" :class="`ap-font--${font_style}`">
    <!-- ── 折叠态：液态玻璃悬浮灵动岛 ── -->
    <button
      type="button"
      class="ap-island"
      :class="{ 'ap-island--open': is_open }"
      :aria-expanded="is_open"
      @click="toggle()"
    >
      <span class="ap-island__sheen"></span>
      <span class="ap-island__led" :class="`ap-island__led--${dot_tone}`"></span>
      <span class="ap-island__name">{{ name_display }}</span>
      <span v-if="role_line" class="ap-island__role">{{ role_line }}</span>
      <span class="ap-island__clock">{{ clock_line }}</span>
      <svg class="ap-island__caret" :class="{ 'ap-island__caret--up': is_open }" viewBox="0 0 24 24">
        <path d="M7 10l5 5 5-5" />
      </svg>
    </button>

    <!-- ── 展开态：4:3 分栏 ── -->
    <div class="ap-stage" :class="{ 'ap-stage--open': is_open }">
      <div class="ap-stage__clip">
        <div class="ap-frame">
          <!-- 顶部通透胶囊栏 -->
          <header class="ap-top">
            <div class="ap-top__left">
              <span class="ap-top__dot" :class="`ap-top__dot--${dot_tone}`"></span>
              <span class="ap-top__name">{{ name_display }}</span>
            </div>

            <div class="ap-top__center">
              <span class="ap-pill">{{ store.data.世界.世代 }}</span>
              <span class="ap-pill">{{ store.data.世界.当前场域 }}</span>
              <span v-if="store.data.世界.当前场景" class="ap-pill ap-pill--on">{{
                store.data.世界.当前场景
              }}</span>
            </div>

            <div class="ap-top__right">{{ clock_line }}</div>
          </header>

          <!-- 主体分栏 -->
          <div class="ap-split">
            <!-- 左侧垂直子菜单 -->
            <nav class="ap-sidebar" role="tablist">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                type="button"
                class="ap-nav"
                :class="{ 'ap-nav--on': active_tab === tab.id }"
                role="tab"
                :aria-selected="active_tab === tab.id"
                @click="active_tab = tab.id"
              >
                <svg class="ap-nav__icon" viewBox="0 0 24 24" v-html="tab.svg"></svg>
                <span class="ap-nav__label">{{ tab.label }}</span>
              </button>

              <div class="ap-sidebar__foot">
                <div class="ap-font" role="group" aria-label="字体">
                  <button
                    v-for="f in fonts"
                    :key="f.id"
                    type="button"
                    class="ap-font__btn"
                    :class="{ 'ap-font__btn--on': font_style === f.id }"
                    @click="font_style = f.id"
                  >
                    {{ f.label }}
                  </button>
                </div>
              </div>
            </nav>

            <!-- 右侧内容 -->
            <main class="ap-content">
              <div class="ap-content__inner">
                <HeroPanel v-if="active_tab === '主角'" />
                <CareerPanel v-else-if="active_tab === '成绩'" />
                <PublicPanel v-else-if="active_tab === '舆论'" />
                <RelationPanel v-else-if="active_tab === '关系'" />
                <FinancePanel v-else-if="active_tab === '财务'" />
                <BodyPanel v-else />
              </div>
            </main>
          </div>

          <!-- 底部箴言 -->
          <footer class="ap-foot">
            <span class="ap-foot__text">{{ mechanic_hint }}</span>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';
import BodyPanel from './components/BodyPanel.vue';
import CareerPanel from './components/CareerPanel.vue';
import FinancePanel from './components/FinancePanel.vue';
import HeroPanel from './components/HeroPanel.vue';
import PublicPanel from './components/PublicPanel.vue';
import RelationPanel from './components/RelationPanel.vue';

const store = useDataStore();

const tabs = [
  {
    id: '主角',
    label: '主角',
    svg: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  },
  {
    id: '成绩',
    label: '成绩',
    svg: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  },
  {
    id: '舆论',
    label: '舆论',
    svg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  },
  {
    id: '关系',
    label: '关系',
    svg: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  },
  {
    id: '财务',
    label: '财务',
    svg: '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>',
  },
  {
    id: '身体',
    label: '身体',
    svg: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  },
];

const fonts = [
  { id: 'system', label: '系统' },
  { id: 'serif', label: '宋' },
  { id: 'kai', label: '楷' },
  { id: 'mono', label: '等宽' },
];

const active_tab = useLocalStorage<string>('韩娱状态栏:active_tab', '主角');
const is_open = useLocalStorage<boolean>('韩娱状态栏:is_open', false);
const font_style = useLocalStorage<string>('韩娱状态栏:font', 'system');

function toggle() {
  is_open.value = !is_open.value;
}

const name_display = computed(() => store.data.主角.姓名 || '未命名');

const role_line = computed(() => {
  const parts = [store.data.主角.身份, store.data.主角.所属社].filter(Boolean);
  return parts.join(' · ');
});

const clock_line = computed(() => {
  const d = store.data.世界.日期;
  const short = d.length >= 10 ? d.slice(5) : d;
  return `${short} ${store.data.世界.时间}`;
});

const dot_tone = computed(() => {
  if (store.data.舆论.危机倒计时) return 'bad';
  if (store.data.身体.状态 === '透支' || store.data.身体.状态 === '伤病') return 'warn';
  if (store.data.舆论.风评 === '负面' || store.data.舆论.风评 === '高危') return 'warn';
  return 'ok';
});

const tier_hint: Record<string, string> = {
  素人: '没有人替你安排行程，机会要自己撞',
  练习生: '只有公司内部的评价，外界还看不见你',
  新人: '刚有名字，资源靠公司分配，说不上话',
  上升期: '开始有人点你的名字，位置还没坐稳',
  一线: '能自己挑本子，公司会等你先开口',
  顶流: '你不动，行业也会围着你转',
};

const mechanic_hint = computed(() => {
  const tier = store.data.主角.事业.资源层级;
  const risk = store.data.舆论.危机倒计时;
  const base = tier_hint[tier] ?? '位置未定';
  return risk ? `${base}｜${risk}` : base;
});
</script>

<style lang="scss" scoped>
.ap-scope {
  width: 100%;
  max-width: 880px;
  margin: 0 auto;
  font-family: var(--font-ui);
  user-select: none;
  font-weight: 500;
}

/* ══ 折叠态：液态玻璃悬浮岛 ══ */
.ap-island {
  position: relative;
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  height: 44px;
  padding: 0 18px;
  border: 1px solid var(--c-glass-edge);
  border-radius: 999px;
  background: var(--c-glass);
  backdrop-filter: var(--glass);
  -webkit-backdrop-filter: var(--glass);
  box-shadow:
    var(--lift),
    inset 0 1px 0 #ffffff;
  color: var(--c-text);
  font-family: var(--font-ui);
  cursor: pointer;
  overflow: hidden;
  transition:
    border-radius 0.45s var(--ease),
    box-shadow 0.3s ease,
    transform 0.3s var(--ease);
  -webkit-tap-highlight-color: transparent;
}

.ap-island:hover {
  transform: translateY(-1px);
  box-shadow:
    var(--lift-hi),
    inset 0 1px 0 #ffffff;
}

.ap-island--open {
  border-radius: 24px 24px 0 0;
  border-bottom-color: transparent;
  box-shadow: var(--lift);
}

.ap-island__sheen {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    100deg,
    transparent 20%,
    rgba(255, 255, 255, 0.9) 42%,
    rgba(255, 255, 255, 0) 58%
  );
  opacity: 0.5;
}

.ap-island__led {
  position: relative;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ap-island__led--ok {
  background: var(--c-ok);
  box-shadow: 0 0 7px rgba(52, 199, 89, 0.6);
}

.ap-island__led--warn {
  background: var(--c-warning);
  box-shadow: 0 0 7px rgba(201, 120, 10, 0.55);
}

.ap-island__led--bad {
  background: var(--c-danger);
  box-shadow: 0 0 7px rgba(224, 52, 43, 0.55);
}

.ap-island__name {
  position: relative;
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: -0.015em;
  white-space: nowrap;
  flex-shrink: 0;
}

.ap-island__role {
  position: relative;
  font-size: 11.5px;
  font-weight: 500;
  color: var(--c-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1 1 auto;
  min-width: 0;
}

.ap-island__clock {
  position: relative;
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 550;
  color: var(--c-text-muted);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.ap-island__caret {
  position: relative;
  width: 15px;
  height: 15px;
  stroke: var(--c-text-faint);
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex-shrink: 0;
  transition: transform 0.4s var(--ease);
}

.ap-island__caret--up {
  transform: rotate(180deg);
}

/* ══ 展开态 ══ */
.ap-stage {
  display: grid;
  grid-template-rows: 0fr;
  transition:
    grid-template-rows 0.5s var(--ease),
    opacity 0.32s ease;
  opacity: 0;
}

.ap-stage--open {
  grid-template-rows: 1fr;
  opacity: 1;
}

.ap-stage__clip {
  min-height: 0;
  overflow: hidden;
}

/* 4:3 画幅 */
.ap-frame {
  display: grid;
  grid-template-rows: auto 1fr auto;
  width: 100%;
  aspect-ratio: 4 / 3;
  border: 1px solid var(--c-glass-edge);
  border-top: none;
  border-radius: 0 0 24px 24px;
  background: var(--c-shell);
  backdrop-filter: var(--glass);
  -webkit-backdrop-filter: var(--glass);
  box-shadow: var(--lift-hi);
  overflow: hidden;
}

/* ── 顶部胶囊栏 ── */
.ap-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 18px;
  background: var(--c-bar);
  border-bottom: 0.5px solid #efefef;
}

.ap-top__left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.ap-top__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ap-top__dot--ok {
  background: var(--c-ok);
  box-shadow: 0 0 8px rgba(52, 199, 89, 0.5);
}

.ap-top__dot--warn {
  background: var(--c-warning);
  box-shadow: 0 0 8px rgba(201, 120, 10, 0.45);
}

.ap-top__dot--bad {
  background: var(--c-danger);
  box-shadow: 0 0 8px rgba(224, 52, 43, 0.45);
}

.ap-top__name {
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: -0.012em;
  color: var(--c-text);
  white-space: nowrap;
}

.ap-top__center {
  display: flex;
  gap: 6px;
  overflow: hidden;
  min-width: 0;
}

.ap-top__right {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 550;
  color: var(--c-text-muted);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  flex-shrink: 0;
}

.ap-pill {
  font-size: 10.5px;
  font-weight: 400;
  padding: 2px 8px;
  border-radius: 12px;
  background: #efeff4;
  color: var(--c-text-faint);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ap-pill--on {
  background: #ebf3ff;
  color: var(--c-primary);
  font-weight: 500;
}

/* ── 分栏 ── */
.ap-split {
  display: flex;
  min-height: 0;
  overflow: hidden;
}

/* 左：图标竖排 */
.ap-sidebar {
  width: 82px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 8px;
  background: var(--c-rail);
  border-right: 0.5px solid var(--c-border);
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.ap-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 4px;
  border: none;
  border-radius: 14px;
  background: transparent;
  color: var(--c-text-faint);
  font-family: var(--font-ui);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.25s var(--ease);
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
    color: var(--c-text);
  }

  :deep(svg) {
    width: 18px;
    height: 18px;
    stroke: currentColor;
    stroke-width: 1.5;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.ap-nav__icon {
  width: 18px;
  height: 18px;
  display: block;
}

.ap-nav__label {
  font-size: 11px;
  font-weight: 500;
}

.ap-nav--on {
  background: #ffffff;
  color: var(--c-primary);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);

  .ap-nav__label {
    font-weight: 600;
  }
}

.ap-sidebar__foot {
  margin-top: auto;
  padding-top: 10px;
}

.ap-font {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3px;
}

.ap-font__btn {
  padding: 5px 0;
  border: none;
  border-radius: 6px;
  background: var(--c-sunken);
  color: var(--c-text-faint);
  font-family: var(--font-ui);
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: var(--c-border);
    color: var(--c-text);
  }
}

.ap-font__btn--on {
  background: var(--c-text);
  color: #ffffff;
  font-weight: 600;
}

/* 右：内容 */
.ap-content {
  flex: 1;
  min-width: 0;
  min-height: 0;
  background: #ffffff;
  overflow: hidden;
}

.ap-content__inner {
  height: 100%;
  overflow-y: auto;
  padding: 18px 20px;
  scrollbar-width: thin;
  scrollbar-color: #d1d1d6 transparent;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d1d6;
    border-radius: 3px;
  }
}

/* ── 底部 ── */
.ap-foot {
  padding: 10px 18px;
  background: var(--c-bar);
  border-top: 0.5px solid #efefef;
  text-align: center;
}

.ap-foot__text {
  font-size: 11px;
  font-weight: 400;
  color: var(--c-text-faint);
  line-height: 1.5;
}

@media (max-width: 620px) {
  .ap-sidebar {
    width: 64px;
    padding: 10px 6px;
  }

  .ap-nav {
    padding: 9px 3px;
  }

  .ap-nav__label {
    font-size: 10px;
  }

  .ap-content__inner {
    padding: 14px 14px;
  }

  .ap-top {
    padding: 10px 13px;
  }

  .ap-top__center {
    display: none;
  }

  .ap-font {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
