import React from "react";
import { Link } from "react-router-dom";
import CommonHeading from "../common/CommonHeading";
import { services } from "../data/Data";


export default function Services() {
  return (
    <>
      <div className="container-xxl py-5 text-decoration-none">
        <div className="container text-decoration-none">
          <div className="text-center wow fadeInUp text-decoration-none" data-wow-delay="0.1s">
            <CommonHeading
              heading="Our Services"
              title="Services"
              subtitle="Check the range of Our"
            />
          </div>
          <div className="row g-4 text-decoration-none">
            {services.map((item, index) => (
              <div
                key={index}
                className="col-lg-4 col-md-6 wow fadeInUp text-decoration-none"
                data-wow-delay="0.1s"
              >
                <Link to={item.link} className="service-item rounded text-decoration-none">
                  <div className="service-icon bg-transparent border rounded p-1 text-decoration-none">
                    <div className="w-100 h-100 border rounded d-flex align-items-center justify-content-center text-decoration-none">
                      {item.icon}
                    </div>
                  </div>
                  <h5 className="mb-3 text-decoration-none">{item.name}</h5>
                  <p className="text-body mb-0 text-decoration-none">{item.description}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
