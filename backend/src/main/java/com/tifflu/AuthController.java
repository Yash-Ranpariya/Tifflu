package com.tifflu;

import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.UUID;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allow frontend to call this
public class AuthController {

    private final UserDAO userDAO;

    public AuthController(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> payload) {
        String phone = payload.get("phone");
        String password = payload.get("password");
        String name = payload.get("name");
        String role = payload.getOrDefault("role", "customer");

        Map<String, Object> response = new HashMap<>();

        if (userDAO.findByPhoneNumber(phone) != null) {
            response.put("success", false);
            response.put("message", "User already exists");
            return response;
        }

        User newUser = new User(UUID.randomUUID().toString(), phone, password, name, role);
        userDAO.save(newUser);

        if (role.equals("Hotel") || role.equals("Mess") || role.equals("Homemade")) {
            userDAO.createVendorProfile(newUser.getUserId(), name + " " + role, role);
        }

        response.put("success", true);
        response.put("message", "User registered successfully");
        return response;
    }

    @GetMapping("/ping")
    public Map<String, Object> ping() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "pong");
        response.put("status", "alive");
        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> payload) {
        String phone = payload.get("phone");
        String password = payload.get("password");

        Map<String, Object> response = new HashMap<>();

        if (userDAO == null) {
            response.put("success", false);
            response.put("message", "Server Error: UserDAO is null");
            return response;
        }

        User user = userDAO.findByPhoneNumber(phone);

        if (user != null && user.getPasswordHash().equals(password)) {
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("user", user);
        } else {
            response.put("success", false);
            response.put("message", "Invalid credentials");
        }
        return response;
    }
}
