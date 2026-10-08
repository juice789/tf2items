export const range = (a, b) => Array.from({ length: b - a }, (_, i) => a + i)

// promo items get renamed to distinguish them from the non-genuine (unboxed) version
export const markGenuine = item => item.name?.startsWith('Promo ')
    ? { ...item, item_name: item.item_name + ' (Genuine)' }
    : item
