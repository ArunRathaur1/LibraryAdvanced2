import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLibraryId, setSearchLibraryId] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to fetch orders from backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/library/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Function to handle deletion of an order
  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/library/orders/${id}`);
      setOrders(orders.filter(order => order._id !== id)); // Remove order from state
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  // Filter orders based on search term and libraryId
  const filteredOrders = orders.filter(order =>
    order.bookName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    order.libraryId.toLowerCase().includes(searchLibraryId.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 bg-gradient-to-r from-white-50 to-white-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Ordered Books</h2>

      {/* Search Inputs */}
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Search by Book Name"
          className="border border-gray-300 rounded p-2 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Library ID"
          className="border border-gray-300 rounded p-2 w-full"
          value={searchLibraryId}
          onChange={(e) => setSearchLibraryId(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-3 px-4 border-b border-gray-300 text-left">Book Name</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Author</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Quantity</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Ordered At</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Library ID</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b border-gray-300">{order.bookName}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{order.author}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{order.qty}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{new Date(order.orderedAt).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{order.libraryId}</td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-2 px-4 border-b border-gray-300 text-center" colSpan="6">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewOrders;
