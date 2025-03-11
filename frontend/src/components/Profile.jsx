import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Profile = () => {
    // ----------------------------------
   // STATES
  // ----------------------------------
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({ username: "", email: "" });
  const [newOrder, setNewOrder] = useState([{ name: "", price: 0, quantity: 1 }]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error"); // "error" or "success"
  const navigate = useNavigate();


     // ----------------------------------
    // FETCH DATA
   // ----------------------------------
  // GET - User 
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        setUser(response.data);
        setUpdatedData({ username: response.data.username, email: response.data.email });
      } catch (err) {
        setMessage("You are not authenticated. Redirecting to login...");
        setTimeout(() => navigate("/"), 2000);
      }
    };

  // GET - Orders 
    const fetchOrders = async () => {
      try {
        const response = await api.get("/order/orders");
        setOrders(response.data);
      } catch (err) {
        setMessage("Error fetching orders");
        setMessageType("error");
      }
    };

    fetchProfile();
    fetchOrders();
  }, [navigate]);


  // ----------------------------------
  // Handlers
  // ----------------------------------
  // STATE - User
  const handleEditChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  // SUBMIT - User
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put("/auth/update", updatedData);
      setMessage("Profile updated successfully!");
      setMessageType("success");
      setEditMode(false);
      setUser({ ...user, ...updatedData });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating profile");
      setMessageType("error");
    }
  };

  // DELETE - USER
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await api.delete("/auth/delete");
        setMessage("Account deleted successfully");
        setMessageType("success");
        navigate("/");
      } catch (err) {
        setMessage(err.response?.data?.message || "Error deleting account");
        setMessageType("error");
      }
    }
  };

  // STATE - Order
  const handleOrderChange = (e, index) => {
    const updatedOrder = [...newOrder];
    updatedOrder[index][e.target.name] = e.target.value;
    setNewOrder(updatedOrder);
  };

  // ADD - Product
  const handleAddProduct = () => {
    setNewOrder([...newOrder, { name: "", price: 0, quantity: 1 }]);
  };

  // REMOVE - Product
  const handleRemoveProduct = (index) => {
    if (newOrder.length > 1) {
      const updatedOrder = newOrder.filter((_, i) => i !== index);
      setNewOrder(updatedOrder);
    }
  };

  // SUBMIT - Order
  const handleCreateOrder = async () => {
    try {
      const response = await api.post("/order/create", { products: newOrder });
      setMessage(response.data.message || "Order created successfully!");
      setMessageType("success");
      setOrders([...orders, response.data.order]); 
      setNewOrder([{ name: "", price: 0, quantity: 1 }]); 
    } catch (err) {
      setMessage(err.response?.data?.message || "Error creating order");
      setMessageType("error");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
          <div className="animate-pulse">
            <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-indigo-200"></div>
            <div className="h-4 bg-indigo-100 rounded w-3/4 mx-auto mb-6"></div>
          </div>
          <p className="text-gray-700">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Message Bar */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} flex items-center justify-between`}>
            <span>{message}</span>
            <button 
              onClick={() => setMessage("")}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
            <h2 className="text-3xl font-bold text-white">User Profile</h2>
          </div>

          <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
            {/* Left Section: Profile */}
            <div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                  Personal Information
                </h3>

                {editMode ? (
                  <form onSubmit={handleUpdateProfile}>
                    <div className="mb-4">
                      <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={updatedData.username}
                        onChange={handleEditChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div className="mb-6">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={updatedData.email}
                        onChange={handleEditChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button 
                        type="submit" 
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Save Changes
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setEditMode(false)} 
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-500">Username</div>
                      <div className="text-lg text-gray-800">{user.username}</div>
                    </div>
                    <div className="mb-6">
                      <div className="text-sm font-medium text-gray-500">Email</div>
                      <div className="text-lg text-gray-800">{user.email}</div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setEditMode(true)} 
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Edit Profile
                      </button>
                      <button 
                        onClick={handleDeleteAccount} 
                        className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* CREATE Order - Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Create New Order</h3>
                
                {newOrder.map((product, index) => (
                  <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg relative">
                    {newOrder.length > 1 && (
                      <button 
                        onClick={() => handleRemoveProduct(index)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                        aria-label="Remove product"
                      >
                        ×
                      </button>
                    )}
                    
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g., Wireless Headphones"
                        value={product.name}
                        onChange={(e) => handleOrderChange(e, index)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Price ($)</label>
                        <input
                          type="number"
                          name="price"
                          placeholder="0.00"
                          value={product.price}
                          onChange={(e) => handleOrderChange(e, index)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Quantity</label>
                        <input
                          type="number"
                          name="quantity"
                          min="1"
                          value={product.quantity}
                          onChange={(e) => handleOrderChange(e, index)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex flex-col space-y-3 mt-4">
                  <button 
                    onClick={handleAddProduct} 
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <span>+ Add Another Product</span>
                  </button>
                  <button 
                    onClick={handleCreateOrder} 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Create Order
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right Section - Orders */}
            <div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Your Orders</h3>
                
                {orders.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500">Order ID</span>
                          <span className="text-sm text-gray-800 font-mono">{order._id}</span>
                        </div>
                        
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500">Status</span>
                          <span className={`text-sm px-2 py-0.5 rounded-full ${
                            order.orderStatus === "Completed" ? "bg-green-100 text-green-800" : 
                            order.orderStatus === "Processing" ? "bg-blue-100 text-blue-800" : 
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        
                        <div className="flex justify-between mb-3">
                          <span className="text-sm font-medium text-gray-500">Total</span>
                          <span className="text-lg font-semibold text-gray-800">${order.totalAmount}</span>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Products</h4>
                          <ul className="space-y-2">
                            {order.products.map((product, idx) => (
                              <li key={idx} className="flex justify-between text-sm">
                                <span>{product.name} × {product.quantity}</span>
                                <span className="font-medium">${(product.price * product.quantity).toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <p>You haven't placed any orders yet.</p>
                    <p className="mt-1 text-sm">Create your first order using the form on the left.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;