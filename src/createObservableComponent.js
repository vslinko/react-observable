import React, {Component} from 'react'
import Rx from 'rx'

export default function createObservableComponent(componentFunction) {
  return class ObservableComponent extends Component {
    static displayName = componentFunction.name

    constructor() {
      super()
      this.subscribtion = null
      this.vtree = null
    }

    componentWillMount() {
      this.refresh(this.props)
    }

    componentWillReceiveProps(nextProps) {
      this.dispose()
      this.refresh(nextProps)
    }

    componentWillUnmount() {
      this.dispose()
    }

    refresh(props) {
      const vtreeOrObservable = componentFunction(props)

      if (vtreeOrObservable instanceof Rx.Observable) {
        this.vtree = null
        this.subscribtion = vtreeOrObservable
          .subscribe(vtree => {
            this.vtree = vtree
            this.forceUpdate()
          })
      } else {
        this.vtree = vtreeOrObservable
      }
    }

    dispose() {
      if (this.subscribtion) {
        this.subscribtion.dispose()
        this.subscribtion = null
      }
    }

    render() {
      return this.vtree
    }
  }
}
