import React from 'react';
import { Form, Button } from 'react-bootstrap';

export default function Employment() {
  return (
    <div className="container shadow">
      <div style={{height: 10}}></div>
      <h2 className="text-center bg-primary text-white py-4">Apply For Employment</h2>

      <div className="row">
        <div className="col">
          <Form className="mb-3 mb-md-0 px-5">

            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control name="firstName" type="text" placeholder="Enter First Name" />
            </Form.Group>

            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control name="lastName" type="text" placeholder="Enter Last Name" />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" type="email" placeholder="Enter Email" />
            </Form.Group>

            <Form.Group controlId="phone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control name="phone" type="tel" placeholder="Enter Phone Number" />
            </Form.Group>

            <Form.Row className="ml-0">
              <Form.Group controlId="city" className="mr-auto">
                <Form.Label>City/Town</Form.Label>
                <Form.Control name="city" type="text" placeholder="Enter City/Town" />
              </Form.Group>
              <Form.Group controlId="zip">
                <Form.Label>Zip Code</Form.Label>
                <Form.Control name="zip" type="text" placeholder="Enter Zipcode" />
              </Form.Group>
            </Form.Row>
            <div className="d-flex">
              <Button type="submit" className="w-50 mx-auto" >Submit</Button>
            </div>
          </Form>

        </div>
        
      </div>

      <div className="pb-5"></div>

    </div>
  );
}