export const mergeDeep = (target, source) => {
    const result = { ...target }
    for (const [key, val] of Object.entries(source)) {
        result[key] = (val && typeof val === 'object' && !Array.isArray(val) && result[key] && typeof result[key] === 'object')
            ? mergeDeep(result[key], val)
            : val
    }
    return result
}
