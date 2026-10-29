(function () {
    const guestCartKey = "emarket_guest_cart";
    const state = {
        products: [],
        cart: [],
        filter: "all",
        query: "",
        selectedProduct: null,
        quantity: 1,
        submittingOrder: false
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
        checkoutButton: $("#checkoutButton"),
        checkoutModal: $("#checkoutModal"),
        checkoutBackdrop: $("#checkoutBackdrop"),
        closeCheckout: $("#closeCheckout"),
        checkoutForm: $("#checkoutForm"),
        checkoutTotal: $("#checkoutTotal"),
        placeOrderButton: $("#placeOrderButton"),
        cartTotal: $("#cartTotal"),
        cartTitle: $("#cartTitle"),
        cartCount: $("#cartCount"),
        accountButton: $("#accountButton"),
        accountLabel: $("#accountLabel"),
        myOrdersButton: $("#myOrdersButton"),
        logoutButton: $("#logoutButton"),
        ordersModal: $("#ordersModal"),
        ordersBackdrop: $("#ordersBackdrop"),
        closeOrders: $("#closeOrders"),
        orderList: $("#orderList"),
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
        if (product.imageUrl) {
            return `<div class="product-photo ${compact ? "compact" : ""}"><img class="product-image" src="${escapeHtml(product.imageUrl)}" alt="${label}" loading="lazy"></div>`;
        }
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
                    ${product.warranty ? `<div class="warranty">${escapeHtml(product.warranty)}</div>` : ""}
                    ${product.sold == null ? "" : `<div class="sold-line">${icon("chart-no-axes-column", 15)} Đã bán ${Number(product.sold) || 0}</div>`}
                <div class="card-actions">
                    <button class="text-button" type="button">${icon("heart", 16)} Thích</button>
                    <button class="text-button" type="button">${icon("git-compare-arrows", 16)} So sánh</button>
                    <button class="add-button" type="button" data-add="${product.id}" ${disabled ? "disabled" : ""}>${disabled ? "Hết hàng" : "Thêm giỏ"}</button>
                </div>
            </article>
        `;
    }

    function categoryType(name) {
        const value = name.toLowerCase();
        if (value.includes("ipad") || value.includes("tablet")) return "tablet";
        if (value.includes("mac") || value.includes("laptop")) return "laptop";
        if (value.includes("watch")) return "watch";
        if (value.includes("airpod") || value.includes("earbud")) return "earbuds";
        if (value.includes("phụ kiện") || value.includes("accessory")) return "accessory";
        return "phone";
    }

    function renderCategories() {
        const categories = [...new Set(state.products.map((product) => product.category?.name).filter(Boolean))];
        nodes.categories.innerHTML = `
            <div class="section-title"><span></span><h2>Danh mục sản phẩm</h2><a href="#products">Xem tất cả</a></div>
            ${categories.length ? `<div class="category-grid">
                ${categories.map((name) => {
                    const count = state.products.filter((product) => product.category?.name === name).length;
                    const preset = window.demoCategories.find((category) => category.name === name);
                    return `<article class="category-card" data-category="${escapeHtml(name)}">
                        <div class="category-visuals">
                            <div class="category-tile">${productVisual({ name, imageType: preset?.type || categoryType(name), theme: preset?.theme }, true)}</div>
                            <div class="category-tile dim">${productVisual({ name, imageType: preset?.type || categoryType(name), theme: preset?.theme }, true)}<strong>${count}</strong></div>
                        </div>
                        <div class="category-info"><strong>${escapeHtml(name)}</strong><span>${count} sản phẩm</span></div>
                    </article>`;
                }).join("")}
            </div>` : `<p class="empty-state">Chưa có danh mục sản phẩm.</p>`}
        `;
        refreshIcons();
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
                <button class="tab active" data-filter="all" type="button">${icon("layout-grid", 18)}Tất cả sản phẩm</button>
                <button class="tab" data-filter="in-stock" type="button">${icon("package-check", 18)}Còn hàng</button>
                <button class="tab" data-filter="out-of-stock" type="button">${icon("package-x", 18)}Hết hàng</button>
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
            const matchesFlag = flag === "all"
                || (flag === "in-stock" && product.stock > 0)
                || (flag === "out-of-stock" && product.stock <= 0);
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
        const dealProducts = state.products.filter((product) => product.stock > 0).slice(0, 4);
        nodes.deals.innerHTML = `
            <div class="deal-copy">
                <span>Sản phẩm đang có hàng</span>
                <h2>Chọn thiết bị phù hợp với bạn</h2>
                <p>Danh sách sản phẩm được cập nhật từ cửa hàng.</p>
            </div>
            <div class="deal-grid">${dealProducts.length ? dealProducts.map((product) => productCard(product, true)).join("") : `<p class="empty-state">Hiện chưa có sản phẩm.</p>`}</div>
        `;
        refreshIcons();
    }

    function renderCategorySections() {
        const groups = [...new Set(state.products.map((product) => product.category?.name).filter(Boolean))];
        nodes.categorySections.innerHTML = groups.map((name) => {
            const products = state.products.filter((product) => product.category?.name === name).slice(0, 5);
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
                <div class="video-box">${icon("play", 34)}<strong>Đánh giá và hướng dẫn sản phẩm</strong><span>Nội dung đánh giá sẽ được cập nhật.</span></div>
            </section>
            <section class="panel feedback-section">
                <div class="section-title"><span></span><h2>Hỗ trợ khách hàng</h2></div>
                <blockquote>Đội ngũ E-Market hỗ trợ bạn tìm thiết bị phù hợp với nhu cầu và ngân sách.</blockquote>
                <strong>Tư vấn E-Market</strong><span>Hỗ trợ sản phẩm</span>
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
                <div><strong>E-Market Phone</strong><p>Cửa hàng điện thoại và thiết bị công nghệ.</p></div>
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
                    ${product.warranty ? `<p class="warranty">${escapeHtml(product.warranty)}</p>` : ""}
                    <div class="quantity-control">
                        <button type="button" data-qty="-1">-</button><input id="detailQuantity" value="1" readonly><button type="button" data-qty="1">+</button>
                    </div>
                    <div class="buy-actions">
                        <button class="add-cart-wide" type="button" data-add="${product.id}" ${product.stock <= 0 ? "disabled" : ""}>Thêm vào giỏ</button>
                        <button class="primary-button" type="button" data-buy-now="${product.id}" ${product.stock <= 0 ? "disabled" : ""}>Mua ngay</button>
                    </div>
                </div>
                <aside class="detail-sidebar">
                    <div><strong>Thông tin tồn kho</strong><span>Số lượng sản phẩm được cập nhật từ cửa hàng.</span></div>
                    <div><strong>Đặt hàng</strong><span>Nhập thông tin người nhận ở bước xác nhận đơn hàng.</span></div>
                    <div><strong>Hỗ trợ</strong><span>Thông tin đơn hàng sẽ hiển thị trong tài khoản sau khi đăng nhập.</span></div>
                </aside>
            </div>
        `;
        refreshIcons();
        nodes.productDetail.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function cartTotal() {
        return state.cart.reduce((sum, item) => sum + (Number(item.product.price) || 0) * item.quantity, 0);
    }

    function persistGuestCart() {
        const items = state.cart.filter((item) => item.local).map((item) => ({
            productId: item.product.id,
            quantity: item.quantity
        }));
        localStorage.setItem(guestCartKey, JSON.stringify(items));
    }

    function restoreGuestCart() {
        try {
            const saved = JSON.parse(localStorage.getItem(guestCartKey) || "[]");
            state.cart = saved.flatMap((savedItem) => {
                const product = state.products.find((item) => item.id === Number(savedItem.productId));
                const quantity = Number(savedItem.quantity);
                if (!product || !Number.isInteger(quantity) || quantity < 1) return [];
                return [{ id: `local-${product.id}`, product, quantity, local: true }];
            });
        } catch (error) {
            state.cart = [];
            localStorage.removeItem(guestCartKey);
        }
        renderCart();
    }

    function renderCart() {
        const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        const total = cartTotal();
        nodes.cartCount.textContent = String(totalItems);
        nodes.cartButton.setAttribute("aria-label", `Giỏ hàng, ${totalItems} sản phẩm`);
        nodes.cartTitle.textContent = `${totalItems} sản phẩm`;
        nodes.cartTotal.textContent = formatMoney(total);
        nodes.checkoutTotal.textContent = formatMoney(total);
        nodes.checkoutButton.disabled = state.cart.length === 0;
        nodes.cartItems.innerHTML = state.cart.length
            ? state.cart.map((item) => `
                <article class="cart-item">
                    ${productVisual(item.product, true)}
                    <div class="cart-item-info">
                        <strong>${escapeHtml(item.product.name)}</strong>
                        <span>${formatMoney(item.product.price)}</span>
                        <div class="cart-item-actions">
                            <button type="button" data-cart-change="${escapeHtml(item.id)}" data-delta="-1" aria-label="Giảm số lượng" ${item.quantity <= 1 ? "disabled" : ""}>−</button>
                            <output>${item.quantity}</output>
                            <button type="button" data-cart-change="${escapeHtml(item.id)}" data-delta="1" aria-label="Tăng số lượng" ${item.quantity >= item.product.stock ? "disabled" : ""}>+</button>
                            <button class="cart-remove" type="button" data-cart-remove="${escapeHtml(item.id)}">Xóa</button>
                        </div>
                    </div>
                </article>
            `).join("")
            : `<p class="empty-state">Giỏ hàng đang trống. Hãy chọn sản phẩm để tiếp tục.</p>`;
    }

    function addLocalCart(productId, quantity = 1) {
        const product = state.products.find((item) => item.id === Number(productId));
        if (!product || product.stock <= 0) return false;
        const existing = state.cart.find((item) => item.product.id === product.id);
        if ((existing?.quantity || 0) + quantity > product.stock) {
            showToast(`Chỉ còn ${product.stock} sản phẩm trong kho.`);
            return false;
        }
        if (existing) existing.quantity += quantity;
        else state.cart.push({ id: `local-${product.id}`, product, quantity, local: true });
        persistGuestCart();
        renderCart();
        return true;
    }

    async function addToCart(productId, openDrawer = true) {
        const quantity = state.selectedProduct?.id === Number(productId) ? state.quantity : 1;
        if (window.emarketApi.getToken()) {
            try {
                state.cart = (await window.emarketApi.addToCart(Number(productId), quantity)).items;
                renderCart();
                showToast("Đã gửi sản phẩm vào giỏ hàng backend.");
            } catch (error) {
                showToast(`Không thể cập nhật giỏ hàng: ${error.message}`);
                return false;
            }
        } else if (!addLocalCart(productId, quantity)) {
            return false;
        }
        if (openDrawer) await openCart();
        return true;
    }

    async function changeCartQuantity(itemId, delta) {
        const item = state.cart.find((candidate) => candidate.id === String(itemId));
        if (!item) return;
        const quantity = item.quantity + Number(delta);
        if (quantity < 1) return;
        if (quantity > item.product.stock) {
            showToast(`Chỉ còn ${item.product.stock} sản phẩm trong kho.`);
            return;
        }
        if (item.local) {
            item.quantity = quantity;
            persistGuestCart();
            renderCart();
            return;
        }
        try {
            state.cart = (await window.emarketApi.updateCartItem(item.id, quantity)).items;
            renderCart();
        } catch (error) {
            showToast(`Không thể cập nhật số lượng: ${error.message}`);
        }
    }

    async function removeCartItem(itemId) {
        const item = state.cart.find((candidate) => candidate.id === String(itemId));
        if (!item) return;
        if (item.local) {
            state.cart = state.cart.filter((candidate) => candidate.id !== item.id);
            persistGuestCart();
            renderCart();
            return;
        }
        try {
            state.cart = (await window.emarketApi.removeCartItem(item.id)).items;
            renderCart();
        } catch (error) {
            showToast(`Không thể xóa sản phẩm: ${error.message}`);
        }
    }

    async function openCart() {
        if (window.emarketApi.getToken()) {
            await loadAccountCart();
        }
        nodes.cartDrawer.classList.add("open");
        nodes.cartDrawer.setAttribute("aria-hidden", "false");
        nodes.cartBackdrop.classList.remove("hidden");
    }

    function closeCart() {
        nodes.cartDrawer.classList.remove("open");
        nodes.cartDrawer.setAttribute("aria-hidden", "true");
        nodes.cartBackdrop.classList.add("hidden");
    }

    async function showCheckout() {
        if (window.emarketApi.getToken()) {
            await loadAccountCart();
            if (state.cart.some((item) => item.local)) {
                showToast("Một số mặt hàng chưa đồng bộ với giỏ tài khoản. Hãy thử lại sau khi kiểm tra tồn kho.");
                return;
            }
        }
        if (!state.cart.length) {
            showToast("Giỏ hàng đang trống.");
            return;
        }
        closeCart();
        nodes.checkoutTotal.textContent = formatMoney(cartTotal());
        nodes.checkoutModal.classList.remove("hidden");
        nodes.checkoutBackdrop.classList.remove("hidden");
        nodes.checkoutModal.setAttribute("aria-hidden", "false");
    }

    function closeCheckout() {
        nodes.checkoutModal.classList.add("hidden");
        nodes.checkoutBackdrop.classList.add("hidden");
        nodes.checkoutModal.setAttribute("aria-hidden", "true");
    }

    async function handleCheckoutSubmit(event) {
        event.preventDefault();
        if (!state.cart.length || state.submittingOrder) return;
        state.submittingOrder = true;
        nodes.placeOrderButton.disabled = true;
        nodes.placeOrderButton.textContent = "Đang tạo đơn hàng…";
        const form = Object.fromEntries(new FormData(nodes.checkoutForm).entries());
        const payload = {
            customerName: form.customerName.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            items: state.cart.map((item) => ({ productId: item.product.id, quantity: item.quantity }))
        };

        try {
            const order = await window.emarketApi.createOrder(payload);
            state.cart = [];
            persistGuestCart();
            renderCart();
            nodes.checkoutForm.reset();
            closeCheckout();
            closeCart();
            showToast(`Đặt hàng thành công. Mã đơn hàng: #${order.id}.`);
        } catch (error) {
            showToast(`Chưa thể tạo đơn hàng: ${error.message}`);
        } finally {
            state.submittingOrder = false;
            nodes.placeOrderButton.disabled = false;
            nodes.placeOrderButton.textContent = "Xác nhận đặt hàng";
        }
    }

    function closeOrders() {
        nodes.ordersModal.classList.add("hidden");
        nodes.ordersBackdrop.classList.add("hidden");
        nodes.ordersModal.setAttribute("aria-hidden", "true");
    }

    function orderDate(value) {
        if (!value) return "Ngày đặt chưa có";
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? "Ngày đặt chưa có" : new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(date);
    }

    function orderStatusLabel(status) {
        const labels = {
            PENDING: "Chờ xác nhận",
            CONFIRMED: "Đã xác nhận",
            PROCESSING: "Đang xử lý",
            SHIPPING: "Đang giao",
            SHIPPED: "Đang giao",
            DELIVERED: "Đã giao",
            CANCELLED: "Đã hủy",
            CANCELED: "Đã hủy"
        };
        const value = String(status || "PENDING").toUpperCase();
        return labels[value] || status || "Đang xử lý";
    }

    async function showMyOrders() {
        if (!window.emarketApi.getToken()) {
            showToast("Đăng nhập để xem các đơn hàng của bạn.");
            openAuth("login");
            return;
        }
        nodes.orderList.innerHTML = `<p class="empty-state">Đang tải đơn hàng…</p>`;
        nodes.ordersModal.classList.remove("hidden");
        nodes.ordersBackdrop.classList.remove("hidden");
        nodes.ordersModal.setAttribute("aria-hidden", "false");
        try {
            const orders = await window.emarketApi.getMyOrders();
            nodes.orderList.innerHTML = orders.length ? orders.map((order) => `
                <article class="order-card">
                    <div class="order-card-head"><strong>Đơn #${escapeHtml(order.id)}</strong><span>${escapeHtml(orderStatusLabel(order.status))}</span></div>
                    <small>${escapeHtml(orderDate(order.createdAt))}</small>
                    <p>${(order.items || []).map((item) => `${escapeHtml(item.product?.name || "Sản phẩm")} × ${Number(item.quantity) || 0}`).join("<br>")}</p>
                    <div class="order-card-total"><span>Tổng đơn</span><strong>${formatMoney(order.totalAmount)}</strong></div>
                </article>
            `).join("") : `<p class="empty-state">Bạn chưa có đơn hàng nào.</p>`;
        } catch (error) {
            nodes.orderList.innerHTML = `<p class="empty-state">Không thể tải đơn hàng: ${escapeHtml(error.message)}</p>`;
        }
    }

    async function loadAccountCart() {
        try {
            state.cart = (await window.emarketApi.getCart()).items;
            const guestItems = JSON.parse(localStorage.getItem(guestCartKey) || "[]");
            const pending = [];
            for (const item of guestItems) {
                try {
                    state.cart = (await window.emarketApi.addToCart(Number(item.productId), Number(item.quantity))).items;
                } catch (error) {
                    const product = state.products.find((candidate) => candidate.id === Number(item.productId));
                    if (product) pending.push({ id: `local-${product.id}`, product, quantity: Number(item.quantity), local: true });
                }
            }
            state.cart.push(...pending);
            persistGuestCart();
            if (pending.length) showToast("Một số sản phẩm trong giỏ khách chưa đồng bộ được. Hãy kiểm tra tồn kho.");
        } catch (error) {
            showToast(`Không thể tải giỏ hàng tài khoản: ${error.message}`);
        }
        renderCart();
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
        const signedIn = Boolean(window.emarketApi.getToken());
        nodes.accountLabel.textContent = signedIn ? "Tài khoản" : "Thông tin";
        nodes.accountButton.setAttribute("aria-label", signedIn ? "Tài khoản đã đăng nhập" : "Đăng nhập hoặc đăng ký");
        document.querySelectorAll("[data-auth-open]").forEach((button) => button.classList.toggle("hidden", signedIn));
        nodes.myOrdersButton.classList.toggle("hidden", !signedIn);
        nodes.logoutButton.classList.toggle("hidden", !signedIn);
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
            await loadAccountCart();
        } catch (error) {
            showToast(`${type === "login" ? "Đăng nhập" : "Đăng ký"} thất bại: ${error.message}`);
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
            const buyNow = event.target.closest("[data-buy-now]");

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
            if (buyNow) {
                void (async () => {
                    const added = await addToCart(buyNow.dataset.buyNow, false);
                    if (added) showCheckout();
                })();
            }
            if (search) runSearch(search.dataset.menuSearch);
            if (category) runSearch(category.dataset.category);
            if (authOpen) openAuth(authOpen.dataset.authOpen);
        });

        nodes.productDetail.addEventListener("click", (event) => {
            const qty = event.target.closest("[data-qty]");
            if (event.target.closest("#backToProducts")) {
                setView("listing");
                $("#products").scrollIntoView({ behavior: "smooth", block: "start" });
            }
            if (qty) {
                state.quantity = Math.min(state.selectedProduct.stock, Math.max(1, state.quantity + Number(qty.dataset.qty)));
                $("#detailQuantity").value = state.quantity;
            }
        });

        nodes.cartItems.addEventListener("click", (event) => {
            const change = event.target.closest("[data-cart-change]");
            const remove = event.target.closest("[data-cart-remove]");
            if (change) changeCartQuantity(change.dataset.cartChange, change.dataset.delta);
            if (remove) removeCartItem(remove.dataset.cartRemove);
        });

        nodes.searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            runSearch(nodes.searchInput.value);
        });
        nodes.cartButton.addEventListener("click", openCart);
        nodes.closeCart.addEventListener("click", closeCart);
        nodes.cartBackdrop.addEventListener("click", closeCart);
        nodes.checkoutButton.addEventListener("click", showCheckout);
        nodes.closeCheckout.addEventListener("click", closeCheckout);
        nodes.checkoutBackdrop.addEventListener("click", closeCheckout);
        nodes.checkoutForm.addEventListener("submit", handleCheckoutSubmit);
        nodes.accountButton.addEventListener("click", () => {
            if (window.emarketApi.getToken()) showMyOrders();
            else openAuth("login");
        });
        nodes.heroLoginButton.addEventListener("click", () => openAuth("login"));
        nodes.closeAuth.addEventListener("click", closeAuth);
        nodes.authBackdrop.addEventListener("click", closeAuth);
        document.querySelectorAll("[data-auth-tab]").forEach((button) => button.addEventListener("click", () => setAuthTab(button.dataset.authTab)));
        nodes.loginForm.addEventListener("submit", (event) => handleAuthSubmit(event, "login"));
        nodes.registerForm.addEventListener("submit", (event) => handleAuthSubmit(event, "register"));
        nodes.myOrdersButton.addEventListener("click", showMyOrders);
        nodes.logoutButton.addEventListener("click", () => {
            window.emarketApi.clearToken();
            state.cart = [];
            restoreGuestCart();
            updateAccountState();
            showToast("Bạn đã đăng xuất.");
        });
        nodes.closeOrders.addEventListener("click", closeOrders);
        nodes.ordersBackdrop.addEventListener("click", closeOrders);
        nodes.catalogToggle.addEventListener("click", () => nodes.catalogPanel.classList.add("open"));
        nodes.closeCatalog.addEventListener("click", () => nodes.catalogPanel.classList.remove("open"));
        nodes.scrollTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
        nodes.storeButton.addEventListener("click", () => showToast("Hệ thống cửa hàng: Sài Gòn, Bình Dương và Cần Thơ."));
        nodes.orderLookupButton.addEventListener("click", showMyOrders);
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
        renderCategories();
        renderProducts();
        renderDeal();
        renderCategorySections();
    }

    async function init() {
        renderLayout();
        bindEvents();
        renderCart();
        updateAccountState();
        await loadProducts();
        restoreGuestCart();
        if (window.emarketApi.getToken()) await loadAccountCart();
    }

    init();
})();
