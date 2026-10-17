<template>
  <div class="sheet" :class="`ap-font--${font_style}`">
    <header class="sheet__head">
      <div class="sheet__top">
        <div>
          <h1 class="sheet__title">入场</h1>
          <p class="sheet__sub">{{ subs[page] }}</p>
        </div>
        <div class="sheet__font" role="group" aria-label="字体">
          <button
            v-for="f in fonts"
            :key="f.id"
            type="button"
            class="sheet__fontbtn"
            :class="{ 'sheet__fontbtn--on': font_style === f.id }"
            @click="font_style = f.id"
          >
            {{ f.label }}
          </button>
        </div>
      </div>
      <div class="steps">
        <span v-for="i in 3" :key="i" class="steps__dot" :class="{ 'steps__dot--on': i - 1 <= page }"></span>
        <span class="steps__num">{{ page + 1 }} / 3</span>
      </div>
    </header>

    <form class="form" @submit.prevent="submit">
      <!-- 第一页：你是谁 -->
      <div v-show="page === 0" class="page">
        <div class="field">
          <label class="field__label" for="f-name">姓名</label>
          <input id="f-name" v-model.trim="form.姓名" class="field__input" type="text" placeholder="你叫什么" />
        </div>

        <div class="row2">
          <div class="field">
            <label class="field__label" for="f-gender">性别</label>
            <input id="f-gender" v-model.trim="form.性别" class="field__input" type="text" placeholder="男 / 女 / 其他" />
          </div>
          <div class="field">
            <label class="field__label" for="f-nation">国籍</label>
            <input id="f-nation" v-model.trim="form.国籍" class="field__input" type="text" placeholder="韩国 / 中国 / 日本" />
          </div>
        </div>

        <div class="field">
          <label class="field__label">出生日期</label>
          <div class="split3">
            <div class="cell">
              <input v-model.trim="form.出生年" class="field__input cell__in" type="text" inputmode="numeric" maxlength="4" placeholder="1998" />
              <span class="cell__unit">年</span>
            </div>
            <div class="cell">
              <input v-model.trim="form.出生月" class="field__input cell__in" type="text" inputmode="numeric" maxlength="2" placeholder="04" />
              <span class="cell__unit">月</span>
            </div>
            <div class="cell">
              <input v-model.trim="form.出生日" class="field__input cell__in" type="text" inputmode="numeric" maxlength="2" placeholder="17" />
              <span class="cell__unit">日</span>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="field__label">身高体重</label>
          <div class="row2">
            <div class="cell">
              <input v-model.trim="form.身高" class="field__input cell__in" type="text" inputmode="decimal" placeholder="170" />
              <span class="cell__unit">厘米</span>
            </div>
            <div class="cell">
              <input v-model.trim="form.体重" class="field__input cell__in" type="text" inputmode="decimal" placeholder="52" />
              <span class="cell__unit">公斤</span>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="field__label" for="f-look">体型外貌</label>
          <textarea
            id="f-look"
            v-model.trim="form.体型外貌"
            class="field__input field__input--area"
            rows="4"
            placeholder="别人第一眼会记住你身上的哪一点"
          ></textarea>
        </div>
      </div>

      <!-- 第二页：你在哪 -->
      <div v-show="page === 1" class="page">
        <section class="group group--top">
          <h3 class="group__h">当前时间</h3>
          <div class="field">
            <label class="field__label">日期</label>
            <div class="split3">
              <div class="cell">
                <input v-model.trim="form.当前年" class="field__input cell__in" type="text" inputmode="numeric" maxlength="4" placeholder="2024" />
                <span class="cell__unit">年</span>
              </div>
              <div class="cell">
                <input v-model.trim="form.当前月" class="field__input cell__in" type="text" inputmode="numeric" maxlength="2" placeholder="01" />
                <span class="cell__unit">月</span>
              </div>
              <div class="cell">
                <input v-model.trim="form.当前日" class="field__input cell__in" type="text" inputmode="numeric" maxlength="2" placeholder="01" />
                <span class="cell__unit">日</span>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="field__label" for="f-hour">几点</label>
            <div class="cell cell--narrow">
              <input
                id="f-hour"
                v-model.trim="form.小时"
                class="field__input cell__in cell__in--mono"
                type="text"
                inputmode="numeric"
                maxlength="2"
                placeholder="09"
              />
              <span class="cell__unit cell__unit--mono">:00</span>
            </div>
          </div>

          <p class="group__note">
            只填到小时，填 0 到 24 的数字。时段会自动按 {{ derived_slot }} 记。
            <span v-if="hour_is_24" class="group__warn">填 24 视作次日 00:00。</span>
            <span v-else-if="hour_invalid" class="group__warn">小时要填 0 到 24 之间的数字。</span>
          </p>
        </section>

        <div class="field">
          <label class="field__label" for="f-pos">当前位置</label>
          <textarea
            id="f-pos"
            v-model.trim="form.当前位置"
            class="field__input field__input--area"
            rows="3"
            placeholder="你现在人在哪，正在做什么"
          ></textarea>
        </div>

        <div class="field">
          <label class="field__label" for="f-past">过往经历</label>
          <textarea
            id="f-past"
            v-model.trim="form.过往经历"
            class="field__input field__input--area"
            rows="5"
            placeholder="你是从哪来的：练了几年、代表哪个公司出过道、还是刚从地方上来"
          ></textarea>
        </div>
      </div>

      <!-- 第三页：你的账 -->
      <div v-show="page === 2" class="page">
        <section class="group group--top">
          <p class="group__desc">三栏都可以留空。以韩元记账，允许为负，负债直接写负数。</p>

          <div class="money">
            <div class="money__head">
              <span class="money__k">收入</span>
              <div class="money__ctrl">
                <span class="money__unit">₩</span>
                <input v-model="form.收入数值" class="field__input money__num" type="number" step="1" placeholder="0" />
                <select v-model="form.收入周期" class="field__input money__cycle">
                  <option value="月">每月</option>
                  <option value="季">每季</option>
                  <option value="年">每年</option>
                </select>
              </div>
            </div>
            <p v-if="cny_preview(form.收入数值)" class="money__cny">{{ cny_preview(form.收入数值) }}</p>
            <input
              v-model.trim="form.收入备注"
              class="field__input money__note"
              type="text"
              placeholder="这笔钱是什么：工作薪酬 / 结算 / 代言（可留空）"
            />
          </div>

          <div class="money">
            <div class="money__head">
              <span class="money__k">支出</span>
              <div class="money__ctrl">
                <span class="money__unit">₩</span>
                <input v-model="form.支出数值" class="field__input money__num" type="number" step="1" placeholder="0" />
                <select v-model="form.支出周期" class="field__input money__cycle">
                  <option value="月">每月</option>
                  <option value="季">每季</option>
                  <option value="年">每年</option>
                </select>
              </div>
            </div>
            <p v-if="cny_preview(form.支出数值)" class="money__cny">{{ cny_preview(form.支出数值) }}</p>
            <input
              v-model.trim="form.支出备注"
              class="field__input money__note"
              type="text"
              placeholder="这笔钱花在哪：车贷支出 / 宿舍房租（可留空）"
            />
          </div>

          <div class="money">
            <div class="money__head">
              <span class="money__k">积蓄</span>
              <div class="money__ctrl">
                <span class="money__unit">₩</span>
                <input v-model="form.积蓄数值" class="field__input money__num" type="number" step="1" placeholder="0" />
              </div>
            </div>
            <p v-if="cny_preview(form.积蓄数值)" class="money__cny">{{ cny_preview(form.积蓄数值) }}</p>
            <input
              v-model.trim="form.积蓄备注"
              class="field__input money__note"
              type="text"
              placeholder="当前处境：家里垫的 / 负债 / 解散结算（可留空）"
            />
          </div>
        </section>
      </div>

      <p v-if="error" class="err">{{ error }}</p>

      <div class="nav">
        <button v-if="page > 0" class="nav__btn nav__btn--ghost" type="button" :disabled="submitted" @click="prev">
          上一步
        </button>
        <button v-if="page < 2" class="nav__btn nav__btn--main" type="button" @click="next">下一步</button>
        <button v-else class="nav__btn nav__btn--main" type="submit" :disabled="submitted">
          {{ submitted ? '已入场' : '进入这个世界' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { cny_of, krw } from '../currency';
import { useDataStore } from '../store';

const store = useDataStore();

const subs = ['第一页：你是谁', '第二页：你在哪', '第三页：你的账'];

const fonts = [
  { id: 'system', label: '系统' },
  { id: 'serif', label: '宋' },
  { id: 'kai', label: '楷' },
  { id: 'mono', label: '等宽' },
];

const font_style = useLocalStorage<string>('韩娱状态栏:font', 'system');

const page = ref(0);
const error = ref('');
const submitted = ref(false);

function pad(n: number | string) {
  return String(n).padStart(2, '0');
}

function today() {
  const d = new Date();
  return { 年: String(d.getFullYear()), 月: pad(d.getMonth() + 1), 日: pad(d.getDate()) };
}

const t = today();

const form = reactive({
  姓名: '',
  性别: '',
  出生年: '',
  出生月: '',
  出生日: '',
  国籍: '',
  身高: '',
  体重: '',
  体型外貌: '',
  当前位置: '',
  过往经历: '',
  当前年: t.年,
  当前月: t.月,
  当前日: t.日,
  小时: '09',
  收入数值: '',
  收入周期: '月',
  收入备注: '',
  支出数值: '',
  支出周期: '月',
  支出备注: '',
  积蓄数值: '',
  积蓄备注: '',
});

const hour_num = computed(() => {
  const raw = form.小时;
  if (raw === '') return null;
  if (!/^\d{1,2}$/.test(raw)) return null;
  const n = Number(raw);
  return n >= 0 && n <= 24 ? n : null;
});

const hour_invalid = computed(() => form.小时 !== '' && hour_num.value === null);
const hour_is_24 = computed(() => hour_num.value === 24);

/** 与变量更新规则里的时段划分保持一致 */
function slot_of(hour: number) {
  const h = hour % 24;
  if (h >= 5 && h <= 8) return '清晨';
  if (h >= 9 && h <= 11) return '上午';
  if (h >= 12 && h <= 17) return '午后';
  if (h >= 18 && h <= 20) return '傍晚';
  return '深夜';
}

const derived_slot = computed(() => slot_of(hour_num.value ?? 9));

function to_int(raw: string) {
  if (raw === '' || raw === null || raw === undefined) return null;
  const n = Number(String(raw).replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? Math.round(n) : null;
}

/** 三位日期框合成 YYYY-MM-DD，缺年就返回空 */
function join_date(y: string, m: string, d: string) {
  if (!y) return '';
  if (!/^\d{4}$/.test(y)) return '';
  const mm = Math.min(12, Math.max(1, Number(m) || 1));
  const dd = Math.min(31, Math.max(1, Number(d) || 1));
  return `${y}-${pad(mm)}-${pad(dd)}`;
}

const birth_text = computed(() => join_date(form.出生年, form.出生月, form.出生日));

const hw_text = computed(() => {
  const h = form.身高 ? `${form.身高}cm` : '';
  const w = form.体重 ? `${form.体重}kg` : '';
  if (h && w) return `${h} / ${w}`;
  return h || w;
});

/** 输入框下面的实时旁注，空着的时候不占位 */
function cny_preview(raw: string) {
  const n = to_int(raw);
  if (n === null || n === 0) return '';
  return `≈ ${cny_of(n)}`;
}

function has_money() {
  return to_int(form.收入数值) !== null || to_int(form.支出数值) !== null || to_int(form.积蓄数值) !== null;
}

function money_line(label: string, value: string, cycle?: string, note?: string) {
  const n = to_int(value);
  if (n === null) return null;
  const head = `${label} ${krw(n)}`;
  const with_cycle = cycle ? `${head}（按${cycle}）` : head;
  const with_rate = `${with_cycle}，约合 ${cny_of(n)}`;
  return note ? `${with_rate}，备注：${note}` : with_rate;
}

/** 落地日期：填 24 点就顺到次日 */
function landing_date_time() {
  const base = join_date(form.当前年, form.当前月, form.当前日) || '2024-01-01';
  const n = hour_num.value ?? 9;
  if (n === 24) {
    const d = new Date(`${base}T00:00:00`);
    d.setDate(d.getDate() + 1);
    return { 日期: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, 时间: '00:00', 时段: slot_of(0) };
  }
  return { 日期: base, 时间: `${pad(n)}:00`, 时段: slot_of(n) };
}

function build_identity_desc() {
  const { 日期, 时间, 时段 } = landing_date_time();
  const lines = [
    `姓名：${form.姓名}`,
    `性别：${form.性别 || '未说明'}`,
    `出生日期：${birth_text.value || '未说明'}`,
    `国籍：${form.国籍 || '未说明'}`,
    `身高体重：${hw_text.value || '未说明'}`,
    `体型外貌：${form.体型外貌 || '未说明'}`,
    `过往经历：${form.过往经历 || '未说明'}`,
    `当前位置：${form.当前位置 || '未说明'}`,
    `当前时间：${日期} ${时间}（${时段}）`,
  ];

  if (has_money()) {
    const money = [
      money_line('收入', form.收入数值, form.收入周期, form.收入备注),
      money_line('支出', form.支出数值, form.支出周期, form.支出备注),
      money_line('积蓄', form.积蓄数值, undefined, form.积蓄备注),
    ].filter(Boolean);
    lines.push(`财务状况：${money.join('；')}`);
  }

  return ['【我入场了】', ...lines, '', '按我的设置铺开这个世界，不要替我决定我是谁。'].join('\n');
}

function next() {
  error.value = '';
  if (page.value === 0 && !form.姓名) {
    error.value = '至少要填名字';
    return;
  }
  if (page.value === 1 && hour_invalid.value) {
    error.value = '小时要填 0 到 24 之间的数字';
    return;
  }
  if (page.value < 2) {
    page.value += 1;
  }
}

function prev() {
  error.value = '';
  if (page.value > 0) {
    page.value -= 1;
  }
}

async function submit() {
  if (submitted.value) {
    return;
  }
  // 回车在表单里也会触发 submit，前三页先当「下一步」用
  if (page.value < 2) {
    next();
    return;
  }
  if (!form.姓名) {
    error.value = '至少要填名字';
    page.value = 0;
    return;
  }
  if (hour_invalid.value) {
    error.value = '小时要填 0 到 24 之间的数字';
    page.value = 1;
    return;
  }
  error.value = '';
  submitted.value = true;

  const { 日期, 时间, 时段 } = landing_date_time();
  const hero = store.data.主角;
  hero.姓名 = form.姓名;
  hero.性别 = form.性别;
  hero.出生日期 = birth_text.value;
  hero.国籍 = form.国籍;
  hero.身高体重 = hw_text.value;
  hero.身高 = form.身高;
  hero.体重 = Number(form.体重) || 0;
  hero.体重趋势 = '平';
  hero.体重原因 = '';
  hero.体型外貌 = form.体型外貌;
  hero.过往经历 = form.过往经历;
  hero.当前位置 = form.当前位置;

  const finance = hero.财务;
  finance.收入.数值 = to_int(form.收入数值) ?? 0;
  finance.收入.周期 = form.收入周期 as '月' | '季' | '年';
  finance.收入.备注 = form.收入备注;
  finance.支出.数值 = to_int(form.支出数值) ?? 0;
  finance.支出.周期 = form.支出周期 as '月' | '季' | '年';
  finance.支出.备注 = form.支出备注;
  finance.积蓄.数值 = to_int(form.积蓄数值) ?? 0;
  finance.积蓄.备注 = form.积蓄备注;

  store.data.世界.日期 = 日期;
  store.data.世界.时间 = 时间;
  store.data.世界.时段 = 时段 as '清晨' | '上午' | '午后' | '傍晚' | '深夜';

  try {
    await createChatMessages([{ role: 'user', name: form.姓名, message: build_identity_desc() }]);
    await triggerSlash('/trigger');
  } catch (e) {
    submitted.value = false;
    error.value = `提交失败：${String(e)}`;
    console.error(e);
  }
}
</script>

<style lang="scss" scoped>
.sheet {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: var(--glass);
  -webkit-backdrop-filter: var(--glass);
  border: 1px solid var(--c-border);
  border-radius: 24px;
  box-shadow:
    var(--lift-hi),
    inset 0 1px 0 #ffffff;
  color: var(--c-text);
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 500;
  overflow: hidden;
}

/* ── 顶部 ── */
.sheet__head {
  padding: 24px 26px 18px;
  border-bottom: 1px solid var(--c-border);
}

.sheet__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.sheet__title {
  font-size: 1.9rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.1;
  color: var(--c-text);
}

.sheet__sub {
  margin-top: 6px;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--c-text-muted);
  letter-spacing: 0.005em;
}

.sheet__font {
  display: flex;
  gap: 3px;
  flex-shrink: 0;
  padding-top: 4px;
}

.sheet__fontbtn {
  padding: 5px 10px;
  border: none;
  border-radius: 7px;
  background: var(--c-surface-sunken);
  color: var(--c-text-faint);
  font-family: var(--font-ui);
  font-size: 11px;
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

.sheet__fontbtn--on {
  background: var(--c-text);
  color: #ffffff;
}

.steps {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 18px;
}

.steps__dot {
  width: 30px;
  height: 2.5px;
  border-radius: 2px;
  background: var(--c-border);
  transition: background 0.4s var(--ease);
}

.steps__dot--on {
  background: var(--c-text);
}

.steps__num {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--c-text-faint);
  letter-spacing: 0.02em;
}

/* ── 表单 ── */
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 26px 22px;
}

.page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.row2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.split3 {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 10px;
}

/* ── 字段 ── */
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.field__label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--c-text-faint);
}

