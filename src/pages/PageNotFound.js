import React from "react";
import Heading from "../components/common/Heading";

export default function PageNotFound() {
  return (
    <>
      <Heading
        heading="Page Not Found"
        title="Home"
        subtitle="Page Not Found"
      />
      <p className="text-center mt-4">
          The page you're looking for doesn't exist.{" "}
          <a href="/" className="text-decoration-none">Return to Home</a>
          or use the navigation menu.
      </p>
    </>
  );
}
