# @juice789/tf2items

Utility functions for working with Team Fortress 2 items: building and parsing **SKUs**, converting Steam economy items / backpack.tf listings into SKUs, generating marketplace URLs, and building/reading the bundled item **schema** (`schema.json`) — a pre-built snapshot derived from the game's own item schema.

sku playground: https://juice789.github.io/tf2items/

## Install

```
npm install @juice789/tf2items
```

## Node vs Browser

This package has two entry points:

- **Node** (`main` / default export) — `app.js`. Includes everything: SKU helpers, the schema, link builders, econ-item/listing converters, **and** the schema-building functions (`saveSchema`, `getInstance`, `fromEconItem`, etc.) which probably won't run in your browser.
- **Browser** (`browser` export condition) — `browser.js`. A safe subset for bundlers/browsers: only the SKU helpers, schema lookups, and link builders. Nothing that touches the network, the Steam API, or Node built-ins.

Bundlers that respect the `"browser"` field/condition (webpack, Vite, etc.) will pick `browser.js` automatically. If you `import` directly in Node, you get `app.js`.

```js
// Node
import { skuFromItem, saveSchema, getInstance } from '@juice789/tf2items'

// Browser bundle
import { skuFromItem, marketHashNameFromSku } from '@juice789/tf2items'
```

Everything documented below is available from both entry points **except** `saveSchema`, `getInstance`, `fromEconItem`/`fromEconItemOptions`, `fromListingV1`, `fromListingV2`, and a handful of related internal schema-fetching helpers — those are Node-only and are called out as such.

---

## Table of contents

