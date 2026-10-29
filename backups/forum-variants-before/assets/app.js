(() => {
  "use strict";

  const topicItems = Array.from(document.querySelectorAll(".topic-item"));
  const topicLinks = Array.from(document.querySelectorAll(".topic-row"));
  const records = Array.from(document.querySelectorAll(".thread-view"));
  const categoryButtons = Array.from(document.querySelectorAll(".category-button"));
  const viewButtons = Array.from(document.querySelectorAll(".view-filter"));
  const searchForm = document.querySelector(".global-search");
  const searchInput = document.querySelector("#experience-search");
  const inlineClear = document.querySelector(".inline-clear");
  const resetButtons = Array.from(document.querySelectorAll(".clear-filters, .empty-reset"));
  const status = document.querySelector("#index-status");
  const emptyState = document.querySelector("#empty-state");
  const threadStack = document.querySelector("#thread-stack");
  const languageButton = document.querySelector("#language-toggle");
  const menuButton = document.querySelector(".menu-toggle");
  const globalNav = document.querySelector("#global-nav");
  const mobileMenu = window.matchMedia("(max-width: 880px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const composer = document.querySelector("#composer-dialog");
  const composerOpeners = Array.from(document.querySelectorAll("[data-open-composer]"));

  let activeTopic = "all";
  let activeStatus = "all";
  let activeId = "automation-evidence-gate";
  let locale = "en";

  const copyTemplates = {
    en: `# Experience title

Status: editorial sample / field note / partially reproduced / directly reproducible
Category:
Environment and versions:

## Goal
What is the final artifact, and what conditions prove completion?

## Trigger
Which event, schedule, or human action starts the run? Where does input come from?

## Execution
List the actions in real order and retain meaningful intermediate state.

## Verification
How do you verify content, path, and any external state change?

## Failure handling
What is retained after failure? Which stages are safe to retry? How are duplicate side effects prevented?

## Stop conditions
When must execution stop and hand control to a person?

## Evidence
List logs, state files, source locators, artifact paths, and read-back results.

## Reproduction
Record prerequisites, entry point, steps, expected result, and expected failure.

## Limits
What has not been verified? Which environments or conclusions cannot be generalized?`,
    zh: `# 经验标题

状态：编辑样例 / 实战记录 / 部分复现 / 可直接复现
主题：
环境与版本：

## 目标
最终产物是什么？什么条件下才算完成？

## 触发
由什么事件、时间或人工动作触发？输入从哪里来？

## 执行
按实际顺序写动作，并保留关键中间状态。

## 验证
如何确认内容正确、路径正确、外部状态已经生效？

## 失败处理
失败时保留什么？哪些阶段可以重试？如何避免重复副作用？

## 停止条件
在什么情况下必须停止并交给人工判断？

## 证据
列出日志、状态文件、来源定位、产物路径与回读结果。

## 复现路径
写出前提、入口、步骤、预期结果与预期失败。

## 限制
哪些结论没有验证？哪些环境不能外推？`
  };

  const strings = {
    en: {
      count: (value) => `${value} ${value === 1 ? "experience" : "experiences"}`,
      noResults: "No matching experiences",
      copiedTemplate: "Draft template copied.",
      copiedLink: "Topic link copied.",
      copyFailed: "Copy was blocked by the browser. Select and copy the content manually.",
      switchLanguage: "切换到中文",
      openNavigation: "Open navigation",
      closeNavigation: "Close navigation"
    },
    zh: {
      count: (value) => `${value} 条经验`,
      noResults: "没有匹配的经验",
      copiedTemplate: "草稿模板已复制。",
      copiedLink: "主题链接已复制。",
      copyFailed: "浏览器阻止了复制，请手动选择并复制内容。",
      switchLanguage: "Switch to English",
      openNavigation: "打开导航",
      closeNavigation: "关闭导航"
    }
  };

  function normalize(value) {
    return String(value || "").trim().toLocaleLowerCase(locale === "zh" ? "zh-CN" : "en");
  }

  function visibleItems() {
    return topicItems.filter((item) => !item.hidden);
  }

  function setPressed(buttons, activeButton) {
    buttons.forEach((button) => {
      const isActive = button === activeButton;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function activateRecord(id, options = {}) {
    const { updateHash = true, scroll = false, focus = false } = options;
    const targetItem = topicItems.find((item) => item.dataset.id === id && !item.hidden);
    const targetRecord = records.find((record) => record.dataset.record === id);

    if (!targetItem || !targetRecord) return;

    activeId = id;
    topicItems.forEach((item) => item.classList.toggle("is-selected", item === targetItem));
    topicLinks.forEach((link) => {
      const isCurrent = link.closest(".topic-item") === targetItem;
      if (isCurrent) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
    records.forEach((record) => {
      const isActive = record === targetRecord;
      record.classList.toggle("is-active", isActive);
      record.setAttribute("aria-hidden", String(!isActive));
    });
    threadStack.hidden = false;

    if (updateHash) {
      const nextHash = `#topic-${id}`;
      if (window.location.hash !== nextHash) window.history.replaceState(null, "", nextHash);
    }

    if (scroll) {
      window.requestAnimationFrame(() => {
        targetRecord.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
        if (focus) targetRecord.querySelector("h3")?.focus({ preventScroll: true });
      });
    }
  }

  function applyFilters() {
    const query = normalize(searchInput.value);

    topicItems.forEach((item) => {
      const topicMatch = activeTopic === "all" || item.dataset.topic === activeTopic;
      const statusMatch = activeStatus === "all" || item.dataset.status === activeStatus;
      const haystack = normalize(`${item.dataset.search || ""} ${item.textContent}`);
      const searchMatch = !query || haystack.includes(query);
      item.hidden = !(topicMatch && statusMatch && searchMatch);
    });

    const visible = visibleItems();
    status.textContent = visible.length === 0 ? strings[locale].noResults : strings[locale].count(visible.length);
    emptyState.hidden = visible.length !== 0;
    inlineClear.hidden = !query;

    if (visible.length === 0) {
      records.forEach((record) => {
        record.classList.remove("is-active");
        record.setAttribute("aria-hidden", "true");
      });
      threadStack.hidden = true;
      return;
    }

    threadStack.hidden = false;
    if (!visible.some((item) => item.dataset.id === activeId)) {
      activateRecord(visible[0].dataset.id, { updateHash: false, scroll: false });
    }
  }

  function resetFilters(options = {}) {
    const { focusSearch = false } = options;
    searchInput.value = "";
    activeTopic = "all";
    activeStatus = "all";
    setPressed(categoryButtons, categoryButtons.find((button) => button.dataset.topic === "all"));
    setPressed(viewButtons, viewButtons.find((button) => button.dataset.status === "all"));
    applyFilters();
    if (focusSearch) searchInput.focus();
  }

  topicLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const id = link.closest(".topic-item").dataset.id;
      activateRecord(id, { updateHash: true, scroll: true });
    });
  });

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeTopic = button.dataset.topic;
      setPressed(categoryButtons, button);
      applyFilters();
    });
  });

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeStatus = button.dataset.status;
      setPressed(viewButtons, button);
      applyFilters();
    });
  });

  searchForm.addEventListener("submit", (event) => event.preventDefault());
  searchInput.addEventListener("input", applyFilters);
  inlineClear.addEventListener("click", () => {
    searchInput.value = "";
    applyFilters();
    searchInput.focus();
  });
  resetButtons.forEach((button) => button.addEventListener("click", () => resetFilters({ focusSearch: button.classList.contains("empty-reset") })));

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target.isContentEditable;
    if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey && !isTyping) {
      event.preventDefault();
      searchInput.focus();
    }
  });

  function syncMenu() {
    if (mobileMenu.matches) {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      globalNav.hidden = !open;
    } else {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", strings[locale].openNavigation);
      globalNav.hidden = false;
    }
  }

  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    menuButton.setAttribute("aria-label", open ? strings[locale].openNavigation : strings[locale].closeNavigation);
    globalNav.hidden = open;
  });

  globalNav.addEventListener("click", (event) => {
    if (mobileMenu.matches && event.target.closest("a")) {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", strings[locale].openNavigation);
      globalNav.hidden = true;
    }
  });

  mobileMenu.addEventListener("change", syncMenu);

  function applyLocale(nextLocale, options = {}) {
    const { persist = true } = options;
    locale = nextLocale === "zh" ? "zh" : "en";
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.language = locale;

    document.querySelectorAll("[data-en][data-zh]").forEach((element) => {
      element.textContent = element.dataset[locale];
    });
    document.querySelectorAll("[data-placeholder-en][data-placeholder-zh]").forEach((element) => {
      element.setAttribute("placeholder", element.dataset[`placeholder${locale === "zh" ? "Zh" : "En"}`]);
    });
    document.querySelectorAll("[data-label-en][data-label-zh]").forEach((element) => {
      element.setAttribute("aria-label", element.dataset[`label${locale === "zh" ? "Zh" : "En"}`]);
    });

    languageButton.textContent = locale === "en" ? "中文" : "EN";
    languageButton.setAttribute("aria-label", strings[locale].switchLanguage);
    languageButton.setAttribute("title", strings[locale].switchLanguage);
    document.title = locale === "en" ? "问津 / WENJIN · Agent Experience Forum" : "问津 / WENJIN · 智能体经验论坛";
    menuButton.setAttribute("aria-label", menuButton.getAttribute("aria-expanded") === "true" ? strings[locale].closeNavigation : strings[locale].openNavigation);

    if (persist) {
      try {
        window.localStorage.setItem("wenjin-language", locale);
      } catch (error) {
        // The interface remains bilingual even when storage is unavailable.
      }
    }
    applyFilters();
  }

  languageButton.addEventListener("click", () => applyLocale(locale === "en" ? "zh" : "en"));

  function openComposer() {
    if (typeof composer.showModal === "function") composer.showModal();
    else composer.setAttribute("open", "");
  }

  composerOpeners.forEach((button) => button.addEventListener("click", openComposer));
  composer.addEventListener("click", (event) => {
    if (event.target === composer) composer.close();
  });

  async function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (!copied) throw new Error("copy command rejected");
  }

  function statusTargetFor(button) {
    return button.closest(".composer-dialog")?.querySelector(".dialog-status") || button.closest(".post-body")?.querySelector(".action-status");
  }

  document.querySelectorAll("[data-copy-template]").forEach((button) => {
    button.addEventListener("click", async () => {
      const target = statusTargetFor(button);
      if (target) target.textContent = "";
      try {
        await copyText(copyTemplates[locale]);
        if (target) target.textContent = strings[locale].copiedTemplate;
      } catch (error) {
        if (target) target.textContent = strings[locale].copyFailed;
      }
    });
  });

  document.querySelectorAll("[data-copy-link]").forEach((button) => {
    button.addEventListener("click", async () => {
      const target = statusTargetFor(button);
      const record = button.closest(".thread-view");
      const link = `${window.location.href.split("#")[0]}#${record.id}`;
      if (target) target.textContent = "";
      try {
        await copyText(link);
        if (target) target.textContent = strings[locale].copiedLink;
      } catch (error) {
        if (target) target.textContent = strings[locale].copyFailed;
      }
    });
  });

  document.querySelectorAll(".back-to-topics").forEach((button) => {
    button.addEventListener("click", () => {
      const activeItem = topicItems.find((item) => item.dataset.id === activeId);
      document.querySelector(".feed-header").scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
      window.setTimeout(() => activeItem?.querySelector(".topic-row")?.focus({ preventScroll: true }), reducedMotion.matches ? 0 : 280);
    });
  });

  let savedLocale = "en";
  try {
    savedLocale = window.localStorage.getItem("wenjin-language") || "en";
  } catch (error) {
    savedLocale = "en";
  }
  applyLocale(savedLocale, { persist: false });
  syncMenu();

  const deepLink = window.location.hash.replace(/^#topic-/, "");
  if (topicItems.some((item) => item.dataset.id === deepLink)) {
    activateRecord(deepLink, { updateHash: false, scroll: false });
  } else {
    activateRecord(activeId, { updateHash: false, scroll: false });
  }
  applyFilters();
})();
