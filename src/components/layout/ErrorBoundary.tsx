import { Component } from 'react'
import type { ReactNode } from 'react'

/** Keeps a runtime error from blanking the page: logs nothing to the visitor and renders nothing for the failed part. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {}
  render() {
    return this.state.failed ? null : this.props.children
  }
}
