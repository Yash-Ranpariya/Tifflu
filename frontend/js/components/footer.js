/**
 * Footer Component
 */
export const renderFooter = (targetId) => {
    const footer = document.getElementById(targetId);
    if (!footer) return;

    footer.innerHTML = `
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <a href="#/" class="logo" style="margin-bottom: 1rem; display: inline-block;">
                        <i class="ri-restaurant-2-fill"></i> TiFFLu
                    </a>
                    <p style="color: #bbb; margin-bottom: 1.5rem;">
                        Premium tiffin delivery service bringing authentic homemade taste directly to your doorstep.
                    </p>
                    <div style="display: flex; gap: 1rem;">
                        <a href="#" class="btn-icon" style="background: rgba(255,255,255,0.1); color: white;"><i class="ri-facebook-fill"></i></a>
                        <a href="#" class="btn-icon" style="background: rgba(255,255,255,0.1); color: white;"><i class="ri-instagram-fill"></i></a>
                        <a href="#" class="btn-icon" style="background: rgba(255,255,255,0.1); color: white;"><i class="ri-twitter-fill"></i></a>
                    </div>
                </div>

                <div class="footer-col">
                    <h3>Quick Links</h3>
                    <ul class="footer-links">
                        <li><a href="#/">Home</a></li>
                        <li><a href="#/menu">Explore Menu</a></li>
                        <li><a href="#/subscription">Subscriptions</a></li>
                        <li><a href="#/contact">Contact Us</a></li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h3>For Vendors</h3>
                    <ul class="footer-links">
                        <li><a href="#/partner">Become a Partner</a></li>
                        <li><a href="#/dashboard">Vendor Dashboard</a></li>
                        <li><a href="#/terms">Terms of Service</a></li>
                        <li><a href="#/privacy">Privacy Policy</a></li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h3>Contact</h3>
                    <ul class="footer-links">
                        <li style="display: flex; gap: 0.5rem;"><i class="ri-map-pin-line"></i> 123 Foodie Street, Indore</li>
                        <li style="display: flex; gap: 0.5rem;"><i class="ri-phone-line"></i> +91 98765 43210</li>
                        <li style="display: flex; gap: 0.5rem;"><i class="ri-mail-line"></i> support@tifflu.com</li>
                    </ul>
                </div>
            </div>
            
            <div class="copyright">
                <p>&copy; 2024 TiFFLu. All rights reserved.</p>
            </div>
        </div>
    `;
};
