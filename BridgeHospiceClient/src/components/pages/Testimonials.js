import React from 'react';
import ImgTestimonials from '../../static/CardTestimonials.png';


export default function Testimonials() {
  return (
    <div className="container shadow">
      <div style={{height: 10}}></div>
      <h2 className="text-center bg-primary text-white py-4">Testimonials</h2>

      <div className="row">
        <div className="col text-center">
          <h3>Attach facebook feed here</h3>
        </div>

        <div className="col d-flex">
          <div className="mx-auto"><img src={ImgTestimonials} alt="The Greatest Example of Love is a heart of service."/></div>
        </div>
      </div>

      <div style={{height: 10}}></div>

    </div>
  );
}