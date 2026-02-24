/**
 * Manage Menu Page for Vendors
 */
import { renderFoodCard } from '../components/food-card.js';

export const renderManageMenu = () => {
    const user = window.app.store.getState().user;

    // Security check
    if (!user || user.role === 'customer') {
        return `<div class="container section-padding text-center">
            <h2>Access Denied</h2>
            <p>Only vendors can manage menus.</p>
            <a href="#/dashboard" class="btn btn-primary">Go to Dashboard</a>
        </div>`;
    }

    // Function to handle adding items
    window.handleAddMenuItem = (e) => {
        e.preventDefault();
        const form = e.target;
        const fileInput = form.querySelector('input[name="image"]');
        const file = fileInput.files[0];

        if (!file) {
            window.showToast('Please select an image.', 'error');
            return;
        }

        // Check file size (limit to 500KB to save localStorage space)
        if (file.size > 500000) {
            window.showToast('Image is too large! Please select an image under 500KB.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            const newItem = {
                id: Date.now(),
                name: form.name.value,
                price: parseInt(form.price.value),
                description: form.description.value,
                image: event.target.result, // Base64 string
                rating: 5.0,
                reviews: 0,
                category: user.role,
                isVeg: form.isVeg.checked,
                time: form.time.value + ' min'
            };

            try {
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> Adding...';
                btn.disabled = true;

                // Simulate a small delay for visual feedback since localStorage is instant
                setTimeout(() => {
                    try {
                        window.app.store.addMenuItem(newItem);
                        window.showToast('Item Added Successfully!', 'success');
                        form.reset();

                        // Refresh grid
                        const grid = document.getElementById('vendor-menu-grid');
                        grid.innerHTML = getVendorItemsHTML(user.role);
                    } catch (err) {
                        if (err.name === 'QuotaExceededError') {
                            window.showToast('Storage Full! Cannot save more images. Try clearing some items or using smaller images.', 'error');
                        } else {
                            console.error(err);
                            window.showToast('Failed to add item', 'error');
                        }
                    } finally {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                    }
                }, 500);
            } catch (err) {
                console.error(err);
            }
        };

        reader.readAsDataURL(file);
    };

    // Function to handle deleting items
    window.handleDeleteMenuItem = async (id) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            await window.app.store.deleteMenuItem(id);
            window.showToast('Item deleted successfully', 'success');

            // Refresh grid
            const grid = document.getElementById('vendor-menu-grid');
            grid.innerHTML = getVendorItemsHTML(user.role);
        } catch (error) {
            window.showToast('Failed to delete item', 'error');
        }
    };

    // Helper to get items
    function getVendorItemsHTML(role) {
        const allItems = window.app.store.getState().menuItems;
        const myItems = allItems.filter(item => item.category === role);
        if (myItems.length === 0) return '<p style="color: #666; grid-column: 1/-1; text-align: center;">No items added yet.</p>';
        return myItems.map(item => `
            <div style="position: relative;">
                ${renderFoodCard(item)}
                <button class="btn btn-sm" onclick="window.handleDeleteMenuItem(${item.id})" style="width: 100%; margin-top: -1rem; border-radius: 0 0 12px 12px; background: #fee2e2; color: #dc2626; border: none;">
                    <i class="ri-delete-bin-line"></i> Delete Item
                </button>
            </div>
        `).join('');
    }

    return `
        <section class="section-padding">
            <div class="container">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div>
                        <h1>Manage Your Menu</h1>
                        <p style="color: #666;">Adding items for <strong>${user.role}</strong></p>
                    </div>
                    <a href="#/dashboard" class="btn btn-secondary"><i class="ri-arrow-left-line"></i> Dashboard</a>
                </div>

                <div class="grid-3" style="align-items: start;">
                    <!-- Add Item Form -->
                    <div class="card glass-card">
                        <h3 style="margin-bottom: 1.5rem;">Add New Item</h3>
                        <form onsubmit="handleAddMenuItem(event)">
                            <div class="input-group">
                                <label class="input-label">Item Name</label>
                                <input type="text" name="name" class="input-field" placeholder="e.g. Special Thali" required>
                            </div>

                            <div class="grid-2" style="gap: 1rem;">
                                <div class="input-group">
                                    <label class="input-label">Price (₹)</label>
                                    <input type="number" name="price" class="input-field" placeholder="150" required>
                                </div>
                                <div class="input-group">
                                    <label class="input-label">Prep Time (min)</label>
                                    <input type="number" name="time" class="input-field" placeholder="30" required>
                                </div>
                            </div>

                            <div class="input-group">
                                <label class="input-label">Description</label>
                                <textarea name="description" class="input-field" rows="3" placeholder="Describe the dish..." required></textarea>
                            </div>

                            <div class="input-group">
                                <label class="input-label">Item Image</label>
                                <input type="file" name="image" class="input-field" accept="image/*" required>
                                <p style="font-size: 0.8rem; color: #888; margin-top: 0.5rem;">Recommended: Square JPG/PNG < 1MB</p>
                            </div>

                            <div class="input-group" style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem;">
                                <input type="checkbox" name="isVeg" id="isVeg" checked style="width: 20px; height: 20px;">
                                <label for="isVeg" style="margin: 0;">Is Pure Veg?</label>
                            </div>

                            <button type="submit" class="btn btn-primary" style="width: 100%;">
                                <i class="ri-add-circle-line"></i> Add Item
                            </button>
                        </form>
                    </div>

                    <!-- Current Menu -->
                    <div style="grid-column: span 2;">
                        <h3 style="margin-bottom: 1.5rem;">Your Current Menu</h3>
                        <div id="vendor-menu-grid" class="grid-2">
                            ${getVendorItemsHTML(user.role)}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
};
