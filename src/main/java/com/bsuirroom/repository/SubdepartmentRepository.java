package com.bsuirroom.repository;

import com.bsuirroom.entity.Department;
import com.bsuirroom.entity.Subdepartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubdepartmentRepository extends JpaRepository<Subdepartment, Long> {
    List<Subdepartment> findSubdepartmentByDepartment(Department department);
    Subdepartment findSubdepartmentByName(String name);
}
