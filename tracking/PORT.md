# DayPicker Solid 2 port

Canonical source: https://github.com/gpbl/react-day-picker/tree/1bfd4f0776d66f2242b6b32a1f084ab94e2702da

The read-only `upstream/react-day-picker` submodule is pinned to this commit (10.0.2).
`packages/solid/src.source-copy.json` and `test.source-copy.json` record the original
paths and SHA-256 hashes. The initial copies were performed by the skill's
`copy-first.mjs` terminal `cp` wrapper, including all 64 colocated test/type suites.

Profile: Solid/runtime/signals/compiler/Babel plugin 2.0.0-rc.20;
Vite plugin 3.0.0-next.54; testing-library 1.0.0-rc.2; TypeScript 5.9.3; Vitest 4.1.11.

## RC20 qualification

The RC20 upgrade keeps runtime, signals, compiler, Babel plugin, package peers,
overrides and independent packed consumers on the same exact release. The current
Vite plugin uses `refresh: false` instead of the removed `hot` option.

Development diagnostics exposed implicit mount-time snapshots in month, focus,
selection and animation initialization. These reads now explicitly use `untrack`;
controlled values remain live. Weekday rows read their item accessor in JSX.
Custom dropdown wrappers use live props/`omit`, with regressions for changing
labels and portal containers. Unexpected Solid diagnostic warnings now fail tests;
logging remains enabled. The Intl constructor mock uses a constructible function.

Verified on RC20:
- Library build, root/docs strict types and built-doc link checks.
- 1,080 tests plus three Adelaide timezone tests, without diagnostic warnings.
- 315 production documentation routes and 179 mounted demo views.
- 16 pristine exact-SHA React/Solid SSR comparisons, including all five calendars.
- Independent stock-peer package declarations, SSR, hydration identity, event
  replay, calendar selection/navigation, animation, disposal and tree shaking.
- Source-copy verification: retained suites/assertions and 62 unchanged algorithms.

The single upstream Ethiopic `endOfWeek` test.todo is retained unchanged; no new
skips were introduced by the upgrade.

## Original adaptation record

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
