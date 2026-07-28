<script setup lang="ts">
import {
  BookOpen,
  CalendarDays,
  Clock3,
  Eye,
  House,
  UserRound,
} from "@lucide/vue";
import { computed, nextTick, onMounted, ref } from "vue";
import { useData, useRoute, withBase, type DefaultTheme } from "vitepress";
import {
  countDocWords,
  formatDocMetaDate,
  resolveDocMetaBreadcrumbs,
  resolveReadingTime,
  type DocMetaConfig,
  type DocMetaPageConfig,
} from "../doc-meta";
import type { InPressThemeConfig } from "../index";

const props = defineProps<{
  config: DocMetaConfig;
}>();

const route = useRoute();
const { frontmatter, lang, localeIndex, page, site, theme } = useData<
  DefaultTheme.Config & InPressThemeConfig
>();
const measuredWordCount = ref(0);
const isZh = computed(() => lang.value.toLowerCase().startsWith("zh"));
const pageConfig = computed<DocMetaPageConfig>(() =>
  frontmatter.value.docMeta &&
  typeof frontmatter.value.docMeta === "object" &&
  !Array.isArray(frontmatter.value.docMeta)
    ? frontmatter.value.docMeta
    : {},
);
const homeLink = computed(
  () =>
    site.value.locales[localeIndex.value]?.link ||
    (localeIndex.value === "root" ? "/" : `/${localeIndex.value}/`),
);
const homeLabel = computed(
  () => props.config.homeLabel || (isZh.value ? "首页" : "Home"),
);
const breadcrumbs = computed(() =>
  resolveDocMetaBreadcrumbs(theme.value.sidebar, route.path, page.value.title),
);
const author = computed(() =>
  String(
    pageConfig.value.author ??
      frontmatter.value.author ??
      props.config.author ??
      "",
  ).trim(),
);
const configuredDate = computed(
  () => pageConfig.value.date ?? frontmatter.value.date,
);
const dateUsesGit = computed(
  () =>
    configuredDate.value === undefined && page.value.lastUpdated !== undefined,
);
const date = computed(() => {
  const value = configuredDate.value ?? page.value.lastUpdated;
  return value === undefined
    ? undefined
    : formatDocMetaDate(value, props.config.timeZone);
});
const wordCount = computed(() => {
  const configured = pageConfig.value.wordCount ?? frontmatter.value.wordCount;
  return typeof configured === "number" && configured >= 0
    ? Math.round(configured)
    : measuredWordCount.value;
});
const readingTime = computed(() => {
  const configured =
    pageConfig.value.readingTime ?? frontmatter.value.readingTime;
  return typeof configured === "number" && configured > 0
    ? configured
    : resolveReadingTime(wordCount.value, props.config.readingSpeed);
});
const views = computed(() =>
  String(pageConfig.value.views ?? frontmatter.value.views ?? "").trim(),
);
const numberFormatter = computed(() => new Intl.NumberFormat(lang.value));

const labels = computed(() =>
  isZh.value
    ? {
        author: "作者",
        breadcrumb: "面包屑导航",
        date: dateUsesGit.value ? "最后更新" : "发布时间",
        readingTime: "预计阅读时间",
        views: "浏览量",
        wordCount: "字数",
      }
    : {
        author: "Author",
        breadcrumb: "Breadcrumb",
        date: dateUsesGit.value ? "Last updated" : "Published",
        readingTime: "Estimated reading time",
        views: "Views",
        wordCount: "Word count",
      },
);

onMounted(async () => {
  if (pageConfig.value.wordCount !== undefined) return;
  await nextTick();
  const content = document.querySelector<HTMLElement>(".vp-doc");
  measuredWordCount.value = countDocWords(content?.innerText ?? "");
});
</script>