.field__input {
  width: 100%;
  padding: 11px 13px;
  background: var(--c-surface-sunken);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  color: var(--c-text);
  font-family: var(--font-ui);
  font-size: 0.86rem;
  font-weight: 500;
  line-height: 1.5;
  outline: none;
  transition:
    background 0.2s var(--ease),
    border-color 0.2s var(--ease),
    box-shadow 0.2s var(--ease);

  &::placeholder {
    color: var(--c-text-faint);
    font-weight: 400;
  }

  &:hover {
    background: var(--c-surface-sunken);
  }

  &:focus {
    background: var(--c-surface-raised);
    border-color: rgba(0, 113, 227, 0.5);
    box-shadow: 0 0 0 3.5px rgba(0, 113, 227, 0.1);
  }
}

.field__input--area {
  resize: vertical;
  min-height: 64px;
  font-family: var(--font-ui);
  line-height: 1.7;
}

/* ── 带单位的小格 ── */
.cell {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
}

.cell--narrow {
  max-width: 138px;
}

.cell__in {
  flex: 1;
  min-width: 0;
  text-align: center;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.01em;
  font-weight: 600;
}

.cell__in--mono {
  letter-spacing: 0.06em;
}

.cell__unit {
  flex-shrink: 0;
  font-size: 0.74rem;
  font-weight: 550;
  color: var(--c-text-faint);
}

