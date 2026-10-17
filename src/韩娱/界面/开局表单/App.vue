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

      <p v-if="error" class="err">{{ error }}</p>

      <button class="submit" type="submit" :disabled="submitted">
        {{ submitted ? '已入场' : '进入这个世界' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const form = reactive({
  姓名: '',
  性别: '',
  出生日期: '',
  国籍: '',
  身高体重: '',
  体型外貌: '',
  过往经历: '',
  当前位置: '',
});

const error = ref('');
const submitted = ref(false);

/** 「170cm / 52kg」「170/52」都要能拆，拆不出来就只留原文 */
function split_height_weight(raw: string) {
  const nums = raw.match(/\d+(?:\.\d+)?/g) ?? [];
  if (nums.length < 2) {
    return { 身高: '', 体重: '' };
  }
  return { 身高: nums[0], 体重: nums[1] };
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
  ];
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
}
</style>
