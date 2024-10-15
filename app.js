let sellers = JSON.parse(localStorage.getItem('sellers')) || [];
let products = JSON.parse(localStorage.getItem('products')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || []; // Initialize the cart only once
const ownerCredentials = { username: "admin", password: "admin123" }; // Admin credentials

// Function to show sections based on active tab and change active tab styling
function showSection(sectionId, activeTab) {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    sections.forEach(section => section.style.display = 'none');  // Hide all sections
    navLinks.forEach(link => link.classList.remove('active'));    // Remove active from all tabs
    
    document.getElementById(sectionId).style.display = 'block';    // Show the required section
    document.getElementById(activeTab).classList.add('active');    // Highlight the active tab
}

// Set default active page and tab on load (Shop page)
window.onload = function() {
    showSection('user-section', 'user-tab');
    displayUserProducts();
};

// Event listeners for navigation tabs
document.getElementById('user-tab').addEventListener('click', () => {
    showSection('user-section', 'user-tab');
});

document.getElementById('seller-tab').addEventListener('click', () => {
    showSection('seller-login-section', 'seller-tab');
});

document.getElementById('seller-register-tab').addEventListener('click', () => {
    showSection('seller-register-section', 'seller-register-tab');
});

document.getElementById('admin-tab').addEventListener('click', () => {
    showSection('admin-login-section', 'admin-tab');
});

// Add new seller
document.getElementById('seller-register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const shopName = document.getElementById('shop-name').value;

    const newSeller = { username, password, shopName, products: [] };
    sellers.push(newSeller);
    localStorage.setItem('sellers', JSON.stringify(sellers));

    alert("Seller registered successfully!");
    showSection('seller-login-section', 'seller-tab');
});

// Seller login
document.getElementById('seller-login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('seller-username').value;
    const password = document.getElementById('seller-password').value;

    // Check if the seller exists with correct credentials
    const seller = sellers.find(s => s.username === username && s.password === password);

    if (seller) {
        // Successfully logged in, display the seller dashboard
        showSection('seller-section', 'seller-tab');
        displaySellerProducts(seller);  // Load seller products
    } else {
        alert("Invalid seller credentials. Please try again.");
    }
});

// Forgot password functionality
document.getElementById('forgot-password').addEventListener('click', function() {
    const username = prompt("Enter your username to retrieve your password:");
    const seller = sellers.find(s => s.username === username);
    if (seller) {
        alert(`Your password is: ${seller.password}`);
    } else {
        alert("Username not found.");
    }
});

// Display seller's products
function displaySellerProducts(seller) {
    const sellerProductList = document.getElementById('seller-product-list');
    sellerProductList.innerHTML = '';

    seller.products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: ₹${product.price}</p>
            <img src="${product.image}" alt="${product.name}" style="width: 100px; height: auto;">
        `;
        sellerProductList.appendChild(productCard);
    });
}

// Add product functionality for seller
document.getElementById('product-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const productName = document.getElementById('product-name').value;
    const productPrice = parseFloat(document.getElementById('product-price').value);
    const productImage = document.getElementById('product-image').value;

    // Get the currently logged-in seller
    const seller = sellers.find(s => s.username === document.getElementById('seller-username').value);

    if (seller) {
        const newProduct = { name: productName, price: productPrice, image: productImage };
        
        // Add product to seller's products
        seller.products.push(newProduct);
        
        // Add product to the global products list
        products.push(newProduct);
        
        // Save updated lists in localStorage
        localStorage.setItem('sellers', JSON.stringify(sellers));
        localStorage.setItem('products', JSON.stringify(products));

        alert("Product added successfully!");
        displaySellerProducts(seller);  // Refresh seller products display
        document.getElementById('product-form').reset();  // Clear the form fields
    } else {
        alert("Error: Seller not found.");
    }
});

// Admin login
document.getElementById('admin-login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    if (username === ownerCredentials.username && password === ownerCredentials.password) {
        showSection('admin-section', 'admin-tab');
        displaySellersForAdmin();
        displayProductsForAdmin(); // Display products for admin
    } else {
        alert("Invalid admin credentials. Please try again.");
    }
});

// Display Sellers for Admin
function displaySellersForAdmin() {
    const sellerContainer = document.getElementById('admin-seller-list');
    sellerContainer.innerHTML = '';

    sellers.forEach(seller => {
        const sellerCard = document.createElement('div');
        sellerCard.innerHTML = `
            <h4>${seller.shopName} (${seller.username})</h4>
            <button class="remove-seller-btn" data-username="${seller.username}">Remove Seller</button>
        `;
        sellerContainer.appendChild(sellerCard);
    });

    // Add event listeners for "Remove Seller" buttons
    const removeSellerButtons = document.querySelectorAll('.remove-seller-btn');
    removeSellerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const username = this.getAttribute('data-username');
            removeSeller(username);
        });
    });
}

// Remove Seller
function removeSeller(username) {
    sellers = sellers.filter(seller => seller.username !== username);
    localStorage.setItem('sellers', JSON.stringify(sellers));
    alert("Seller removed successfully!");
    displaySellersForAdmin(); // Refresh the admin seller display
}

// Display Products for Admin
function displayProductsForAdmin() {
    const productContainer = document.getElementById('admin-product-list');
    productContainer.innerHTML = '';

    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: ₹${product.price}</p>
            <button class="remove-product-btn" data-index="${index}">Remove Product</button>
        `;
        productContainer.appendChild(productCard);
    });

    // Add event listeners for remove product buttons
    const removeButtons = document.querySelectorAll('.remove-product-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeProduct(index);
        });
    });
}

// Remove product globally (for admin)
function removeProduct(index) {
    const productName = products[index].name;

    // Remove the product from the global product list
    products.splice(index, 1);

    // Remove the product from all sellers' products
    sellers.forEach(seller => {
        seller.products = seller.products.filter(product => product.name !== productName);
    });

    // Update the localStorage
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('sellers', JSON.stringify(sellers));

    alert('Product removed successfully!');
    displayProductsForAdmin(); // Refresh admin product list
}

// Display products for user
function displayUserProducts() {
    const userProductList = document.getElementById('user-product-list');
    userProductList.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: ₹${product.price}</p>
            <img src="${product.image}" alt="${product.name}" style="width: 100px; height: auto;">
            <button class="add-to-cart-btn" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
        `;
        userProductList.appendChild(productCard);
    });

    // Add event listeners for "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            addToCart(name, price);
        });
    });
}

// Add to cart function
function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
    alert(`${name} added to cart!`);
    updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear previous items

    let totalPrice = 0;

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            ${item.name} - ₹${item.price} 
            <button class="remove-cart-btn" data-index="${index}">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);
        totalPrice += parseFloat(item.price);
    });

    document.getElementById('total-price').innerText = totalPrice.toFixed(2);

    // Add event listeners for remove buttons
    const removeButtons = document.querySelectorAll('.remove-cart-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeFromCart(index);
        });
    });
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1); // Remove the item from the cart array
    localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
    updateCartDisplay(); // Refresh the cart display
    alert("Item removed from cart.");
}

// Checkout button functionality
document.getElementById('checkout-btn').addEventListener('click', function() {
    alert("Proceeding to checkout...");
    // Implement checkout logic here
});

// Initial display of user products
showSection('user-section', 'user-tab');
displayUserProducts();
