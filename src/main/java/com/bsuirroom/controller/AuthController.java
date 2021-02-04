package com.bsuirroom.controller;

import com.bsuirroom.config.dto.ApiResponseMessage;
import com.bsuirroom.config.dto.LoginRequest;
import com.bsuirroom.config.dto.LoginResponse;
import com.bsuirroom.config.util.SecurityCipher;
import com.bsuirroom.entity.User;
import com.bsuirroom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    FindByIndexNameSessionRepository sessionRepository;

    @GetMapping
    public String getEncode(){
        return this.passwordEncoder.encode("password");
    }

    @GetMapping("username")
    public User getUserByUsername(@RequestParam String username){
        System.out.println(username);
        return (User) this.userService.loadUserByUsername(username);
    }


    @PostMapping(value = "login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LoginResponse> login(
            @CookieValue(name = "accessToken", required = false) String accessToken,
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            @RequestBody LoginRequest loginRequest
    ) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String decryptedAccessToken = SecurityCipher.decrypt(accessToken);
        String decryptedRefreshToken = SecurityCipher.decrypt(refreshToken);
        return userService.login(loginRequest, decryptedAccessToken, decryptedRefreshToken);
    }

    @PostMapping(value = "refresh", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LoginResponse> refreshToken(@CookieValue(name = "accessToken", required = false) String accessToken,
                                                      @CookieValue(name = "refreshToken", required = false) String refreshToken) {
        String decryptedAccessToken = SecurityCipher.decrypt(accessToken);
        String decryptedRefreshToken = SecurityCipher.decrypt(refreshToken);
        return userService.refresh(decryptedAccessToken, decryptedRefreshToken);
    }

    @GetMapping("usernames")
    public List<String> getUsernames(){
        List<User> users = this.userService.getAllUsers();
        List<String> usernames = users.stream().map(user -> {
           return user.getUsername();
        }).collect(Collectors.toList());
        return usernames;
    }

    @GetMapping("logout")
    public ResponseEntity<String> logOut(HttpServletRequest request, HttpServletResponse response) {
        return new ResponseEntity(new ApiResponseMessage(true, userService.logout(request, response)), HttpStatus.OK);
    }

    @ExceptionHandler(value = BadCredentialsException.class)
    public ResponseEntity<String> exceptionHandler(){
        return new ResponseEntity<String>("Неверный логин или пароль", HttpStatus.PRECONDITION_FAILED);
    }

    private Boolean isAlreadyLoggedIn(String principalName) {
        Map user = sessionRepository.findByIndexNameAndIndexValue(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, principalName);
        return user.size() > 0;
    }
}
