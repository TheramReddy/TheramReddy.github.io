import { Component } from 'react'
import type { ReactNode } from 'react'

/** A runtime error replaces the page with one plain line and a way to load it again, instead of a blank screen. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <p className="crash" role="alert">
        Something went wrong on this page.
        <button type="button" className="key" onClick={() => location.reload()}>Reload</button>
      </p>
    )
  }
}
