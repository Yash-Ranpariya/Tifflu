package com.tifflu;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*") // Allow frontend to call this
public class MenuController {

    private final MenuItemDAO menuItemDAO;

    public MenuController(MenuItemDAO menuItemDAO) {
        this.menuItemDAO = menuItemDAO;
    }

    @GetMapping
    public List<MenuItem> getAllMenuItems() {
        return menuItemDAO.findAll();
    }

    @PostMapping
    public Map<String, Object> addMenuItem(@RequestBody MenuItem menuItem) {
        Map<String, Object> response = new HashMap<>();
        try {
            menuItemDAO.save(menuItem);
            response.put("success", true);
            response.put("message", "Menu item added successfully");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error adding menu item: " + e.getMessage());
        }
        return response;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> deleteMenuItem(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            menuItemDAO.deleteById(id);
            response.put("success", true);
            response.put("message", "Menu item deleted successfully");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error deleting menu item: " + e.getMessage());
        }
        return response;
    }
}
