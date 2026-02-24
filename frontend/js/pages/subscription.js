/**
 * Subscription Page
 */
export const renderSubscription = () => {
    window.handleSubscribe = async (planName, price, days) => {
        const user = window.app.store.getState().user;
        if (!user) {
            window.showToast('Please login to subscribe.', 'info');
            window.location.hash = '#/login';
            return;
        }

        // For demo, we subscribe to a default "Best Tiffin" vendor or let user pick?
        // Let's just hardcode a vendor ID for now or use the first one available in store.
        const vendors = window.app.store.getState().menuItems.map(i => i.vendorId).filter(v => v);
        const vendorId = vendors.length > 0 ? vendors[0] : 'admin';

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + days);

        const payload = {
            customerId: user.userId,
            vendorId: vendorId, // Subscribing to first available vendor for demo
            planName: planName,
            price: price,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            status: 'active'
        };

        try {
            const res = await fetch('http://localhost:9090/api/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                window.showToast(`Successfully subscribed to ${planName}!`, 'success');
                window.location.hash = '#/dashboard';
            } else {
                window.showToast('Subscription failed: ' + data.message, 'error');
            }
        } catch (e) {
            console.error(e);
            window.showToast('Error connecting to server', 'error');
        }
    };

    return `
        <section class="section-padding text-center">
            <div class="container animate-fade-in">
                <span class="text-primary" style="font-weight: 600; letter-spacing: 1px;">SAVE MORE</span>
                <h1 style="margin-bottom: 1rem;">Tiffin Subscription Plans</h1>
                <p style="color: #666; margin-bottom: 3rem; max-width: 600px; margin-left: auto; margin-right: auto;">
                    Subscribe to your favorite tiffin service and forget the hassle of daily ordering. Get amazing discounts!
                </p>

                <div class="grid-3">
                    <!-- Weekly -->
                    <div class="card animate-fade-in delay-100" style="border: 1px solid #eee;">
                        <h3 style="margin-bottom: 0.5rem; color: #666;">Weekly Plan</h3>
                        <div style="font-size: 2.5rem; font-weight: 700; color: var(--text-main); margin-bottom: 1rem;">₹800 <span style="font-size: 1rem; font-weight: 400; color: #999;">/ week</span></div>
                        <ul style="text-align: left; margin-bottom: 2rem; color: #666;">
                            <li style="margin-bottom: 0.5rem;"><i class="ri-check-line text-primary"></i> 6 Days Service (Mon-Sat)</li>
                            <li style="margin-bottom: 0.5rem;"><i class="ri-check-line text-primary"></i> Lunch Only</li>
                            <li style="margin-bottom: 0.5rem;"><i class="ri-check-line text-primary"></i> Free Delivery</li>
                        </ul>
                        <button class="btn btn-secondary" style="width: 100%;" onclick="handleSubscribe('Weekly Plan', 800, 7)">Choose Plan</button>
                    </div>

                    <!-- Monthly (Best Value) -->
                    <div class="card animate-fade-in delay-200" style="border: 2px solid var(--primary); transform: scale(1.05); box-shadow: var(--shadow-lg);">
                        <div style="background: var(--primary); color: white; padding: 0.5rem; margin: -1.5rem -1.5rem 1.5rem -1.5rem; border-radius: 12px 12px 0 0; font-weight: 600;">RECOMMENDED</div>
                        <h3 style="margin-bottom: 0.5rem; color: var(--primary);">Monthly Plan</h3>
                        <div style="font-size: 2.5rem; font-weight: 700; color: var(--text-main); margin-bottom: 1rem;">₹3000 <span style="font-size: 1rem; font-weight: 400; color: #999;">/ mo</span></div>
                        <ul style="text-align: left; margin-bottom: 2rem; color: #666;">
                            <li style="margin-bottom: 0.5rem;"><i class="ri-check-line text-primary"></i> 26 Days Service</li>
                            <li style="margin-bottom: 0.5rem;"><i class="ri-check-line text-primary"></i> Lunch & Dinner Options</li>
                            <li style="margin-bottom: 0.5rem;"><i class="ri-check-line text-primary"></i> Weekend Specials</li>
                            <li style="margin-bottom: 0.5rem;"><i class="ri-check-line text-primary"></i> 2 Skips Allowed</li>
                        </ul>
                        <button class="btn btn-primary" style="width: 100%;" onclick="handleSubscribe('Monthly Plan', 3000, 30)">Choose Plan</button>
                    </div>

                    <!-- Trial -->
                    <div class="card animate-fade-in delay-300" style="border: 1px solid #eee;">
                        <h3 style="margin-bottom: 0.5rem; color: #666;">3-Day Trial</h3>
                        <div style="font-size: 2.5rem; font-weight: 700; color: var(--text-main); margin-bottom: 1rem;">₹350 <span style="font-size: 1rem; font-weight: 400; color: #999;">/ 3 days</span></div>
                         <ul style="text-align: left; margin-bottom: 2rem; color: #666;">
                            <li style="margin-bottom: 0.5rem;"><i class="ri-check-line text-primary"></i> Try 3 Different Vendors</li>
                            <li style="margin-bottom: 0.5rem;"><i class="ri-check-line text-primary"></i> Lunch Only</li>
                            <li style="margin-bottom: 0.5rem;"><i class="ri-close-line text-muted"></i> Delivery Charges Apply</li>
                        </ul>
                        <button class="btn btn-secondary" style="width: 100%;" onclick="handleSubscribe('3-Day Trial', 350, 3)">Choose Plan</button>
                    </div>
                </div>
            </div>
        </section>
    `;
};
