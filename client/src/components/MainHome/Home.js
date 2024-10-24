import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
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
import img16 from '../../assets/slideshow/19.jpg';
import img17 from '../../assets/slideshow/20.jpg';
import img18 from '../../assets/slideshow/21.jpg';
import img19 from '../../assets/slideshow/22.jpg';
import img20 from '../../assets/slideshow/23.jpg';
import img21 from '../../assets/slideshow/24.jpg';
import img22 from '../../assets/slideshow/25.jpg';
import img23 from '../../assets/slideshow/26.jpg';

import cg from '../../assets/Extra/cg.png';
import digital from '../../assets/Extra/digital.png';
import indiagov from '../../assets/Extra/indiagov.png';
import jansampark from '../../assets/Extra/jansampark.png';
import nic from '../../assets/Extra/nic.png';
import police from '../../assets/Extra/police.png';

import cm from '../../assets/People/cm.jpeg';
import ceo from '../../assets/People/ceo.jpeg';
import cto2 from '../../assets/People/collector2.jpeg';
import kedar from '../../assets/People/kedar.jpg';
import maps from '../../assets/People/maps.png';
import logo from '../../assets/People/5.jpeg';
import axios from 'axios';

const images = [img4, img10, img11, img6, img12, img7, img13, img14, img15, img16, img9, img17, img18, img19, img8, img20, img21, img22, img23];

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
          <div  style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)',display:'flex',justifyContent:'center',alignItems:'center' }}>
            <div>
              <h2 className="text-lg mb-4 font-semibold text-black relative z-10" style={{textAlign:"center"}}>Special Contributors</h2>
              <div className="grid grid-cols-2 gap-6 relative z-10 p-4 rounded-lg">
                {[{ img: cm, name: 'Vishnu Deo Sai' }, { img: cto2, name: 'Gaurav Kumar Singh' }, { img: ceo, name: 'Vishwadeep' }, { img: kedar, name: 'Kedar Patel' }].map((contributor, idx) => (
                  <div key={idx} className="text-center">
                    <img src={contributor.img} alt={contributor.name} className="rounded-full border border-gray-200 shadow-md w-24 h-24" />
                    <div className="mt-2 text-black font-medium">{contributor.name}</div>
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

      {/* Clickable Photos with Links Section */}
      <div className="w-full p-6 mt-8 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Visit Other Websites</h2>
        <div className="flex justify-center space-x-4">
          {/* Add clickable photos here */}
          <a href="https://cgstate.gov.in/" target="_blank" rel="noopener noreferrer">
            <img src={cg} alt="Website 1" className="w-30 h-24 object-cover rounded-lg shadow-lg hover:opacity-75" />
          </a>
          <a href="https://www.digitalindia.gov.in/" target="_blank" rel="noopener noreferrer">
            <img src={digital} alt="Website 2" className="w-30 h-24 object-cover rounded-lg shadow-lg hover:opacity-75" />
          </a>
          <a href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer">
            <img src={indiagov} alt="Website 3" className="w-30 h-24 object-cover rounded-lg shadow-lg hover:opacity-75" />
          </a>
          <a href="https://dprcg.gov.in/" target="_blank" rel="noopener noreferrer">
            <img src={jansampark} alt="Website 4" className="w-30 h-24 object-cover rounded-lg shadow-lg hover:opacity-75" />
          </a>
          <a href="https://www.nic.in/" target="_blank" rel="noopener noreferrer">
            <img src={nic} alt="Website 5" className="w-30 h-24 object-cover rounded-lg shadow-lg hover:opacity-75" />
          </a>
          <a href="https://cgpolicehelp.cgstate.gov.in/" target="_blank" rel="noopener noreferrer">
            <img src={police} alt="Website 6" className="w-30 h-24 object-cover rounded-lg shadow-lg hover:opacity-75" />
          </a>
          
        </div>
      </div>

      {/* Footer Section */}
      <footer className="w-full py-6 mt-8 bg-gray-800 text-center text-white">
        <p>&copy; 2024 Chhattisgarh Library Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}
