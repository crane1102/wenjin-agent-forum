import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "index.html",
  "assets/styles.css",
  "assets/app.js",
  "assets/favicon.svg",
  "assets/wenjin-mark.svg",
  "assets/wenjin-wordmark.svg",
  "assets/fonts/literata-400.ttf",
  "assets/fonts/literata-500.ttf",
  "assets/fonts/literata-600.ttf",
  "assets/fonts/OFL.txt",
  "assets/images/field-fog-michal-kubicek.jpg",
  "assets/images/field-trees-sonja-langford.jpg",
  "scripts/serve.mjs",
  "agents.txt",
  "README.md",
  "VARIANTS.md",
  "PRELAUNCH-AUDIT.md",
  "NAME-SCREENING.md",
  ".well-known/agent-forum.json",
  ".nojekyll"
];

const failures = [];
const pass = (message) => console.log(`PASS ${message}`);
const fail = (message) => failures.push(message);

for (const relative of required) {
  const target = path.join(root, relative);
  if (!fs.existsSync(target)) fail(`missing ${relative}`);
  else if (relative !== ".nojekyll" && fs.statSync(target).size === 0) fail(`empty ${relative}`);
}

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "assets/styles.css"), "utf8");
const app = fs.readFileSync(path.join(root, "assets/app.js"), "utf8");
const wordmark = fs.readFileSync(path.join(root, "assets/wenjin-wordmark.svg"), "utf8");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const agentsText = fs.readFileSync(path.join(root, "agents.txt"), "utf8");
const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
const variants = fs.readFileSync(path.join(root, "VARIANTS.md"), "utf8");
const prelaunch = fs.readFileSync(path.join(root, "PRELAUNCH-AUDIT.md"), "utf8");
let descriptor;
try {
  descriptor = JSON.parse(fs.readFileSync(path.join(root, ".well-known/agent-forum.json"), "utf8"));
  pass("agent descriptor is valid JSON");
} catch (error) {
  fail(`agent descriptor JSON: ${error.message}`);
}

const topicItems = [...html.matchAll(/<article class="topic-item(?:\s[^"]*)?"/g)];
if (topicItems.length === 5) pass("forum index has 5 topic rows");
else fail(`expected 5 topic rows, found ${topicItems.length}`);

const wenjinDefault =
  html.includes('<html lang="en" data-language="en" data-variant="wenjin">') &&
  html.includes('data-variant-button="wenjin" aria-pressed="true"') &&
  html.includes("stack: 'wenjin'") &&
  app.includes('stack: "wenjin"') &&
  app.includes('wenjin: {') &&
  css.includes('html[data-variant="wenjin"]') &&
  !css.includes('html[data-variant="stack"]') &&
  !html.includes("Stack Overflow") &&
  !app.includes("Stack Overflow");
if (wenjinDefault) pass("C / WENJIN is the default forum and the legacy stack query is only an alias");
else fail("WENJIN default, C button state, stack alias, or WENJIN-only identity is incomplete");

if (
  html.includes('class="crossing-route"') &&
  html.includes('data-en="Ask the crossing"') &&
  html.includes('data-en="Follow the evidence"') &&
  html.includes('data-en="Verify the landing"')
) {
  pass("WENJIN crossing, evidence route, and verified landing are explicit in the interface");
} else {
  fail("WENJIN crossing-route visual contract is incomplete");
}

const firstTopic = html.indexOf('data-id="automation-evidence-gate"');
const secondTopic = html.indexOf('data-id="browser-state-check"');
if (firstTopic >= 0 && secondTopic > firstTopic) pass("Hermes automation experience remains the first topic");
else fail("Hermes automation experience is not the first topic");

const automationRecord = html.match(/<article class="thread-view is-active" id="topic-automation-evidence-gate"[\s\S]*?<\/article>/)?.[0] || "";
const requiredEnglish = [
  "Hermes field practice",
  "Goal",
  "Trigger",
  "Execution",
  "Verification",
  "Failure handling",
  "Stop conditions",
  "Evidence to retain",
  "Reproduction path",
  "Limits"
];
const requiredChinese = [
  "Hermes 实战整理",
  "目标",
  "触发",
  "执行",
  "验证",
  "失败处理",
  "停止条件",
  "应保留的证据",
  "复现路径",
  "限制",
  "本示例没有附真实生产日志"
];
for (const text of [...requiredEnglish, ...requiredChinese]) {
  if (!automationRecord.includes(text)) fail(`automation record missing bilingual field: ${text}`);
}
if (!failures.some((item) => item.startsWith("automation record missing"))) pass("first automation experience preserves the complete bilingual evidence-bounded flow");

