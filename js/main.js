// Danh sách sản phẩm được tải từ data/products.json.
let products = [];

// Giỏ hàng được lưu dưới dạng JSON trong localStorage.
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function formatPrice(price) {
    return price.toLocaleString("vi-VN") + " VNĐ";
}

function renderProductCard(product) {
    return `
        <article class="product-card">
            <img src="${product.image}" alt="${product.name}" width="200">
            <h2>${product.name}</h2>
            ${product.featured ? '<p class="featured-badge">Sản phẩm nổi bật</p>' : ''}
            <p>${product.description}</p>
            <p><strong>Danh mục:</strong> ${product.category}</p>
            <p><strong>Xuất xứ:</strong> ${product.origin}</p>
            <p><strong>Tồn kho:</strong> ${product.stock} ${product.unit}</p>
            <p class="price"><strong>${formatPrice(product.price)} / ${product.unit}</strong></p>
            <button type="button" onclick="addToCart(${product.id})">Thêm vào giỏ hàng</button>
            <a class="detail-link" href="product-detail.html?id=${product.id}">Xem chi tiết</a>
        </article>
    `;
}

function renderProducts(list) {
    const productList = document.getElementById("product-list");
    if (!productList) return;

    if (list.length === 0) {
        productList.innerHTML = "<p>Không tìm thấy sản phẩm phù hợp.</p>";
        return;
    }

    productList.innerHTML = list.map(renderProductCard).join("");
}

function filterProducts() {
    const keywordInput = document.getElementById("search-input");
    const categoryInput = document.getElementById("category-filter");

    const keyword = keywordInput ? keywordInput.value.toLowerCase().trim() : "";
    const category = categoryInput ? categoryInput.value : "all";

    const filteredProducts = products.filter(function (product) {
        const matchKeyword = product.name.toLowerCase().includes(keyword);
        const matchCategory = category === "all" || product.category === category;
        return matchKeyword && matchCategory;
    });

    renderProducts(filteredProducts);
}

function addToCart(productId) {
    const product = products.find(function (item) {
        return item.id === productId;
    });

    if (!product) return;

    const item = cart.find(function (cartItem) {
        return cartItem.id === productId;
    });

    if (item) {
        item.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(product.name + " đã được thêm vào giỏ hàng!");
}

function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    let totalQuantity = 0;
    let totalPrice = 0;

    cart.forEach(function (item) {
        totalQuantity += item.quantity;
        totalPrice += item.price * item.quantity;
    });

    if (cartCount) cartCount.textContent = totalQuantity;
    if (cartTotal) cartTotal.textContent = formatPrice(totalPrice);
}

function showProductLoadError() {
    const container = document.getElementById("product-list") ||
        document.getElementById("product-detail");

    if (container) {
        container.innerHTML = "<p>Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.</p>";
    }
}

async function loadProducts() {
    const response = await fetch("data/products.json");

    if (!response.ok) {
        throw new Error("Không thể tải dữ liệu sản phẩm: " + response.status);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
        throw new Error("Dữ liệu sản phẩm không hợp lệ.");
    }

    products = data;
}

function showProductDetail() {
    const detail = document.getElementById("product-detail");
    if (!detail) return;

    const params = new URLSearchParams(window.location.search);
    const productId = Number(params.get("id")) || 1;
    const product = products.find(function (item) {
        return item.id === productId;
    }) || products[0];

    detail.innerHTML = `
        <h1>${product.name}</h1>
        <img src="${product.image}" alt="${product.name}" width="350">
        ${product.featured ? '<p class="featured-badge">Sản phẩm nổi bật</p>' : ''}
        <h2>Mô tả sản phẩm</h2>
        <p>${product.description}</p>
        <h2>Giá bán</h2>
        <p class="price"><strong>${formatPrice(product.price)} / ${product.unit}</strong></p>
        <h2>Thông tin sản phẩm</h2>
        <ul>
            <li><strong>Danh mục:</strong> ${product.category}</li>
            <li><strong>Đơn vị:</strong> ${product.unit}</li>
            <li><strong>Xuất xứ:</strong> ${product.origin}</li>
            <li><strong>Tồn kho:</strong> ${product.stock}</li>
            <li><strong>Nổi bật:</strong> ${product.featured ? "Có" : "Không"}</li>
        </ul>
        <button type="button" onclick="addToCart(${product.id})">Thêm vào giỏ hàng</button>
    `;
}

function validateOrderForm(event) {
    event.preventDefault();

    const fullname = document.getElementById("fullname");
    const phone = document.getElementById("phone");
    const address = document.getElementById("address");
    const message = document.getElementById("form-message");

    if (!fullname.value.trim()) {
        message.textContent = "Vui lòng nhập họ tên.";
        fullname.focus();
        return false;
    }

    if (!/^0\d{9,10}$/.test(phone.value.trim())) {
        message.textContent = "Số điện thoại không hợp lệ.";
        phone.focus();
        return false;
    }

    if (!address.value.trim()) {
        message.textContent = "Vui lòng nhập địa chỉ.";
        address.focus();
        return false;
    }

    message.textContent = "Đặt hàng thành công! Cảm ơn bạn đã mua hàng.";
    event.target.reset();
    return false;
}

document.addEventListener("DOMContentLoaded", async function () {
    updateCartCount();

    const searchInput = document.getElementById("search-input");
    const categoryFilter = document.getElementById("category-filter");
    const orderForm = document.getElementById("order-form");

    if (searchInput) searchInput.addEventListener("input", filterProducts);
    if (categoryFilter) categoryFilter.addEventListener("change", filterProducts);
    if (orderForm) orderForm.addEventListener("submit", validateOrderForm);

    const hasProductContent = document.getElementById("product-list") ||
        document.getElementById("product-detail");
    if (!hasProductContent) return;

    try {
        await loadProducts();
        renderProducts(products);
        showProductDetail();
    } catch (error) {
        console.error(error);
        showProductLoadError();
    }
});
