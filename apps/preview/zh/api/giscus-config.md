# GiscusConfig

- 导入路径：`@inp146/inpress`
- 类型：TypeScript interface

描述 [`giscus`](/zh/config/giscus) 配置的评论组件。

| 字段 | 类型 | 必填 | 默认值 |
| --- | --- | --- | --- |
| `repo` | `string` | 是 | - |
| `repoId` | `string` | 是 | - |
| `category` | `string` | 是 | - |
| `categoryId` | `string` | 是 | - |
| `mapping` | `GiscusMapping` | 否 | `'pathname'` |
| `term` | `string` | 否 | - |
| `strict` | `boolean` | 否 | `false` |
| `reactionsEnabled` | `boolean` | 否 | `true` |
| `emitMetadata` | `boolean` | 否 | `false` |
| `inputPosition` | `'top' | 'bottom'` | 否 | `'bottom'` |
| `theme` | `string | GiscusTheme` | 否 | 跟随外观模式 |
| `lang` | `string` | 否 | 当前页面语言 |
| `loading` | `'lazy'` | 否 | 浏览器默认行为 |

请使用 [giscus.app](https://giscus.app) 生成的仓库、分类和行为参数。需要显式讨论项的映射模式会使用 `term` 字段。