.cell__unit--mono {
  font-family: var(--font-mono);
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--c-text-muted);
}

/* ── 分组 ── */
.group {
  padding-top: 18px;
  border-top: 1px solid var(--c-border);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.group--top {
  padding-top: 0;
  border-top: none;
}

.group__h {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--c-text);
}

.group__desc {
  font-size: 0.76rem;
  font-weight: 500;
  color: var(--c-text-faint);
  line-height: 1.7;
}

.group__note {
  font-size: 0.76rem;
  font-weight: 500;
  color: var(--c-text-faint);
  line-height: 1.7;
}

.group__warn {
  color: var(--c-warning);
  font-weight: 600;
}

/* ── 财务三卡 ── */
.money {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 15px 16px;
  border-radius: var(--radius);
  background: var(--c-surface-sunken);
  border: 1px solid var(--c-border);
}

.money__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.money__k {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--c-text);
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

.money__ctrl {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
}

.money__unit {
  font-family: var(--font-mono);
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--c-text-faint);
  flex-shrink: 0;
}

.money__num,
.money__cycle,
.money__note {
  background: var(--c-surface-raised);
  border: 1px solid transparent;

  &:hover {
    background: var(--c-surface-raised);
  }

  &:focus {
    border-color: rgba(0, 113, 227, 0.5);
    box-shadow: 0 0 0 3.5px rgba(0, 113, 227, 0.1);
  }
}

