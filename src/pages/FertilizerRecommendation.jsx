import { useState } from "react";
import styles from "./FertilizerRecommendation.module.css";
import { API_URL } from "../services/api";

const CROP_TYPES       = ["Barley","Carrot","Cotton","Maize","Potato","Rice","Soybean","Sugarcane","Tomato","Wheat"];
const SOIL_TYPES       = ["Clay","Loamy","Peaty","Sandy","Silty"];
const SEASONS          = ["Kharif","Rabi","Zaid"];
const IRRIGATION_TYPES = ["Drip","Flood","Manual","Rain-fed","Sprinkler"];

function FertilizerRecommendation() {
  const [form, setForm] = useState({
    crop_type: "", soil_type: "", season: "", irrigation_type: "",
    farm_area_acres: "", fertilizer_used_tons: "",
    pesticide_used_kg: "", water_usage_m3: "",
  });
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setError("");
    setResult(null);
    const missing = Object.entries(form).filter(([, v]) => !v);
    if (missing.length) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/predict-fertilizer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop_type:            form.crop_type,
          soil_type:            form.soil_type,
          season:               form.season,
          irrigation_type:      form.irrigation_type,
          farm_area_acres:      Number(form.farm_area_acres),
          fertilizer_used_tons: Number(form.fertilizer_used_tons),
          pesticide_used_kg:    Number(form.pesticide_used_kg),
          water_usage_m3:       Number(form.water_usage_m3),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Server error");
      setResult(data);
    } catch (err) {
      setError(err.message || "Could not connect. Is the backend running on port 8000?");
    } finally {
      setLoading(false);
    }
  };

  const levelColor =
    result?.yield_level === "high"   ? "high"
    : result?.yield_level === "medium" ? "medium"
    : "low";

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🧪 Fertilizer Recommendation</h2>
      <p className={styles.subtitle}>
        Suggests fertilizers based on your farm data using machine learning.
      </p>

      {/* ── FORM ── */}
      <div className={styles.formCard}>

        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label}>Crop Type</label>
            <select name="crop_type" value={form.crop_type} onChange={handleChange} className={styles.input}>
              <option value="">Select Crop</option>
              {CROP_TYPES.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Soil Type</label>
            <select name="soil_type" value={form.soil_type} onChange={handleChange} className={styles.input}>
              <option value="">Select Soil</option>
              {SOIL_TYPES.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Season</label>
            <select name="season" value={form.season} onChange={handleChange} className={styles.input}>
              <option value="">Select Season</option>
              {SEASONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Irrigation Type</label>
            <select name="irrigation_type" value={form.irrigation_type} onChange={handleChange} className={styles.input}>
              <option value="">Select Irrigation</option>
              {IRRIGATION_TYPES.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label}>Farm Area <span className={styles.unit}>(acres)</span></label>
            <input type="number" name="farm_area_acres" value={form.farm_area_acres}
              onChange={handleChange} placeholder="e.g. 5" className={styles.input} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Fertilizer Used <span className={styles.unit}>(tons)</span></label>
            <input type="number" name="fertilizer_used_tons" value={form.fertilizer_used_tons}
              onChange={handleChange} placeholder="e.g. 0.5" className={styles.input} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Pesticide Used <span className={styles.unit}>(kg)</span></label>
            <input type="number" name="pesticide_used_kg" value={form.pesticide_used_kg}
              onChange={handleChange} placeholder="e.g. 2" className={styles.input} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Water Usage <span className={styles.unit}>(cubic m)</span></label>
            <input type="number" name="water_usage_m3" value={form.water_usage_m3}
              onChange={handleChange} placeholder="e.g. 50000" className={styles.input} />
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading} className={styles.btn}>
          {loading ? "⏳ Analysing…" : "🌱 Get Fertilizer Recommendation"}
        </button>

        {error && <div className={styles.error}>❌ {error}</div>}
      </div>

      {/* ── RESULT ── */}
      {result && (
        <div className={styles.resultSection}>

          {/* Yield badge */}
          <div className={`${styles.badge} ${styles[levelColor]}`}>
            {levelColor === "high" ? "✅" : levelColor === "medium" ? "📊" : "⚠️"}
            &nbsp;Fertility Level: <strong>{result.yield_level.toUpperCase()}</strong>
            &nbsp;·&nbsp;Predicted Yield: <strong>{result.predicted_yield} tons</strong>
          </div>

          {/* Fertilizer name */}
          <div className={styles.fertCard}>
            <div className={styles.fertLabel}>Recommended Fertilizer</div>
            <div className={styles.fertName}>🧪 {result.fertilizer_name}</div>
          </div>

          {/* NPK grid */}
          <div className={styles.grid3}>
            <div className={`${styles.npkCard} ${styles.nitrogen}`}>
              <div className={styles.npkLabel}>Nitrogen (N)</div>
              <div className={styles.npkValue}>{result.n_kg} kg</div>
              <div className={styles.npkSub}>for {form.farm_area_acres} acres</div>
            </div>
            <div className={`${styles.npkCard} ${styles.phosphorus}`}>
              <div className={styles.npkLabel}>Phosphorus (P)</div>
              <div className={styles.npkValue}>{result.p_kg} kg</div>
              <div className={styles.npkSub}>for {form.farm_area_acres} acres</div>
            </div>
            <div className={`${styles.npkCard} ${styles.potassium}`}>
              <div className={styles.npkLabel}>Potassium (K)</div>
              <div className={styles.npkValue}>{result.k_kg} kg</div>
              <div className={styles.npkSub}>for {form.farm_area_acres} acres</div>
            </div>
          </div>

          {/* Advisory */}
          <div className={styles.advice}>
            💡 <strong>Advisory:</strong> {result.advice}
          </div>

        </div>
      )}
    </div>
  );
}

export default FertilizerRecommendation;
