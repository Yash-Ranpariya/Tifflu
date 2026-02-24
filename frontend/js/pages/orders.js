/**
 * Orders Page
 */
export const renderOrders = async () => {
    const user = window.app.store.getState().user;

    if (!user) {
        return `<div class="container section-padding text-center">
            <h2>Please Login to view Orders</h2>
            <a href="#/login" class="btn btn-primary">Login</a>
        </div>`;
    }

    let orders = [];
    try {
        const res = await fetch(`http://localhost:9090/api/orders?userId=${user.userId}&isVendor=${['Hotel', 'Mess', 'Homemade'].includes(user.role)}`);
        const data = await res.json();
        if (Array.isArray(data)) {
            orders = data;
        }
    } catch (e) {
        console.error("Failed to fetch orders", e);
        window.showToast("Failed to load order history", "error");
    }

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

    return `
    <section class="section-padding">
        <div class="container">
            <h2 class="animate-fade-in">Order History</h2>
            <p style="color: #666; margin-bottom: 2rem;" class="animate-fade-in delay-100">View and track all your past orders.</p>

            <div class="card animate-fade-in delay-200" style="padding: 0; overflow: hidden;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead style="background: rgba(0,0,0,0.03);">
                        <tr>
                            <th style="padding: 1rem; text-align: left;">Order ID</th>
                            <th style="padding: 1rem; text-align: left;">Placed On</th>
                            <th style="padding: 1rem; text-align: left;">${['Hotel', 'Mess', 'Homemade'].includes(user.role) ? 'Customer' : 'Vendor'}</th>
                            <th style="padding: 1rem; text-align: left;">Items</th>
                            <th style="padding: 1rem; text-align: left;">Status</th>
                            <th style="padding: 1rem; text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.length > 0 ? orders.map(order => `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 1rem;">#ORD-${order.orderId}</td>
                                <td style="padding: 1rem;">${new Date(order.placedAt).toLocaleString()}</td>
                                <td style="padding: 1rem;">${['Hotel', 'Mess', 'Homemade'].includes(user.role) ? (order.customerName || 'Unknown') : (order.vendorName || 'Unknown')}</td>
                                <td style="padding: 1rem;">
                                    <ul style="margin: 0; padding-left: 1rem; font-size: 0.9rem; color: #555;">
                                        ${order.items.map(item => `<li>${item.quantity}x ${item.itemName}</li>`).join('')}
                                    </ul>
                                </td>
                                <td style="padding: 1rem;">
                                    <span style="background: ${getStatusColor(order.status)}; color: ${getStatusTextColor(order.status)}; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">${order.status}</span>
                                </td>
                                <td style="padding: 1rem; text-align: right; font-weight: bold;">₹${order.totalAmount}</td>
                            </tr>
                        `).join('') : `<tr><td colspan="6" style="padding: 2rem; text-align: center; color: #888;">No orders found.</td></tr>`}
                    </tbody>
                </table>
            </div>
        </div>
    </section>
    `;
};
