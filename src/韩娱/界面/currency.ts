/**
 * 货币换算。卡内统一以韩元为记账主体，人民币只作旁注。
 *
 * 汇率固定，不随剧情波动：同一张卡里两个界面、几十条回复如果各用一套汇率，
 * 玩家会看到同一个人今天身家 6 万明天 5 万 8。宁可承认它是个近似值。
 * 取值依据 2026 年前后 1 元人民币约兑 196 韩元。
 */
export const KRW_PER_CNY = 196;

/** 韩元整数，带千分位与符号 */
export function krw(v: number) {
  const n = Math.round(v);
  const sign = n < 0 ? '-' : '';
  return `${sign}₩${Math.abs(n).toLocaleString('zh-CN')}`;
}

/** 折算成人民币。小于 10 元时留一位小数，否则取整，避免 ₩500 显示成 ¥0 */
export function cny_of(krw_value: number) {
  const n = krw_value / KRW_PER_CNY;
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs > 0 && abs < 10) {
    return `${sign}¥${abs.toFixed(1)}`;
  }
  return `${sign}¥${Math.round(abs).toLocaleString('zh-CN')}`;
}

/** 一行里的组合写法，给标题位用 */
export function krw_approx(krw_value: number) {
  return `${krw(krw_value)} ≈ ${cny_of(krw_value)}`;
}
