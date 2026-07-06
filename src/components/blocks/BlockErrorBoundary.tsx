"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  blockName?: string;
}

interface State {
  hasError: boolean;
}

export class BlockErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Uncaught error in block: ${this.props.blockName}`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
          <p className="font-semibold">⚠️ Failed to render block: {this.props.blockName || 'Unknown'}</p>
          <p className="text-xs mt-1">Please check the configuration in the CMS.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
