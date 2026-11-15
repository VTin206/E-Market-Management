(function () {
    const storageKey = "emarket_access_token";
    const userNameKey = "emarket_user_name";
    const userRoleKey = "emarket_user_role";
    const apiBase = (window.EMARKET_API_BASE || (window.location.protocol === "file:" ? "http://localhost:8080" : "")).replace(/\/+$/, "");
    let refreshInFlight = null;
    let accessToken = null;
    let cachedUserName = null;
    let cachedUserRole = null;

    // Access tokens are intentionally kept in memory; clear legacy persisted session data.
    localStorage.removeItem(storageKey);
    localStorage.removeItem(userNameKey);
    localStorage.removeItem(userRoleKey);

    function getToken() {
        return accessToken;
    }

    function setToken(token) {
        accessToken = token || null;
    }

    function clearToken() {
        accessToken = null;
        cachedUserName = null;
        cachedUserRole = null;
        // Remove tokens written by older versions of the storefront.
        localStorage.removeItem(storageKey);
        localStorage.removeItem(userNameKey);
        localStorage.removeItem(userRoleKey);
    }

    function setUserName(userName) {
        cachedUserName = userName || null;
    }

    async function responseError(response) {
        let message = `Request failed: ${response.status}`;
        try {
            const body = await response.json();
            message = body.detail || body.message || body.error || message;
        } catch (error) {
            message = response.statusText || message;
        }
        return new Error(message);
    }

    function isAuthSessionEndpoint(path) {
        return [
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/refresh",
            "/api/auth/logout",
            "/api/auth/forgot-password",
            "/api/auth/reset-password"
        ].includes(path);
    }

    async function refreshAccessToken(accessTokenAtFailure) {
        if (!refreshInFlight) {
            const performRefresh = async () => {
                const latestAccessToken = getToken();
                if (latestAccessToken && latestAccessToken !== accessTokenAtFailure) {
                    return { accessToken: latestAccessToken };
                }

                const response = await fetch(`${apiBase}/api/auth/refresh`, {
                    method: "POST",
                    credentials: "include"
                });

                if (!response.ok) throw await responseError(response);

                const data = await response.json();
                if (!data.accessToken) throw new Error("Không nhận được access token mới.");

                setToken(data.accessToken);
                if (data.role) cachedUserRole = data.role;
                return data;
            };

            const refreshRequest = typeof navigator !== "undefined" && navigator.locks?.request
                ? navigator.locks.request("emarket-auth-refresh", performRefresh)
                : performRefresh();

            refreshInFlight = Promise.resolve(refreshRequest).finally(() => {
                refreshInFlight = null;
            });
        }

        return refreshInFlight;
    }

    async function restoreSession() {
        try {
            await refreshAccessToken(null);
            return true;
        } catch (error) {
            clearToken();
            return false;
        }
    }

    async function request(path, options = {}, allowRefresh = true) {
        const headers = {
            ...(options.headers || {})
        };
        const token = getToken();

        if (options.body) {
            headers["Content-Type"] = "application/json";
        }

        if (token && path !== "/api/auth/refresh" && path !== "/api/auth/logout") {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${apiBase}${path}`, {
            ...options,
            headers,
            credentials: options.credentials || "include"
        });

        if (response.status === 401 && allowRefresh && token && !isAuthSessionEndpoint(path)) {
            try {
                await refreshAccessToken(token);
            } catch (error) {
                if (getToken() === token) clearToken();
                throw error;
            }
            return request(path, options, false);
        }

        if (!response.ok) {
            throw await responseError(response);
        }

        if (response.status === 204) {
            return null;
        }

        return response.json();
    }

    function normalizeProduct(product) {
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: Number(product.price || 0),
            stock: product.stock,
            imageUrl: product.imageUrl,
            category: product.category || null,
            brand: product.brand || null
        };
    }

    function normalizeCart(cart) {
        return {
            ...cart,
            items: (cart?.items || []).map((item) => ({
                ...item,
                id: String(item.id),
                quantity: Number(item.quantity || 0),
                product: normalizeProduct(item.product),
                local: false
            }))
        };
    }

    window.emarketApi = {
        getToken,
        restoreSession,
        getUserName() {
            if (cachedUserName) return cachedUserName;
            try {
                const encodedClaims = getToken()?.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
                const paddedClaims = encodedClaims ? encodedClaims.padEnd(Math.ceil(encodedClaims.length / 4) * 4, "=") : "";
                cachedUserName = paddedClaims ? JSON.parse(atob(paddedClaims)).sub || null : null;
                return cachedUserName;
            } catch (error) {
                return null;
            }
        },
        getRole() {
            return cachedUserRole;
        },
        setToken,
        clearToken,
        async login(payload) {
            const data = await request("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(payload)
            });
            setToken(data.accessToken);
            setUserName(payload.userName);
            if (data.role) cachedUserRole = data.role;
            return data;
        },
        async register(payload) {
            const data = await request("/api/auth/register", {
                method: "POST",
                body: JSON.stringify(payload)
            });
            setToken(data.accessToken);
            setUserName(payload.userName);
            if (data.role) cachedUserRole = data.role;
            return data;
        },
        async logout() {
            try {
                await request("/api/auth/logout", { method: "POST" });
            } finally {
                clearToken();
            }
        },
        async getProductsPage(filters = {}) {
            const params = new URLSearchParams({
                page: String(filters.page ?? 0),
                size: String(filters.size ?? 12),
                sort: filters.sort || "default"
            });
            for (const [key, value] of Object.entries(filters)) {
                if (key !== "page" && key !== "size" && key !== "sort" && value !== "" && value != null) {
                    params.set(key, String(value));
                }
            }
            const result = await request(`/api/products?${params.toString()}`);
            if (Array.isArray(result)) {
                return {
                    content: result.map(normalizeProduct),
                    number: 0,
                    size: result.length,
                    totalElements: result.length,
                    totalPages: result.length ? 1 : 0,
                    last: true
                };
            }
            return {
                ...result,
                content: (result?.content || []).map(normalizeProduct)
            };
        },
        async getAllProducts() {
            const products = [];
            const pageSize = 100;
            let page = 0;
            while (true) {
                const result = await this.getProductsPage({ page, size: pageSize });
                products.push(...result.content);
                if (result.last === true || result.content.length < pageSize) break;
                page += 1;
            }
            return products;
        },
        async getProduct(productId) {
            return normalizeProduct(await request(`/api/products/${productId}`));
        },
        async getCart() {
            return normalizeCart(await request("/api/cart"));
        },
        async addToCart(productId, quantity) {
            return normalizeCart(await request("/api/cart/items", {
                method: "POST",
                body: JSON.stringify({ productId, quantity })
            }));
        },
        async updateCartItem(itemId, quantity) {
            return normalizeCart(await request(`/api/cart/items/${itemId}`, {
                method: "PATCH",
                body: JSON.stringify({ quantity })
            }));
        },
        async removeCartItem(itemId) {
            return normalizeCart(await request(`/api/cart/items/${itemId}`, { method: "DELETE" }));
        },
        async createOrder(payload) {
            return request("/api/orders", {
                method: "POST",
                body: JSON.stringify(payload)
            });
        },
        async trackOrder(trackingCode) {
            const query = new URLSearchParams({ trackingCode: trackingCode.trim() });
            return request(`/api/orders/track?${query.toString()}`, { method: "POST" });
        },
        async getMyOrders() {
            return request("/api/orders/me");
        },
        async getOrder(orderId) {
            return request(`/api/orders/${orderId}`);
        },
        async getProfile() {
            return request("/api/users/profile");
        },
        async updateProfile(payload) {
            return request("/api/users/profile", {
                method: "PATCH",
                body: JSON.stringify(payload)
            });
        },
        async changePassword(payload) {
            return request("/api/auth/change-password", {
                method: "PATCH",
                body: JSON.stringify(payload)
            });
        },
        async requestPasswordReset(email) {
            return request("/api/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email })
            });
        },
        async resetPassword(payload) {
            return request("/api/auth/reset-password", {
                method: "POST",
                body: JSON.stringify(payload)
            });
        },
        async getUsers(page = 0, size = 20) {
            return request(`/api/users?page=${page}&size=${size}`);
        },
        async updateUserRole(userId, role) {
            return request(`/api/users/profile/${userId}`, {
                method: "PATCH",
                body: JSON.stringify({ role })
            });
        },
        async getAllOrders(page = 0, size = 10) {
            return request(`/api/orders?page=${page}&size=${size}`);
        },
        async updateOrderStatus(orderId, payload) {
            return request("/api/orders/" + orderId, {
                method: "PUT",
                body: JSON.stringify(payload)
            });
        },
        async confirmOrderPayment(orderId) {
            return request(`/api/orders/${orderId}/payment/confirm`, {
                method: "POST"
            });
        },
        async cancelOrder(orderId) {
            return request(`/api/orders/${orderId}/cancel`, {
                method: "POST"
            });
        },
        async createProduct(payload) {
            return request("/api/products", {
                method: "POST",
                body: JSON.stringify(payload)
            });
        },
        async updateProduct(productId, payload) {
            return request("/api/products/" + productId, {
                method: "PUT",
                body: JSON.stringify(payload)
            });
        },
        async deleteProduct(productId) {
            return request("/api/products/" + productId, { method: "DELETE" });
        },
        async getCategories() {
            return request("/api/category");
        },
        async createCategory(payload) {
            return request("/api/category", {
                method: "POST",
                body: JSON.stringify(payload)
            });
        },
        async updateCategory(categoryId, payload) {
            return request("/api/category/" + categoryId, {
                method: "PUT",
                body: JSON.stringify(payload)
            });
        },
        async deleteCategory(categoryId) {
            return request("/api/category/" + categoryId, { method: "DELETE" });
        },
        async getBrands() {
            return request("/api/brand");
        },
        async createBrand(payload) {
            return request("/api/brand", {
                method: "POST",
                body: JSON.stringify(payload)
            });
        },
        async updateBrand(brandId, payload) {
            return request("/api/brand/" + brandId, {
                method: "PUT",
                body: JSON.stringify(payload)
            });
        },
        async deleteBrand(brandId) {
            return request("/api/brand/" + brandId, { method: "DELETE" });
        },
        async getMemberships() {
            return request("/api/membership");
        },
        async getReviews(productId) {
            return request(`/api/reviews?productId=${encodeURIComponent(productId)}`);
        },
        async createReview(productId, payload) {
            return request(`/api/reviews/product/${productId}`, {
                method: "POST",
                body: JSON.stringify(payload)
            });
        },
        async updateReview(reviewId, payload) {
            return request(`/api/reviews/${reviewId}`, {
                method: "PUT",
                body: JSON.stringify(payload)
            });
        },
        async deleteReview(reviewId) {
            return request(`/api/reviews/${reviewId}`, { method: "DELETE" });
        }
    };
})();
