import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const List = ({ url }) => {
  const navigate = useNavigate();
  const { token,admin } = useContext(StoreContext);
  const [list, setList] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(
      `${url}/api/food/remove`,
      { id: foodId },
      { headers: { token } }
    );
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };

  const editFood = async (foodId) => {
    const item = list.find(i => i._id === foodId);
    setEditItem(foodId);
    setEditData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      isAvailable: item.isAvailable,
    });
  };

  const updateFood = async () => {
    const formData = new FormData();
    formData.append("id", editItem);
    formData.append("name", editData.name);
    formData.append("description", editData.description);
    formData.append("price", Number(editData.price));
    formData.append("category", editData.category);
    formData.append("isAvailable", editData.isAvailable);
    
    const response = await axios.post(`${url}/api/food/edit`, formData, { headers: { token } });
    if (response.data.success) {
      setEditItem(null);
      fetchList();
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  const toggleAvailability = async (foodId) => {
    const response = await axios.post(
      `${url}/api/food/toggle-availability`,
      { id: foodId },
      { headers: { token } }
    );
    if (response.data.success) {
      fetchList();
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  useEffect(() => {
    if (!admin && !token) {
      toast.error("Please Login First");
      navigate("/");
    }
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Available</b>
          <b>Actions</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>₹{item.price}</p>
              <p>{item.isAvailable ? "Yes" : "No"}</p>
              <div className="list-actions">
                <p onClick={() => editFood(item._id)} className="cursor">Edit</p>
                <p onClick={() => toggleAvailability(item._id)} className="cursor">Toggle</p>
                <p onClick={() => removeFood(item._id)} className="cursor">X</p>
              </div>
            </div>
          );
        })}
      </div>
      {editItem && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h3>Edit Food</h3>
            <input
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              placeholder="Name"
            />
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              placeholder="Description"
              rows="3"
            />
            <input
              value={editData.price}
              onChange={(e) => setEditData({ ...editData, price: e.target.value })}
              type="number"
              placeholder="Price"
            />
            <select
              value={editData.category}
              onChange={(e) => setEditData({ ...editData, category: e.target.value })}
            >
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
            <select
              value={editData.isAvailable}
              onChange={(e) => setEditData({ ...editData, isAvailable: e.target.value === 'true' })}
            >
              <option value={true}>Available</option>
              <option value={false}>Unavailable</option>
            </select>
            <div className="edit-modal-buttons">
              <button onClick={updateFood}>Update</button>
              <button onClick={() => setEditItem(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
