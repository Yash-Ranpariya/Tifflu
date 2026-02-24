/**
 * Payment Page
 */
export const renderPayment = () => {
    let selectedPaymentMethod = 'COD';

    window.selectPaymentMethod = (method) => {
        selectedPaymentMethod = method;
        document.querySelectorAll('.payment-option').forEach(el => {
            el.style.border = '1px solid #ddd';
            el.style.opacity = '0.6';
            el.querySelector('i').style.color = '#666';
        });
        const selected = document.getElementById('pm-' + method);
        selected.style.border = '2px solid var(--primary)';
        selected.style.opacity = '1';
        selected.querySelector('i').style.color = 'var(--primary)';
    };

    window.processPayment = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> Processing...';
        btn.disabled = true;

        const state = window.app.store.getState();
        const user = state.user;
        const cart = state.cart;
        const address = document.getElementById('delivery-address').value;

        if (!user) {
            window.showToast('Please login to place an order.', 'info');
            // Optional: Store return URL logic here if we had it
            setTimeout(() => {
                window.location.hash = '#/login';
            }, 1500);
            return;
        }

        const payload = {
            userId: user.userId,
            address: address,
            paymentMethod: selectedPaymentMethod,
            items: cart.map(item => ({
                id: item.id,
                quantity: 1
            }))
        };

        try {
            const response = await fetch('http://localhost:9090/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                window.showToast(`Order Placed Successfully via ${selectedPaymentMethod}!`, 'success');
                window.app.store.setState({ cart: [] });
                window.location.hash = '#/dashboard';
            } else {
                window.showToast('Order Failed: ' + data.message, 'error');
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        } catch (err) {
            console.error('Backend failed, switching to simulation:', err);
            // SIMULATION: If backend fails, pretend it worked

            // Create a mock order
            const mockOrder = {
                orderId: Date.now(),
                date: new Date().toISOString(),
                status: 'pending',
                amount: cart.reduce((sum, i) => sum + i.price, 0) + 20,
                description: cart.map(i => `${i.quantity}x ${i.name}`).join(', '),
                items: cart
            };

            // Save to store for dashboard to pick up
            window.app.store.addSimulatedOrder(mockOrder);

            window.showToast(`Order Placed Successfully via ${selectedPaymentMethod}! (Simulated)`, 'success');
            window.app.store.setState({ cart: [] });
            window.location.hash = '#/dashboard';
        }
    };

    return `
        <section class="section-padding">
            <div class="container" style="max-width: 600px;">
                <div class="card glass-card animate-fade-in">
                    <h2 class="text-center" style="margin-bottom: 2rem;">Secure Checkout</h2>
                    
                    <form onsubmit="processPayment(event)">
                        <div style="margin-bottom: 2rem;">
                            <h4 style="margin-bottom: 1rem;">Delivery Address</h4>
                            <div class="input-group">
                                <label class="input-label">Full Address</label>
                                <textarea id="delivery-address" class="input-field" rows="3" placeholder="Flat No, Building, Street..." required></textarea>
                            </div>
                        </div>

                        <div style="margin-bottom: 2rem;">
                            <h4 style="margin-bottom: 1rem;">Payment Method</h4>
                            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                                <div id="pm-ONLINE" class="card payment-option" onclick="selectPaymentMethod('ONLINE')" 
                                     style="flex: 1; padding: 1rem; border: 1px solid #ddd; cursor: pointer; text-align: center; opacity: 0.6;">
                                    <i class="ri-bank-card-line" style="font-size: 1.5rem; color: #666;"></i>
                                    <div style="font-weight: 600; margin-top: 0.5rem;">UPI / Card</div>
                                </div>
                                <div id="pm-COD" class="card payment-option" onclick="selectPaymentMethod('COD')" 
                                     style="flex: 1; padding: 1rem; border: 2px solid var(--primary); cursor: pointer; text-align: center; opacity: 1;">
                                    <i class="ri-money-rupee-circle-line" style="font-size: 1.5rem; color: var(--primary);"></i>
                                    <div style="font-weight: 600; margin-top: 0.5rem;">Cash on Delivery</div>
                                </div>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%;">
                            Place Order <i class="ri-arrow-right-line"></i>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    `;
};
