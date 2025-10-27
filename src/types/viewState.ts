export type ViewState = 'empty' | 'loading' | 'error' | 'result'

<<<<<<< HEAD
export interface ViewStateProps<T> {
  state: ViewState
  data?: T
  error?: Error | string
=======
export interface ViewStateProps {
  state: ViewState
  error?: string
>>>>>>> origin/pr/2
}
