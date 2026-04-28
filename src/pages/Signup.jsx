// src/pages/Signup.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Auth.module.css";

function Signup() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate                = useNavigate();

  // ── Email/Password signup ──
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Save display name
      await updateProfile(result.user, { displayName: name });
      navigate("/");
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Google signup ──
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
        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>Start your smart farming journey</p>

        {/* Error */}
        {error && <div className={styles.error}>❌ {error}</div>}

        {/* Form */}
        <form onSubmit={handleSignup} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              className={styles.input}
              required
            />
          </div>

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
              placeholder="Min. 6 characters"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              className={styles.input}
              required
            />
          </div>

          <button type="submit" disabled={loading} className={styles.btn}>
            {loading ? "Creating account…" : "Create Account"}
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

        {/* Login link */}
        <p className={styles.switchText}>
          Already have an account?{" "}
          <Link to="/login" className={styles.link}>Sign In</Link>
        </p>

      </div>
    </div>
  );
}

function getFriendlyError(code) {
  switch (code) {
    case "auth/email-already-in-use": return "An account with this email already exists.";
    case "auth/invalid-email":        return "Invalid email address.";
    case "auth/weak-password":        return "Password is too weak. Use at least 6 characters.";
    case "auth/popup-closed-by-user": return "Google sign-in was cancelled.";
    default:                          return "Something went wrong. Please try again.";
  }
}

export default Signup;