.money__num {
  width: 128px;
  text-align: right;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  padding: 8px 11px;
  font-size: 0.86rem;
}

.money__cycle {
  width: 84px;
  padding: 8px 6px;
  font-size: 0.78rem;
  font-weight: 550;
  font-family: var(--font-ui);
  color: var(--c-text-muted);
  appearance: none;
  text-align: center;
  cursor: pointer;
}

.money__cny {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--c-text-faint);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.money__note {
  font-size: 0.8rem;
  padding: 9px 11px;
}

/* ── 错误与导航 ── */
.err {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--c-danger);
  padding-top: 2px;
}

.nav {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.nav__btn {
  flex: 1;
  padding: 13px;
  border-radius: 12px;
  font-family: var(--font-ui);
  font-size: 0.86rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition:
    background 0.2s var(--ease),
    color 0.2s var(--ease),
    border-color 0.2s var(--ease),
    opacity 0.2s var(--ease);
}

.nav__btn--main {
  border: 1px solid transparent;
  background: var(--c-text);
  color: #ffffff;

  &:hover:not(:disabled) {
    background: #000;
  }

  &:active:not(:disabled) {
    opacity: 0.82;
  }

  &:disabled {
    opacity: 0.32;
    cursor: default;
  }
}

.nav__btn--ghost {
  flex: 0 0 112px;
  border: 1px solid var(--c-border-strong);
  background: transparent;
  color: var(--c-text-muted);

  &:hover:not(:disabled) {
    background: var(--c-surface-sunken);
    color: var(--c-text);
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
}

@media (max-width: 520px) {
  .row2 {
    grid-template-columns: 1fr;
  }

  .sheet__head {
    padding: 20px 18px 15px;
  }

  .form {
    padding: 18px 18px 20px;
  }

  .money__head {
    flex-direction: column;
    align-items: stretch;
  }

  .money__num {
    flex: 1;
    width: auto;
  }
}
</style>
