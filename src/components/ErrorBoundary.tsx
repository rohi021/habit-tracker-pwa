import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center" role="alert">
          <p className="text-2xl mb-2">⚠️</p>
          <h2 className="text-lg font-semibold text-white mb-2">Something went wrong</h2>
          <p className="text-slate-400 text-sm mb-4">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-500 transition"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
