package com.tifflu;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MenuItemDAO {

    private final JdbcTemplate jdbcTemplate;

    public MenuItemDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<MenuItem> menuItemRowMapper = (rs, rowNum) -> new MenuItem(
            rs.getLong("item_id"),
            rs.getString("vendor_id"),
            rs.getLong("category_id"),
            rs.getString("name"),
            rs.getString("description"),
            rs.getBigDecimal("price"),
            rs.getString("item_type"),
            rs.getBoolean("is_veg"),
            rs.getString("image_url"),
            rs.getBoolean("is_available"),
            rs.getBoolean("is_chef_special"));

    public List<MenuItem> findAll() {
        String sql = "SELECT * FROM Menu_Items";
        return jdbcTemplate.query(sql, menuItemRowMapper);
    }

    public void save(MenuItem item) {
        String sql = "INSERT INTO Menu_Items (vendor_id, category_id, name, description, price, item_type, is_veg, image_url, is_available, is_chef_special) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, item.getVendorId(), item.getCategoryId(), item.getName(), item.getDescription(),
                item.getPrice(), item.getItemType(), item.getIsVeg(), item.getImageUrl(), item.getIsAvailable(),
                item.getIsChefSpecial());
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM Menu_Items WHERE item_id = ?";
        jdbcTemplate.update(sql, id);
    }
}
