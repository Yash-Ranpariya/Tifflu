package com.tifflu;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SubscriptionDAO {
    private final JdbcTemplate jdbcTemplate;

    public SubscriptionDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Subscription> rowMapper = (rs, rowNum) -> {
        Subscription s = new Subscription();
        s.setSubscriptionId(rs.getLong("subscription_id"));
        s.setCustomerId(rs.getString("customer_id"));
        s.setVendorId(rs.getString("vendor_id"));
        s.setPlanName(rs.getString("plan_name"));
        s.setPrice(rs.getBigDecimal("price"));
        s.setStartDate(rs.getDate("start_date").toLocalDate());
        s.setEndDate(rs.getDate("end_date").toLocalDate());
        s.setStatus(rs.getString("status"));
        s.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return s;
    };

    public void save(Subscription s) {
        String sql = "INSERT INTO Subscriptions (customer_id, vendor_id, plan_name, price, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, s.getCustomerId(), s.getVendorId(), s.getPlanName(), s.getPrice(), s.getStartDate(),
                s.getEndDate(), s.getStatus());
    }

    public List<Subscription> findByCustomerId(String customerId) {
        String sql = "SELECT * FROM Subscriptions WHERE customer_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, rowMapper, customerId);
    }

    // For vendor to see subscribers usage
    public List<Subscription> findByVendorId(String vendorId) {
        String sql = "SELECT * FROM Subscriptions WHERE vendor_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, rowMapper, vendorId);
    }
}
