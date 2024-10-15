import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-500 min-h-screen " style={{zIndex:"-1"}} >
      {/* Hero Section */}
      <div >
<div class="bg-gray-100 py-16">
  <div class="container mx-auto flex flex-col-reverse lg:flex-row items-center px-4">
    <div class="lg:w-1/2 flex flex-col items-start lg:items-start text-center lg:text-left">
      <h1 class="text-4xl font-bold text-gray-800 leading-tight mb-4">Welcome to the Digital Library</h1>
      <p class="text-gray-600 mb-6">Discover a world of knowledge at your fingertips. Access thousands of books, articles, and resources from anywhere, anytime.</p>
      <Link to='/booksearch'><button class="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300">Explore the Library</button></Link>
    </div>
    <div class="lg:w-1/2 mb-8 lg:mb-0">
      <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=700&q=60" alt="Library Image" class="rounded-lg shadow-lg"/>
    </div>
  </div>
</div>

      </div>
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Why Choose Jila Granthalaya?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-8 bg-gray-100 shadow-xl rounded-xl transform hover:scale-105 transition">
              <img
                src="https://img.icons8.com/ios-filled/100/000000/book.png"
                alt="Vast Collection"
                className="mx-auto mb-6"
              />
              <h3 className="text-2xl font-semibold text-gray-800">Vast Collection</h3>
              <p className="text-gray-600 mt-4">
                Explore thousands of books across various genres, from fiction to research papers.
              </p>
            </div>
            <div className="text-center p-8 bg-gray-100 shadow-xl rounded-xl transform hover:scale-105 transition">
              <img
                src="https://img.icons8.com/clouds/100/000000/reading.png"
                alt="Comfortable Sitting"
                className="mx-auto mb-6"
              />
              <h3 className="text-2xl font-semibold text-gray-800">Comfortable Sitting</h3>
              <p className="text-gray-600 mt-4">
                Relax and enjoy reading in our cozy and quiet spaces designed for your comfort.
              </p>
            </div>
            <div className="text-center p-8 bg-gray-100 shadow-xl rounded-xl transform hover:scale-105 transition">
              <img
                src="https://img.icons8.com/clouds/100/000000/support.png"
                alt="Advanced Facilities"
                className="mx-auto mb-6"
              />
              <h3 className="text-2xl font-semibold text-gray-800">Advanced Public Facilities</h3>
              <p className="text-gray-600 mt-4">
                Enjoy Wi-Fi, water cooler, and more in our library. Perfect for study and work!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-purple-500 to-teal-400 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">Start Your Reading Journey</h2>
          <p className="text-xl mb-8">
            Join us to explore a world of knowledge, borrow books, and connect with fellow readers.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
  <div className="container mx-auto px-6 text-center">
    <p className="mb-4">&copy; 2024 Jila Granthalaya. All Rights Reserved.</p>
    <p>
      <a
        href="https://maps.app.goo.gl/4j1uxy8NepLz4ShJ8"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-yellow-300 transition"
      >
        Find Our Location
      </a>
    </p>

    {/* New Heading */}
    <h2 className="mt-6 text-lg font-semibold">Project Done By</h2>

    {/* Images Section */}
    <div className="flex justify-center mt-4">
      <div className="relative mx-4 group">
        <img
          src="/indresh.jpg" // Replace with your image path
          alt="Indresh Verma"
          className="w-16 h-16 object-cover rounded-full transition duration-300 ease-in-out transform hover:scale-105"
        />
        <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-gray-900 text-white rounded px-2 text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:translate-y-0 -translate-y-4">
          Indresh Verma
        </span>
      </div>

      <div className="relative mx-4 group">
        <img
          src="/arun.jpg" // Replace with your image path
          alt="Arun Rathaur"
          className="w-16 h-16 object-cover rounded-full transition duration-300 ease-in-out transform hover:scale-105"
        />
        <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-gray-900 text-white rounded px-2 text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:translate-y-0 -translate-y-4">
          Arun Rathaur
        </span>
      </div>
    </div>
  </div>
</footer>




    </div>
  );
}

export default Home;
