(function () {
    const storageKey = "emarket_access_token";
    const userNameKey = "emarket_user_name";
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
        setToken,
        clearToken,
        async login(payload) {
            const data = await request("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(payload)
            });
            setToken(data.accessToken);
            setUserName(payload.userName);
            return data;
        },
        async register(payload) {
            const data = await request("/api/auth/register", {
                method: "POST",
                body: JSON.stringify(payload)
            });
            setToken(data.accessToken);
            setUserName(payload.userName);
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
