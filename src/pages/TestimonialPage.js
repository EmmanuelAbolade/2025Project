import React from "react";
import Heading from "../components/common/Heading";
import Sliders from "../components/home/Slider";
import FeedbackCarousel from "../components/homePage/FeedbackCarousel";
export default function Testimonial() {
  return (
    <>
      <Heading heading="Testimonial" title="Home" subtitle="Testimonial" aria-label="Testimonials from our customers" style={{ fontSize: "1.25rem" }}/>
      <Sliders />
      <FeedbackCarousel />
    </>
  );
}
