package com.example.employee_management.repository;

import com.example.employee_management.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // ✅ For filtering using search term (by name or department)
    Page<Employee> findByNameContainingIgnoreCaseOrDepartmentContainingIgnoreCase(String name, String dept, Pageable pageable);
}
