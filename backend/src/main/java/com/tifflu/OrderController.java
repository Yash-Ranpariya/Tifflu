package com.tifflu;

import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderDAO orderDAO;
    private final MenuItemDAO menuItemDAO;

    public OrderController(OrderDAO orderDAO, MenuItemDAO menuItemDAO) {
        this.orderDAO = orderDAO;
        this.menuItemDAO = menuItemDAO;
    }

    @PostMapping
    public Map<String, Object> createOrder(@RequestBody OrderRequest orderRequest) {
        Map<String, Object> response = new HashMap<>();

        try {
            // 1. Fetch all items to get details and vendor info
            List<MenuItem> allMenuItems = menuItemDAO.findAll();
            Map<Long, MenuItem> itemMap = allMenuItems.stream()
                    .collect(Collectors.toMap(MenuItem::getItemId, item -> item));

            // 2. Group request items by vendor
            Map<String, List<OrderRequest.OrderItemRequest>> itemsByVendor = new HashMap<>();

            for (OrderRequest.OrderItemRequest reqItem : orderRequest.getItems()) {
                MenuItem dbItem = itemMap.get(reqItem.getId());
                if (dbItem == null) {
                    throw new RuntimeException("Item not found: " + reqItem.getId());
                }
                itemsByVendor.computeIfAbsent(dbItem.getVendorId(), k -> new ArrayList<>()).add(reqItem);
            }

            // 3. Create orders for each vendor
            List<Long> orderIds = new ArrayList<>();

            for (Map.Entry<String, List<OrderRequest.OrderItemRequest>> entry : itemsByVendor.entrySet()) {
                String vendorId = entry.getKey();
                List<OrderRequest.OrderItemRequest> vendorItems = entry.getValue();

                BigDecimal totalAmount = BigDecimal.ZERO;
                List<OrderItem> orderItems = new ArrayList<>();

                for (OrderRequest.OrderItemRequest vi : vendorItems) {
                    MenuItem dbItem = itemMap.get(vi.getId());
                    BigDecimal lineTotal = dbItem.getPrice().multiply(BigDecimal.valueOf(vi.getQuantity()));
                    totalAmount = totalAmount.add(lineTotal);

                    OrderItem oi = new OrderItem();
                    oi.setMenuItemId(dbItem.getItemId());
                    oi.setQuantity(vi.getQuantity());
                    oi.setPriceAtOrder(dbItem.getPrice());
                    orderItems.add(oi);
                }

                Order order = new Order();
                order.setCustomerId(orderRequest.getUserId());
                order.setVendorId(vendorId);
                order.setTotalAmount(totalAmount);
                order.setPaymentStatus("paid"); // Assuming success for now
                order.setPaymentMethod(orderRequest.getPaymentMethod());
                order.setDeliveryFee(BigDecimal.valueOf(20)); // Flat fee
                order.setOrderStatus("pending");

                Long newOrderId = orderDAO.createOrder(order, orderItems);
                orderIds.add(newOrderId);
            }

            response.put("success", true);
            response.put("message", "Orders placed successfully");
            response.put("orderIds", orderIds);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Order failed: " + e.getMessage());
        }

        return response;
    }

    @PutMapping("/{orderId}/status")
    public Map<String, Object> updateStatus(@PathVariable Long orderId, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        orderDAO.updateStatus(orderId, status);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        return response;
    }

    @GetMapping
    public List<OrderDTO> getOrders(@RequestParam String userId,
            @RequestParam(defaultValue = "false") boolean isVendor) {
        return orderDAO.findAllOrdersByUserId(userId, isVendor);
    }
}
