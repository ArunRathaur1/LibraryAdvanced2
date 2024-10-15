import React from 'react';
import Slider from 'react-slick';
import img1 from '../../assets/slideshow/3.jpeg';
import img2 from '../../assets/slideshow/4.jpeg';
import img3 from '../../assets/slideshow/7.jpeg';
import img4 from '../../assets/slideshow/8.jpg'; // Add more image imports as needed
import img5 from '../../assets/slideshow/9.jpg'; // Example of more images
import img6 from '../../assets/slideshow/10.jpg';
import img7 from '../../assets/slideshow/11.jpg';
import img8 from '../../assets/slideshow/12.jpg';
import img9 from '../../assets/slideshow/13.jpg';
import img10 from '../../assets/slideshow/design1.jpeg'; 
import cm from '../../assets/People/cm.jpeg';
import ceo from '../../assets/People/ceo.jpeg';
import cto2 from '../../assets/People/collector2.jpeg';
import kedar from '../../assets/People/kedar.jpg';
// import kedar from '../../../public/kedar.jpg';
// Sample images for the slideshow
const images = [img1, img2, img3, img4, img5, img6,img7,img8,img9,img10]; // Include all your images here

export default function MainHome() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true, // Enable auto play
    autoplaySpeed: 3000, // Set the time interval for each slide
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="min-h-screen flex">
      {/* Slideshow Section */}
      <div className="flex-grow p-2 w-1/2"> {/* Set width to half */}
        <Slider {...settings}>
          {images.map((img, index) => (
            <div key={index} className="flex justify-center">
              <img src={img} alt={`Slide ${index + 1}`} style={{width:'1000px',height:'600px'}} />
            </div>
          ))}
        </Slider>
      </div>

      {/* Additional Images Section */}
      <div className="w-1/2 p-2 flex flex-col items-center">
        {/* Placeholder for additional images */}
        <h2 className="text-lg mb-2">Importent People </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
          <img src={cm} alt="Additional Image 2" className="" style={{width:'300px',height:"300px"}} />
          <div style={{textAlign:'center'}}>Name1</div>
          </div>
          <div>
          <img src={cto2} alt="Additional Image 3" style={{width:'300px',height:"300px"}} />
          <div style={{textAlign:'center'}}>Name1</div>
          </div>
          <div>
          <img src={ceo}alt="Additional Image 4" style={{width:'300px',height:"300px"}} />
          <div style={{textAlign:'center'}}>Name1</div>
          </div>
          <div>
          <img src={kedar}alt="Additional Image 4" style={{width:'300px',height:"300px"}} />
          <div style={{textAlign:'center'}}>Name1</div>
          </div>
        </div>
      </div>
    </div>
  );
}
