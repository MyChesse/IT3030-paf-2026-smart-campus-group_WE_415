import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';
import loginIllustration from '../assets/loginpage.png';
import './LoginPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${apiBaseUrl}/oauth2/authorization/google?prompt=select_account`;
  };

  return (
    <div className="login-page">
      <div className="login-modal">
        <div className="login-left-panel">
          <div className="login-left-content">
            <div className="login-brand">SmartUni</div>
            <div className="login-illustration-wrapper">
              <img src={loginIllustration} alt="SmartUni login illustration" className="login-illustration" />
            </div>
            <div className="login-left-text">
              <h2>Welcome to SmartUni</h2>
              <p>Smart campus management made simple.</p>
            </div>
          </div>
        </div>

        <div className="login-right-panel">
          <div className="login-form-card">
            <div className="login-header">
              <h1>Login</h1>
              <p>Welcome back! Please login to your account.</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter your email" required />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter your password" required />
              </div>

              <div className="login-row">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Keep me logged in</span>
                </label>

                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              <button className="btn btn-primary btn-full login-submit-btn" disabled={loading}>
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <div className="divider">
              <span>or</span>
            </div>

            <button type="button" className="btn btn-google btn-full google-login-btn" onClick={handleGoogleLogin}>
              <FcGoogle size={20} />
              <span>Continue with Google</span>
            </button>

            <p className="auth-footer">
              Don&apos;t have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
