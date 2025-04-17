// src/components/DashboardGreeting.jsx
import React from "react";

const DashboardGreeting = ({ title, name }) => {
    const containerStyle = {
        background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
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
        <div style={containerStyle}>
          <h2 style={headingStyle}>Welcome, {name}!</h2>
          <p style={titleStyle}>{title}</p>
        </div>
      );
    };
    
    export default DashboardGreeting;

  /*
    return (
    <div className="p-3 bg-light mb-3 shadow-sm">
      <h2>Welcome, {name}!</h2>
      <p>{title}</p>
    </div>
  );
};

export default DashboardGreeting;
*/