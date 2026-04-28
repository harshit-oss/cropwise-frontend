import Featurecard from "../components/Featurecard";
import styles from "./Home.module.css";
import { useNavigate } from "react-router";
function Home() {
  const navigate = useNavigate(); 
  return (
    <div className={styles.container}>

      {/* HERO SECTION */}
      <div className={styles.hero}>

        <h1>🌱 CropWise</h1>

        <p>
          Smart agriculture platform using Machine Learning,
          Power BI analytics and AI advisory.
        </p>
        
        <button 
          className={styles.heroBtn}
          onClick={() => navigate("/dashboard")}>
        Explore Dashboard
        </button>
      </div>

      {/* FEATURE CARDS */}

      <div className={styles.cards}>

        <Featurecard
          title="🌾 Crop Recommendation"
          description="Predict best crops based on soil & weather."
        />

        <Featurecard
          title="🧪 Fertilizer Advisory"
          description="Suggest optimal fertilizer usage."
        />

        <Featurecard
          title="📊 Analytics Dashboard"
          description="Visualize crop and rainfall trends."
        />

        <Featurecard
          title="🤖 AI Chatbot"
          description="Ask farming questions instantly."
        />

      </div>

    </div>
  );
}

export default Home;