1. [SKUs](#skus)
2. [Converting Steam EconItems into SKUs](#converting-steam-econitems-into-skus)
3. [Converting backpack.tf listings into SKUs](#converting-backpacktf-listings-into-skus)
4. [Link builders (`skuLinks.js`)](#link-builders-skulinksjs)
5. [Steam Community items (trading cards, backgrounds, emotes, etc...)](#steam-community-items-trading-cards-backgrounds-emotes-etc)
6. [The schema](#the-schema)
7. [Building the schema yourself (`saveSchema`)](#building-the-schema-yourself-saveschema)
8. [Reference data exports](#reference-data-exports)

---

## SKUs

A **SKU** is this package's compact string encoding of a TF2 item, e.g. `"5021;6"` (a Mann Co. Supply Crate Key) or `"205;11;kt-3;festive"` (a Strange Festivized Professional Killstreak Rocket Launcher). It's built from `;`-separated parts:

| Part | Meaning | Example |
|---|---|---|
| `<defindex>` | item definition index (always first) | `5021` |
| `<quality>` | quality id, see [`qualityNames`](#reference-data-exports) | `6` |
| `uncraftable` | item is non-craftable | `uncraftable` |
| `strange` | "Strange" / elevated quality | `strange` |
| `u-<id>` | unusual particle effect id | `u-702` |
| `kt-<1, 2 or 3>` | killstreak tier (Killstreak / Specialized / Professional) | `kt-3` |
| `festive` | festivized | `festive` |
| `td-<defindex>` | **target** defindex — the item a Strangifier/Kit/Killstreak Kit/Unusualifier applies to | `td-588` |
| `od-<defindex>` | **output** defindex — what a Fabricator/Chemistry Set produces | `od-6523` |
| `oq-<id>` | output quality — quality of the produced `od` item | `oq-6` |
| `pk-<id>` | paintkit/texture id (War Paints, Decorated weapons) | `pk-213` |
| `w-<1-5>` | wear tier (Factory New .. Battle Scarred) | `w-1` |
| `australium` | is Australium | `australium` |
| `c-<n>` | crate/case series number | `c-31` |
| `no-<n>` | "Number Of" — the low craft number (1-100) on items that track it, shown as `#13` in the name | `no-13` |
| `pc-<defindex>` | paint can defindex applied to the item — **omitted by default** when constructing the sku from an `EconItem`, see [below](#fromeconitemoptionsoptions---fromeconitem) | `pc-5052` |
| `hs-<defindex[_defindex...]>` | Halloween spell defindex(es), `_`-joined if more than one — **omitted by default** when constructing the sku from an `EconItem`, see [below](#fromeconitemoptionsoptions---fromeconitem) | `hs-8921_8922` |
| `rch-<defindex>` | which hat a "Random Craft Hat" (`defindex 0000`) actually resolved to — **omitted by default** when constructing the sku from an `EconItem`, see [Random Craft Hats](#random-craft-hats-rch-) below | `rch-30425` |

Parts are omitted when not applicable, and always appear in the order above.

### `skuFromItem(item) -> string`

Builds a SKU from a plain item object. Only `defindex` and `quality` are required; everything else is optional.

```js
skuFromItem({ defindex: '5021', quality: '6' })
// '5021;6'

skuFromItem({ defindex: '378', quality: '5', effect: '13' })
// '378;5;u-13'

skuFromItem({ defindex: '211', quality: '11', killstreakTier: '3', australium: '1', festivized: '1' })
// '211;11;kt-3;festive;australium'

skuFromItem({ defindex: '20002', quality: '6', killstreakTier: '2', target: '40', output: '6523', oq: '6' })
// '20002;6;kt-2;td-40;od-6523;oq-6'
```

Booleans accept `true`/`'1'` interchangeably for the flag-style fields (`uncraftable`, `elevated`, `festivized`, `australium`).

### `itemFromSku(sku) -> item`

The inverse of `skuFromItem` — parses a SKU string back into an item object (plus the original `sku` string on the result). Unset parts are simply absent from the object.

```js
itemFromSku('5021;6')
// { defindex: '5021', quality: '6', sku: '5021;6' }

itemFromSku('312;3;kt-2')
// { defindex: '312', quality: '3', killstreakTier: '2', sku: '312;3;kt-2' }
```

### `getName(item, bpTexture?, qualityBpStyle?, useProperName?, showUncraft?) -> string`

Builds a plain, human-readable item name from an item object (as returned by `itemFromSku`). Normally you'll use `itemNameFromSku` instead. The optional flags default to off and, when turned on, nudge the output towards backpack.tf's naming conventions instead:

| Param | Default | Effect |
|---|---|---|
| `bpTexture` | `false` | Insert a `\|` right after the texture/paintkit name instead of folding it straight into the rest of the name, e.g. `"Sand Cannon \| Rocket Launcher"` instead of `"Sand Cannon Rocket Launcher"`. |
| `qualityBpStyle` | `false` | When the item has a particle effect, suppress the quality name (e.g. don't print `"Unusual"`) — backpack.tf shows quality separately rather than baking it into the name. |
| `useProperName` | `false` | Prefix plain Unique, non-Strange/Festivized/Killstreak items whose schema entry has `propername: '1'` with `"The"` (e.g. `"The Wrangler"`) — off by default, backpack.tf-style naming includes it. |
| `showUncraft` | `true` | Whether to include `"Non-Craftable"` in the name for uncraftable items. |

### `itemNameFromSku(sku, ...sameParamsAsGetName) -> string`

Parses a SKU with `itemFromSku` and feeds the result straight into `getName` — same `bpTexture`/`qualityBpStyle`/`useProperName`/`showUncraft` params, same plain-readable-name defaults.

```js
itemNameFromSku('5021;6')
// 'Mann Co. Supply Crate Key'

itemNameFromSku('211;11;kt-3;festive;australium')
// 'Strange Festivized Professional Killstreak Australium Medi Gun'

itemNameFromSku('312;3;kt-2')
// 'Vintage Specialized Killstreak Brass Beast'

itemNameFromSku('1151;5;strange;u-703;kt-3;festive;pk-282;w-2')
// 'Strange Unusual Cool Festivized Professional Killstreak Glacial Glazed Iron Bomber (Minimal Wear)'
```

backpack.tf uses a different quality/name/price-index convention than the Steam Market. The following convert a SKU into that convention.

### `toBpQuality(sku) -> string`

backpack.tf-style quality string. Painted/Decorated/unusual-effect weapons get folded into `'Unusual'`, `'Strange Unusual'`, `'Decorated Weapon'`, etc. instead of the raw quality name.

```js
toBpQuality('200;11')              // 'Strange'
toBpQuality('15008;15;pk-5;w-1')   // 'Decorated Weapon'
toBpQuality('518;5;strange;u-8')   // 'Strange Unusual'
```

### `toBpName(sku) -> string`

Item name formatted the way backpack.tf displays it.

```js
toBpName('15008;15;pk-5;w-1')               // 'Masked Mender | Medi Gun (Factory New)'
toBpName('5022;6;c-31')                     // 'Mann Co. Supply Crate'
toBpName('211;11;kt-3;festive;australium')  // 'Festivized Professional Killstreak Australium Medi Gun'
```

### `toBpPriceIndex(sku) -> string`

The backpack.tf "priceindex" suffix — used to disambiguate particle effects, kits, fabricators, and series numbers within the same quality+name bucket.

```js
toBpPriceIndex('31000;5;u-120')                         // '120'
toBpPriceIndex('6523;6;uncraftable;kt-2;td-656')        // '2-656'
toBpPriceIndex('20003;6;kt-3;td-36;od-6526;oq-6')       // '6526-6-36'
```

### `toBpSku(sku) -> string`

Re-derives a "canonical" sku-like name string the way backpack.tf would represent it (drops `craft`, applies bp texture/quality-style rules).

### `toBpId(sku) -> string`

md5 hash of `toBpSku(sku)`; the id backpack.tf assigns to a listing for this sku.

### `listingV1FromSku(sku) -> object` / `listingV2ResolvableFromSku(sku) -> object`

Build the `{ quality, craftable, item_name/item, priceindex, ... }` shape backpack.tf's listing v1/v2 APIs expect when you want to *create* a listing for a given sku.

---

## Converting Steam EconItems into SKUs

These take real EconItem payloads from Steam and turn them into a SKU. All **Node only**.

### `fromEconItem(econItem) -> { sku, id, old_id, contextid, old_contextid, appid }`

`econItem` is an [`EconItem`](https://github.com/DoctorMcKay/node-steam-tradeoffer-manager/wiki/EconItem) as produced by [`node-steam-tradeoffer-manager`](https://github.com/DoctorMcKay/node-steam-tradeoffer-manager). `fromEconItem` mainly supports **Team Fortress 2** (`appid 440`) or **Steam Community** (`appid 753`) items — trading cards, backgrounds, emotes, etc. It converts the econ item into a sku plus its asset identity. Dispatches internally based on `econItem.appid`:

- `440` → full TF2 item parsing (reads tags/descriptions/market_hash_name **and `app_data`** to recover quality, killstreak tier, paint, spells, etc., then builds the sku via `skuFromItem`).
- `753` → trading cards / community items, sku built via `skuFromItem753` (see [below](#steam-community-items-trading-cards-backgrounds-emotes-etc)).
- anything else → `{ sku: 'other;<appid>;<market_hash_name>', id, old_id, appid }`.

```js
fromEconItem(econItem)
// { sku: '971;11;kt-2', id: '9252885411', old_id: null, contextid: null, old_contextid: null, appid: 440 }
```

`id`/`contextid` and `old_id`/`old_contextid` are built from the `assetid`/`contextid`/`new_assetid`/`new_contextid`/`rollback_new_assetid`/`rollback_new_contextid` fields Steam attaches to items returned by [`TradeOfferManager#getExchangeDetails`](https://github.com/DoctorMcKay/node-steam-tradeoffer-manager/wiki/TradeOffer#getexchangedetailsgetdetailsiffailed-callback): `assetid`/`contextid` are an item's identity *before* a trade, and `new_assetid`/`new_contextid` (or, if the trade got reversed, `rollback_new_assetid`/`rollback_new_contextid`) are its identity *after*. Since an item's asset id changes once it changes hands, `fromEconItem` collapses these into:

- **`id`/`contextid`** — the item's *current* identity: `new_assetid`/`new_contextid` if the trade completed, else `rollback_new_assetid`/`rollback_new_contextid` if it was rolled back, else the original `assetid`/`contextid` if neither applies (the item never moved).
- **`old_id`/`old_contextid`** — the item's identity *before* the trade, but only populated when the id actually changed (i.e. `new_assetid` or `rollback_new_assetid` was present); `null` otherwise.

So for an item straight out of an inventory (no trade involved) `id`/`contextid` are just its current asset/context id and `old_id`/`old_contextid` stay `null` — which is what the example above shows.

#### `app_data` — important for TF2 items

For `appid 440` items, `fromEconItem` needs `econItem.app_data` (which carries `def_index` and `quality`) to resolve the item reliably. Whether your `EconItem` already has it depends on where it came from:

- **Trade offers** — `TradeOfferManager`'s `'newOffer'`/`'receivedOfferChanged'` events give you `ETradeOffer` objects whose `itemsToGive`/`itemsToReceive` (`EconItem[]`) should **already include `app_data`**. You can pass these straight to `fromEconItem`.
- **Inventories** — [`TradeOfferManager#getUserInventoryContents`](https://github.com/DoctorMcKay/node-steam-tradeoffer-manager/wiki/TradeOfferManager#getuserinventorycontentssteamid-appid-contextid-tradableonly-callback) may **not** include `app_data`. Run the inventory through `fetchAppDataInventory` first to fill it in before calling `fromEconItem`.

### `fetchAppDataInventory(inventory, delayMs?, cache?)`

A function (**Node only**) that takes an inventory array (e.g. from `getUserInventoryContents`) and merges in the `app_data`/`tags`/`descriptions` each item is missing, by batching calls to the Steam `GetAssetClassInfo` API (125 `classid`/`instanceid` pairs per request, `delayMs` — default `1000` — between batches to avoid rate limits). It's accessed through `getInstance`, the same helper `saveSchema` uses (see [below](#getinstanceoptions) for the full rundown of its `options`) — here it's enough to know it takes a `steamApiKey` and gives back a `Promise`-returning function.

```js
import { getInstance } from '@juice789/tf2items'

const { fetchAppDataInventory } = getInstance({ steamApiKey: 'YOUR_STEAM_API_KEY' })

const inventory = await new Promise((resolve, reject) =>
  manager.getUserInventoryContents(steamID, 440, 2, true, (err, inv) => err ? reject(err) : resolve(inv))
)

const withAppData = await fetchAppDataInventory(inventory)
const skus = withAppData.map(item => fromEconItem(item).sku)
```

`cache` (default `[]`) lets you pass in previously-fetched asset-class objects to skip re-fetching classes you've already resolved — useful since the same `classid`/`instanceid` pair is reused across many items/inventories. Each entry just needs the `classid`/`instanceid` it was fetched for (pass `'0'` for `instanceid` if the item doesn't have one), plus whatever `app_data` (and `tags`/`descriptions`) came back for it:

```js
const cache = [
  { classid: '79979043', instanceid: '11040671', app_data: { def_index: '6025', quality: '6' } },
  { classid: '5564', instanceid: '11040547', app_data: { def_index: '5001', quality: '6' } },
  { classid: '1336083996', instanceid: '74041787', app_data: { def_index: '891', quality: '11' } }
]

const withAppData = await fetchAppDataInventory(inventory, 1000, cache)
```

### `fromEconItemOptions(options) -> fromEconItem`

Same as `fromEconItem`, but lets you tweak appid-440 parsing:

```js
const convert = fromEconItemOptions({
  omitProps: ['paintColor', 'halloweenSpell', 'rch'], // skip these situational lookups, default shown
  uncraftRemapDefindex: ['5021']                      // defindexes to always treat as craftable (keys can't be uncraftable)
})
convert(econItem)
```

`omitProps` defaults to skipping these three props since each only matters in specific situations:

- **`paintColor`** — which paint can was applied. Only relevant if you actually care about the item's color.
- **`halloweenSpell`** — which Halloween spell(s) are on the item. Spells don't affect the item's value, so most pricing/trading use cases can skip this.
- **`rch`** — whether the item is a Random Craft Hat. See [Random Craft Hats](#random-craft-hats-rch-) below for why this one needs special attention.

### Random Craft Hats (`rch-`)

Crafting three weapons together (the basic "craft a hat" recipe) gives you one random cosmetic out of a pool of 599 possible unique, craftable hats. Because the result is one of many interchangeable-ish outcomes, this package can represent such an item generically under defindex `0000` instead of its real defindex:

- `0000;6;rch-30425` — a Random Craft Hat known to have resolved to defindex `30425` (Tipped Lid), kept grouped with the RCH pool via the `rch-` part.
- `30425;6` — the very same Tipped Lid, but addressed as an ordinary, distinct item — not flagged as part of the RCH pool at all.

`itemFromSku`/`itemNameFromSku` resolve the *real* defindex for you whenever `rch-` is present:

```js
itemFromSku('0000;6;rch-30425').defindex   // '30425'
itemNameFromSku('0000;6;rch-30425')        // 'Tipped Lid'
```

A bare `0000;6` (no `rch-`) never comes out of this package's own functions — `defindex` only ever becomes `'0000'` as a side effect of the `rch` flag, which always adds the `rch-` suffix too. But `itemFromSku`/`itemNameFromSku` still handle it gracefully if you encounter that form elsewhere (e.g. another tool using bare `0000` as a generic "some Random Craft Hat" placeholder):

```js
itemNameFromSku('0000;6') // 'Random Craft Hat'
```

**This is where it gets surprising:** whether you end up with the `0000;rch-` form or the plain-defindex form when converting a real econ item depends entirely on whether the `rch` prop was computed for it —

- `fromEconItem(econItem)` (no options) uses `defaultOptions440`, which **omits `rch` by default**. A Random Craft Hat coming out of `fromEconItem` gets a sku built from its **real** defindex (e.g. `'30425;6'`), *not* `'0000;6;rch-30425'`.
- To opt into the grouped `0000;6;rch-<defindex>` form, call `fromEconItemOptions({ omitProps: [] })` (or any `omitProps` array that excludes `'rch'`) instead of plain `fromEconItem`.

```js
fromEconItem(econItem).sku                            // '30425;6'              (default — rch omitted)
fromEconItemOptions({ omitProps: [] })(econItem).sku   // '0000;6;rch-30425'
```

One more wrinkle: `skuFromItem` only collapses to the `0000;rch-` form when the item *isn't also* carrying a `craft` number or a `halloweenSpell` — when one of those is present, the specific hat is considered significant enough that the sku keeps the real defindex and drops `rch-` entirely, even if you did request the `rch` prop.

---

## Converting backpack.tf listings into SKUs

These take real listing payloads from backpack.tf and turn them into a SKU. All **Node only**.

### `fromListingV1(listing) -> sku` / `fromListingV2(listing) -> sku`

Convert a backpack.tf listing object (v1 or v2 API shape) directly into a sku string. Use whichever matches the API version you're consuming.

```js
fromListingV1(listing) // '5021;6'
fromListingV2(listing) // '5021;6'
```

---

## Link builders (`skuLinks.js`)

Given a sku, build the matching market-hash-name or a direct link to common TF2 trading sites.

### `marketHashNameFromSku(sku) -> string`

Steam Community Market display name for the item.

```js
marketHashNameFromSku('5021;6')                        // 'Mann Co. Supply Crate Key'
marketHashNameFromSku('6527;6;uncraftable;kt-1;td-998') // 'Killstreak Vaccinator Kit'
marketHashNameFromSku('17412;15;pk-412;w-3')            // 'Secretly Serviced War Paint (Field-Tested)'
```

### `scmUrl(sku) -> string`

Full Steam Community Market listing URL for the item.

### `bpUrl(sku) -> string`

backpack.tf stats page URL for the item.

### `manncoUrl(sku) -> string`

mannco.store item page URL.

### `marketplaceUrl(sku) -> string`

marketplace.tf item page URL (uses marketplace.tf's own sku dialect, distinct from this package's).

---

## Steam Community items (trading cards, backgrounds, emotes, etc...)

A separate, simpler sku format for Steam Community items under `appid 753` (trading cards, backgrounds, emotes), since they don't have a TF2-style defindex.

```js
skuFromItem753({ market_hash_name: 'SPY (Trading Card)', game: '440', type: '2', border: '0' })
// '753;2-0;440;SPY%20(Trading%20Card)'

itemFromSku753('753;2-0;440;SPY%20(Trading%20Card)')
// { type: '2', border: '0', game: '440', market_hash_name: 'SPY (Trading Card)', sku: '753;2-0;440;SPY%20(Trading%20Card)' }
```

`type` is the card border/item type digit; `border` (only present for `type === '2'`, foil cards) further distinguishes normal vs. foil borders.

---

## The schema

A large, pre-built snapshot of the TF2 item schema, shipped with the package and used internally by the SKU/name functions. Its pieces are available as named exports:

```js
import { safeItems, items, particleEffects, textures, collections } from '@juice789/tf2items'
```

```js
particleEffects // { "<id>": "<name>", ... }   unusual effect names, e.g. "31": "Nuts n' Bolts"
textures        // { "<id>": "<name>", ... }   war paint / decorated weapon skin names
collections     // { "<defindex>": { rarity, collection }, ... }
items           // { "<defindex>": { ...item }, ... }   see below
```

For effects with a team-colored variant (e.g. "Defragmenting Reality"), only the first id is kept in `particleEffects` — the duplicate id for the other team's variant is dropped.

`safeItems` (used internally throughout the package) wraps `items` in a `Proxy` that returns `{ defindex, item_name: 'Undefined item' }` for any defindex not present in the schema, instead of throwing. Prefer it over indexing `items` directly when looking items up dynamically.

### `items` object shape

Every entry in `items` always has:

```js
{
  name: '...',           // internal Valve item name
  defindex: '...',
  item_class: '...',     // e.g. 'tf_weapon_sniperrifle', 'tool', 'craft_item'
  item_name: '...',      // display name, e.g. 'Sniper Rifle'
  item_quality: 6         // numeric quality id, see qualityNames
}
```

Plus, only when applicable:

| Prop | Present on | Meaning |
|---|---|---|
| `propername` | items whose display name takes "The" (e.g. Strange Unique Wrangler → "The Wrangler") | `'1'` |
| `item_slot` | weapons/wearables | `'primary'`, `'melee'`, `'misc'`, ... |
| `used_by_classes` | class-restricted items | array of class names, or `['all']` / `['multi']` when applicable to many/all classes |
| `untradable` | items that can't be traded | `'1'` |
| `festivized` | items that have a festivized variant | `'1'` |
| `type2` | keys / paint cans | `'key'` or `'paint'` |
| `texture` | War Paints / Decorated weapon skins | paintkit id, matches `textures` keys |
| `target` | Strangifiers, Kits, Killstreak Kits, Unusualifiers | array of one or more target defindexes |
| `series` | crates/cases | array of series numbers |
| `seriesHidden` | crates whose series number isn't shown in the name | `true` |
| `rarity`, `collection` | items belonging to a collection (skins, cosmetics) | e.g. `rarity: 'rare'`, `collection: 'Concealed Killer Collection'` |
| `od`, `td`, `oq` | Fabricators / Chemistry Sets | `od` = possible output defindexes, `td` = possible target defindexes, `oq` = output quality |
| `image_url` | most items | Steam CDN image filename |

Some of these extra props correspond directly to the SKU parts of the same name (`texture` → `pk-`, `target` → `td-`, `series` → `c-`, etc.)

---

## Building the schema yourself (`saveSchema`)

`schema.json` is checked into the repo, but it goes stale as Valve updates the game. If you want to refresh it, use `saveSchema` — **Node only**.

`saveSchema` (and a few other internals like `fetchAppDataInventory`, see [above](#app_data--important-for-tf2-items)) are exposed through `getInstance` as plain `Promise`-returning functions — just `await` them like any other async function.

### `getInstance(options)`

```js
import { getInstance } from '@juice789/tf2items'

const { saveSchema } = getInstance({
  steamApiKey: 'YOUR_STEAM_API_KEY'
})

const schema = await saveSchema()
// schema === { particleEffects, textures, collections, items }  (same shape as schema.json)
```

`options.steamApiKey` is required for anything that calls the Steam Web API (schema items, schema overview, items_game URL, asset class info).

`saveSchema` fetches the Steam `GetSchemaItems` API, the `items_game.txt` (prefab-expanded weapon/item definitions), particle effects, paintkit textures, and `tf_english.txt` (localization), then merges everything into the `items` shape described above.

---

## Reference data exports

A set of lookup tables (sourced from `schemaHelper.json`) are exported directly, useful for building UIs or validating input:

`qualityNames`, `qualityIds`, `rarities`, `killstreakTiers`, `wears`, `classes`, `itemSlots`, `itemClasses`, `paintHex`, `paintDefindex`, `spellDefindex`, `cosmeticCollections`, `weaponCollections`, `warPaintCollections`, `fabricatorDefindex`, `strangifierTargets`, `australiumDefindex`, `crateSeries`, `paintableDefindex`, `chemsetDefindex`, `serieslessDefindex`, `impossibleEffects`

For example:

```js
import { qualityNames, wears, killstreakTiers } from '@juice789/tf2items'

qualityNames['11']     // 'Strange'
wears['1']              // 'Factory New'
killstreakTiers['3']   // 'Professional Killstreak'
```