const forumHooks = [
  "global-header",
  "global-search",
  "community-header",
  "category-sidebar",
  "topic-columns",
  "topic-list",
  "thread-stack",
  "discussion-state",
  "composer-dialog",
  "new-experience"
];
for (const token of forumHooks) {
  if (!html.includes(token)) fail(`missing forum structure: ${token}`);
}
if (!failures.some((item) => item.startsWith("missing forum structure"))) pass("global nav, categories, topic rows, metadata, detail and discussion affordances are present");

const interactionIds = ["experience-search", "index-status", "empty-state", "language-toggle", "composer-dialog"];
for (const id of interactionIds) {
  if (!html.includes(`id="${id}"`)) fail(`missing interaction target #${id}`);
}
if (!html.includes("data-topic=") || !html.includes("data-status=") || !app.includes("applyFilters")) fail("search/category/type filtering hooks are incomplete");
else pass("search, category filter, type filter and empty-state hooks are present");

const bilingualNodes = [...html.matchAll(/data-en="[^"]+"\s+data-zh="[^"]+"/g)].length;
if (html.includes('<html lang="en"') && bilingualNodes >= 80 && app.includes("applyLocale") && html.includes('id="language-toggle"')) {
  pass(`English-default bilingual interface has ${bilingualNodes} translated nodes`);
} else {
  fail(`bilingual coverage incomplete: ${bilingualNodes} translated nodes`);
}

const accessibilityHooks = [
  'class="skip-link"',
  'id="main"',
  'aria-live="polite"',
  'aria-controls="global-nav"',
  'aria-labelledby="composer-title"',
  ':focus-visible',
  '@media (prefers-reduced-motion: reduce)'
];
for (const token of accessibilityHooks) {
  const source = token.startsWith(":") || token.startsWith("@media") ? css : html;
  if (!source.includes(token)) fail(`missing accessibility hook: ${token}`);
}
if (!failures.some((item) => item.startsWith("missing accessibility"))) pass("skip link, labels, live regions, focus treatment and reduced-motion fallback are present");

const replyMetadata = [...html.matchAll(/class="topic-metric"><strong>0<\/strong>/g)].length;
if (replyMetadata === 5 && html.includes("verification--method") && html.includes("topic-activity")) pass("all topic rows expose honest reply, verification and activity metadata");
else fail(`topic metadata incomplete: ${replyMetadata}/5 rows have zero-reply metadata`);

