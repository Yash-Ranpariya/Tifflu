package com.tifflu;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Order {
    private Long orderId;
    private String customerId;
    private String vendorId;
    private String partnerId;
    private String orderStatus;
    private String paymentStatus;
    private String paymentMethod;
    private BigDecimal totalAmount;
    private BigDecimal deliveryFee;
    private BigDecimal taxAmount;
    private String specialInstructions;
    private LocalDateTime placedAt;
    private LocalDateTime deliveredAt;

    public Order() {
    }

    public Order(Long orderId, String customerId, String vendorId, String partnerId, String orderStatus,
            String paymentStatus, String paymentMethod, BigDecimal totalAmount, BigDecimal deliveryFee,
            BigDecimal taxAmount, String specialInstructions, LocalDateTime placedAt, LocalDateTime deliveredAt) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.vendorId = vendorId;
        this.partnerId = partnerId;
        this.orderStatus = orderStatus;
        this.paymentStatus = paymentStatus;
        this.paymentMethod = paymentMethod;
        this.totalAmount = totalAmount;
        this.deliveryFee = deliveryFee;
        this.taxAmount = taxAmount;
        this.specialInstructions = specialInstructions;
        this.placedAt = placedAt;
        this.deliveredAt = deliveredAt;
    }

    // Getters and Setters
    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getVendorId() {
        return vendorId;
    }

    public void setVendorId(String vendorId) {
        this.vendorId = vendorId;
    }

    public String getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(String partnerId) {
        this.partnerId = partnerId;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getDeliveryFee() {
        return deliveryFee;
    }

    public void setDeliveryFee(BigDecimal deliveryFee) {
        this.deliveryFee = deliveryFee;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public String getSpecialInstructions() {
        return specialInstructions;
    }

    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }

    public LocalDateTime getPlacedAt() {
        return placedAt;
    }

    public void setPlacedAt(LocalDateTime placedAt) {
        this.placedAt = placedAt;
    }

    public LocalDateTime getDeliveredAt() {
        return deliveredAt;
    }

    public void setDeliveredAt(LocalDateTime deliveredAt) {
        this.deliveredAt = deliveredAt;
    }
}
