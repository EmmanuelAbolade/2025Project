//src\components\home\Book.js
// src/components/home/Book.js
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Col, Row, Card, Form, Button, Container } from "react-bootstrap";

export default function Book() {
  return (
    <Container fluid className="mt-4">
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
        <h2 className="text-center fw-bold text-primary">🏨 Booking Section</h2>
  
        {/* Booking Form */}
        <Card className="shadow-lg border border-3 border-secondary rounded p-4 bg-white mt-4">
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-bold">📅 Check-in</Form.Label>
                <Form.Control
                  type="text"
                  className="border border-2 border-primary shadow-sm datetimepicker-input"
                  placeholder="Select Check-in Date"
                  data-target="#date1"
                  data-toggle="datetimepicker"
                />
              </Form.Group>
            </Col>
  
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-bold">📅 Check-out</Form.Label>
                <Form.Control
                  type="text"
                  className="border border-2 border-primary shadow-sm datetimepicker-input"
                  placeholder="Select Check-out Date"
                  data-target="#date2"
                  data-toggle="datetimepicker"
                />
              </Form.Group>
            </Col>
  
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-bold">👥 Number of Adults</Form.Label>
                <Form.Select defaultValue="" className="border border-2 border-primary shadow-sm">
                  <option value="" disabled>Choose Adults</option>
                  <option value="1">Adult 1</option>
                  <option value="2">Adult 2</option>
                  <option value="3">Adult 3</option>
                </Form.Select>
              </Form.Group>
            </Col>
  
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-bold">🧒 Number of Children</Form.Label>
                <Form.Select defaultValue="" className="border border-2 border-primary shadow-sm">
                  <option value="" disabled>Choose Children</option>
                  <option value="1">Child 1</option>
                  <option value="2">Child 2</option>
                  <option value="3">Child 3</option>
                  <option value="4">Child 4</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
  
          {/* Submit Button */}
          <div className="d-flex justify-content-center mt-4">
            <Button className="btn btn-primary fw-bold shadow-sm w-50">
              ✅ Submit Booking
            </Button>
          </div>
        </Card>
      </Card>
    </Container>
  );
  
}







/*
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function Book() {
  return (
    <>
      <div
        className="container-fluid booking pb-5 wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div className="container">
          <div className="bg-white shadow" style={{ padding: "35px" }}>
            <div className="row g-2">
              <div className="col-md-10">
                <div className="row g-2">
                  <div className="col-md-3">
                    <div className="date" id="date1" data-target-input="nearest">
                      <input
                        type="text"
                        className="form-control datetimepicker-input"
                        placeholder="Check in"
                        data-target="#date1"
                        data-toggle="datetimepicker"
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="date" id="date2" data-target-input="nearest">
                      <input
                        type="text"
                        className="form-control datetimepicker-input"
                        placeholder="Check out"
                        data-target="#date2"
                        data-toggle="datetimepicker"
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <select className="form-select ">
                      <option selected>Select number of Adult(s)</option>
                      <option value="1">Adult 1</option>
                      <option value="2">Adult 2</option>
                      <option value="3">Adult 3</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <select className="form-select">
                      <option selected>Select Number of child(ren).</option>
                      <option value="1">Child 1</option>
                      <option value="2">Child 2</option>
                      <option value="3">Child 3</option>
                      <option value="4">Child 3</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-md-2">
                <button className="btn btn-primary w-100">Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
*/