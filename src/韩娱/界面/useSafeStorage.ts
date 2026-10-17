/**
 * 带容错的本地存储：
 * 酒馆的 iframe 在某些浏览器 / 隐私模式下会拦截 localStorage（读写抛异常，
 * 甚至连 window.localStorage 的 getter 本身都会抛），此时 useLocalStorage
 * 会静默失效甚至让后续逻辑中断。这里退化为纯内存 ref，保证 UI 状态永远可用。
 */
import { ref, watch, type Ref } from 'vue';

function get_store(): Storage | null {
  try {
    const s = window.localStorage;
    const probe = '__hanyu_probe__';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

const store = get_store();

export function useSafeStorage<T>(key: string, default_value: T): Ref<T> {
  let initial = default_value;
  if (store) {
    try {
      const raw = store.getItem(key);
      if (raw !== null) initial = JSON.parse(raw) as T;
    } catch {
      /* 解析失败就用默认值 */
    }
  }

  const state = ref(initial) as Ref<T>;

  watch(
    state,
    value => {
      if (!store) return;
      try {
        store.setItem(key, JSON.stringify(value));
      } catch {
        /* 配额满 / 被拦截都无所谓，内存态仍然有效 */
      }
    },
    { deep: true },
  );

  return state;
}
