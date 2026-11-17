import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected application error occurred.',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Application ErrorBoundary caught:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      let friendlyMessage = 'We encountered an unexpected issue while loading this section.';
      try {
        const parsed = JSON.parse(this.state.errorMessage);
        if (parsed?.error) {
          friendlyMessage = `Data access error (${parsed.operationType || 'operation'}): Please verify your credentials or try again.`;
        }
      } catch {
        if (this.state.errorMessage.length < 180) {
          friendlyMessage = this.state.errorMessage;
        }
      }

      return (
        <div className="min-h-screen bg-white text-[#0A0A0A] flex items-center justify-center p-6">
          <div className="max-w-lg w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-[#C59B27]" aria-hidden="true" />
              <h1 className="text-lg font-semibold tracking-tight">Service Interruption</h1>
            </div>
            <p className="text-sm text-[#475569] leading-relaxed mb-6">{friendlyMessage}</p>
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 luxury-btn-primary text-sm font-semibold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Return to Home</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
