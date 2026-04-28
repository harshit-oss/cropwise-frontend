import styles from "./Featurecard.module.css";

function Featurecard({ title, description }) {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default Featurecard;