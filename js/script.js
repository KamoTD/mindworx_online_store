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