<template>
  <div class="ap-scope" :class="`ap-font--${font_style}`">
    <!-- ── 折叠态：浮在壁纸上的液态玻璃岛 ── -->
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

    <!-- ── 展开态：4:3 画幅 ── -->
    <div class="ap-stage" :class="{ 'ap-stage--open': is_open }">
      <div class="ap-stage__clip">
        <div class="ap-frame">
          <!-- 左：竖排入口 -->
          <aside class="ap-rail">
            <div class="ap-rail__id">
              <span class="ap-rail__name">{{ name_display }}</span>
              <span v-if="role_line" class="ap-rail__role">{{ role_line }}</span>
            </div>

            <nav class="ap-rail__nav" role="tablist">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                type="button"
                class="ap-rail__item"
                :class="{ 'ap-rail__item--on': active_tab === tab.id }"
                role="tab"
                :aria-selected="active_tab === tab.id"
                @click="active_tab = tab.id"
              >
                <span class="ap-rail__tick"></span>
                <span class="ap-rail__label">{{ tab.label }}</span>
                <span class="ap-rail__en">{{ tab.en }}</span>
              </button>
            </nav>

            <div class="ap-rail__foot">
              <div class="ap-rail__clock">{{ clock_line }}</div>
              <div class="ap-rail__font" role="group" aria-label="字体">
                <button
                  v-for="f in fonts"
                  :key="f.id"
                  type="button"
                  class="ap-rail__fontbtn"
                  :class="{ 'ap-rail__fontbtn--on': font_style === f.id }"
                  @click="font_style = f.id"
                >
                  {{ f.label }}
                </button>
              </div>
            </div>
          </aside>

          <!-- 右：内容 -->
          <main class="ap-main">
            <HeaderBar />

            <div class="ap-body">
              <HeroPanel v-if="active_tab === '主角'" />
              <CareerPanel v-else-if="active_tab === '成绩'" />
              <PublicPanel v-else-if="active_tab === '舆论'" />
              <RelationPanel v-else-if="active_tab === '关系'" />
              <FinancePanel v-else-if="active_tab === '财务'" />
              <BodyPanel v-else />
            </div>

            <footer class="ap-foot">
              <span class="ap-foot__hint">{{ mechanic_hint }}</span>
            </footer>
          </main>
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
import HeaderBar from './components/HeaderBar.vue';
import HeroPanel from './components/HeroPanel.vue';
import PublicPanel from './components/PublicPanel.vue';
import RelationPanel from './components/RelationPanel.vue';

const store = useDataStore();

const tabs = [
  { id: '主角', label: '主角', en: 'IDOL' },
  { id: '成绩', label: '成绩', en: 'CHARTS' },
  { id: '舆论', label: '舆论', en: 'BUZZ' },
  { id: '关系', label: '关系', en: 'TIES' },
  { id: '财务', label: '财务', en: 'MONEY' },
  { id: '身体', label: '身体', en: 'BODY' },
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
  height: 42px;
  padding: 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 999px;
  background: linear-gradient(
    170deg,
    rgba(255, 253, 248, 0.9) 0%,
    rgba(255, 250, 240, 0.72) 100%
  );
  backdrop-filter: var(--glass);
  -webkit-backdrop-filter: var(--glass);
  box-shadow:
    var(--lift),
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    inset 0 -1px 0 rgba(120, 104, 78, 0.07);
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
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.ap-island--open {
  border-radius: 22px 22px 0 0;
  border-bottom-color: transparent;
  box-shadow: var(--lift);
}

/* 高光扫过的那一层，让玻璃有厚度 */
.ap-island__sheen {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    100deg,
    transparent 20%,
    rgba(255, 255, 255, 0.65) 42%,
    rgba(255, 255, 255, 0) 58%
  );
  opacity: 0.7;
}

.ap-island__led {
  position: relative;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ap-island__led--ok {
  background: #2fbf4e;
  box-shadow: 0 0 7px rgba(47, 191, 78, 0.7);
}

.ap-island__led--warn {
  background: #ff9500;
  box-shadow: 0 0 7px rgba(255, 149, 0, 0.7);
}

.ap-island__led--bad {
  background: #ff3b30;
  box-shadow: 0 0 7px rgba(255, 59, 48, 0.7);
}

.ap-island__name {
  position: relative;
  font-size: 13.5px;
  font-weight: 650;
  letter-spacing: -0.012em;
  white-space: nowrap;
  flex-shrink: 0;
}

.ap-island__role {
  position: relative;
  font-size: 11.5px;
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
  font-weight: 500;
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

/* 4:3 画幅，边框一路连到岛上 */
.ap-frame {
  display: grid;
  grid-template-columns: 176px 1fr;
  width: 100%;
  aspect-ratio: 4 / 3;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-top: none;
  border-radius: 0 0 22px 22px;
  background: linear-gradient(165deg, rgba(255, 253, 248, 0.93) 0%, rgba(250, 245, 235, 0.88) 100%);
  backdrop-filter: var(--glass);
  -webkit-backdrop-filter: var(--glass);
  box-shadow:
    var(--lift-hi),
    inset 0 -1px 0 rgba(120, 104, 78, 0.06);
  overflow: hidden;
}

/* ── 左栏 ── */
.ap-rail {
  display: flex;
  flex-direction: column;
  padding: 18px 0 14px;
  border-right: 1px solid var(--c-border);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.42) 0%, rgba(246, 240, 229, 0.3) 100%);
}

