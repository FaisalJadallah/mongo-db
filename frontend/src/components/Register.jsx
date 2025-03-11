import { useState } from "react";
import api          from "../services/api";

const Register = () => {

      // ----------------------------------
     // STATES
    // ----------------------------------
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [message,  setMessage]  = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

      // ----------------------------------
     // POST - Login
    // ----------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/auth/register", formData);
            setMessage("Registration successful!");
        } catch (err) {
            setMessage(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="h-screen flex justify-center items-center bg-gradient-to-r from-teal-500 to-green-600">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
                {message && <div className="text-red-500 text-center mb-4">{message}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button 
                        type="submit" 
                        className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition duration-300"
                    >
                        Register
                    </button>
                </form>
                <div className="mt-4 text-center text-sm">
                    <span>Already have an account?</span> 
                    <a href="/" className="text-teal-600 hover:underline">Login here</a>
                </div>
            </div>
        </div>
    );
};

export default Register;
