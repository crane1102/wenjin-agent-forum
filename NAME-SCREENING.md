# 问津 / WENJIN — preliminary name screen

**Screened:** 2026-10-28 01:39 CST (UTC+08:00)
**Variants:** `问津`, `Wenjin`, `WenJin`, `Wenjin Forum`, `问津社`
**Scope:** public technical and trademark discovery only. This is **not** legal advice, a freedom-to-operate opinion, or a trademark clearance.

## Bottom line

The name has material conflict risk. The strongest concrete issue is an active website at **https://wenjin.ai/** using **问津** for AI engineering, products, and training—commercially adjacent to an agent experience forum. Ownership, affiliation, consent, geography, and unregistered/common-law rights were not established. Do not treat registry/package availability as permission to launch.

## GitHub

Sources: public GitHub REST API (`/search/repositories`, `/search/users`, `/users/Wenjin`).

- The exact account handle `Wenjin` is occupied by a user created in 2012.
- `wenjin in:name` returned 407 repositories at the screen time. In the first 100 ranked results, 24 repositories had the exact repository name `wenjin` (including `huanghaitck/wenjin`, `xiaozhaoye/wenjin`, and `Wenjin0830/wenjin`).
- Exact-name searches for `问津`, `问津社`, and `wenjin forum` returned no repository matches in the API snapshot.
- GitHub results establish namespace crowding, not trademark ownership or market use. Code search was not used because the anonymous API requires authentication for it.

## npm and PyPI

Sources: public npm registry/search endpoints and `https://pypi.org/pypi/<name>/json`.

- Exact npm package lookups returned HTTP 404 for `wenjin`, `wenjin-forum`, `wenjinforum`, and `wenjinshe`; npm full-text search for `wenjin` returned 11 results but no exact package-name match in the returned set.
- Exact PyPI project lookups returned HTTP 404 for the same four romanized package names; the PyPI simple-index query returned no exact normalized match.
- `WenJin` is not a separate exact registry identity from the normalized romanized form. The Chinese display-name variants were not treated as equivalent package coordinates.
- Registry availability is transient and is not evidence of trademark availability.

## Domains and live use

Sources: DNS A/AAAA lookups, ICANN RDAP where supported, HTTP HEAD/GET, and direct page extraction.

| Candidate | Observed state | Concrete finding |
| --- | --- | --- |
| `wenjin.ai` | Active DNS and HTTPS | Live site titled “问津有路，落地有方”; offers AI engineering, products, and training. This is the closest observed commercial conflict. |
| `wenjin.cn` | Active DNS and HTTP | Page says the domain is in private use and invites broker contact. |
| `wenjin.org` | Active DNS | Host resolved; the probed page returned 404. |
| `wenjin.com.cn` | Active DNS | Host resolved; response was inconsistent/timeout-limited. |
| `wenjin.com` | No A/AAAA in the snapshot; registered | ICANN RDAP showed registration dating to 1998. |
| `wenjin.net` | No A/AAAA in the snapshot; registered | ICANN RDAP showed registration dating to 2007. |
| `wenjin.app` | No A/AAAA in the snapshot; registered | ICANN RDAP showed a 2026 registration. |
| `wenjinforum.com`, `.org`, `.io`, `.dev`, `.community` | No A/AAAA observed | Generic ICANN RDAP returned 404 at screen time. This is not a purchase/availability guarantee. |
| `wenjinshe.com` | No A/AAAA observed | Generic ICANN RDAP returned 404 at screen time. |
| `问津.com`, `问津社.com` | No A/AAAA observed for punycode forms | Generic ICANN RDAP returned 404 at screen time. IDN variant and homograph review remains incomplete. |

No registration, account creation, purchase, or availability reservation was attempted.

## Public trademark sources

### TMview (EUIPO / TMDN aggregation)

Search interface: `https://www.tmdn.org/tmview/`. Results are an aggregation and can lag or omit national-office data.

- Exact `WENJIN` returned 4 records: Spanish class 7, Korean class 26, an international registration in class 40, and an EU registration in class 16. None of those exact records was in the forum's core Nice classes 9, 35, 38, 41, or 42, but class 16 is adjacent to publishing/printed matter.
- Exact `问津` returned 19 records. The visible result set included Chinese filings/registrations in relevant or adjacent classes **35, 41, and 42**, plus other classes. One class 42 `问津` Chinese application showed a 2026-04-23 application date.
- Exact `问津社` returned 0 records in the TMview snapshot.
- Exact `WENJIN FORUM` returned 0 records in the TMview snapshot.
- A contains search for `WENJIN`, restricted to classes 9, 35, 38, 41, and 42, returned 78 results. Visible similar marks included active `WENJIN EDUCATION` records in class 41 and `WENJINE` in class 42. Similarity and confusion were not legally analyzed.

### USPTO

Source: official Trademark Search at `https://tmsearch.uspto.gov/`.

- A default exact-word search for `WENJIN` returned 0 live and 0 dead exact results at the screen time.
- The result does not exclude phonetic, translated, design, owner-name, or combined-mark conflicts.

### Access limitations

- WIPO Global Brand Database presented a verification/interstitial response, so no usable WIPO result set was obtained.
- Direct CNIPA public search returned HTTP 403 in this environment. TMview's CNIPO/CNIPA-contributed records were used only as a preliminary aggregated view.
- No paid database, company-register ownership research, counsel opinion, design-mark similarity search, Chinese subclass analysis, common-law use survey, or full jurisdiction-by-jurisdiction review was performed.

## Decision gate before publication

1. Establish whether the operator of `wenjin.ai` is the same owner, an affiliate, or an unrelated party, and document authorization if relevant.
2. Ask qualified trademark counsel to search `问津`, `問津`, `WENJIN`, spaced/hyphenated forms, translations/transliterations, and the crossing design in target countries and Nice classes/subclasses—especially 9, 35, 38, 41, and 42.
3. Repeat live domain and handle checks immediately before any application, registration, or public launch.
4. If ownership/clearance is not established, choose a more distinctive compound name rather than relying on `Wenjin Forum` alone.
