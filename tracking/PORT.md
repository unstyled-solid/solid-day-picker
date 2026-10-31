# DayPicker Solid 2 port

Canonical source: https://github.com/gpbl/react-day-picker/tree/1bfd4f0776d66f2242b6b32a1f084ab94e2702da

The read-only `upstream/react-day-picker` submodule is pinned to this commit (10.0.2).
`packages/solid/src.source-copy.json` and `test.source-copy.json` record the original
paths and SHA-256 hashes. The initial copies were performed by the skill's
`copy-first.mjs` terminal `cp` wrapper, including all 64 colocated test/type suites.

Profile: Solid/runtime/signals/compiler/Babel plugin 2.0.0-rc.13;
Vite plugin 3.0.0-next.47; TypeScript 5.9.3; Vitest 4.1.11.

Native adaptations: `class` and native events/refs; direct context provider;
owned signals and live getter-based hook results. Date algorithms, DOM structure,
CSS class names, and source assertions are the behavioral authority.

Internal component selection uses setup-owned native `dynamic` wrappers. List
rows preserve upstream keys while forwarding the original raw calendar objects.
The shallow live view exposes the native proxy marker without subscribing JSX
construction; host serialization preserves React's boolean `data-*` and empty
inline-style omission rules. Conditional host attributes are hoisted into stable
accessors where inline compiler memos would shift SSR/hydration ownership slots.
The required context uses a null sentinel so its guard retains the upstream error.

All 270 original core paths remain present. `verify:source` verifies all original
hashes against the pristine submodule, all 64 suite registration lists, and equal
TypeScript-emitted JavaScript for 62 framework-neutral algorithm modules.
The copied `SingleControlled` example and its two assertions are also retained.

`scripts/distribution/build/compiler.mjs` was copied with terminal `cp` from the
skill's frozen Base UI reference kit; its MIT license is retained alongside it.
The port's runtime and CSS derive from DayPicker, not from that reference library.

The upstream v10 monorepo's separate calendar packages and website are separate
source families from `react-day-picker`; this copy records the core package.
