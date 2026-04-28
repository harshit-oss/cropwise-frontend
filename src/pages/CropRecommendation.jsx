import { useState } from "react";
import styles from "./CropRecommendation.module.css";
import { API_URL } from "../services/api";

function CropRecommendation() {

  const [form, setForm] = useState({
    nitrogen: "", phosphorus: "", potassium: "",
    temperature: "", humidity: "", soilPh: "", rainfall: ""
  });
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePredict = async () => {
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/predict-crop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          N:           Number(form.nitrogen),
          P:           Number(form.phosphorus),
          K:           Number(form.potassium),
          temperature: Number(form.temperature),
          humidity:    Number(form.humidity),
          ph:          Number(form.soilPh),
          rainfall:    Number(form.rainfall),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Server error");
      setResult(data);

    } catch (err) {
      setError("⚠️ Could not connect to server. Make sure backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>

      <h2>🌾 Crop Recommendation</h2>

      <div className={styles.form}>

        <input
          name="nitrogen"
          placeholder="Nitrogen"
          value={form.nitrogen}
          onChange={handleChange}
          type="number"
        />
        <input
          name="phosphorus"
          placeholder="Phosphorus"
          value={form.phosphorus}
          onChange={handleChange}
          type="number"
        />
        <input
          name="potassium"
          placeholder="Potassium"
          value={form.potassium}
          onChange={handleChange}
          type="number"
        />

        <input
          name="temperature"
          placeholder="Temperature"
          value={form.temperature}
          onChange={handleChange}
          type="number"
        />
        <input
          name="humidity"
          placeholder="Humidity"
          value={form.humidity}
          onChange={handleChange}
          type="number"
        />
        <input
          name="soilPh"
          placeholder="Soil pH"
          value={form.soilPh}
          onChange={handleChange}
          type="number"
        />

        <input
          name="rainfall"
          placeholder="Rainfall"
          value={form.rainfall}
          onChange={handleChange}
          type="number"
          className={styles.full}
        />

        <button onClick={handlePredict} disabled={loading}>
          {loading ? "Predicting..." : "Predict Crop"}
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className={styles.result} style={{ color: "red" }}>
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={styles.result}>
          <div>Recommended Crop: 🌾 <strong>{result.crop}</strong></div>
          <div style={{ fontSize: "0.9rem", marginTop: "0.5rem", opacity: 0.8 }}>
            Confidence: {result.confidence}%
          </div>
          <div style={{ fontSize: "0.85rem", marginTop: "0.75rem" }}>
            <strong>Top Alternatives:</strong>
            {result.top3.map((item, i) => (
              <div key={i} style={{ marginTop: "0.25rem" }}>
                {i + 1}. {item.crop} — {item.confidence}%
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default CropRecommendation;
