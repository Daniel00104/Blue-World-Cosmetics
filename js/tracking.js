// ==================== CONFIG ====================
const API_BASE_URL = '/api'; // Change to your real backend URL
// Example: 'https://your-api.com/api'

// Sample fallback data
const fallbackOrders = {
    "ORD-123456": {
        id: "ORD-123456",
        status: "shipped",
        date: "July 18, 2026",
        estimatedDelivery: "July 23, 2026",
        items: [
            { name: "Wireless Headphones", qty: 1, price: 89.99 },
            { name: "USB-C Cable Pack", qty: 2, price: 12.50 }
        ],
        address: "123 Maple Street, Springfield, ST 62704",
        trackingNumber: "TRK987654321"
    },
    "ORD-789012": {
        id: "ORD-789012",
        status: "delivered",
        date: "July 10, 2026",
        estimatedDelivery: "July 15, 2026",
        items: [{ name: "Smart Watch Pro", qty: 1, price: 249.99 }],
        address: "456 Oak Avenue, Rivertown, RT 54321",
        trackingNumber: "TRK1122334455"
    }
};

const statusSteps = [
    { id: "ordered", label: "Order Placed", icon: "📦" },
    { id: "processing", label: "Processing", icon: "⚙️" },
    { id: "shipped", label: "Shipped", icon: "🚚" },
    { id: "delivered", label: "Delivered", icon: "✅" }
];

// ==================== API FUNCTION ====================
async function fetchOrderFromAPI(orderId) {
    try {
        const response = await fetch(`${API_BASE_URL}/track/${orderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add authorization if needed:
                // 'Authorization': `Bearer ${yourToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.warn("API request failed, using fallback data:", error);
        return null; // Will trigger fallback
    }
}

// ==================== HELPERS ====================
function getStatusClass(status) {
    const map = {
        delivered: "status-delivered",
        shipped: "status-shipped",
        processing: "status-processing"
    };
    return map[status] || "status-ordered";
}

function showLoading(isLoading) {
    const btn = document.getElementById("trackBtn");
    if (isLoading) {
        btn.textContent = "Tracking...";
        btn.classList.add("loading");
    } else {
        btn.textContent = "Track Order";
        btn.classList.remove("loading");
    }
}

function showError(message) {
    document.getElementById("error-message").textContent = message;
}

// ==================== RENDER ====================
function renderOrderDetails(order) {
    const container = document.getElementById("order-details");
    const currentIndex = statusSteps.findIndex(s => s.id === order.status);

    let html = `
        <div class="order-header">
            <div>
                <h2>Order #${order.id}</h2>
                <p>Placed on ${order.date}</p>
            </div>
            <div class="status-badge ${getStatusClass(order.status)}">
                ${order.status.toUpperCase()}
            </div>
        </div>

        <div class="timeline">
    `;

    statusSteps.forEach((step, i) => {
        const completed = i <= currentIndex;
        html += `
            <div class="timeline-step ${completed ? 'completed' : ''}">
                <div class="step-dot">${step.icon}</div>
                <div class="step-content">
                    <h4>${step.label}</h4>
                    ${i === currentIndex && order.status !== "delivered" ? 
                        `<p>Estimated: ${order.estimatedDelivery}</p>` : ''}
                </div>
            </div>
        `;
    });

    html += `</div>`;

    // Items & Shipping
    let total = 0;
    let itemsHtml = order.items.map(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        return `<li><span>${item.name} ×${item.qty}</span><span>$${(itemTotal).toFixed(2)}</span></li>`;
    }).join('');

    html += `
        <div class="order-info">
            <div class="info-box">
                <h4>Items</h4>
                <ul class="items-list">${itemsHtml}</ul>
                <div style="margin-top: 1rem; font-weight: 600; text-align: right;">
                    Total: $${total.toFixed(2)}
                </div>
            </div>

            <div class="info-box">
                <h4>Shipping Information</h4>
                <p><strong>Tracking Number:</strong> ${order.trackingNumber || 'N/A'}</p>
                <p><strong>Address:</strong><br>${order.address}</p>
                <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery}</p>
            </div>
        </div>
    `;

    container.innerHTML = html;
    container.classList.remove("hidden");
}

// ==================== MAIN TRACK FUNCTION ====================
async function trackOrder() {
    const input = document.getElementById("orderId");
    const orderId = input.value.trim().toUpperCase();
    const errorEl = document.getElementById("error-message");
    const detailsSection = document.getElementById("order-details");

    errorEl.textContent = "";
    detailsSection.classList.add("hidden");

    if (!orderId) {
        showError("Please enter a valid Order ID");
        return;
    }

    showLoading(true);

    try {
        // Try real API first
        let orderData = await fetchOrderFromAPI(orderId);

        // Fallback to local data if API fails or returns nothing
        if (!orderData) {
            orderData = fallbackOrders[orderId];
        }

        if (!orderData) {
            showError("Order not found. Please check your Order ID.");
            return;
        }

        renderOrderDetails(orderData);
        detailsSection.scrollIntoView({ behavior: "smooth" });

    } catch (err) {
        console.error(err);
        showError("Something went wrong. Please try again.");
    } finally {
        showLoading(false);
    }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("trackBtn");
    const input = document.getElementById("orderId");

    btn.addEventListener("click", trackOrder);

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") trackOrder();
    });

    // Optional demo
    // input.value = "ORD-123456";
});