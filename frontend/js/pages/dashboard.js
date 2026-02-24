/**
 * User Dashboard
 */
export const renderDashboard = async () => {
    const user = window.app.store.getState().user;

    if (!user) {
        return `<div class="container section-padding text-center">
            <h2>Please Login to view Dashboard</h2>
            <a href="#/login" class="btn btn-primary">Login</a>
        </div>`;
    }

    // Helper Functions
    window.updateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`http://localhost:9090/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                // Refresh dashboard by re-rendering
                const content = document.getElementById('main-content');
                if (content) content.innerHTML = await renderDashboard();
                window.showToast('Order status updated to ' + newStatus, 'success');
            } else {
                window.showToast('Failed to update status', 'error');
            }
        } catch (e) {
            console.error(e);
            window.showToast('Error updating status', 'error');
        }
    };

    // Order Simulation
    window.simulateOrderTracking = () => {
        const statuses = ['Pending', 'Accepted', 'Cooking', 'Packing', 'Out for Delivery', 'Delivered'];
        let i = 0;

        window.showToast(`Order Status: ${statuses[0]}`, 'info');

        const interval = setInterval(() => {
            i++;
            if (i < statuses.length) {
                const status = statuses[i];
                let type = 'info';
                if (status === 'Delivered') type = 'success';
                else if (status === 'Out for Delivery') type = 'warning';

                window.showToast(`Order Status: ${status}`, type);
            } else {
                clearInterval(interval);
            }
        }, 2000); // Update every 2 seconds
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#FFF3E0';
            case 'cooking': return '#E3F2FD';
            case 'delivered': return '#E8F5E9';
            case 'cancelled': return '#FFEBEE';
            default: return '#eee';
        }
    };

    const getStatusTextColor = (status) => {
        switch (status) {
            case 'pending': return 'orange';
            case 'cooking': return 'blue';
            case 'delivered': return 'green';
            case 'cancelled': return 'red';
            default: return '#666';
        }
    };

    let stats = {};
    let recentOrders = [];

    try {
        const response = await fetch(`http://localhost:9090/api/dashboard/${user.userId}`);
        const data = await response.json();

        if (data.success) {
            stats = data.stats;
            recentOrders = data.recentOrders;
        }
    } catch (e) {
        console.warn("Failed to load backend dashboard data, using local data only", e);
    }

    // MERGE LOCAL/SIMULATED ORDERS
    const localOrders = window.app.store.getState().myOrders || [];
    // Combine and sort by date desc
    recentOrders = [...localOrders, ...recentOrders].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Update stats based on local orders if backend stats are missing or to augment them
    if (!stats.activeOrders) stats.activeOrders = 0;

    // Count active local orders
    const activeLocal = localOrders.filter(o => ['pending', 'cooking', 'packing', 'out for delivery'].includes(o.status.toLowerCase())).length;

    // If backend fetch failed, stats are empty. If it succeeded, it only knows backend orders.
    // We should ideally sum them up, but simpler is to just count from our merged list for consistency in this simulation.
    const allActive = recentOrders.filter(o => ['pending', 'cooking', 'packing', 'out for delivery'].includes(o.status.toLowerCase())).length;
    stats.activeOrders = allActive;

    // Vendor Layout
    if (['Hotel', 'Mess', 'Homemade'].includes(user.role)) {
        return `
        <section class="section-padding">
            <div class="container">
                <div class="animate-fade-in" style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 3rem;">
                   <img src="${user.profile_image_url || user.avatar || 'https://ui-avatars.com/api/?name=' + (user.fullName || user.name || 'User')}" alt="Profile" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid var(--primary);">
                    <div>
                        <h1 style="margin-bottom: 0.5rem;">Hello, ${user.fullName || user.name}!</h1>
                        <p style="color: #666; text-transform: capitalize;">${user.role} Dashboard</p>
                    </div>
                </div>

                <div class="grid-3">
                    <div class="card glass-card animate-fade-in delay-100">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h3 style="margin: 0;">Today's Orders</h3>
                            <i class="ri-restaurant-line" style="font-size: 1.5rem; color: var(--primary);"></i>
                        </div>
                        <div style="font-size: 2.5rem; font-weight: 700;">${stats.todayOrders || 0}</div>
                        <p style="color: #666; font-size: 0.9rem;">${stats.pendingOrders || 0} Pending</p>
                    </div>
                    <div class="card glass-card animate-fade-in delay-200">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h3 style="margin: 0;">Total Earnings</h3>
                            <i class="ri-money-rupee-circle-line" style="font-size: 1.5rem; color: var(--success);"></i>
                        </div>
                        <div style="font-size: 2.5rem; font-weight: 700;">₹${stats.todayEarnings || 0}</div>
                        <p style="color: #666; font-size: 0.9rem;">Today's revenue</p>
                    </div>
                    <div class="card glass-card animate-fade-in delay-300">
                         <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h3 style="margin: 0;">Menu Items</h3>
                            <i class="ri-list-check" style="font-size: 1.5rem; color: var(--info);"></i>
                        </div>
                        <div style="font-size: 2.5rem; font-weight: 700;">${window.app.store.getState().menuItems.filter(i => i.category === user.role).length}</div>
                        <button class="btn btn-sm btn-secondary" style="margin-top: 0.5rem;" onclick="window.location.hash='#/manage-menu'">Manage Menu</button>
                    </div>
                </div>

                <div style="margin-top: 3rem;">
                    <h2 class="animate-fade-in delay-400">Recent Orders</h2>
                    <div class="card animate-fade-in delay-500" style="padding: 0; overflow: hidden; margin-top: 1.5rem;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead style="background: rgba(0,0,0,0.03);">
                                <tr>
                                    <th style="padding: 1rem; text-align: left;">Order ID</th>
                                    <th style="padding: 1rem; text-align: left;">Items</th>
                                    <th style="padding: 1rem; text-align: left;">Date</th>
                                    <th style="padding: 1rem; text-align: left;">Status</th>
                                    <th style="padding: 1rem; text-align: right;">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${recentOrders.length > 0 ? recentOrders.map(order => `
                                    <tr style="border-bottom: 1px solid #eee;">
                                        <td style="padding: 1rem;">#ORD-${order.orderId}</td>
                                        <td style="padding: 1rem;">${order.description}</td>
                                        <td style="padding: 1rem;">${new Date(order.date).toLocaleDateString()}</td>
                                        <td style="padding: 1rem;">
                                            <span style="background: ${getStatusColor(order.status)}; color: ${getStatusTextColor(order.status)}; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">${order.status}</span>
                                        </td>
                                        <td style="padding: 1rem; text-align: right;">
                                            ${['Hotel', 'Mess', 'Homemade'].includes(user.role) && order.status !== 'delivered' && order.status !== 'cancelled' ? `
                                                <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                                                    ${order.status === 'pending' ? `
                                                        <button class="btn btn-sm btn-primary" onclick="updateOrderStatus(${order.orderId}, 'cooking')">Accept</button>
                                                    ` : ''}
                                                    ${order.status === 'cooking' ? `
                                                        <button class="btn btn-sm btn-success" onclick="updateOrderStatus(${order.orderId}, 'delivered')">Deliver</button>
                                                    ` : ''}
                                                </div>
                                            ` : `₹${order.amount}`}
                                        </td>
                                    </tr>
                                `).join('') : `<tr><td colspan="5" style="padding: 1rem; text-align: center;">No orders yet.</td></tr>`}
                            </tbody>
                        </table>
                    </div>
                        </table>
                    </div>
                    <div style="text-align: center; margin-top: 1rem;">
                        <button class="btn btn-secondary" onclick="window.location.hash='#/orders'">View All Orders</button>
                    </div>
                </div>
            </div>
        </section>`;
    } else {
        // Customer Layout
        return `
        <section class="section-padding">
            <div class="container">
                <div class="animate-fade-in" style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 3rem;">
                   <img src="${user.profile_image_url || user.avatar || 'https://ui-avatars.com/api/?name=' + (user.fullName || user.name || 'User')}" alt="Profile" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid var(--primary);">
                    <div>
                        <h1 style="margin-bottom: 0.5rem;">Hello, ${user.fullName || user.name}!</h1>
                        <p style="color: #666;">Customer Dashboard</p>
                    </div>
                </div>

                <div class="grid-3">
                    <div class="card glass-card animate-fade-in delay-100">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h3 style="margin: 0;">Active Orders</h3>
                            <i class="ri-shopping-bag-3-line" style="font-size: 1.5rem; color: var(--primary);"></i>
                        </div>
                        <div style="font-size: 2.5rem; font-weight: 700;">${stats.activeOrders || 1}</div>
                        <p style="color: #666; font-size: 0.9rem;">Items in progress</p>
                        <button class="btn btn-sm btn-primary" style="margin-top: 0.5rem; width: 100%;" onclick="window.simulateOrderTracking()">Track Live Order</button>
                    </div>
                    <div class="card glass-card animate-fade-in delay-200">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h3 style="margin: 0;">Wallet Balance</h3>
                            <i class="ri-wallet-3-line" style="font-size: 1.5rem; color: var(--success);"></i>
                        </div>
                        <div style="font-size: 2.5rem; font-weight: 700;">₹${stats.walletBalance || 0}</div>
                        <button class="btn btn-sm btn-secondary" style="margin-top: 0.5rem;">Top Up</button>
                    </div>
                    <div class="card glass-card animate-fade-in delay-300">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h3 style="margin: 0;">Subscription</h3>
                            <i class="ri-calendar-check-line" style="font-size: 1.5rem; color: var(--info);"></i>
                        </div>
                        <div style="font-size: 1.2rem; font-weight: 600; color: #888;">Inactive</div>
                        <p style="color: #666; font-size: 0.9rem;">Explore plans</p>
                    </div>
                </div>

                <div style="margin-top: 3rem;">
                    <h2 class="animate-fade-in delay-400">Recent Orders</h2>
                    <div class="card animate-fade-in delay-500" style="padding: 0; overflow: hidden; margin-top: 1.5rem;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead style="background: rgba(0,0,0,0.03);">
                                <tr>
                                    <th style="padding: 1rem; text-align: left;">Order ID</th>
                                    <th style="padding: 1rem; text-align: left;">Items</th>
                                    <th style="padding: 1rem; text-align: left;">Date</th>
                                    <th style="padding: 1rem; text-align: left;">Status</th>
                                    <th style="padding: 1rem; text-align: right;">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${recentOrders.length > 0 ? recentOrders.map(order => `
                                    <tr style="border-bottom: 1px solid #eee;">
                                        <td style="padding: 1rem;">#ORD-${order.orderId}</td>
                                        <td style="padding: 1rem;">${order.description}</td>
                                        <td style="padding: 1rem;">${new Date(order.date).toLocaleDateString()}</td>
                                        <td style="padding: 1rem;"><span style="background: ${getStatusColor(order.status)}; color: ${getStatusTextColor(order.status)}; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">${order.status}</span></td>
                                        <td style="padding: 1rem; text-align: right;">₹${order.amount}</td>
                                    </tr>
                                `).join('') : `<tr><td colspan="5" style="padding: 1rem; text-align: center;">No orders yet.</td></tr>`}
                            </tbody>
                        </table>
                    </div>
                </div>
                 <div style="text-align: center; margin-top: 1rem;">
                    <button class="btn btn-secondary" onclick="window.location.hash='#/orders'">View All Orders</button>
                </div>
            </div>
        </section>`;
    }
};
