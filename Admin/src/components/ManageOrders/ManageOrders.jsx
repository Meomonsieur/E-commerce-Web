import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageOrders.css';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:4000/users/orders', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
                    },
                });
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const handleDelete = async (orderId) => {
        try {
            await axios.delete(`http://localhost:4000/users/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
                },
            });
            setOrders(orders.filter(order => order._id !== orderId));
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await axios.put(`http://localhost:4000/users/orders/${orderId}`, {
                status: newStatus,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
                },
            });
            setOrders(orders.map(order => order._id === orderId ? response.data.order : order));
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <div className="manage-orders">
            <h1>Manage Orders</h1>
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>User</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.userName || 'Unknown'}</td>
                            <td>${order.totalAmount}</td>
                            <td>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(order._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageOrders;