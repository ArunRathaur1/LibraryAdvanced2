import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx'; // Import XLSX library
import Cookies from 'js-cookie';

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Function to fetch all orders
  const fetchOrders = async () => {
    const token = Cookies.get('authToken'); // Get the token from cookies

    if (!token) {
      setError('Authentication token is missing. Please login again.');
      return;
    }

    try {
      setLoading(true);
      setError(''); // Clear previous errors

      const response = await fetch('http://localhost:5000/library/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`, // Pass the token in the Authorization header
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders.');
      }

      const data = await response.json();
      setOrders(data);

    } catch (error) {
      setError(error.message); // Display the error message in the UI
      console.log('Error fetching orders:', error.message); // Log error for debugging

    } finally {
      setLoading(false); // Stop the loading indicator
    }
  };

  // Function to export orders data to Excel
  const exportToExcel = () => {
    const filteredOrders = orders.map(({ __v, _id, ...rest }) => rest); // Remove unwanted fields
    const worksheet = XLSX.utils.json_to_sheet(filteredOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders_data.xlsx");
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  // Handle search
  const filteredOrders = orders.filter(order => 
    order.bookName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {loading && <div>Loading...</div>}
      {!loading && (
        <div className="p-4 md:p-6 bg-gradient-to-r from-green-50 to-green-100">
          <h1 className="text-xl md:text-2xl font-bold mb-4">Ordered Books</h1>

          {/* Search section */}
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Search by book name"
              className="border border-gray-300 p-2 rounded w-full md:w-1/3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={exportToExcel}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 ml-4"
            >
              Download Orders Data
            </button>
          </div>

          {/* Table displaying orders */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="text-left p-2 border-b">Book Name</th>
                  <th className="text-left p-2 border-b">Author</th>
                  <th className="text-left p-2 border-b">Quantity</th>
                  <th className="text-left p-2 border-b">Ordered On</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <tr key={index}>
                      <td className="p-2 border-b">{order.bookName}</td>
                      <td className="p-2 border-b">{order.author}</td>
                      <td className="p-2 border-b">{order.qty}</td>
                      <td className="p-2 border-b">{new Date(order.orderedAt).toLocaleDateString()}</td> {/* Only display date */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-2 border-b text-center" colSpan="4">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOrders;
