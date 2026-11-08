(function () {
    const guestCartKey = "emarket_guest_cart";
    const newsletterStorageKey = "emarket_newsletter_emails";
    let utilityModalOpener = null;
    const state = {
        products: [],
        productsPage: 0,
        cart: [],
        filter: "all",
        query: "",
        selectedProduct: null,
        reviewItems: [],
        editingReviewId: null,
        quantity: 1,
        submittingOrder: false,
        view: "listing",
        adminTab: "orders",
        adminEditing: null,
        admin: {
            products: [],
            orders: [],
            categories: [],
            brands: [],
            memberships: [],
            error: ""
        }
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
        adminButton: $("#adminButton"),
        adminView: $("#adminView"),
        adminSummary: $("#adminSummary"),
        adminContent: $("#adminContent"),
        adminTabs: $("#adminTabs"),
        adminRefresh: $("#adminRefresh"),
        backToStore: $("#backToStore"),
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
        utilityModal: $("#utilityModal"),
        utilityBackdrop: $("#utilityBackdrop"),
        closeUtilityModal: $("#closeUtilityModal"),
        utilityTitle: $("#utilityTitle"),
        utilityContent: $("#utilityContent"),
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

    function openUtilityModal(title, content) {
        utilityModalOpener = document.activeElement;
        nodes.utilityTitle.textContent = title;
        nodes.utilityContent.innerHTML = content;
        nodes.utilityBackdrop.classList.remove("hidden");
        nodes.utilityModal.classList.remove("hidden");
        nodes.utilityModal.setAttribute("aria-hidden", "false");
        nodes.closeUtilityModal.focus();
        refreshIcons();
    }

    function closeUtilityModal() {
        nodes.utilityBackdrop.classList.add("hidden");
        nodes.utilityModal.classList.add("hidden");
        nodes.utilityModal.setAttribute("aria-hidden", "true");
        nodes.utilityContent.innerHTML = "";
        if (utilityModalOpener instanceof HTMLElement) utilityModalOpener.focus();
        utilityModalOpener = null;
    }

    function openStores() {
        const stores = window.demoStores || [];
        const content = stores.length
            ? `<p class="utility-note">Địa chỉ tham khảo. Vui lòng gọi hotline để xác nhận giờ hoạt động trước khi đến.</p>
                <div class="store-list">${stores.map((store) => `
                    <article class="store-card">
                        <span class="store-icon">${icon("map-pin", 20)}</span>
                        <div><strong>${escapeHtml(store.name)}</strong><p>${escapeHtml(store.address)}</p></div>
                    </article>
                `).join("")}</div>`
            : `<p class="empty-state">Chưa có thông tin cửa hàng.</p>`;
        openUtilityModal("Hệ thống cửa hàng", content);
    }

    function openNotifications() {
        openUtilityModal("Thông báo", `
            <div class="utility-empty">
                ${icon("bell-ring", 28)}
                <strong>Bạn chưa có thông báo mới</strong>
                <p>Thông tin cập nhật đơn hàng sẽ xuất hiện tại đây.</p>
            </div>
        `);
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
            <nav class="product-pagination hidden" id="productPagination" aria-label="Phân trang sản phẩm"></nav>
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
        const pagination = $("#productPagination");
        const filtered = filteredProducts();
        const pageSize = 12;
        const pageCount = Math.ceil(filtered.length / pageSize);
        state.productsPage = Math.min(state.productsPage, Math.max(pageCount - 1, 0));
        const pageProducts = filtered.slice(state.productsPage * pageSize, (state.productsPage + 1) * pageSize);

        grid.innerHTML = pageProducts.length
            ? pageProducts.map((product) => productCard(product)).join("")
            : `<div class="empty-state">Không tìm thấy sản phẩm phù hợp.</div>`;

        if (pageCount > 1) {
            const firstProduct = state.productsPage * pageSize + 1;
            const lastProduct = Math.min((state.productsPage + 1) * pageSize, filtered.length);
            pagination.innerHTML = `
                <span class="pagination-summary" aria-live="polite">Hiển thị ${firstProduct}–${lastProduct} trong ${filtered.length} sản phẩm</span>
                <div class="product-page-controls">
                    <button class="product-page-button" type="button" data-products-page="${state.productsPage - 1}" ${state.productsPage === 0 ? "disabled" : ""} aria-label="Trang trước">${icon("chevron-left", 17)}<span>Trước</span></button>
                    <span class="pagination-current">Trang ${state.productsPage + 1} / ${pageCount}</span>
                    <button class="product-page-button" type="button" data-products-page="${state.productsPage + 1}" ${state.productsPage >= pageCount - 1 ? "disabled" : ""} aria-label="Trang sau"><span>Sau</span>${icon("chevron-right", 17)}</button>
                </div>
            `;
            pagination.classList.remove("hidden");
        } else {
            pagination.innerHTML = "";
            pagination.classList.add("hidden");
        }
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
                <div class="video-box"><strong>Xem đánh giá của từng sản phẩm</strong><span>Mở trang chi tiết sản phẩm để đọc và gửi đánh giá.</span></div>
            </section>
            <section class="panel feedback-section">
                <div class="section-title"><span></span><h2>Hỗ trợ khách hàng</h2></div>
                <blockquote>Đội ngũ E-Market hỗ trợ bạn tìm thiết bị phù hợp với nhu cầu và ngân sách.</blockquote>
                <strong>Tư vấn E-Market</strong><span>Hỗ trợ sản phẩm</span>
            </section>
        `;

        nodes.newsletter.innerHTML = `
            <div><strong>Nhận tin khuyến mãi</strong><span>Cập nhật deal điện thoại, tablet và phụ kiện mới nhất.</span></div>
            <form id="newsletterForm">
                <label class="visually-hidden" for="newsletterEmail">Email của bạn</label>
                <input id="newsletterEmail" name="email" type="email" placeholder="Email của bạn" autocomplete="email" required>
                <button class="primary-button" type="submit">Đăng ký</button>
                <small class="newsletter-status" id="newsletterStatus" role="status" aria-live="polite">Bản demo lưu đăng ký trên trình duyệt này.</small>
            </form>
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
        state.view = view;
        document.querySelectorAll(".listing-view").forEach((section) => section.classList.toggle("hidden", view !== "listing"));
        nodes.productDetail.classList.toggle("hidden", view !== "detail");
        nodes.adminView.classList.toggle("hidden", view !== "admin");
        nodes.footer.classList.toggle("hidden", view === "admin");
        document.body.classList.toggle("admin-mode", view === "admin");
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
            <section class="product-reviews" aria-labelledby="productReviewsTitle">
                <div class="section-title"><span></span><h2 id="productReviewsTitle">Đánh giá sản phẩm</h2></div>
                <div id="reviewFormContainer"></div>
                <div class="review-list" id="reviewList" aria-live="polite"><p class="empty-state">Đang tải đánh giá…</p></div>
            </section>
        `;
        refreshIcons();
        state.reviewItems = [];
        state.editingReviewId = null;
        renderReviewForm();
        void loadProductReviews(product.id);
        nodes.productDetail.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function renderReviewForm() {
        const container = $("#reviewFormContainer");
        if (!container || !state.selectedProduct) return;
        if (!window.emarketApi.getToken()) {
            container.innerHTML = `<p class="review-login-prompt">Đăng nhập để gửi đánh giá. <button class="primary-button review-login-button" type="button" data-auth-open="login">Đăng nhập</button></p>`;
            return;
        }

        container.innerHTML = `
            <form class="review-form" id="createReviewForm">
                <label>Điểm đánh giá
                    <select name="rating" required>
                        <option value="5">5 sao</option><option value="4">4 sao</option>
                        <option value="3">3 sao</option><option value="2">2 sao</option><option value="1">1 sao</option>
                    </select>
                </label>
                <label>Nhận xét<textarea name="comment" rows="3" maxlength="2000" placeholder="Chia sẻ trải nghiệm của bạn"></textarea></label>
                <button class="primary-button" type="submit">Gửi đánh giá</button>
            </form>
        `;
    }

    function renderReviewList() {
        const list = $("#reviewList");
        if (!list) return;
        if (!state.reviewItems.length) {
            list.innerHTML = `<p class="empty-state">Sản phẩm chưa có đánh giá nào.</p>`;
            return;
        }

        const currentUser = window.emarketApi.getUserName();
        list.innerHTML = state.reviewItems.map((review) => {
            const isOwner = currentUser && currentUser === review.username;
            if (state.editingReviewId === review.id && isOwner) {
                return `
                    <article class="review-card">
                        <form class="review-edit-form" data-review-edit-form="${review.id}">
                            <label>Điểm đánh giá
                                <select name="rating" required>
                                    ${[5, 4, 3, 2, 1].map((rating) => `<option value="${rating}" ${Number(review.rating) === rating ? "selected" : ""}>${rating} sao</option>`).join("")}
                                </select>
                            </label>
                            <label>Nhận xét<textarea name="comment" rows="3" maxlength="2000">${escapeHtml(review.comment || "")}</textarea></label>
                            <div class="review-actions"><button class="primary-button" type="submit">Lưu</button><button class="ghost-button" type="button" data-cancel-review-edit>Hủy</button></div>
                        </form>
                    </article>
                `;
            }

            const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString("vi-VN") : "";
            return `
                <article class="review-card">
                    <div class="review-card-head"><strong>${escapeHtml(review.username || "Khách hàng")}</strong><span class="review-rating" aria-label="${Number(review.rating) || 0} trên 5 sao">${"★".repeat(Math.max(0, Math.min(5, Number(review.rating) || 0)))}${"☆".repeat(5 - Math.max(0, Math.min(5, Number(review.rating) || 0)))}</span></div>
                    ${date ? `<time>${escapeHtml(date)}</time>` : ""}
                    <p>${review.comment ? escapeHtml(review.comment) : "Không có nhận xét."}</p>
                    ${isOwner ? `<div class="review-actions"><button class="ghost-button" type="button" data-edit-review="${review.id}">Sửa</button><button class="ghost-button danger-text" type="button" data-delete-review="${review.id}">Xóa</button></div>` : ""}
                </article>
            `;
        }).join("");
    }

    async function loadProductReviews(productId) {
        const list = $("#reviewList");
        if (!list) return;
        list.innerHTML = `<p class="empty-state">Đang tải đánh giá…</p>`;
        try {
            const reviews = await window.emarketApi.getReviews(productId);
            if (state.selectedProduct?.id !== Number(productId)) return;
            state.reviewItems = reviews || [];
            renderReviewList();
        } catch (error) {
            if (state.selectedProduct?.id !== Number(productId)) return;
            list.innerHTML = `<p class="empty-state">Không thể tải đánh giá: ${escapeHtml(error.message)}</p>`;
        }
    }

    async function submitReviewForm(event, reviewId = null) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const payload = { rating: Number(formData.get("rating")), comment: String(formData.get("comment") || "").trim() };
        try {
            if (reviewId == null) {
                await window.emarketApi.createReview(state.selectedProduct.id, payload);
                showToast("Đã gửi đánh giá.");
            } else {
                await window.emarketApi.updateReview(reviewId, payload);
                state.editingReviewId = null;
                showToast("Đã cập nhật đánh giá.");
            }
            await loadProductReviews(state.selectedProduct.id);
        } catch (error) {
            showToast(`Không thể lưu đánh giá: ${error.message}`);
        }
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

    function adminHeading(title, description, addLabel, addType) {
        return '<div class="admin-section-heading"><div><h2>' + escapeHtml(title) + '</h2><p>' + escapeHtml(description) + '</p></div>'
            + (addLabel ? '<button class="primary-button" type="button" data-admin-add="' + escapeHtml(addType) + '">' + icon("plus", 17) + escapeHtml(addLabel) + '</button>' : "")
            + '</div>';
    }

    function renderAdminSummary() {
        const products = state.admin.products;
        const orders = state.admin.orders;
        const pendingOrders = orders.filter((order) => order.status === "PENDING").length;
        const lowStock = products.filter((product) => Number(product.stock) <= 5).length;
        const items = [
            { label: "Sản phẩm", value: products.length, icon: "package" },
            { label: "Tổng đơn hàng", value: orders.length, icon: "clipboard-list" },
            { label: "Chờ xác nhận", value: pendingOrders, icon: "clock-3" },
            { label: "Sắp hết hàng", value: lowStock, icon: "triangle-alert" }
        ];
        nodes.adminSummary.innerHTML = items.map((item) =>
            '<article class="admin-stat"><span class="admin-stat-icon">' + icon(item.icon, 19) + '</span><div><span>' + item.label
            + '</span><strong>' + item.value + '</strong></div></article>'
        ).join("");
        refreshIcons();
    }

    function renderAdminDashboard() {
        renderAdminSummary();
        nodes.adminTabs.querySelectorAll("[data-admin-tab]").forEach((button) => {
            const active = button.dataset.adminTab === state.adminTab;
            button.classList.toggle("active", active);
            button.setAttribute("aria-selected", String(active));
        });
        nodes.adminContent.innerHTML = state.admin.error
            ? '<div class="admin-message admin-error"><strong>Không tải được dữ liệu quản trị</strong><p>' + escapeHtml(state.admin.error)
                + '</p><button class="admin-inline-button" type="button" data-admin-retry>Thử lại</button></div>'
            : renderAdminTab();
        refreshIcons();
    }

    function renderAdminTab() {
        if (state.adminTab === "products") return renderAdminProducts();
        if (state.adminTab === "categories") return renderAdminCategories();
        if (state.adminTab === "brands") return renderAdminBrands();
        if (state.adminTab === "memberships") return renderAdminMemberships();
        return renderAdminOrders();
    }

    function renderAdminOrders() {
        const orders = [...state.admin.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return adminHeading("Đơn hàng", "Theo dõi thông tin nhận hàng và cập nhật trạng thái đơn.", "", "")
            + (orders.length ? '<div class="admin-order-list">' + orders.map((order) => {
                const allowed = order.status === "PENDING" ? ["PROCESSING", "CANCELLED"]
                    : order.status === "PROCESSING" ? ["COMPLETED", "CANCELLED"] : [];
                const statusControl = allowed.length
                    ? '<div class="admin-order-status"><label for="orderStatus' + order.id + '">Cập nhật trạng thái</label>'
                        + '<select id="orderStatus' + order.id + '" data-order-status="' + order.id + '">'
                        + allowed.map((status) => '<option value="' + status + '">' + escapeHtml(orderStatusLabel(status)) + '</option>').join("")
                        + '</select><button class="admin-inline-button" type="button" data-order-update="' + order.id + '">Lưu</button></div>'
                    : '<span class="admin-status-badge ' + String(order.status || "").toLowerCase() + '">' + escapeHtml(orderStatusLabel(order.status)) + '</span>';
                return '<article class="admin-order-card"><div class="admin-order-top"><div><span class="admin-order-number">Đơn #' + escapeHtml(order.id)
                    + '</span><h3>' + escapeHtml(order.customerName || "Khách hàng") + '</h3></div><span class="admin-status-badge '
                    + String(order.status || "").toLowerCase() + '">' + escapeHtml(orderStatusLabel(order.status)) + '</span></div>'
                    + '<div class="admin-order-meta"><span>' + escapeHtml(order.phone || "Chưa có số điện thoại") + '</span><span>'
                    + escapeHtml(orderDate(order.createdAt)) + '</span><span class="admin-order-address">' + escapeHtml(order.address || "Chưa có địa chỉ") + '</span></div>'
                    + '<div class="admin-order-items">' + ((order.items || []).map((item) =>
                        '<div><span>' + escapeHtml(item.product?.name || "Sản phẩm") + ' × ' + (Number(item.quantity) || 0)
                        + '</span><strong>' + formatMoney(Number(item.unitPrice || item.product?.price || 0) * Number(item.quantity || 0)) + '</strong></div>'
                    ).join("") || '<span>Đơn chưa có sản phẩm.</span>') + '</div>'
                    + '<div class="admin-order-bottom"><div><span>Tổng đơn hàng</span><strong>' + formatMoney(order.totalAmount) + '</strong></div>'
                    + statusControl + '</div></article>';
            }).join("") + '</div>' : '<div class="admin-message"><strong>Chưa có đơn hàng</strong><p>Đơn hàng mới sẽ xuất hiện ở đây.</p></div>');
    }

    function renderAdminProductForm() {
        const editing = state.adminEditing?.type === "product"
            ? state.admin.products.find((item) => item.id === state.adminEditing.id) : null;
        const categoryOptions = '<option value="">Chọn danh mục</option>' + state.admin.categories.map((category) =>
            '<option value="' + category.id + '"' + (editing?.category?.id === category.id ? " selected" : "") + '>' + escapeHtml(category.name) + '</option>'
        ).join("");
        const brandOptions = '<option value="">Chọn thương hiệu</option>' + state.admin.brands.map((brand) =>
            '<option value="' + brand.id + '"' + (editing?.brand?.id === brand.id ? " selected" : "") + '>' + escapeHtml(brand.name) + '</option>'
        ).join("");
        const locked = !state.admin.categories.length || !state.admin.brands.length;
        return '<form class="admin-form" id="adminProductForm"><div class="admin-form-title"><strong>'
            + (editing ? "Cập nhật sản phẩm" : "Thêm sản phẩm") + '</strong><button class="admin-text-button" type="button" data-admin-cancel>Đóng</button></div>'
            + (locked ? '<p class="admin-form-hint">Cần tạo ít nhất một danh mục và một thương hiệu trước khi thêm sản phẩm.</p>' : "")
            + '<div class="admin-form-grid"><label>Tên sản phẩm<input name="name" required maxlength="255" value="' + escapeHtml(editing?.name || "") + '"></label>'
            + '<label>Giá bán (₫)<input name="price" type="number" min="0.01" step="0.01" required value="' + escapeHtml(editing?.price ?? "") + '"></label>'
            + '<label>Tồn kho<input name="stock" type="number" min="0" step="1" required value="' + escapeHtml(editing?.stock ?? 0) + '"></label>'
            + '<label>Danh mục<select name="categoryId" required>' + categoryOptions + '</select></label>'
            + '<label>Thương hiệu<select name="brandId" required>' + brandOptions + '</select></label>'
            + '<label>Đường dẫn ảnh<input name="imageUrl" type="text" placeholder="https://... hoặc /frontend/assets/..." value="' + escapeHtml(editing?.imageUrl || "") + '"></label>'
            + '<label class="admin-form-wide">Mô tả<textarea name="description" rows="3">' + escapeHtml(editing?.description || "") + '</textarea></label></div>'
            + '<div class="admin-form-actions"><button class="primary-button" type="submit" ' + (locked ? "disabled" : "") + '>'
            + (editing ? "Lưu thay đổi" : "Tạo sản phẩm") + '</button><button class="admin-text-button" type="button" data-admin-cancel>Hủy</button></div></form>';
    }

    function renderAdminProducts() {
        const rows = state.admin.products.map((product) =>
            '<tr><td class="admin-id">#' + escapeHtml(product.id) + '</td><td><div class="admin-product-cell">'
            + (product.imageUrl ? '<img src="' + escapeHtml(product.imageUrl) + '" alt="" loading="lazy">' : '<span class="admin-product-placeholder">' + icon("package", 20) + '</span>')
            + '<div><strong>' + escapeHtml(product.name) + '</strong><small>' + escapeHtml(product.brand?.name || "Thương hiệu chưa chọn")
            + ' · ' + escapeHtml(product.category?.name || "Danh mục chưa chọn") + '</small></div></div></td><td>' + formatMoney(product.price)
            + '</td><td><span class="admin-stock ' + (Number(product.stock) <= 5 ? "low" : "") + '">' + Number(product.stock || 0) + '</span></td>'
            + '<td><div class="admin-row-actions"><button class="admin-text-button" type="button" data-admin-edit-type="product" data-admin-edit-id="' + product.id + '">Sửa</button>'
            + '<button class="admin-text-button danger" type="button" data-admin-delete-type="product" data-admin-delete-id="' + product.id + '">Xóa</button></div></td></tr>'
        ).join("");
        return adminHeading("Sản phẩm", "Cập nhật thông tin, giá bán và số lượng tồn kho.", "Thêm sản phẩm", "product")
            + (state.adminEditing?.type === "product" ? renderAdminProductForm() : "")
            + (rows ? '<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Mã</th><th>Sản phẩm</th><th>Giá</th><th>Tồn kho</th><th>Thao tác</th></tr></thead><tbody>' + rows + '</tbody></table></div>'
                : '<div class="admin-message"><strong>Chưa có sản phẩm</strong><p>Tạo sản phẩm đầu tiên để bắt đầu bán hàng.</p></div>');
    }

    function renderAdminCategoryForm() {
        const editing = state.adminEditing?.type === "category"
            ? state.admin.categories.find((item) => item.id === state.adminEditing.id) : null;
        return '<form class="admin-form admin-compact-form" id="adminCategoryForm"><div class="admin-form-title"><strong>'
            + (editing ? "Cập nhật danh mục" : "Thêm danh mục") + '</strong><button class="admin-text-button" type="button" data-admin-cancel>Đóng</button></div>'
            + '<div class="admin-form-grid"><label>Tên danh mục<input name="name" required maxlength="100" value="' + escapeHtml(editing?.name || "") + '"></label>'
            + '<label>Mô tả<input name="description" value="' + escapeHtml(editing?.description || "") + '"></label></div>'
            + '<div class="admin-form-actions"><button class="primary-button" type="submit">' + (editing ? "Lưu thay đổi" : "Tạo danh mục") + '</button>'
            + '<button class="admin-text-button" type="button" data-admin-cancel>Hủy</button></div></form>';
    }

    function renderAdminCategories() {
        const cards = state.admin.categories.map((category) =>
            '<article class="admin-entity-card"><div><span class="admin-id">DANH MỤC #' + escapeHtml(category.id) + '</span><h3>' + escapeHtml(category.name)
            + '</h3><p>' + escapeHtml(category.description || "Chưa có mô tả") + '</p></div><div class="admin-row-actions">'
            + '<button class="admin-text-button" type="button" data-admin-edit-type="category" data-admin-edit-id="' + category.id + '">Sửa</button>'
            + '<button class="admin-text-button danger" type="button" data-admin-delete-type="category" data-admin-delete-id="' + category.id + '">Xóa</button></div></article>'
        ).join("");
        return adminHeading("Danh mục", "Sắp xếp sản phẩm theo nhóm để khách dễ tìm.", "Thêm danh mục", "category")
            + (state.adminEditing?.type === "category" ? renderAdminCategoryForm() : "")
            + (cards ? '<div class="admin-entity-list">' + cards + '</div>' : '<div class="admin-message"><strong>Chưa có danh mục</strong><p>Thêm danh mục trước khi tạo sản phẩm.</p></div>');
    }

    function renderAdminBrandForm() {
        const editing = state.adminEditing?.type === "brand"
            ? state.admin.brands.find((item) => item.id === state.adminEditing.id) : null;
        return '<form class="admin-form admin-compact-form" id="adminBrandForm"><div class="admin-form-title"><strong>'
            + (editing ? "Cập nhật thương hiệu" : "Thêm thương hiệu") + '</strong><button class="admin-text-button" type="button" data-admin-cancel>Đóng</button></div>'
            + '<div class="admin-form-grid"><label>Tên thương hiệu<input name="name" required maxlength="100" value="' + escapeHtml(editing?.name || "") + '"></label>'
            + '<label>Quốc gia<input name="country" required maxlength="100" value="' + escapeHtml(editing?.country || "") + '"></label>'
            + '<label class="admin-form-wide">Logo (đường dẫn ảnh)<input name="logo" required maxlength="255" value="' + escapeHtml(editing?.logo || "") + '"></label></div>'
            + '<div class="admin-form-actions"><button class="primary-button" type="submit">' + (editing ? "Lưu thay đổi" : "Tạo thương hiệu") + '</button>'
            + '<button class="admin-text-button" type="button" data-admin-cancel>Hủy</button></div></form>';
    }

    function renderAdminBrands() {
        const cards = state.admin.brands.map((brand) =>
            '<article class="admin-entity-card"><div class="admin-brand-card-main">' + (brand.logo
                ? '<img class="admin-brand-logo" src="' + escapeHtml(brand.logo) + '" alt="" loading="lazy">'
                : '<span class="admin-brand-logo admin-brand-placeholder">' + icon("badge-check", 20) + '</span>')
            + '<div><span class="admin-id">THƯƠNG HIỆU #' + escapeHtml(brand.id) + '</span><h3>' + escapeHtml(brand.name)
            + '</h3><p>' + escapeHtml(brand.country || "Chưa cập nhật quốc gia") + '</p></div></div><div class="admin-row-actions">'
            + '<button class="admin-text-button" type="button" data-admin-edit-type="brand" data-admin-edit-id="' + brand.id + '">Sửa</button>'
            + '<button class="admin-text-button danger" type="button" data-admin-delete-type="brand" data-admin-delete-id="' + brand.id + '">Xóa</button></div></article>'
        ).join("");
        return adminHeading("Thương hiệu", "Quản lý nhãn hàng hiển thị trong danh mục sản phẩm.", "Thêm thương hiệu", "brand")
            + (state.adminEditing?.type === "brand" ? renderAdminBrandForm() : "")
            + (cards ? '<div class="admin-entity-list">' + cards + '</div>' : '<div class="admin-message"><strong>Chưa có thương hiệu</strong><p>Thêm thương hiệu trước khi tạo sản phẩm.</p></div>');
    }

    function renderAdminMembershipForm() {
        return '<form class="admin-form admin-compact-form" id="adminMembershipForm"><div class="admin-form-title"><strong>Tạo hạng thành viên</strong></div>'
            + '<div class="admin-form-grid"><label>Tên hạng<input name="name" required maxlength="100" placeholder="Ví dụ: Silver"></label>'
            + '<label>Điểm yêu cầu<input name="requiredPoints" type="number" min="0" step="1" required value="0"></label>'
            + '<label>Ưu đãi (%)<input name="discountPercent" type="number" min="0" max="100" step="1" required value="0"></label></div>'
            + '<div class="admin-form-actions"><button class="primary-button" type="submit">Tạo hạng</button></div></form>';
    }

    function renderAdminMemberships() {
        const cards = state.admin.memberships.map((membership) =>
            '<article class="admin-membership-card"><span class="admin-membership-icon">' + icon("award", 22) + '</span><div><span class="admin-id">HẠNG #' + escapeHtml(membership.id)
            + '</span><h3>' + escapeHtml(membership.name) + '</h3><p>' + Number(membership.requiredPoints || 0) + ' điểm để đạt hạng này</p></div>'
            + '<strong>' + Number(membership.discountPercent || 0) + '%<small> ưu đãi</small></strong></article>'
        ).join("");
        return adminHeading("Hạng thành viên", "Thiết lập mức điểm và phần trăm ưu đãi cho từng hạng.", "", "")
            + renderAdminMembershipForm()
            + (cards ? '<div class="admin-membership-list">' + cards + '</div>' : '<div class="admin-message"><strong>Chưa có hạng thành viên</strong><p>Các hạng đã tạo sẽ xuất hiện ở đây.</p></div>');
    }

    async function loadAdminData() {
        state.admin.error = "";
        nodes.adminContent.innerHTML = '<div class="admin-message"><span class="admin-spinner"></span><p>Đang tải dữ liệu quản trị…</p></div>';
        try {
            const [orders, products, categories, brands, memberships] = await Promise.all([
                window.emarketApi.getAllOrders(),
                window.emarketApi.getProducts(),
                window.emarketApi.getCategories(),
                window.emarketApi.getBrands(),
                window.emarketApi.getMemberships()
            ]);
            state.admin.orders = orders;
            state.admin.products = products;
            state.admin.categories = categories;
            state.admin.brands = brands;
            state.admin.memberships = memberships;
        } catch (error) {
            state.admin.error = error.message || "Vui lòng kiểm tra kết nối hoặc quyền quản trị.";
        }
        renderAdminDashboard();
    }

    function openAdmin() {
        if (!window.emarketApi.getToken()) {
            showToast("Đăng nhập tài khoản quản trị để tiếp tục.");
            openAuth("login");
            return;
        }
        if (window.emarketApi.getRole() !== "ADMIN") {
            showToast("Tài khoản hiện tại không có quyền quản trị.");
            return;
        }
        state.adminTab = "orders";
        state.adminEditing = null;
        setView("admin");
        void loadAdminData();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function submitAdminForm(event) {
        const form = event.target;
        if (!form.id.startsWith("admin")) return;
        event.preventDefault();
        const values = Object.fromEntries(new FormData(form).entries());
        try {
            if (form.id === "adminProductForm") {
                const payload = {
                    name: values.name.trim(),
                    description: values.description.trim(),
                    price: Number(values.price),
                    stock: Number(values.stock),
                    imageUrl: values.imageUrl.trim(),
                    categoryId: Number(values.categoryId),
                    brandId: Number(values.brandId)
                };
                if (state.adminEditing?.type === "product" && state.adminEditing.id != null) {
                    await window.emarketApi.updateProduct(state.adminEditing.id, payload);
                    showToast("Đã cập nhật sản phẩm.");
                } else {
                    await window.emarketApi.createProduct(payload);
                    showToast("Đã tạo sản phẩm.");
                }
            } else if (form.id === "adminCategoryForm") {
                const payload = { name: values.name.trim(), description: values.description.trim() };
                if (state.adminEditing?.type === "category" && state.adminEditing.id != null) {
                    await window.emarketApi.updateCategory(state.adminEditing.id, payload);
                    showToast("Đã cập nhật danh mục.");
                } else {
                    await window.emarketApi.createCategory(payload);
                    showToast("Đã tạo danh mục.");
                }
            } else if (form.id === "adminBrandForm") {
                const payload = { name: values.name.trim(), country: values.country.trim(), logo: values.logo.trim() };
                if (state.adminEditing?.type === "brand" && state.adminEditing.id != null) {
                    await window.emarketApi.updateBrand(state.adminEditing.id, payload);
                    showToast("Đã cập nhật thương hiệu.");
                } else {
                    await window.emarketApi.createBrand(payload);
                    showToast("Đã tạo thương hiệu.");
                }
            } else if (form.id === "adminMembershipForm") {
                await window.emarketApi.createMembership({
                    name: values.name.trim(),
                    requiredPoints: Number(values.requiredPoints),
                    discountPercent: Number(values.discountPercent)
                });
                showToast("Đã tạo hạng thành viên.");
            }
            state.adminEditing = null;
            await loadAdminData();
            if (form.id === "adminProductForm" || form.id === "adminCategoryForm" || form.id === "adminBrandForm") await loadProducts();
        } catch (error) {
            showToast("Không thể lưu: " + error.message);
        }
    }

    async function deleteAdminItem(type, id) {
        const item = type === "product" ? state.admin.products.find((entry) => entry.id === id)
            : type === "category" ? state.admin.categories.find((entry) => entry.id === id)
                : state.admin.brands.find((entry) => entry.id === id);
        const label = item?.name || ("#" + id);
        if (!window.confirm("Xóa " + label + "? Hành động này có thể bị từ chối nếu dữ liệu đang được tham chiếu.")) return;
        try {
            if (type === "product") await window.emarketApi.deleteProduct(id);
            if (type === "category") await window.emarketApi.deleteCategory(id);
            if (type === "brand") await window.emarketApi.deleteBrand(id);
            showToast("Đã xóa " + label + ".");
            await loadAdminData();
            await loadProducts();
        } catch (error) {
            showToast("Không thể xóa: " + error.message);
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
        const isAdmin = signedIn && window.emarketApi.getRole() === "ADMIN";
        nodes.accountLabel.textContent = signedIn ? "Tài khoản" : "Thông tin";
        nodes.accountButton.setAttribute("aria-label", signedIn ? "Tài khoản đã đăng nhập" : "Đăng nhập hoặc đăng ký");
        document.querySelectorAll("[data-auth-open]").forEach((button) => button.classList.toggle("hidden", signedIn));
        nodes.myOrdersButton.classList.toggle("hidden", !signedIn);
        nodes.adminButton.classList.toggle("hidden", !isAdmin);
        nodes.logoutButton.classList.toggle("hidden", !signedIn);
        if (!isAdmin && state.view === "admin") setView("listing");
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
            renderReviewForm();
            renderReviewList();
        } catch (error) {
            showToast(`${type === "login" ? "Đăng nhập" : "Đăng ký"} thất bại: ${error.message}`);
        }
    }

    function runSearch(value) {
        state.query = value.trim();
        state.productsPage = 0;
        nodes.searchInput.value = state.query;
        setView("listing");
        renderProducts();
        $("#products").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function bindEvents() {
        document.addEventListener("click", (event) => {
            const filter = event.target.closest("[data-filter]");
            const pageButton = event.target.closest("[data-products-page]");
            const detail = event.target.closest("[data-detail]");
            const add = event.target.closest("[data-add]");
            const search = event.target.closest("[data-menu-search]");
            const category = event.target.closest("[data-category]");
            const authOpen = event.target.closest("[data-auth-open]");
            const buyNow = event.target.closest("[data-buy-now]");

            if (filter) {
                state.filter = filter.dataset.filter;
                state.productsPage = 0;
                document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab === filter));
                renderProducts();
            }
            if (pageButton && !pageButton.disabled) {
                state.productsPage = Number(pageButton.dataset.productsPage);
                renderProducts();
                $("#products").scrollIntoView({ behavior: "smooth", block: "start" });
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
            const editReview = event.target.closest("[data-edit-review]");
            const deleteReview = event.target.closest("[data-delete-review]");
            if (event.target.closest("#backToProducts")) {
                setView("listing");
                $("#products").scrollIntoView({ behavior: "smooth", block: "start" });
            }
            if (qty) {
                state.quantity = Math.min(state.selectedProduct.stock, Math.max(1, state.quantity + Number(qty.dataset.qty)));
                $("#detailQuantity").value = state.quantity;
            }
            if (editReview) {
                state.editingReviewId = Number(editReview.dataset.editReview);
                renderReviewList();
            }
            if (event.target.closest("[data-cancel-review-edit]")) {
                state.editingReviewId = null;
                renderReviewList();
            }
            if (deleteReview && window.confirm("Bạn có chắc muốn xóa đánh giá này?")) {
                void (async () => {
                    try {
                        await window.emarketApi.deleteReview(deleteReview.dataset.deleteReview);
                        showToast("Đã xóa đánh giá.");
                        await loadProductReviews(state.selectedProduct.id);
                    } catch (error) {
                        showToast(`Không thể xóa đánh giá: ${error.message}`);
                    }
                })();
            }
        });

        nodes.productDetail.addEventListener("submit", (event) => {
            if (event.target.matches("#createReviewForm")) {
                void submitReviewForm(event);
                return;
            }
            const editForm = event.target.closest("[data-review-edit-form]");
            if (editForm) void submitReviewForm(event, Number(editForm.dataset.reviewEditForm));
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
        nodes.newsletter.addEventListener("submit", (event) => {
            if (!event.target.matches("#newsletterForm")) return;
            event.preventDefault();

            const email = new FormData(event.target).get("email").trim().toLowerCase();
            const status = $("#newsletterStatus");
            try {
                const storedValue = JSON.parse(localStorage.getItem(newsletterStorageKey) || "[]");
                const savedEmails = Array.isArray(storedValue) ? storedValue : [];
                if (savedEmails.includes(email)) {
                    status.textContent = "Email này đã được ghi nhận trên trình duyệt này.";
                    return;
                }
                savedEmails.push(email);
                localStorage.setItem(newsletterStorageKey, JSON.stringify(savedEmails));
                status.textContent = "Đã lưu trên trình duyệt này; chưa gửi tới máy chủ.";
                event.target.reset();
            } catch (error) {
                status.textContent = "Trình duyệt không cho phép lưu đăng ký trên thiết bị này.";
            }
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
            renderReviewForm();
            renderReviewList();
            showToast("Bạn đã đăng xuất.");
        });
        nodes.closeOrders.addEventListener("click", closeOrders);
        nodes.ordersBackdrop.addEventListener("click", closeOrders);
        nodes.catalogToggle.addEventListener("click", () => nodes.catalogPanel.classList.add("open"));
        nodes.closeCatalog.addEventListener("click", () => nodes.catalogPanel.classList.remove("open"));
        nodes.scrollTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
        nodes.storeButton.addEventListener("click", openStores);
        nodes.orderLookupButton.addEventListener("click", showMyOrders);
        nodes.notifyButton.addEventListener("click", openNotifications);
        nodes.closeUtilityModal.addEventListener("click", closeUtilityModal);
        nodes.utilityBackdrop.addEventListener("click", closeUtilityModal);
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !nodes.utilityModal.classList.contains("hidden")) closeUtilityModal();
        });
        nodes.contactButton.addEventListener("click", () => window.location.assign("tel:19006750"));
        nodes.adminButton.addEventListener("click", openAdmin);
        nodes.backToStore.addEventListener("click", () => {
            setView("listing");
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        nodes.adminRefresh.addEventListener("click", () => void loadAdminData());
        nodes.adminTabs.addEventListener("click", (event) => {
            const tab = event.target.closest("[data-admin-tab]");
            if (!tab) return;
            state.adminTab = tab.dataset.adminTab;
            state.adminEditing = null;
            renderAdminDashboard();
        });
        nodes.adminContent.addEventListener("click", async (event) => {
            if (event.target.closest("[data-admin-retry]")) {
                await loadAdminData();
                return;
            }
            if (event.target.closest("[data-admin-cancel]")) {
                state.adminEditing = null;
                renderAdminDashboard();
                return;
            }
            const addButton = event.target.closest("[data-admin-add]");
            if (addButton) {
                state.adminEditing = { type: addButton.dataset.adminAdd, id: null };
                renderAdminDashboard();
                return;
            }
            const editButton = event.target.closest("[data-admin-edit-type]");
            if (editButton) {
                state.adminEditing = {
                    type: editButton.dataset.adminEditType,
                    id: Number(editButton.dataset.adminEditId)
                };
                renderAdminDashboard();
                return;
            }
            const deleteButton = event.target.closest("[data-admin-delete-type]");
            if (deleteButton) {
                await deleteAdminItem(deleteButton.dataset.adminDeleteType, Number(deleteButton.dataset.adminDeleteId));
                return;
            }
            const updateOrderButton = event.target.closest("[data-order-update]");
            if (updateOrderButton) {
                const orderId = Number(updateOrderButton.dataset.orderUpdate);
                const select = nodes.adminContent.querySelector('[data-order-status="' + orderId + '"]');
                if (!select?.value) return;
                updateOrderButton.disabled = true;
                try {
                    await window.emarketApi.updateOrderStatus(orderId, select.value);
                    showToast("Đã cập nhật trạng thái đơn hàng.");
                    await loadAdminData();
                } catch (error) {
                    showToast("Không thể cập nhật đơn hàng: " + error.message);
                    updateOrderButton.disabled = false;
                }
            }
        });
        nodes.adminContent.addEventListener("submit", (event) => {
            void submitAdminForm(event);
        });
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
