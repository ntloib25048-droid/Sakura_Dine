// ========================================
// SAKURA DINE - WEBSITE JAVASCRIPT
// ========================================

const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

const header = document.getElementById("site-header");
const footer = document.getElementById("site-footer");

// ========================================
// 1. HEADER - LOGO & THANH ĐIỀU HƯỚNG
// ========================================

if (header) {
    const navItems = [
        ["index.html", "Home"],
        ["menu.html", "Menu"],
        ["about.html", "About Us"],
        ["order.html", "Order Now →"]
    ];

    header.innerHTML = `
        <nav class="navbar">
            <a class="brand" href="index.html" aria-label="Sakura Dine Home">
                <img src="assets/SakuraDineNoBG.png"
                     alt="Sakura Dine Logo">
            </a>
    
            <div class="nav-links">
                ${navItems.map(([url, name]) => `
                    <a href="${url}"
                       class="${currentPage === url ? "active" : ""}">
                       ${name}
                    </a>
                `).join("")}
            </div>

            <div class="nav-actions">
                <a href="menu.html" aria-label="Browse menu">⌕</a>

                <a href="order.html" aria-label="Shopping cart">
                    ♧
                    <span class="cart-badge" id="header-count">0</span>
                </a>
            </div>
        </nav>
    `;
}

// ========================================
// 2. FOOTER - CHÂN TRANG
// ========================================

if (footer) {
    footer.innerHTML = `
        <footer class="site-footer">
            <div class="container">

                <div class="footer-grid">
                    <div>
                        <a href="index.html" class="footer-logo-box">
                            <img src="assets/SakuraDineWhiteNoBG2.png"
                                 alt="Sakura Dine Logo">
                        </a>

                        <p>
                            A little tradition. A little discovery.<br>
                            Always made with heart.
                        </p>

                        <div class="social">
                            <a href="#" aria-label="Instagram">◎</a>
                            <a href="#" aria-label="Facebook">f</a>
                        </div>
                    </div>

                    <div>
                        <h4>COME SAY KONNICHIWA</h4>
                        <p>
                            123 Sakura Lane<br>
                            San Francisco, CA 94102<br>
                            (415) 555-0123<br>
                            hello@sakurakitchen.com
                        </p>
                    </div>

                    <div>
                        <h4>THERE'S ALWAYS A GOOD TIME</h4>
                        <p>
                            Monday – Thursday<br>
                            11:30 AM – 9:00 PM<br>
                            Friday – Saturday<br>
                            11:30 AM – 10:00 PM<br>
                            Sunday<br>
                            12:00 PM – 9:00 PM
                        </p>
                    </div>

                    <div>
                        <div class="footer-jp">いただきます</div>
                        <p>
                            Good food. Good company.<br>
                            Beautiful moments.
                        </p>
                    </div>
                </div>

                <div class="footer-bottom">
                    <span>
                        © 2026 Sakura Dine. All rights reserved.
                    </span>

                    <span>Crafted with care. Served with soul.</span>

                    <a href="#">Back to top ↑</a>
                </div>
            </div>
        </footer>
    `;
}

// ========================================
// 3. GIỎ HÀNG - LOCAL STORAGE
// ========================================

function getCart() {
    try {
        return JSON.parse(localStorage.getItem("sakuraCart")) || [];
    } catch (error) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("sakuraCart", JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const cart = getCart();

    const totalItems = cart.reduce(
        (sum, item) => sum + item.qty,
        0
    );

    document.querySelectorAll("#header-count").forEach(badge => {
        badge.textContent = totalItems;
    });
}

function money(amount) {
    return "$" + amount.toFixed(2);
}

// ========================================
// 4. THÊM MÓN VÀO GIỎ
// ========================================

function addItem(name, price) {
    const cart = getCart();

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({
            name: name,
            price: Number(price),
            qty: 1
        });
    }

    saveCart(cart);

    // Hiển thị trạng thái đã thêm món
    const button = [...document.querySelectorAll("[data-add]")]
        .find(btn => btn.dataset.add === name);

    if (button) {
        const oldText = button.textContent;

        button.textContent = "✓ Added";

        setTimeout(() => {
            button.textContent = oldText;
        }, 1000);
    }

    if (currentPage === "order.html") {
        renderCart();
    }
}

document.querySelectorAll("[data-add]").forEach(button => {
    button.addEventListener("click", () => {
        addItem(button.dataset.add, button.dataset.price);
    });
});

updateCartBadge();

// ========================================
// 5. TÌM KIẾM VÀ LỌC MÓN ĂN
// ========================================

