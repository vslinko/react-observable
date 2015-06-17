import React from 'react'
import createObservableComponent from './createObservableComponent'

export default function createElement(element, ...args) {
  let type = element

  if (typeof element === 'function' && !element.prototype.render) {
    if (!element.ReactComponent) {
      element.ReactComponent = createObservableComponent(element)
    }

    type = element.ReactComponent
  }

  return React.createElement(type, ...args)
}
