<template>
  <div class="sheet">
    <header class="sheet__head">
      <h1 class="sheet__title">入场</h1>
      <p class="sheet__sub">填完这一页，你就站在这张网里了</p>
    </header>

    <form class="form" @submit.prevent="submit">
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
          <label class="field__label" for="f-birth">出生日期</label>
          <input id="f-birth" v-model.trim="form.出生日期" class="field__input" type="text" placeholder="2002-04-17" />
        </div>
      </div>

      <div class="row2">
        <div class="field">
          <label class="field__label" for="f-nation">国籍</label>
          <input id="f-nation" v-model.trim="form.国籍" class="field__input" type="text" placeholder="韩国 / 中国 / 日本" />
        </div>
        <div class="field">
          <label class="field__label" for="f-hw">身高体重</label>
          <input id="f-hw" v-model.trim="form.身高体重" class="field__input" type="text" placeholder="170cm / 52kg" />
        </div>
      </div>

      <div class="field">
        <label class="field__label" for="f-look">体型外貌</label>
        <textarea
          id="f-look"
          v-model.trim="form.体型外貌"
          class="field__input field__input--area"
          rows="3"
          placeholder="别人第一眼会记住你身上的哪一点"
        ></textarea>
      </div>

      <div class="field">
        <label class="field__label" for="f-past">过往经历</label>
        <textarea
          id="f-past"
          v-model.trim="form.过往经历"
          class="field__input field__input--area"
          rows="4"
          placeholder="你是从哪来的：练了几年、代表哪个公司出过道、还是刚从地方上来"
        ></textarea>
      </div>

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

      <section class="group">
        <h3 class="group__h">当前时间</h3>
        <div class="row2">
          <div class="field">
            <label class="field__label" for="f-date">日期</label>
            <input id="f-date" v-model="form.日期" class="field__input" type="date" />
          </div>
          <div class="field">
            <label class="field__label" for="f-hour">几点</label>
            <select id="f-hour" v-model.number="form.小时" class="field__input">
              <option v-for="h in hours" :key="h" :value="h">{{ pad(h) }}:00</option>
            </select>
          </div>
        </div>
        <p class="group__note">只填到小时。时段会自动按 {{ derived_slot }} 记。</p>
      </section>

      <section class="group">
        <h3 class="group__h">财务状况</h3>
        <p class="group__desc">三栏都可以留空。以韩元记账，允许为负，负债直接写负数。</p>

        <div class="money">
          <div class="money__head">
            <span class="money__k">收入</span>
            <div class="money__ctrl">
              <span class="money__unit">₩</span>
              <input
                v-model="form.收入数值"
                class="field__input money__num"
                type="number"
                step="1"
                placeholder="0"
              />
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
              <input
                v-model="form.支出数值"
                class="field__input money__num"
                type="number"
                step="1"
                placeholder="0"
              />
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
              <input
                v-model="form.积蓄数值"
                class="field__input money__num"
                type="number"
                step="1"
                placeholder="0"
              />
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

      <p v-if="error" class="err">{{ error }}</p>

      <button class="submit" type="submit" :disabled="submitted">
        {{ submitted ? '已入场' : '进入这个世界' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { cny_of, krw } from '../currency';
import { useDataStore } from '../store';

const store = useDataStore();

const hours = Array.from({ length: 24 }, (_, i) => i);

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const form = reactive({
  姓名: '',
  性别: '',
  出生日期: '',
  国籍: '',
  身高体重: '',
  体型外貌: '',
  过往经历: '',
  当前位置: '',
  日期: today(),
  小时: 9,
  收入数值: '',
  收入周期: '月',
  收入备注: '',
  支出数值: '',
  支出周期: '月',
  支出备注: '',
  积蓄数值: '',
  积蓄备注: '',
});

const error = ref('');
const submitted = ref(false);

/** 与变量更新规则里的时段划分保持一致 */
function slot_of(hour: number) {
  if (hour >= 5 && hour <= 8) return '清晨';
  if (hour >= 9 && hour <= 11) return '上午';
  if (hour >= 12 && hour <= 17) return '午后';
  if (hour >= 18 && hour <= 20) return '傍晚';
  return '深夜';
}

const derived_slot = computed(() => slot_of(form.小时));

/** 「170cm / 52kg」「170/52」都要能拆，拆不出来就只留原文 */
function split_height_weight(raw: string) {
  const nums = raw.match(/\d+(?:\.\d+)?/g) ?? [];
  if (nums.length < 2) {
    return { 身高: '', 体重: '' };
  }
  return { 身高: nums[0], 体重: nums[1] };
}

function to_int(raw: string) {
  if (raw === '' || raw === null || raw === undefined) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? Math.round(n) : null;
}

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

function build_identity_desc() {
  const lines = [
    `姓名：${form.姓名}`,
    `性别：${form.性别 || '未说明'}`,
    `出生日期：${form.出生日期 || '未说明'}`,
    `国籍：${form.国籍 || '未说明'}`,
    `身高体重：${form.身高体重 || '未说明'}`,
    `体型外貌：${form.体型外貌 || '未说明'}`,
    `过往经历：${form.过往经历 || '未说明'}`,
    `当前位置：${form.当前位置 || '未说明'}`,
    `当前时间：${form.日期} ${pad(form.小时)}:00（${derived_slot.value}）`,
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

async function submit() {
  if (submitted.value) {
    return;
  }
  if (!form.姓名) {
    error.value = '至少要填名字';
    return;
  }
  error.value = '';
  submitted.value = true;

  const { 身高, 体重 } = split_height_weight(form.身高体重);
  const hero = store.data.主角;
  hero.姓名 = form.姓名;
  hero.性别 = form.性别;
  hero.出生日期 = form.出生日期;
  hero.国籍 = form.国籍;
  hero.身高体重 = form.身高体重;
  hero.身高 = 身高;
  hero.体重 = 体重;
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

  if (form.日期) {
    store.data.世界.日期 = form.日期;
  }
  store.data.世界.时间 = `${pad(form.小时)}:00`;
  store.data.世界.时段 = derived_slot.value as '清晨' | '上午' | '午后' | '傍晚' | '深夜';

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
  background: var(--c-surface);
  border: 1px solid var(--c-border-strong);
  border-radius: var(--radius);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.42);
  color: var(--c-text);
  font-size: 13px;
  overflow: hidden;
}

.sheet__head {
  padding: 16px 18px 12px;
  background: linear-gradient(160deg, var(--c-surface-raised), var(--c-surface));
  border-bottom: 1px solid var(--c-border);
}

.sheet__title {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: var(--c-primary);
}

.sheet__sub {
  margin-top: 5px;
  font-size: 0.76rem;
  color: var(--c-text-muted);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 18px 18px;
}

.row2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.field__label {
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  color: var(--c-text-faint);
}

.field__input {
  width: 100%;
  padding: 8px 10px;
  background: var(--c-surface-sunken);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  color: var(--c-text);
  font-family: var(--font-ui);
  font-size: 0.8rem;
  line-height: 1.55;
  outline: none;
  transition: border-color 0.16s ease;

  &::placeholder {
    color: var(--c-text-faint);
  }

  &:focus {
    border-color: var(--c-primary-dim);
  }
}

.field__input--area {
  resize: vertical;
  min-height: 56px;
}

.group {
  padding-top: 12px;
  border-top: 1px dashed var(--c-border);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.group__h {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: var(--c-primary);
}

.group__desc {
  font-size: 0.72rem;
  color: var(--c-text-faint);
  line-height: 1.5;
  margin-top: -4px;
}

.group__note {
  font-size: 0.72rem;
  color: var(--c-text-faint);
  line-height: 1.5;
}

.money {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 9px 10px;
  border: 1px solid var(--c-border);
  border-radius: 6px;
  background: var(--c-surface-sunken);
}

.money__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.money__k {
  font-size: 0.74rem;
  color: var(--c-text-muted);
  letter-spacing: 0.08em;
  flex-shrink: 0;
}

.money__ctrl {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.money__unit {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--c-text-faint);
  flex-shrink: 0;
}

.money__num {
  width: 108px;
  text-align: right;
  font-family: var(--font-mono);
}

.money__cycle {
  width: 76px;
}

.money__cny {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--c-text-faint);
  text-align: right;
  min-height: 0;
}

.money__note {
  font-size: 0.76rem;
}

.err {
  font-size: 0.74rem;
  color: var(--c-danger);
}

.submit {
  margin-top: 4px;
  padding: 10px;
  border: 1px solid var(--c-primary-dim);
  border-radius: 6px;
  background: var(--c-primary-dim);
  color: var(--c-text);
  font-family: var(--font-ui);
  font-size: 0.84rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  cursor: pointer;
  transition:
    background 0.18s ease,
    opacity 0.18s ease;

  &:hover:not(:disabled) {
    background: var(--c-primary);
    border-color: var(--c-primary);
    color: #0b0d10;
  }

  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
}

@media (max-width: 520px) {
  .row2 {
    grid-template-columns: 1fr;
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
