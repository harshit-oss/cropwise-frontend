import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

function Sidebar() {

  return (

    <div className={styles.sidebar}>

      <div className={styles.sidebarTitle}>Menu</div>

      <NavLink to="/" end>🏠 Home</NavLink>

      <NavLink to="/dashboard">📊 Dashboard</NavLink>

      <NavLink to="/crop">🌾 Crop Recommendation</NavLink>

      <NavLink to="/fertilizer">🧪 Fertilizer Advisory</NavLink>

      <NavLink to="/chatbot">🤖 AI Chatbot</NavLink>

    </div>

  );
}

export default Sidebar;