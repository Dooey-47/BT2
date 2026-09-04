// Danh sách sản phẩm
const products = [
    {
        id: 1,
        name: 'Bơ sáp Đắk Lắk',
        price: 350000,
        category: 'Bơ sáp',
        image: 'images/bo-sap-dak-lak.jpg',
        description: 'Bơ sáp dẻo, béo, thơm từ vùng đất Đắk Lắk.'
    },
    {
        id: 2,
        name: 'Cà phê Buôn Ma Thuột',
        price: 150000,
        category: 'Cà phê',
        image: 'images/ca-phe-buon-ma-thuot.jpg',
        description: 'Cà phê nguyên chất, hương vị đậm đà đặc trưng.'
    },
    {
        id: 3,
        name: 'Hạt macca Tây Nguyên',
        price: 120000,
        category: 'Macca',
        image: 'images/mac-ca-tay-nguyen.jpg',
        description: 'Hạt macca thơm ngon, giàu dinh dưỡng.'
    },
    {
        id: 4,
        name: 'Mật ong rừng Tây Nguyên',
        price: 250000,
        category: 'Mật ong',
        image: 'images/mat-ong-rung-tay-nguyen.jpg',
        description: 'Mật ong tự nhiên được khai thác từ rừng Tây Nguyên.'
    },
    {
        id: 5,
        name: 'Thổ cẩm Tây Nguyên',
        price: 200000,
        category: 'Thổ cẩm',
        image: 'images/tho-cam-tay-nguyen.jpg',
        description: 'Sản phẩm dệt thủ công mang đậm bản sắc Tây Nguyên.'
    },
    {
        id: 6,
        name: 'Tiêu Đắk Nông',
        price: 180000,
        category: 'Tiêu',
        image: 'images/tieu-dak-nong.jpg',
        description: 'Hạt tiêu thơm cay đặc trưng của Đắk Nông.'
    }
];

function formatPrice(price) {
    return price.toLocaleString('vi-VN') + ' VNĐ';
}

// Tạo HTML cho một sản phẩm
function renderProductCard(product) {
    return `
        <article class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p><strong>Giá: ${formatPrice(product.price)}</strong></p>
            <div class="product-actions">
                <a href="product-detail.html?id=${product.id}">Xem chi tiết</a>
                <button type="button" class="add-to-cart" data-id="${product.id}">
                    Thêm vào giỏ hàng
                </button>
            </div>
        </article>
    `;
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function updateCartCount() {
    const cartCount = document.querySelector('#cart-count');
    if (!cartCount) return;

    const total = getCart().reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = total;
}

function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    const cart = getCart();
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`Đã thêm "${product.name}" vào giỏ hàng.`);
}

function setupCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            addToCart(Number(button.dataset.id));
        });
    });
}

function renderProducts() {
    const productList = document.querySelector('#product-list');
    if (!productList) return;

    const searchInput = document.querySelector('#search-input');
    const categoryFilter = document.querySelector('#category-filter');

    function filterProducts() {
        const keyword = searchInput.value.trim().toLowerCase();
        const category = categoryFilter.value;

        const filtered = products.filter(product => {
            const matchesKeyword = product.name.toLowerCase().includes(keyword);
            const matchesCategory = !category || product.category === category;
            return matchesKeyword && matchesCategory;
        });

        productList.innerHTML = filtered.length
            ? filtered.map(renderProductCard).join('')
            : '<p class="no-result">Không tìm thấy sản phẩm phù hợp.</p>';

        setupCartButtons();
    }

    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    filterProducts();
}

function renderProductDetail() {
    const detail = document.querySelector('#product-detail');
    if (!detail) return;

    const id = Number(new URLSearchParams(window.location.search).get('id')) || 2;
    const product = products.find(item => item.id === id) || products[1];

    detail.innerHTML = `
        <article>
            <h1>${product.name}</h1>
            <img src="${product.image}" alt="${product.name}" class="detail-image">
            <h2>Mô tả sản phẩm</h2>
            <p>${product.description}</p>
            <p><strong>Giá: ${formatPrice(product.price)}</strong></p>
            <p><strong>Danh mục:</strong> ${product.category}</p>
            <button type="button" class="add-to-cart" data-id="${product.id}">Thêm vào giỏ hàng</button>
        </article>
    `;

    setupCartButtons();
}

function validateOrderForm() {
    const form = document.querySelector('#order-form');
    if (!form) return;

    form.addEventListener('submit', event => {
        event.preventDefault();

        const fullname = document.querySelector('#fullname').value.trim();
        const phone = document.querySelector('#phone').value.trim();
        const address = document.querySelector('#address').value.trim();

        if (!fullname || !phone || !address) {
            alert('Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ.');
            return;
        }

        if (!/^0\d{9,10}$/.test(phone)) {
            alert('Số điện thoại không hợp lệ. Vui lòng nhập 10-11 chữ số và bắt đầu bằng 0.');
            return;
        }

        alert('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
        form.reset();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderProducts();
    renderProductDetail();
    validateOrderForm();
});
