/* eslint-disable no-unused-vars*/
jest.autoMockOff()

describe('createObservableComponent', () => {
  const React = require('react/addons')
  const Rx = require('rx')
  const createObservableComponent = require('../index')
  const vtree = <div>test</div>

  it('should be instance of React.Component', () => {
    const Component = createObservableComponent(() => {})
    const instance = new Component()

    expect(instance instanceof React.Component).toBeTruthy()
  })
  it('should use vtree returned by wrapped function', () => {
    const Component = createObservableComponent(() => vtree)

    const instance = React.addons.TestUtils.renderIntoDocument(<Component />)

    expect(React.findDOMNode(instance).textContent).toEqual('test')
  })
  it(`should subscribe to observable and return its value`, () => {
    const observable = Rx.Observable.just(vtree)
    const Component = createObservableComponent(() => observable)

    const instance = React.addons.TestUtils.renderIntoDocument(<Component />)

    expect(React.findDOMNode(instance).textContent).toEqual('test')
  })
})
