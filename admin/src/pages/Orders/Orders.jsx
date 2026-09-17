import React from "react";
import "./Orders.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Orders = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [searchQuery, setSearchQuery] = useState("");

  // Status transition rules (must match backend)
  const STATUS_TRANSITIONS = {
    "Placed": ["Preparing", "Cancelled"],
    "Preparing": ["Ready for Pickup", "Cancelled"],
    "Ready for Pickup": ["Out for Delivery", "Cancelled"],
    "Out for Delivery": ["Delivered", "Cancelled"],
    "Delivered": [],
    "Cancelled": [],
    // Legacy status mappings
    "Food Processing": ["Preparing", "Cancelled"],
    "Out for delivery": ["Delivered", "Cancelled"]
  };

  // Normalize legacy statuses for display
  const normalizeStatus = (status) => {
    const legacyMap = {
      "Food Processing": "Placed",
      "Out for delivery": "Out for Delivery"
    };
    return legacyMap[status] || status;
  };

  const fetchAllOrder = async () => {
    const response = await axios.get(url + "/api/order/list", {
      headers: { token },
    });
    if (response.data.success) {
      setOrders(response.data.data);
    }
  };

  // Apply filter and search
  useEffect(() => {
    let filtered = orders;

    // Apply status filter
    if (statusFilter !== "All Statuses") {
      filtered = filtered.filter(order => {
        const normalizedStatus = normalizeStatus(order.status);
        return normalizedStatus === statusFilter;
      });
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => {
        const customerName = `${order.address.firstName} ${order.address.lastName}`.toLowerCase();
        const orderId = order._id.toLowerCase();
        return customerName.includes(query) || orderId.includes(query);
      });
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchQuery]);

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(
      url + "/api/order/status",
      {
        orderId,
        status: event.target.value,
      },
      { headers: { token } }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      await fetchAllOrder();
    } else {
      toast.error(response.data.message);
      await fetchAllOrder();
    }
  };
  useEffect(() => {
    if (!admin && !token) {
      toast.error("Please Login First");
      navigate("/");
    }
    fetchAllOrder();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-controls">
        <div className="order-filter">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Placed">Placed</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready for Pickup">Ready for Pickup</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="order-search">
          <input
            type="text"
            placeholder="Search by customer name or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="order-list">
        {filteredOrders.map((order, index) => {
          const currentStatus = order.status;
          const validTransitions = STATUS_TRANSITIONS[currentStatus] || [];
          
          return (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="" />
              <div>
                <p className="order-item-food">
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + " x " + item.quantity;
                    } else {
                      return item.name + " x " + item.quantity + ", ";
                    }
                  })}
                </p>
                <p className="order-item-name">
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street + ","}</p>
                  <p>
                    {order.address.city +
                      ", " +
                      order.address.state +
                      ", " +
                      order.address.country +
                      ", " +
                      order.address.zipcode}
                  </p>
                </div>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>
              <p>Items: {order.items.length}</p>
              <p>₹{order.amount}</p>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={currentStatus}
              >
                {validTransitions.length > 0 ? (
                  validTransitions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))
                ) : (
                  <option value={currentStatus}>{currentStatus}</option>
                )}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
