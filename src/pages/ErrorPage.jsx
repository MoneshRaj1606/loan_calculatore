import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ErrorScreen() {
  const navigate = useNavigate(); 

  const handleGoHome = () => {
    navigate("/"); 
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100dvh",
        flexWrap: "wrap",
        flexDirection: "column",
      }}
    >
      <p style={{ fontSize: "2rem" }}>
        Something went wrong in the application.
      </p>
      <div>
        <Button variant="outlined" onClick={handleGoHome}>
          Go Home
        </Button>
      </div>
    </div>
  );
}
