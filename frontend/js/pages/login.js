/**
 * Login/Signup Page
 */
export const renderLogin = () => {
    // Function to handle form submission
    window.handleLogin = async (e) => {
        e.preventDefault();
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;

        if (phone && password) {
            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> Logging in...';
            btn.disabled = true;

            try {
                const response = await fetch('http://localhost:9090/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ phone: phone, password: password })
                });

                const data = await response.json();

                if (data.success) {
                    window.app.store.login(data.user);
                    window.showToast('Login successful!', 'success');
                    window.location.hash = '#/dashboard';
                } else {
                    window.showToast('Login failed: ' + data.message, 'error');
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }
            } catch (error) {
                console.error('Login error:', error);
                window.showToast('Login failed: Server unavailable', 'error');
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        }
    };

    return `
        <section class="section-padding" style="min-height: 80vh; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at 10% 10%, rgba(255,107,53,0.05) 0%, transparent 50%);">
            <div class="card glass-card animate-fade-in" style="width: 100%; max-width: 400px; padding: 2.5rem;">
                <div class="text-center" style="margin-bottom: 2rem;">
                    <h1 style="font-size: 2rem; color: var(--primary);">Welcome Back</h1>
                    <p style="color: #666;">Login to manage your tiffins</p>
                </div>
                
                <form onsubmit="handleLogin(event)" data-type="login">
                    <div class="input-group">
                        <label class="input-label">Phone Number</label>
                        <input type="text" id="phone" class="input-field" placeholder="9876543210" required>
                    </div>
                    
                    <div class="input-group">
                        <label class="input-label">Password</label>
                        <input type="password" id="password" class="input-field" placeholder="••••••••" required>
                    </div>

                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        Login <i class="ri-login-box-line"></i>
                    </button>
                </form>

                <div class="text-center" style="margin-top: 1.5rem; font-size: 0.9rem;">
                    <p>Don't have an account? <a href="#/register" class="text-primary" style="font-weight: 600;">Sign up</a></p>
                </div>
            </div>
        </section>
    `;
};
