import React, { useState, useEffect } from "react";
import './App.css';
import EmployeeTable from "./components/EmployeeTable";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [view, setView] = useState("login");

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        setView("login");
    };

    if (isLoggedIn) {
        return ( <
            div className = "container mt-4" >
            <
            div className = "d-flex justify-content-between align-items-center" >
            <
            h2 > Employee Management System < /h2> <
            button className = "btn btn-danger"
            onClick = { handleLogout } > 🚪Logout < /button> < /
            div > <
            EmployeeTable / >
            <
            /div>
        );
    }

    return ( <
        div className = "container mt-4" >
        <
        h2 > Employee Management System < /h2> {
            view === "login" ? ( <
                >
                <
                LoginPage onLoginSuccess = { handleLoginSuccess }
                /> <
                p className = "mt-2 text-center" >
                New here ? { " " } <
                button className = "btn btn-link"
                onClick = {
                    () => setView("signup") } >
                Signup <
                /button> <
                /p> <
                />
            ) : ( <
                >
                <
                SignupPage onSignupSuccess = {
                    () => setView("login") }
                /> <
                p className = "mt-2 text-center" >
                Already have an account ? { " " } <
                button className = "btn btn-link"
                onClick = {
                    () => setView("login") } >
                Login <
                /button> <
                /p> <
                />
            )
        } <
        /div>
    );
}

export default App;

//     return ( <
//             div className = "container mt-4" >
//             <
//             h2 > Employee Management System < /h2> {
//             isLoggedIn ? ( <
//                 EmployeeTable / >
//             ) : ( <
//                 LoginPage onLoginSuccess = { handleLoginSuccess }
//                 />
//             )
//         } <
//         /div>
// );
// }

// export default App;