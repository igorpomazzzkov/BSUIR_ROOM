package com.bsuirroom.controller;

import com.bsuirroom.entity.Department;
import com.bsuirroom.entity.Subdepartment;
import com.bsuirroom.repository.SubdepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("subdepartments")
public class SubdepartmentController {
    @Autowired
    private SubdepartmentRepository subdepartmentRepository;

    @GetMapping
    public List<Subdepartment> getAllSubdepartments(){
        return this.subdepartmentRepository.findAll();
    }

    @PostMapping("findByNameAndDepartment")
    public List<Subdepartment> getSubdepartmentByDepartmendAndName(@RequestBody Department department){
        List<Subdepartment> subdepartments = this.subdepartmentRepository.findSubdepartmentByDepartment(department);
        return subdepartments;
    }

    @GetMapping("findByName")
    public Subdepartment findBuName(@RequestParam String name){
        return this.subdepartmentRepository.findSubdepartmentByName(name);
    }

}
