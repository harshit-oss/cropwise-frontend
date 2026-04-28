import styles from "./Dashboard.module.css";

function Dashboard() {
  return (
    <div className={styles.container}>

      <h2>📊 Agriculture Analytics Dashboard</h2>

      <p>
        Power BI dashboards showing crop performance,
        rainfall trends and soil health analytics.
      </p>

      <div className={styles.placeholder}>
        <iframe
          title="cropwise dashboard"
          src="https://app.powerbi.com/view?r=eyJrIjoiODhkODJiZWYtNTMyYi00YzgxLTllM2ItYWI2YzJkMDBhOTI4IiwidCI6ImMyY2FmOWNhLWZhN2YtNDMwZC05OWQyLTk0ODJiNTUwZTE0YSJ9"
          frameBorder="0"
          allowFullScreen={true}
          className={styles.iframe}
        />
      </div>

    </div>
  );
}

export default Dashboard;