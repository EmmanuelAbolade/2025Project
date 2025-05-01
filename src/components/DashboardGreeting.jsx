// src/components/DashboardGreeting.jsx
import React from "react";
import { Container, Card } from "react-bootstrap";

const DashboardGreeting = ({ title, name }) => {
    const containerStyle = {
        background: "linear-gradient(135deg, #f6d365 0%,rgb(178, 239, 48) 100%)",
        color: "#000",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
        marginBottom: "20px",
        textAlign: "center"
      };
    
      const headingStyle = {
        fontSize: "2.5rem",
        fontFamily: "'Pacifico', cursive", // This font gives a handwritten look. Fallback to cursive.
        marginBottom: "10px"
      };
    
      const titleStyle = {
        fontSize: "1.2rem",
        fontWeight: "400",
        margin: "0"
      };

      return (
        <Container fluid className="mt-4">
          <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light text-center">
            <h2 className="fw-bold text-primary" style={headingStyle}>
              🎉 Welcome, {name}!
            </h2>
            <p className="text-secondary fw-bold" style={titleStyle}>
              {title}
            </p>
          </Card>
        </Container>
      );
      
    };
    
    export default DashboardGreeting;
