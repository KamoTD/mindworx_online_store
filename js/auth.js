document.addEventListener('DOMContentLoaded', function () {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const switchToLogin = document.getElementById('switch-to-login');

    registerTab.addEventListener('click', function () {
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    });

    loginTab.addEventListener('click', function () {
        registerTab.classList.remove('active');
        loginTab.classList.add('active');
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
    });

    switchToLogin.addEventListener('click', function (e) {
        e.preventDefault();
        registerTab.classList.remove('active');
        loginTab.classList.add('active');
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
    });

    const passwordInput = document.getElementById('register-password');
    if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
    }

    const loginFormElement = document.getElementById('loginForm');
    const registerFormElement = document.getElementById('registerForm');

    if (loginFormElement) {
        loginFormElement.addEventListener('submit', handleLogin);
    }

    if (registerFormElement) {
        registerFormElement.addEventListener('submit', handleRegister);
    }

    if (!localStorage.getItem('users')) {
        const demoUsers = [
            {
                id: 1,
                name: 'Demo User',
                email: 'demo@example.com',
                password: 'Password123!'
            }
        ];
        localStorage.setItem('users', JSON.stringify(demoUsers));
    }
});

function togglePassword(inputId, toggleElement) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        toggleElement.textContent = '👁️';
    } else {
        input.type = 'password';
        toggleElement.textContent = '👁️';
    }
}

function checkPasswordStrength() {
    const password = this.value;
    const strengthContainer = this.parentElement;
    const strengthBars = strengthContainer.querySelectorAll('.strength-bar');
    const strengthText = strengthContainer.querySelector('.strength-text');

    strengthContainer.classList.remove('password-weak', 'password-medium', 'password-strong');
    strengthBars.forEach(bar => bar.style.backgroundColor = '#ddd');

    if (password.length === 0) {
        strengthText.textContent = 'Password strength';
        return;
    }

    let strength = 0;

    if (password.length >= 8) strength++;

    if (/\d/.test(password)) strength++;

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;

    if (strength <= 2) {
        strengthContainer.classList.add('password-weak');
        strengthText.textContent = 'Weak';
    } else if (strength === 3) {
        strengthContainer.classList.add('password-medium');
        strengthText.textContent = 'Medium';
    } else {
        strengthContainer.classList.add('password-strong');
        strengthText.textContent = 'Strong';
    }
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Login successful! Redirecting to home page...');
        window.location.href = 'index.html';
    } else {
        alert('Invalid email or password');
    }
}

function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;

    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (password.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const emailExists = users.some(user => user.email === email);

    if (emailExists) {
        alert('Email already registered');
        return;
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    localStorage.setItem('currentUser', JSON.stringify(newUser));

    alert('Registration successful! Welcome to Plug Tech.');
    window.location.href = 'index.html';
}

function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser;
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function updateAuthNav() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const userGreeting = document.getElementById('user-greeting');

    if (currentUser) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'inline';
        userGreeting.style.display = 'inline';
        userGreeting.textContent = `Hi, ${currentUser.name.split(' ')[0]}!`;
        userGreeting.style.marginRight = '10px';
        userGreeting.style.fontWeight = '500';
        userGreeting.style.color = '#0066cc';
    } else {
        loginLink.style.display = 'inline';
        logoutLink.style.display = 'none';
        userGreeting.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', updateAuthNav);