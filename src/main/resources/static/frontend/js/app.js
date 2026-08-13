(function () {
    const state = {
        products: [],
        cart: [],
        filter: "new",
        query: "",
        selectedProduct: null,
        quantity: 1,
        view: "listing",
        usingDemoData: false
    };

    const nodes = {
        categoryGrid: document.getElementById("categoryGrid"),
        productGrid: document.getElementById("productGrid"),
        productDetail: document.getElementById("productDetail"),
        productTabs: document.getElementById("productTabs"),
        dataStatus: document.getElementById("dataStatus"),
        searchForm: document.getElementById("searchForm"),
        searchInput: document.getElementById("searchInput"),
        cartButton: document.getElementById("cartButton"),
        cartDrawer: document.getElementById("cartDrawer"),
        cartBackdrop: document.getElementById("cartBackdrop"),
        closeCart: document.getElementById("closeCart"),
        cartItems: document.getElementById("cartItems"),
        cartTotal: document.getElementById("cartTotal"),
        cartTitle: document.getElementById("cartTitle"),
        cartCount: document.getElementById("cartCount"),
        accountButton: document.getElementById("accountButton"),
        accountLabel: document.getElementById("accountLabel"),
        authModal: document.getElementById("authModal"),
        authBackdrop: document.getElementById("authBackdrop"),
        closeAuth: document.getElementById("closeAuth"),
        loginForm: document.getElementById("loginForm"),
        registerForm: document.getElementById("registerForm"),
        catalogPanel: document.getElementById("catalogPanel"),
        catalogToggle: document.getElementById("catalogToggle"),
        closeCatalog: document.getElementById("closeCatalog"),
        catalogList: document.getElementById("catalogList"),
        toast: document.getElementById("toast"),
        scrollTopButton: document.getElementById("scrollTopButton"),
        heroLoginButton: document.getElementById("heroLoginButton"),
        storeButton: document.getElementById("storeButton"),
        orderLookupButton: document.getElementById("orderLookupButton"),
        notifyButton: document.getElementById("notifyButton"),
        languageButton: document.getElementById("languageButton"),
        contactButton: document.getElementById("contactButton")
    };

    function formatMoney(value) {
        if (!value) return "Liên hệ";
        return new Intl.NumberFormat("vi-VN").format(value) + "₫";
    }

    function productVisual(product, compact = false) {
        const supportedTypes = ["phone", "tablet", "laptop", "watch"];
        const type = supportedTypes.includes(product.imageType) ? product.imageType : "phone";
        const label = escapeHtml(product.name || "Sản phẩm Apple");
        const theme = product.theme ? ` style="--mock-bg: ${String(product.theme).replaceAll('"', "&quot;")}"` : "";
        return `<div class="device-mock ${type} ${compact ? "compact" : ""}" role="img" aria-label="${label}"><span class="mock-${type}"${theme}></span></div>`;
    }

    function setView(view) {
        state.view = view;
        document.querySelectorAll(".listing-view").forEach((section) => {
            section.classList.toggle("hidden", view !== "listing");
        });
        nodes.productDetail.classList.toggle("hidden", view !== "detail");
        if (view === "listing") {
            state.selectedProduct = null;
            window.location.hash = "products";
        }
    }

    function escapeHtml(value) {
        return String(value || "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function showToast(message) {
        nodes.toast.textContent = message;
        nodes.toast.classList.remove("hidden");
        window.clearTimeout(showToast.timer);
        showToast.timer = window.setTimeout(() => nodes.toast.classList.add("hidden"), 2800);
    }

    function renderCategories() {
        nodes.categoryGrid.innerHTML = window.demoCategories.map((category) => `
            <article class="category-card" data-category="${category.id}">
                <div>
                    <div class="category-visuals">
                        <div class="category-tile">
                            ${productVisual({ imageType: category.type, theme: category.theme, name: category.name }, true)}
                        </div>
                        <div class="category-tile">
                            ${productVisual({ imageType: category.type, theme: category.theme, name: category.name }, true)}
                            <span class="category-extra">+ ${category.count}</span>
                        </div>
                    </div>
                    <div class="category-info">
                        <strong>${category.name}</strong>
                        <span>${category.subtitle}</span>
                    </div>
                </div>
                <span class="category-arrow">›</span>
            </article>
        `).join("");

        nodes.catalogList.innerHTML = window.demoCategories.map((category) => `
            <button class="catalog-item" type="button" data-category="${category.id}">
                <span>${category.name}</span>
                <strong>${category.count}</strong>
            </button>
        `).join("");
    }

    function renderProducts() {
        const filtered = state.products.filter((product) => {
            const matchesFilter = product.flags?.includes(state.filter);
            const matchesQuery = !state.query || product.name.toLowerCase().includes(state.query.toLowerCase());
            return matchesFilter && matchesQuery;
        });

        nodes.productGrid.innerHTML = filtered.map((product) => `
            <article class="product-card">
                ${product.discount ? `<span class="discount">Giảm ${product.discount}%</span>` : ""}
                <div class="product-media" data-detail="${product.id}">
                    ${productVisual(product)}
                </div>
                <div class="label-row">
                    ${(product.badges || []).map((badge) => `<span class="mini-label ${badge === "Nổi bật" ? "hot" : ""}">${badge}</span>`).join("")}
                </div>
                <h3 class="product-name" data-detail="${product.id}">${escapeHtml(product.name)}</h3>
                <div class="price-line">
                    <strong class="price">${formatMoney(product.price)}</strong>
                    ${product.oldPrice ? `<span class="old-price">${formatMoney(product.oldPrice)}</span>` : ""}
                </div>
                <div class="warranty">${escapeHtml(product.warranty)}</div>
                <div class="card-actions">
                    <button class="text-button" type="button">♡ Thích</button>
                    <button class="add-button" type="button" data-add="${product.id}">Thêm giỏ</button>
                </div>
            </article>
        `).join("");

        if (!filtered.length) {
            nodes.productGrid.innerHTML = `<div class="empty-state">Không tìm thấy sản phẩm phù hợp.</div>`;
        }
    }

    function renderDetail(product) {
        state.selectedProduct = product;
        state.quantity = 1;
        setView("detail");
        nodes.productDetail.innerHTML = `
            <button class="back-button" id="backToProducts" type="button">← Quay lại sản phẩm</button>
            <h2 class="detail-title">${escapeHtml(product.name)}</h2>
            <div class="detail-grid">
                <div class="detail-gallery">
                    <div class="detail-main-visual">${productVisual(product)}</div>
                    <div class="thumbs">
                        ${[0, 1, 2, 3].map(() => `<button type="button">${productVisual(product, true)}</button>`).join("")}
                    </div>
                </div>
                <div class="detail-buy">
                    <div class="detail-meta">
                        <span>Loại: <strong>${escapeHtml(product.category?.name || "Sản phẩm")}</strong></span>
                        <span>Thương hiệu: <strong>${escapeHtml(product.brand?.name || "Apple")}</strong></span>
                        <span>Tình trạng: <strong>${product.stock > 0 ? "Còn hàng" : "Hết hàng"}</strong></span>
                        <span>Mã sản phẩm: <strong>Đang cập nhật</strong></span>
                    </div>
                    <div class="detail-price-label">Giá bán:</div>
                    <div class="detail-price">
                        <span>${formatMoney(product.price)}</span>
                        ${product.oldPrice ? `<small class="old-price">${formatMoney(product.oldPrice)}</small>` : ""}
                    </div>
                    <div class="detail-options">
                        <strong>Dung lượng:</strong>
                        <div class="option-row">
                            <button class="option-button active" type="button">1TB<br><strong>${formatMoney(product.price)}</strong></button>
                            <button class="option-button" type="button">512GB<br><strong>${formatMoney(Math.round((product.price || 35000000) * 0.86))}</strong></button>
                            <button class="option-button" type="button">256GB<br><strong>${formatMoney(Math.round((product.price || 30000000) * 0.75))}</strong></button>
                        </div>
                        <strong>Màu sắc: Titan</strong>
                        <div class="option-row">
                            <button class="option-button active" type="button">Titan</button>
                            <button class="option-button" type="button">Đen</button>
                            <button class="option-button" type="button">Xanh</button>
                        </div>
                        <strong>Số lượng:</strong>
                        <div class="quantity-control">
                            <button type="button" data-qty="-1">−</button>
                            <input id="detailQuantity" value="1" readonly>
                            <button type="button" data-qty="1">+</button>
                        </div>
                        <div class="buy-actions">
                            <button class="add-cart-wide" type="button" data-add="${product.id}">THÊM VÀO GIỎ<br><small>Giao hàng tận nơi miễn phí</small></button>
                            <button class="primary-button" type="button">MUA NGAY</button>
                            <button class="primary-button" type="button">Liên hệ 1900 6750</button>
                        </div>
                    </div>
                </div>
                <aside class="detail-sidebar">
                    <div class="sidebar-box">
                        <h3>Hệ thống cửa hàng</h3>
                        <div class="sidebar-content">
                            ${window.demoStores.map((store) => `
                                <div class="store-item">
                                    <strong>${store.name}</strong>
                                    <span>Địa chỉ: ${store.address}</span>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                    <div class="sidebar-box">
                        <h3>Cam kết bán hàng</h3>
                        <div class="sidebar-content">
                            <ul class="commit-list">
                                <li>Hàng chính hãng, nguồn gốc rõ ràng</li>
                                <li>Tặng máy nếu phát hiện máy sửa chữa</li>
                                <li>Giao hàng ngay trong nội thành</li>
                                <li>Dùng thử 7 ngày miễn phí</li>
                            </ul>
                        </div>
                    </div>
                </aside>
            </div>
        `;
        nodes.productDetail.scrollIntoView({ behavior: "smooth", block: "start" });
        window.location.hash = `product-${product.id}`;
    }

    function renderCart() {
        const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        const total = state.cart.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);

        nodes.cartCount.textContent = String(totalItems);
        nodes.cartTitle.textContent = `${totalItems} sản phẩm`;
        nodes.cartTotal.textContent = formatMoney(total);

        if (!state.cart.length) {
            nodes.cartItems.innerHTML = `<p>Giỏ hàng đang trống.</p>`;
            return;
        }

        nodes.cartItems.innerHTML = state.cart.map((item) => `
            <div class="cart-item">
                <div>${productVisual(item.product, true)}</div>
                <div>
                    <strong>${escapeHtml(item.product.name)}</strong>
                    <span>${formatMoney(item.product.price)}</span>
                    <p>Số lượng: ${item.quantity}</p>
                </div>
            </div>
        `).join("");
    }

    function addLocalCart(productId, quantity = 1) {
        const product = state.products.find((item) => item.id === Number(productId));
        if (!product) return;

        const existing = state.cart.find((item) => item.product.id === product.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            state.cart.push({ product, quantity });
        }

        renderCart();
    }

    async function addToCart(productId) {
        const quantity = state.selectedProduct?.id === Number(productId) ? state.quantity : 1;

        if (window.emarketApi.getToken()) {
            try {
                await window.emarketApi.addToCart(Number(productId), quantity);
                showToast("Đã gửi sản phẩm vào giỏ hàng backend.");
            } catch (error) {
                showToast(`Backend giỏ hàng chưa sẵn sàng, dùng giỏ demo. ${error.message}`);
            }
        }

        addLocalCart(productId, quantity);
        openCart();
    }

    function openCart() {
        nodes.cartDrawer.classList.add("open");
        nodes.cartDrawer.setAttribute("aria-hidden", "false");
        nodes.cartBackdrop.classList.remove("hidden");
    }

    function closeCart() {
        nodes.cartDrawer.classList.remove("open");
        nodes.cartDrawer.setAttribute("aria-hidden", "true");
        nodes.cartBackdrop.classList.add("hidden");
    }

    function openAuth() {
        nodes.authModal.classList.remove("hidden");
        nodes.authBackdrop.classList.remove("hidden");
        nodes.authModal.setAttribute("aria-hidden", "false");
    }

    function closeAuth() {
        nodes.authModal.classList.add("hidden");
        nodes.authBackdrop.classList.add("hidden");
        nodes.authModal.setAttribute("aria-hidden", "true");
    }

    function setAuthTab(tab) {
        document.querySelectorAll("[data-auth-tab]").forEach((button) => {
            button.classList.toggle("active", button.dataset.authTab === tab);
        });
        nodes.loginForm.classList.toggle("hidden", tab !== "login");
        nodes.registerForm.classList.toggle("hidden", tab !== "register");
    }

    function updateAccountState() {
        nodes.accountLabel.textContent = window.emarketApi.getToken() ? "Đã đăng nhập" : "Thông tin";
    }

    async function handleAuthSubmit(event, type) {
        event.preventDefault();
        const payload = Object.fromEntries(new FormData(event.currentTarget).entries());

        try {
            if (type === "login") {
                await window.emarketApi.login(payload);
                showToast("Đăng nhập thành công.");
            } else {
                await window.emarketApi.register(payload);
                showToast("Đăng ký thành công.");
            }
            updateAccountState();
            closeAuth();
        } catch (error) {
            showToast(`Không kết nối được auth backend: ${error.message}`);
        }
    }

    function bindEvents() {
        nodes.productTabs.addEventListener("click", (event) => {
            const button = event.target.closest("[data-filter]");
            if (!button) return;
            state.filter = button.dataset.filter;
            nodes.productTabs.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab === button));
            renderProducts();
        });

        nodes.productGrid.addEventListener("click", (event) => {
            const addButton = event.target.closest("[data-add]");
            const detailButton = event.target.closest("[data-detail]");
            if (addButton) {
                addToCart(addButton.dataset.add);
                return;
            }
            if (detailButton) {
                const product = state.products.find((item) => item.id === Number(detailButton.dataset.detail));
                if (product) renderDetail(product);
            }
        });

        nodes.productDetail.addEventListener("click", (event) => {
            const addButton = event.target.closest("[data-add]");
            const qtyButton = event.target.closest("[data-qty]");
            const backButton = event.target.closest("#backToProducts");
            if (backButton) {
                setView("listing");
                document.getElementById("products").scrollIntoView({ behavior: "smooth", block: "start" });
                return;
            }
            if (addButton) addToCart(addButton.dataset.add);
            if (qtyButton) {
                state.quantity = Math.max(1, state.quantity + Number(qtyButton.dataset.qty));
                document.getElementById("detailQuantity").value = state.quantity;
            }
        });

        nodes.searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            state.query = nodes.searchInput.value.trim();
            renderProducts();
            document.getElementById("products").scrollIntoView({ behavior: "smooth" });
        });

        nodes.cartButton.addEventListener("click", openCart);
        nodes.closeCart.addEventListener("click", closeCart);
        nodes.cartBackdrop.addEventListener("click", closeCart);

        nodes.accountButton.addEventListener("click", openAuth);
        nodes.heroLoginButton.addEventListener("click", openAuth);
        nodes.closeAuth.addEventListener("click", closeAuth);
        nodes.authBackdrop.addEventListener("click", closeAuth);

        document.querySelectorAll("[data-auth-tab]").forEach((button) => {
            button.addEventListener("click", () => setAuthTab(button.dataset.authTab));
        });

        nodes.loginForm.addEventListener("submit", (event) => handleAuthSubmit(event, "login"));
        nodes.registerForm.addEventListener("submit", (event) => handleAuthSubmit(event, "register"));

        nodes.catalogToggle.addEventListener("click", () => nodes.catalogPanel.classList.add("open"));
        nodes.closeCatalog.addEventListener("click", () => nodes.catalogPanel.classList.remove("open"));
        nodes.catalogList.addEventListener("click", (event) => {
            const item = event.target.closest("[data-category]");
            if (!item) return;
            state.query = item.textContent.trim().replace(/\d+$/, "").trim();
            nodes.searchInput.value = state.query;
            renderProducts();
            nodes.catalogPanel.classList.remove("open");
            document.getElementById("products").scrollIntoView({ behavior: "smooth" });
        });

        nodes.categoryGrid.addEventListener("click", (event) => {
            const card = event.target.closest("[data-category]");
            if (!card) return;
            const category = window.demoCategories.find((item) => item.id === card.dataset.category);
            if (!category) return;
            state.query = category.name;
            nodes.searchInput.value = category.name;
            renderProducts();
            document.getElementById("products").scrollIntoView({ behavior: "smooth", block: "start" });
        });

        nodes.scrollTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
        nodes.storeButton.addEventListener("click", () => showToast("Hệ thống cửa hàng: Sài Gòn, Bình Dương và Cần Thơ."));
        nodes.orderLookupButton.addEventListener("click", () => showToast("Tính năng tra cứu đơn hàng sẽ yêu cầu mã đơn và số điện thoại."));
        nodes.notifyButton.addEventListener("click", () => showToast("Bạn đang không có thông báo mới."));
        nodes.languageButton.addEventListener("click", () => showToast("Giao diện hiện đang sử dụng tiếng Việt."));
        nodes.contactButton.addEventListener("click", () => window.location.assign("tel:19006750"));
    }

    async function loadProducts() {
        try {
            state.products = await window.emarketApi.getProducts();
            state.usingDemoData = false;
            nodes.dataStatus.textContent = "Đang hiển thị dữ liệu từ backend.";
        } catch (error) {
            state.products = window.demoProducts;
            state.usingDemoData = true;
            nodes.dataStatus.textContent = "Backend chưa sẵn sàng hoặc chưa có dữ liệu, đang hiển thị dữ liệu demo.";
        }
        renderProducts();
    }

    function init() {
        renderCategories();
        renderCart();
        bindEvents();
        updateAccountState();
        loadProducts();
    }

    init();
})();
