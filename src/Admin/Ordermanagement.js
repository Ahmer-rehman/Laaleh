import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, updateDoc, doc, getDocs } from 'firebase/firestore';
import Modal from './Modal';
import "./Style/OrderManagement.css"
import app from './Firebase/Firebase';

const OrderManagement = () => {
    const [pendingOrders, setPendingOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const pendingQuery = query(collection(db, 'orders'), where('status', '==', 'pending'));
                const completedQuery = query(collection(db, 'orders'), where('status', '==', 'completed'));

                const pendingSnapshot = await getDocs(pendingQuery);
                const completedSnapshot = await getDocs(completedQuery);

                const pendingOrdersData = pendingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const completedOrdersData = completedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setPendingOrders(pendingOrdersData);
                setCompletedOrders(completedOrdersData);
            } catch (error) {
                console.error('Error fetching orders: ', error);
            }
        };

        fetchOrders();
    }, [db]);

    const handleUpdateStatus = async (id) => {
        try {
            await updateDoc(doc(db, 'orders', id), { status: 'completed' });
            const updatedPendingOrders = pendingOrders.filter(order => order.id !== id);
            setPendingOrders(updatedPendingOrders);
        } catch (error) {
            console.error('Error updating order status: ', error);
        }
    };

    const openModal = (order) => {
        setSelectedOrder(order);
    };

    const closeModal = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="order-management">
            <h1>Order Management</h1>

            <div className="orders">
                <div className="pending-orders">
                    <h2>Pending Orders</h2>
                    {pendingOrders.map(order => (
                        <div key={order.id} className="order-item">
                            <p>Order ID: {order.id}</p>
                            <p>Status: {order.status}</p>
                            <button onClick={() => handleUpdateStatus(order.id)}>Mark as Completed</button>
                            <button onClick={() => openModal(order)}>View Details</button>
                        </div>
                    ))}
                </div>

                <div className="completed-orders">
                    <h2>Completed Orders</h2>
                    {completedOrders.map(order => (
                        <div key={order.id} className="order-item">
                            <p>Order ID: {order.id}</p>
                            <p>Status: {order.status}</p>
                            <button onClick={() => openModal(order)}>View Details</button>
                        </div>
                    ))}
                </div>
            </div>

            {selectedOrder && <Modal order={selectedOrder} closeModal={closeModal} />}
        </div>
    );
};

export default OrderManagement;
