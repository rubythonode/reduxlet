import React from 'react'
import {
  createStore,
  applyMiddleware,
  compose,
  bindActionCreators
} from 'redux'

const ReduxletCreator = ({
  defaultState,
  reducer = x => x,
  actions = {},
  mapStateToProps = state => state,
  dispatchMapProps = dispatch => ({
    dispatch,
    actions: bindActionCreators(actions, dispatch)
  }),
  mergeProps = (stateProps, dispatchProps, ownProps) => ({...stateProps, ...dispatchProps, ...ownProps}),
  enhancers = [],
  middleware = [],
  didMount = () => {},
  willUnmount = () => {},
  devtool = false
}) => {
  return (Component) => {
    return class extends React.PureComponent {
      constructor (props) {
        super(props)
        const composeEnhancers = (devtool && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
        this.store = createStore(
          reducer,
          defaultState,
          composeEnhancers(
            ...enhancers,
            applyMiddleware(...middleware)
          )
        )

        this.state = this.buildState(props)
      }

      componentDidMount () {
        didMount()
      }

      componentWillUnmount () {
        willUnmount()
      }

      buildState (ownProps) {
        return mergeProps(
          mapStateToProps(this.store.getState()),
          dispatchMapProps(::this.dispatch),
          ownProps
        )
      }

      dispatch (action) {
        this.store.dispatch(action)
        this.setState(this.buildState(this.props))
      }

      render () {
        return <Component
          {...this.state}
        />
      }
    }
  }
}

export default ReduxletCreator
