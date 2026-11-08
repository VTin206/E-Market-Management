(function () {
    const storageKey = "emarket_access_token";
    const userNameKey = "emarket_user_name";
    const userRoleKey = "emarket_user_role";
    const apiBase = (window.EMARKET_API_BASE || (window.location.protocol === "file:" ? "http://localhost:8080" : "")).replace(/\/+$/, "");

    function getToken() {
        return localStorage.getItem(storageKey);
    }

    function setToken(token) {
        if (token) {
            localStorage.setItem(storageKey, token);
        }
    }

    function clearToken() {
        localStorage.removeItem(storageKey);
        localStorage.removeItem(userNameKey);
        localStorage.removeItem(userRoleKey);
    }

    function setUserName(userName) {
        if (userName) localStorage.setItem(userNameKey, userName);
    }

    async function request(path, options = {}) {
        const headers = {
            ...(options.headers || {})
        };
        const token = getToken();

        if (options.body) {
            headers["Content-Type"] = "application/json";
        }

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${apiBase}${path}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            let message = `Request failed: ${response.status}`;
            try {
                const body = await response.json();
                message = body.detail || body.message || body.error || message;
            } catch (error) {
                message = response.statusText || message;
            }
            throw new Error(message);
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
            oldPrice: product.oldPrice == null ? null : Number(product.oldPrice),
            discount: product.discount == null ? null : Number(product.discount),
            stock: product.stock,
            imageUrl: product.imageUrl,
            imageType: product.imageType || pickType(product.category?.name),
            theme: product.theme || "linear-gradient(145deg, #e5ded3, #111)",
            category: product.category || { name: "Sản phẩm" },
            brand: product.brand || { name: "" },
            badges: product.badges || [],
            flags: product.flags || [],
            warranty: product.warranty || product.description || ""
        };
    }

    function pickType(categoryName = "") {
        const value = categoryName.toLowerCase();
        if (value.includes("ipad")) return "tablet";
        if (value.includes("mac")) return "laptop";
        if (value.includes("watch")) return "watch";
        return "phone";
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
        getUserName() {
            const storedUserName = localStorage.getItem(userNameKey);
            if (storedUserName) return storedUserName;
            try {
                const encodedClaims = getToken()?.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
                return encodedClaims ? JSON.parse(atob(encodedClaims)).sub || null : null;
            } catch (error) {
                return null;
            }
        },
        getRole() {
            return localStorage.getItem(userRoleKey);
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
            if (data.role) localStorage.setItem(userRoleKey, data.role);
            return data;
        },
        async register(payload) {
            const data = await request("/api/auth/register", {
                method: "POST",
                body: JSON.stringify(payload)
            });
            setToken(data.accessToken);
            setUserName(payload.userName);
            if (data.role) localStorage.setItem(userRoleKey, data.role);
            return data;
        },
        async getProducts() {
            const products = await request("/api/products");
            return products.map(normalizeProduct);
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
        async getMyOrders() {
            return request("/api/orders/me");
        },
        async getAllOrders() {
            return request("/api/orders");
        },
        async updateOrderStatus(orderId, status) {
            return request("/api/orders/" + orderId, {
                method: "PUT",
                body: JSON.stringify({ status })
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
        async createMembership(payload) {
            return request("/api/membership", {
                method: "POST",
                body: JSON.stringify(payload)
            });
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
