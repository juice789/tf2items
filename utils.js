export function mergeDeepWith(fn, a, b) {
    const result = { ...b }
    for (const [key, val] of Object.entries(a)) {
        if (key in result && typeof val === 'object' && val !== null && typeof result[key] === 'object' && result[key] !== null) {
            result[key] = mergeDeepWith(fn, val, result[key])
        } else if (key in result) {
            result[key] = fn(val, result[key])
        } else {
            result[key] = val
        }
    }
    return result
}

export function mergeDeepRight(a, b) {
    return mergeDeepWith((_, n) => n, a, b)
}
