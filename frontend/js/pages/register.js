/**
 * Register/Signup Page
 */
export const renderRegister = () => {
    // Function to handle form submission
    window.handleRegister = async (e) => {
        e.preventDefault();

        const fullname = document.getElementById('fullname').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value || 'customer';

        if (fullname && phone && password) {
            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> Creating Account...';
            btn.disabled = true;

            try {
                const response = await fetch('http://localhost:9090/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: fullname,
                        phone: phone,
                        password: password,
                        role: role
                    })
                });

                // API might return plain string "User registered successfully" or JSON
                const contentType = response.headers.get("content-type");
                let data;
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    data = await response.json();
                } else {
                    const text = await response.text();
                    data = { message: text, success: response.ok };
                }

                if (response.ok && (data.success || data.message.includes("success"))) {
                    // Auto-login after registration
                    try {
                        const loginResponse = await fetch('http://localhost:9090/api/auth/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ phone: phone, password: password })
                        });
                        const loginData = await loginResponse.json();

                        if (loginData.success) {
                            window.app.store.login(loginData.user);
                            window.showToast('Registration successful! Logging you in...', 'success');
                            window.location.hash = '#/dashboard';
                        } else {
                            window.showToast('Registration successful! Please login manually.', 'success');
                            window.location.hash = '#/login';
                        }
                    } catch (loginError) {
                        console.error('Auto-login error:', loginError);
                        window.location.hash = '#/login';
                    }
                } else {
                    window.showToast('Registration failed: ' + (data.message || data), 'error');
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }
            } catch (error) {
                console.error('Registration error:', error);
                window.showToast('Registration failed: ' + error.message, 'error');
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        }
    };

    return `
        <section class="section-padding" style="min-height: 80vh; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at 10% 10%, rgba(255,107,53,0.05) 0%, transparent 50%);">
            <div class="card glass-card animate-fade-in" style="width: 100%; max-width: 400px; padding: 2.5rem;">
                <div class="text-center" style="margin-bottom: 2rem;">
                    <h1 style="font-size: 2rem; color: var(--primary);">Create Account</h1>
                    <p style="color: #666;">Join Tifflu today</p>
                </div>
                
                <form onsubmit="handleRegister(event)">
                    <div class="input-group">
                        <label class="input-label">Full Name</label>
                        <input type="text" id="fullname" class="input-field" placeholder="John Doe" required>
                    </div>

                    <div class="input-group">
                        <label class="input-label">Phone Number</label>
                        <input type="text" id="phone" class="input-field" placeholder="9876543210" required>
                    </div>
                    
                    <div class="input-group">
                        <label class="input-label">Password</label>
                        <input type="password" id="password" class="input-field" placeholder="Create a password" required>
                    </div>

                    <div class="input-group">
                        <label class="input-label">Role</label>
                        <select id="role" class="input-field">
                            <option value="customer">Customer</option>
                            <option value="Hotel">Hotel Owner</option>
                            <option value="Mess">Mess Owner</option>
                            <option value="Homemade">Homemade Food Provider</option>
                            <option value="delivery_partner">Delivery Partner</option>
                        </select>
                    </div>

                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        Sign Up <i class="ri-user-add-line"></i>
                    </button>
                </form>

                <div class="text-center" style="margin-top: 1.5rem; font-size: 0.9rem;">
                    <p>Already have an account? <a href="#/login" class="text-primary" style="font-weight: 600;">Login</a></p>
                </div>
            </div>
        </section>
    `;
};
