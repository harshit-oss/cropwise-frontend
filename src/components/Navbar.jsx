import styles from "./Navbar.module.css";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.navbar}>

      {/* ── Left — Logo ── */}
      <div className={styles.logo}>
        <img src="/cropwise logo.png" alt="logo" className={styles.logoImg} />
        <span>CropWise</span>
      </div>

      {/* ── Center — Tagline ── */}
      <div className={styles.tagline}>AI-driven Agricultural Advisory</div>

      {/* ── Right — Profile & Logout ── */}
      {user && (
        <div className={styles.profile}>

          {/* Avatar — show photo if Google login, else initials */}
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="profile"
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarInitials}>
              {(user.displayName || user.email || "U")[0].toUpperCase()}
            </div>
          )}

          {/* Name or email */}
          <div className={styles.userInfo}>
            <span className={styles.userName}>
              {user.displayName || user.email.split("@")[0]}
            </span>
            <span className={styles.userEmail}>{user.email}</span>
          </div>

          {/* Logout button */}
          <button onClick={logout} className={styles.logoutBtn}>
            Logout
          </button>

        </div>
      )}

    </nav>
  );
}

export default Navbar;