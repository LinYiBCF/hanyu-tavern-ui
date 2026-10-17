<template>
  <div class="ap-scope" :class="`ap-font--${font_style}`">
    <!-- ══ 外层整机框：白底卡片 ══ -->
    <div class="ap-shell">
      <!-- ── 顶部通透栏 ── -->
      <header class="ap-top">
        <div class="ap-top__left">
          <span class="ap-dots">
            <i class="ap-dot"></i><i class="ap-dot"></i><i class="ap-dot"></i>
          </span>
          <span class="ap-top__name">主角状态栏</span>
          <span class="ap-top__pill">韩娱 · {{ store.data.世界.世代 }}</span>
        </div>

        <div class="ap-top__right">
          <span class="ap-top__clock">{{ clock_line }}</span>

          <button
            type="button"
            class="ap-toggle"
            :class="{ 'ap-toggle--on': rail_open }"
            :aria-expanded="rail_open"
            @click="rail_open = !rail_open"
          >
            <svg viewBox="0 0 24 24" class="ap-toggle__ico">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
            <span>{{ rail_open ? '侧栏' : '展开' }}</span>
          </button>

          <button type="button" class="ap-circle" title="回到主角" @click="active_tab = '主角'">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4" />
            </svg>
          </button>
        </div>
      </header>

      <!-- ── 主体分栏 ── -->
      <div class="ap-split">
        <!-- 左侧视图控制 -->
        <aside class="ap-sidebar" :class="{ 'ap-sidebar--rail': !rail_open }">
          <div class="ap-sidebar__title">视图控制</div>

          <nav class="ap-nav" role="tablist">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              class="ap-nav__item"
              :class="{ 'ap-nav__item--on': active_tab === tab.id }"
              role="tab"
              :aria-selected="active_tab === tab.id"
              :title="tab.label"
              @click="active_tab = tab.id"
            >
              <svg class="ap-nav__ico" viewBox="0 0 24 24" v-html="tab.svg"></svg>
              <span class="ap-nav__label">{{ tab.label }}</span>
            </button>
          </nav>

          <div class="ap-sidebar__foot">
            <div class="ap-font">
              <button
                v-for="f in fonts"
                :key="f.id"
                type="button"
                class="ap-font__btn"
                :class="{ 'ap-font__btn--on': font_style === f.id }"
                :title="f.title"
                @click="font_style = f.id"
              >
                {{ f.label }}
              </button>
            </div>
          </div>
        </aside>

        <!-- 右侧内容 -->
        <main class="ap-content">
          <div class="ap-content__head">
            <h2 class="ap-content__title">{{ panel_title }}</h2>
            <span v-if="active_tab === '主角'" class="ap-tier">{{ tier_badge }}</span>
          </div>

          <div class="ap-content__body">
            <HeroPanel v-if="active_tab === '主角'" />
            <CareerPanel v-else-if="active_tab === '成绩'" />
            <PublicPanel v-else-if="active_tab === '舆论'" />
            <RelationPanel v-else-if="active_tab === '关系'" />
            <FinancePanel v-else-if="active_tab === '财务'" />
            <BodyPanel v-else />
          </div>
        </main>
      </div>

      <!-- ── 底部箴言 ── -->
      <footer class="ap-foot">
        <span class="ap-foot__dot" :class="`ap-foot__dot--${dot_tone}`"></span>
        <span class="ap-foot__text">{{ mechanic_hint }}</span>
      </footer>
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
    sub: '核心画像',
    svg: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  },
  {
    id: '成绩',
    label: '成绩',
    sub: '舞台与榜单',
    svg: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  },
  {
    id: '舆论',
    label: '舆论',
    sub: '公众信号',
    svg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  },
  {
    id: '关系',
    label: '关系',
    sub: '羁绊与张力',
    svg: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  },
  {
    id: '财务',
    label: '财务',
    sub: '账目与流水',
    svg: '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>',
  },
  {
    id: '身体',
    label: '身体',
    sub: '状态与负荷',
    svg: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  },
];

