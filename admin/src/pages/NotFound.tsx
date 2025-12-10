import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import "@/styles/pages.css";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "var(--muted)"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ marginBottom: "1rem", fontSize: "2.5rem", fontWeight: 700 }}>404</h1>
        <p style={{ marginBottom: "1rem", fontSize: "1.25rem", color: "var(--muted-foreground)" }}>
          Oops! Page not found
        </p>
        <a
          href="/"
          style={{
            color: "var(--primary)",
            textDecoration: "underline"
          }}
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
