package com.bsuirroom.controller;

import com.bsuirroom.entity.Type;
import com.bsuirroom.repository.TypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("types")
public class TypeController {

    @Autowired
    private TypeRepository typeRepository;

    @GetMapping
    public List<Type> getAllTypes(){
        return typeRepository.findAll();
    }
}
