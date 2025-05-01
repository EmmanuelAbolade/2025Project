import React from "react";
import { testimonial } from "../data/Data";
import { Card, Container} from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Sliders() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768, // For tablets and smaller
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <Container fluid className="mt-5">
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
        <h2 className="text-center fw-bold text-primary">🌟 Guest Testimonials</h2>
  
        {/* Testimonial Slider */}
        <Card className="shadow-lg border border-3 border-secondary rounded p-4 bg-white mt-4">
          <Slider {...settings}>
            {testimonial.map((item, key) => (
              <Card className="testimonial-item position-relative bg-white rounded overflow-hidden shadow-sm p-4" key={key}>
                <Card.Text className="text-muted fw-bold">{item.description}</Card.Text>
                <div className="d-flex align-items-center mt-3">
                  <Card.Img
                    className="img-fluid flex-shrink-0 rounded shadow-sm"
                    src={item.img}
                    alt={`${item.name} testimonial`}
                    style={{ width: "45px", height: "45px" }}
                  />
                  <div className="ps-3">
                    <h6 className="fw-bold text-dark mb-1">{item.name}</h6>
                    <small className="text-secondary">{item.profession}</small>
                  </div>
                </div>
                <div className="text-center mt-2">{item.icon}</div>
              </Card>
            ))}
          </Slider>
        </Card>
      </Card>
    </Container>
  );
};