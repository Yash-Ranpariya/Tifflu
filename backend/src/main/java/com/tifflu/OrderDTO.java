package com.tifflu;

import java.math.BigDecimal;
import java.util.List;

public class OrderDTO {
    private Long orderId;
    private String placedAt;
    private String status;
    private BigDecimal totalAmount;
    private List<OrderItemDTO> items;
    private String vendorName; // Helpful for customers
    private String customerName; // Helpful for vendors

    public OrderDTO(Long orderId, String placedAt, String status, BigDecimal totalAmount, List<OrderItemDTO> items,
            String vendorName) {
        this.orderId = orderId;
        this.placedAt = placedAt;
        this.status = status;
        this.totalAmount = totalAmount;
        this.items = items;
        this.vendorName = vendorName;
    }

    // Getters and Setters
    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getPlacedAt() {
        return placedAt;
    }

    public void setPlacedAt(String placedAt) {
        this.placedAt = placedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    public String getVendorName() {
        return vendorName;
    }

    public void setVendorName(String vendorName) {
        this.vendorName = vendorName;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public static class OrderItemDTO {
        private String itemName;
        private int quantity;
        private BigDecimal price;

        public OrderItemDTO(String itemName, int quantity, BigDecimal price) {
            this.itemName = itemName;
            this.quantity = quantity;
            this.price = price;
        }

        public String getItemName() {
            return itemName;
        }

        public int getQuantity() {
            return quantity;
        }

        public BigDecimal getPrice() {
            return price;
        }
    }
}
