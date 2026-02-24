/**
 * Home Page Component
 */
import { renderFoodCard } from '../components/food-card.js';

const mockFeatured = [
    {
        id: 1,
        name: "Deluxe Veg Thali",
        price: 150,
        description: "Complete meal with Paneer Butter Masala, Dal Fry, 3 Rotis, Rice, Salad, and Sweet.",
        image: "assets/deluxe_veg_thali.png",
        rating: 4.8,
        reviews: 124,
        category: "Hotel",
        isVeg: true,
        time: "35 min"
    },
    {
        id: 2,
        name: "Homestyle Dal Chawal",
        price: 80,
        description: "Comfort food at its best. Yellow Dal Tadka with Steamed Basmati Rice and Pickle.",
        image: "assets/dal_makhani.png",
        rating: 4.5,
        reviews: 89,
        category: "Homemade",
        isVeg: true,
        time: "25 min"
    },
    {
        id: 3,
        name: "Paneer Tikka Masala",
        price: 180,
        description: "Spicy and flavorful Paneer Tikka gravy served with 2 Butter Naans.",
        image: "assets/paneer_tikka.png",
        rating: 4.9,
        reviews: 210,
        category: "Mess",
        isVeg: true,
        time: "40 min"
    }
];

export const renderHome = async () => {
    const featuredHtml = mockFeatured.map(item => renderFoodCard(item)).join('');

    return `
        <!-- Hero Section -->
        <section class="hero-section" style="position: relative; min-height: 90vh; display: flex; align-items: center; overflow: hidden;">
            <div class="container grid-2" style="align-items: center; position: relative;">
                <div class="hero-content reveal-on-scroll">
                    <span style="display: inline-block; padding: 0.5rem 1rem; background: rgba(255, 107, 53, 0.1); color: var(--primary); border-radius: 50px; font-weight: 600; margin-bottom: 1rem;">
                        <i class="ri-rocket-line"></i> #1 Tiffin Service in Indore
                    </span>
                    <h1 style="font-size: 3.5rem; margin-bottom: 1.5rem;">
                        Craving <span class="text-primary">Ghar Ka Khana?</span> <br> We Deliver Love.
                    </h1>
                    <p style="font-size: 1.2rem; color: #666; margin-bottom: 2rem; max-width: 500px;">
                        Explore top-rated Hotels, Messes, and Homemade Tiffin services near you. Fresh, hygienic, and affordable.
                    </p>
                    <div style="display: flex; gap: 1rem;">
                        <a href="#/menu" class="btn btn-primary mouse-parallax" data-mouse-speed="0.5">Order Now <i class="ri-arrow-right-line"></i></a>
                        <a href="#/subscription" class="btn btn-secondary mouse-parallax" data-mouse-speed="0.2">Get Subscription</a>
                    </div>
                    
                    <div style="margin-top: 3rem; display: flex; gap: 2rem;">
                        <div>
                            <h3 style="margin-bottom: 0; font-size: 1.5rem;">500+</h3>
                            <p style="font-size: 0.9rem; color: #888;">Daily Orders</p>
                        </div>
                        <div>
                            <h3 style="margin-bottom: 0; font-size: 1.5rem;">50+</h3>
                            <p style="font-size: 0.9rem; color: #888;">Food Partners</p>
                        </div>
                    </div>
                </div>
                
                <div class="hero-image reveal-on-scroll delay-200" style="position: relative;">
                    <img src="assets/standard_veg_thali.png" alt="Delicious Thali" class="mouse-parallax" data-mouse-speed="-0.5" style="width: 100%; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.2)); transition: transform 0.1s ease-out;">
                    
                    <!-- Floating Badge -->
                    <div class="glass-card animate-pulse mouse-parallax" data-mouse-speed="-1" style="position: absolute; bottom: 10%; left: 0; padding: 1rem; display: flex; align-items: center; gap: 1rem; max-width: 250px;">
                        <div style="background: #E8F5E9; color: #2E7D32; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <i class="ri-leaf-fill"></i>
                        </div>
                        <div>
                            <h4 style="margin: 0; font-size: 1rem;">100% Pure Veg</h4>
                            <p style="margin: 0; font-size: 0.8rem; color: #666;">Hygiene Guaranteed</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Background Elements (Parallax) -->
            <div class="parallax" data-speed="0.2" style="position: absolute; top: 10%; left: 5%; font-size: 2rem; color: var(--primary); opacity: 0.2; transform: rotate(-15deg);">🍅</div>
            <div class="parallax" data-speed="-0.3" style="position: absolute; bottom: 15%; right: 45%; font-size: 2.5rem; color: var(--secondary); opacity: 0.2; transform: rotate(15deg);">🥬</div>
            <div class="parallax" data-speed="0.1" style="position: absolute; top: 50%; right: 10%; font-size: 3rem; color: var(--info); opacity: 0.1;">🥕</div>
        </section>

        <!-- Categories Section -->
        <section class="section-padding reveal-on-scroll" style="background: var(--surface);">
            <div class="container">
                <div class="text-center" style="margin-bottom: 3rem;">
                    <h2>Order From Your Favorite Source</h2>
                    <p style="color: #666;">Choose from verified kitchens across the city</p>
                </div>
                
                <div class="grid-3">
                    <div class="card glass-card text-center reveal-on-scroll delay-100" style="cursor: pointer; transition: transform 0.3s;" onclick="window.location.hash='#/menu?category=Hotel'">
                        <div style="background: #FFF3E0; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 2rem; color: var(--primary);">
                            <i class="ri-hotel-line"></i>
                        </div>
                        <h3>Premium Hotels</h3>
                        <p style="color: #666;">Restaurant style taste with wide variety of cuisines.</p>
                    </div>

                    <div class="card glass-card text-center reveal-on-scroll delay-200" style="cursor: pointer; transition: transform 0.3s;" onclick="window.location.hash='#/menu?category=Mess'">
                        <div style="background: #E8F5E9; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 2rem; color: var(--secondary);">
                            <i class="ri-community-line"></i>
                        </div>
                        <h3>Student Mess</h3>
                        <p style="color: #666;">Budget friendly daily meals perfect for students.</p>
                    </div>

                    <div class="card glass-card text-center reveal-on-scroll delay-300" style="cursor: pointer; transition: transform 0.3s;" onclick="window.location.hash='#/menu?category=Homemade'">
                        <div style="background: #E3F2FD; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 2rem; color: var(--info);">
                            <i class="ri-home-smile-line"></i>
                        </div>
                        <h3>Homemade</h3>
                        <p style="color: #666;">Authentic "Maa ke haath ka swaad" from local kitchens.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Featured Section -->
        <section class="section-padding reveal-on-scroll">
            <div class="container">
                <div style="display: flex; justify-content: space-between; align-items: end; margin-bottom: 3rem;">
                    <div>
                        <h2>Popular Today</h2>
                        <p style="color: #666;">Most ordered items in your area</p>
                    </div>
                    <a href="#/menu" class="btn btn-secondary btn-sm">View All <i class="ri-arrow-right-line"></i></a>
                </div>
                
                <div class="grid-3">
                    ${featuredHtml}
                </div>
            </div>
        </section>
        
        <!-- App Download CTA -->
        <section class="section-padding reveal-on-scroll" style="background: var(--primary);">
            <div class="container grid-2" style="align-items: center;">
                <div style="color: white;">
                    <h2 class="reveal-on-scroll delay-100">Get the Full Experience</h2>
                    <p class="reveal-on-scroll delay-200" style="margin-bottom: 2rem; opacity: 0.9;">Download our mobile app to track your live orders, get exclusive discounts, and manage subscriptions on the go.</p>
                    <div class="reveal-on-scroll delay-300" style="display: flex; gap: 1rem;">
                        <button class="btn" style="background: black; color: white; border: 1px solid rgba(255,255,255,0.2);">
                            <i class="ri-google-play-fill" style="font-size: 1.5rem;"></i> Play Store
                        </button>
                        <button class="btn" style="background: black; color: white; border: 1px solid rgba(255,255,255,0.2);">
                            <i class="ri-apple-fill" style="font-size: 1.5rem;"></i> App Store
                        </button>
                    </div>
                </div>
                <div class="reveal-on-scroll delay-400" style="text-align: center;">
                     <!-- Placeholder for phone mockup if we had one -->
                     <i class="ri-smartphone-line mouse-parallax" data-mouse-speed="0.3" style="font-size: 10rem; color: rgba(255,255,255,0.2);"></i>
                </div>
            </div>
        </section>
    `;
};
