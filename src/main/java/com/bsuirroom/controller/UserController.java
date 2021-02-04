package com.bsuirroom.controller;

import com.bsuirroom.config.dto.UserProfile;
import com.bsuirroom.entity.User;
import com.bsuirroom.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("profile")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<UserProfile> profile() {
        return ResponseEntity.ok(userService.getUserProfile());
    }

    @GetMapping("me")
    public User me(){
        return userService.getAuthUser();
    }

    @GetMapping("users")
    public List<User> getAllUsers() {
        return this.userService.getAllUsers();
    }

    @PostMapping("register")
    public String addNewUser(@RequestBody User user){
        return this.userService.addNewUser(user);
    }

    @DeleteMapping("delete")
    public void deleteUser(@RequestParam String username){
        this.userService.deleteUser(username);
    }

    @PutMapping("edit")
    public User editUser(@RequestBody User user){
        return this.userService.editUser(user);
    }

    @ExceptionHandler(value = BadCredentialsException.class)
    public ResponseEntity<String> exceptionHandler(){
        return new ResponseEntity<String>("Пользователь с такими логином уже существует", HttpStatus.PRECONDITION_FAILED);
    }
}
