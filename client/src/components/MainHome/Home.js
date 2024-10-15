import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import img1 from '../../assets/slideshow/3.jpeg';
import img2 from '../../assets/slideshow/4.jpeg';
import img3 from '../../assets/slideshow/7.jpeg';
import img4 from '../../assets/slideshow/8.jpg';
import img5 from '../../assets/slideshow/9.jpg'; // This will be used as the logo in the footer
import img6 from '../../assets/slideshow/10.jpg';
import img7 from '../../assets/slideshow/11.jpg';
import img8 from '../../assets/slideshow/12.jpg';
import img9 from '../../assets/slideshow/13.jpg';
import img10 from '../../assets/slideshow/design1.jpeg';
import cm from '../../assets/People/cm.jpeg';
import ceo from '../../assets/People/ceo.jpeg';
import cto2 from '../../assets/People/collector2.jpeg';
import kedar from '../../assets/People/kedar.jpg';
import maps from '../../assets/People/maps.png';
import logo from '../../assets/People/5.jpeg';

const images = [img1, img2, img3, img4, img6, img7, img8, img9, img10];

const districts = [
  'Raipur', 'Bilaspur', 'Durg', 'Korba', 'Rajnandgaon', 'Jagdalpur', 'Dhamtari',
  'Raigarh', 'Kawardha', 'Mahasamund', 'Surguja', 'Balod', 'Baloda Bazar',
  'Bastar', 'Bemetara', 'Bijapur', 'Dantewada', 'Gariaband', 'Janjgir-Champa',
  'Jashpur', 'Kanker', 'Kondagaon', 'Mungeli', 'Narayanpur', 'Sukma'
];

export default function MainHome() {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const handleNext = () => {
    sliderRef.current.slickNext();
  };

  const handlePrevious = () => {
    sliderRef.current.slickPrev();
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      {/* Slideshow and Additional Images Section */}
      <div className="flex w-full py-8">
        <div className="flex-grow p-2 w-1/2 relative">
          <Slider ref={sliderRef} {...settings}>
            {images.map((img, index) => (
              <div key={index} className="flex justify-center">
                <img src={img} alt={`Slide ${index + 1}`} className="rounded-lg shadow-lg" style={{ width: '1000px', height: '600px' }} />
              </div>
            ))}
          </Slider>

          {/* Navigation Buttons */}
          <button
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700"
            onClick={handlePrevious}
          >
            &#9664;
          </button>
          <button
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700"
            onClick={handleNext}
          >
            &#9654;
          </button>
        </div>

        {/* Contributors Section */}
        <div
          className="w-1/2 p-4 flex flex-col items-center bg-white rounded-lg shadow-lg relative overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: `url(${maps})`, // Background image for the contributors section
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div> {/* Semi-transparent overlay */}
          <h2 className="text-lg mb-4 font-semibold text-white relative z-10">Special Contributors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
            <div className="text-center">
              <img
                src={cm}
                alt="Vishnu Deo Sai"
                className="rounded-full border border-gray-200 shadow-md"
                style={{ width: '150px', height: '150px' }}
              />
              <div className="mt-2 text-white font-medium">Vishnu Deo Sai</div>
            </div>
            <div className="text-center">
              <img
                src={cto2}
                alt="Gaurav Kumar Singh"
                className="rounded-full border border-gray-200 shadow-md"
                style={{ width: '150px', height: '150px' }}
              />
              <div className="mt-2 text-white font-medium">Gaurav Kumar Singh</div>
            </div>
            <div className="text-center">
              <img
                src={ceo}
                alt="Vishwadeep"
                className="rounded-full border border-gray-200 shadow-md"
                style={{ width: '150px', height: '150px' }}
              />
              <div className="mt-2 text-white font-medium">Vishwadeep</div>
            </div>
            <div className="text-center">
              <img
                src={kedar}
                alt="Kedar Patel"
                className="rounded-full border border-gray-200 shadow-md"
                style={{ width: '150px', height: '150px' }}
              />
              <div className="mt-2 text-white font-medium">Kedar Patel</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown for City Selection */}
      <div className="w-full p-6 mt-8 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Select a City</h2>
        <select
          value={selectedDistrict}
          onChange={handleDistrictChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          <option value="" disabled>Select a city...</option>
          {districts.map((district, index) => (
            <option key={index} value={district}>{district}</option>
          ))}
        </select>

        {/* Display the selected district */}
        {selectedDistrict && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow text-gray-700">
            <h3 className="text-lg font-semibold">Selected City:</h3>
            <p>{selectedDistrict}</p>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <footer className="w-full py-4 mt-12 bg-gray-800 text-white flex items-center justify-center">
        <img src={logo} alt="CG Government Logo" className="w-10 h-10 mr-2" />
        <p className="text-sm">All rights reserved by Chhattisgarh Government © 2024</p>
      </footer>
    </div>
  );
}
