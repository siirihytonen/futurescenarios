# ARKI cooling prototypes (rebuilt)

Four matched standalone cells for the agency × community study. One shared design system
(`shared.css`) and one render engine (`app.js`) drive all four, so the cells are identical
except the two manipulated axes — matched-2×2 by construction, not by hand.

## Files
- `intake.html` — captures preferred indoor temp, forwards it as `?pref=`.
- `index.html` — local launcher (the real study harness counterbalances cell order).
- `c1–c4.html` — the four cells (tiny stubs that call `ARKI.renderCell`).
- `data.js` — energy model + the four parallel, severity-matched week configs.
- `app.js` — the single render/interaction engine.
- `shared.css` — design system (AA contrast, 44px targets, visible focus, reduced-motion).
- `server.cjs` — local preview only; not part of the stimulus, do not deploy.

## Manipulation summary (the passing-grill one-pager)

|        | Shared (building visible) | Private (household only) |
|--------|---------------------------|--------------------------|
| **High agency** (you set first) | **C1** | **C2** |
| **Low agency** (ARKI applies first) | **C3** | **C4** |

- **C1 vs C2 / C3 vs C4** differ only in *community* (building view present/absent).
- **C1 vs C3 / C2 vs C4** differ only in *agency* (slider + options + "what ARKI used" +
  reshaping appeal, vs applied plan + accept + non-operative review).
- **Held constant:** the outcome — peak window capped at a warm 27–29 °C band, personalised to
  `?pref` (binding cap, the slider cannot reach the preferred temp). ARKI's reasoning wording
  (trust DV) is byte-identical in all four. Appliance comparison is identical everywhere.

## Item → on-screen hook
- Favorability → the big outcome temperature vs the set preference (low in all four).
- Trust → the identical ARKI reasoning block + reliability pill.
- Procedural fairness (voice / appeal / "what ARKI used") → present in C1/C2, absent in C3/C4.
- Distributive fairness → "Why this plan?" rationale; in C1/C3 also the neighbours' needs.
- Acceptance → Confirm (high) / Accept (low).
- Community check → building pool + neighbour grid + log (C1/C3) vs personal panel (C2/C4).

## Embedding
Static files; no build step. Deploy `protos/` to Vercel and embed each cell in a Qualtrics
iframe as `c1.html?pref=22` etc. (preferred temp rides in the querystring because sessionStorage
is unreliable cross-frame).
