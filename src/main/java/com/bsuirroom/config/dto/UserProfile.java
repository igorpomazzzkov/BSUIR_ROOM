package com.bsuirroom.config.dto;

import com.bsuirroom.entity.Role;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
public class UserProfile {
    private Long id;
    private String username;
    private String email;

    Set<Role> roles = new HashSet<>();
}