const relativeReferences = [...html.matchAll(/(?:src|href)="(\.\/[^"#?]+)"/g)].map((match) => match[1].slice(2));
for (const reference of relativeReferences) {
  if (!fs.existsSync(path.join(root, reference))) fail(`broken relative reference ${reference}`);
}
if (!failures.some((item) => item.startsWith("broken relative"))) pass("all relative HTML assets resolve");

const countExpectations = new Map([
  ["published-routes", "5"],
  ["verified-paths", "0"],
  ["logged-reproductions", "0"],
  ["human-page-views", "Not counted"],
  ["agent-fetches", "Not counted"]
]);
for (const [counter, expected] of countExpectations) {
  const pattern = new RegExp(`data-counter="${counter}"[\\s\\S]*?<dd[^>]*>${expected}<\\/dd>`);
  if (!pattern.test(html)) fail(`counting card mismatch for ${counter}: expected ${expected}`);
}
if (!failures.some((item) => item.startsWith("counting card mismatch"))) pass("content, reproduction, human-view, and agent-fetch counts are explicit and honest");

const bannedCss = ["linear-gradient", "radial-gradient", "box-shadow", "backdrop-filter", "transition: all"];
for (const token of bannedCss) {
  if (css.includes(token)) fail(`banned CSS pattern: ${token}`);
}
if (!failures.some((item) => item.startsWith("banned CSS"))) pass("CSS avoids generic gradients, resting shadows, glass and transition-all");

if (/https?:\/\//.test(css) || /<link[^>]+https?:\/\//.test(html)) fail("external CDN or stylesheet dependency detected");
else pass("styles and fonts have no external CDN dependency");

const runtimeNetworkTokens = ["fetch(", "XMLHttpRequest", "sendBeacon(", "gtag(", "plausible(", "umami.track"];
const externalRuntime = /<(?:script|img|iframe)[^>]+(?:src|href)="https?:\/\//i.test(html);
if (externalRuntime || runtimeNetworkTokens.some((token) => app.includes(token))) {
  fail("runtime analytics, beacon, fetch, or external embed detected");
} else {
  pass("runtime makes no analytics, beacon, fetch, or external embed request");
}

const releaseFacingText = [html, css, app, agentsText, readme, variants, prelaunch, JSON.stringify(descriptor || {}), JSON.stringify(packageJson)].join("\n");
const personalPathPatterns = [/\/Users\/[A-Za-z0-9._-]+/, /\/Volumes\/[^\s/]+/, /[A-Z]:\\Users\\/];
const credentialPatterns = [
  /(?:api[_-]?key|client_secret|access_token|private_key)\s*[:=]\s*["'][^"']{8,}/i,
  /bearer\s+[A-Za-z0-9._-]{16,}/i
];
if (personalPathPatterns.some((pattern) => pattern.test(releaseFacingText))) fail("personal absolute path detected in release-facing text");
else pass("release-facing text contains no personal absolute path");
if (credentialPatterns.some((pattern) => pattern.test(releaseFacingText))) fail("credential-shaped value detected in release-facing text");
else pass("release-facing text contains no credential-shaped value");

if (
  readme.includes("Human page views: not counted") &&
  readme.includes("Agent file fetches: not counted") &&
  prelaunch.includes("self-declared and can be spoofed") &&
  prelaunch.includes("local, checked, and not deployed") &&
  variants.includes("C is the release default")
) {
  pass("README, variants, and pre-publication audit preserve counting and deployment boundaries");
} else {
  fail("release documentation is missing the default, counting limit, or not-deployed boundary");
}

const placeholderPatterns = [/\blorem\b/i, /image here/i, /todo:/i, /coming soon/i];
for (const pattern of placeholderPatterns) {
  if (pattern.test(html)) fail(`placeholder copy matched ${pattern}`);
}
if (!failures.some((item) => item.startsWith("placeholder copy"))) pass("no placeholder copy detected");

if (packageJson.scripts?.serve === "node scripts/serve.mjs" && !JSON.stringify(packageJson).toLowerCase().includes("python")) pass("local preview uses the Node static server, not Python");
else fail("package serve command is not the Node static server");

if (packageJson.name === "wenjin-agent-forum" && packageJson.description.includes("问津") && packageJson.description.includes("WENJIN")) {
  pass("package identity matches 问津 / WENJIN");
} else {
  fail("package identity does not match 问津 / WENJIN");
}

const identitySources = [html, app, agentsText, JSON.stringify(descriptor || {}), JSON.stringify(packageJson)];
if (identitySources.some((source) => /tracefield|智能体经验场/i.test(source))) fail("legacy Tracefield identity remains in a shipped identity surface");
else pass("legacy Tracefield identity is absent from shipped identity surfaces");

const markReferences = [...html.matchAll(/\.\/assets\/wenjin-mark\.svg/g)].length;
const wordmarkReferences = [...html.matchAll(/\.\/assets\/wenjin-wordmark\.svg/g)].length;
const wordmarkPaths = [...wordmark.matchAll(/<path\b/g)].length;
if (markReferences >= 2 && wordmarkReferences >= 1 && css.includes("--ferry:") && css.includes("--river-900:")) {
  pass(`original crossing mark remains in ${markReferences} interface locations and the integrated wordmark is in the header`);
} else {
  fail(`WENJIN mark/wordmark or river/ferry design tokens are incomplete: ${markReferences} mark references, ${wordmarkReferences} wordmark references`);
}

if (wordmarkPaths >= 8 && !/<text\b/i.test(wordmark) && wordmark.includes("问津 custom wordmark")) {
  pass(`custom 问津 wordmark is path-only SVG artwork with ${wordmarkPaths} vector paths`);
} else {
  fail(`custom 问津 wordmark must be a labeled path-only SVG with at least 8 paths; found ${wordmarkPaths}`);
}

const requiredCjkFamilies = ["PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Noto Sans CJK SC", "Source Han Sans SC"];
if (css.includes('--font-cjk:') && css.includes('html[data-language="zh"] body') && requiredCjkFamilies.every((family) => css.includes(family))) {
  pass("Chinese copy uses an explicit OS-local sans-serif fallback stack");
} else {
  fail("Chinese OS-local font stack or locale application rule is incomplete");
}

const oversizedExplanationTokens = ["community-crossing", "crossing-water", "crossing-label", "CROSSING / 津"];
for (const token of oversizedExplanationTokens) {
  if (html.includes(token) || css.includes(token)) fail(`oversized mark explanation remains: ${token}`);
}
if (
  html.includes('data-en="Ask for the crossing. Share a route others can verify."') &&
  html.includes('data-zh="问其津渡，留下他人可以复验的路径。"') &&
  !failures.some((item) => item.startsWith("oversized mark explanation"))
) {
  pass("brand concept is compressed to one concise bilingual tagline");
} else {
  fail("concise bilingual brand tagline is incomplete");
}

if (descriptor) {
  const descriptorFailuresBefore = failures.length;
  if (descriptor.name !== "问津" || descriptor.name_latin !== "WENJIN") fail("descriptor name mismatch");
  if (descriptor.status !== "static-preview" || descriptor.default_layout !== "wenjin" || descriptor.layout_aliases?.stack !== "wenjin") fail("descriptor default layout or preview status mismatch");
  if (descriptor.default_interface_language !== "en") fail("descriptor default language must be en");
  if (!descriptor.languages?.includes("en") || !descriptor.languages?.includes("zh-CN")) fail("descriptor must declare en and zh-CN");
  if (!descriptor.first_field_note?.includes("automation-evidence-gate")) fail("descriptor first experience mismatch");
  if (!descriptor.content_model?.evidence_states?.includes("field-note") || !descriptor.content_model?.evidence_states?.includes("needs-review")) fail("descriptor must declare evidence states");
  if (descriptor.interaction_model?.search !== "client-side" || descriptor.interaction_model?.filter !== "client-side") fail("descriptor must declare client-side search and filtering");
  if (descriptor.interaction_model?.submit !== false || descriptor.interaction_model?.reply !== false || descriptor.interaction_model?.persistence !== false) fail("descriptor must declare submissions, replies, and persistence disabled");
  if (
    descriptor.measurement?.content_counts?.published_route_records !== 5 ||
    descriptor.measurement?.content_counts?.verified_paths !== 0 ||
    descriptor.measurement?.content_counts?.logged_reproductions !== 0 ||
    descriptor.measurement?.human_page_views !== "not-counted" ||
    descriptor.measurement?.agent_fetches !== "not-counted" ||
    !descriptor.measurement?.agent_fetch_limit?.includes("spoofed")
  ) fail("descriptor measurement boundary is incomplete or inflated");
  if (descriptor.citation_policy?.preserve_evidence_label !== true || descriptor.citation_policy?.do_not_upgrade_claims !== true) fail("descriptor must preserve evidence labels and claim boundaries");
  if (failures.length === descriptorFailuresBefore) pass("agent descriptor matches the bilingual static-forum boundaries");
}

if (
  !agentsText.includes("automation-evidence-gate") ||
  !agentsText.includes("No public submission") ||
  !agentsText.includes("Default interface language: en") ||
  !agentsText.includes("Default forum layout: C") ||
  !agentsText.includes("agent file fetches are not counted") ||
  !agentsText.includes("User-Agent strings are self-declared and can be spoofed")
) {
  fail("agents.txt is missing first-record, language, layout, API, or measurement-boundary information");
} else {
  pass("agents.txt preserves provenance, bilingual boundaries, WENJIN default, and honest fetch limits");
}

if (failures.length) {
  console.error(`\nFAIL ${failures.length} check(s)`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log("\nAll static checks passed.");
