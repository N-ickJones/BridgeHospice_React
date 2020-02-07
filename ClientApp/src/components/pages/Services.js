import React from 'react';

export default function Services() {
  return (
    <div className="container shadow">
      <div style={{height: 10}}></div>
      <h2 className="text-center bg-primary text-white py-4">Services</h2>

      <div className="row">
        <div className="col-12 col-lg p-3">
          <ul className="">
            <li>Pre-Admission Consultation</li>
            <li>Hospice Nursing Care</li>
            <li>Hospice Physician/Medical Director</li>
            <li>Hospice Aides for Personal Care</li>
            <li>Social Work and Pastoral Care</li>
            <li>Therapists and Counseling</li>
            <li>Trained Volunteers</li>
            <li>Pain and Symptom Management</li>
            <li>Pharmacy Consultation/Services</li>
            <li>Medical Equipment and Supplies</li>
            <li>Available 24 Hours, 7 Days a Week</li>
            <li>Bereavement Program 13 months after death</li>
            <li>Respite or Inpatient Care if needed*</li>
            <li>Continous Care Requiring Intense Intervention*</li>
          </ul>
          <p className="ml-4">*eligibility required</p>
        </div>

        <div className="col-12 col-lg d-flex align-items-center p-3">
          <div className="m-auto"><img src="https://via.placeholder.com/434x382" className="img-fluid" alt="The Greatest Example of Love is a heart of service."/></div>
        </div>
      </div>
    </div>
  );
}