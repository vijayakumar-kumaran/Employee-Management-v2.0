import React, { useState, useEffect } from 'react';
import { Sparkles, Eye, EyeOff, Lock, Mail, Server, ArrowRight, AlertTriangle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/userSlice';
import { loginUser } from '../../services/api';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isWarmingUp, setIsWarmingUp] = useState(false);
  const [warmupSeconds, setWarmupSeconds] = useState(0);

  // Timer for Render server cold-start warming up modal
  useEffect(() => {
    let timer;
    if (loading) {
      const timeout = setTimeout(() => {
        setIsWarmingUp(true);
      }, 1200);

      timer = setInterval(() => {
        setWarmupSeconds((prev) => prev + 1);
      }, 1000);

      return () => {
        clearTimeout(timeout);
        clearInterval(timer);
      };
    } else {
      setIsWarmingUp(false);
      setWarmupSeconds(0);
    }
  }, [loading]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await loginUser({ loginValue, password });

      if (response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('isLoggedIn', 'true');

        dispatch(setUser(response.data.user));
        if (onLogin) onLogin();
        navigate('/', { replace: true });
      } else {
        setErrorMessage('Invalid credentials or missing token.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(
        error.response?.data?.error ||
          'Connection failed. If backend is on Render free tier, please wait 1-2 mins for server to warm up!'
      );
    } finally {
      setLoading(false);
    }
  };

  const setDemoAdmin = () => {
    setLoginValue('admin');
    setPassword('admin123');
  };

  const setDemoEmployee = () => {
    setLoginValue('employee');
    setPassword('emp123');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        backgroundColor: '#090d16',
        backgroundImage:
          'radial-gradient(circle at 50% 15%, rgba(99, 102, 241, 0.25), transparent 70%), radial-gradient(circle at 85% 85%, rgba(6, 182, 212, 0.2), transparent 60%)',
        padding: '1rem',
        overflowY: 'auto',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(17, 24, 39, 0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '24px',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.7), 0 0 50px rgba(99, 102, 241, 0.2)',
          padding: '2.5rem 2rem',
          margin: 'auto',
          boxSizing: 'border-box',
          color: '#ffffff',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.45)',
              marginBottom: '0.75rem',
            }}
          >
            <Sparkles size={28} color="#ffffff" />
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: '1.85rem',
              fontWeight: 800,
              fontFamily: "'Outfit', sans-serif",
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            Apex<span style={{ color: '#6366f1' }}>HR</span>
          </h1>
          <p style={{ margin: '0.35rem 0 0', color: '#9ca3af', fontSize: '0.875rem', fontWeight: 500 }}>
            Enterprise Employee Management SaaS
          </p>
        </div>

        {/* Render.com Free Tier Server Notice */}
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '0.85rem 1rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(6, 182, 212, 0.12)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start',
          }}
        >
          <Server size={22} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.8rem', color: '#e0f2fe', lineHeight: 1.5 }}>
            <strong style={{ display: 'block', color: '#38bdf8', marginBottom: '2px', fontSize: '0.85rem' }}>
              🌐 Render.com Free Tier Notice
            </strong>
            Once you click <strong>Sign In</strong> or <strong>Register</strong>, please wait <strong>1–2 minutes</strong> for our free Render backend server to spin up if it was idle.
          </div>
        </div>

        {/* Demo Fast Login Buttons */}
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <span
            style={{
              display: 'block',
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
            }}
          >
            ⚡ One-Click Demo Credentials
          </span>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={setDemoAdmin}
              style={{
                flex: 1,
                padding: '0.5rem 0.75rem',
                borderRadius: '10px',
                border: '1px solid rgba(99, 102, 241, 0.5)',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                color: '#a5b4fc',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Fill Admin
            </button>
            <button
              type="button"
              onClick={setDemoEmployee}
              style={{
                flex: 1,
                padding: '0.5rem 0.75rem',
                borderRadius: '10px',
                border: '1px solid rgba(6, 182, 212, 0.5)',
                backgroundColor: 'rgba(6, 182, 212, 0.2)',
                color: '#67e8f9',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Fill Employee
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Username Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#d1d5db' }}>
              Username or Email
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail
                size={18}
                color="#9ca3af"
                style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }}
              />
              <input
                type="text"
                required
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                placeholder="Enter username or email"
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  color: '#ffffff',
                  fontSize: '0.925rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#d1d5db' }}>
              Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock
                size={18}
                color="#9ca3af"
                style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                  color: '#ffffff',
                  fontSize: '0.925rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                fontSize: '0.825rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertTriangle size={16} color="#fca5a5" />
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.85rem 1.5rem',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
              transition: 'transform 0.2s ease',
            }}
          >
            {loading ? 'Connecting to Server...' : 'Sign In to Workspace'}
            {!loading && <ArrowRight size={18} color="#ffffff" />}
          </button>
        </form>

        <div
          style={{
            margin: '1.75rem 0 1.25rem',
            height: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
        />

        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#9ca3af' }}>
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{ color: '#818cf8', fontWeight: 800, textDecoration: 'none' }}
          >
            Register Account
          </Link>
        </div>
      </div>

      {/* RENDER SERVER WARMING UP MODAL */}
      {isWarmingUp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(9, 13, 22, 0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '400px',
              backgroundColor: '#111827',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              borderRadius: '24px',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
              color: '#ffffff',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '4px solid rgba(99, 102, 241, 0.2)',
                borderTopColor: '#6366f1',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Server size={28} color="#06b6d4" />
            </div>

            <h3
              style={{
                margin: '0 0 0.5rem',
                fontSize: '1.4rem',
                fontWeight: 800,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Waking Up Backend Server...
            </h3>

            <p style={{ margin: '0 0 1.25rem', color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Our Render.com free-tier web service is starting up from idle state. This usually takes <strong>30–60 seconds</strong>.
            </p>

            <div
              style={{
                display: 'inline-block',
                padding: '0.5rem 1.25rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                color: '#a5b4fc',
                fontWeight: 800,
                fontSize: '0.85rem',
                border: '1px solid rgba(99, 102, 241, 0.4)',
              }}
            >
              Elapsed Time: {warmupSeconds}s
            </div>
          </div>
        </div>
      )}

      {/* Keyframe animation for spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Login;
