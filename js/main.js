// Danh sách sản phẩm
const products = [
    {
        id: 1,
        name: "Cà phê Buôn Ma Thuột",
        category: "Cà phê",
        price: 150000,
        image: "images/ca-phe-buon-ma-thuot.jpg",
        description: "Cà phê nguyên chất, hương vị đậm đà đặc trưng Tây Nguyên."
    },
    {
        id: 2,
        name: "Mật ong rừng Tây Nguyên",
        category: "Mật ong",
        price: 250000,
        image: "images/mat-ong-rung-tay-nguyen.jpg",
        description: "Mật ong tự nhiên được khai thác từ rừng Tây Nguyên."
    },
    {
        id: 3,
        name: "Hạt Macca Tây Nguyên",
        category: "Macca",
        price: 300000,
        image: "images/mac-ca-tay-nguyen.jpg",
        description: "Hạt macca thơm ngon, giàu dinh dưỡng."
    },
    {
        id: 4,
        name: "Bơ sáp Đắk Lắk",
        category: "Trái cây",
        price: 120000,
        image: "images/bo-sap-dak-lak.jpg",
        description: "Bơ sáp dẻo, béo, được tuyển chọn từ Đắk Lắk."
    },
    {
        id: 5,
        name: "Tiêu Đắk Nông",
        category: "Gia vị",
        price: 180000,
        image: "images/tieu-dak-nong.jpg",
        description: "Hạt tiêu thơm cay đặc trưng vùng cao nguyên."
    },
    {
        id: 6,
        name: "Thổ cẩm Tây Nguyên",
        category: "Thủ công",
        price: 200000,
        image: "images/tho-cam-tay-nguyen.jpg",
        description: "Sản phẩm dệt thủ công mang đậm bản sắc Tây Nguyên."
    }
];

// Giỏ hàng dùng JavaScript thuần.
let cart = [];

function formatPrice(price) {
    return price.toLocaleString("vi-VN") + " VNĐ";
}

function renderProductCard(product) {
    return `
        <article class="product-card">
            <img src="${product.image}" alt="${product.name}" width="200">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p><strong>Danh mục:</strong> ${product.category}</p>
            <p class="price"><strong>${formatPrice(product.price)}</strong></p>
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

    updateCartCount();
    alert(product.name + " đã được thêm vào giỏ hàng!");
}

function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    if (!cartCount) return;

    let totalQuantity = 0;
    cart.forEach(function (item) {
        totalQuantity += item.quantity;
    });

    cartCount.textContent = totalQuantity;
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
        <h2>Mô tả sản phẩm</h2>
        <p>${product.description}</p>
        <h2>Giá bán</h2>
        <p class="price"><strong>${formatPrice(product.price)}</strong></p>
        <h2>Thông tin sản phẩm</h2>
        <ul>
            <li><strong>Danh mục:</strong> ${product.category}</li>
            <li><strong>Xuất xứ:</strong> Tây Nguyên</li>
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

document.addEventListener("DOMContentLoaded", function () {
    renderProducts(products);
    showProductDetail();
    updateCartCount();

    const searchInput = document.getElementById("search-input");
    const categoryFilter = document.getElementById("category-filter");
    const orderForm = document.getElementById("order-form");

    if (searchInput) searchInput.addEventListener("input", filterProducts);
    if (categoryFilter) categoryFilter.addEventListener("change", filterProducts);
    if (orderForm) orderForm.addEventListener("submit", validateOrderForm);
});
