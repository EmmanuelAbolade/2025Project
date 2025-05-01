import React from "react";
import Heading from "../components/common/Heading";
import BookAnotherStayForm from '../pages/BookAnotherStayForm';


const App = () => {
  return (
    <>
      <div style={{ fontSize: "1.25rem" }}>
      <Heading heading="Booking" title="Home" subtitle="Booking" />
        <h1>Welcome to Our Hotel</h1>
        <BookAnotherStayForm />
      </div>
    </>
  );
};

export default App;


