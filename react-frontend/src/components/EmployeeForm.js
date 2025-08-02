import React, { useState, useEffect } from "react";

const EmployeeForm = ({ onSave, onClose, initialData = {} }) => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        department: "",
        role: "",
    });

    useEffect(() => {
        if (initialData) setForm(initialData);
    }, [initialData]);

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return ( <
        div className = "card p-3" >
        <
        h5 > { initialData ? .id ? "Edit" : "Add" }
        Employee < /h5> <
        form onSubmit = { handleSubmit } >
        <
        input className = "form-control mb-2"
        name = "name"
        placeholder = "Name"
        value = { form.name }
        onChange = { handleChange }
        /> <
        input className = "form-control mb-2"
        name = "email"
        placeholder = "Email"
        value = { form.email }
        onChange = { handleChange }
        /> <
        input className = "form-control mb-2"
        name = "department"
        placeholder = "Department"
        value = { form.department }
        onChange = { handleChange }
        /> <
        input className = "form-control mb-2"
        name = "role"
        placeholder = "Role"
        value = { form.role }
        onChange = { handleChange }
        /> <
        div className = "d-flex justify-content-between" >
        <
        button type = "submit"
        className = "btn btn-success" > Save < /button> <
        button type = "button"
        className = "btn btn-secondary"
        onClick = { onClose } > Cancel < /button> <
        /div> <
        /form> <
        /div>
    );
};

export default EmployeeForm;