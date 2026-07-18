# 样式扩展

InPress 提供少量内容与导航样式，并通过消费站点主题样式表中的 CSS 自定义属性进行控制。

## 文本记号笔

下划线记号笔适合短文本强调，笔刷高亮适合标记一段文字：

<p><mark>下划线记号笔</mark></p>
<p><mark class="highlight">笔刷风格高亮文本</mark></p>

```html
<mark>下划线记号笔</mark>
<mark class="highlight">笔刷风格高亮文本</mark>
```

两种记号笔使用 VitePress 品牌 token，包括由 [`color`](/zh/config/color) 生成的色板。可通过 `--inpress-marker-color` 和 `--inpress-marker-highlight-color` 覆盖颜色，通过 `--inpress-marker-thickness`、`--inpress-marker-offset` 和 `--inpress-marker-highlight-radius` 调整形态。

## 侧边栏层级

一级页面链接默认相对分组标题缩进 `16px`。可在消费站点的样式表中覆盖：

```css
:root {
  --inpress-sidebar-indent: 20px;
}
```

