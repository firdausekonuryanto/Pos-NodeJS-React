import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);

  const API_URL = "http://localhost:5000/api/items";

  // Fetch items on load
  const fetchItems = async () => {
    try {
      const res = await axios.get(API_URL);
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle Create or Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price) return;

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, { name, price });
        setEditId(null);
      } else {
        await axios.post(API_URL, { name, price });
      }
      setName("");
      setPrice("");
      fetchItems();
    } catch (err) {
      console.error("Error saving item:", err);
    }
  };

  // Prepare item for editing
  const handleEdit = (item) => {
    setEditId(item.id);
    setName(item.name);
    setPrice(item.price);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchItems();
      } catch (err) {
        console.error("Error deleting item:", err);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Node.js & React CRUD App</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="row g-3 mb-4 card p-3 shadow-sm bg-light"
      >
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            type="number"
            className="form-control"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <button
            type="submit"
            className={`btn ${editId ? "btn-warning" : "btn-primary"} w-100`}
          >
            {editId ? "Update Item" : "Add Item"}
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Item Name</th>
                <th>Price</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      <strong>{item.name}</strong>
                    </td>
                    <td>Rp {Number(item.price).toLocaleString()}</td>
                    <td className="text-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="btn btn-sm btn-warning me-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-3">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
