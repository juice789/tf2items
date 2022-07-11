import { effects } from '@juice789/tf2items'

import {
    omit, pickBy, includes, __
} from 'ramda'

const impossibleEffects = [1, 2, 3, 5, 20, 28, 3002, 3040, 184, 3062, 3076, 3080, 3082, 3086, 194, 208, 217, 222]

const filterEffects = (whitelist) => pickBy(
    (v, k) => includes(k, map(toString, whitelist)),
    omit(impossibleEffects, effects)
)

export const multiEffectList = {
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
    wep: filterEffects(range(701, 705)),
    wep2: filterEffects(range(701, 704)),
    taunt1: filterEffects(range(3001, 3011)),
    taunt2: filterEffects(range(3011, 3017)),
    taunt3: filterEffects(range(3017, 3023)),
    taunt4: filterEffects(range(3023, 3031)),
    taunt5: filterEffects(range(3031, 3037)),
    taunt6: filterEffects(range(3037, 3049)),
    taunt7: filterEffects(range(3049, 3057)),
    taunt8: filterEffects(range(3059, 3073)),
    taunt9: filterEffects(range(3073, 3088))
}
