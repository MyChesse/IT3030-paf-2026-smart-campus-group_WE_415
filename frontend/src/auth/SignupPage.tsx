import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';
import loginIllustration from '../assets/loginpage.png';
import './LoginPage.css';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081';

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim() || form.name.length < 2) next.name = 'Name must be at least 2 characters';
    if (!form.email) next.email = 'Email is required';
    if (form.password.length < 8) next.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match';
    return next;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await signup({ name: form.name, email: form.email, password: form.password });
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setErrors({ general: err.response?.data?.error || 'Signup failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${apiBaseUrl}/oauth2/authorization/google?prompt=select_account`;
  };

  return (
    <div className="login-page">
      <div className="login-modal">
        <div className="login-left-panel">
          <div className="login-left-content">
            <div className="login-brand">SmartUni</div>
            <div className="login-illustration-wrapper">
              <img src={loginIllustration} alt="SmartUni illustration" className="login-illustration" />
            </div>
            <div className="login-left-text">
              <h2>Create your account</h2>
              <p>Join SmartUni and simplify campus life.</p>
            </div>
          </div>
        </div>

        <div className="login-right-panel">
          <div className="login-form-card">
            <div className="login-header">
              <h1>Sign up</h1>
              <p>Create your account to get started</p>
            </div>

            {errors.general && <div className="alert alert-error">{errors.general}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" type="text" value={form.name} onChange={handleChange} required />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} required />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />
                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
              </div>

              <button type="submit" className="btn btn-primary btn-full login-submit-btn" disabled={loading}>
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </form>

            <div className="divider">
              <span>or</span>
            </div>

            <button type="button" className="btn btn-google btn-full google-login-btn" onClick={handleGoogleSignup}>
              <FcGoogle size={20} />
              <span>Continue with Google</span>
            </button>

            <p className="auth-footer">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