const searchInput = document.getElementById("search-menu");

document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filter").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");
        filterMenu();
    });
});

if (searchInput) {
    searchInput.addEventListener("input", filterMenu);
}

function filterMenu() {
    const activeFilter =
        document.querySelector(".filter.active")?.dataset.filter || "All";

    const keyword = (searchInput?.value || "").toLowerCase();

    const cards = document.querySelectorAll("#menu-grid .food-card");
    let visibleCount = 0;

    cards.forEach(card => {
        const category = card.dataset.category;
        const name = card.dataset.name.toLowerCase();

        const matchesCategory =
            activeFilter === "All" || category === activeFilter;

        const matchesSearch = name.includes(keyword);

        const isVisible = matchesCategory && matchesSearch;

        card.classList.toggle("hidden", !isVisible);

        if (isVisible) {
            visibleCount++;
        }
    });

    const count = document.getElementById("menu-count");

    if (count) {
        count.textContent =
            `${visibleCount} thoughtfully crafted dish` +
            (visibleCount === 1 ? "" : "es");
    }
}

// ========================================
// 6. HIỂN THỊ GIỎ HÀNG TRÊN TRANG ORDER
// ========================================

function renderCart() {
    const container = document.getElementById("cart-items");

    if (!container) return;

    const cart = getCart();

    const itemCount = cart.reduce(
        (sum, item) => sum + item.qty,
        0
    );

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    // Phí giao hàng mẫu: $4.50 khi có đơn hàng
    const deliveryFee = subtotal > 0 ? 4.50 : 0;

    const total = subtotal + deliveryFee;

    document.getElementById("item-count").textContent =
        `${itemCount} item${itemCount === 1 ? "" : "s"}`;

    document.getElementById("empty-cart")
        .classList.toggle("hidden", cart.length > 0);

    container.innerHTML = cart.map((item, index) => `
        <div class="cart-line">
            <div>
                <strong>${escapeHTML(item.name)}</strong>
                <small>${money(item.price)} each</small>
            </div>

            <div class="qty">
                <button type="button"
                        data-qty="${index}"
                        data-delta="-1"
                        aria-label="Decrease quantity">−</button>

                <span>${item.qty}</span>

                <button type="button"
                        data-qty="${index}"
                        data-delta="1"
                        aria-label="Increase quantity">+</button>

                <b>${money(item.price * item.qty)}</b>
            </div>
        </div>
    `).join("");

    document.getElementById("subtotal").textContent = money(subtotal);
    document.getElementById("delivery").textContent = money(deliveryFee);
    document.getElementById("total").textContent = money(total);
    document.getElementById("confirm-total").textContent = money(total);

    const confirmButton = document.querySelector(".confirm-btn");

    if (confirmButton) {
        confirmButton.disabled = itemCount === 0;
    }

    // Gắn sự kiện tăng và giảm số lượng
    container.querySelectorAll("[data-qty]").forEach(button => {
        button.addEventListener("click", () => {
            const updatedCart = getCart();
            const index = Number(button.dataset.qty);
            const delta = Number(button.dataset.delta);

            if (!updatedCart[index]) return;

            updatedCart[index].qty += delta;

            if (updatedCart[index].qty <= 0) {
                updatedCart.splice(index, 1);
            }

            saveCart(updatedCart);
            renderCart();
        });
    });
}

// Tránh đưa nội dung tên món trực tiếp vào HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// ========================================
// 7. XÁC NHẬN ĐƠN HÀNG MẪU
// ========================================

if (currentPage === "order.html") {
    renderCart();

    const checkoutForm = document.getElementById("checkout-form");

    checkoutForm.addEventListener("submit", event => {
        event.preventDefault();

        const cart = getCart();

        if (cart.length === 0) {
            alert("Giỏ hàng đang trống. Hãy chọn món từ Menu nhé!");
            return;
        }

        if (!checkoutForm.reportValidity()) return;

        const formData = new FormData(checkoutForm);
        const customerName = formData.get("fullname");

        alert(
            `Cảm ơn ${customerName} đã đặt hàng tại Sakura Dine!\n\n` +
            "Đơn hàng demo đã được xác nhận trên giao diện.\n" +
            "Đây chưa phải đơn hàng gửi đến nhà hàng thực tế."
        );

        // Xóa giỏ hàng sau khi hoàn tất đơn mẫu
        localStorage.removeItem("sakuraCart");

        checkoutForm.reset();

        updateCartBadge();
        renderCart();
    });
}