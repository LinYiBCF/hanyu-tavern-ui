import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '../schema';

/** 状态栏、开局表单共用同一份 store，保证读写的 stat_data 是同一个形态 */
export const useDataStore = defineMvuDataStore(Schema, { type: 'message', message_id: getCurrentMessageId() });
