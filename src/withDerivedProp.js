import withDerivedProps from './withDerivedProps'

export const withDerivedProp = (source, handler, { target } = {}) => {
  return withDerivedProps([source], {
    [target || source]: (props) => {
      return handler(props[source])
    }
  })
}
