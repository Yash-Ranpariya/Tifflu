package com.tifflu;

import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "*")
public class SubscriptionController {

    private final SubscriptionDAO subscriptionDAO;

    public SubscriptionController(SubscriptionDAO subscriptionDAO) {
        this.subscriptionDAO = subscriptionDAO;
    }

    @PostMapping
    public Map<String, Object> createSubscription(@RequestBody Subscription subscription) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Set defaults if missing (though simplified)
            if (subscription.getStartDate() == null)
                subscription.setStartDate(LocalDate.now());
            // Logic to calculate endDate based on plan could be here, but for now assuming
            // frontend sends it or we default
            if (subscription.getEndDate() == null)
                subscription.setEndDate(LocalDate.now().plusDays(30));

            subscription.setStatus("active");
            subscriptionDAO.save(subscription);

            response.put("success", true);
            response.put("message", "Subscription created successfully");
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
        }
        return response;
    }

    @GetMapping("/user/{userId}")
    public List<Subscription> getUserSubscriptions(@PathVariable String userId) {
        return subscriptionDAO.findByCustomerId(userId);
    }

    // Just for testing/demo, usually vendor needs specific endpoint
    @GetMapping("/vendor/{vendorId}")
    public List<Subscription> getVendorSubscriptions(@PathVariable String vendorId) {
        return subscriptionDAO.findByVendorId(vendorId);
    }
}
