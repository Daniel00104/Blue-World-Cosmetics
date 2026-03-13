// product.js — render multiple products, handle Add to Cart and Track
(function(){
  const products = [
    { id:'1001', title:'Hydrating Serum', price:24.00, rating:4.8, reviews:128, img: img.src='Images/bio-white...jpg' },
    { id:'1002', title:'Daily Sunscreen SPF50', price:18.00, rating:4.6, reviews:89, img:'images/skincare.jpeg' },
    { id:'1003', title:'Revitalizing Night Cream', price:34.00, rating:4.9, reviews:210, img:'images/skincare.jpeg' },
    { id:'1004', title:'Vitamin C Serum', price:29.00, rating:4.7, reviews:154, img:'images/skincare.jpeg' },
    { id:'1005', title:'Gentle Cleanser', price:12.00, rating:4.5, reviews:74, img:'images/skincare.jpeg' },
    { id:'1006', title:'Face Mist', price:15.00, rating:4.3, reviews:42, img:'images/skincare.jpeg' }
  ];

  const grid = document.getElementById('productsGrid');
  function formatPrice(p){ return '$'+p.toFixed(2); }

  function render(){
    grid.innerHTML = '';
    products.forEach(p => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${p.img}" alt="${p.title}">
        <h3 class="card-title">${p.title}</h3>
        <div class="card-meta"><div class="price">${formatPrice(p.price)}</div><div class="small muted">★ ${p.rating} (${p.reviews})</div></div>
        <div class="card-actions">
          <button class="primary add-btn" data-id="${p.id}">Add</button>
          <a class="secondary track-link" href="track.html?id=${encodeURIComponent(p.id)}">Track</a>
        </div>
      `;
      grid.appendChild(card);
    });

    // wire buttons
    grid.querySelectorAll('.add-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = btn.dataset.id;
        const prod = products.find(x=>x.id===id);
        if(!prod) return;
        const cart = JSON.parse(localStorage.getItem('cart')||'[]');
        const existing = cart.find(i=>i.id===id);
        if(existing) existing.qty += 1; else cart.push({id:prod.id,title:prod.title,price:prod.price,qty:1});
        localStorage.setItem('cart', JSON.stringify(cart));
        btn.textContent = 'Added';
        setTimeout(()=> btn.textContent = 'Add', 1000);
      });
    });
  }

  // init
  document.addEventListener('DOMContentLoaded', render);
})();
const addBtn = document.getElementById('addBtn');
		const qty = document.getElementById('qty');
		const trackBtn = document.getElementById('trackBtn');

		addBtn.addEventListener('click', e => {
			e.preventDefault();
			const item = {
				id: '12345',
				title: document.querySelector('.title').textContent,
				price: 24.00,
				qty: Number(qty.value || 1),
			};
			const cart = JSON.parse(localStorage.getItem('cart')||'[]');
			cart.push(item);
			localStorage.setItem('cart', JSON.stringify(cart));
			alert(item.qty + '× added to cart');
		});

		// ensure track link uses correct id (if dynamic)
		(function(){
			const prodId = '12345';
			trackBtn.href = 'track.html?id=' + encodeURIComponent(prodId);
		})();