const fonts = [
  { id: 'system', label: '系统', title: '系统无衬线' },
  { id: 'serif', label: '宋', title: '宋体' },
  { id: 'kai', label: '楷', title: '楷体' },
  { id: 'mono', label: '等宽', title: '等宽字体' },
];

const active_tab = useLocalStorage<string>('韩娱状态栏:active_tab', '主角');
const rail_open = useLocalStorage<boolean>('韩娱状态栏:rail_open', true);
const font_style = useLocalStorage<string>('韩娱状态栏:font', 'system');

const active_meta = computed(() => tabs.find((t) => t.id === active_tab.value) ?? tabs[0]);
const panel_title = computed(() => `${active_meta.value.id} · ${active_meta.value.sub}`);

const tier_badge = computed(() => {
  const map: Record<string, string> = {
    素人: '素人档（未入列）',
    练习生: '练习生档（内部）',
    新人: '第三梯队（新进）',
    上升期: '第二梯队（上升）',
    一线: '第一梯队（A-Tier）',
    顶流: '第一梯队（S-Tier）',
  };
  return map[store.data.主角.事业.资源层级] ?? store.data.主角.事业.资源层级;
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
  font-weight: 400;
  color: var(--c-text);
}

/* ══ 整机外框：白卡浮在稍深白基底上 ══ */
.ap-shell {
  display: flex;
  flex-direction: column;
  width: 100%;
  aspect-ratio: 4 / 3;
  min-height: 430px;
  background: var(--c-panel);
  border: 1px solid var(--c-border);
  border-radius: 24px;
  box-shadow: var(--lift-hi);
  overflow: hidden;
}

/* ── 顶部栏 ── */
.ap-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
  height: 52px;
  padding: 0 16px;
  background: #fafbfc;
  border-bottom: 1px solid var(--c-divider);
}

.ap-top__left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.ap-dots {
  display: flex;
  align-items: center;
  gap: 5px;
}

.ap-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #dcdde1;
}

.ap-dot:first-child {
  background: #e3e4e8;
}

.ap-top__name {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--c-text);
  white-space: nowrap;
}

.ap-top__pill {
  font-size: 10.5px;
  font-weight: 500;
  padding: 2.5px 9px;
  border-radius: 999px;
  background: var(--c-primary-dim);
  color: var(--c-primary);
  white-space: nowrap;
}

.ap-top__right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.ap-top__clock {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  color: var(--c-text-faint);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

/* ── 侧栏开关：参考图右上角「≡ 侧栏 / ≡ 展开」 ── */
.ap-toggle {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  padding: 0 11px 0 9px;
  border: 1px solid var(--c-border);
  border-radius: 999px;
  background: #ffffff;
  color: var(--c-text-muted);
  font-family: var(--font-ui);
  font-size: 11.5px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background 0.25s var(--ease),
    color 0.25s var(--ease),
    box-shadow 0.25s var(--ease);
  -webkit-tap-highlight-color: transparent;
}

.ap-toggle:hover {
  background: #f5f6f8;
  color: var(--c-text);
}

.ap-toggle--on {
  background: var(--c-primary-dim);
  border-color: #d6e6ff;
  color: var(--c-primary);
}

.ap-toggle__ico {
  width: 13px;
  height: 13px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
}

.ap-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid var(--c-border);
  border-radius: 50%;
  background: #ffffff;
  color: var(--c-text-faint);
  cursor: pointer;
  transition:
    background 0.25s var(--ease),
    color 0.25s var(--ease);
  -webkit-tap-highlight-color: transparent;

  svg {
    width: 13px;
    height: 13px;
    stroke: currentColor;
    stroke-width: 1.8;
    fill: none;
  }

  &:hover {
    background: #f5f6f8;
    color: var(--c-text);
  }
}

