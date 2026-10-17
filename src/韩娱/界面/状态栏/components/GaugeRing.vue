<template>
  <div class="g" :style="{ '--g-size': size + 'px', '--g-color': color }">
    <svg class="g__svg" :viewBox="`0 0 ${size} ${size}`" aria-hidden="true">
      <circle
        class="g__track"
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke-width="stroke"
      />
      <circle
        class="g__arc"
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="color"
        :stroke-width="stroke"
        :stroke-dasharray="arc_dash"
        :stroke-linecap="round_cap ? 'round' : 'butt'"
        :transform="`rotate(-90 ${center} ${center})`"
      />
    </svg>
    <span class="g__num">{{ display }}</span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** 0~100 */
    value: number;
    /** 环直径 px */
    size?: number;
    /** 环粗 px */
    stroke?: number;
    color?: string;
    /** 中心文字，缺省显示整数 */
    display?: string | number;
  }>(),
  { size: 86, stroke: 8, color: '#34a853', display: undefined },
);

const center = computed(() => props.size / 2);

const radius = computed(() => (props.size - props.stroke) / 2);

const circumference = computed(() => 2 * Math.PI * radius.value);

const safe_value = computed(() => {
  const v = Number(props.value);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, v));
});

/** 0 值不画弧，避免圆头笔帽在起点留一个点 */
const round_cap = computed(() => safe_value.value > 0);

const arc_dash = computed(() => {
  const len = (circumference.value * safe_value.value) / 100;
  return `${len} ${circumference.value}`;
});
</script>

<style lang="scss" scoped>
.g {
  position: relative;
  width: var(--g-size);
  height: var(--g-size);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.g__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.g__track {
  stroke: #e8e8e8;
}

.g__arc {
  transition:
    stroke-dasharray 0.6s var(--ease, cubic-bezier(0.16, 1, 0.3, 1)),
    stroke 0.3s ease;
}

.g__num {
  position: relative;
  font-family: var(--font-ui);
  font-size: calc(var(--g-size) * 0.26);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--c-text);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
</style>
