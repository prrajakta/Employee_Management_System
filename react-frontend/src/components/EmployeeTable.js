import React, { useState, useEffect } from "react";
import api from "../utils/axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { saveAs } from "file-saver";

const EmployeeTable = () => {
        const [employees, setEmployees] = useState([]);
        const [searchTerm, setSearchTerm] = useState("");
        const [sortField, setSortField] = useState("name");
        const [sortOrder, setSortOrder] = useState("asc");
        const [currentPage, setCurrentPage] = useState(0);
        const [totalPages, setTotalPages] = useState(1);
        const [isDark, setIsDark] = useState(false);

        const [showForm, setShowForm] = useState(false);
        const [editingEmployee, setEditingEmployee] = useState(null);
        const [formData, setFormData] = useState({
            name: "",
            email: "",
            department: "",
            role: ""
        });

        const [role, setRole] = useState("");

        useEffect(() => {
            const storedRole = localStorage.getItem("role");
            if (storedRole) setRole(storedRole);
            fetchEmployees(0);
        }, [sortField, sortOrder]);

        useEffect(() => {
            const timeout = setTimeout(() => fetchEmployees(0), 400);
            return () => clearTimeout(timeout);
        }, [searchTerm]);

        // ✅ Apply dark mode to full page body
        useEffect(() => {
            if (isDark) {
                document.body.classList.add("bg-dark", "text-white");
            } else {
                document.body.classList.remove("bg-dark", "text-white");
            }
            return () => {
                document.body.classList.remove("bg-dark", "text-white");
            };
        }, [isDark]);

        const fetchEmployees = (page = 0, size = 5) => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("⛔ No token found in localStorage.");
                return;
            }

            api.get("/api/employees", {
                    params: {
                        page,
                        size,
                        sort: `${sortField},${sortOrder}`,
                        search: searchTerm
                    }
                })
                .then((response) => {
                    const data = response.data;
                    if (data && Array.isArray(data.content)) {
                        setEmployees(data.content);
                        setTotalPages(data.totalPages);
                        setCurrentPage(data.number);
                    } else {
                        setEmployees([]);
                    }
                })
                .catch((err) => {
                    console.error("❌ Fetch error:", err);
                    toast.error("Failed to fetch employees.");
                });
        };

        const handleSort = (field) => {
            const order = field === sortField && sortOrder === "asc" ? "desc" : "asc";
            setSortField(field);
            setSortOrder(order);
        };

        const handleAddNew = () => {
            setEditingEmployee(null);
            setFormData({ name: "", email: "", department: "", role: "" });
            setShowForm(true);
        };

        const handleEdit = (emp) => {
            setEditingEmployee(emp);
            setFormData({
                name: emp.name,
                email: emp.email,
                department: emp.department,
                role: emp.role
            });
            setShowForm(true);
        };

        const handleDelete = async(id) => {
            if (!window.confirm("Are you sure you want to delete this employee?")) return;
            try {
                await api.delete(`/api/employees/${id}`);
                toast.success("Employee deleted successfully!");
                fetchEmployees(currentPage);
            } catch (error) {
                console.error("❌ Delete failed:", error);
                toast.error("Failed to delete employee.");
            }
        };

        const handleFormSubmit = async(e) => {
            e.preventDefault();
            try {
                if (editingEmployee) {
                    await api.put(`/api/employees/${editingEmployee.id}`, formData);
                    toast.success("Employee updated successfully!");
                } else {
                    await api.post("/api/employees", formData);
                    toast.success("Employee added successfully!");
                }
                fetchEmployees(currentPage);
                setShowForm(false);
            } catch (err) {
                console.error("❌ Submit failed:", err);
                toast.error("Failed to submit employee.");
            }
        };

        const handleExport = async() => {
            try {
                const response = await api.get("/api/export", {
                    responseType: "blob",
                });

                const blob = new Blob([response.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });

                saveAs(blob, "employees.xlsx");
            } catch (error) {
                console.error("❌ Export failed:", error);
                toast.error("Failed to export data.");
            }
        };

        return ( <
            div className = "container mt-4" >
            <
            ToastContainer / >

            { /* ✅ Light/Dark mode toggle */ } <
            button className = "btn btn-sm btn-secondary mb-2"
            onClick = {
                () => setIsDark(!isDark) } >
            { isDark ? "🌙 Dark Mode ON" : "☀️ Light Mode ON" } <
            /button>

            <
            div className = "d-flex flex-wrap gap-2 mb-3" > {
                role === "ROLE_ADMIN" && ( <
                    >
                    <
                    button className = "btn btn-success"
                    onClick = { handleAddNew } > ➕Add Employee <
                    /button> <
                    button className = "btn btn-primary"
                    onClick = {
                        () => fetchEmployees(currentPage) } >
                    🔄Refresh <
                    /button> <
                    button className = "btn btn-outline-success"
                    onClick = { handleExport } >
                    📥Export to Excel <
                    /button> <
                    />
                )
            } <
            input type = "text"
            placeholder = "🔍 Search by name or department"
            className = "form-control mt-2 mt-md-0"
            style = {
                { maxWidth: "250px" } }
            value = { searchTerm }
            onChange = {
                (e) => setSearchTerm(e.target.value) }
            /> <
            /div>

            {
                showForm && role === "ROLE_ADMIN" && ( <
                    form onSubmit = { handleFormSubmit }
                    className = "mb-4 p-3 border rounded bg-light" >
                    <
                    h5 > { editingEmployee ? "✏️ Edit Employee" : "🆕 Add Employee" } < /h5> <
                    div className = "row" >
                    <
                    div className = "col-md-6 mb-2" >
                    <
                    input className = "form-control"
                    placeholder = "Name"
                    required value = { formData.name }
                    onChange = {
                        (e) => setFormData({...formData, name: e.target.value }) }
                    /> <
                    /div> <
                    div className = "col-md-6 mb-2" >
                    <
                    input className = "form-control"
                    placeholder = "Email"
                    type = "email"
                    required value = { formData.email }
                    onChange = {
                        (e) => setFormData({...formData, email: e.target.value }) }
                    /> <
                    /div> <
                    div className = "col-md-6 mb-2" >
                    <
                    input className = "form-control"
                    placeholder = "Department"
                    required value = { formData.department }
                    onChange = {
                        (e) => setFormData({...formData, department: e.target.value }) }
                    /> <
                    /div> <
                    div className = "col-md-6 mb-3" >
                    <
                    input className = "form-control"
                    placeholder = "Role"
                    required value = { formData.role }
                    onChange = {
                        (e) => setFormData({...formData, role: e.target.value }) }
                    /> <
                    /div> <
                    /div> <
                    div className = "d-flex justify-content-between" >
                    <
                    button type = "submit"
                    className = "btn btn-primary" > { editingEmployee ? "💾 Update" : "➕ Add" } <
                    /button> <
                    button type = "button"
                    className = "btn btn-secondary"
                    onClick = {
                        () => setShowForm(false) } >
                    ❌Cancel <
                    /button> <
                    /div> <
                    /form>
                )
            }

            <
            div className = "table-responsive" >
            <
            table className = "table table-bordered table-striped" >
            <
            thead className = "table-dark" >
            <
            tr >
            <
            th onClick = {
                () => handleSort("id") }
            style = {
                { cursor: "pointer" } } >
            ID { sortField === "id" && (sortOrder === "asc" ? "▲" : "▼") } <
            /th> <
            th onClick = {
                () => handleSort("name") }
            style = {
                { cursor: "pointer" } } >
            Name { sortField === "name" && (sortOrder === "asc" ? "▲" : "▼") } <
            /th> <
            th onClick = {
                () => handleSort("email") }
            style = {
                { cursor: "pointer" } } >
            Email { sortField === "email" && (sortOrder === "asc" ? "▲" : "▼") } <
            /th> <
            th onClick = {
                () => handleSort("department") }
            style = {
                { cursor: "pointer" } } >
            Department { sortField === "department" && (sortOrder === "asc" ? "▲" : "▼") } <
            /th> <
            th onClick = {
                () => handleSort("role") }
            style = {
                { cursor: "pointer" } } >
            Role { sortField === "role" && (sortOrder === "asc" ? "▲" : "▼") } <
            /th> {
                role === "ROLE_ADMIN" && < th colSpan = { 2 } > Actions < /th>} <
                    /tr> <
                    /thead> <
                    tbody > {
                        employees.length > 0 ? (
                            employees.map((emp) => ( <
                                tr key = { emp.id } >
                                <
                                td > { emp.id } < /td> <
                                td > { emp.name } < /td> <
                                td > { emp.email } < /td> <
                                td > { emp.department } < /td> <
                                td > { emp.role } < /td> {
                                    role === "ROLE_ADMIN" && ( <
                                        td >
                                        <
                                        button className = "btn btn-sm btn-outline-primary me-2"
                                        onClick = {
                                            () => handleEdit(emp) } >
                                        Edit <
                                        /button> <
                                        button className = "btn btn-sm btn-outline-danger"
                                        onClick = {
                                            () => handleDelete(emp.id) } >
                                        Delete <
                                        /button> <
                                        /td>
                                    )
                                } <
                                /tr>
                            ))
                        ) : ( <
                            tr >
                            <
                            td colSpan = { role === "ROLE_ADMIN" ? 7 : 5 }
                            className = "text-center" >
                            No employees found. <
                            /td> <
                            /tr>
                        )
                    } <
                    /tbody> <
                    /table> <
                    /div>

                <
                div className = "d-flex justify-content-center mt-3" >
                    <
                    button
                className = "btn btn-outline-secondary me-2"
                disabled = { currentPage === 0 }
                onClick = {
                        () => fetchEmployees(currentPage - 1) } >
                    ⬅️Prev <
                    /button> <
                    span className = "align-self-center" >
                    Page { currentPage + 1 }
                of { totalPages } <
                /span> <
                button
                className = "btn btn-outline-secondary ms-2"
                disabled = { currentPage + 1 >= totalPages }
                onClick = {
                        () => fetchEmployees(currentPage + 1) } >
                    Next➡️ <
                    /button> <
                    /div> <
                    /div>
            );
        };

        export default EmployeeTable;