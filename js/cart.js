(function () {
  const storageKey = 'cart';
  const catalog = {
    '1001': { title: 'Hydrating Serum', price: 24.00 },
    '1002': { title: 'Daily Sunscreen SPF50', price: 18.00 },
    '1003': { title: 'Revitalizing Night Cream', price: 34.00 },
    '1004': { title: 'Vitamin C Serum', price: 29.00 },
    '1005': { title: 'Gentle Cleanser', price: 12.00 },
    '1006': { title: 'Face Mist', price: 15.00 }
  };

  function getCart() {
    try {
      const cart = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(cart) ? cart : [];
    } catch (error) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(storageKey, JSON.stringify(cart));
    updateCartCount(cart);
  }

  function getCartCount(cart) {
    return cart.reduce((total, item) => total + Math.max(0, Number(item.qty) || 0), 0);
  }

  function updateCartCount(cart = getCart()) {
    document.querySelectorAll('.cart-count').forEach((count) => {
      count.textContent = getCartCount(cart);
      count.hidden = getCartCount(cart) === 0;
    });
  }

  function addProduct(id) {
    const product = catalog[id];
    if (!product) return;

    const cart = getCart();
    const existing = cart.find((item) => item.id === id);
    if (existing) {
      existing.qty = (Number(existing.qty) || 0) + 1;
    } else {
      cart.push({ id, title: product.title, price: product.price, qty: 1 });
    }
    saveCart(cart);
  }

  function renderCartPage() {
    const itemsElement = document.getElementById('cart-items');
    const emptyElement = document.getElementById('cart-empty');
    const summaryElement = document.getElementById('cart-summary');
    if (!itemsElement || !emptyElement || !summaryElement) return;

    const cart = getCart();
    itemsElement.innerHTML = '';
    emptyElement.hidden = cart.length !== 0;
    summaryElement.hidden = cart.length === 0;

    cart.forEach((item) => {
      const quantity = Math.max(1, Number(item.qty) || 1);
      const price = Number(item.price) || 0;
      const row = document.createElement('article');
      row.className = 'cart-item';
      row.dataset.id = item.id;
      row.innerHTML = `
        <div class="cart-item-details">
          <span class="cart-item-category">Blue World Cosmetics</span>
          <h2>${escapeHtml(item.title)}</h2>
          <p>$${price.toFixed(2)} each</p>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-control" aria-label="Quantity for ${escapeHtml(item.title)}">
            <button type="button" class="quantity-btn" data-action="decrease" aria-label="Decrease quantity">−</button>
            <span>${quantity}</span>
            <button type="button" class="quantity-btn" data-action="increase" aria-label="Increase quantity">+</button>
          </div>
          <strong>$${(price * quantity).toFixed(2)}</strong>
          <button type="button" class="remove-item" data-action="remove">Remove</button>
        </div>
      `;
      itemsElement.appendChild(row);
    });

    const subtotal = cart.reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.qty) || 0), 0);
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${subtotal.toFixed(2)}`;
    updateCartCount(cart);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[character]));
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCartPage();

    document.addEventListener('click', (event) => {
      const addButton = event.target.closest('.add-btn');
      if (addButton) {
        addProduct(addButton.dataset.id);
        addButton.textContent = 'Added';
        window.setTimeout(() => { addButton.textContent = 'Add'; }, 900);
        return;
      }

      const actionButton = event.target.closest('[data-action]');
      if (!actionButton) return;
      const row = actionButton.closest('.cart-item');
      const id = row && row.dataset.id;
      if (!id) return;

      const cart = getCart();
      const item = cart.find((entry) => entry.id === id);
      if (!item) return;
      const action = actionButton.dataset.action;
      if (action === 'increase') item.qty += 1;
      if (action === 'decrease') item.qty -= 1;
      if (action === 'remove' || item.qty <= 0) {
        saveCart(cart.filter((entry) => entry.id !== id));
      } else {
        saveCart(cart);
      }
      renderCartPage();
    });

    window.addEventListener('storage', () => {
      updateCartCount();
      renderCartPage();
    });
  });
})();
