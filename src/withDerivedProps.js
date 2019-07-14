import pick from 'recompose/utils/pick'
import toPairs from 'ramda/src/toPairs'
import { compose, withPropsOnChange, pure } from 'recompose'

const withDerivedProps = (
  keys,
  derivationObjOrFn,
  { passAllProps = false } = {},
) => {
  const deriveProps = props => {
    const pickedNextProps = passAllProps ? props : pick(props, keys)

    return typeof derivationObjOrFn === 'function'
      ? derivationObjOrFn(pickedNextProps)
      : toPairs(derivationObjOrFn).reduce(
          (computedProps, [derivedPropName, deriveFn]) => {
            return {
              ...computedProps,
              [derivedPropName]: deriveFn({
                ...pickedNextProps,
                ...computedProps,
              }),
            }
          },
          {},
        )
  }

  return compose(
    withPropsOnChange(keys, deriveProps),
    pure,
  )
}

export default withDerivedProps
