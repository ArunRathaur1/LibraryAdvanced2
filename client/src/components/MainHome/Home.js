import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
// import img1 from '../../assets/slideshow/3.jpeg';
// import img2 from '../../assets/slideshow/4.jpeg';
// import img3 from '../../assets/slideshow/7.jpeg';
import img4 from '../../assets/slideshow/8.jpg';
import img5 from '../../assets/slideshow/9.jpg';
import img6 from '../../assets/slideshow/10.jpg';
import img7 from '../../assets/slideshow/11.jpg';
import img8 from '../../assets/slideshow/12.jpg';
import img9 from '../../assets/slideshow/13.jpg';
import img10 from '../../assets/slideshow/design1.jpeg';
import img11 from '../../assets/slideshow/14.jpg';
import img12 from '../../assets/slideshow/15.jpg';
import img13 from '../../assets/slideshow/16.jpg';
import img14 from '../../assets/slideshow/17.jpg';
import img15 from '../../assets/slideshow/18.jpg';
import img16 from '../../assets/slideshow/13.jpg';
import cm from '../../assets/People/cm.jpeg';
import ceo from '../../assets/People/ceo.jpeg';
import cto2 from '../../assets/People/collector2.jpeg';
import kedar from '../../assets/People/kedar.jpg';
import maps from '../../assets/People/maps.png';
import logo from '../../assets/People/5.jpeg';
import axios from 'axios';

const images = [img4, img6, img7, img8, img9, img10,img11,img12,img13,img14,img15,img16];

const districts = [
  'Raipur', 'Bilaspur', 'Durg', 'Korba', 'Rajnandgaon', 'Jagdalpur', 'Dhamtari',
  'Raigarh', 'Kawardha', 'Mahasamund', 'Surguja', 'Balod', 'Baloda Bazar',
  'Bastar', 'Bemetara', 'Bijapur', 'Dantewada', 'Gariaband', 'Janjgir-Champa',
  'Jashpur', 'Kanker', 'Kondagaon', 'Mungeli', 'Narayanpur', 'Sukma'
];

export default function MainHome() {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [libraries, setLibraries] = useState([]);
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

  const handleDistrictChange = async (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);

    try {
      const response = await axios.get(`http://localhost:5000/library/libraries?city=${district}`);
      setLibraries(response.data); 
    } catch (error) {
      console.error('Error fetching libraries:', error);
    }
  };

  const handleNext = () => {
    sliderRef.current.slickNext();
  };

  const handlePrevious = () => {
    sliderRef.current.slickPrev();
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-50 to-white">
      {/* Introduction Section */}
      <div className="w-full py-12 bg-gradient-to-r from-blue-500 to-green-500 text-white text-center shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Welcome to Chhattisgarh Library Portal</h1>
        <p className="max-w-3xl mx-auto text-lg">
          Discover a vast collection of books and resources from libraries across Chhattisgarh. Our platform aims to make knowledge accessible to everyone, 
          enabling you to search, explore, and connect with libraries in your city.
        </p>
      </div>

      {/* Slideshow and Contributors Section */}
      <div className="flex flex-col lg:flex-row w-full py-8 px-4 gap-8">
        {/* Slideshow */}
        <div className="flex-grow p-2 lg:w-1/2 relative">
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
  className="flex-grow p-4 lg:w-1/2 rounded-lg shadow-lg text-white"
  style={{ backgroundImage: `url(${maps})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
>

  
  {/* Add translucent background with rgba */}
  <div  style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)',display:'flex',justifyContent:'center',alignItems:'center' }}>
    <div>
    <h2 className="text-lg mb-4 font-semibold text-black relative z-10" style={{textAlign:"center"}}>Special Contributors</h2>
    <div className="grid grid-cols-2 gap-6 relative z-10 p-4 rounded-lg">
    {[{ img: cm, name: 'Vishnu Deo Sai' }, { img: cto2, name: 'Gaurav Kumar Singh' }, { img: ceo, name: 'Vishwadeep' }, { img: kedar, name: 'Kedar Patel' }].map((contributor, idx) => (
      <div key={idx} className="text-center">
        <img src={contributor.img} alt={contributor.name} className="rounded-full border border-gray-200 shadow-md w-24 h-24" style={{ opacity: 1 }} />
        <div className="mt-2 text-black font-medium" style={{ opacity: 1 }}>{contributor.name}</div>
      </div>
    ))}
    </div>
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

        {/* Display libraries of the selected district */}
        {libraries.length > 0 ? (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow text-gray-700">
            <h3 className="text-lg font-semibold">Libraries in {selectedDistrict}:</h3>
            <ul>
              {libraries.map((library, index) => (
                <li key={index} className="mt-2">
                  <span className="font-medium">{library.libraryName}</span> - <span className="text-gray-500">ID: {library.uniqueId}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : selectedDistrict && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow text-gray-700">
            <p>No libraries found in {selectedDistrict}.</p>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <footer className="w-full py-4 mt-12 bg-gray-800 text-white flex flex-col items-center justify-center">
        <img src={logo} alt="CG Government Logo" className="w-12 h-12 mb-2" />
        <p className="text-sm">All rights reserved by Chhattisgarh Government © 2024</p>
      </footer>
    </div>
  );
}
