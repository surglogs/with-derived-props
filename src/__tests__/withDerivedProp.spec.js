import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { compose, withState, flattenProp } from 'recompose'

import { withDerivedProp } from '../withDerivedProp'

describe('withDerivedProp HOC', () => {
  it('derives props when relevant props change', () => {
    const component = sinon.spy(() => null)
    component.displayName = 'component'

    const propsTracker = sinon.spy()
    const StringConcat = compose(
      withState('strings', 'updateStrings', { a: 'a', b: 'b', c: 'c' }),
      flattenProp('strings'),
      withDerivedProp('a', a => {
        propsTracker(a)
        return 'cool ' + a
      }),
    )(component)

    expect(StringConcat.displayName).toBe(
      'withState(flattenProp(withDerivedProps(component)))',
    )

    mount(<StringConcat />)
    const { updateStrings } = component.firstCall.args[0]
    expect(component.lastCall.args[0].a).toBe('cool a')
    expect(component.calledOnce).toBe(true)
    expect(propsTracker.callCount).toBe(1)
    expect(propsTracker.lastCall.args[0]).toEqual('a')

    // Does not re-map for non-dependent prop updates
    updateStrings(strings => ({ ...strings, c: 'baz' }))
    expect(component.lastCall.args[0].a).toBe('cool a')
    expect(component.lastCall.args[0].c).toBe('baz')
    expect(component.calledTwice).toBe(true)
    expect(propsTracker.callCount).toBe(1)

    updateStrings(strings => ({ ...strings, a: 'foo' }))
    expect(component.lastCall.args[0].a).toBe('cool foo')
    expect(component.lastCall.args[0].c).toBe('baz')
    expect(component.calledThrice).toBe(true)
    expect(propsTracker.callCount).toBe(2)
  })
})
