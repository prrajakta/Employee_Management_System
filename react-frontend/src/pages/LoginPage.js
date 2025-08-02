import React, { useState } from "react";
import axios from "axios";

const LoginPage = ({ onLoginSuccess }) => {
        const [username, setUsername] = useState("admin");
        const [password, setPassword] = useState("admin123"); // ✅ use correct password
        const [error, setError] = useState("");

        const handleLogin = async() => {
            try {
                const res = await axios.post("http://localhost:8080/auth/login", {
                    username,
                    password,
                });

                const token = (res.data.token || res.data).replace(/^Bearer\s*/, "");
                const role = res.data.role;

                if (token) {
                    localStorage.setItem("token", token); // ✅ store the token correctly
                    localStorage.setItem("role", res.data.role);
                    onLoginSuccess();
                    setError("");
                } else {
                    setError("❌ Login failed. No token returned.");
                }
            } catch (err) {
                setError("❌ Invalid credentials. Please try again.");
            }
        };

        return ( <
            div className = "container mt-5"
            style = {
                { maxWidth: "400px" }
            } >
            <
            h3 > 🔐Login < /h3> <
            div className = "form-group mb-2" >
            <
            label > Username < /label> <
            input className = "form-control"
            value = { username }
            onChange = {
                (e) => setUsername(e.target.value)
            }
            autoFocus /
            >
            <
            /div> <
            div className = "form-group mb-3" >
            <
            label > Password < /label> <
            input type = "password"
            className = "form-control"
            value = { password }
            onChange = {
                (e) => setPassword(e.target.value)
            }
            /> < /
            div > {
                error && < div className = "text-danger mb-3" > { error } < /div>} <
                button className = "btn btn-primary w-100"
                onClick = { handleLogin } > 🔓Login <
                /button> < /
                div >
            );
        };

        export default LoginPage;