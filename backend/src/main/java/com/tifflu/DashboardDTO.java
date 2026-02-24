package com.tifflu;

import java.math.BigDecimal;
import java.util.List;

public class DashboardDTO {
    private Stats stats;
    private List<OrderSummary> recentOrders;

    public DashboardDTO(Stats stats, List<OrderSummary> recentOrders) {
        this.stats = stats;
        this.recentOrders = recentOrders;
    }

    public Stats getStats() {
        return stats;
    }

    public List<OrderSummary> getRecentOrders() {
        return recentOrders;
    }

    public static class Stats {
        // Vendor Stats
        private int todayOrders;
        private int pendingOrders;
        private BigDecimal todayEarnings;

        // Customer Stats
        private int activeOrders;
        private BigDecimal walletBalance;

        public Stats() {
        }

        public int getTodayOrders() {
            return todayOrders;
        }

        public void setTodayOrders(int todayOrders) {
            this.todayOrders = todayOrders;
        }

        public int getPendingOrders() {
            return pendingOrders;
        }

        public void setPendingOrders(int pendingOrders) {
            this.pendingOrders = pendingOrders;
        }

        public BigDecimal getTodayEarnings() {
            return todayEarnings;
        }

        public void setTodayEarnings(BigDecimal todayEarnings) {
            this.todayEarnings = todayEarnings;
        }

        public int getActiveOrders() {
            return activeOrders;
        }

        public void setActiveOrders(int activeOrders) {
            this.activeOrders = activeOrders;
        }

        public BigDecimal getWalletBalance() {
            return walletBalance;
        }

        public void setWalletBalance(BigDecimal walletBalance) {
            this.walletBalance = walletBalance;
        }
    }

    public static class OrderSummary {
        private Long orderId;
        private String description; // e.g. "Veg Thali x2"
        private String date;
        private String status;
        private BigDecimal amount;

        public OrderSummary(Long orderId, String description, String date, String status, BigDecimal amount) {
            this.orderId = orderId;
            this.description = description;
            this.date = date;
            this.status = status;
            this.amount = amount;
        }

        public Long getOrderId() {
            return orderId;
        }

        public String getDescription() {
            return description;
        }

        public String getDate() {
            return date;
        }

        public String getStatus() {
            return status;
        }

        public BigDecimal getAmount() {
            return amount;
        }
    }
}
