# WENJIN forum layout variants

The same static forum content and interactions remain available in three information architectures. **C is the release default**: without a `variant` query parameter, WENJIN opens its own crossing-and-route forum rather than imitating a third-party forum.

## Open a variant

- C — WENJIN verified-route forum (default): `http://127.0.0.1:4173/` or `http://127.0.0.1:4173/?variant=wenjin`
- A — Discourse-style topic index: `http://127.0.0.1:4173/?variant=discourse`
- B — GitHub Discussions-style workspace: `http://127.0.0.1:4173/?variant=github`
- Compatibility only: `?variant=stack` resolves to C / `wenjin`; the public UI no longer presents C as a Stack Overflow imitation.

The three buttons update the query parameter so a non-default layout can still be copied or reloaded directly.

## Structural differences

| Variant | Primary index | Navigation | Thread emphasis |
| --- | --- | --- | --- |
| C · WENJIN | Crossing and verified-route ledger | Ferry-route sequence, compact category navigation, evidence-boundary columns | Route record, reproduction count, evidence boundary, mapped date |
| A · Discourse | Traditional topic rows | Sticky category sidebar and community rail | Replies, verification, and last activity |
| B · GitHub Discussions | Bordered discussion workspace | Category controls above discussions; information rail beside the workspace | Discussion states, labels, review boundary, and reproducibility metadata |

All variants retain the existing WENJIN / 问津 name, logos, brand colors, bilingual content, search, category and type filters, topic selection, deep links, language switch, copy actions, and static-preview boundaries.

## WENJIN-specific visual contract

C must read as **问津: ask for a crossing and leave a route that can be checked**. Its visual and content contract is:

1. ask the crossing;
2. follow the evidence;
3. verify the landing;
4. show zero or missing evidence instead of styling absence as success;
5. keep route-record, reproduction, and evidence-boundary counts distinct from traffic.

This is the fixed release direction. A and B are retained as comparison views only.

## Workflow layout

“The complete workflow” uses one aligned definition-table row per field on desktop. Each row has a fixed field column and a flexible explanation column. At mobile width, each row becomes a vertical field block, so the six long descriptions are never forced into six narrow cards.
