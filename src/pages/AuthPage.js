import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AuthPage({ mode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, signUp } = useAuth();
  const navigate = useNavigate();
  const isSignup = mode === 'signup';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isSignup) {
        await signUp(email, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-card">
      <h1>{isSignup ? 'Create account' : 'Login'}</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : isSignup ? 'Signup' : 'Login'}
        </button>
      </form>
      <p>
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
        <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Login' : 'Signup'}</Link>
      </p>
    </section>
  );
}

export default AuthPage;
