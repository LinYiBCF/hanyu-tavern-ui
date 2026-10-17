<template>
  <div class="ap-scope">
    <!-- 折叠态常驻条：一行，看得见就够 -->
    <button
      type="button"
      class="ap-capsule"
      :class="{ 'ap-capsule--open': is_open }"
      :aria-expanded="is_open"
      @click="toggle()"
    >
      <span class="ap-compact">
        <span class="ap-leading">
          <span class="ap-dot" :class="`ap-dot--${dot_tone}`"></span>
          <span class="ap-who">{{ name_display }}</span>
          <span v-if="role_line" class="ap-role">{{ role_line }}</span>
        </span>
        <span class="ap-trailing">
          <span class="ap-clock">{{ clock_line }}</span>
          <svg class="ap-caret" :class="{ 'ap-caret--up': is_open }" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5" />
          </svg>
        </span>
      </span>
    </button>

    <!-- 展开态：整张卡从胶囊里长出来 -->
    <div class="ap-sheet" :class="{ 'ap-sheet--open': is_open }">
      <div class="ap-sheet__inner">
        <HeaderBar />

        <TabNav v-model="active_tab" :tabs="tabs" />

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
import TabNav from './components/TabNav.vue';

const store = useDataStore();

const tabs = [
  { id: '主角', label: '主角' },
  { id: '成绩', label: '成绩' },
  { id: '舆论', label: '舆论' },
  { id: '关系', label: '关系' },
  { id: '财务', label: '财务' },
  { id: '身体', label: '身体' },
];

const active_tab = useLocalStorage<string>('韩娱状态栏:active_tab', '主角');
const is_open = useLocalStorage<boolean>('韩娱状态栏:is_open', false);

function toggle() {
  is_open.value = !is_open.value;
}

const name_display = computed(() => store.data.主角.姓名 || '未命名');

const role_line = computed(() => {
  const parts = [store.data.主角.身份, store.data.主角.所属社].filter(Boolean);
  return parts.join(' · ');
});

/** 折叠态只放这一行时间：日期省掉年份，时段用点代替 */
const clock_line = computed(() => {
  const d = store.data.世界.日期;
  const short = d.length >= 10 ? d.slice(5) : d;
  return `${short} ${store.data.世界.时间}`;
});

/** 一个很小的状态点，安静地表示现在安不安全 */
const dot_tone = computed(() => {
  if (store.data.舆论.危机倒计时) return 'bad';
  if (store.data.身体.状态 === '透支' || store.data.身体.状态 === '伤病') return 'warn';
  if (store.data.舆论.风评 === '负面' || store.data.舆论.风评 === '高危') return 'warn';
  return 'ok';
});

/** 资源层级 → 一句人话，让玩家自己判断这一步够不够得着 */
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
  max-width: 560px;
  margin: 0 auto;
  font-family: var(--font-ui);
  user-select: none;
}

/* ── 折叠态：浮在壁纸上的液态胶囊 ── */
.ap-capsule {
  display: block;
  width: 100%;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: var(--glass);
  -webkit-backdrop-filter: var(--glass);
  box-shadow:
    var(--lift),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.5);
  color: var(--c-text);
  cursor: pointer;
  overflow: hidden;
  transition:
    background 0.2s ease,
    box-shadow 0.25s ease,
    border-radius 0.35s var(--ease);
  -webkit-tap-highlight-color: transparent;
}

.ap-capsule:hover {
  background: rgba(255, 255, 255, 0.92);
  box-shadow:
    var(--lift-hi),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.6);
}

.ap-capsule--open {
  border-radius: 22px 22px 0 0;
  border-bottom-color: transparent;
  box-shadow: var(--lift);
}

.ap-compact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  height: 38px;
  padding: 0 15px;
}

.ap-leading,
.ap-trailing {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.ap-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ap-dot--ok {
  background: #34c759;
  box-shadow: 0 0 6px rgba(52, 199, 89, 0.55);
}

.ap-dot--warn {
  background: #ff9500;
  box-shadow: 0 0 6px rgba(255, 149, 0, 0.55);
}

.ap-dot--bad {
  background: #ff3b30;
  box-shadow: 0 0 6px rgba(255, 59, 48, 0.55);
}

.ap-who {
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.ap-role {
  font-size: 11px;
  color: var(--c-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ap-clock {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--c-text-muted);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.ap-caret {
  width: 14px;
  height: 14px;
  stroke: var(--c-text-faint);
  stroke-width: 1.8;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex-shrink: 0;
  transition: transform 0.35s var(--ease);
}

.ap-caret--up {
  transform: rotate(180deg);
}

/* ── 展开态：从胶囊下沿长出来的纸片 ── */
.ap-sheet {
  display: grid;
  grid-template-rows: 0fr;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-top: none;
  border-radius: 0 0 22px 22px;
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: var(--glass);
  -webkit-backdrop-filter: var(--glass);
  box-shadow: var(--lift-hi);
  overflow: hidden;
  opacity: 0;
  transition:
    grid-template-rows 0.42s var(--ease),
    opacity 0.3s ease;
}

.ap-sheet--open {
  grid-template-rows: 1fr;
  opacity: 1;
}

.ap-sheet__inner {
  min-height: 0;
  overflow: hidden;
}

.ap-body {
  padding: 14px 15px 15px;
}

.ap-foot {
  padding: 9px 15px 11px;
  border-top: 1px solid var(--c-border);
}

.ap-foot__hint {
  font-size: 11px;
  color: var(--c-text-muted);
  letter-spacing: 0.01em;
  line-height: 1.5;
}
</style>
