# routeProgress

- Type: `boolean`
- Default: `true`

Displays a brand-colored progress bar at the top of the viewport while a client-side route is loading.

```ts
export default defineConfig({
  themeConfig: {
    routeProgress: false
  }
})
```

Set it to `false` to remove the progress bar. Its appearance can be adjusted in the consuming site's theme stylesheet:

```css
:root {
  --inpress-route-progress-color: var(--vp-c-brand-1);
  --inpress-route-progress-height: 3px;
}
```

Same-page anchor navigation does not display the progress bar. The animation also respects the user's reduced-motion preference.
