'use client';

/**
 * ErrorBoundary Component
 *
 * Uses plain HTML/CSS instead of Chakra to avoid theme context issues
 * when errors occur before ChakraProvider mounts.
 */

import { Component, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

// Plain CSS styles to avoid Chakra theme dependency
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom right, #f7fafc, #edf2f7)',
    padding: '32px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  } as React.CSSProperties,
  card: {
    textAlign: 'center' as const,
    background: 'white',
    padding: '48px',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    maxWidth: '400px',
  } as React.CSSProperties,
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    background: 'linear-gradient(to right, #F99F2A, #E53E3E)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '16px',
  } as React.CSSProperties,
  subtitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: '8px',
  } as React.CSSProperties,
  message: {
    fontSize: '14px',
    color: '#718096',
    marginBottom: '24px',
  } as React.CSSProperties,
  button: {
    background: '#F99F2A',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  } as React.CSSProperties,
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.title}>Oops!</div>
            <div style={styles.subtitle}>Something went wrong</div>
            <div style={styles.message}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </div>
            <button
              style={styles.button}
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
