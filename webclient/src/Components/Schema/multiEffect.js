import { particleEffects, impossibleEffects } from '@juice789/tf2items'

import {
    omit, pickBy, includes, map, without, range, concat, toString
} from 'ramda'

const filterEffects = (whitelist) => pickBy(
    (v, k) => includes(k, map(toString, whitelist)),
    omit(impossibleEffects, particleEffects)
)

const multiEffectList = {
    all: filterEffects(without([4], range(1, 700))),
    gen1: filterEffects(without([4], range(1, 20))),
    gen1low: filterEffects([6, 7, 11, 12, 15, 16, 18, 19]),
    gen1high: filterEffects([8, 9, 10, 13, 14, 17]),
    gen2: filterEffects(range(29, 37)),
    gen3: filterEffects(range(56, 63)),
    halloween: filterEffects(concat(range(37, 48), range(73, 87))),
    robo: filterEffects(range(63, 73)),
    eotl: filterEffects(range(87, 91)),
    invasion: filterEffects(range(91, 100)),
    h2015: filterEffects(range(100, 107)),
    h2016: filterEffects(range(107, 111)),
    h2018: filterEffects(range(111, 122)),
    h2019: filterEffects(range(122, 134)),
    w2019: filterEffects(range(134, 146)),
    s2020: filterEffects(range(147, 156)),
    h2020: filterEffects(range(156, 164)),
    w2020: filterEffects(range(164, 176)),
    s2021: filterEffects(range(177, 189)),
    h2021: filterEffects(range(189, 205)),
    w2021: filterEffects(range(205, 224)),
    s2022: filterEffects(range(224, 257)),
    h2022: filterEffects(range(257, 271)),
    w2022: filterEffects(range(271, 279)),
    s2023: filterEffects(range(279, 293)),
    h2023: filterEffects(range(293, 309)),
    w2023: filterEffects(range(309, 326)),
    wep: filterEffects(range(701, 705)),
    wep2: filterEffects(range(701, 704)),
    taunt01: filterEffects(range(3001, 3011)),
    taunt02: filterEffects(range(3011, 3017)),
    taunt03: filterEffects(range(3017, 3023)),
    taunt04: filterEffects(range(3023, 3031)),
    taunt05: filterEffects(range(3031, 3037)),
    taunt06: filterEffects(range(3037, 3049)),
    taunt07: filterEffects(range(3049, 3057)),
    taunt08: filterEffects(range(3059, 3073)),
    taunt09: filterEffects(range(3073, 3088)),
    taunt10: filterEffects(range(3088, 3105)),
    taunt11: filterEffects(range(3105, 3114)),
    taunt12: filterEffects(range(3114, 3124)),
    taunt13: filterEffects(range(3124, 3131)),
    taunt14: filterEffects(range(3131, 3144))
}

export default multiEffectList