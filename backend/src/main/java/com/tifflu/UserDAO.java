package com.tifflu;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class UserDAO {

    private final JdbcTemplate jdbcTemplate;

    public UserDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<User> userRowMapper = (rs, rowNum) -> new User(
            rs.getString("user_id"),
            rs.getString("phone_number"),
            rs.getString("password_hash"),
            rs.getString("full_name"),
            rs.getString("role"));

    public void save(User user) {
        String sql = "INSERT INTO Users (user_id, phone_number, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, user.getUserId(), user.getPhoneNumber(), user.getPasswordHash(), user.getFullName(),
                user.getRole());
    }

    public User findByPhoneNumber(String phoneNumber) {
        String sql = "SELECT * FROM Users WHERE phone_number = ?";
        List<User> users = jdbcTemplate.query(sql, userRowMapper, phoneNumber);
        return users.isEmpty() ? null : users.get(0);
    }

    public User findById(String userId) {
        String sql = "SELECT * FROM Users WHERE user_id = ?";
        List<User> users = jdbcTemplate.query(sql, userRowMapper, userId);
        return users.isEmpty() ? null : users.get(0);
    }

    public void createVendorProfile(String userId, String businessName, String businessType) {
        String sql = "INSERT INTO Vendors (vendor_id, business_name, business_type) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, userId, businessName, businessType);
    }
}
