import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SignupPage = ({ onSignupSuccess }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("USER"); // default role

    const handleSignup = async() => {
        try {
            await axios.post("http://localhost:8080/auth/signup", {
                username,
                password,
                role
            });
            toast.success("✅ Signup successful!");
            onSignupSuccess(); // Redirect or update UI
        } catch (err) {
            let message = "Signup failed.";
            if (err && err.response && err.response.data) {
                message = err.response.data;
            } else if (err && err.message) {
                message = err.message;
            }
            toast.error("❌ " + message);
        }
    };

    return ( <
        div className = "container mt-5"
        style = {
            { maxWidth: "400px" } } >
        <
        h3 > 📝Signup < /h3> <
        div className = "form-group mb-2" >
        <
        label > Username < /label> <
        input className = "form-control"
        value = { username }
        onChange = {
            (e) => setUsername(e.target.value) }
        autoFocus /
        >
        <
        /div> <
        div className = "form-group mb-2" >
        <
        label > Password < /label> <
        input type = "password"
        className = "form-control"
        value = { password }
        onChange = {
            (e) => setPassword(e.target.value) }
        /> <
        /div> <
        div className = "form-group mb-3" >
        <
        label > Role < /label> <
        select className = "form-control"
        value = { role }
        onChange = {
            (e) => setRole(e.target.value) } >
        <
        option value = "USER" > USER < /option> <
        option value = "ADMIN" > ADMIN < /option> <
        /select> <
        /div> <
        button className = "btn btn-primary w-100"
        onClick = { handleSignup } > ✅Signup <
        /button> <
        /div>
    );
};

export default SignupPage;