// src/styles/globalStyles.js

const globalStyles = {
  page: {
    background: "#f5f7fa",
    minHeight: "100vh",
    fontFamily: "system-ui, sans-serif",
    paddingTop: "0px",
  },
  container: {
    maxWidth: "1080px",
    margin: "auto",
    padding: "2rem 1rem",
  },
  header: {
    fontSize: "1.8rem",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "0.5rem",
    color: "#1c1c1e",
  },
  subHeader: {
    textAlign: "center",
    color: "#5f5f5f",
    marginBottom: "1.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "1rem",
    border: "1px solid #e0e0e0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "1rem",
    backgroundColor: "#f0f0f0",
  },
  bookBtn: {
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "500",
    cursor: "pointer",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
  },
  historyBtn: {
    display: "block",
    textAlign: "center",
    margin: "1rem auto 2rem",
    width: "fit-content",
    padding: "0.6rem 1.5rem",
    fontWeight: "600",
    backgroundColor: "#fbbc05",
    color: "#000",
    borderRadius: "10px",
    textDecoration: "none",
  }
};

export default globalStyles;
