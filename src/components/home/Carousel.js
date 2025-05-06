import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { carouselData } from "../data/Data";
import { Card, Button, Container} from "react-bootstrap";
import { Link } from 'react-router-dom';

export default function Carousel() {
  const sliderRef = useRef(null);

  const next = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const previous = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Container fluid className="mt-4 p-0">
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
        <h2 className="text-center fw-bold text-primary">🌟 Featured Highlights</h2>
  
        {/* Hero Carousel */}
        <div id="header-carousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner shadow-sm rounded">
            <Slider ref={sliderRef} {...settings}>
              {carouselData.map((val, index) => (
                <div key={index} className="carousel-item">
                  <img className="w-100 rounded" src={val.img} alt={val.title} />
                  <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                    <Card className="shadow-lg bg-dark text-white p-4 rounded" style={{ maxWidth: "700px" }}>
                      <h6 className="section-title text-uppercase mb-3 animated slideInDown">{val.subtitle}</h6>
                      <h1 className="display-3 fw-bold mb-4 animated slideInDown">{val.title}</h1>
                      <div className="d-flex gap-3">
                        <Button as={Link} to="/contact" className="btn btn-primary py-md-3 px-md-5 fw-bold animated slideInLeft">
                          {val.btn1}
                        </Button>
                        <Button as={Link} to="/DownloadApp" className="btn btn-success py-md-3 px-md-5 fw-bold animated slideInRight">
                          {val.btn2}
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
  
          {/* Navigation Buttons */}
          <button className="carousel-control-prev" type="button" onClick={previous}>
            <span className="carousel-control-prev-icon shadow-sm rounded" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" onClick={next}>
            <span className="carousel-control-next-icon shadow-sm rounded" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </Card>
    </Container>
  );
  
  
}