<template>
  <div class="inpress-doc-meta">
    <nav class="breadcrumbs" :aria-label="labels.breadcrumb">
      <a
        class="home"
        :href="withBase(homeLink)"
        :aria-label="homeLabel"
        :title="homeLabel"
      >
        <House aria-hidden="true" />
      </a>
      <template v-for="breadcrumb in breadcrumbs" :key="breadcrumb.text">
        <span class="separator" aria-hidden="true">/</span>
        <a v-if="breadcrumb.link" :href="withBase(breadcrumb.link)">
          {{ breadcrumb.text }}
        </a>
        <span v-else class="current" aria-current="page">
          {{ breadcrumb.text }}
        </span>
      </template>
    </nav>

    <ul class="details">
      <li v-if="author" :title="labels.author">
        <UserRound aria-hidden="true" />
        <span class="sr-only">{{ labels.author }}:</span>
        <span>{{ author }}</span>
      </li>
      <li v-if="date" :title="labels.date">
        <CalendarDays aria-hidden="true" />
        <span class="sr-only">{{ labels.date }}:</span>
        <time>{{ date }}</time>
      </li>
      <li v-if="wordCount > 0" :title="labels.wordCount">
        <BookOpen aria-hidden="true" />
        <span class="sr-only">{{ labels.wordCount }}:</span>
        <span>{{ numberFormatter.format(wordCount) }}</span>
      </li>
      <li v-if="readingTime > 0" :title="labels.readingTime">
        <Clock3 aria-hidden="true" />
        <span class="sr-only">{{ labels.readingTime }}:</span>
        <span>{{ readingTime }}m</span>
      </li>
      <li v-if="views" :title="labels.views">
        <Eye aria-hidden="true" />
        <span class="sr-only">{{ labels.views }}:</span>
        <span>{{ views }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.inpress-doc-meta {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--inpress-doc-meta-column-gap, 24px);
  width: calc(100% + 64px);
  min-width: 0;
  margin: -48px -32px var(--inpress-doc-meta-margin-bottom, 24px);
  padding: var(--inpress-doc-meta-padding-top, 28px) 32px
    var(--inpress-doc-meta-padding-bottom, 12px);
  color: var(--inpress-doc-meta-color, var(--vp-c-text-2));
  font-size: var(--inpress-doc-meta-font-size, 14px);
  line-height: 22px;
}

.breadcrumbs,
.details,
.details li,
.home {
  display: flex;
  align-items: center;
}

.breadcrumbs {
  flex: 0 1 auto;
  gap: var(--inpress-doc-meta-breadcrumb-gap, 10px);
  min-width: 0;
  white-space: nowrap;
}

.breadcrumbs a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumbs a:hover {
  color: var(--vp-c-brand-1);
}

.home {
  flex: none;
  justify-content: center;
  width: 22px;
  height: 22px;
  color: var(--inpress-doc-meta-strong-color, var(--vp-c-text-1));
}

.separator {
  flex: none;
  color: var(--inpress-doc-meta-separator-color, var(--vp-c-divider));
  font-size: 20px;
  font-weight: 300;
}

.current {
  overflow: hidden;
  color: var(--inpress-doc-meta-strong-color, var(--vp-c-text-1));
  font-weight: 600;
  text-overflow: ellipsis;
}

.details {
  flex: 0 1 auto;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: var(--inpress-doc-meta-row-gap, 6px)
    var(--inpress-doc-meta-item-gap, 16px);
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.details li {
  gap: 5px;
  white-space: nowrap;
}

svg {
  flex: none;
  width: var(--inpress-doc-meta-icon-size, 17px);
  height: var(--inpress-doc-meta-icon-size, 17px);
  stroke-width: 1.75;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 640px) {
  .inpress-doc-meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .breadcrumbs {
    width: 100%;
    overflow: hidden;
  }

  .details {
    justify-content: flex-start;
    gap: 5px 12px;
  }
}

@media (max-width: 767px) {
  .inpress-doc-meta {
    width: calc(100% + 48px);
    margin: -32px -24px var(--inpress-doc-meta-mobile-margin-bottom, 24px);
    padding: var(--inpress-doc-meta-mobile-padding-top, 24px) 24px 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .breadcrumbs a {
    transition: none;
  }
}
</style>
