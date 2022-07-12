import australium from './australium'
import botkiller from './botkiller'
import chemistrySet from './chemistrySet'
import cosmetic from './cosmetic'
import crate from './crate'
import defaultCategory from './defaultCategory'
import fabricator from './fabricator'
import festive from './festive'
import festivized from './festivized'
import key from './key'
import kit from './kit'
import paint from './paint'
import skinPainted from './skinPainted'
import skinUnboxed from './skinUnboxed'
import strangifier from './strangifier'
import taunt from './taunt'
import unusualifier from './unusualifier'
import warpaint from './warpaint'
import weapon from './weapon'

const schema = {
    "All items": defaultCategory,
    "Weapon": weapon,
    "Cosmetic": cosmetic,
    "Taunt": taunt,
    "Australium": australium,
    "Festive Weapon": festive,
    "Festivized Weapon": festivized,
    "Killstreak Kit": kit,
    "Kit Fabricator": fabricator,
    "War Paint": warpaint,
    "Skin (War Paint)": skinPainted,
    "Skin (Unboxed)": skinUnboxed,
    "Crate": crate,
    "Key": key,
    "Paint": paint,
    "Botkiller": botkiller,
    "Chemistry Set": chemistrySet,
    "Strangifier": strangifier,
    "Unusualifier": unusualifier
}

export default schema