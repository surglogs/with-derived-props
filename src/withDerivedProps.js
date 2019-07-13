import { createFactory, PureComponent } from 'react'
import wrapDisplayName from 'recompose/wrapDisplayName'
import setDisplayName from 'recompose/setDisplayName'
import shallowEqual from 'recompose/shallowEqual'
import pick from 'recompose/utils/pick'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

const toPairs = obj => {
  const pairs = []
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      pairs[pairs.length] = [prop, obj[prop]]
    }
  }

  return pairs
}

const withDerivedProps = (
  keys,
  derivationObjOrFn,
  { passAllProps = false } = {},
) => BaseComponent => {
  const factory = createFactory(BaseComponent)
  const shouldMap = (props, nextProps) => {
    return !shallowEqual(pick(props, keys), pick(nextProps, keys))
  }

  const propsMapper = nextProps => {
    const pickedNextProps = passAllProps ? nextProps : pick(nextProps, keys)

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

  class WithDerivedProps extends PureComponent {
    state = {
      computedProps: propsMapper(this.props),
      prevProps: this.props,
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      if (shouldMap(prevState.prevProps, nextProps)) {
        return {
          computedProps: propsMapper(nextProps),
          prevProps: nextProps,
        }
      }

      return {
        prevProps: nextProps,
      }
    }

    render() {
      return factory({
        ...this.props,
        ...this.state.computedProps,
      })
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'withDerivedProps'))(
      WithDerivedProps,
    )
  }

  return WithDerivedProps
}

export default withDerivedProps
