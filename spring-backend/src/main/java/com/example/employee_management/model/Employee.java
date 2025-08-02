package com.example.employee_management.model;

import jakarta.persistence.*;

@Entity
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String department;
    private String role;

    // Constructors
    public Employee() {}

    public Employee(Long id, String name, String email, String department, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.department = department;
        this.role = role;
    }

    // Getters
    public Long getId() { return id; }

    public String getName() { return name; }

    public String getEmail() { return email; }

    public String getDepartment() { return department; }

    public String getRole() { return role; }

    // Setters
    public void setId(Long id) { this.id = id; }

    public void setName(String name) { this.name = name; }

    public void setEmail(String email) { this.email = email; }

    public void setDepartment(String department) { this.department = department; }

    public void setRole(String role) { this.role = role; }
}
