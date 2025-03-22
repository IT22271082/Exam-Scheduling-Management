import { useState } from "react";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login", 
                { email, password },
                { headers: { "Content-Type": "application/json" } }
            );
            
            localStorage.setItem("token", response.data.token);
            window.location.href = "/dashboard";
        } catch (err) {
            setError("Invalid credentials. Please check your email and password.");
        }
    };
    
    // Style object for the background container
    const containerStyle = {
        backgroundColor: "#0f1b30", // Dark blue that matches the image
        backgroundImage: "url('/images/AI Emergence in Workspaces_ $1_2 Trillion Saved in Maintenance.jpg')", // Add your image to public/images folder
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover", // Shows the full image without cropping
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    };
    
    // Style for the transparent login form container
    const formContainerStyle = {
        backgroundColor: "rgba(15, 27, 48, 0.7)", // Semi-transparent dark blue
        backdropFilter: "blur(5px)", // Adds a blur effect for modern browsers
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 4px 20px rgba(0, 123, 255, 0.25), 0 0 15px rgba(255, 0, 255, 0.15)",
        width: "400px",
        maxWidth: "90%",
        border: "1px solid rgba(128, 200, 255, 0.2)"
    };
    
    // Style for form inputs to make them match the theme
    const inputStyle = {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(128, 200, 255, 0.3)",
        color: "white"
    };
    
    // Style for labels to make them visible on dark background
    const labelStyle = {
        color: "white",
        fontWeight: "500"
    };
    
    return (
        <div style={containerStyle}>
            <div style={formContainerStyle}>
                <h2 className="text-center mb-4" style={{color: "white"}}>Admin Login</h2>
                {error && <p className="text-danger text-center">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label" style={labelStyle}>Email</label>
                        <input 
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" style={labelStyle}>Password</label>
                        <input 
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn w-100" 
                        style={{
                            backgroundColor: "#00bcd4", 
                            borderColor: "#00bcd4",
                            color: "white"
                        }}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;