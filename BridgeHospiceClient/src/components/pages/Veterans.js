import React, {useState, useEffect, useRef} from 'react';
import VeteranBanner from '../../static/Veteran_Banner.jpg';

export default function Veterans() {
  const randomStart = getRandomInt(1);

  const carouselRef = useRef(null);
  const bannerRef = useRef(null);
  const [state, setState] = useState({ width: 0, margin: 0 });
  function handleResize() {
    setState({ width: carouselRef.current.clientWidth/2, margin: -(bannerRef.current.clientHeight/2) });
  }
  useEffect(() => {
    window.addEventListener('resize', handleResize());
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize());
    };
  }, []);
  
  return (
    <div className="container shadow p-3 rounded">
      <h1 className="text-center bg-secondary text-primary py-3 rounded">Veterans Portal</h1>

      {/* Veteran Carousel */}
      <div className="carousel slide" data-ride="carousel" ref={carouselRef}>
        <div className="carousel-inner rounded">
          <div className={getClass(1)} data-interval="20000">
              <img src="https://via.placeholder.com/2592x1728" className="d-block w-100" alt="Customer Satisfaction Cascade 1" />
          </div>
        </div>
      </div>

      {/* Veteran Banner */}
      <div className="text-center" style={{position: "relative", marginTop: state.margin}}>
          <img onLoad={() => handleResize()} ref={bannerRef} src={VeteranBanner} className="img-fluid rounded" style={{maxWidth: "400px", width: state.width}} alt="On behalf of VALOR, the veterans division of bridge hospice, thank you for your service." />
      </div>

      {/* Testimonials */}
      <hr />
      <div className="row p-3">
        <div className="col my-auto">
          <p className="">
            At Bridge Hospice, we have created a division named <b>VALOR</b> dedicated to our United States Veterans. 
            We believe that we owe our veterans a debt of gratitude for their service, both in war and in peacetime.
            <br /><br />
            In everything we do, we strive to honor their selfless contributions to the strength of our nation.
            <br /><br />
            At Bridge Hospice, we extend love, comfort, and care to our men and women who have served and their families. 
            It is our sincere honor to care for our United States Veterans.
          </p>
        </div>
      </div>
      <hr />

      <p className="font-weight-bold">Note: Testimonials Will be Removed from Production until ready.</p>
      <div className="row p-3">
        <h2 className="col-12 text-center bg-secondary text-primary py-3 rounded">Testimonials</h2>
        <div className="row p-3 testimonial">
          <div className="col-12 col-md my-auto">
            <p className="">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          <div className="col-12 col-md my-auto">
            <div className="col-12 col-lg d-flex align-items-center p-3">
              <div className="m-auto"><img src="https://via.placeholder.com/434x382" className="img-fluid" alt="VetTest01"/></div>
            </div>
          </div>
        </div>

        <div className="row p-3 testimonial">
          <div className="col-12 col-md my-auto">
            <p className="">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          <div className="col-12 col-md my-auto">
            <div className="col-12 col-lg d-flex align-items-center p-3">
              <div className="m-auto"><img src="https://via.placeholder.com/434x382" className="img-fluid" alt="VetTest01"/></div>
            </div>
          </div>
        </div>
        <hr />

        <div className="row p-3 testimonial">
          <div className="col-12 col-md my-auto">
            <p className="">
            Ac ut consequat semper viverra nam. Pretium fusce id velit ut tortor pretium. Tristique senectus et netus et malesuada fames ac turpis egestas. Sit amet dictum sit amet. Id diam maecenas ultricies mi eget mauris pharetra. Vulputate mi sit amet mauris. Varius quam quisque id diam vel quam elementum pulvinar etiam. Faucibus a pellentesque sit amet porttitor eget dolor morbi non. Elit pellentesque habitant morbi tristique. Aliquam nulla facilisi cras fermentum odio eu feugiat pretium nibh. Posuere sollicitudin aliquam ultrices sagittis orci a. Sed augue lacus viverra vitae congue eu consequat.
            </p>
          </div>
          <div className="col-12 col-md my-auto">
            <div className="col-12 col-lg d-flex align-items-center p-3">
              <div className="m-auto"><img src="https://via.placeholder.com/434x382" className="img-fluid" alt="VetTest01"/></div>
            </div>
          </div>
        </div>
        <hr />

        <div className="row p-3 testimonial">
          <div className="col-12 col-md my-auto">
            <p className="">
            Sed faucibus turpis in eu. Ipsum dolor sit amet consectetur. Ac turpis egestas sed tempus urna et. Metus aliquam eleifend mi in nulla posuere sollicitudin. Sed velit dignissim sodales ut. Enim lobortis scelerisque fermentum dui faucibus. Quis blandit turpis cursus in. At volutpat diam ut venenatis tellus in metus. Facilisis sed odio morbi quis. Fames ac turpis egestas integer eget aliquet nibh praesent tristique. Nunc sed augue lacus viverra vitae.
            </p>
          </div>
          <div className="col-12 col-md my-auto">
            <div className="col-12 col-lg d-flex align-items-center p-3">
              <div className="m-auto"><img src="https://via.placeholder.com/434x382" className="img-fluid" alt="VetTest01"/></div>
            </div>
          </div>
        </div>
        <hr />

      </div>

    </div>
  );

  //Functions 
  function getClass(position) {
    if (position === randomStart) {
      return "carousel-item active";
    }
    else {
      return "carousel-item";
    }
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
  }

  /*
  function useDimensionsById(ref) {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    useEffect(() => {
      async function handleInitalResize() {
        setWidth(await getWidth());
        setHeight(await getHeight());
      }
      function handleResize() {
        setWidth(ref.current.offsetWidth);
        setHeight(ref.current.offsetHeight);
      }
      function getHeight() { 
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(ref.current.offsetHeight);
         }, 1);
        });
      }
      function getWidth() { 
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(ref.current.offsetWidth);
          }, 250);
        });
      }
      handleInitalResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    });
    return [width, height];
  }
  */

}