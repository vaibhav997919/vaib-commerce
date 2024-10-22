let sellers = JSON.parse(localStorage.getItem('sellers')) || [];
let products = JSON.parse(localStorage.getItem('products')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || []; 
const ownerCredentials = { username: "owner", password: "owner123" }; 


const defaultProducts = [
    { name: 'wollet', price: 100, image: 'https://media.istockphoto.com/id/483259035/photo/lost-wallet.jpg?s=612x612&w=0&k=20&c=4QjaGx8aynubb3e5e2nnAoZAL2pSmBthEGNT9H1ZCYk=' },
    { name: 'watch', price: 200, image: 'https://cdn.pixabay.com/photo/2015/09/09/02/03/clock-931027_640.jpg' },
    { name: 'Wooden Cubes', price: 300, image: 'https://t3.ftcdn.net/jpg/09/69/36/16/360_F_969361663_osjJ97qJMqwpLiUdYdiuIlTz6BpdFiJp.jpg' },
    { name: 'Coffee Can', price: 400, image: 'https://cdn.pixabay.com/photo/2016/09/30/11/13/coffee-tin-1705026_640.jpg' },
    { name: 'electronic combo', price: 500, image: 'https://thumbs.dreamstime.com/b/overhead-various-electronic-gadgets-wooden-plank-various-electronic-gadgets-wooden-plank-101116186.jpg' },
    { name: 'mic', price: 600, image: 'https://pngimg.com/uploads/microphone/small/microphone_PNG7923.png' },
    { name: 'scanner', price: 700, image: 'https://www.pngmart.com/files/7/Computer-Scanner-Transparent-Images-PNG.png' },
    { name: 'headphones', price: 800, image: 'https://img.freepik.com/free-photo/still-life-wireless-cyberpunk-headphones_23-2151072201.jpg?size=626&ext=jpg' },
];

function showSection(sectionId, activeTab) {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');

    sections.forEach(section => section.style.display = 'none');  
    navLinks.forEach(link => link.classList.remove('active'));    

    document.getElementById(sectionId).style.display = 'block';    
    document.getElementById(activeTab).classList.add('active');    
}

window.onload = function () {
    showSection('user-section', 'user-tab');
    displayUserProducts();
    displayCartItems(); 
};

document.getElementById('user-tab').addEventListener('click', () => {
    showSection('user-section', 'user-tab');
    displayUserProducts();
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

document.getElementById('seller-register-form').addEventListener('submit', function (event) {
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

document.getElementById('seller-login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('seller-username').value;
    const password = document.getElementById('seller-password').value;

    const seller = sellers.find(s => s.username === username && s.password === password);

    if (seller) {
        showSection('seller-section', 'seller-tab');
        displaySellerProducts(seller);
    } else {
        alert("Invalid seller credentials. Please try again.");
    }
});

document.getElementById('forgot-password').addEventListener('click', function () {
    const username = prompt("Enter your username to retrieve your password:");
    const seller = sellers.find(s => s.username === username);
    if (seller) {
        alert(`Your password is: ${seller.password}`);
    } else {
        alert("Username not found.");
    }
});

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

document.getElementById('product-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const productName = document.getElementById('product-name').value;
    const productPrice = parseFloat(document.getElementById('product-price').value);
    const productImage = document.getElementById('product-image').value;
    const seller = sellers.find(s => s.username === document.getElementById('seller-username').value);

    if (seller) {
        const newProduct = { name: productName, price: productPrice, image: productImage };

        seller.products.push(newProduct);

        products.push(newProduct);

        localStorage.setItem('sellers', JSON.stringify(sellers));
        localStorage.setItem('products', JSON.stringify(products));

        alert("Product added successfully!");
        displaySellerProducts(seller);  
        document.getElementById('product-form').reset();  
    } else {
        alert("Error: Seller not found.");
    }
});


document.getElementById('admin-login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    if (username === ownerCredentials.username && password === ownerCredentials.password) {
        showSection('admin-section', 'admin-tab');
        displaySellersForAdmin();
        displayProductsForAdmin(); 
        } else {
        alert("Invalid admin credentials. Please try again.");
    }
});

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

    const removeSellerButtons = document.querySelectorAll('.remove-seller-btn');
    removeSellerButtons.forEach(button => {
        button.addEventListener('click', function () {
            const username = this.getAttribute('data-username');
            removeSeller(username);
        });
    });
}

function removeSeller(username) {
    sellers = sellers.filter(seller => seller.username !== username);
    localStorage.setItem('sellers', JSON.stringify(sellers));
    alert("Seller removed successfully!");
    displaySellersForAdmin(); 
}

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

    const removeProductButtons = document.querySelectorAll('.remove-product-btn');
    removeProductButtons.forEach(button => {
        button.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            removeProduct(index);
        });
    });
}

function removeProduct(index) {
    products.splice(index, 1); 
    localStorage.setItem('products', JSON.stringify(products)); 
    alert("Product removed successfully!");
    displayProductsForAdmin();
}

function displayUserProducts() {
    const productList = document.getElementById('user-product-list');
    productList.innerHTML = '';

    const allProducts = products.length > 0 ? products : defaultProducts;

    allProducts.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: ₹${product.price}</p>
            <img src="${product.image}" alt="${product.name}" style="width: 100px; height: auto;">
            <button class="add-to-cart-btn" data-index="${index}">Add to Cart</button>
        `;
        productList.appendChild(productCard);
    });

    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            addToCart(index);
        });
    });
}


function addToCart(index) {
    const product = products.length > 0 ? products[index] : defaultProducts[index];

    if (!product) {
        alert("Invalid product. Please try again.");
        return; 
    } 

    const existingProduct = cart.find(item => item.name === product.name);

    if (existingProduct) {
        existingProduct.quantity += 1; 
       } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart)); 
    alert("Product added to cart successfully!");
    displayCartItems(); 
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <h4>${item.name}</h4>
                <p>Price: ₹${item.price}</p>
                <p>Quantity: ${item.quantity}</p>
                <button class="remove-from-cart-btn" data-index="${index}">Remove from Cart</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        const removeFromCartButtons = document.querySelectorAll('.remove-from-cart-btn');
        removeFromCartButtons.forEach(button => {
            button.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                removeFromCart(index);
            });
        });
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert("Product removed from cart successfully!");
    displayCartItems(); 
}

function removeProduct(index) {
    const productToRemove = products[index]; 
    products.splice(index, 1);
    
    sellers.forEach(seller => {
        seller.products = seller.products.filter(product => product.name !== productToRemove.name);
    });

    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('sellers', JSON.stringify(sellers)); 

    alert("Product removed successfully!");
    displayProductsForAdmin(); 
    displaySellersForAdmin(); 
}

document.getElementById('checkout-btn').addEventListener('click', function() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items to your cart before proceeding to checkout.");
    } else {
        alert("Proceeding to checkout...");

        cart = []; 
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems(); 
    }
});
