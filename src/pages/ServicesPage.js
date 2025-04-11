import React from "react";
import Heading from "../components/common/Heading";
import Services from "../components/home/Service";


export default function Service() {
  return (
    <>
      <Heading heading="Services" title="Home" subtitle="Services" aria-label="Discover our available services" />
      <Services />
      
    </>
  );
}
