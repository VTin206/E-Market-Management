(function () {
    const guestCartKey = "emarket_guest_cart";
    const state = {
        products: [],
        categories: [],
        brands: [],
        productsPage: 0,
        cart: [],
        filter: "all",
        categoryFilter: "",
        brandFilter: "",
        priceFilter: "all",
        sortFilter: "default",
        query: "",
        selectedProduct: null,
        reviewItems: [],
        editingReviewId: null,
        quantity: 1,
        submittingOrder: false,
        view: "listing",
        profile: null,
        profileSaving: false,
        changePasswordSaving: false,
        adminTab: "orders",
        adminEditing: null,
        admin: {
            products: [],
            orders: [],
            ordersPage: 0,
            ordersPageInfo: null,
            categories: [],
            brands: [],
            memberships: [],
            users: null,
            usersPage: 0,
            error: ""
        }
    };

    const $ = (selector) => document.querySelector(selector);
    const nodes = {
        categories: $("#categories"),
        products: $("#products"),
        deals: $("#deals"),
        categorySections: $("#categorySections"),
        productDetail: $("#productDetail"),
        searchForm: $("#searchForm"),
        searchInput: $("#searchInput"),
        searchClearButton: $("#searchClearButton"),
        productTotalCount: $("#productTotalCount"),
        productTabs: $("#productTabs"),
        filterCategory: $("#filterCategory"),
        filterBrand: $("#filterBrand"),
        filterPrice: $("#filterPrice"),
        filterSort: $("#filterSort"),
        resetFilterBtn: $("#resetFilterBtn"),
        activeFilterChips: $("#activeFilterChips"),
        dataStatus: $("#dataStatus"),
        productGrid: $("#productGrid"),
        productPagination: $("#productPagination"),
        cartButton: $("#cartButton"),
        cartDrawer: $("#cartDrawer"),
        cartBackdrop: $("#cartBackdrop"),
        closeCart: $("#closeCart"),
        cartItems: $("#cartItems"),
        cartSubtotal: $("#cartSubtotal"),
        cartTotal: $("#cartTotal"),
        cartTitle: $("#cartTitle"),
        cartCount: $("#cartCount"),
        headerCartTotal: $("#headerCartTotal"),
        checkoutButton: $("#checkoutButton"),
        checkoutModal: $("#checkoutModal"),
        checkoutBackdrop: $("#checkoutBackdrop"),
        closeCheckout: $("#closeCheckout"),
        checkoutForm: $("#checkoutForm"),
        checkoutTotal: $("#checkoutTotal"),
        placeOrderButton: $("#placeOrderButton"),
        accountButton: $("#accountButton"),
        accountLabel: $("#accountLabel"),
        accountSubLabel: $("#accountSubLabel"),
        accountAvatarWrap: $("#accountAvatarWrap"),
        dropdownUserHeader: $("#dropdownUserHeader"),
        dropdownUserName: $("#dropdownUserName"),
        dropdownUserRole: $("#dropdownUserRole"),
        myProfileButton: $("#myProfileButton"),
        profileView: $("#profileView"),
        profileLoadState: $("#profileLoadState"),
        profileLoadMessage: $("#profileLoadMessage"),
        profileRetryButton: $("#profileRetryButton"),
        profileContent: $("#profileContent"),
        profileTitle: $("#profileTitle"),
        profileAvatar: $("#profileAvatar"),
        profileUserName: $("#profileUserName"),
        profileRole: $("#profileRole"),
        profilePoints: $("#profilePoints"),
        profileMembership: $("#profileMembership"),
        profileMembershipDetails: $("#profileMembershipDetails"),
        profileForm: $("#profileForm"),
        profileFullNameInput: $("#profileFullNameInput"),
        profileUserNameInput: $("#profileUserNameInput"),
        profileEmailInput: $("#profileEmailInput"),
        profilePhoneInput: $("#profilePhoneInput"),
        profileFeedback: $("#profileFeedback"),
        profileSaveButton: $("#profileSaveButton"),
        profileResetButton: $("#profileResetButton"),
        changePasswordForm: $("#changePasswordForm"),
        currentPasswordInput: $("#currentPasswordInput"),
        newPasswordInput: $("#newPasswordInput"),
        confirmPasswordInput: $("#confirmPasswordInput"),
        changePasswordFeedback: $("#changePasswordFeedback"),
        changePasswordSubmitButton: $("#changePasswordSubmitButton"),
        profileBackButton: $("#profileBackButton"),
        profileOrdersPreview: $("#profileOrdersPreview"),
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
        ordersTitle: $("#ordersTitle"),
        orderLookupPanel: $("#orderLookupPanel"),
        orderTrackingForm: $("#orderTrackingForm"),
        orderTrackingCode: $("#orderTrackingCode"),
        trackOrderButton: $("#trackOrderButton"),
        orderLookupResult: $("#orderLookupResult"),
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
        homeNavLink: $("#homeNavLink"),
        catalogNavLink: $("#catalogNavLink"),
        megaMenu: $("#megaMenu"),
        navQuickCategories: $("#navQuickCategories"),
        toast: $("#toast"),
        scrollTopButton: $("#scrollTopButton"),
        hero: $(".hero"),
        heroCopy: $(".hero-copy"),
        heroTitleMain: $("[data-hero-title-main]"),
        heroTitleAccent: $("[data-hero-title-accent]"),
        heroBadge: $("[data-hero-badge]"),
        heroDescription: $("[data-hero-description]"),
        heroCta: $("[data-hero-cta]"),
        heroCtaLabel: $("[data-hero-cta-label]"),
        heroCardBadge: $("[data-hero-card-badge]"),
        heroProductImage: $("[data-hero-product-image]"),
        heroProductName: $("[data-hero-product-name]"),
        heroProductMeta: $("[data-hero-product-meta]"),
        heroProductPrice: $("[data-hero-product-price]"),
        heroAnnouncement: $("[data-hero-announcement]"),
        heroPrevious: $("[data-hero-previous]"),
        heroNext: $("[data-hero-next]"),
        heroLoginButton: $("#heroLoginButton"),
        orderLookupButton: $("#orderLookupButton"),
        mobNavHome: $("#mobNavHome"),
        mobNavCatalog: $("#mobNavCatalog"),
        mobNavSearch: $("#mobNavSearch"),
        mobNavCart: $("#mobNavCart"),
        mobNavAccount: $("#mobNavAccount"),
        mobCartCount: $("#mobCartCount")
    };

    const heroSlides = [
        {
            badge: "100% SẢN PHẨM CHÍNH HÃNG",
            title: "Công Nghệ Đỉnh Cao",
            accent: "Nâng Tầm Trải Nghiệm",
            description: "Khám phá thế giới điện thoại và thiết bị công nghệ chính hãng mới nhất. Đặt mua nhanh chóng, giá tốt mỗi ngày, bảo hành 12 tháng và hỗ trợ trả góp 0% lãi suất.",
            cta: "Khám phá sản phẩm",
            ctaHref: "#products",
            ctaIcon: "shopping-cart",
            cardBadge: "SẢN PHẨM HOT",
            productName: "iPhone 15 Pro Max",
            productMeta: "Titan Tự Nhiên · Chip A17 Pro",
            productPrice: "Từ 29.990.000đ",
            imageAlt: "iPhone 15 Pro Max"
        },
        {
            badge: "ƯU ĐÃI CÔNG NGHỆ MỖI NGÀY",
            title: "Săn Deal Công Nghệ",
            accent: "Giá Tốt Mỗi Ngày",
            description: "Khám phá các chương trình khuyến mãi đang diễn ra, chọn sản phẩm yêu thích và đặt hàng nhanh chóng ngay hôm nay.",
            cta: "Xem khuyến mãi",
            ctaHref: "#deals",
            ctaIcon: "flame",
            cardBadge: "FLASH SALE",
            productName: "Ưu đãi công nghệ",
            productMeta: "Nhiều sản phẩm chính hãng đang chờ bạn",
            productPrice: "Xem ưu đãi hôm nay",
            imageAlt: "Sản phẩm công nghệ nổi bật"
        }
    ];
    let activeHeroSlide = 0;

    function icon(name, size = 18) {
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

    function showHeroSlide(index) {
        if (!nodes.hero || !nodes.heroBadge || !nodes.heroTitleMain || !nodes.heroTitleAccent || !nodes.heroDescription
            || !nodes.heroCta || !nodes.heroCtaLabel || !nodes.heroCardBadge || !nodes.heroProductImage
            || !nodes.heroProductName || !nodes.heroProductMeta || !nodes.heroProductPrice || !nodes.heroAnnouncement || !heroSlides.length) return;
        activeHeroSlide = (index + heroSlides.length) % heroSlides.length;
        const slide = heroSlides[activeHeroSlide];

        nodes.heroBadge.textContent = slide.badge;
        nodes.heroTitleMain.textContent = slide.title;
        nodes.heroTitleAccent.textContent = slide.accent;
        nodes.heroDescription.textContent = slide.description;
        nodes.heroCta.href = slide.ctaHref;
        nodes.heroCtaLabel.textContent = slide.cta;
        nodes.heroCardBadge.textContent = slide.cardBadge;
        nodes.heroProductImage.alt = slide.imageAlt;
        nodes.heroProductName.textContent = slide.productName;
        nodes.heroProductMeta.textContent = slide.productMeta;
        nodes.heroProductPrice.textContent = slide.productPrice;
        nodes.heroAnnouncement.textContent = `Banner ${activeHeroSlide + 1} trên ${heroSlides.length}: ${slide.title} ${slide.accent}`;

        document.querySelectorAll("[data-hero-slide]").forEach((button, buttonIndex) => {
            const isActive = buttonIndex === activeHeroSlide;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        if (nodes.heroCopy) {
            nodes.heroCopy.classList.remove("is-changing");
            void nodes.heroCopy.offsetWidth;
            nodes.heroCopy.classList.add("is-changing");
        }
    }

    function initHeroCarousel() {
        if (!nodes.hero || !nodes.heroPrevious || !nodes.heroNext || heroSlides.length < 2) return;
        let pointerPaused = false;
        let focusPaused = false;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const pauseWhenInteracting = () => pointerPaused || focusPaused;

        nodes.heroPrevious.addEventListener("click", () => showHeroSlide(activeHeroSlide - 1));
        nodes.heroNext.addEventListener("click", () => showHeroSlide(activeHeroSlide + 1));
        document.querySelectorAll("[data-hero-slide]").forEach((button) => {
            button.addEventListener("click", () => showHeroSlide(Number(button.dataset.heroSlide)));
        });
        nodes.hero.addEventListener("pointerenter", () => { pointerPaused = true; });
        nodes.hero.addEventListener("pointerleave", () => { pointerPaused = false; });
        nodes.hero.addEventListener("focusin", () => { focusPaused = true; });
        nodes.hero.addEventListener("focusout", (event) => {
            if (!nodes.hero.contains(event.relatedTarget)) focusPaused = false;
        });

        if (!reducedMotion) {
            window.setInterval(() => {
                if (!pauseWhenInteracting()) showHeroSlide(activeHeroSlide + 1);
            }, 6000);
        }
    }

    function formatMoney(value) {
        if (value === null || value === undefined || value === "") return "Liên hệ";
        return new Intl.NumberFormat("vi-VN").format(value) + "đ";
    }

    function showToast(message, type = "info") {
        if (!nodes.toast) return;
        const iconName = type === "success" ? "check-circle-2" : type === "error" ? "alert-circle" : "info";
        nodes.toast.innerHTML = `<div class="toast-inner">${icon(iconName, 20)}<span>${escapeHtml(message)}</span></div>`;
        nodes.toast.className = `toast toast-${type}`;
        nodes.toast.classList.remove("hidden");
        window.clearTimeout(showToast.timer);
        showToast.timer = window.setTimeout(() => {
            nodes.toast.classList.add("hidden");
        }, 3200);
        refreshIcons();
    }

    function productVisual(product, compact = false) {
        const label = escapeHtml(product.name || "Sản phẩm công nghệ");
        if (product.imageUrl) {
            return `
                <div class="product-photo ${compact ? "compact" : ""}">
                    <img class="product-image" src="${escapeHtml(product.imageUrl)}" alt="${label}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'product-image-placeholder ${compact ? "compact" : ""}\\'>${icon("image", compact ? 22 : 32)}<span>Chưa có hình ảnh</span></div>';refreshIcons();">
                </div>
            `;
        }
        return `
            <div class="product-image-placeholder ${compact ? "compact" : ""}" role="img" aria-label="Chưa có hình ảnh cho ${label}">
                ${icon("image", compact ? 22 : 34)}
                <span>Chưa có hình ảnh</span>
            </div>
        `;
    }

    function productCard(product, compact = false) {
        const disabled = product.stock <= 0;
        const isLowStock = !disabled && product.stock <= 5;
        const brandName = product.brand?.name ? escapeHtml(product.brand.name) : "";
        const catName = product.category?.name ? escapeHtml(product.category.name) : "";
        const tagText = brandName || catName || "Chính hãng VN/A";

        return `
            <article class="product-card ${disabled ? "is-out" : ""}" data-card-id="${product.id}">
                <div class="card-badge-row">
                    <span class="card-tag brand-tag">${tagText}</span>
                    ${disabled ? `<span class="card-tag out-tag">Hết hàng</span>` : isLowStock ? `<span class="card-tag low-tag">Chỉ còn ${product.stock}</span>` : `<span class="card-tag hot-tag"><i data-lucide="sparkles"></i> Mới</span>`}
                </div>
                <button class="product-media" type="button" data-detail="${product.id}" aria-label="Xem chi tiết ${escapeHtml(product.name)}">
                    ${productVisual(product, compact)}
                </button>
                <div class="card-body">
                    <button class="product-name" type="button" data-detail="${product.id}" title="${escapeHtml(product.name)}">
                        ${escapeHtml(product.name)}
                    </button>
                    <div class="product-card-rating">
                        <span class="stars">${"★".repeat(5)}</span>
                        <span class="rating-val">5.0</span>
                        <span class="rating-count">(Đánh giá)</span>
                    </div>
                    <div class="price-line">
                        <strong class="price">${formatMoney(product.price)}</strong>
                        ${product.price > 10000000 ? `<span class="installment-tag">Trả góp 0%</span>` : ""}
                    </div>
                </div>
                <div class="card-actions">
                    <button class="add-button" type="button" data-add="${product.id}" ${disabled ? "disabled" : ""} aria-label="Thêm vào giỏ">
                        <i data-lucide="${disabled ? "ban" : "shopping-bag"}"></i>
                        <span>${disabled ? "Hết hàng" : "Thêm giỏ"}</span>
                    </button>
                    <button class="quick-view-button" type="button" data-detail="${product.id}" aria-label="Xem chi tiết">
                        <i data-lucide="eye"></i>
                    </button>
                </div>
            </article>
        `;
    }

    function renderCategories() {
        if (!nodes.categories) return;
        const categories = state.categories || [];
        nodes.categories.innerHTML = `
            <div class="section-title">
                <span></span>
                <h2>Danh Mục Nổi Bật</h2>
                <a href="#products" class="view-all-link" data-open-catalog>Xem tất cả sản phẩm <i data-lucide="arrow-right"></i></a>
            </div>
            ${categories.length ? `
                <div class="category-grid">
                    ${categories.map((category) => {
                        const count = state.products.filter((product) => product.category?.id === category.id).length;
                        return `
                            <article class="category-card" data-category-filter="${escapeHtml(category.name)}">
                                <div class="category-icon">${icon("smartphone", 26)}</div>
                                <div class="category-info">
                                    <strong>${escapeHtml(category.name)}</strong>
                                    <span>${count} sản phẩm</span>
                                </div>
                                <i data-lucide="chevron-right" class="category-chevron"></i>
                            </article>
                        `;
                    }).join("")}
                </div>
            ` : `<p class="empty-state">Chưa có danh mục nào được khởi tạo.</p>`}
        `;
        refreshIcons();
    }

    function renderCategoryMenus() {
        const categories = state.categories || [];
        if (nodes.megaMenu) {
            nodes.megaMenu.innerHTML = categories.length
                ? categories.map((category) => `
                    <div class="mega-menu-group">
                        <strong>${escapeHtml(category.name)}</strong>
                        <button type="button" data-category-filter="${escapeHtml(category.name)}">
                            <i data-lucide="arrow-right"></i> Xem tất cả
                        </button>
                    </div>
                `).join("")
                : `<p class="empty-state">Chưa có danh mục.</p>`;
        }

        if (nodes.catalogList) {
            nodes.catalogList.innerHTML = categories.length
                ? categories.map((category) => {
                    const count = state.products.filter((product) => product.category?.id === category.id).length;
                    return `
                        <button class="catalog-item" type="button" data-category-filter="${escapeHtml(category.name)}">
                            <div class="catalog-item-left">
                                <i data-lucide="tag"></i>
                                <span>${escapeHtml(category.name)}</span>
                            </div>
                            <span class="catalog-item-count">${count}</span>
                        </button>
                    `;
                }).join("")
                : `<p class="empty-state">Chưa có danh mục.</p>`;
        }

        if (nodes.navQuickCategories) {
            nodes.navQuickCategories.innerHTML = categories.slice(0, 5).map((category) => `
                <button type="button" class="quick-cat-pill" data-category-filter="${escapeHtml(category.name)}">
                    ${escapeHtml(category.name)}
                </button>
            `).join("");
        }

        if (nodes.filterCategory) {
            const currentVal = nodes.filterCategory.value;
            nodes.filterCategory.innerHTML = `<option value="">Tất cả danh mục (${categories.length})</option>`
                + categories.map((cat) => `<option value="${escapeHtml(cat.name)}" ${currentVal === cat.name ? "selected" : ""}>${escapeHtml(cat.name)}</option>`).join("");
        }

        refreshIcons();
    }

    function renderBrandFilters() {
        if (!nodes.filterBrand) return;
        const brands = state.brands || [];
        const currentVal = nodes.filterBrand.value;
        nodes.filterBrand.innerHTML = `<option value="">Tất cả thương hiệu (${brands.length})</option>`
            + brands.map((b) => `<option value="${escapeHtml(b.name)}" ${currentVal === b.name ? "selected" : ""}>${escapeHtml(b.name)}</option>`).join("");
    }

    function filteredProducts() {
        return state.products.filter((product) => {
            // Stock flag filter
            const matchesFlag = state.filter === "all"
                || (state.filter === "in-stock" && product.stock > 0)
                || (state.filter === "out-of-stock" && product.stock <= 0);

            // Search query filter
            const prodText = `${product.name} ${product.category?.name || ""} ${product.brand?.name || ""}`.toLowerCase();
            const matchesQuery = !state.query || prodText.includes(state.query.toLowerCase());

            // Category select filter
            const matchesCategory = !state.categoryFilter
                || (product.category?.name && product.category.name.toLowerCase() === state.categoryFilter.toLowerCase());

            // Brand select filter
            const matchesBrand = !state.brandFilter
                || (product.brand?.name && product.brand.name.toLowerCase() === state.brandFilter.toLowerCase());

            // Price range filter
            let matchesPrice = true;
            const price = Number(product.price) || 0;
            if (state.priceFilter === "under-5m") matchesPrice = price < 5000000;
            else if (state.priceFilter === "5m-15m") matchesPrice = price >= 5000000 && price <= 15000000;
            else if (state.priceFilter === "15m-25m") matchesPrice = price >= 15000000 && price <= 25000000;
            else if (state.priceFilter === "above-25m") matchesPrice = price > 25000000;

            return matchesFlag && matchesQuery && matchesCategory && matchesBrand && matchesPrice;
        }).sort((a, b) => {
            // Sorting
            if (state.sortFilter === "price-asc") return (Number(a.price) || 0) - (Number(b.price) || 0);
            if (state.sortFilter === "price-desc") return (Number(b.price) || 0) - (Number(a.price) || 0);
            if (state.sortFilter === "name-asc") return (a.name || "").localeCompare(b.name || "", "vi");
            if (state.sortFilter === "stock-desc") return (Number(b.stock) || 0) - (Number(a.stock) || 0);
            return 0;
        });
    }

    function renderActiveFilterChips() {
        if (!nodes.activeFilterChips) return;
        const chips = [];

        if (state.query) {
            chips.push(`
                <span class="filter-chip">
                    <span>Tìm: "<strong>${escapeHtml(state.query)}</strong>"</span>
                    <button type="button" data-remove-filter="query" aria-label="Xóa tìm kiếm"><i data-lucide="x"></i></button>
                </span>
            `);
        }
        if (state.categoryFilter) {
            chips.push(`
                <span class="filter-chip">
                    <span>Danh mục: <strong>${escapeHtml(state.categoryFilter)}</strong></span>
                    <button type="button" data-remove-filter="category" aria-label="Xóa lọc danh mục"><i data-lucide="x"></i></button>
                </span>
            `);
        }
        if (state.brandFilter) {
            chips.push(`
                <span class="filter-chip">
                    <span>Thương hiệu: <strong>${escapeHtml(state.brandFilter)}</strong></span>
                    <button type="button" data-remove-filter="brand" aria-label="Xóa lọc thương hiệu"><i data-lucide="x"></i></button>
                </span>
            `);
        }
        if (state.priceFilter && state.priceFilter !== "all") {
            const priceLabels = {
                "under-5m": "Dưới 5 triệu",
                "5m-15m": "5 - 15 triệu",
                "15m-25m": "15 - 25 triệu",
                "above-25m": "Trên 25 triệu"
            };
            chips.push(`
                <span class="filter-chip">
                    <span>Giá: <strong>${priceLabels[state.priceFilter] || state.priceFilter}</strong></span>
                    <button type="button" data-remove-filter="price" aria-label="Xóa lọc giá"><i data-lucide="x"></i></button>
                </span>
            `);
        }

        const hasFilter = chips.length > 0;
        if (hasFilter) {
            nodes.activeFilterChips.innerHTML = `
                <div class="chips-label">Bộ lọc đang áp dụng:</div>
                <div class="chips-list">${chips.join("")}</div>
                <button type="button" class="clear-all-chips-btn" id="clearAllFiltersBtn">
                    <i data-lucide="trash-2"></i> Xóa tất cả
                </button>
            `;
            nodes.activeFilterChips.classList.remove("hidden");
            if (nodes.resetFilterBtn) nodes.resetFilterBtn.classList.remove("hidden");
        } else {
            nodes.activeFilterChips.innerHTML = "";
            nodes.activeFilterChips.classList.add("hidden");
            if (nodes.resetFilterBtn) nodes.resetFilterBtn.classList.add("hidden");
        }
        refreshIcons();
    }

    function renderProducts() {
        const grid = nodes.productGrid || $("#productGrid");
        const pagination = nodes.productPagination || $("#productPagination");
        if (!grid) return;

        const filtered = filteredProducts();
        const pageSize = 12;
        const pageCount = Math.ceil(filtered.length / pageSize);
        state.productsPage = Math.min(state.productsPage, Math.max(pageCount - 1, 0));
        const pageProducts = filtered.slice(state.productsPage * pageSize, (state.productsPage + 1) * pageSize);

        if (nodes.productTotalCount) {
            nodes.productTotalCount.textContent = `${filtered.length} sản phẩm`;
        }

        renderActiveFilterChips();

        if (pageProducts.length) {
            grid.innerHTML = pageProducts.map((product) => productCard(product)).join("");
        } else {
            grid.innerHTML = `
                <div class="empty-state products-empty">
                    <div class="empty-icon"><i data-lucide="search-x"></i></div>
                    <h3>Không tìm thấy sản phẩm phù hợp</h3>
                    <p>Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh lại các tiêu chí bộ lọc giá/danh mục.</p>
                    <button type="button" class="primary-button" id="emptyResetFilterBtn">
                        <i data-lucide="rotate-ccw"></i> Xóa tất cả bộ lọc
                    </button>
                </div>
            `;
        }

        if (pageCount > 1) {
            const firstProduct = state.productsPage * pageSize + 1;
            const lastProduct = Math.min((state.productsPage + 1) * pageSize, filtered.length);
            pagination.innerHTML = `
                <span class="pagination-summary" aria-live="polite">Hiển thị <strong>${firstProduct}–${lastProduct}</strong> trong <strong>${filtered.length}</strong> sản phẩm</span>
                <div class="product-page-controls">
                    <button class="product-page-button" type="button" data-products-page="${state.productsPage - 1}" ${state.productsPage === 0 ? "disabled" : ""} aria-label="Trang trước">
                        ${icon("chevron-left", 16)}<span>Trước</span>
                    </button>
                    <span class="pagination-current">Trang <strong>${state.productsPage + 1}</strong> / ${pageCount}</span>
                    <button class="product-page-button" type="button" data-products-page="${state.productsPage + 1}" ${state.productsPage >= pageCount - 1 ? "disabled" : ""} aria-label="Trang sau">
                        <span>Sau</span>${icon("chevron-right", 16)}
                    </button>
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
        if (!nodes.deals) return;
        const dealProducts = state.products.filter((product) => product.stock > 0).slice(0, 4);
        nodes.deals.classList.toggle("no-products", !dealProducts.length);
        if (!dealProducts.length) {
            nodes.deals.innerHTML = "";
            return;
        }

        nodes.deals.innerHTML = `
            <div class="deal-banner">
                <div class="deal-copy">
                    <div class="deal-badge"><i data-lucide="flame"></i> GIẢM GIÁ ĐẶC BIỆT TRONG NGÀY</div>
                    <h2>Săn Sale Công Nghệ Giá Cực Hời</h2>
                    <p>Hàng ngàn sản phẩm công nghệ chính hãng ưu đãi sâu. Số lượng có hạn trong khung giờ vàng.</p>
                    <div class="deal-countdown">
                        <span class="deal-cd-label">Kết thúc sau:</span>
                        <div class="deal-cd-boxes">
                            <span class="cd-box"><strong>08</strong><small>Giờ</small></span>
                            <span class="cd-sep">:</span>
                            <span class="cd-box"><strong>45</strong><small>Phút</small></span>
                            <span class="cd-sep">:</span>
                            <span class="cd-box"><strong>12</strong><small>Giây</small></span>
                        </div>
                    </div>
                </div>
                <div class="deal-grid">
                    ${dealProducts.map((product) => productCard(product, true)).join("")}
                </div>
            </div>
        `;
        refreshIcons();
    }

    function renderCategorySections() {
        if (!nodes.categorySections) return;
        const groups = [...new Set(state.products.map((product) => product.category?.name).filter(Boolean))];
        nodes.categorySections.innerHTML = groups.map((name) => {
            const products = state.products.filter((product) => product.category?.name === name).slice(0, 5);
            if (!products.length) return "";
            const safeName = escapeHtml(name);
            return `
                <section class="shell panel category-product-section">
                    <div class="section-title">
                        <span></span>
                        <h2>${safeName}</h2>
                        <a href="#products" class="view-all-link" data-category-filter="${safeName}">
                            Xem tất cả (${products.length}) <i data-lucide="arrow-right"></i>
                        </a>
                    </div>
                    <div class="product-grid small-grid">
                        ${products.map((product) => productCard(product, true)).join("")}
                    </div>
                </section>
            `;
        }).join("");
        refreshIcons();
    }

    function setView(view) {
        state.view = view;
        const catalogActive = view === "catalog" || view === "detail";
        document.querySelectorAll(".home-view").forEach((section) => section.classList.toggle("hidden", view !== "listing"));
        document.querySelectorAll(".catalog-view").forEach((section) => section.classList.toggle("hidden", view !== "catalog"));
        if (nodes.productDetail) nodes.productDetail.classList.toggle("hidden", view !== "detail");
        if (nodes.profileView) nodes.profileView.classList.toggle("hidden", view !== "profile");
        if (nodes.adminView) nodes.adminView.classList.toggle("hidden", view !== "admin");
        const footer = $(".site-footer");
        if (footer) footer.classList.toggle("hidden", view === "admin");
        document.body.classList.toggle("admin-mode", view === "admin");

        // Mobile active tab sync
        if (nodes.homeNavLink) nodes.homeNavLink.classList.toggle("active", view === "listing");
        if (nodes.catalogNavLink) nodes.catalogNavLink.classList.toggle("active", catalogActive);
        if (nodes.mobNavHome) nodes.mobNavHome.classList.toggle("active", view === "listing");
        if (nodes.mobNavCatalog) nodes.mobNavCatalog.classList.toggle("active", catalogActive);
    }

    function showHome(targetId = null) {
        if (nodes.catalogPanel) nodes.catalogPanel.classList.remove("open");
        setView("listing");
        if (targetId) {
            document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    function showCatalog(targetId = "products") {
        if (nodes.catalogPanel) nodes.catalogPanel.classList.remove("open");
        setView("catalog");
        requestAnimationFrame(() => {
            const requestedTarget = document.getElementById(targetId);
            const target = requestedTarget && !requestedTarget.classList.contains("no-products")
                ? requestedTarget
                : nodes.products;
            target?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    function renderDetail(product) {
        state.selectedProduct = product;
        state.quantity = 1;
        setView("detail");

        const brandName = product.brand?.name ? escapeHtml(product.brand.name) : "Chính hãng";
        const categoryName = product.category?.name ? escapeHtml(product.category.name) : "Sản phẩm";
        const isInStock = product.stock > 0;
        const relatedProducts = state.products
            .filter((p) => p.id !== product.id && (p.category?.id === product.category?.id || p.brand?.id === product.brand?.id))
            .slice(0, 4);

        nodes.productDetail.innerHTML = `
            <div class="detail-breadcrumbs">
                <a href="#home" id="breadcrumbHome"><i data-lucide="home"></i> Trang chủ</a>
                <span class="crumb-sep">/</span>
                <span class="crumb-category" data-category-filter="${categoryName}">${categoryName}</span>
                <span class="crumb-sep">/</span>
                <span class="crumb-current">${escapeHtml(product.name)}</span>
            </div>

            <div class="detail-top-nav">
                <button class="back-button" id="backToProducts" type="button">
                    <i data-lucide="arrow-left"></i> Quay lại danh sách sản phẩm
                </button>
            </div>

            <div class="detail-grid">
                <div class="detail-gallery">
                    <div class="detail-main-visual">
                        ${productVisual(product)}
                    </div>
                    <div class="detail-assurance-badges">
                        <div class="assurance-item">
                            <i data-lucide="shield-check"></i>
                            <span>Bảo hành chính hãng 12 tháng</span>
                        </div>
                        <div class="assurance-item">
                            <i data-lucide="refresh-cw"></i>
                            <span>1 đổi 1 trong 30 ngày nếu lỗi</span>
                        </div>
                    </div>
                </div>

                <div class="detail-buy">
                    <div class="detail-brand-badge">${brandName} · ${categoryName}</div>
                    <h1 class="detail-title">${escapeHtml(product.name)}</h1>

                    <div class="detail-rating-row">
                        <div class="stars">${"★".repeat(5)}</div>
                        <span class="score">5.0</span>
                        <span class="count">(12 đánh giá)</span>
                        <span class="sep">·</span>
                        <span class="stock-badge ${isInStock ? "in-stock" : "out-of-stock"}">
                            <i data-lucide="${isInStock ? "check-circle" : "x-circle"}"></i>
                            ${isInStock ? `Còn hàng (${product.stock} sản phẩm)` : "Hết hàng"}
                        </span>
                    </div>

                    <div class="detail-price-box">
                        <div class="detail-price-main">
                            <strong class="detail-price">${formatMoney(product.price)}</strong>
                            ${product.price > 5000000 ? `<span class="detail-original-price">${formatMoney(product.price * 1.15)}</span>` : ""}
                        </div>
                        <p class="detail-tax-note"><i data-lucide="check"></i> Giá đã bao gồm thuế VAT & Bảo hành đầy đủ</p>
                    </div>

                    <div class="detail-options">
                        <div class="detail-qty-group">
                            <label class="qty-label">Số lượng mua:</label>
                            <div class="quantity-control">
                                <button type="button" data-qty="-1" aria-label="Giảm số lượng" ${!isInStock ? "disabled" : ""}>−</button>
                                <input id="detailQuantity" value="1" readonly aria-label="Số lượng">
                                <button type="button" data-qty="1" aria-label="Tăng số lượng" ${!isInStock ? "disabled" : ""}>+</button>
                            </div>
                            ${isInStock ? `<span class="stock-hint">Kho sẵn: ${product.stock} máy</span>` : ""}
                        </div>

                        <div class="buy-actions">
                            <button class="add-cart-wide" type="button" data-add="${product.id}" ${!isInStock ? "disabled" : ""}>
                                <i data-lucide="shopping-bag"></i>
                                <span>Thêm vào giỏ hàng</span>
                            </button>
                            <button class="primary-button buy-now-btn" type="button" data-buy-now="${product.id}" ${!isInStock ? "disabled" : ""}>
                                <i data-lucide="zap"></i>
                                <span>Mua ngay</span>
                            </button>
                        </div>
                    </div>

                    <div class="detail-perks">
                        <div class="perk-card">
                            <i data-lucide="truck"></i>
                            <div>
                                <strong>Giao hàng miễn phí</strong>
                                <small>Nhanh chóng trong 2h tại khu vực nội thành</small>
                            </div>
                        </div>
                        <div class="perk-card">
                            <i data-lucide="credit-card"></i>
                            <div>
                                <strong>Trả góp 0% tiện lợi</strong>
                                <small>Thủ tục xét duyệt online chỉ từ 5 phút</small>
                            </div>
                        </div>
                    </div>
                </div>

                <aside class="detail-sidebar">
                    <div class="sidebar-box info-box">
                        <div class="sidebar-box-head">
                            <i data-lucide="info"></i>
                            <strong>Thông tin sản phẩm</strong>
                        </div>
                        <ul class="detail-specs-list">
                            <li><span>Thương hiệu:</span> <strong>${brandName}</strong></li>
                            <li><span>Danh mục:</span> <strong>${categoryName}</strong></li>
                            <li><span>Mã sản phẩm:</span> <strong>#${product.id}</strong></li>
                            <li><span>Tình trạng:</span> <strong>${isInStock ? "Hàng mới 100%" : "Đang chờ nhập"}</strong></li>
                            <li><span>Bộ phụ kiện:</span> <strong>Hộp, Cáp sạc, Sách HDSD</strong></li>
                        </ul>
                    </div>

                    <div class="sidebar-box support-box">
                        <div class="sidebar-box-head">
                            <i data-lucide="headphones"></i>
                            <strong>Bạn cần hỗ trợ?</strong>
                        </div>
                        <p>Liên hệ ngay chuyên viên công nghệ để được giải đáp mọi thắc mắc:</p>
                        <a href="tel:18006868" class="hotline-btn"><i data-lucide="phone"></i> 1800 6868 (Miễn phí)</a>
                    </div>
                </aside>
            </div>

            <!-- Product Description Tab -->
            <section class="product-description-panel">
                <div class="section-title">
                    <span></span>
                    <h2>Mô Tả Sản Phẩm</h2>
                </div>
                <div class="description-content">
                    <p>${product.description ? escapeHtml(product.description).replace(/\n/g, "<br>") : "Sản phẩm công nghệ chính hãng được phân phối tại E-Market. Cam kết nguồn gốc xuất xứ rõ ràng, chính sách bảo hành và hỗ trợ kỹ thuật trọn đời."}</p>
                </div>
            </section>

            <!-- Product Reviews Section -->
            <section class="product-reviews" aria-labelledby="productReviewsTitle">
                <div class="section-title">
                    <span></span>
                    <h2 id="productReviewsTitle">Đánh Giá & Nhận Xét</h2>
                </div>

                <div class="reviews-summary-card">
                    <div class="rating-overall">
                        <strong class="overall-number">5.0</strong>
                        <div class="stars">${"★".repeat(5)}</div>
                        <span>Dựa trên đánh giá của khách hàng</span>
                    </div>
                    <div class="rating-bars">
                        <div class="bar-line"><span>5 sao</span><div class="bar-track"><div class="bar-fill" style="width: 90%;"></div></div><span>90%</span></div>
                        <div class="bar-line"><span>4 sao</span><div class="bar-track"><div class="bar-fill" style="width: 10%;"></div></div><span>10%</span></div>
                        <div class="bar-line"><span>3 sao</span><div class="bar-track"><div class="bar-fill" style="width: 0%;"></div></div><span>0%</span></div>
                    </div>
                </div>

                <div id="reviewFormContainer" class="review-form-container"></div>
                <div class="review-list" id="reviewList" aria-live="polite">
                    <p class="empty-state">Đang tải đánh giá…</p>
                </div>
            </section>

            <!-- Related Products -->
            ${relatedProducts.length ? `
                <section class="related-products-section">
                    <div class="section-title">
                        <span></span>
                        <h2>Sản Phẩm Cùng Loại</h2>
                    </div>
                    <div class="product-grid small-grid">
                        ${relatedProducts.map((p) => productCard(p, true)).join("")}
                    </div>
                </section>
            ` : ""}
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
            container.innerHTML = `
                <div class="review-login-prompt">
                    <i data-lucide="message-square"></i>
                    <div>
                        <strong>Bạn đã dùng sản phẩm này?</strong>
                        <p>Hãy chia sẻ cảm nhận và đánh giá để giúp những người mua khác lựa chọn tốt hơn.</p>
                    </div>
                    <button class="primary-button review-login-button" type="button" data-auth-open="login">
                        <i data-lucide="log-in"></i> Đăng nhập để đánh giá
                    </button>
                </div>
            `;
            refreshIcons();
            return;
        }

        container.innerHTML = `
            <form class="review-form" id="createReviewForm">
                <div class="review-form-top">
                    <label class="star-rating-select-label">
                        <span>Đánh giá sao của bạn:</span>
                        <select name="rating" required>
                            <option value="5">⭐⭐⭐⭐⭐ (5 sao - Tuyệt vời)</option>
                            <option value="4">⭐⭐⭐⭐ (4 sao - Rất tốt)</option>
                            <option value="3">⭐⭐⭐ (3 sao - Tạm được)</option>
                            <option value="2">⭐⭐ (2 sao - Chưa ưng ý)</option>
                            <option value="1">⭐ (1 sao - Rất tệ)</option>
                        </select>
                    </label>
                </div>
                <label class="comment-textarea-label">
                    <span>Nhận xét chi tiết:</span>
                    <textarea name="comment" rows="3" maxlength="2000" placeholder="Chia sẻ trải nghiệm về hiệu năng, thiết kế, độ bền, camera hoặc dịch vụ giao hàng..." required></textarea>
                </label>
                <div class="review-submit-wrap">
                    <button class="primary-button" type="submit">
                        <i data-lucide="send"></i> Gửi đánh giá
                    </button>
                </div>
            </form>
        `;
        refreshIcons();
    }

    function renderReviewList() {
        const list = $("#reviewList");
        if (!list) return;
        if (!state.reviewItems.length) {
            list.innerHTML = `<div class="empty-state"><i data-lucide="message-circle"></i><p>Sản phẩm chưa có đánh giá nào. Hãy là người đầu tiên nhận xét!</p></div>`;
            refreshIcons();
            return;
        }

        const currentUser = window.emarketApi.getUserName();
        list.innerHTML = state.reviewItems.map((review) => {
            const isOwner = currentUser && currentUser === review.username;
            const authorInitial = (review.username || "K").charAt(0).toUpperCase();

            if (state.editingReviewId === review.id && isOwner) {
                return `
                    <article class="review-card editing-card">
                        <form class="review-edit-form" data-review-edit-form="${review.id}">
                            <label>Điểm đánh giá
                                <select name="rating" required>
                                    ${[5, 4, 3, 2, 1].map((rating) => `<option value="${rating}" ${Number(review.rating) === rating ? "selected" : ""}>${rating} sao</option>`).join("")}
                                </select>
                            </label>
                            <label>Nhận xét
                                <textarea name="comment" rows="3" maxlength="2000" required>${escapeHtml(review.comment || "")}</textarea>
                            </label>
                            <div class="review-actions">
                                <button class="primary-button" type="submit"><i data-lucide="check"></i> Lưu thay đổi</button>
                                <button class="ghost-button" type="button" data-cancel-review-edit>Hủy</button>
                            </div>
                        </form>
                    </article>
                `;
            }

            const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString("vi-VN") : "";
            const ratingNum = Math.max(1, Math.min(5, Number(review.rating) || 5));
            return `
                <article class="review-card">
                    <div class="review-card-head">
                        <div class="reviewer-meta">
                            <div class="reviewer-avatar">${escapeHtml(authorInitial)}</div>
                            <div>
                                <strong>${escapeHtml(review.username || "Khách hàng")}</strong>
                                <span class="verified-tag"><i data-lucide="badge-check"></i> Đã mua tại E-Market</span>
                            </div>
                        </div>
                        <div class="review-rating-block">
                            <span class="review-stars">${"★".repeat(ratingNum)}${"☆".repeat(5 - ratingNum)}</span>
                            ${date ? `<time class="review-date">${escapeHtml(date)}</time>` : ""}
                        </div>
                    </div>
                    <div class="review-card-body">
                        <p>${review.comment ? escapeHtml(review.comment) : "Khách hàng không để lại bình luận chi tiết."}</p>
                    </div>
                    ${isOwner ? `
                        <div class="review-actions">
                            <button class="review-action-btn edit" type="button" data-edit-review="${review.id}"><i data-lucide="edit-3"></i> Sửa</button>
                            <button class="review-action-btn delete" type="button" data-delete-review="${review.id}"><i data-lucide="trash-2"></i> Xóa</button>
                        </div>
                    ` : ""}
                </article>
            `;
        }).join("");
        refreshIcons();
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
                showToast("Cảm ơn bạn đã gửi đánh giá sản phẩm!", "success");
            } else {
                await window.emarketApi.updateReview(reviewId, payload);
                state.editingReviewId = null;
                showToast("Đã cập nhật đánh giá thành công.", "success");
            }
            await loadProductReviews(state.selectedProduct.id);
        } catch (error) {
            showToast(`Không thể lưu đánh giá: ${error.message}`, "error");
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

        if (nodes.cartCount) nodes.cartCount.textContent = String(totalItems);
        if (nodes.mobCartCount) nodes.mobCartCount.textContent = String(totalItems);
        if (nodes.headerCartTotal) nodes.headerCartTotal.textContent = formatMoney(total);
        if (nodes.cartTitle) nodes.cartTitle.textContent = `${totalItems} sản phẩm trong giỏ`;
        if (nodes.cartSubtotal) nodes.cartSubtotal.textContent = formatMoney(total);
        if (nodes.cartTotal) nodes.cartTotal.textContent = formatMoney(total);
        if (nodes.checkoutTotal) nodes.checkoutTotal.textContent = formatMoney(total);
        if (nodes.checkoutButton) nodes.checkoutButton.disabled = state.cart.length === 0;

        if (nodes.cartItems) {
            nodes.cartItems.innerHTML = state.cart.length
                ? state.cart.map((item) => `
                    <article class="cart-item">
                        <div class="cart-item-photo">
                            ${productVisual(item.product, true)}
                        </div>
                        <div class="cart-item-info">
                            <strong class="cart-item-title" title="${escapeHtml(item.product.name)}">${escapeHtml(item.product.name)}</strong>
                            <div class="cart-item-price">${formatMoney(item.product.price)}</div>
                            <div class="cart-item-actions">
                                <div class="item-qty-stepper">
                                    <button type="button" data-cart-change="${escapeHtml(item.id)}" data-delta="-1" aria-label="Giảm số lượng" ${item.quantity <= 1 ? "disabled" : ""}>−</button>
                                    <output>${item.quantity}</output>
                                    <button type="button" data-cart-change="${escapeHtml(item.id)}" data-delta="1" aria-label="Tăng số lượng" ${item.quantity >= item.product.stock ? "disabled" : ""}>+</button>
                                </div>
                                <button class="cart-remove-btn" type="button" data-cart-remove="${escapeHtml(item.id)}" title="Xóa khỏi giỏ">
                                    <i data-lucide="trash-2"></i>
                                </button>
                            </div>
                        </div>
                    </article>
                `).join("")
                : `
                    <div class="empty-state cart-empty">
                        <div class="empty-icon"><i data-lucide="shopping-bag"></i></div>
                        <h3>Giỏ hàng đang trống</h3>
                        <p>Hãy dạo quanh các danh mục để chọn cho mình thiết bị ưng ý nhất!</p>
                        <button type="button" class="primary-button" id="cartContinueShopBtn">
                            Tiếp tục mua hàng
                        </button>
                    </div>
                `;
        }

        refreshIcons();
    }

    function addLocalCart(productId, quantity = 1) {
        const product = state.products.find((item) => item.id === Number(productId));
        if (!product || product.stock <= 0) return false;
        const existing = state.cart.find((item) => item.product.id === product.id);
        if ((existing?.quantity || 0) + quantity > product.stock) {
            showToast(`Chỉ còn ${product.stock} sản phẩm trong kho.`, "error");
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
                showToast("Đã thêm sản phẩm vào giỏ hàng!", "success");
            } catch (error) {
                showToast(`Không thể cập nhật giỏ hàng: ${error.message}`, "error");
                return false;
            }
        } else if (!addLocalCart(productId, quantity)) {
            return false;
        } else {
            showToast("Đã thêm sản phẩm vào giỏ hàng!", "success");
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
            showToast(`Chỉ còn ${item.product.stock} sản phẩm trong kho.`, "error");
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
            showToast(`Không thể cập nhật số lượng: ${error.message}`, "error");
        }
    }

    async function removeCartItem(itemId) {
        const item = state.cart.find((candidate) => candidate.id === String(itemId));
        if (!item) return;
        if (item.local) {
            state.cart = state.cart.filter((candidate) => candidate.id !== item.id);
            persistGuestCart();
            renderCart();
            showToast("Đã xóa sản phẩm khỏi giỏ.", "info");
            return;
        }
        try {
            state.cart = (await window.emarketApi.removeCartItem(item.id)).items;
            renderCart();
            showToast("Đã xóa sản phẩm khỏi giỏ.", "info");
        } catch (error) {
            showToast(`Không thể xóa sản phẩm: ${error.message}`, "error");
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
                showToast("Một số mặt hàng chưa đồng bộ với giỏ tài khoản. Hãy thử lại.", "error");
                return;
            }
            // Auto fill profile contact into checkout form
            if (state.profile) {
                const form = nodes.checkoutForm;
                if (form) {
                    if (form.elements["customerName"] && !form.elements["customerName"].value) {
                        form.elements["customerName"].value = state.profile.fullName || "";
                    }
                    if (form.elements["phone"] && !form.elements["phone"].value) {
                        form.elements["phone"].value = state.profile.phone || "";
                    }
                }
            }
        }
        if (!state.cart.length) {
            showToast("Giỏ hàng đang trống.", "info");
            return;
        }
        closeCart();
        nodes.checkoutTotal.textContent = formatMoney(cartTotal());
        nodes.checkoutModal.classList.remove("hidden");
        nodes.checkoutBackdrop.classList.remove("hidden");
        nodes.checkoutModal.setAttribute("aria-hidden", "false");
        refreshIcons();
    }

    function closeCheckout() {
        nodes.checkoutModal.classList.add("hidden");
        nodes.checkoutBackdrop.classList.add("hidden");
        nodes.checkoutModal.setAttribute("aria-hidden", "true");
    }

    function profileRoleLabel(role) {
        return ({
            ADMIN: "Quản trị viên",
            MEMBER: "Thành viên",
            CUSTOMER: "Khách hàng"
        })[String(role || "").toUpperCase()] || "Khách hàng";
    }

    function renderProfile() {
        const profile = state.profile;
        if (!profile) return;

        const fullName = String(profile.fullName || profile.userName || "Hồ sơ cá nhân").trim();
        const nameParts = fullName.split(/\s+/).filter(Boolean);
        const initials = nameParts.length > 1
            ? nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
            : fullName.slice(0, 2);
        const membership = profile.membership || {};
        const membershipDetails = [];

        if (membership.discountPercent != null) membershipDetails.push(`Ưu đãi ${membership.discountPercent}%`);
        if (membership.requiredPoints != null) {
            membershipDetails.push(`Mốc hạng ${new Intl.NumberFormat("vi-VN").format(membership.requiredPoints)} điểm`);
        }

        nodes.profileTitle.textContent = fullName;
        nodes.profileAvatar.textContent = initials.toLocaleUpperCase("vi-VN");
        nodes.profileUserName.textContent = profile.userName ? `@${profile.userName}` : "Tài khoản E-Market";
        nodes.profileRole.textContent = profileRoleLabel(profile.role);
        nodes.profilePoints.textContent = new Intl.NumberFormat("vi-VN").format(Number(profile.points) || 0);
        nodes.profileMembership.textContent = membership.name || "Thành viên";
        nodes.profileMembershipDetails.textContent = membershipDetails.join(" · ") || "Quyền lợi thành viên E-Market";
        nodes.profileFullNameInput.value = profile.fullName || "";
        nodes.profileUserNameInput.value = profile.userName || "";
        nodes.profileEmailInput.value = profile.email || "";
        nodes.profilePhoneInput.value = profile.phone || "";
        nodes.profileFeedback.textContent = "";
        nodes.profileLoadState.classList.add("hidden");
        nodes.profileContent.classList.remove("hidden");

        // Load recent orders in profile
        void loadProfileOrdersPreview();
        refreshIcons();
    }

    async function loadProfileOrdersPreview() {
        const container = nodes.profileOrdersPreview;
        if (!container) return;
        try {
            const orders = await window.emarketApi.getMyOrders();
            if (!orders || !orders.length) {
                container.innerHTML = `<p class="empty-state">Bạn chưa có đơn hàng nào.</p>`;
                return;
            }
            container.innerHTML = `
                <div class="order-list-compact">
                    ${orders.slice(0, 3).map((order) => `
                        <div class="order-compact-card">
                            <div class="order-compact-head">
                                <strong>Đơn #${escapeHtml(order.id)}</strong>
                                <span class="order-status-pill status-${String(order.status || "").toLowerCase()}">${escapeHtml(orderStatusLabel(order.status))}</span>
                            </div>
                            <div class="order-compact-date">${escapeHtml(orderDate(order.createdAt))}</div>
                            <div class="order-compact-total">Tổng: <strong>${formatMoney(order.totalAmount)}</strong></div>
                        </div>
                    `).join("")}
                </div>
            `;
        } catch (error) {
            container.innerHTML = `<p class="empty-state">Không thể tải đơn hàng: ${escapeHtml(error.message)}</p>`;
        }
    }

    async function loadProfile() {
        nodes.profileContent.classList.add("hidden");
        nodes.profileLoadMessage.textContent = "Đang tải hồ sơ…";
        nodes.profileRetryButton.classList.add("hidden");
        nodes.profileLoadState.classList.remove("hidden");

        try {
            state.profile = await window.emarketApi.getProfile();
            renderProfile();
        } catch (error) {
            nodes.profileLoadMessage.textContent = `Không thể tải hồ sơ: ${error.message}`;
            nodes.profileRetryButton.classList.remove("hidden");
        }
    }

    async function showProfile() {
        if (!window.emarketApi.getToken()) {
            showToast("Đăng nhập để xem hồ sơ cá nhân.", "info");
            openAuth("login");
            return;
        }

        setView("profile");
        window.scrollTo({ top: 0, behavior: "smooth" });
        await loadProfile();
    }

    function resetProfileForm() {
        if (state.profile) renderProfile();
    }

    async function handleProfileSubmit(event) {
        event.preventDefault();
        if (!state.profile || state.profileSaving) return;

        const formValues = new FormData(nodes.profileForm);
        const payload = {};
        ["userName", "fullName", "email", "phone"].forEach((field) => {
            const nextValue = String(formValues.get(field) || "").trim();
            const currentValue = String(state.profile[field] || "");
            if (nextValue !== currentValue) payload[field] = nextValue;
        });

        if (!Object.keys(payload).length) {
            nodes.profileFeedback.textContent = "Chưa có thay đổi nào để lưu.";
            return;
        }

        state.profileSaving = true;
        nodes.profileSaveButton.disabled = true;
        nodes.profileSaveButton.textContent = "Đang lưu…";
        nodes.profileFeedback.textContent = "Đang cập nhật hồ sơ…";

        try {
            state.profile = await window.emarketApi.updateProfile(payload);
            renderProfile();
            showToast("Đã cập nhật hồ sơ thành công!", "success");
        } catch (error) {
            nodes.profileFeedback.textContent = `Không thể cập nhật hồ sơ: ${error.message}`;
        } finally {
            state.profileSaving = false;
            nodes.profileSaveButton.disabled = false;
            nodes.profileSaveButton.innerHTML = `<i data-lucide="save"></i> Lưu thay đổi`;
            refreshIcons();
        }
    }

    async function handleChangePasswordSubmit(event) {
        event.preventDefault();
        if (state.changePasswordSaving) return;

        const formValues = new FormData(nodes.changePasswordForm);
        const currentPassword = String(formValues.get("currentPassword") || "");
        const newPassword = String(formValues.get("newPassword") || "");
        const confirmPassword = String(formValues.get("confirmPassword") || "");
        const feedback = nodes.changePasswordFeedback;

        feedback.classList.remove("is-error", "is-success");
        if (newPassword !== confirmPassword) {
            feedback.textContent = "Mật khẩu mới nhập lại chưa khớp.";
            feedback.classList.add("is-error");
            nodes.confirmPasswordInput.focus();
            return;
        }
        if (currentPassword === newPassword) {
            feedback.textContent = "Mật khẩu mới phải khác mật khẩu hiện tại.";
            feedback.classList.add("is-error");
            nodes.newPasswordInput.focus();
            return;
        }

        state.changePasswordSaving = true;
        nodes.changePasswordSubmitButton.disabled = true;
        nodes.changePasswordSubmitButton.innerHTML = "<i data-lucide=\"loader-circle\"></i> Đang cập nhật…";
        feedback.textContent = "Đang xác nhận mật khẩu…";

        try {
            await window.emarketApi.changePassword({ currentPassword, newPassword });
            nodes.changePasswordForm.reset();
            feedback.textContent = "Đổi mật khẩu thành công.";
            feedback.classList.add("is-success");
            showToast("Đổi mật khẩu thành công.", "success");
        } catch (error) {
            feedback.textContent = `Không thể đổi mật khẩu: ${error.message}`;
            feedback.classList.add("is-error");
        } finally {
            state.changePasswordSaving = false;
            nodes.changePasswordSubmitButton.disabled = false;
            nodes.changePasswordSubmitButton.innerHTML = "<i data-lucide=\"key-round\"></i> Đổi mật khẩu";
            refreshIcons();
        }
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
            paymentMethod: form.paymentMethod,
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
            showOrderLookup(order, true);
        } catch (error) {
            showToast(`Chưa thể tạo đơn hàng: ${error.message}`, "error");
        } finally {
            state.submittingOrder = false;
            nodes.placeOrderButton.disabled = false;
            nodes.placeOrderButton.innerHTML = `<i data-lucide="check-circle-2"></i> Xác nhận đặt hàng`;
            refreshIcons();
        }
    }

    function closeOrders() {
        nodes.ordersModal.classList.add("hidden");
        nodes.ordersBackdrop.classList.add("hidden");
        nodes.ordersModal.setAttribute("aria-hidden", "true");
    }

    function openOrdersModal() {
        nodes.ordersModal.classList.remove("hidden");
        nodes.ordersBackdrop.classList.remove("hidden");
        nodes.ordersModal.setAttribute("aria-hidden", "false");
        refreshIcons();
    }

    function showOrderLookup(order = null, newlyPlaced = false) {
        nodes.ordersTitle.textContent = "Tra cứu đơn hàng";
        nodes.orderLookupPanel.classList.remove("hidden");
        nodes.orderList.classList.add("hidden");
        nodes.orderList.innerHTML = "";
        nodes.orderLookupResult.innerHTML = "";
        nodes.orderTrackingForm.reset();

        if (order) {
            nodes.orderTrackingCode.value = order.trackingCode || "";
            renderTrackedOrder(order, newlyPlaced);
        }

        openOrdersModal();
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
            SHIPPING: "Đang giao hàng",
            SHIPPED: "Đang giao hàng",
            DELIVERED: "Đã giao hàng",
            COMPLETED: "Hoàn tất",
            CANCELLED: "Đã hủy",
            CANCELED: "Đã hủy"
        };
        const value = String(status || "PENDING").toUpperCase();
        return labels[value] || status || "Đang xử lý";
    }

    function paymentMethodLabel(method) {
        const labels = {
            CASH: "Tiền mặt khi nhận hàng",
            BANK_TRANSFER: "Chuyển khoản ngân hàng"
        };
        return labels[String(method || "").toUpperCase()] || "Chưa có thông tin";
    }

    function renderTrackedOrder(order, newlyPlaced = false) {
        const statusKey = String(order.status || "pending").toLowerCase().replace(/[^a-z0-9_-]/g, "");
        const successNotice = newlyPlaced
            ? `<p class="order-placed-notice"><i data-lucide="circle-check"></i><span>Đặt hàng thành công. Hãy lưu mã vận đơn để tra cứu đơn hàng sau này.</span></p>`
            : "";
        const items = Array.isArray(order.items) ? order.items : [];

        nodes.orderLookupResult.innerHTML = `
            ${successNotice}
            <article class="order-card">
                <div class="order-card-head">
                    <div class="order-head-id">
                        <i data-lucide="package"></i>
                        <strong>Đơn hàng #${escapeHtml(order.id)}</strong>
                    </div>
                    <span class="order-status-badge ${statusKey}">${escapeHtml(orderStatusLabel(order.status))}</span>
                </div>
                <div class="order-tracking-code">
                    <span>Mã vận đơn</span>
                    <code>${escapeHtml(order.trackingCode || "Chưa có mã vận đơn")}</code>
                </div>
                <small class="order-date"><i data-lucide="clock"></i> ${escapeHtml(orderDate(order.createdAt))}</small>
                <small class="order-date">Thanh toán: ${escapeHtml(paymentMethodLabel(order.paymentMethod))}</small>
                <div class="order-card-items">
                    ${items.length ? items.map((item) => `
                        <div class="order-sub-item">
                            <span>${escapeHtml(item.product?.name || "Sản phẩm")}</span>
                            <span>× ${Number(item.quantity) || 0}</span>
                        </div>
                    `).join("") : `<span>Chưa có thông tin sản phẩm.</span>`}
                </div>
                <div class="order-card-total">
                    <span>Tổng thanh toán:</span>
                    <strong>${formatMoney(order.totalAmount)}</strong>
                </div>
            </article>
        `;
        refreshIcons();
    }

    async function handleOrderTrackingSubmit(event) {
        event.preventDefault();
        const trackingCode = nodes.orderTrackingCode.value.trim();
        if (!trackingCode) return;

        nodes.trackOrderButton.disabled = true;
        nodes.trackOrderButton.innerHTML = `<i data-lucide="loader-circle"></i> Đang tra cứu`;
        nodes.orderLookupResult.innerHTML = `<div class="empty-state"><div class="admin-spinner"></div><p>Đang tìm đơn hàng…</p></div>`;
        refreshIcons();

        try {
            const order = await window.emarketApi.trackOrder(trackingCode);
            renderTrackedOrder(order);
        } catch (error) {
            nodes.orderLookupResult.innerHTML = `<p class="order-lookup-message error" role="alert">Không tìm thấy đơn hàng hoặc mã vận đơn không hợp lệ. ${escapeHtml(error.message)}</p>`;
        } finally {
            nodes.trackOrderButton.disabled = false;
            nodes.trackOrderButton.innerHTML = `<i data-lucide="search"></i> Tra cứu`;
            refreshIcons();
        }
    }

    async function cancelCustomerOrder(button) {
        const orderId = button.dataset.cancelOrder;
        if (!window.confirm(`Bạn chắc chắn muốn hủy đơn hàng #${orderId}?`)) return;

        button.disabled = true;
        button.textContent = "Đang hủy...";
        try {
            await window.emarketApi.cancelOrder(orderId);
            showToast("Đã hủy đơn hàng thành công.", "success");
            await showMyOrders();
        } catch (error) {
            showToast(`Không thể hủy đơn hàng: ${error.message}`, "error");
            button.disabled = false;
            button.textContent = "Hủy đơn";
        }
    }

    async function showMyOrders() {
        if (!window.emarketApi.getToken()) {
            showToast("Đăng nhập để xem danh sách đơn hàng của bạn.", "info");
            openAuth("login");
            return;
        }
        nodes.ordersTitle.textContent = "Đơn hàng của tôi";
        nodes.orderLookupPanel.classList.add("hidden");
        nodes.orderList.innerHTML = `<div class="empty-state"><div class="admin-spinner"></div><p>Đang tải danh sách đơn hàng…</p></div>`;
        nodes.orderList.classList.remove("hidden");
        openOrdersModal();

        try {
            const orders = await window.emarketApi.getMyOrders();
            nodes.orderList.innerHTML = orders.length ? orders.map((order) => {
                const statusKey = String(order.status || "pending").toLowerCase();
                return `
                    <article class="order-card">
                        <div class="order-card-head">
                            <div class="order-head-id">
                                <i data-lucide="package"></i>
                                <strong>Đơn hàng #${escapeHtml(order.id)}</strong>
                            </div>
                            <span class="order-status-badge ${statusKey}">
                                ${escapeHtml(orderStatusLabel(order.status))}
                            </span>
                        </div>
                        <small class="order-date"><i data-lucide="clock"></i> ${escapeHtml(orderDate(order.createdAt))}</small>
                        <small class="order-date">Thanh toán: ${escapeHtml(paymentMethodLabel(order.paymentMethod))}</small>
                        ${order.trackingCode ? `
                            <div class="order-tracking-code order-history-tracking">
                                <span>Mã vận đơn</span>
                                <code>${escapeHtml(order.trackingCode)}</code>
                            </div>
                        ` : ""}
                        <div class="order-card-items">
                            ${(order.items || []).map((item) => `
                                <div class="order-sub-item">
                                    <span>${escapeHtml(item.product?.name || "Sản phẩm")}</span>
                                    <span>× ${Number(item.quantity) || 0}</span>
                                </div>
                            `).join("")}
                        </div>
                        <div class="order-card-total">
                            <span>Tổng thanh toán:</span>
                            <strong>${formatMoney(order.totalAmount)}</strong>
                        </div>
                        ${String(order.status || "").toUpperCase() === "PENDING" ? `
                            <div class="order-card-actions">
                                <button class="order-cancel-button" type="button" data-cancel-order="${escapeHtml(order.id)}">Hủy đơn</button>
                            </div>
                        ` : ""}
                    </article>
                `;
            }).join("") : `
                <div class="empty-state">
                    <i data-lucide="package-open"></i>
                    <h3>Bạn chưa có đơn hàng nào</h3>
                    <p>Khám phá ngay hàng trăm sản phẩm công nghệ ưu đãi tại E-Market.</p>
                </div>
            `;
            refreshIcons();
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
        const totalOrders = Number(state.admin.ordersPageInfo?.totalElements ?? orders.length);
        const lowStock = products.filter((product) => Number(product.stock) <= 5).length;
        const items = [
            { label: "Sản phẩm", value: products.length, icon: "package" },
            { label: "Tổng đơn hàng", value: totalOrders, icon: "clipboard-list" },
            { label: "Chờ xác nhận (trang)", value: pendingOrders, icon: "clock-3" },
            { label: "Sắp hết hàng", value: lowStock, icon: "alert-triangle" }
        ];
        nodes.adminSummary.innerHTML = items.map((item) =>
            '<article class="admin-stat"><span class="admin-stat-icon">' + icon(item.icon, 20) + '</span><div><span>' + item.label
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
        if (state.adminTab === "users") return renderAdminUsers();
        return renderAdminOrders();
    }

    function renderAdminOrders() {
        const orders = [...state.admin.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const page = state.admin.ordersPageInfo;
        const pagination = Number(page?.totalPages) > 1
            ? '<div class="admin-user-pagination"><button class="admin-inline-button" type="button" data-order-page="' + (page.number - 1) + '"'
                + (page.first ? " disabled" : "") + '>Trước</button><span>Trang ' + (page.number + 1) + ' / ' + page.totalPages + ' · '
                + Number(page.totalElements || 0).toLocaleString("vi-VN") + ' đơn hàng</span><button class="admin-inline-button" type="button" data-order-page="'
                + (page.number + 1) + '"' + (page.last ? " disabled" : "") + '>Tiếp</button></div>'
            : page ? '<p class="admin-user-count">' + Number(page.totalElements || 0).toLocaleString("vi-VN") + ' đơn hàng</p>' : "";
        return adminHeading("Quản lý đơn hàng", "Theo dõi thông tin nhận hàng và cập nhật tiến độ đơn.", "", "")
            + (orders.length ? '<div class="admin-order-list">' + orders.map((order) => {
                const allowed = order.status === "PENDING" ? ["PROCESSING", "CANCELLED"]
                    : order.status === "PROCESSING" ? ["COMPLETED", "CANCELLED"] : [];
                const statusControl = allowed.length
                    ? '<div class="admin-order-status"><label for="orderStatus' + order.id + '">Trạng thái:</label>'
                        + '<select id="orderStatus' + order.id + '" data-order-status="' + order.id + '">'
                        + allowed.map((status) => '<option value="' + status + '">' + escapeHtml(orderStatusLabel(status)) + '</option>').join("")
                        + '</select><button class="admin-inline-button" type="button" data-order-update="' + order.id + '">Lưu</button></div>'
                    : '<span class="admin-status-badge ' + String(order.status || "").toLowerCase() + '">' + escapeHtml(orderStatusLabel(order.status)) + '</span>';
                return '<article class="admin-order-card"><div class="admin-order-top"><div><span class="admin-order-number">Đơn #' + escapeHtml(order.id)
                    + '</span><h3>' + escapeHtml(order.customerName || "Khách hàng") + '</h3></div><span class="admin-status-badge '
                    + String(order.status || "").toLowerCase() + '">' + escapeHtml(orderStatusLabel(order.status)) + '</span></div>'
                    + '<div class="admin-order-meta"><span>📞 ' + escapeHtml(order.phone || "Chưa có SĐT") + '</span><span>🕒 '
                    + escapeHtml(orderDate(order.createdAt)) + '</span><span class="admin-order-address">📍 ' + escapeHtml(order.address || "Chưa có địa chỉ") + '</span></div>'
                    + '<div class="admin-order-payment">Thanh toán: ' + escapeHtml(paymentMethodLabel(order.paymentMethod)) + '</div>'
                    + '<div class="admin-order-items">' + ((order.items || []).map((item) =>
                        '<div><span>' + escapeHtml(item.product?.name || "Sản phẩm") + ' × ' + (Number(item.quantity) || 0)
                        + '</span><strong>' + formatMoney(Number(item.unitPrice || item.product?.price || 0) * Number(item.quantity || 0)) + '</strong></div>'
                    ).join("") || '<span>Đơn chưa có sản phẩm.</span>') + '</div>'
                    + '<div class="admin-order-bottom"><div><span>Tổng đơn hàng:</span><strong>' + formatMoney(order.totalAmount) + '</strong></div>'
                    + statusControl + '</div></article>';
            }).join("") + '</div>' : '<div class="admin-message"><strong>Chưa có đơn hàng</strong><p>Đơn hàng mới từ khách sẽ xuất hiện ở đây.</p></div>')
            + pagination;
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
            + (editing ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới") + '</strong><button class="admin-text-button" type="button" data-admin-cancel>Đóng</button></div>'
            + (locked ? '<p class="admin-form-hint">Cần tạo ít nhất một danh mục và một thương hiệu trước khi thêm sản phẩm.</p>' : "")
            + '<div class="admin-form-grid"><label>Tên sản phẩm *<input name="name" required maxlength="255" value="' + escapeHtml(editing?.name || "") + '"></label>'
            + '<label>Giá bán (₫) *<input name="price" type="number" min="0.01" step="0.01" required value="' + escapeHtml(editing?.price ?? "") + '"></label>'
            + '<label>Số lượng tồn kho *<input name="stock" type="number" min="0" step="1" required value="' + escapeHtml(editing?.stock ?? 0) + '"></label>'
            + '<label>Danh mục *<select name="categoryId" required>' + categoryOptions + '</select></label>'
            + '<label>Thương hiệu *<select name="brandId" required>' + brandOptions + '</select></label>'
            + '<label>Đường dẫn hình ảnh<input name="imageUrl" type="text" placeholder="https://... hoặc assets/..." value="' + escapeHtml(editing?.imageUrl || "") + '"></label>'
            + '<label class="admin-form-wide">Mô tả sản phẩm<textarea name="description" rows="3">' + escapeHtml(editing?.description || "") + '</textarea></label></div>'
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
        return adminHeading("Quản lý sản phẩm", "Cập nhật giá, số lượng tồn kho và thông tin sản phẩm.", "Thêm sản phẩm", "product")
            + (state.adminEditing?.type === "product" ? renderAdminProductForm() : "")
            + (rows ? '<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Mã</th><th>Sản phẩm</th><th>Giá bán</th><th>Tồn kho</th><th>Thao tác</th></tr></thead><tbody>' + rows + '</tbody></table></div>'
                : '<div class="admin-message"><strong>Chưa có sản phẩm</strong><p>Tạo sản phẩm đầu tiên để bắt đầu bán hàng.</p></div>');
    }

    function renderAdminCategoryForm() {
        const editing = state.adminEditing?.type === "category"
            ? state.admin.categories.find((item) => item.id === state.adminEditing.id) : null;
        return '<form class="admin-form admin-compact-form" id="adminCategoryForm"><div class="admin-form-title"><strong>'
            + (editing ? "Cập nhật danh mục" : "Thêm danh mục mới") + '</strong><button class="admin-text-button" type="button" data-admin-cancel>Đóng</button></div>'
            + '<div class="admin-form-grid"><label>Tên danh mục *<input name="name" required maxlength="100" value="' + escapeHtml(editing?.name || "") + '"></label>'
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
        return adminHeading("Danh mục", "Tổ chức nhóm sản phẩm để khách hàng dễ dàng tìm kiếm.", "Thêm danh mục", "category")
            + (state.adminEditing?.type === "category" ? renderAdminCategoryForm() : "")
            + (cards ? '<div class="admin-entity-list">' + cards + '</div>' : '<div class="admin-message"><strong>Chưa có danh mục</strong><p>Thêm danh mục trước khi tạo sản phẩm.</p></div>');
    }

    function renderAdminBrandForm() {
        const editing = state.adminEditing?.type === "brand"
            ? state.admin.brands.find((item) => item.id === state.adminEditing.id) : null;
        return '<form class="admin-form admin-compact-form" id="adminBrandForm"><div class="admin-form-title"><strong>'
            + (editing ? "Cập nhật thương hiệu" : "Thêm thương hiệu mới") + '</strong><button class="admin-text-button" type="button" data-admin-cancel>Đóng</button></div>'
            + '<div class="admin-form-grid"><label>Tên thương hiệu *<input name="name" required maxlength="100" value="' + escapeHtml(editing?.name || "") + '"></label>'
            + '<label>Quốc gia *<input name="country" required maxlength="100" value="' + escapeHtml(editing?.country || "") + '"></label>'
            + '<label class="admin-form-wide">Logo (URL ảnh) *<input name="logo" required maxlength="255" value="' + escapeHtml(editing?.logo || "") + '"></label></div>'
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
        return adminHeading("Thương hiệu", "Quản lý đối tác và hãng sản xuất hiển thị trong cửa hàng.", "Thêm thương hiệu", "brand")
            + (state.adminEditing?.type === "brand" ? renderAdminBrandForm() : "")
            + (cards ? '<div class="admin-entity-list">' + cards + '</div>' : '<div class="admin-message"><strong>Chưa có thương hiệu</strong><p>Thêm thương hiệu trước khi tạo sản phẩm.</p></div>');
    }

    function renderAdminMemberships() {
        const cards = state.admin.memberships.map((membership) =>
            '<article class="admin-membership-card"><span class="admin-membership-icon">' + icon("award", 22) + '</span><div><span class="admin-id">HẠNG #' + escapeHtml(membership.id)
            + '</span><h3>' + escapeHtml(membership.name) + '</h3><p>' + Number(membership.requiredPoints || 0) + ' điểm để đạt hạng này</p></div>'
            + '<strong>' + Number(membership.discountPercent || 0) + '%<small> ưu đãi</small></strong></article>'
        ).join("");
        return adminHeading("Hạng thành viên", "Quy định mức điểm tích lũy và quyền lợi chiết khấu trong hệ thống.", "", "")
            + (cards ? '<div class="admin-membership-list">' + cards + '</div>' : '<div class="admin-message"><strong>Không tải được hạng thành viên</strong><p>Hãy kiểm tra kết nối rồi tải lại trang.</p></div>');
    }

    function renderAdminUsers() {
        const page = state.admin.users;
        const users = page?.content || [];
        const currentUserName = window.emarketApi.getUserName();
        const roles = ["CUSTOMER", "MEMBER", "ADMIN"];
        const roleLabels = { CUSTOMER: "Khách hàng", MEMBER: "Thành viên", ADMIN: "Quản trị viên" };
        const rows = users.map((user) => {
            const isCurrentUser = currentUserName && user.userName === currentUserName;
            const roleControl = isCurrentUser
                ? '<span class="admin-user-current">Tài khoản đang dùng</span>'
                : '<div class="admin-user-role-control"><select aria-label="Vai trò của ' + escapeHtml(user.userName) + '" data-user-role-select="' + user.id + '">'
                    + roles.map((role) => '<option value="' + role + '"' + (user.role === role ? " selected" : "") + '>' + roleLabels[role] + '</option>').join("")
                    + '</select><button class="admin-inline-button" type="button" data-user-role-update="' + user.id + '">Lưu</button></div>';
            const contact = [user.email, user.phone].filter(Boolean).map(escapeHtml).join("<br>") || "Chưa cập nhật";
            const membership = user.membership?.name || "Chưa có hạng";

            return '<tr><td class="admin-id">#' + escapeHtml(user.id) + '</td>'
                + '<td><div class="admin-user-name"><strong>' + escapeHtml(user.fullName || "Chưa có họ tên") + '</strong>'
                + '<small>@' + escapeHtml(user.userName || "") + '</small></div></td>'
                + '<td class="admin-user-contact">' + contact + '</td>'
                + '<td>' + escapeHtml(membership) + '</td><td>' + Number(user.points || 0).toLocaleString("vi-VN") + '</td>'
                + '<td>' + roleControl + '</td></tr>';
        }).join("");
        const totalPages = Number(page?.totalPages || 0);
        const currentPage = Number(page?.number || 0);
        const pagination = totalPages > 1
            ? '<div class="admin-user-pagination"><button class="admin-inline-button" type="button" data-user-page="' + (currentPage - 1) + '"'
                + (page.first ? " disabled" : "") + '>Trước</button><span>Trang ' + (currentPage + 1) + ' / ' + totalPages + ' · '
                + Number(page.totalElements || 0).toLocaleString("vi-VN") + ' người dùng</span><button class="admin-inline-button" type="button" data-user-page="'
                + (currentPage + 1) + '"' + (page.last ? " disabled" : "") + '>Tiếp</button></div>'
            : '<p class="admin-user-count">' + Number(page?.totalElements || 0).toLocaleString("vi-VN") + ' người dùng</p>';

        return adminHeading("Quản lý người dùng", "Xem danh sách tài khoản, điểm thưởng và phân quyền hệ thống.", "", "")
            + (users.length
                ? '<div class="admin-table-wrap"><table class="admin-table admin-user-table"><thead><tr><th>Mã</th><th>Người dùng</th><th>Liên hệ</th><th>Hạng</th><th>Điểm</th><th>Vai trò</th></tr></thead><tbody>' + rows + '</tbody></table></div>'
                    + pagination
                : '<div class="admin-message"><strong>Chưa có người dùng</strong><p>Tài khoản đã đăng ký sẽ xuất hiện ở đây.</p></div>');
    }

    async function loadAdminData(orderPage = state.admin.ordersPage) {
        state.admin.error = "";
        nodes.adminContent.innerHTML = '<div class="admin-message"><span class="admin-spinner"></span><p>Đang tải dữ liệu quản trị…</p></div>';
        try {
            const [orders, products, categories, brands, memberships, users] = await Promise.all([
                window.emarketApi.getAllOrders(orderPage, 10),
                window.emarketApi.getProducts(),
                window.emarketApi.getCategories(),
                window.emarketApi.getBrands(),
                window.emarketApi.getMemberships(),
                window.emarketApi.getUsers(state.admin.usersPage, 20)
            ]);
            state.admin.orders = orders.content || [];
            state.admin.ordersPage = Number(orders.number || 0);
            state.admin.ordersPageInfo = orders;
            state.admin.products = products;
            state.admin.categories = categories;
            state.admin.brands = brands;
            state.admin.memberships = memberships;
            state.admin.users = users;
        } catch (error) {
            state.admin.error = error.message || "Vui lòng kiểm tra kết nối hoặc quyền quản trị.";
        }
        renderAdminDashboard();
    }

    async function loadAdminUsers(pageNumber) {
        state.admin.usersPage = Math.max(0, Number(pageNumber) || 0);
        state.admin.error = "";
        nodes.adminContent.innerHTML = '<div class="admin-message"><span class="admin-spinner"></span><p>Đang tải danh sách người dùng…</p></div>';
        try {
            state.admin.users = await window.emarketApi.getUsers(state.admin.usersPage, 20);
        } catch (error) {
            state.admin.error = error.message || "Không thể tải danh sách người dùng.";
        }
        renderAdminDashboard();
    }

    function openAdmin() {
        if (!window.emarketApi.getToken()) {
            showToast("Đăng nhập tài khoản quản trị để tiếp tục.", "info");
            openAuth("login");
            return;
        }
        if (window.emarketApi.getRole() !== "ADMIN") {
            showToast("Tài khoản hiện tại không có quyền quản trị.", "error");
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
                    showToast("Đã cập nhật sản phẩm thành công.", "success");
                } else {
                    await window.emarketApi.createProduct(payload);
                    showToast("Đã tạo sản phẩm mới thành công.", "success");
                }
            } else if (form.id === "adminCategoryForm") {
                const payload = { name: values.name.trim(), description: values.description.trim() };
                if (state.adminEditing?.type === "category" && state.adminEditing.id != null) {
                    await window.emarketApi.updateCategory(state.adminEditing.id, payload);
                    showToast("Đã cập nhật danh mục thành công.", "success");
                } else {
                    await window.emarketApi.createCategory(payload);
                    showToast("Đã tạo danh mục mới thành công.", "success");
                }
            } else if (form.id === "adminBrandForm") {
                const payload = { name: values.name.trim(), country: values.country.trim(), logo: values.logo.trim() };
                if (state.adminEditing?.type === "brand" && state.adminEditing.id != null) {
                    await window.emarketApi.updateBrand(state.adminEditing.id, payload);
                    showToast("Đã cập nhật thương hiệu thành công.", "success");
                } else {
                    await window.emarketApi.createBrand(payload);
                    showToast("Đã tạo thương hiệu mới thành công.", "success");
                }
            }
            state.adminEditing = null;
            await loadAdminData();
            if (form.id === "adminProductForm" || form.id === "adminCategoryForm" || form.id === "adminBrandForm") await loadProducts();
        } catch (error) {
            showToast("Không thể lưu: " + error.message, "error");
        }
    }

    async function deleteAdminItem(type, id) {
        const item = type === "product" ? state.admin.products.find((entry) => entry.id === id)
            : type === "category" ? state.admin.categories.find((entry) => entry.id === id)
                : state.admin.brands.find((entry) => entry.id === id);
        const label = item?.name || ("#" + id);
        if (!window.confirm("Xác nhận xóa " + label + "?")) return;
        try {
            if (type === "product") await window.emarketApi.deleteProduct(id);
            if (type === "category") await window.emarketApi.deleteCategory(id);
            if (type === "brand") await window.emarketApi.deleteBrand(id);
            showToast("Đã xóa " + label + ".", "info");
            await loadAdminData();
            await loadProducts();
        } catch (error) {
            showToast("Không thể xóa: " + error.message, "error");
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
            if (pending.length) showToast("Một số sản phẩm chưa đồng bộ được vào tài khoản. Hãy kiểm tra lại tồn kho.", "info");
        } catch (error) {
            showToast(`Không thể tải giỏ hàng tài khoản: ${error.message}`, "error");
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
        const userName = window.emarketApi.getUserName();
        const role = window.emarketApi.getRole();
        const isAdmin = signedIn && role === "ADMIN";

        if (nodes.accountLabel) {
            nodes.accountLabel.textContent = signedIn ? (userName ? `@${userName}` : "Tài khoản") : "Tài khoản";
        }
        if (nodes.accountSubLabel) {
            nodes.accountSubLabel.textContent = signedIn ? profileRoleLabel(role) : "Đăng nhập";
        }
        if (nodes.accountAvatarWrap) {
            nodes.accountAvatarWrap.innerHTML = signedIn && userName
                ? `<span class="user-init-avatar">${escapeHtml(userName.slice(0, 2).toUpperCase())}</span>`
                : `<i data-lucide="user"></i>`;
        }

        if (nodes.dropdownUserHeader) {
            nodes.dropdownUserHeader.classList.toggle("hidden", !signedIn);
            if (nodes.dropdownUserName) nodes.dropdownUserName.textContent = userName ? `@${userName}` : "Tài khoản";
            if (nodes.dropdownUserRole) nodes.dropdownUserRole.textContent = profileRoleLabel(role);
        }

        document.querySelectorAll("[data-auth-open]").forEach((button) => button.classList.toggle("hidden", signedIn));
        if (nodes.myProfileButton) nodes.myProfileButton.classList.toggle("hidden", !signedIn);
        if (nodes.myOrdersButton) nodes.myOrdersButton.classList.toggle("hidden", !signedIn);
        if (nodes.adminButton) nodes.adminButton.classList.toggle("hidden", !isAdmin);
        if (nodes.logoutButton) nodes.logoutButton.classList.toggle("hidden", !signedIn);

        if (!signedIn && state.view === "profile") setView("listing");
        if (!isAdmin && state.view === "admin") setView("listing");
        refreshIcons();
    }

    async function handleAuthSubmit(event, type) {
        event.preventDefault();
        const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
        try {
            if (type === "login") {
                await window.emarketApi.login(payload);
                showToast("Đăng nhập thành công! Chào mừng bạn trở lại.", "success");
            } else {
                await window.emarketApi.register(payload);
                showToast("Đăng ký tài khoản thành công!", "success");
            }
            updateAccountState();
            closeAuth();
            await loadAccountCart();
            renderReviewForm();
            renderReviewList();
        } catch (error) {
            showToast(`${type === "login" ? "Đăng nhập" : "Đăng ký"} thất bại: ${error.message}`, "error");
        }
    }

    function runSearch(value) {
        state.query = value.trim();
        state.productsPage = 0;
        if (nodes.searchInput) nodes.searchInput.value = state.query;
        if (nodes.searchClearButton) {
            nodes.searchClearButton.classList.toggle("hidden", !state.query);
        }
        setView("catalog");
        renderProducts();
        const target = $("#products");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function resetAllFilters() {
        state.query = "";
        state.filter = "all";
        state.categoryFilter = "";
        state.brandFilter = "";
        state.priceFilter = "all";
        state.sortFilter = "default";
        state.productsPage = 0;

        if (nodes.searchInput) nodes.searchInput.value = "";
        if (nodes.searchClearButton) nodes.searchClearButton.classList.add("hidden");
        if (nodes.filterCategory) nodes.filterCategory.value = "";
        if (nodes.filterBrand) nodes.filterBrand.value = "";
        if (nodes.filterPrice) nodes.filterPrice.value = "all";
        if (nodes.filterSort) nodes.filterSort.value = "default";

        document.querySelectorAll(".tab").forEach((tab) => {
            tab.classList.toggle("active", tab.dataset.filter === "all");
        });

        renderProducts();
    }

    function bindEvents() {
        // Document delegation for all clickable elements
        document.addEventListener("click", (event) => {
            const homeNavigation = event.target.closest("[data-show-home]");
            if (homeNavigation) {
                event.preventDefault();
                showHome(homeNavigation.dataset.homeTarget || null);
                return;
            }

            const catalogNavigation = event.target.closest("[data-open-catalog]");
            if (catalogNavigation) {
                event.preventDefault();
                showCatalog(catalogNavigation.dataset.catalogTarget || "products");
                return;
            }

            const cancelOrderButton = event.target.closest("[data-cancel-order]");
            if (cancelOrderButton) {
                void cancelCustomerOrder(cancelOrderButton);
                return;
            }

            const filter = event.target.closest("[data-filter]");
            const pageButton = event.target.closest("[data-products-page]");
            const detail = event.target.closest("[data-detail]");
            const add = event.target.closest("[data-add]");
            const search = event.target.closest("[data-menu-search]");
            const categoryFilter = event.target.closest("[data-category-filter]");
            const authOpen = event.target.closest("[data-auth-open]");
            const buyNow = event.target.closest("[data-buy-now]");
            const retryProducts = event.target.closest("[data-retry-products]");
            const removeFilter = event.target.closest("[data-remove-filter]");
            const clearAllFilters = event.target.closest("#clearAllFiltersBtn") || event.target.closest("#emptyResetFilterBtn");
            const continueShopping = event.target.closest("#cartContinueShopBtn");

            if (continueShopping) closeCart();

            if (retryProducts) void loadProducts();

            if (clearAllFilters) resetAllFilters();

            if (removeFilter) {
                const target = removeFilter.dataset.removeFilter;
                if (target === "query") {
                    state.query = "";
                    if (nodes.searchInput) nodes.searchInput.value = "";
                    if (nodes.searchClearButton) nodes.searchClearButton.classList.add("hidden");
                } else if (target === "category") {
                    state.categoryFilter = "";
                    if (nodes.filterCategory) nodes.filterCategory.value = "";
                } else if (target === "brand") {
                    state.brandFilter = "";
                    if (nodes.filterBrand) nodes.filterBrand.value = "";
                } else if (target === "price") {
                    state.priceFilter = "all";
                    if (nodes.filterPrice) nodes.filterPrice.value = "all";
                }
                state.productsPage = 0;
                renderProducts();
            }

            if (filter) {
                state.filter = filter.dataset.filter;
                state.productsPage = 0;
                document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab === filter));
                renderProducts();
            }

            if (pageButton && !pageButton.disabled) {
                state.productsPage = Number(pageButton.dataset.productsPage);
                renderProducts();
                const target = $("#products");
                if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
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

            if (search) {
                if (nodes.catalogPanel) nodes.catalogPanel.classList.remove("open");
                runSearch(search.dataset.menuSearch);
            }

            if (categoryFilter) {
                state.categoryFilter = categoryFilter.dataset.categoryFilter;
                state.query = "";
                state.filter = "all";
                state.brandFilter = "";
                state.priceFilter = "all";
                state.sortFilter = "default";
                state.productsPage = 0;
                if (nodes.searchInput) nodes.searchInput.value = "";
                if (nodes.searchClearButton) nodes.searchClearButton.classList.add("hidden");
                if (nodes.filterCategory) nodes.filterCategory.value = state.categoryFilter;
                if (nodes.filterBrand) nodes.filterBrand.value = "";
                if (nodes.filterPrice) nodes.filterPrice.value = "all";
                if (nodes.filterSort) nodes.filterSort.value = "default";
                document.querySelectorAll(".tab").forEach((tab) => {
                    tab.classList.toggle("active", tab.dataset.filter === "all");
                });
                if (nodes.catalogPanel) nodes.catalogPanel.classList.remove("open");
                setView("catalog");
                renderProducts();
                const target = $("#products");
                if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
            }

            if (authOpen) openAuth(authOpen.dataset.authOpen);
        });

        // Search Input & Clear
        if (nodes.searchInput) {
            nodes.searchInput.addEventListener("input", () => {
                if (nodes.searchClearButton) {
                    nodes.searchClearButton.classList.toggle("hidden", !nodes.searchInput.value);
                }
            });
        }

        if (nodes.searchClearButton) {
            nodes.searchClearButton.addEventListener("click", () => {
                nodes.searchInput.value = "";
                nodes.searchClearButton.classList.add("hidden");
                runSearch("");
            });
        }

        if (nodes.searchForm) {
            nodes.searchForm.addEventListener("submit", (event) => {
                event.preventDefault();
                runSearch(nodes.searchInput.value);
            });
        }

        // Dropdown Filters
        if (nodes.filterCategory) {
            nodes.filterCategory.addEventListener("change", (event) => {
                state.categoryFilter = event.target.value;
                state.productsPage = 0;
                renderProducts();
            });
        }

        if (nodes.filterBrand) {
            nodes.filterBrand.addEventListener("change", (event) => {
                state.brandFilter = event.target.value;
                state.productsPage = 0;
                renderProducts();
            });
        }

        if (nodes.filterPrice) {
            nodes.filterPrice.addEventListener("change", (event) => {
                state.priceFilter = event.target.value;
                state.productsPage = 0;
                renderProducts();
            });
        }

        if (nodes.filterSort) {
            nodes.filterSort.addEventListener("change", (event) => {
                state.sortFilter = event.target.value;
                state.productsPage = 0;
                renderProducts();
            });
        }

        if (nodes.resetFilterBtn) {
            nodes.resetFilterBtn.addEventListener("click", resetAllFilters);
        }

        // Product Detail Events
        if (nodes.productDetail) {
            nodes.productDetail.addEventListener("click", (event) => {
                const qty = event.target.closest("[data-qty]");
                const editReview = event.target.closest("[data-edit-review]");
                const deleteReview = event.target.closest("[data-delete-review]");

                if (event.target.closest("#backToProducts")) {
                    setView("catalog");
                    const target = $("#products");
                    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
                }

                if (event.target.closest("#breadcrumbHome")) showHome();

                if (qty && state.selectedProduct) {
                    state.quantity = Math.min(state.selectedProduct.stock, Math.max(1, state.quantity + Number(qty.dataset.qty)));
                    const detailQtyInput = $("#detailQuantity");
                    if (detailQtyInput) detailQtyInput.value = state.quantity;
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
                            showToast("Đã xóa đánh giá thành công.", "info");
                            await loadProductReviews(state.selectedProduct.id);
                        } catch (error) {
                            showToast(`Không thể xóa đánh giá: ${error.message}`, "error");
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
        }

        // Cart Drawer Events
        if (nodes.cartItems) {
            nodes.cartItems.addEventListener("click", (event) => {
                const change = event.target.closest("[data-cart-change]");
                const remove = event.target.closest("[data-cart-remove]");
                if (change) changeCartQuantity(change.dataset.cartChange, change.dataset.delta);
                if (remove) removeCartItem(remove.dataset.cartRemove);
            });
        }

        if (nodes.cartButton) nodes.cartButton.addEventListener("click", openCart);
        if (nodes.closeCart) nodes.closeCart.addEventListener("click", closeCart);
        if (nodes.cartBackdrop) nodes.cartBackdrop.addEventListener("click", closeCart);

        // Checkout Events
        if (nodes.checkoutButton) nodes.checkoutButton.addEventListener("click", showCheckout);
        if (nodes.closeCheckout) nodes.closeCheckout.addEventListener("click", closeCheckout);
        if (nodes.checkoutBackdrop) nodes.checkoutBackdrop.addEventListener("click", closeCheckout);
        if (nodes.checkoutForm) nodes.checkoutForm.addEventListener("submit", handleCheckoutSubmit);

        // Profile Events
        if (nodes.profileForm) nodes.profileForm.addEventListener("submit", handleProfileSubmit);
        if (nodes.changePasswordForm) nodes.changePasswordForm.addEventListener("submit", handleChangePasswordSubmit);
        if (nodes.profileResetButton) nodes.profileResetButton.addEventListener("click", resetProfileForm);
        if (nodes.profileRetryButton) nodes.profileRetryButton.addEventListener("click", () => void loadProfile());
        if (nodes.profileBackButton) {
            nodes.profileBackButton.addEventListener("click", () => {
                setView("listing");
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }

        // Account / Auth Events
        if (nodes.accountButton) {
            nodes.accountButton.addEventListener("click", () => {
                if (window.emarketApi.getToken()) void showProfile();
                else openAuth("login");
            });
        }

        if (nodes.heroLoginButton) nodes.heroLoginButton.addEventListener("click", () => openAuth("login"));
        if (nodes.closeAuth) nodes.closeAuth.addEventListener("click", closeAuth);
        if (nodes.authBackdrop) nodes.authBackdrop.addEventListener("click", closeAuth);
        document.querySelectorAll("[data-auth-tab]").forEach((button) => {
            button.addEventListener("click", () => setAuthTab(button.dataset.authTab));
        });

        if (nodes.loginForm) nodes.loginForm.addEventListener("submit", (event) => handleAuthSubmit(event, "login"));
        if (nodes.registerForm) nodes.registerForm.addEventListener("submit", (event) => handleAuthSubmit(event, "register"));
        if (nodes.myProfileButton) nodes.myProfileButton.addEventListener("click", () => void showProfile());
        if (nodes.myOrdersButton) nodes.myOrdersButton.addEventListener("click", showMyOrders);
        if (nodes.logoutButton) {
            nodes.logoutButton.addEventListener("click", () => {
                void (async () => {
                    let logoutError = null;
                    try {
                        await window.emarketApi.logout();
                    } catch (error) {
                        logoutError = error;
                    }

                    state.cart = [];
                    restoreGuestCart();
                    updateAccountState();
                    renderReviewForm();
                    renderReviewList();
                    showToast(
                        logoutError
                            ? "Đã đăng xuất trên trình duyệt, nhưng chưa thể xác nhận thu hồi phiên trên máy chủ."
                            : "Bạn đã đăng xuất thành công.",
                        logoutError ? "error" : "info"
                    );
                });
            });
        }

        // Orders Modal
        if (nodes.closeOrders) nodes.closeOrders.addEventListener("click", closeOrders);
        if (nodes.ordersBackdrop) nodes.ordersBackdrop.addEventListener("click", closeOrders);
        if (nodes.orderLookupButton) nodes.orderLookupButton.addEventListener("click", () => showOrderLookup());
        if (nodes.orderTrackingForm) nodes.orderTrackingForm.addEventListener("submit", (event) => void handleOrderTrackingSubmit(event));

        // Catalog Panel
        if (nodes.catalogToggle && nodes.catalogPanel) {
            nodes.catalogToggle.addEventListener("click", () => nodes.catalogPanel.classList.add("open"));
        }
        if (nodes.closeCatalog && nodes.catalogPanel) {
            nodes.closeCatalog.addEventListener("click", () => nodes.catalogPanel.classList.remove("open"));
        }

        // Scroll to top
        if (nodes.scrollTopButton) {
            nodes.scrollTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
            window.addEventListener("scroll", () => {
                if (window.scrollY > 400) {
                    nodes.scrollTopButton.classList.add("visible");
                } else {
                    nodes.scrollTopButton.classList.remove("visible");
                }
            });
        }

        // Mobile Bottom Nav
        if (nodes.mobNavCatalog) {
            nodes.mobNavCatalog.addEventListener("click", () => {
                if (nodes.catalogPanel) nodes.catalogPanel.classList.add("open");
            });
        }
        if (nodes.mobNavSearch) {
            nodes.mobNavSearch.addEventListener("click", () => {
                setView("catalog");
                if (nodes.searchInput) {
                    nodes.searchInput.focus();
                    nodes.searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            });
        }
        if (nodes.mobNavCart) nodes.mobNavCart.addEventListener("click", openCart);
        if (nodes.mobNavAccount) {
            nodes.mobNavAccount.addEventListener("click", () => {
                if (window.emarketApi.getToken()) void showProfile();
                else openAuth("login");
            });
        }

        // Admin Management
        if (nodes.adminButton) nodes.adminButton.addEventListener("click", openAdmin);
        if (nodes.backToStore) {
            nodes.backToStore.addEventListener("click", () => {
                setView("listing");
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }
        if (nodes.adminRefresh) nodes.adminRefresh.addEventListener("click", () => void loadAdminData());
        if (nodes.adminTabs) {
            nodes.adminTabs.addEventListener("click", (event) => {
                const tab = event.target.closest("[data-admin-tab]");
                if (!tab) return;
                state.adminTab = tab.dataset.adminTab;
                state.adminEditing = null;
                renderAdminDashboard();
            });
        }

        if (nodes.adminContent) {
            nodes.adminContent.addEventListener("click", async (event) => {
                if (event.target.closest("[data-admin-retry]")) {
                    await loadAdminData();
                    return;
                }
                const userPageButton = event.target.closest("[data-user-page]");
                if (userPageButton && !userPageButton.disabled) {
                    await loadAdminUsers(Number(userPageButton.dataset.userPage));
                    return;
                }
                const orderPageButton = event.target.closest("[data-order-page]");
                if (orderPageButton && !orderPageButton.disabled) {
                    await loadAdminData(Number(orderPageButton.dataset.orderPage));
                    return;
                }
                const updateUserRoleButton = event.target.closest("[data-user-role-update]");
                if (updateUserRoleButton) {
                    const userId = Number(updateUserRoleButton.dataset.userRoleUpdate);
                    const roleSelect = nodes.adminContent.querySelector('[data-user-role-select="' + userId + '"]');
                    const user = state.admin.users?.content?.find((item) => Number(item.id) === userId);
                    if (!roleSelect || !user || roleSelect.value === user.role) {
                        showToast("Chưa có thay đổi vai trò.", "info");
                        return;
                    }

                    updateUserRoleButton.disabled = true;
                    updateUserRoleButton.textContent = "Đang lưu…";
                    try {
                        await window.emarketApi.updateUserRole(userId, roleSelect.value);
                        showToast("Đã cập nhật vai trò người dùng thành công.", "success");
                        await loadAdminUsers(state.admin.users?.number || 0);
                    } catch (error) {
                        showToast("Không thể cập nhật vai trò: " + error.message, "error");
                        updateUserRoleButton.disabled = false;
                        updateUserRoleButton.textContent = "Lưu";
                    }
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
                        showToast("Đã cập nhật trạng thái đơn hàng.", "success");
                        await loadAdminData();
                    } catch (error) {
                        showToast("Không thể cập nhật đơn hàng: " + error.message, "error");
                        updateOrderButton.disabled = false;
                    }
                }
            });

            nodes.adminContent.addEventListener("submit", (event) => {
                void submitAdminForm(event);
            });
        }

        // Close drawers / modals on Escape key
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeCart();
                closeCheckout();
                closeAuth();
                closeOrders();
                if (nodes.catalogPanel) nodes.catalogPanel.classList.remove("open");
            }
        });
    }

    async function loadProducts() {
        const status = nodes.dataStatus || $("#dataStatus");
        if (status) status.innerHTML = `<div class="loading-inline"><div class="admin-spinner"></div> <span>Đang nạp dữ liệu sản phẩm từ hệ thống...</span></div>`;
        refreshIcons();

        try {
            state.products = await window.emarketApi.getProducts();
            if (status) status.textContent = state.products.length ? "" : "Chưa có sản phẩm trong hệ thống.";
        } catch (error) {
            state.products = [];
            if (status) {
                status.innerHTML = `
                    <div class="error-notice">
                        <i data-lucide="alert-circle"></i>
                        <span>Không thể tải sản phẩm: ${escapeHtml(error.message)}</span>
                        <button class="admin-inline-button" type="button" data-retry-products>
                            <i data-lucide="refresh-cw"></i> Thử lại
                        </button>
                    </div>
                `;
            }
        }

        try {
            const [categories, brands] = await Promise.all([
                window.emarketApi.getCategories(),
                window.emarketApi.getBrands()
            ]);
            state.categories = categories || [];
            state.brands = brands || [];
        } catch (error) {
            state.categories = [...new Map(state.products
                .filter((p) => p.category?.id != null)
                .map((p) => [p.category.id, p.category])).values()];
            state.brands = [...new Map(state.products
                .filter((p) => p.brand?.id != null)
                .map((p) => [p.brand.id, p.brand])).values()];
        }

        renderCategories();
        renderCategoryMenus();
        renderBrandFilters();
        renderProducts();
        renderDeal();
        renderCategorySections();
        refreshIcons();
    }

    async function init() {
        bindEvents();
        initHeroCarousel();
        renderCart();
        updateAccountState();
        await loadProducts();
        restoreGuestCart();
        if (window.emarketApi.getToken()) await loadAccountCart();
        refreshIcons();
    }

    init();
})();
