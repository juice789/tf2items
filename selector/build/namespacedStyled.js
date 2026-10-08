// Only used by the default build, which bundles its own copy of styled-components.
// Two copies with the same version generate the same component ids (sc-<hash>), so the
// selector's class names could collide with the host app's. A custom displayName changes
// the id prefix for every styled component in the bundle, including @juice789/react-toggle.
import baseStyled from 'styled-components-actual'

export * from 'styled-components-actual'

const displayName = 'tf2items-selector'

const namespaced = (styledFn) => (tag) => styledFn(tag).withConfig({ displayName })

const styled = new Proxy(baseStyled, {
    apply: (target, thisArg, [tag]) => namespaced(target)(tag),
    get: (target, prop) => typeof prop === 'string' && typeof target[prop] === 'function' && /^[a-z]/.test(prop)
        ? namespaced(target)(prop)
        : target[prop]
})

export { styled }
export default styled
