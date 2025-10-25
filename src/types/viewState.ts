export type ViewState = 'empty' | 'loading' | 'error' | 'result'

export interface ViewStateProps<T> {
  state: ViewState
  data?: T
  error?: Error | string
}
