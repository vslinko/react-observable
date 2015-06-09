import React, {Component} from 'react'
import Rx from 'rx'

export default function createObservableComponent(componentFunction) {
  return class ObservableComponent extends Component {
    static displayName = componentFunction.name

    constructor() {
      super()

      this.subscribtion = null
      this.vtree = null
      this.shouldRefresh = true
    }

    componentWillMount() {
      this.refresh(this.props)
    }

    componentWillUpdate(nextProps) {
      if (this.shouldRefresh) {
        this.dispose()
        this.refresh(nextProps)
      } else {
        this.shouldRefresh = true
      }
    }

    componentWillUnmount() {
      this.dispose()
    }

    forceUpdateWithoutRefresh() {
      this.shouldRefresh = false
      this.forceUpdate()
    }

    refresh(props) {
      const vtreeOrObservable = componentFunction(props)
      let insideLifecycle = true

      if (vtreeOrObservable instanceof Rx.Observable) {
        this.vtree = null
        this.subscribtion = vtreeOrObservable
          .subscribe(vtree => {
            this.vtree = vtree

            if (!insideLifecycle) {
              this.forceUpdateWithoutRefresh()
            }
          })
      } else {
        this.vtree = vtreeOrObservable
      }

      insideLifecycle = false
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
