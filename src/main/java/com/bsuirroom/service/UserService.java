package com.bsuirroom.service;

import com.bsuirroom.config.JwtTokenProvider;
import com.bsuirroom.config.dto.LoginRequest;
import com.bsuirroom.config.dto.LoginResponse;
import com.bsuirroom.config.dto.Token;
import com.bsuirroom.config.dto.UserProfile;
import com.bsuirroom.config.util.CookieUtil;
import com.bsuirroom.entity.Role;
import com.bsuirroom.entity.User;
import com.bsuirroom.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Collections;
import java.util.List;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    private final CookieUtil cookieUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, CookieUtil cookieUtil) {
        this.userRepository = userRepository;
        this.cookieUtil = cookieUtil;
    }

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        UserDetails userDetails = this.userRepository.findUserByUsername(s).orElseThrow(() -> {
            return new UsernameNotFoundException("User not found with username : " + s);
        });
        return userDetails;
    }

    public ResponseEntity<LoginResponse> login(LoginRequest loginRequest, String accessToken, String refreshToken) {
        String username = loginRequest.getUsername();
        User user = userRepository.findUserByUsername(username).orElseThrow(() -> {
            throw new IllegalArgumentException("User not found with email " + username);
        });

        Boolean accessTokenValid = tokenProvider.validateToken(accessToken);
        Boolean refreshTokenValid = tokenProvider.validateToken(refreshToken);
        System.out.println(user);
        HttpHeaders responseHeaders = new HttpHeaders();
        Token newAccessToken;
        Token newRefreshToken;
        if (!accessTokenValid && !refreshTokenValid) {
            newAccessToken = tokenProvider.generateToken(user);
            newRefreshToken = tokenProvider.generateRefreshToken(user);
            addAccessTokenCookie(responseHeaders, newAccessToken);
            addRefreshTokenCookie(responseHeaders, newRefreshToken);
        }

        if (!accessTokenValid && refreshTokenValid) {
            newAccessToken = tokenProvider.generateToken(user);
            addAccessTokenCookie(responseHeaders, newAccessToken);
        }

        if (accessTokenValid && refreshTokenValid) {
            newAccessToken = tokenProvider.generateToken(user);
            newRefreshToken = tokenProvider.generateRefreshToken(user);
            addAccessTokenCookie(responseHeaders, newAccessToken);
            addRefreshTokenCookie(responseHeaders, newRefreshToken);
        }

        LoginResponse loginResponse = new LoginResponse(LoginResponse.SuccessFailure.SUCCESS, "Auth successful. Tokens are created in cookie.");
        return ResponseEntity.ok().headers(responseHeaders).body(loginResponse);
    }

    public ResponseEntity<LoginResponse> refresh(String accessToken, String refreshToken) {
        Boolean refreshTokenValid = tokenProvider.validateToken(refreshToken);
        if (!refreshTokenValid) {
            LoginResponse loginResponse = new LoginResponse(LoginResponse.SuccessFailure.FAILURE, "Invalid refresh token !");
            return ResponseEntity.ok().body(loginResponse);
        }

        String username = tokenProvider.getUsername(refreshToken);
        User user = userRepository.findUserByUsername(username).orElseThrow(() -> new IllegalArgumentException("User not found with email " + username));

        Token newAccessToken = tokenProvider.generateToken(user);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.add(HttpHeaders.SET_COOKIE, cookieUtil.createAccessTokenCookie(newAccessToken.getTokenValue(), newAccessToken.getDuration()).toString());

        LoginResponse loginResponse = new LoginResponse(LoginResponse.SuccessFailure.SUCCESS, "Auth successful. Tokens are created in cookie.");
        return ResponseEntity.ok().headers(responseHeaders).body(loginResponse);
    }

    public UserProfile getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) this.loadUserByUsername(authentication.getName());
        UserProfile userProfile = new UserProfile();
        userProfile.setId(user.getId());
        userProfile.setUsername(user.getUsername());
        userProfile.setRoles(user.getRoles());
        return userProfile;
    }

    public User getAuthUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) this.loadUserByUsername(authentication.getName());
    }

    public String addNewUser(User user) throws BadCredentialsException{
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if(this.userRepository.findUserByUsername(user.getUsername()).isPresent()){
            throw new BadCredentialsException("Пользователь с такими именем пользователя уже существует");
        }
        this.userRepository.save(user);
        return "Пользователь успешно добавлен";
    }

    public String logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        SecurityContextHolder.clearContext();
        session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        if (request.getCookies() != null) {
            System.out.println("i found some cookies");
            for (Cookie cookie : request.getCookies()) {
                cookie.setMaxAge(0);
                cookie.setValue("");
                cookie.setHttpOnly(true);
                cookie.setPath("/");
                response.addCookie(cookie);
            }
        }
        return "logout successfully";
    }

    private void addAccessTokenCookie(HttpHeaders httpHeaders, Token token) {
        httpHeaders.add(HttpHeaders.SET_COOKIE, cookieUtil.createAccessTokenCookie(token.getTokenValue(), token.getDuration()).toString());
    }

    private void addRefreshTokenCookie(HttpHeaders httpHeaders, Token token) {
        httpHeaders.add(HttpHeaders.SET_COOKIE, cookieUtil.createRefreshTokenCookie(token.getTokenValue(), token.getDuration()).toString());
    }

    public List<User> getAllUsers(){
        return this.userRepository.findAll();
    }

    public void deleteUser(String username){
        User user = this.userRepository.findUserByUsername(username).orElseThrow(() -> {
            throw new UsernameNotFoundException("User not founded");
        });
        this.userRepository.delete(user);
    }

    public User editUser(User user){
        User userFromDB = this.userRepository.findById(user.getId())
                .orElseThrow(() -> {
                    throw new UsernameNotFoundException("Пользователь не найден");
                });
        if(userFromDB != null){
            if(user.getPassword().isEmpty()){
                BeanUtils.copyProperties(user, userFromDB, "id", "password");
            } else {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                BeanUtils.copyProperties(user, userFromDB, "id");
            }
            return this.userRepository.save(userFromDB);
        }
        return user;
    }
}
