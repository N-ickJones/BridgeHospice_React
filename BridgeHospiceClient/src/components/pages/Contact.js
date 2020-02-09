import React from 'react';

export default function Contact() {
  return (
    <div className="container shadow">
      <br/>
      <h2 className="text-center bg-primary text-white py-4">Contact Information</h2>

      <div className="row">
        <div className="col-12 col-lg text-center p-3">
          <h3>Bridge Hospice Main Address</h3>
          <h4>8212 Ithaca Suite W2</h4>
          <h4>Lubbock, Tx 79423</h4>
          <br/>

          <h4>Phone: <a href="tel:+8069333900">(806) 993-3900</a></h4>
          <h4>Fax: &nbsp;&nbsp;&nbsp;&nbsp;(806) 993-3899</h4>
          <h4>Email: <a href="mailto:support@bridge-hospice.com">support@bridge-hospice.com</a></h4>
          <br/>

          <h4>Hours of Operations</h4>
          <h4>24 hours / 7 days a week</h4>
          <br/>

          <h4>Office Hours</h4>
          <h4>Monday to Friday</h4>
          <h4>9:00 AM - 5:00 PM</h4>
          <br/>

          <h3>Website Related Inquiries</h3>
          <h4>Email: <a href="mailto:webmaster@bridge-hospice.com">webservices@bridge-hospice.com</a></h4>
        </div>
        {/*
        <div className="col-12 col-lg d-flex align-items-center p-3">
          <div className="m-auto"><img src="https://via.placeholder.com/434x382" className="img-fluid" alt="Contact Us abstract"/></div>
        </div>
        */}
      </div>

    </div>
  );
}