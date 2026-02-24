/**
 * Food Card Component
 */
export const renderFoodCard = (item) => {
    // Generate star rating
    const stars = Array(5).fill(0).map((_, i) =>
        i < Math.floor(item.rating) ? '<i class="ri-star-fill text-warning"></i>' :
            i < item.rating ? '<i class="ri-star-half-fill text-warning"></i>' :
                '<i class="ri-star-line text-muted"></i>'
    ).join('');

    return `
        <div class="card food-card animate-fade-in">
            <div style="position: relative; height: 200px; overflow: hidden; border-radius: 12px 12px 0 0; margin: -1.5rem -1.5rem 1rem -1.5rem;">
                <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                <span style="position: absolute; top: 10px; right: 10px; background: white; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; color: var(--primary); box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    ${item.category}
                </span>
                ${item.isVeg ?
            `<span style="position: absolute; top: 10px; left: 10px; background: white; padding: 4px 6px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <i class="ri-checkbox-circle-fill" style="color: green;"></i>
                    </span>` : ''
        }
            </div>
            
            <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem;">${item.name}</h3>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
                <div style="font-size: 0.9rem;">${stars} <span style="color: #888; font-size: 0.8rem;">(${item.reviews || 0})</span></div>
                <div style="font-size: 0.8rem; color: #666;"><i class="ri-time-line"></i> ${item.time || '30 min'}</div>
            </div>
            
            <p style="color: #666; font-size: 0.9rem; margin-bottom: 1.2rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${item.description}
            </p>
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 1.3rem; font-weight: 700; color: var(--primary);">₹${item.price}</div>
                <button class="btn btn-sm btn-secondary btn-icon" onclick="window.app.store.addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})" style="border-radius: 8px; width: auto; padding: 0 1rem;">
                    <i class="ri-add-line"></i> Add
                </button>
            </div>
        </div>
    `;
};
