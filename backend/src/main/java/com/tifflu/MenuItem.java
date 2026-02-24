package com.tifflu;

import java.math.BigDecimal;

public class MenuItem {
    private Long itemId;
    private String vendorId;
    private Long categoryId;
    private String name;
    private String description;
    private BigDecimal price;
    private String itemType;
    private Boolean isVeg;
    private String imageUrl;
    private Boolean isAvailable;
    private Boolean isChefSpecial;

    public MenuItem() {
    }

    public MenuItem(Long itemId, String vendorId, Long categoryId, String name, String description, BigDecimal price,
            String itemType, Boolean isVeg, String imageUrl, Boolean isAvailable, Boolean isChefSpecial) {
        this.itemId = itemId;
        this.vendorId = vendorId;
        this.categoryId = categoryId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.itemType = itemType;
        this.isVeg = isVeg;
        this.imageUrl = imageUrl;
        this.isAvailable = isAvailable;
        this.isChefSpecial = isChefSpecial;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getVendorId() {
        return vendorId;
    }

    public void setVendorId(String vendorId) {
        this.vendorId = vendorId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getItemType() {
        return itemType;
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public Boolean getIsVeg() {
        return isVeg;
    }

    public void setIsVeg(Boolean isVeg) {
        this.isVeg = isVeg;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public Boolean getIsChefSpecial() {
        return isChefSpecial;
    }

    public void setIsChefSpecial(Boolean isChefSpecial) {
        this.isChefSpecial = isChefSpecial;
    }
}
