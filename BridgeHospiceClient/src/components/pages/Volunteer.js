import React, { useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import useForm from 'react-hook-form';
import { postItem, Api } from '../common/Api';

export default function Volunteer() {
  const { register, handleSubmit, errors } = useForm();
  let isInitialized = false;
  const isSuccess = useRef(false);
  const onSubmit = async data => {
    isInitialized = true;

    let responseJson = await postItem(Api.Volunteer.Controller, {
      "FirstName": data.firstName,
      "LastName": data.lastName,
      "Email": data.email,
      "PhoneNumber": data.phoneNumber,
      "City": data.cityName,
      "Zip": data.zipCode
    });

    if (responseJson) {
      isSuccess.current = true;
    }
  }

  return (
    <div>
      <div className={isSuccess.current ? "d-none" : "container shadow"} >
        <div style={{height: 10}}></div>
        <h2 className="text-center bg-primary text-white py-4">Apply to be a Volunteer</h2>
        <div className="row">
          <div className="col-12 col-lg d-flex align-items-center mt-2 mt-lg-0">
            <div className="m-auto p-2 "><img className="img-fluid" src="https://via.placeholder.com/434x382" alt="The Greatest Example of Love is a heart of service."/></div>
          </div>
          <div className="col-12 col-lg">

            <Form className="m-auto py-4" style={{maxWidth: "450px"}} onSubmit={handleSubmit(onSubmit)}>

              <Form.Group controlId="firstName">
                <Form.Label>First Name {errors.firstName && <span className="text-danger">{errors.firstName.message}</span>}</Form.Label>
                <Form.Control name="firstName" type="text" placeholder="Enter First Name" 
                  className={handleValidationClass(errors.firstName)}
                  ref={register({
                    required: {value: true, message: "Required"}, 
                    maxLength: {value: 30, message: "Maximum length is 30 characters"}
                  })} />
              </Form.Group>

              <Form.Group controlId="lastName">
                <Form.Label>Last Name {errors.lastName && <span className="text-danger">{errors.lastName.message}</span>}</Form.Label>
                <Form.Control name="lastName" type="text" placeholder="Enter Last Name" 
                  className={handleValidationClass(errors.lastName)}
                  ref={register({
                    required: {value: true, message: "Required"}, 
                    maxLength: {value: 30, message: "Maximum length is 30 characters"}
                  })} />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email {errors.email && <span className="text-danger">{errors.email.message}</span>}</Form.Label>
                <Form.Control name="email" type="email" placeholder="Enter Email" 
                  className={handleValidationClass(errors.email)}
                  ref={register({
                    required: {value: true, message: "Required"}, 
                    maxLength: {value: 50, message: "Maximum length is 50 characters"}
                  })} />
              </Form.Group>

              <Form.Group controlId="phoneNumber">
                <Form.Label>Phone Number {errors.phoneNumber && <span className="text-danger">{errors.phoneNumber.message}</span>}</Form.Label>
                <Form.Control name="phoneNumber" type="tel" placeholder="Enter Phone Number (numbers only)" 
                  className={handleValidationClass(errors.phoneNumber)}
                  ref={register({
                    required: {value: true, message: "Required"},
                    minLength: {value: 10, message: "Minimum length is 10 digits"},
                    maxLength: {value: 10, message: "Maximum length is 10 digits"}
                  })} />
              </Form.Group>

              <Form.Row className="ml-0 p-2">

                <Form.Group controlId="cityName" className="mr-auto">
                  <Form.Label>City {errors.cityName && <span className="text-danger">{errors.cityName.message}</span>}</Form.Label>
                  <Form.Control name="cityName" type="tel" placeholder="Enter City" 
                    className={handleValidationClass(errors.cityName)}
                    ref={register({
                      required: {value: true, message: "Required"}, 
                      maxLength: {value: 30, message: "Maximum length is 30 characters"}
                    })} />
                </Form.Group>

                <Form.Group controlId="zipCode">
                  <Form.Label>Zipcode {errors.zipCode && <span className="text-danger">{errors.zipCode.message}</span>}</Form.Label>
                  <Form.Control name="zipCode" type="tel" placeholder="Enter Zipcode" 
                    className={handleValidationClass(errors.zipCode)}
                    ref={register({
                      required: {value: true, message: "Required"},
                      minLength: {value: 5, message: "Minimum length is 5 characters"},
                      maxLength: {value: 10, message: "Maximum length is 10 characters"}
                    })} />
                </Form.Group>

              </Form.Row>

              <div className="d-flex p-2">
                <Button type="submit" className="w-50 mx-auto">Submit</Button>
              </div>

            </Form>

          </div>

          
        </div>

        <div className="pb-3"></div>
      </div>

      <div className={!isSuccess.current ? "d-none" : "container shadow pb-5"}>
        <div style={{height: 10}}></div>
        <h2 className="text-center bg-primary text-white py-4 mb-3">Thanks for Applying to Volunteer</h2>
        <p className="p-5" style={{fontSize: 24}}>
        The form has been submitted to our volunteer coordinator and 
        a confirmation has been sent to your email address. <br /><br />
        Please allow 3 - 5 business days for our staff to process your request.</p>
      </div> 

    </div>
    
  );

  function handleValidationClass(error) {
    if (error) {
      return "is-invalid";
    }
    else {
      return isInitialized ? "is-valid" : null;
    }
  }

}