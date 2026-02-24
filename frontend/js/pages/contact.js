/**
 * Contact Page
 */
export const renderContact = () => {
    return `
        <section class="section-padding">
            <div class="container grid-2">
                <div class="animate-slide-left">
                    <h1>Get in Touch</h1>
                    <p style="color: #666; margin-bottom: 2rem;">Have questions or want to partner with us?</p>
                    
                    <div style="margin-bottom: 2rem;">
                        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                            <div class="btn-icon"><i class="ri-map-pin-line"></i></div>
                            <div>
                                <h3 style="margin-bottom: 0.2rem;">Headquarters (Indore)</h3>
                                <p style="color: #666;">123 Foodie Street, Vijay Nagar, Indore, MP 452010<br><b>Serving 50+ Cities across India 🇮🇳</b></p>
                            </div>
                        </div>
                        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                            <div class="btn-icon"><i class="ri-phone-line"></i></div>
                            <div>
                                <h3 style="margin-bottom: 0.2rem;">Call Us</h3>
                                <p style="color: #666;">+91 98765 43210</p>
                            </div>
                        </div>
                        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                            <div class="btn-icon"><i class="ri-mail-line"></i></div>
                            <div>
                                <h3 style="margin-bottom: 0.2rem;">Email Us</h3>
                                <p style="color: #666;">hello@tifflu.com</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="animate-slide-right">
                         <div class="card">
                             <h3 style="margin-bottom: 1.5rem;">Send a Message</h3>
                             <form onsubmit="event.preventDefault(); window.showToast('Message sent!', 'success');">
                             <div class="input-group">
                                 <label class="input-label">Name</label>
                                 <input type="text" class="input-field" placeholder="Your Name" required>
                             </div>
                             <div class="input-group">
                                 <label class="input-label">Email</label>
                                 <input type="email" class="input-field" placeholder="Your Email" required>
                             </div>
                             <div class="input-group">
                                 <label class="input-label">Message</label>
                                 <textarea class="input-field" rows="4" placeholder="How can we help?" required></textarea>
                             </div>
                             <button type="submit" class="btn btn-primary" onclick="
                                 const btn = this;
                                 const originalText = btn.innerHTML;
                                 btn.innerHTML = '<i class=\'ri-loader-4-line animate-spin\'></i> Sending...';
                                 btn.disabled = true;
                                 setTimeout(() => {
                                     window.showToast('Message sent!', 'success');
                                     btn.innerHTML = originalText;
                                     btn.disabled = false;
                                     btn.closest('form').reset();
                                 }, 1000);
                             ">Send Message</button>
                         </form>
                    </div>
                </div>
            </div>
        </section>
    `;
};