/* ── 主体分栏 ── */
.ap-split {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* 左侧视图控制 */
.ap-sidebar {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 168px;
  padding: 14px 10px;
  background: #f7f8fa;
  border-right: 1px solid var(--c-divider);
  overflow: hidden;
  transition: width 0.4s var(--ease);
}

.ap-sidebar--rail {
  width: 62px;
  padding: 14px 7px;
}

.ap-sidebar__title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--c-text-faint);
  padding: 0 8px 10px;
  white-space: nowrap;
  opacity: 1;
  transition:
    opacity 0.22s var(--ease),
    padding 0.3s var(--ease);

  .ap-sidebar--rail & {
    opacity: 0;
    padding-bottom: 4px;
    pointer-events: none;
  }
}

.ap-nav {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.ap-nav__item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 10px;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: var(--c-text-muted);
  font-family: var(--font-ui);
  font-size: 12.5px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  transition:
    background 0.25s var(--ease),
    color 0.25s var(--ease),
    box-shadow 0.25s var(--ease),
    padding 0.4s var(--ease);

  &:hover {
    background: rgba(0, 0, 0, 0.035);
    color: var(--c-text);
  }

  .ap-sidebar--rail & {
    justify-content: center;
    gap: 0;
    padding: 9px 0;
  }
}

.ap-nav__ico {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  stroke: currentColor;
  stroke-width: 1.6;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ap-nav__label {
  overflow: hidden;
  max-width: 100px;
  opacity: 1;
  transition:
    opacity 0.2s var(--ease),
    max-width 0.35s var(--ease);

  .ap-sidebar--rail & {
    max-width: 0;
    opacity: 0;
  }
}

.ap-nav__item--on {
  background: #ffffff;
  color: var(--c-primary);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.ap-sidebar__foot {
  margin-top: auto;
  padding-top: 10px;
}

.ap-font {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3px;

  .ap-sidebar--rail & {
    grid-template-columns: 1fr;
  }
}

.ap-font__btn {
  padding: 5px 0;
  border: none;
  border-radius: 7px;
  background: #eceef2;
  color: var(--c-text-faint);
  font-family: var(--font-ui);
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: #e3e5ea;
    color: var(--c-text);
  }
}

.ap-font__btn--on {
  background: var(--c-text);
  color: #ffffff;
  font-weight: 600;
}

/* ── 右侧内容 ── */
.ap-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;
  background: var(--c-panel);
}

.ap-content__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
  padding: 16px 20px 12px;
}

.ap-content__title {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--c-text);
}

.ap-tier {
  font-size: 10.5px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--c-primary-dim);
  color: var(--c-primary);
  white-space: nowrap;
}

.ap-content__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 20px 16px;
  scrollbar-width: thin;
  scrollbar-color: #d1d3d8 transparent;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d3d8;
    border-radius: 3px;
  }
}

/* ── 底部 ── */
.ap-foot {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  flex-shrink: 0;
  padding: 10px 18px;
  background: #fafbfc;
  border-top: 1px solid var(--c-divider);
}

.ap-foot__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ap-foot__dot--ok {
  background: var(--c-ok);
  box-shadow: 0 0 6px rgba(52, 199, 89, 0.55);
}

.ap-foot__dot--warn {
  background: var(--c-warning);
  box-shadow: 0 0 6px rgba(255, 149, 0, 0.5);
}

.ap-foot__dot--bad {
  background: var(--c-danger);
  box-shadow: 0 0 6px rgba(255, 59, 48, 0.5);
}

.ap-foot__text {
  font-size: 11px;
  font-weight: 400;
  color: var(--c-text-faint);
  line-height: 1.5;
  text-align: center;
}

@media (max-width: 640px) {
  .ap-shell {
    aspect-ratio: auto;
    min-height: 460px;
  }

  .ap-top__pill,
  .ap-top__clock {
    display: none;
  }

  .ap-sidebar {
    width: 132px;
  }

  .ap-sidebar--rail {
    width: 52px;
  }

  .ap-content__head {
    padding: 14px 14px 10px;
  }

  .ap-content__body {
    padding: 0 14px 14px;
  }
}
</style>
