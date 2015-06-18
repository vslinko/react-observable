import chai from 'chai'
import React from 'react'
import TestUtils from 'react/lib/ReactTestUtils'
import Rx from 'rx'
import createObservableComponent from '../index.js'

const {assert} = chai

describe('createObservableComponent', () => {
  const vtree = <div>test</div>

  it('should be instance of React.Component', () => {
    const Component = createObservableComponent(() => {})
    const instance = new Component()

    assert.instanceOf(instance, React.Component)
  })

  it('should use vtree returned by wrapped function', () => {
    const Component = createObservableComponent(() => vtree)

    const instance = TestUtils.renderIntoDocument(<Component />)

    assert.equal(React.findDOMNode(instance).textContent, 'test')
  })

  it(`should subscribe to observable and return its value`, () => {
    const observable = Rx.Observable.just(vtree)
    const Component = createObservableComponent(() => observable)

    const instance = TestUtils.renderIntoDocument(<Component />)

    assert.equal(React.findDOMNode(instance).textContent, 'test')
  })
})
