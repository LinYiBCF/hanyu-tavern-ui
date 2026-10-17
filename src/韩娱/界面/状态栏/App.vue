<template>
  <div class="card">
    <HeaderBar />

    <TabNav v-model="active_tab" :tabs="tabs" />

    <div class="content-area">
      <HeroPanel v-if="active_tab === '主角'" />
      <CareerPanel v-else-if="active_tab === '成绩'" />
      <PublicPanel v-else-if="active_tab === '舆论'" />
      <RelationPanel v-else-if="active_tab === '关系'" />
      <BodyPanel v-else />
    </div>

    <footer class="foot">
      <span class="foot__hint">{{ mechanic_hint }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';
import BodyPanel from './components/BodyPanel.vue';
import CareerPanel from './components/CareerPanel.vue';
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
  { id: '身体', label: '身体' },
];

const active_tab = useLocalStorage<string>('韩娱状态栏:active_tab', '主角');

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
.card {
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  background: var(--c-surface);
  border: 1px solid var(--c-border-strong);
  border-radius: var(--radius);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.42);
  color: var(--c-text);
  font-size: 13px;
  line-height: 1.5;
  overflow: hidden;
}

.content-area {
  padding: 12px 14px 14px;
}

.foot {
  padding: 8px 14px;
  border-top: 1px solid var(--c-border);
  background: var(--c-surface-sunken);
}

.foot__hint {
  font-size: 0.72rem;
  color: var(--c-text-muted);
  letter-spacing: 0.02em;
}
</style>
