import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (typeof console !== 'undefined') {
      console.error('[wedding] error boundary caught', error, info.componentStack);
    }
  }

  retry = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    if (this.props.fallback) return this.props.fallback(error, this.retry);
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 32,
          color: '#444',
          background: '#fafafa',
        }}
      >
        <h2 style={{ fontWeight: 500, marginBottom: 12 }}>일시적인 오류가 발생했어요</h2>
        <p style={{ fontSize: 14, color: '#777', maxWidth: 360, lineHeight: 1.7, marginBottom: 24 }}>
          페이지를 새로고침하면 대부분 정상적으로 열립니다.
          <br />
          계속 같은 오류가 나타나면 신랑·신부에게 알려주세요.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={this.retry}
            style={{
              padding: '10px 24px',
              background: 'transparent',
              border: '1px solid #999',
              color: '#333',
              borderRadius: 999,
              fontSize: 13,
            }}
          >
            다시 시도
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 24px',
              background: '#222',
              color: '#fff',
              border: 0,
              borderRadius: 999,
              fontSize: 13,
            }}
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }
}
