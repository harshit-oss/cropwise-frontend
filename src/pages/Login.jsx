// src/pages/Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Auth.module.css";

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate                = useNavigate();

  // ── Email/Password login ──
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Google login ──
  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Logo */}
        <div className={styles.logo}><img src="/cropwise logo.png" alt="logo" className={styles.logoImg} /> 
        <span>CropWise</span></div>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Sign in to your account</p>

        {/* Error */}
        {error && <div className={styles.error}>❌ {error}</div>}

        {/* Form */}
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={styles.input}
              required
            />
          </div>

          <button type="submit" disabled={loading} className={styles.btn}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className={styles.divider}><span>or</span></div>

        {/* Google */}
        <button onClick={handleGoogle} disabled={loading} className={styles.googleBtn}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google" width={20} height={20}
          />
          Continue with Google
        </button>

        {/* Signup link */}
        <p className={styles.switchText}>
          Don't have an account?{" "}
          <Link to="/signup" className={styles.link}>Sign Up</Link>
        </p>

      </div>
    </div>
  );
}

// Convert Firebase error codes to readable messages
function getFriendlyError(code) {
  switch (code) {
    case "auth/user-not-found":      return "No account found with this email.";
    case "auth/wrong-password":      return "Incorrect password. Try again.";
    case "auth/invalid-email":       return "Invalid email address.";
    case "auth/too-many-requests":   return "Too many attempts. Try again later.";
    case "auth/popup-closed-by-user":return "Google sign-in was cancelled.";
    case "auth/invalid-credential":  return "Invalid email or password.";
    default:                         return "Something went wrong. Please try again.";
  }
}

export default Login;