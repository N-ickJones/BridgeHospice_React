import React from 'react';
import ImgAbout from '../../static/CardAbout.png';

export default function About() {
  return (
    <div className="container shadow">
      <div style={{height: 10}}></div>
      <h2 className="text-center bg-primary text-white py-4">About Us</h2>

      <div className="row">
        <div className="col" style={{fontSize: "1.1rem"}}>
            <p>Since 2005, our staff has been attending to medical, emotional, and spiritual needs of patients who are in end-of-life care.</p>
            <p>The hospice philosophy affirms death as a natural part of life, seeking neither to hasten nor prolong the dying process.</p>
            <p>Skilled staff and volunteers are Bridge Hospice offer a grace-filled approach in caring for the terminally ill and their families, meeting the patient's meical needs and providing emotional, spirital, and social support for family members.</p>
            <p>Bridge Hospice nurses have training and experience in dealing with special needs of the terminally ill, and with our services a hospice nurse is always on call 24 hours a day, seven days a week.</p>
        </div>

        <div className="col d-flex">
          <div className="mx-auto"><img src={ImgAbout} alt="Caring is giving from the heart"/></div>
        </div>
      </div>
    </div>
  );
}