.ap-rail__id {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 0 18px 16px;
}

.ap-rail__name {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.25;
  color: var(--c-text);
}

.ap-rail__role {
  font-size: 11px;
  color: var(--c-text-muted);
  line-height: 1.4;
}

.ap-rail__nav {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 0 10px;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.ap-rail__item {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 7px;
  width: 100%;
  padding: 10px 10px 10px 12px;
  border: none;
  border-radius: 9px;
  background: transparent;
  color: var(--c-text-muted);
  font-family: var(--font-ui);
  text-align: left;
  cursor: pointer;
  transition:
    background 0.22s ease,
    color 0.22s ease;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: rgba(120, 104, 78, 0.05);
    color: var(--c-text);
  }
}

.ap-rail__tick {
  position: absolute;
  left: 3px;
  top: 50%;
  width: 3px;
  height: 0;
  border-radius: 2px;
  background: var(--c-text);
  transform: translateY(-50%);
  transition: height 0.28s var(--ease);
}

.ap-rail__label {
  font-size: 13px;
  font-weight: 550;
  letter-spacing: 0.01em;
}

.ap-rail__en {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.1em;
  color: var(--c-text-faint);
  opacity: 0;
  transition: opacity 0.22s ease;
}

.ap-rail__item--on {
  background: rgba(255, 255, 255, 0.92);
  color: var(--c-text);
  box-shadow:
    0 2px 8px rgba(74, 60, 38, 0.08),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.9);

  .ap-rail__tick {
    height: 15px;
  }

  .ap-rail__label {
    font-weight: 700;
  }

  .ap-rail__en {
    opacity: 1;
    color: var(--c-text-muted);
  }
}

.ap-rail__foot {
  margin-top: auto;
  padding: 14px 18px 0;
  border-top: 1px solid var(--c-border);
}

.ap-rail__clock {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--c-text-muted);
  font-variant-numeric: tabular-nums;
  margin-bottom: 11px;
}

.ap-rail__font {
  display: flex;
  gap: 3px;
}

.ap-rail__fontbtn {
  flex: 1 1 0;
  padding: 5px 0;
  border: none;
  border-radius: 6px;
  background: rgba(120, 104, 78, 0.06);
  color: var(--c-text-faint);
  font-family: var(--font-ui);
  font-size: 10px;
  font-weight: 550;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    color: var(--c-text);
  }
}

.ap-rail__fontbtn--on {
  background: var(--c-text);
  color: #fffdf9;
}

/* ── 右栏 ── */
.ap-main {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-width: 0;
  min-height: 0;
}

.ap-body {
  padding: 20px 24px 18px;
  overflow-y: auto;
  min-height: 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(120, 104, 78, 0.22) transparent;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(120, 104, 78, 0.22);
    border-radius: 3px;
  }
}

.ap-foot {
  padding: 11px 24px 13px;
  border-top: 1px solid var(--c-border);
}

.ap-foot__hint {
  font-size: 11px;
  color: var(--c-text-muted);
  letter-spacing: 0.01em;
  line-height: 1.5;
}

/* 窄屏：4:3 收不住，左栏压到 118px */
@media (max-width: 620px) {
  .ap-frame {
    grid-template-columns: 118px 1fr;
  }

  .ap-rail__id {
    padding: 0 12px 14px;
  }

  .ap-rail__name {
    font-size: 13px;
  }

  .ap-rail__nav {
    padding: 0 7px;
  }

  .ap-rail__item {
    padding: 9px 7px 9px 10px;
  }

  .ap-rail__label {
    font-size: 12px;
  }

  .ap-rail__en {
    display: none;
  }

  .ap-rail__foot {
    padding: 12px 12px 0;
  }

  .ap-body {
    padding: 16px 15px 14px;
  }

  .ap-foot {
    padding: 10px 15px 11px;
  }
}
</style>
