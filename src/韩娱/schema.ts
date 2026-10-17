export const Schema = z.object({
  世界: z
    .object({
      日期: z.string().prefault('2024-01-01'),
      时间: z.string().prefault('09:00'),
      时段: z.enum(['清晨', '上午', '午后', '傍晚', '深夜']).catch('上午'),
      世代: z.enum(['一代', '二代', '三代', '四代', '五代', '六代']).catch('五代'),
      当前场域: z
        .enum([
          '公司与练习室层',
          '舞台与放送层',
          '生活与私域层',
          '商务与活动层',
          '舆论与粉丝层',
          '跨国与巡演层',
          '身体与健康层',
        ])
        .catch('生活与私域层'),
      当前场景: z.string().prefault(''),
      行业大事: z.string().prefault(''),
      事件队列: z
        .record(
          z.string(),
          z
            .object({
              触发日期: z.string().prefault(''),
              说明: z.string().prefault(''),
              状态: z.string().prefault('待触发'),
            })
            .prefault({}),
        )
        .prefault({}),
    })
    .prefault({}),

  主角: z
    .object({
      姓名: z.string().prefault(''),
      性别: z.string().prefault(''),
      出生日期: z.string().prefault(''),
      国籍: z.string().prefault(''),
      身高体重: z.string().prefault(''),
      身高: z.string().prefault(''),
      体重: z.coerce
        .number()
        .transform((v) => Math.max(0, Math.round(v * 10) / 10))
        .prefault(0),
      体重趋势: z.enum(['升', '降', '平']).catch('平'),
      体重原因: z.string().prefault(''),
      体型外貌: z.string().prefault(''),
      过往经历: z.string().prefault(''),
      当前位置: z.string().prefault(''),
      身份: z.string().prefault(''),
      所属社: z.string().prefault(''),
      出道年: z.string().prefault(''),
      事业: z
        .object({
          人气: z.coerce.number().transform((v) => _.clamp(Math.round(v), 0, 100)).prefault(0),
          实力: z.coerce.number().transform((v) => _.clamp(Math.round(v), 0, 100)).prefault(0),
          资源层级: z.enum(['素人', '练习生', '新人', '上升期', '一线', '顶流']).catch('素人'),
          /** 四路资源各自的具体内容，例：「迪奥 · 品牌挚友」 */
          资源详情: z
            .object({
              奢牌代言: z.string().prefault(''),
              影视资源: z.string().prefault(''),
              综艺常驻: z.string().prefault(''),
              时尚封面: z.string().prefault(''),
            })
            .prefault({}),
        })
        .prefault({}),
      财务: z
        .object({
          收入: z
            .object({
              数值: z.coerce.number().transform((v) => Math.round(v)).prefault(0),
              周期: z.enum(['月', '季', '年']).catch('月'),
              备注: z.string().prefault(''),
            })
            .prefault({}),
          支出: z
            .object({
              数值: z.coerce.number().transform((v) => Math.round(v)).prefault(0),
              周期: z.enum(['月', '季', '年']).catch('月'),
              备注: z.string().prefault(''),
            })
            .prefault({}),
          积蓄: z
            .object({
              数值: z.coerce.number().transform((v) => Math.round(v)).prefault(0),
              备注: z.string().prefault(''),
            })
            .prefault({}),
        })
        .prefault({}),
    })
    .prefault({}),

  恋爱线: z
    .record(
      z.string(),
      z
        .object({
          好感度: z.coerce.number().transform((v) => _.clamp(Math.round(v), 0, 100)).prefault(0),
          信任度: z.coerce.number().transform((v) => _.clamp(Math.round(v), 0, 100)).prefault(0),
          隐蔽度: z.coerce.number().transform((v) => _.clamp(Math.round(v), 0, 100)).prefault(0),
          曝光风险: z.coerce.number().transform((v) => _.clamp(Math.round(v), 0, 100)).prefault(0),
          关系阶段: z.enum(['陌生', '相识', '亲近', '暧昧', '恋人', '纠缠']).catch('陌生'),
        })
        .prefault({}),
    )
    .prefault({}),

  舆论: z
    .object({
      热度: z.coerce.number().transform((v) => _.clamp(Math.round(v), 0, 100)).prefault(0),
      风评: z.enum(['正向', '中立', '负面', '高危']).catch('中立'),
      危机倒计时: z.string().prefault(''),
      当前议题: z.array(z.string()).prefault([]),
    })
    .prefault({}),

  粉丝: z
    .object({
      规模: z.string().prefault(''),
      构成: z
        .object({
          唯粉: z.coerce.number().transform((v) => _.clamp(Math.round(v), 0, 100)).prefault(0),
          团粉: z.coerce.number().transform((v) => _.clamp(Math.round(v), 0, 100)).prefault(0),
          站姐: z.coerce.number().transform((v) => _.clamp(Math.round(v), 0, 100)).prefault(0),
          数据粉: z.coerce.number().transform((v) => _.clamp(Math.round(v), 0, 100)).prefault(0),
          战斗粉: z.coerce.number().transform((v) => _.clamp(Math.round(v), 0, 100)).prefault(0),
        })
        .prefault({}),
      应援力: z.coerce.number().transform((v) => _.clamp(Math.round(v), 0, 100)).prefault(0),
    })
    .prefault({}),

  成绩: z
    .object({
      音源: z.string().prefault(''),
      销量: z.string().prefault(''),
      一位: z.coerce.number().transform((v) => Math.max(0, Math.round(v))).prefault(0),
      直拍: z.string().prefault(''),
      品牌评价: z.string().prefault(''),
      既往成就: z
        .array(
          z
            .object({
              日期: z.coerce.string().prefault(''),
              内容: z.coerce.string().prefault(''),
            })
            .prefault({}),
        )
        .prefault([]),
    })
    .prefault({}),

  关系网: z
    .record(
      z.string(),
      z
        .object({
          立场: z.enum(['支持', '中立', '敌意']).catch('中立'),
          张力: z.coerce.number().transform((v) => _.clamp(Math.round(v), 0, 100)).prefault(0),
        })
        .prefault({}),
    )
    .prefault({}),

  身体: z
    .object({
      状态: z.enum(['良好', '疲惫', '透支', '伤病']).catch('良好'),
      疲劳: z.coerce.number().transform((v) => _.clamp(Math.round(v), 0, 100)).prefault(0),
      伤病: z.string().prefault(''),
    })
    .prefault({}),
});

export type SchemaType = z.infer<typeof Schema>;
