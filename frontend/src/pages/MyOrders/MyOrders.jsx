import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  // Status progression for active orders
  const STATUS_PROGRESSION = [
    "Placed",
    "Preparing",
    "Ready for Pickup",
    "Out for Delivery",
    "Delivered"
  ];

  // Normalize legacy statuses
  const normalizeStatus = (status) => {
    const legacyMap = {
      "Food Processing": "Placed",
      "Out for delivery": "Out for Delivery"
    };
    return legacyMap[status] || status;
  };

  // Get status index in progression
  const getStatusIndex = (status) => {
    const normalized = normalizeStatus(status);
    return STATUS_PROGRESSION.indexOf(normalized);
  };

  // Get status badge color class
  const getStatusBadgeClass = (status) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case "Placed":
        return "status-placed";
      case "Preparing":
        return "status-preparing";
      case "Ready for Pickup":
        return "status-ready";
      case "Out for Delivery":
        return "status-out";
      case "Delivered":
        return "status-delivered";
      case "Cancelled":
        return "status-cancelled";
      default:
        return "status-default";
    }
  };

  const fetchOrders = async () => {
    const response = await axios.post(
      url + "/api/order/userorders",
      {},
      { headers: { token } }
    );
    if (response.data.success) {
      setData(response.data.data);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);
  return (
    <div className="my-orders">
      <h2>Orders</h2>
      <div className="container">
        {data.map((order, index) => {
          const normalizedStatus = normalizeStatus(order.status);
          const statusIndex = getStatusIndex(order.status);
          const isCancelled = normalizedStatus === "Cancelled";
          
          return (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <div className="order-details">
                <p>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + " X " + item.quantity;
                    } else {
                      return item.name + " X " + item.quantity + ",";
                    }
                  })}
                </p>
                <p>₹{order.amount}.00</p>
                <p>items: {order.items.length}</p>
              </div>
              <div className="order-status-section">
                <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                  {normalizedStatus}
                </span>
                {!isCancelled && statusIndex >= 0 && (
                  <div className="order-progress">
                    {STATUS_PROGRESSION.map((status, idx) => (
                      <div
                        key={idx}
                        className={`progress-step ${idx <= statusIndex ? 'completed' : ''} ${idx === statusIndex ? 'current' : ''}`}
                      >
                        <div className="progress-dot"></div>
                        <span className="progress-label">{status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={fetchOrders}>Track Order</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
