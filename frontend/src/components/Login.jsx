import { useState }    from "react";
import { useNavigate } from "react-router-dom";
import api             from "../services/api";

const Login = () => {

      // ----------------------------------
     // STATES
    // ----------------------------------
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


      // ----------------------------------
     // POST - Login
    // ----------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/auth/login", formData);
            setMessage("Login successful!");
            setTimeout(() => {
                navigate("/profile"); 
            }, 1000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Login failed");
        }
    };

    
    return (
        <div className="h-screen flex justify-center items-center bg-gradient-to-r from-purple-600 to-pink-500">
    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
        {message && <div className="text-red-500 text-center mb-4">{message}</div>}
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
            />
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
            />
            <button 
                type="submit" 
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-300 font-medium shadow-md"
            >
                Sign In
            </button>
        </form>
        <div className="mt-6 text-center text-gray-600">
            <span>Don't have an account?</span> 
            <a href="/register" className="ml-1 text-purple-600 hover:text-purple-800 font-medium">Register here</a>
        </div>
    </div>
</div>
    );
};

export default Login;
