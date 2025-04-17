const cart = [];

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ 
            name: productName, 
            price: price,
            quantity: 1
        });
    }
    
    updateCart();
    updateCartCount();
    
    showNotification(`${productName} added to cart`);
}

function removeFromCart(productName) {
    const index = cart.findIndex(item => item.name === productName);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCart();
        updateCartCount();
    }
}

function updateCart() {
    const cartElement = document.getElementById('cart');
    if (!cartElement) return;
    
    cartElement.innerHTML = '<h2>Your Shopping Cart</h2>';
    
    if (cart.length === 0) {
        cartElement.innerHTML += '<p>Your cart is empty</p>';
        return;
    }
    
    let subtotal = 0;
    let totalItems = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        totalItems += item.quantity;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>R${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-price">R${itemTotal.toFixed(2)}</div>
            <button class="remove-item" onclick="removeFromCart('${item.name}')">×</button>
        `;
        
        cartElement.appendChild(itemDiv);
    });
    
    cartElement.innerHTML += `
        <div class="cart-total">
            <p>Subtotal (${totalItems} items): R${subtotal.toFixed(2)}</p>
        </div>
    `;
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function showAlternateImage(productId) {
    const container = document.querySelector(`[data-product="${productId}"]`).parentNode;
    const images = container.querySelectorAll('.product-image');
    
    images.forEach(img => {
        if (img.classList.contains('active')) {
            img.classList.remove('active');
            setTimeout(() => {
                img.style.opacity = '0';
            }, 10);
        } else {
            img.classList.add('active');
            setTimeout(() => {
                img.style.opacity = '1';
            }, 10);
        }
    });
}

function validateCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s+/g, '');
    return /^\d{16,19}$/.test(cleaned);
}

function validateExpirationDate(expiration) {
    if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(expiration)) {
        return false;
    }
    
    const [month, year] = expiration.split('/');
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    if (parseInt(year) < currentYear) {
        return false;
    }
    
    if (parseInt(year) === currentYear && parseInt(month) < currentMonth) {
        return false;
    }
    
    return true;
}

function validateCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
}

function validateAndCheckout() {
    const cardNumber = document.getElementById('cardNumber').value;
    const expiration = document.getElementById('expiration').value;
    const cvv = document.getElementById('cvv').value;
    const nameOnCard = document.getElementById('nameOnCard').value;
    
    document.getElementById('cardNumberError').style.display = 'none';
    document.getElementById('expirationError').style.display = 'none';
    document.getElementById('cvvError').style.display = 'none';
    
    let isValid = true;
    
    if (!validateCardNumber(cardNumber)) {
        document.getElementById('cardNumberError').textContent = 'Please enter a valid card number';
        document.getElementById('cardNumberError').style.display = 'block';
        isValid = false;
    }
    
    if (!validateExpirationDate(expiration)) {
        document.getElementById('expirationError').textContent = 'Please enter a valid expiration date (MM/YY)';
        document.getElementById('expirationError').style.display = 'block';
        isValid = false;
    }
    
    if (!validateCVV(cvv)) {
        document.getElementById('cvvError').textContent = 'Please enter a valid CVV (3 or 4 digits)';
        document.getElementById('cvvError').style.display = 'block';
        isValid = false;
    }
    
    if (!nameOnCard.trim()) {
        alert('Please enter the name on card');
        isValid = false;
    }
    
    if (cart.length === 0) {
        alert('Your cart is empty');
        isValid = false;
    }
    
    if (isValid) {
        checkout();
    }
}

function checkout() {
    alert('Checkout Successful! Thank you for your purchase.');
    
    cart.length = 0;
    updateCart();
    updateCartCount();
    
    document.getElementById('payment-form').reset();
}

document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});

if (window.location.pathname.includes('store.html')) {
    updateCart();
}

function updateAuthNav() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');

    if (currentUser) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'inline';
    } else {
        loginLink.style.display = 'inline';
        logoutLink.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', updateAuthNav);
function showWelcomeMessage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const welcomeMessage = document.getElementById('welcome-message');

    if (currentUser) {
        welcomeMessage.style.display = 'block';
        welcomeMessage.innerHTML = `
            <h3>Welcome back, ${currentUser.name}!</h3>
            <p>Enjoy your shopping experience at Tech Haven. Check out our <a href="store.html">latest tech products</a>.</p>
        `;
    } else {
        welcomeMessage.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    updateAuthNav();
    showWelcomeMessage();
});

function showPersonalizedRecommendations() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const recommendationsSection = document.getElementById('personalized-recommendations');

    if (currentUser) {
        recommendationsSection.style.display = 'block';
        // For demo, we'll just show some featured products
        const recommendedProducts = [
            { name: 'PowerBook Pro Max 15', price: 18999.00, image: 'images/images2.jfif' },
            { name: 'NVIDIA RTX 4090 Founders Edition', price: 35999.00, image: 'images/images2.jfif' }
        ];

        const productsContainer = recommendationsSection.querySelector('.recommended-products');
        productsContainer.innerHTML = recommendedProducts.map(product => `
            <div class="product-card">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </div>
                <h4>${product.name}</h4>
                <p class="price">R${product.price.toLocaleString('en-ZA')}.00</p>
                <button class="add-to-cart-btn" onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
            </div>
        `).join('');
    } else {
        recommendationsSection.style.display = 'none';
    }
}

if (window.location.pathname.includes('store.html')) {
    document.addEventListener('DOMContentLoaded', showPersonalizedRecommendations);
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(animateCounters, 1);
        } else {
            counter.innerText = target;
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(animateCounters, 500);

    const valueCards = document.querySelectorAll('.value-card');
    valueCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            const icon = this.querySelector('svg');
            if (icon) {
                icon.style.fill = '#00d2ff';
            }
        });

        card.addEventListener('mouseleave', function () {
            const icon = this.querySelector('svg');
            if (icon) {
                icon.style.fill = '#3a7bd5';
            }
        });
    });

    const techLogos = document.querySelectorAll('.tech-logo');
    techLogos.forEach(logo => {
        logo.addEventListener('click', function () {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1.1)';
            }, 100);
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }

            console.log('Form submitted:', { name, email, subject, message });

            alert('Thank you for your message! Our tech team will get back to you soon.');

            contactForm.reset();
        });
    }

    const inputs = document.querySelectorAll('.tech-input, .tech-textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.querySelector('.input-underline').style.width = '100%';
        });

        input.addEventListener('blur', function () {
            if (!this.value) {
                this.parentElement.querySelector('.input-underline').style.width = '0';
            }
        });
    });

    const supportCards = document.querySelectorAll('.support-card');
    supportCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            const icon = this.querySelector('svg');
            if (icon) {
                icon.style.fill = '#2a6bc5';
            }
        });

        card.addEventListener('mouseleave', function () {
            const icon = this.querySelector('svg');
            if (icon) {
                icon.style.fill = '#3a7bd5';
            }
        });
    });
});