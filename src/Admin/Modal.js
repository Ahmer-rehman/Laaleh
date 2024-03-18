import React from 'react';
import "./Style/OrderManagement.css"

const Modal = ({ order, closeModal }) => {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Order Details</h2>
                    <button onClick={closeModal}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="order-details">
                        <img src={order.productImage} alt="Product" />
                        <div>
                            <p><strong>Customer Name:</strong> {order.customerName}</p>
                            <p><strong>Product Name:</strong> {order.productName}</p>
                            <p><strong>Product ID:</strong> {order.productId}</p>
                            <p><strong>Quantity:</strong> {order.quantity}</p>
                            <p><strong>Total Price:</strong> {order.totalPrice}</p>
                            <p><strong>address:</strong> {order.address}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
