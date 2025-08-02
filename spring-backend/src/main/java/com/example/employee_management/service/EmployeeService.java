package com.example.employee_management.service;

import com.example.employee_management.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface EmployeeService {
    Page<Employee> getAllEmployees(Pageable pageable);
    Page<Employee> searchEmployees(String keyword, Pageable pageable);
    Optional<Employee> getEmployeeById(Long id);
    Employee createEmployee(Employee employee);
    Employee updateEmployee(Long id, Employee updated);
    void deleteEmployee(Long id);
}
