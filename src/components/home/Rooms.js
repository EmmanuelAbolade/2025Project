import React from "react";
import CommonHeading from "../common/CommonHeading";
import { facility, roomItems } from "../data/Data";
import { Col, Row, Card, Badge, Alert, Container } from "react-bootstrap";
export default function Rooms() {
  return (
    <Container fluid className="mt-4">
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
        <CommonHeading heading="🏨 Book Another Stay" title="Rooms" subtitle="Available" />
  
        <Row className="g-4" style={{ fontSize: "1.25rem" }}>
          {roomItems.map((item) => (
            <Col key={item.name} lg={4} md={6} className="fadeInUp" data-wow-delay="0.1s">
              <Card className="shadow-lg rounded border border-2 border-secondary overflow-hidden">
                <div className="position-relative">
                  <Card.Img variant="top" src={item.img} alt={`${item.name} room`} className="rounded-top" />
                  <Badge className="position-absolute start-0 top-100 translate-middle-y bg-primary text-white rounded py-1 px-3 ms-4">
                    {item.price}
                  </Badge>
                </div>
                <Card.Body className="p-4 mt-2">
                  <div className="d-flex justify-content-between mb-3">
                    <h5 className="fw-bold text-dark mb-0">{item.name}</h5>
                    <div className="ps-2">{item.star}</div>
                  </div>
                  <div className="d-flex mb-3 flex-wrap">
                    {facility.map((fac, index) => (
                      <small key={index} className="border-end me-3 pe-3 text-secondary">
                        {fac.icon} {fac.quantity || "N/A"} {fac.facility}
                      </small>
                    ))}
                  </div>
                  <p className="text-muted fw-bold mb-3">{item.description}</p>
                  <div className="d-flex justify-content-between">
                    <a className="btn btn-sm btn-primary fw-bold shadow-sm rounded py-2 px-4" href="src/pages/BookAnotherStayForm.js">
                      {item.yellowbtn}
                    </a>
                    <a className="btn btn-sm btn-dark fw-bold shadow-sm rounded py-2 px-4" href="src/pages/BookAnotherStayForm.js">
                      {item.darkbtn}
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </Container>
  );
  
}
