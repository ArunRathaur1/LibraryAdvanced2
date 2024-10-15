import React, { useState } from 'react';
import Slider from 'react-slick';
import img1 from '../../assets/slideshow/3.jpeg';
import img2 from '../../assets/slideshow/4.jpeg';
import img3 from '../../assets/slideshow/7.jpeg';
import img4 from '../../assets/slideshow/8.jpg';
import img5 from '../../assets/slideshow/9.jpg';
import img6 from '../../assets/slideshow/10.jpg';
import img7 from '../../assets/slideshow/11.jpg';
import img8 from '../../assets/slideshow/12.jpg';
import img9 from '../../assets/slideshow/13.jpg';
import img10 from '../../assets/slideshow/design1.jpeg';
import cm from '../../assets/People/cm.jpeg';
import ceo from '../../assets/People/ceo.jpeg';
import cto2 from '../../assets/People/collector2.jpeg';
import kedar from '../../assets/People/kedar.jpg';

// Sample images for the slideshow
const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10]; 

// List of districts in Chhattisgarh
const districts = [
  'Raipur', 'Bilaspur', 'Durg', 'Korba', 'Rajnandgaon', 'Jagdalpur', 'Dhamtari',
  'Raigarh', 'Kawardha', 'Mahasamund', 'Surguja', 'Balod', 'Baloda Bazar',
  'Bastar', 'Bemetara', 'Bijapur', 'Dantewada', 'Gariaband', 'Janjgir-Champa',
  'Jashpur', 'Kanker', 'Kondagaon', 'Mungeli', 'Narayanpur', 'Sukma'
];

export default function MainHome() {
  const [selectedDistrict, setSelectedDistrict] = useState('');

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

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Slideshow and Additional Images Section */}
      <div className="flex w-full">
        <div className="flex-grow p-2 w-1/2">
          <Slider {...settings}>
            {images.map((img, index) => (
              <div key={index} className="flex justify-center">
                <img src={img} alt={`Slide ${index + 1}`} style={{ width: '1000px', height: '600px' }} />
              </div>
            ))}
          </Slider>
        </div>

        {/* Contributors Section */}
        <div className="w-1/2 p-4 flex flex-col items-center">
          <h2 className="text-lg mb-2">Special Contributors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <img src={cm} alt="Vishnu Deo Sai" style={{ width: '150px', height: '150px' }} />
              <div style={{ textAlign: 'center' }}>Vishnu Deo Sai</div>
            </div>
            <div>
              <img src={cto2} alt="Gaurav Kumar Singh" style={{ width: '150px', height: '150px' }} />
              <div style={{ textAlign: 'center' }}>Gaurav Kumar Singh</div>
            </div>
            <div>
              <img src={ceo} alt="Vishwadeep" style={{ width: '150px', height: '150px' }} />
              <div style={{ textAlign: 'center' }}>Vishwadeep</div>
            </div>
            <div>
              <img src={kedar} alt="Kedar Patel" style={{ width: '150px', height: '150px' }} />
              <div style={{ textAlign: 'center' }}>Kedar Patel</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown for City Selection */}
      <div className="w-full p-6 mt-8 bg-gray-100 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Select a City</h2>
        <select
          value={selectedDistrict}
          onChange={handleDistrictChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        >
          <option value="" disabled>Select a city...</option>
          {districts.map((district, index) => (
            <option key={index} value={district}>{district}</option>
          ))}
        </select>

        {/* Display the selected district */}
        {selectedDistrict && (
          <div className="mt-4 p-4 bg-white rounded shadow text-center">
            <h3 className="text-lg font-semibold">Selected City:</h3>
            <p>{selectedDistrict}</p>
          </div>
        )}
      </div>
    </div>
  );
}
