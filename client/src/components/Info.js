import React from 'react';

const Info = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6 w-full lg:w-3/4 xl:w-2/3">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
          Welcome to JILA GRANTHALAYA BALODABAZAR
        </h1>

        <p className="text-gray-700 text-lg mb-4">
          Located in the heart of Balodabazar, Jila Granthalaya is a prominent library situated beside Chakrapani High School. We are open from Monday to Saturday, welcoming you from <strong>8 AM to 8 PM</strong>.
        </p>

        <h2 className="text-xl font-semibold text-blue-500 mt-6 mb-2">Library Facilities</h2>
        <p className="text-gray-700 mb-4">
          Our library boasts an extensive collection of over <strong>10,000 books</strong> across various genres, ensuring that every reader finds something of interest. We currently have more than <strong>600 enrolled readers</strong>, making us a vibrant community hub.
        </p>

        <h2 className="text-xl font-semibold text-blue-500 mt-6 mb-2">Membership Details</h2>
        <p className="text-gray-700 mb-4">
          To enroll, there is a one-time fee of <strong>₹500</strong>, which grants you lifetime membership. To register, please submit the following:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Two passport-sized photographs</li>
          <li>A photocopy of your Aadhar card</li>
        </ul>

        <h2 className="text-xl font-semibold text-blue-500 mt-6 mb-2">Join Our Community!</h2>
        <p className="text-gray-700 mb-4">
          Become a part of our growing family of book lovers. Whether you’re a student, a professional, or just someone looking to enjoy some quiet reading time, Jila Granthalaya has something for everyone.
        </p>
        <p className="text-gray-700 mb-4">
          We also host regular events, workshops, and reading sessions to encourage a love for reading among all age groups. Stay tuned for our upcoming events!
        </p>

        <p className="text-gray-700 mb-4 text-center">
          We look forward to seeing you at the library!
        </p>

        {/* Library Incharge Section */}
        <h2 className="text-xl font-semibold text-blue-500 mt-6 mb-4 text-center">Library Incharge</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden mb-2">
              <img src="/prabhari.jpg" alt="Incharge" className="w-full h-full object-cover" />
            </div>
            <p className="text-gray-700 font-semibold">Head Incharge</p>
            <p className="text-gray-600">Dakeshwar Verma</p>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden mb-2">
              <img src="/sir2.jpg" alt="Librarian" className="w-full h-full object-cover" />
            </div>
            <p className="text-gray-700 font-semibold">Librarian</p>
            <p className="text-gray-600">Manohar Verma</p>
          </div>
        </div>

        {/* Helpers Section */}
        <h2 className="text-xl font-semibold text-blue-500 mt-6 mb-4 text-center">Helpers</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden mb-2">
              <img src="/jitendra.jpg" alt="Helper 1" className="w-full h-full object-cover" />
            </div>
            <p className="text-gray-600">Jitendra Verma</p>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden mb-2">
              <img src="/nikhil2.jpg" alt="Helper 2" className="w-full h-full object-cover" />
            </div>
            <p className="text-gray-600">Nikhil Kurre</p>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden mb-2">
              <img src="/dai.jpg" alt="Helper 3" className="w-full h-full object-cover" />
            </div>
            <p className="text-gray-600">Meena Verma</p>
          </div>
        </div>

        {/* Library Insights Section */}
        <h2 className="text-xl font-semibold text-blue-500 mt-6 mb-4 text-center">Library Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* First row with 3 pictures */}
          <div className="bg-gray-300 h-48 flex flex-col items-center justify-center relative">
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: "url('/maingate2.jpg')" }}
            />
            <p className="absolute bottom-0 left-0 right-0 text-gray-600 text-center bg-white opacity-80 p-2">Main Gate</p>
          </div>
          <div className="bg-gray-300 h-48 flex flex-col items-center justify-center relative">
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: "url('/inside.jpg')" }}
            />
            <p className="absolute bottom-0 left-0 right-0 text-gray-600 text-center bg-white opacity-80 p-2">Reading Area</p>
          </div>
          <div className="bg-gray-300 h-48 flex flex-col items-center justify-center relative">
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: "url('/books.jpg')" }}
            />
            <p className="absolute bottom-0 left-0 right-0 text-gray-600 text-center bg-white opacity-80 p-2">Book Display</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Second row with 4 pictures */}
          <div className="bg-gray-300 h-48 flex flex-col items-center justify-center relative">
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: "url('/hall.jpg')" }}
            />
            <p className="absolute bottom-0 left-0 right-0 text-gray-600 text-center bg-white opacity-80 p-2">Main Hall</p>
          </div>
          <div className="bg-gray-300 h-48 flex flex-col items-center justify-center relative">
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: "url('/discussion.jpg')" }}
            />
            <p className="absolute bottom-0 left-0 right-0 text-gray-600 text-center bg-white opacity-80 p-2">Discussion Room</p>
          </div>
          <div className="bg-gray-300 h-48 flex flex-col items-center justify-center relative">
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: "url('/bahar.jpg')" }}
            />
            <p className="absolute bottom-0 left-0 right-0 text-gray-600 text-center bg-white opacity-80 p-2">Entrance</p>
          </div>
          <div className="bg-gray-300 h-48 flex flex-col items-center justify-center relative">
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: "url('/office.jpg')" }}
            />
            <p className="absolute bottom-0 left-0 right-0 text-gray-600 text-center bg-white opacity-80 p-2">Office</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
