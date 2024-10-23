import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/library/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-4 md:p-6 bg-gradient-to-r from-white-50 to-white-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Ordered Books</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-3 px-4 border-b border-gray-300 text-left">Book Name</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Author</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Quantity</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left">Ordered At</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b border-gray-300">{order.bookName}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{order.author}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{order.qty}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{new Date(order.orderedAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-2 px-4 border-b border-gray-300 text-center" colSpan="4">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewOrders;