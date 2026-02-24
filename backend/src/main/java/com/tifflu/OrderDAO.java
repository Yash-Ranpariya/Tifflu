package com.tifflu;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class OrderDAO {

    private final JdbcTemplate jdbcTemplate;

    public OrderDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public Long createOrder(Order order, List<OrderItem> items) {
        String sql = "INSERT INTO Orders (customer_id, vendor_id, total_amount, payment_status, payment_method, delivery_fee, order_status) VALUES (?, ?, ?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, order.getCustomerId());
            ps.setString(2, order.getVendorId());
            ps.setBigDecimal(3, order.getTotalAmount());
            ps.setString(4, order.getPaymentStatus());
            ps.setString(5, order.getPaymentMethod());
            ps.setBigDecimal(6, order.getDeliveryFee());
            ps.setString(7, order.getOrderStatus());
            return ps;
        }, keyHolder);

        Long orderId = keyHolder.getKey().longValue();

        String itemSql = "INSERT INTO Order_Items (order_id, menu_item_id, quantity, price_at_order) VALUES (?, ?, ?, ?)";
        for (OrderItem item : items) {
            jdbcTemplate.update(itemSql, orderId, item.getMenuItemId(), item.getQuantity(), item.getPriceAtOrder());
        }

        return orderId;
    }

    public List<DashboardDTO.OrderSummary> findRecentOrders(String userId, boolean isVendor) {
        String column = isVendor ? "vendor_id" : "customer_id";
        String sql = "SELECT o.order_id, o.placed_at, o.order_status, o.total_amount, " +
                "(SELECT count(*) FROM Order_Items oi WHERE oi.order_id = o.order_id) as item_count " +
                "FROM Orders o WHERE " + column + " = ? ORDER BY o.placed_at DESC LIMIT 5";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            return new DashboardDTO.OrderSummary(
                    rs.getLong("order_id"),
                    rs.getInt("item_count") + " Items", // Simplified description for now
                    rs.getTimestamp("placed_at").toString(),
                    rs.getString("order_status"),
                    rs.getBigDecimal("total_amount"));
        }, userId);
    }

    public DashboardDTO.Stats getStats(String userId, boolean isVendor) {
        DashboardDTO.Stats stats = new DashboardDTO.Stats();

        if (isVendor) {
            String sql = "SELECT " +
                    "COUNT(*) as total, " +
                    "SUM(CASE WHEN order_status = 'pending' THEN 1 ELSE 0 END) as pending, " +
                    "COALESCE(SUM(CASE WHEN DATE(placed_at) = CURDATE() THEN total_amount ELSE 0 END), 0) as earnings "
                    +
                    "FROM Orders WHERE vendor_id = ? AND DATE(placed_at) = CURDATE()";

            jdbcTemplate.query(sql, rs -> {
                if (rs.next()) {
                    stats.setTodayOrders(rs.getInt("total"));
                    stats.setPendingOrders(rs.getInt("pending"));
                    stats.setTodayEarnings(rs.getBigDecimal("earnings"));
                }
                return null;
            }, userId);
        } else {
            String sql = "SELECT COUNT(*) as active FROM Orders WHERE customer_id = ? AND order_status IN ('pending', 'cooking', 'out_for_delivery')";
            jdbcTemplate.query(sql, rs -> {
                if (rs.next()) {
                    stats.setActiveOrders(rs.getInt("active"));
                }
                return null;
            }, userId);
            stats.setWalletBalance(java.math.BigDecimal.valueOf(500)); // Mock wallet
        }

        return stats;
    }

    public void updateStatus(Long orderId, String status) {
        String sql = "UPDATE Orders SET order_status = ? WHERE order_id = ?";
        jdbcTemplate.update(sql, status, orderId);

        if (status.equals("delivered")) {
            String deliveredSql = "UPDATE Orders SET delivered_at = NOW(), payment_status = 'paid' WHERE order_id = ?";
            jdbcTemplate.update(deliveredSql, orderId);
        }
    }

    public List<OrderDTO> findAllOrdersByUserId(String userId, boolean isVendor) {
        String column = isVendor ? "vendor_id" : "customer_id";
        // Fetch Orders
        String orderSql = "SELECT o.order_id, o.placed_at, o.order_status, o.total_amount, " +
                "v.business_name as vendor_name, u.full_name as customer_name " +
                "FROM Orders o " +
                "LEFT JOIN Vendors v ON o.vendor_id = v.vendor_id " +
                "LEFT JOIN Users u ON o.customer_id = u.user_id " + // Join to get customer name
                "WHERE o." + column + " = ? ORDER BY o.placed_at DESC";

        List<OrderDTO> orders = jdbcTemplate.query(orderSql, (rs, rowNum) -> {
            Long orderId = rs.getLong("order_id");
            return new OrderDTO(
                    orderId,
                    rs.getTimestamp("placed_at").toString(),
                    rs.getString("order_status"),
                    rs.getBigDecimal("total_amount"),
                    new java.util.ArrayList<>(), // Placeholder for items
                    rs.getString("vendor_name"));
        }, userId);

        // Fetch Items for each order (N+1 problem, but acceptable for small scale)
        String itemSql = "SELECT oi.quantity, oi.price_at_order, m.name " +
                "FROM Order_Items oi " +
                "JOIN Menu_Items m ON oi.menu_item_id = m.menu_item_id " +
                "WHERE oi.order_id = ?";

        for (OrderDTO order : orders) {
            List<OrderDTO.OrderItemDTO> items = jdbcTemplate.query(itemSql, (rs, rowNum) -> {
                return new OrderDTO.OrderItemDTO(
                        rs.getString("name"),
                        rs.getInt("quantity"),
                        rs.getBigDecimal("price_at_order"));
            }, order.getOrderId());
            order.setItems(items);
        }

        return orders;
    }
}
