package com.tifflu;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final OrderDAO orderDAO;
    private final UserDAO userDAO;

    public DashboardController(OrderDAO orderDAO, UserDAO userDAO) {
        this.orderDAO = orderDAO;
        this.userDAO = userDAO;
    }

    @GetMapping("/{userId}")
    public Map<String, Object> getDashboard(@PathVariable String userId) {
        Map<String, Object> response = new HashMap<>();

        // 1. Check if user exists and get role
        // For simplicity, we might just assume role or fetch user
        // Ideally we fetch user to know if vendor or customer
        // But since we don't have userDAO.findById easily exposed or used here,
        // let's rely on frontend telling us? No, security risk.
        // Let's rely on OrderDAO which handles both logic based on boolean flag.
        // Wait, I need to know if it is a vendor.

        // Let's add findById to UserDAO or re-use findByPhoneNumber if we had it by ID.
        // Actually UserDAO has `userRowMapper` but only `findByPhoneNumber`.
        // Let's assume we can pass role as query param or fetch user.
        // I will quick-fix UserDAO to add findById.

        // For now, I'll attempt to fetch user logic inline or just trust the frontend?
        // No.
        // Let's quickly ADD findById to UserDAO in next step.
        // For this file, I'll assume userDAO.findById(userId) exists.

        User user = userDAO.findById(userId);
        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return response;
        }

        boolean isVendor = !user.getRole().equals("customer") && !user.getRole().equals("delivery_partner"); // Simplify

        DashboardDTO.Stats stats = orderDAO.getStats(userId, isVendor);
        List<DashboardDTO.OrderSummary> recentOrders = orderDAO.findRecentOrders(userId, isVendor);

        response.put("success", true);
        response.put("stats", stats);
        response.put("recentOrders", recentOrders);
        return response;
    }
}
