import ReduxProvider from './ReduxProvider'

export default function ClientReduxWrapper({ children }) {
  return <ReduxProvider>{children}</ReduxProvider>
}