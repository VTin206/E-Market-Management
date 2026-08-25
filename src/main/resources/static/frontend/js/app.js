(function () {
    const state = {
        products: [],
        cart: [],
        filter: "new",
        query: "",
        selectedProduct: null,
        quantity: 1
    };

    const $ = (selector) => document.querySelector(selector);
    const nodes = {
        services: $("#services"),
        categories: $("#categories"),
        products: $("#products"),
        deals: $("#deals"),
        categorySections: $("#categorySections"),
        contentGrid: $("#contentGrid"),
        newsletter: $("#newsletter"),
        footer: $(".site-footer"),
        productDetail: $("#productDetail"),
        searchForm: $("#searchForm"),
        searchInput: $("#searchInput"),
        cartButton: $("#cartButton"),
        cartDrawer: $("#cartDrawer"),
        cartBackdrop: $("#cartBackdrop"),
        closeCart: $("#closeCart"),
        cartItems: $("#cartItems"),
        cartTotal: $("#cartTotal"),
        cartTitle: $("#cartTitle"),
        cartCount: $("#cartCount"),
        accountButton: $("#accountButton"),
        accountLabel: $("#accountLabel"),
        authModal: $("#authModal"),
        authBackdrop: $("#authBackdrop"),
        closeAuth: $("#closeAuth"),
        loginForm: $("#loginForm"),
        registerForm: $("#registerForm"),
        catalogPanel: $("#catalogPanel"),
        catalogToggle: $("#catalogToggle"),
        closeCatalog: $("#closeCatalog"),
        catalogList: $("#catalogList"),
        megaMenu: $("#megaMenu"),
        toast: $("#toast"),
        scrollTopButton: $("#scrollTopButton"),
        heroLoginButton: $("#heroLoginButton"),
        storeButton: $("#storeButton"),
        orderLookupButton: $("#orderLookupButton"),
        notifyButton: $("#notifyButton"),
        contactButton: $("#contactButton")
    };

    function icon(name, size = 20) {
        return `<i data-lucide="${name}" style="width:${size}px;height:${size}px"></i>`;
    }

    function refreshIcons() {
        if (window.lucide) window.lucide.createIcons();
    }

    function escapeHtml(value) {
        return String(value || "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function formatMoney(value) {
        if (value === null || value === undefined || value === "") return "Liên hệ";
        return new Intl.NumberFormat("vi-VN").format(value) + "đ";
    }

    function showToast(message) {
        nodes.toast.textContent = message;
        nodes.toast.classList.remove("hidden");
        window.clearTimeout(showToast.timer);
        showToast.timer = window.setTimeout(() => nodes.toast.classList.add("hidden"), 2800);
    }

    function productVisual(product, compact = false) {
        const types = ["phone", "tablet", "laptop", "watch", "earbuds", "accessory"];
        const type = types.includes(product.imageType) ? product.imageType : "phone";
        const label = escapeHtml(product.name || "Sản phẩm công nghệ");
        const theme = product.theme ? ` style="--mock-bg:${String(product.theme).replaceAll('"', "&quot;")}"` : "";
        return `<div class="device-mock ${type} ${compact ? "compact" : ""}" role="img" aria-label="${label}"><span${theme}></span></div>`;
    }

    function productCard(product, compact = false) {
        const disabled = product.stock <= 0;
        return `
            <article class="product-card ${disabled ? "is-out" : ""}">
                ${product.discount ? `<span class="discount">Giảm ${product.discount}%</span>` : ""}
                <button class="product-media" type="button" data-detail="${product.id}">${productVisual(product, compact)}</button>
                <div class="label-row">
                    ${(product.badges || []).map((badge) => `<span class="mini-label">${escapeHtml(badge)}</span>`).join("")}
                    ${disabled ? `<span class="mini-label muted">Hết hàng</span>` : ""}
                </div>
                <button class="product-name" type="button" data-detail="${product.id}">${escapeHtml(product.name)}</button>
                <div class="price-line">
                    <strong class="price">${formatMoney(product.price)}</strong>
                    ${product.oldPrice ? `<span class="old-price">${formatMoney(product.oldPrice)}</span>` : ""}
                </div>
                <div class="warranty">${escapeHtml(product.warranty)}</div>
                <div class="sold-line">${icon("chart-no-axes-column", 15)} Đã bán ${product.sold || 0}</div>
                <div class="card-actions">
                    <button class="text-button" type="button">${icon("heart", 16)} Thích</button>
                    <button class="text-button" type="button">${icon("git-compare-arrows", 16)} So sánh</button>
                    <button class="add-button" type="button" data-add="${product.id}" ${disabled ? "disabled" : ""}>${disabled ? "Hết hàng" : "Thêm giỏ"}</button>
                </div>
            </article>
        `;
    }

    function renderLayout() {
        nodes.services.innerHTML = window.demoServices.map((item) => `
            <article>${icon(item.icon, 26)}<div><strong>${item.title}</strong><span>${item.text}</span></div></article>
        `).join("");

        nodes.categories.innerHTML = `
            <div class="section-title"><span></span><h2>Danh mục nổi bật</h2><a href="#products">Xem tất cả</a></div>
            <div class="category-grid">
                ${window.demoCategories.map((category) => `
                    <article class="category-card" data-category="${category.id}">
                        <div class="category-visuals">
                            <div class="category-tile">${productVisual({ ...category, imageType: category.type }, true)}</div>
                            <div class="category-tile dim">${productVisual({ ...category, imageType: category.type }, true)}<strong>+${category.count}</strong></div>
                        </div>
                        <div class="category-info"><strong>${category.name}</strong><span>${category.subtitle}</span></div>
                    </article>
                `).join("")}
            </div>
        `;

        nodes.products.innerHTML = `
            <div class="tabs" id="productTabs">
                <button class="tab active" data-filter="new" type="button">${icon("sparkles", 18)}Sản phẩm mới</button>
                <button class="tab" data-filter="featured" type="button">${icon("flame", 18)}Sản phẩm nổi bật</button>
                <button class="tab" data-filter="best" type="button">${icon("badge-check", 18)}Sản phẩm bán chạy</button>
            </div>
            <div class="status-line" id="dataStatus"></div>
            <div class="product-grid" id="productGrid"></div>
        `;

        nodes.megaMenu.innerHTML = window.demoMenu.map((group) => `
            <div><strong>${group.name}</strong>${group.children.map((child) => `<button type="button" data-menu-search="${child}">${child}</button>`).join("")}</div>
        `).join("");

        nodes.catalogList.innerHTML = window.demoMenu.map((group) => `
            <button class="catalog-item" type="button" data-menu-search="${group.name}"><span>${group.name}</span>${icon("chevron-right", 18)}</button>
            ${group.children.map((child) => `<button class="catalog-subitem" type="button" data-menu-search="${child}">${child}</button>`).join("")}
        `).join("");

        renderDeal();
        renderCategorySections();
        renderContent();
        renderFooter();
        refreshIcons();
    }

    function filteredProducts(flag = state.filter, query = state.query) {
        return state.products.filter((product) => {
            const matchesFlag = !flag || product.flags?.includes(flag);
            const text = `${product.name} ${product.category?.name || ""}`.toLowerCase();
            const matchesQuery = !query || text.includes(query.toLowerCase());
            return matchesFlag && matchesQuery;
        });
    }

    function renderProducts() {
        const grid = $("#productGrid");
        const filtered = filteredProducts();
        grid.innerHTML = filtered.length
            ? filtered.map((product) => productCard(product)).join("")
            : `<div class="empty-state">Không tìm thấy sản phẩm phù hợp.</div>`;
        refreshIcons();
    }

    function renderDeal() {
        const dealProducts = window.demoProducts.filter((product) => product.discount).slice(0, 4);
        nodes.deals.innerHTML = `
            <div class="deal-copy">
                <span>Deal nổi bật</span>
                <h2>Cam kết giá tốt nhất thị trường</h2>
                <p>Sản phẩm chính hãng, ưu đãi rõ ràng, hỗ trợ đổi trả nhanh khi có lỗi từ nhà sản xuất.</p>
            </div>
            <div class="deal-grid">${dealProducts.map((product) => productCard(product, true)).join("")}</div>
        `;
    }

    function renderCategorySections() {
        const groups = ["iPhone", "iPad", "Watch", "Mac", "AirPods"];
        nodes.categorySections.innerHTML = groups.map((name) => {
            const products = window.demoProducts.filter((product) => product.category?.name === name).slice(0, 5);
            if (!products.length) return "";
            return `
                <section class="shell panel category-product-section">
                    <div class="section-title"><span></span><h2>${name}</h2><a href="#products" data-menu-search="${name}">Xem toàn bộ</a></div>
                    <div class="product-grid small-grid">${products.map((product) => productCard(product, true)).join("")}</div>
                </section>
            `;
        }).join("");
    }

    function renderContent() {
        nodes.contentGrid.innerHTML = `
            <section class="panel news-section" id="news">
                <div class="section-title"><span></span><h2>Tin tức</h2></div>
                ${window.demoNews.map((item) => `
                    <article class="news-item"><small>${item.tag} · ${item.date}</small><strong>${item.title}</strong><a href="#news">Đọc tiếp</a></article>
                `).join("")}
            </section>
            <section class="panel review-section" id="reviews">
                <div class="section-title"><span></span><h2>Review</h2></div>
                <div class="video-box">${icon("play", 34)}<strong>Video trải nghiệm sản phẩm mới</strong><span>Không dùng tài sản từ website tham chiếu.</span></div>
            </section>
            <section class="panel feedback-section">
                <div class="section-title"><span></span><h2>Khách hàng nói gì</h2></div>
                <blockquote>“Giao diện demo rõ ràng, dễ tìm sản phẩm và giỏ hàng hoạt động mượt cho phần prototype.”</blockquote>
                <strong>Minh Anh</strong><span>Khách hàng thân thiết</span>
            </section>
        `;

        nodes.newsletter.innerHTML = `
            <div><strong>Nhận tin khuyến mãi</strong><span>Cập nhật deal điện thoại, tablet và phụ kiện mới nhất.</span></div>
            <form><input type="email" placeholder="Email của bạn"><button class="primary-button" type="submit">Đăng ký</button></form>
        `;
    }

    function renderFooter() {
        nodes.footer.innerHTML = `
            <div class="shell footer-grid">
                <div><strong>E-Market Phone</strong><p>Website demo thương mại điện tử bán điện thoại và thiết bị công nghệ.</p></div>
                <div><strong>Hỗ trợ</strong><a href="#warranty">Tra cứu bảo hành</a><a href="#faq">Câu hỏi thường gặp</a><a href="#contact">Liên hệ</a></div>
                <div><strong>Danh mục</strong><a href="#products">iPhone</a><a href="#products">iPad</a><a href="#products">Mac</a><a href="#products">Phụ kiện</a></div>
                <div><strong>Hotline</strong><p>1900 6750<br>support@emarket.demo</p></div>
            </div>
        `;
    }

    function setView(view) {
        document.querySelectorAll(".listing-view").forEach((section) => section.classList.toggle("hidden", view !== "listing"));
        nodes.productDetail.classList.toggle("hidden", view !== "detail");
    }

    function renderDetail(product) {
        state.selectedProduct = product;
        state.quantity = 1;
        setView("detail");
        nodes.productDetail.innerHTML = `
            <button class="back-button" id="backToProducts" type="button">${icon("arrow-left", 18)} Quay lại sản phẩm</button>
            <div class="detail-grid">
                <div class="detail-gallery">
                    <div class="detail-main-visual">${productVisual(product)}</div>
                    <div class="thumbs">${[0, 1, 2, 3].map(() => `<button type="button">${productVisual(product, true)}</button>`).join("")}</div>
                </div>
                <div class="detail-buy">
                    <h1>${escapeHtml(product.name)}</h1>
                    <div class="detail-meta">
                        <span>Loại: <strong>${escapeHtml(product.category?.name)}</strong></span>
                        <span>Thương hiệu: <strong>${escapeHtml(product.brand?.name)}</strong></span>
                        <span>Tình trạng: <strong>${product.stock > 0 ? "Còn hàng" : "Hết hàng"}</strong></span>
                    </div>
                    <div class="detail-price"><span>${formatMoney(product.price)}</span>${product.oldPrice ? `<small>${formatMoney(product.oldPrice)}</small>` : ""}</div>
                    <p class="warranty">${escapeHtml(product.warranty)}</p>
                    <div class="quantity-control">
                        <button type="button" data-qty="-1">-</button><input id="detailQuantity" value="1" readonly><button type="button" data-qty="1">+</button>
                    </div>
                    <div class="buy-actions">
                        <button class="add-cart-wide" type="button" data-add="${product.id}" ${product.stock <= 0 ? "disabled" : ""}>Thêm vào giỏ</button>
                        <button class="primary-button" type="button">Mua ngay</button>
                    </div>
                </div>
                <aside class="detail-sidebar">${window.demoStores.map((store) => `<div><strong>${store.name}</strong><span>${store.address}</span></div>`).join("")}</aside>
            </div>
        `;
        refreshIcons();
        nodes.productDetail.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function renderCart() {
        const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        const total = state.cart.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);
        nodes.cartCount.textContent = String(totalItems);
        nodes.cartTitle.textContent = `${totalItems} sản phẩm`;
        nodes.cartTotal.textContent = formatMoney(total);
        nodes.cartItems.innerHTML = state.cart.length
            ? state.cart.map((item) => `<div class="cart-item">${productVisual(item.product, true)}<div><strong>${escapeHtml(item.product.name)}</strong><span>${formatMoney(item.product.price)}</span><p>Số lượng: ${item.quantity}</p></div></div>`).join("")
            : `<p>Giỏ hàng đang trống.</p>`;
    }

    function addLocalCart(productId, quantity = 1) {
        const product = state.products.find((item) => item.id === Number(productId));
        if (!product || product.stock <= 0) return;
        const existing = state.cart.find((item) => item.product.id === product.id);
        if (existing) existing.quantity += quantity;
        else state.cart.push({ product, quantity });
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

    function openAuth(tab = "login") {
        nodes.authModal.classList.remove("hidden");
        nodes.authBackdrop.classList.remove("hidden");
        nodes.authModal.setAttribute("aria-hidden", "false");
        setAuthTab(tab);
    }

    function closeAuth() {
        nodes.authModal.classList.add("hidden");
        nodes.authBackdrop.classList.add("hidden");
        nodes.authModal.setAttribute("aria-hidden", "true");
    }

    function setAuthTab(tab) {
        document.querySelectorAll("[data-auth-tab]").forEach((button) => button.classList.toggle("active", button.dataset.authTab === tab));
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

    function runSearch(value) {
        state.query = value.trim();
        nodes.searchInput.value = state.query;
        setView("listing");
        renderProducts();
        $("#products").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function bindEvents() {
        document.addEventListener("click", (event) => {
            const filter = event.target.closest("[data-filter]");
            const detail = event.target.closest("[data-detail]");
            const add = event.target.closest("[data-add]");
            const search = event.target.closest("[data-menu-search]");
            const category = event.target.closest("[data-category]");
            const authOpen = event.target.closest("[data-auth-open]");

            if (filter) {
                state.filter = filter.dataset.filter;
                document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab === filter));
                renderProducts();
            }
            if (detail) {
                const product = state.products.find((item) => item.id === Number(detail.dataset.detail));
                if (product) renderDetail(product);
            }
            if (add) addToCart(add.dataset.add);
            if (search) runSearch(search.dataset.menuSearch);
            if (category) {
                const found = window.demoCategories.find((item) => item.id === category.dataset.category);
                if (found) runSearch(found.name);
            }
            if (authOpen) openAuth(authOpen.dataset.authOpen);
        });

        nodes.productDetail.addEventListener("click", (event) => {
            const qty = event.target.closest("[data-qty]");
            if (event.target.closest("#backToProducts")) {
                setView("listing");
                $("#products").scrollIntoView({ behavior: "smooth", block: "start" });
            }
            if (qty) {
                state.quantity = Math.max(1, state.quantity + Number(qty.dataset.qty));
                $("#detailQuantity").value = state.quantity;
            }
        });

        nodes.searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            runSearch(nodes.searchInput.value);
        });
        nodes.cartButton.addEventListener("click", openCart);
        nodes.closeCart.addEventListener("click", closeCart);
        nodes.cartBackdrop.addEventListener("click", closeCart);
        nodes.accountButton.addEventListener("click", () => openAuth("login"));
        nodes.heroLoginButton.addEventListener("click", () => openAuth("login"));
        nodes.closeAuth.addEventListener("click", closeAuth);
        nodes.authBackdrop.addEventListener("click", closeAuth);
        document.querySelectorAll("[data-auth-tab]").forEach((button) => button.addEventListener("click", () => setAuthTab(button.dataset.authTab)));
        nodes.loginForm.addEventListener("submit", (event) => handleAuthSubmit(event, "login"));
        nodes.registerForm.addEventListener("submit", (event) => handleAuthSubmit(event, "register"));
        nodes.catalogToggle.addEventListener("click", () => nodes.catalogPanel.classList.add("open"));
        nodes.closeCatalog.addEventListener("click", () => nodes.catalogPanel.classList.remove("open"));
        nodes.scrollTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
        nodes.storeButton.addEventListener("click", () => showToast("Hệ thống cửa hàng: Sài Gòn, Bình Dương và Cần Thơ."));
        nodes.orderLookupButton.addEventListener("click", () => showToast("Tra cứu đơn hàng sẽ yêu cầu mã đơn và số điện thoại."));
        nodes.notifyButton.addEventListener("click", () => showToast("Bạn đang không có thông báo mới."));
        nodes.contactButton.addEventListener("click", () => window.location.assign("tel:19006750"));
    }

    async function loadProducts() {
        const status = $("#dataStatus");
        try {
            state.products = await window.emarketApi.getProducts();
            status.textContent = "Đang hiển thị dữ liệu từ backend.";
        } catch (error) {
            state.products = window.demoProducts;
            status.textContent = "Backend chưa sẵn sàng hoặc chưa có dữ liệu, đang hiển thị dữ liệu demo.";
        }
        renderProducts();
    }

    function init() {
        renderLayout();
        bindEvents();
        renderCart();
        updateAccountState();
        loadProducts();
    }

    init();
})();
