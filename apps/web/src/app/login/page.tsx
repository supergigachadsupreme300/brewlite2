'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type Mode = 'login' | 'register';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
    const body =
      mode === 'login'
        ? { email, password }
        : { name, email, password };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        const message = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message;
        throw new Error(message || 'Xác thực thất bại');
      }
      if (data.accessToken) {
        window.localStorage.setItem('token', data.accessToken);
        window.localStorage.setItem('brewlite_jwt', data.accessToken);
      }
      setSuccess(mode === 'login' ? 'Đăng nhập thành công!' : 'Đăng ký thành công!');
      setTimeout(() => router.push('/'), 800);
    } catch (err) {
      setError((err as Error).message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        maxWidth: '420px',
        margin: '0 auto',
        padding: '2rem 1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>
        {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
      </h1>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          type="button"
          onClick={() => setMode('login')}
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '0.5rem',
            border: '1.5px solid',
            borderColor: mode === 'login' ? '#2e7d32' : '#ccc',
            backgroundColor: mode === 'login' ? '#e8f5e9' : '#fff',
            color: mode === 'login' ? '#2e7d32' : '#333',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Đăng nhập
        </button>
        <button
          type="button"
          onClick={() => setMode('register')}
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '0.5rem',
            border: '1.5px solid',
            borderColor: mode === 'register' ? '#2e7d32' : '#ccc',
            backgroundColor: mode === 'register' ? '#e8f5e9' : '#fff',
            color: mode === 'register' ? '#2e7d32' : '#333',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Đăng ký
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
      >
        {mode === 'register' && (
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              Họ và tên
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
              }}
            />
          </div>
        )}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            Mật khẩu
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {error && (
          <p role="alert" style={{ color: '#b00020', fontSize: '0.875rem' }}>
            {error}
          </p>
        )}
        {success && (
          <p role="status" style={{ color: '#2e7d32', fontSize: '0.875rem' }}>
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: loading ? '#cccccc' : '#2e7d32',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1rem',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading
            ? 'Đang xử lý...'
            : mode === 'login'
            ? 'Đăng nhập'
            : 'Đăng ký'}
        </button>
      </form>

      <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666' }}>
        <Link href="/" style={{ color: '#0066cc' }}>
          ← Quay lại thực đơn
        </Link>
      </p>
    </main>
  );
}