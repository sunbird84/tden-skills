# tden-skills

> 英文版:[README.md](README.md)

> 状态:**Phase A2.6** —— 首批 5 个官方 manifest + JSON schema。Phase B 将开放社区 PR,并加入链上锚定的 manifest 哈希。

预制 TDEN 场景包配方的市场。每一个 "Skill" 都是一份 JSON manifest:RP 可在 TDEN RP Toolkit 的 Designer 页面 Fork 后修改,再提交至门户 —— 省去自己拼凑某个垂直行业字段集与说辞的工作。

可类比成:浏览器扩展,但面向身份场景。

## 这个仓库为什么存在

TDEN 是横向基础设施(OIDC IdP + 场景包 + 同意账本)。我们不是银行专家,也不是医疗或电商专家。Skills 市场是让行业专家共享其领域内经过验证的字段配方的方式 —— 也是让 RP 从零到"用 TDEN 登录"由数天变为数分钟的方式。

## 现有 Skills(Phase A2.6 官方集合)

| ID | 名称 | 类别 | 敏感度 | 用例 |
|---|---|---|---|---|
| `kyc-crypto-exchange` | Crypto Exchange KYC | kyc | sensitive | 符合 FATF Travel Rule 的开户流程 |
| `age-gate-18` | Age Gate (18+) | age-verification | sensitive | 成人内容 / 博彩 / 年龄受限服务 |
| `ecommerce-shipping` | E-commerce Shipping | ecommerce | sensitive | 标准电商结账(姓名 + 电话 + 地址) |
| `social-basic` | Social Platform Basic Profile | social | normal | 默认匿名的社交平台开通 |
| `gov-permit` | Government Permit Application | gov | sensitive | 中国政务服务 / 等价的公民服务 |

## Manifest 格式

每个 Skill 是 `manifests/<id>.json` 下的单个 JSON 文件,需通过 `schema/skill-v1.schema.json` 校验。必填字段:

- `id`、`name`、`version`、`category`
- `fields[]` —— `{ tag, required, justification }` 数组
- `purpose` —— 数据用途,在用户同意时展示
- `lawful_basis` —— GDPR 风格的声明
- `auth_types[]`、`max_validity_seconds`、`max_queries_per_day`

可选但鼓励:`name_zh`、`description_zh`、`purpose_zh`、`compliance[]`。

## 在你的 RP 中使用 Skill

1. 打开 **TDEN RP Toolkit**(Tauri 应用)
2. 进入 **Skills** Tab
3. 浏览 + 点击 "Fork to Designer"
4. 定制 —— 改 package_id 为你的、加你的 redirect URI、按你的措辞改字段说辞
5. 在 Designer 中点击 "🚀 提交到 Portal"
6. 等待 SIN 审核员批准(普通 3-of-N,敏感 5-of-N + DAO)
7. 一次性拿到 `client_id` + `client_secret`
8. 接入 `@tden/sdk` 或 `tden-sdk-go` —— 完工

## 贡献新 Skill

自 Phase A2.6 起接受社区 PR。

1. Fork 此仓库
2. 添加符合 schema 的 `manifests/<your-skill-id>.json`
3. 本地校验:
   ```bash
   npx ajv-cli validate -s schema/skill-v1.schema.json -d manifests/your-skill.json
   ```
4. 提 PR,内容包括:
   - 简短描述(用例是什么?)
   - 为什么所选字段集是最小够用集
   - 合规考虑(服务于 / 风险来自哪些法规?)
5. TDEN 团队评审;通过后,manifest 上线市场

### 通过条件

满足以下条件的 Skill 才会被接受:

- ✅ 字段集**最小够用** —— 不允许"将来也许会用"的字段
- ✅ 说辞**真实具体** —— 不能写"用于服务改进"
- ✅ 合规标记**准确** —— 不能在没有明确依据的情况下声称符合 GDPR
- ✅ 作者亮明身份(实名 / 组织 / DID)
- ✅ Schema 校验通过

会被拒的:

- ❌ 包含明显不必要的敏感字段(聊天 App 要"出生日期")
- ❌ 说辞模糊("用户体验优化")
- ❌ 没有明确监管需求却抬高了敏感度
- ❌ 作者匿名且 Skill 涉及敏感数据

## Phase B 路线图

- **链上锚定 manifest 哈希** —— 每个被批准的 Skill 在 TDEN 链上获得锚点;RP 可校验所下载的 Skill 与批准时一致,防止供应链攻击
- **Skill 评分** —— 用过的 RP 打分(0-5),反映质量
- **本地化注册** —— 社区翻译的 `*_zh` / `*_es` / `*_ar` 等
- **垂直组合包** —— 相关 Skill 的捆绑(如"电商起步包" = 配送 + 年龄门槛 + 客服)

## 许可证

Schema 与工具:AGPL-3.0。
`manifests/` 中的 manifest 文件:**CC0-1.0**(公共领域)。拿走、改、出货,我们不保留任何 fork 上的权利。
