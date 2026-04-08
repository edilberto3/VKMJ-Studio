const PRODUCTS = [
	{
		id: 1,
		name: "Crystal Luxe Cut Vase",
		cat: "Crystal Glass",
		price: 1499,
		img: "1-1.png",
		badge: "Luxury",
		badgeClass: "",
		desc: "An elegant crystal-cut vase that reflects light beautifully, perfect for formal settings, weddings, or luxury home décor.",
		size: "22cm (H) × 10cm (W)",
		material: "Crystal Glass",
		featured: true,
		stock: 12,
	},
	{
		id: 2,
		name: "Bamboo Essence Vase",
		cat: "Bamboo",
		price: 650,
		img: "6.jpg",
		badge: "Eco",
		badgeClass: "eco",
		desc: "Crafted from natural bamboo, this eco-friendly vase brings a calming, earthy vibe to your home. Ideal for dried flowers or simple green arrangements.",
		size: "25cm (H) × 8cm (D)",
		material: "Bamboo",
		featured: true,
		stock: 20,
	},
	{
		id: 3,
		name: "Abstract Flow Vase",
		cat: "Ceramic",
		price: 1050,
		img: "5.jpg",
		badge: "",
		badgeClass: "",
		desc: "A sculptural vase with a flowing, artistic shape. Doubles as a decorative piece even without flowers.",
		size: "20cm (H) × 14cm (W)",
		material: "Ceramic",
		featured: true,
		stock: 8,
	},
	{
		id: 4,
		name: "GlowMist LED Vase",
		cat: "Acrylic",
		price: 1299,
		img: "4.jpg",
		badge: "LED",
		badgeClass: "led",
		desc: "A multi-functional vase with built-in LED lighting, creating a relaxing ambiance at night. Perfect for bedrooms and cafés.",
		size: "19cm (H) × 11cm (W)",
		material: "Acrylic + LED",
		featured: true,
		stock: 6,
	},
	{
		id: 5,
		name: "Ocean Shell Vase",
		cat: "Ceramic",
		price: 720,
		img: "3.jpg",
		badge: "",
		badgeClass: "",
		desc: "Designed with shell textures and coastal details, this vase is perfect for beach-themed interiors.",
		size: "17cm (H) × 12cm (W)",
		material: "Ceramic",
		featured: false,
		stock: 15,
	},
	{
		id: 6,
		name: "EcoGlass Reborn Vase",
		cat: "Recycled",
		price: 680,
		img: "2.jpg",
		badge: "Eco",
		badgeClass: "eco",
		desc: "Made from recycled glass, each piece is unique with slight color variations. A sustainable yet stylish choice.",
		size: "20cm (H) × 9cm (D)",
		material: "Recycled Glass",
		featured: false,
		stock: 10,
	},
];

const ACCOUNTS = [
	{
		email: "admin@vkmj.ph",
		pass: "admin123",
		role: "admin",
		name: "Admin VKMJ",
		phone: "+63 905 167 1085",
		addr: "Philippines",
	},
	{
		email: "user@vkmj.ph",
		pass: "user123",
		role: "user",
		firstName: "Mary Jane",
		lastName: "Bayno",
		phone: "+63 905 167 1085",
		addr: "123 Main St, Cebu City",
	},
];

let currentUser = JSON.parse(localStorage.getItem("vkmj_user") || "null");
let cart = JSON.parse(localStorage.getItem("vkmj_cart") || "[]");
let orders = JSON.parse(localStorage.getItem("vkmj_orders") || "[]");
let products = JSON.parse(
	localStorage.getItem("vkmj_products") || JSON.stringify(PRODUCTS),
);
let registeredUsers = JSON.parse(localStorage.getItem("vkmj_regusers") || "[]");
let currentRating = 0;
let shopFilter = "All";
let searchTerm = "";
let productToAddAfterLogin = null;

if (products.length < PRODUCTS.length) {
	products = PRODUCTS;
	localStorage.setItem("vkmj_products", JSON.stringify(products));
}

document.addEventListener("DOMContentLoaded", () => {
	renderFeatured();
	renderShop();
	renderReviewsList();
	renderCartUI();
	updateCartCount();
	updateAccountMenu();
	prefillCheckout();
});

function showPage(p) {
	document
		.querySelectorAll(".page")
		.forEach((x) => x.classList.remove("active"));
	const el = document.getElementById("page-" + p);
	if (el) el.classList.add("active");
	window.scrollTo({ top: 0, behavior: "smooth" });
	document
		.querySelectorAll(".nav-links a")
		.forEach((a) => a.classList.toggle("active", a.dataset.page === p));
	if (p === "dashboard") renderDashboard();
	if (p === "admin") renderAdmin();
	if (p === "checkout") {
		prefillCheckout();
		updateCoSummary();
	}
	if (p === "shop") renderShop();
	if (p === "reviews") renderReviewsList();
	closeAccountMenu();
	closeCart();
}

function toggleNav() {
	document.getElementById("navLinks").classList.toggle("open");
	document.getElementById("mobOverlay").classList.toggle("open");
}
function closeNav() {
	document.getElementById("navLinks").classList.remove("open");
	document.getElementById("mobOverlay").classList.remove("open");
}

document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") {
		closeModal();
		closeCart();
		closeNav();
		const m = document.getElementById("acctMenu");
		if (m) m.classList.add("hidden");
	}
});

function renderFeatured() {
	const g = document.getElementById("featuredGrid");
	if (!g) return;
	g.innerHTML = PRODUCTS.filter((p) => p.featured)
		.map((p) => pcHTML(p))
		.join("");
}

function renderShop() {
	const g = document.getElementById("shopGrid");
	if (!g) return;
	let list = [...products];
	if (shopFilter !== "All")
		list = list.filter(
			(p) =>
				p.cat.toLowerCase().includes(shopFilter.toLowerCase()) ||
				p.material.toLowerCase().includes(shopFilter.toLowerCase()),
		);
	if (searchTerm)
		list = list.filter(
			(p) =>
				p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				p.cat.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	const sort = document.getElementById("sortSel")?.value;
	if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
	else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
	else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
	g.innerHTML = list.length
		? list.map((p) => pcHTML(p)).join("")
		: `<p style="grid-column:1/-1;color:var(--text-3);font-style:italic;padding:48px 0">No vases found.</p>`;
}

function pcHTML(p) {
	const out = p.stock <= 0;
	return `
  <div class="product-card" onclick="openProductModal(${p.id})">
    <div class="pc-img">
      <img src="${p.img}" alt="${p.name}" onerror="this.style.display='none'"/>
      ${p.badge ? `<span class="pc-badge ${p.badgeClass}">${p.badge}</span>` : ""}
      ${out ? `<span class="pc-badge" style="background:var(--text-3)">Sold Out</span>` : ""}
    </div>
    <div class="pc-body">
      <p class="pc-cat">${p.cat}</p>
      <p class="pc-name">${p.name}</p>
      <p class="pc-desc">${p.desc}</p>
      <div class="pc-foot">
        <div><p class="pc-price">₱${p.price.toLocaleString()}</p><p class="pc-stock">Stock: ${p.stock}</p></div>
        <button class="pc-add" onclick="event.stopPropagation();addToCart(${p.id})" ${out ? "disabled" : ""} title="Add to basket">+</button>
      </div>
    </div>
  </div>`;
}

function setShopFilter(val, btn) {
	shopFilter = val;
	document
		.querySelectorAll("#catFilters .ftab")
		.forEach((b) => b.classList.remove("active"));
	if (btn) {
		btn.classList.add("active");
	} else {
		document.querySelectorAll("#catFilters .ftab").forEach((b) => {
			const txt = b.textContent.trim();
			if (val === "All" && txt === "All") b.classList.add("active");
			else if (txt.toLowerCase().includes(val.toLowerCase()))
				b.classList.add("active");
		});
	}
	renderShop();
}

function handleSearch(v) {
	searchTerm = v;
	renderShop();
	if (v) showPage("shop");
}

function openProductModal(id) {
	const p = products.find((x) => x.id === id);
	if (!p) return;
	const out = p.stock <= 0;
	document.getElementById("modalContent").innerHTML = `
    <div class="modal-img"><img src="${p.img}" alt="${p.name}" onerror="this.style.display='none'"/></div>
    <div class="modal-body">
      <p class="m-cat">${p.cat}</p>
      <h2 class="m-name">${p.name}</h2>
      <p class="m-price">₱${p.price.toLocaleString()}</p>
      <p class="m-desc">${p.desc}</p>
      <div class="m-specs">
        <div class="m-spec"><span class="m-spec-label">Size</span><span class="m-spec-val">${p.size}</span></div>
        <div class="m-spec"><span class="m-spec-label">Material</span><span class="m-spec-val">${p.material}</span></div>
        <div class="m-spec"><span class="m-spec-label">Stock</span><span class="m-spec-val">${p.stock} units</span></div>
      </div>
      <p class="m-stock" style="color:${out ? "#c0392b" : p.stock <= 3 ? "#c4841a" : "var(--sienna)"}">
        ${out ? "✕ Out of Stock" : p.stock <= 3 ? `⚠ Only ${p.stock} left!` : `✓ In Stock`}
      </p>
      <div class="m-actions">
        <button class="btn-primary" onclick="addToCart(${p.id});closeModal()" ${out ? "disabled" : ""}>Add to Basket</button>
        <button class="btn-outline" onclick="closeModal()">Close</button>
      </div>
    </div>`;
	document.getElementById("productModal").classList.remove("hidden");
}
function closeModal() {
	document.getElementById("productModal").classList.add("hidden");
}

function addToCart(id) {
	if (!currentUser) {
		productToAddAfterLogin = id;
		showToast("Please sign in to add items to your basket.");
		setTimeout(() => showPage("auth"), 800);
		return;
	}
	const p = products.find((x) => x.id === id);
	if (!p || p.stock <= 0) {
		showToast("Sorry, this item is out of stock.");
		return;
	}
	p.stock--;
	localStorage.setItem("vkmj_products", JSON.stringify(products));
	const ex = cart.find((c) => c.id === id);
	if (ex) ex.qty++;
	else
		cart.push({ id: p.id, name: p.name, price: p.price, img: p.img, qty: 1 });
	saveCart();
	showToast(`"${p.name}" added to your basket.`);
	renderShop();
	renderFeatured();
}

function saveCart() {
	localStorage.setItem("vkmj_cart", JSON.stringify(cart));
	renderCartUI();
	updateCartCount();
}

function updateCartCount() {
	const n = cart.reduce((s, c) => s + c.qty, 0);
	document.getElementById("cartCount").textContent = n;
}

function openCart() {
	document.getElementById("cartSidebar").classList.add("open");
	document.getElementById("cartOverlay").classList.add("open");
}
function closeCart() {
	document.getElementById("cartSidebar").classList.remove("open");
	document.getElementById("cartOverlay").classList.remove("open");
}

function renderCartUI() {
	const el = document.getElementById("cartItems");
	const tot = document.getElementById("cartTotal");
	if (!el) return;
	if (!cart.length) {
		el.innerHTML = `<div class="cart-empty"><p>Your basket is empty.</p></div>`;
		if (tot) tot.textContent = "₱0";
		return;
	}
	el.innerHTML = cart
		.map(
			(i) => `
    <div class="cart-item">
      <div class="ci-img"><img src="${i.img}" alt="${i.name}" onerror="this.style.display='none'"/></div>
      <div class="ci-info">
        <p class="ci-name">${i.name}</p>
        <p class="ci-price">₱${i.price.toLocaleString()}</p>
        <div class="ci-qty">
          <button class="cq-btn" onclick="changeQty(${i.id},-1)">−</button>
          <span class="cq-num">${i.qty}</span>
          <button class="cq-btn" onclick="changeQty(${i.id},1)">+</button>
        </div>
        <p class="ci-remove" onclick="removeFromCart(${i.id})">Remove</p>
      </div>
    </div>`,
		)
		.join("");
	const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
	if (tot) tot.textContent = `₱${total.toLocaleString()}`;
}

function changeQty(id, d) {
	const item = cart.find((c) => c.id === id);
	const prod = products.find((p) => p.id === id);
	if (!item) return;
	if (d === 1) {
		if (prod && prod.stock > 0) {
			prod.stock--;
			item.qty++;
			localStorage.setItem("vkmj_products", JSON.stringify(products));
		} else {
			showToast("No more stock!");
			return;
		}
	} else {
		item.qty--;
		if (prod) {
			prod.stock++;
			localStorage.setItem("vkmj_products", JSON.stringify(products));
		}
		if (item.qty <= 0) cart = cart.filter((c) => c.id !== id);
	}
	saveCart();
	renderShop();
	renderFeatured();
}

function removeFromCart(id) {
	const item = cart.find((c) => c.id === id);
	const prod = products.find((p) => p.id === id);
	if (item && prod) {
		prod.stock += item.qty;
		localStorage.setItem("vkmj_products", JSON.stringify(products));
	}
	cart = cart.filter((c) => c.id !== id);
	saveCart();
	renderShop();
	renderFeatured();
}

function goCheckout() {
	if (!currentUser) {
		showToast("Please sign in to checkout.");
		setTimeout(() => showPage("auth"), 800);
		return;
	}
	closeCart();
	showPage("checkout");
}

function prefillCheckout() {
	if (!currentUser) return;
	const u = currentUser;
	const set = (id, val) => {
		const el = document.getElementById(id);
		if (el && val) el.value = val;
	};
	if (u.role === "admin") {
		set("co-first", "Admin");
		set("co-last", "VKMJ");
		set("co-email", u.email);
	} else {
		set("co-first", u.firstName || "");
		set("co-last", u.lastName || "");
		set("co-email", u.email || "");
		set("co-phone", u.phone || "");
		set("co-addr", u.addr || "");
	}
}

function updateCoSummary() {
	const el = document.getElementById("coItems");
	const sub = document.getElementById("coSub");
	const tot = document.getElementById("coTotal");
	if (!el) return;
	el.innerHTML = cart
		.map(
			(i) => `
    <div class="co-item">
      <img src="${i.img}" alt="${i.name}" onerror="this.style.display='none'"/>
      <div class="co-item-info">
        <p class="cin">${i.name} ×${i.qty}</p>
        <p class="cip">₱${(i.price * i.qty).toLocaleString()}</p>
      </div>
    </div>`,
		)
		.join("");
	const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
	if (sub) sub.textContent = `₱${subtotal.toLocaleString()}`;
	if (tot) tot.textContent = `₱${(subtotal + 150).toLocaleString()}`;
}

function placeOrder() {
	if (!currentUser) {
		showToast("Please sign in first.");
		showPage("auth");
		return;
	}
	if (!cart.length) {
		showToast("Your basket is empty!");
		return;
	}
	const fname = document.getElementById("co-first")?.value.trim();
	const lname = document.getElementById("co-last")?.value.trim();
	if (!fname || !lname) {
		showToast("Please fill in your shipping details.");
		return;
	}
	const oid = "VKMJ-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
	const order = {
		id: oid,
		userId: currentUser.email,
		userName: fname + " " + lname,
		userEmail: document.getElementById("co-email")?.value || currentUser.email,
		userPhone: document.getElementById("co-phone")?.value || "",
		userAddr: document.getElementById("co-addr")?.value || "",
		items: [...cart],
		status: "Processing",
		total: cart.reduce((s, c) => s + c.price * c.qty, 0) + 150,
		date: new Date().toLocaleDateString("en-PH"),
		payment:
			document.querySelector("input[name=pay]:checked")?.value || "gcash",
	};
	orders.push(order);
	localStorage.setItem("vkmj_orders", JSON.stringify(orders));
	cart = [];
	saveCart();
	showToast(`Order placed! Your ID: ${oid}`);
	showPage("dashboard");
}

function trackOrder() {
	const input = document.getElementById("trackInput").value.trim();
	const res = document.getElementById("trackResult");
	if (!input) {
		showToast("Please enter an Order ID.");
		return;
	}
	const order = orders.find((o) => o.id === input);
	res.classList.remove("hidden");
	if (!order) {
		res.innerHTML = `<p style="color:#c0392b;font-weight:600">Order not found. Please check your Order ID.</p>`;
		return;
	}
	const steps = ["Processing", "Packing", "Shipped", "Delivered"];
	const ci = steps.indexOf(order.status);
	res.innerHTML = `
    <p class="tr-id">Order ${order.id}</p>
    <div class="tr-detail">
      <strong>Customer:</strong> ${order.userName}<br/>
      <strong>Date:</strong> ${order.date}<br/>
      <strong>Items:</strong><br/>${order.items.map((i) => `— ${i.name} ×${i.qty} @ ₱${i.price.toLocaleString()}`).join("<br/>")}
      <br/><strong>Total:</strong> ₱${order.total.toLocaleString()}
    </div>
    <div class="track-steps">
      ${steps
				.map((s, i) => {
					const state = i < ci ? "done" : i === ci ? "current" : "pending";
					return `${i > 0 ? `<div class="ts-line ${i <= ci ? "done" : ""}"></div>` : ""}
          <div class="ts ${state}">
            <div class="ts-dot">${i < ci ? "✓" : i + 1}</div>
            <span class="ts-label">${s}</span>
          </div>`;
				})
				.join("")}
    </div>`;
}

function switchAuth(tab) {
	document
		.getElementById("authLogin")
		.classList.toggle("hidden", tab !== "login");
	document
		.getElementById("authReg")
		.classList.toggle("hidden", tab !== "register");
	document
		.querySelectorAll(".auth-tab")
		.forEach((t) =>
			t.classList.toggle(
				"active",
				t.textContent.toLowerCase().includes(tab === "login" ? "sign" : "reg"),
			),
		);
}

function doLogin() {
	const email = document
		.getElementById("loginEmail")
		.value.trim()
		.toLowerCase();
	const pass = document.getElementById("loginPass").value;

	let user = ACCOUNTS.find((a) => a.email === email && a.pass === pass);

	if (!user)
		user = registeredUsers.find((u) => u.email === email && u.pass === pass);
	if (!user) {
		showToast("Invalid email or password.");
		return;
	}
	currentUser = user;
	localStorage.setItem("vkmj_user", JSON.stringify(user));
	updateAccountMenu();
	showToast(`Welcome back, ${user.firstName || user.name || user.email}!`);

	if (productToAddAfterLogin) {
		const id = productToAddAfterLogin;
		productToAddAfterLogin = null;
		addToCart(id);
	}
	showPage(user.role === "admin" ? "admin" : "home");
}

function doRegister() {
	const first = document.getElementById("regFirst").value.trim();
	const last = document.getElementById("regLast").value.trim();
	const email = document.getElementById("regEmail").value.trim().toLowerCase();
	const phone = document.getElementById("regPhone").value.trim();
	const addr = document.getElementById("regAddr").value.trim();
	const pass = document.getElementById("regPass").value;
	if (!first || !last || !email || !pass) {
		showToast("Please fill in all required fields.");
		return;
	}
	if (
		ACCOUNTS.find((a) => a.email === email) ||
		registeredUsers.find((u) => u.email === email)
	) {
		showToast("An account with this email already exists.");
		return;
	}
	const newUser = {
		email,
		pass,
		role: "user",
		firstName: first,
		lastName: last,
		phone,
		addr,
	};
	registeredUsers.push(newUser);
	localStorage.setItem("vkmj_regusers", JSON.stringify(registeredUsers));
	currentUser = newUser;
	localStorage.setItem("vkmj_user", JSON.stringify(newUser));
	updateAccountMenu();
	showToast(`Account created! Welcome, ${first}!`);
	showPage("home");
}

function doLogout() {
	currentUser = null;
	cart = [];
	localStorage.removeItem("vkmj_user");
	localStorage.removeItem("vkmj_cart");
	updateCartCount();
	renderCartUI();
	updateAccountMenu();
	showToast("You have been signed out.");
	showPage("home");
}

function toggleAccountMenu() {
	const m = document.getElementById("acctMenu");
	m.classList.toggle("hidden");
	if (!m.classList.contains("hidden")) updateAccountMenu();
}
function closeAccountMenu() {
	document.getElementById("acctMenu")?.classList.add("hidden");
}
document.addEventListener("click", (e) => {
	const btn = document.getElementById("acctBtn");
	const menu = document.getElementById("acctMenu");
	if (menu && !menu.contains(e.target) && !btn.contains(e.target))
		menu.classList.add("hidden");
});

function updateAccountMenu() {
	const el = document.getElementById("acctMenuContent");
	if (!el) return;
	const base = `font-family:'Outfit',sans-serif;font-size:.78rem;font-weight:500;display:block;width:100%;text-align:left;padding:11px 20px;transition:background .2s;border:none;cursor:pointer;background:none;color:var(--text-2);`;
	const hover = `onmouseenter="this.style.background='var(--cream-2)'" onmouseleave="this.style.background='none'"`;
	if (!currentUser) {
		el.innerHTML = `
      <div style="padding:16px 20px;border-bottom:1px solid var(--border)">
        <p style="font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:var(--text)">Welcome</p>
        <p style="font-size:.76rem;color:var(--text-3);margin-top:2px">Sign in to your account</p>
      </div>
      <button style="${base}" onclick="closeAccountMenu();showPage('auth')" ${hover}>Sign In / Register</button>`;
	} else if (currentUser.role === "admin") {
		el.innerHTML = `
      <div style="padding:16px 20px;border-bottom:1px solid var(--border)">
        <p style="font-family:'Playfair Display',serif;font-size:.95rem;font-weight:700;color:var(--sienna)">Admin Panel</p>
        <p style="font-size:.72rem;color:var(--text-3);margin-top:2px">${currentUser.email}</p>
      </div>
      <button style="${base}" onclick="closeAccountMenu();showPage('admin')" ${hover}>Dashboard</button>
      <button style="${base};color:#c0392b" onclick="doLogout()">Sign Out</button>`;
	} else {
		const name = currentUser.firstName || currentUser.name || currentUser.email;
		el.innerHTML = `
      <div style="padding:16px 20px;border-bottom:1px solid var(--border)">
        <p style="font-family:'Playfair Display',serif;font-size:.95rem;font-weight:700;color:var(--text)">${name}</p>
        <p style="font-size:.72rem;color:var(--text-3);margin-top:2px">${currentUser.email}</p>
      </div>
      <button style="${base}" onclick="closeAccountMenu();showPage('dashboard')" ${hover}>My Dashboard</button>
      <button style="${base}" onclick="closeAccountMenu();showPage('tracking')" ${hover}>Track Order</button>
      <button style="${base};color:#c0392b" onclick="doLogout()">Sign Out</button>`;
	}
}

function switchDash(tab, el) {
	["overview", "orders", "profile"].forEach((t) => {
		const panel = document.getElementById("dash-" + t);
		if (panel) panel.classList.toggle("hidden", t !== tab);
	});
	document
		.querySelectorAll("#page-dashboard .dn-btn")
		.forEach((b) => b.classList.remove("active"));
	if (el) el.classList.add("active");
}

function renderDashboard() {
	if (!currentUser) {
		showPage("auth");
		return;
	}
	const name = currentUser.firstName || currentUser.name || "";
	const myOrders = orders.filter((o) => o.userId === currentUser.email);
	document.getElementById("dashOverviewContent").innerHTML = `
    <p style="font-style:italic;color:var(--text-3);margin-bottom:30px">Welcome back, <strong style="color:var(--text);font-style:normal">${name}</strong>!</p>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin-bottom:38px">
      <div style="background:#fff;padding:26px;border-top:3px solid var(--sienna);border-radius:var(--r)">
        <p style="font-size:.6rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--text-3);margin-bottom:10px">Total Orders</p>
        <p style="font-family:'Playfair Display',serif;font-size:2rem;font-weight:700;color:var(--text)">${myOrders.length}</p>
      </div>
      <div style="background:#fff;padding:26px;border-top:3px solid var(--rose);border-radius:var(--r)">
        <p style="font-size:.6rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--text-3);margin-bottom:10px">Total Spent</p>
        <p style="font-family:'Playfair Display',serif;font-size:2rem;font-weight:700;color:var(--text)">₱${myOrders.reduce((s, o) => s + o.total, 0).toLocaleString()}</p>
      </div>
      <div style="background:#fff;padding:26px;border-top:3px solid var(--sand);border-radius:var(--r)">
        <p style="font-size:.6rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--text-3);margin-bottom:10px">Cart Items</p>
        <p style="font-family:'Playfair Display',serif;font-size:2rem;font-weight:700;color:var(--text)">${cart.reduce((s, c) => s + c.qty, 0)}</p>
      </div>
    </div>
    <p style="font-size:.8rem;color:var(--text-3)">Use the sidebar to view your orders, track shipments, and manage your profile.</p>`;

	document.getElementById("dashOrdersContent").innerHTML = myOrders.length
		? `
    <div class="tbl-wrap"><table class="data-table">
      <thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>${myOrders
				.map(
					(o) => `
        <tr>
          <td style="font-family:'Playfair Display',serif;color:var(--sienna)">${o.id}</td>
          <td>${o.date}</td>
          <td>${o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}</td>
          <td>₱${o.total.toLocaleString()}</td>
          <td><span class="status-badge st-${o.status.toLowerCase()}">${o.status}</span></td>
          <td><button class="btn-outline btn-sm" onclick="prefillTrack('${o.id}')">Track</button></td>
        </tr>`,
				)
				.join("")}
      </tbody>
    </table></div>`
		: `<p style="font-style:italic;color:var(--text-3)">No orders yet. <a href="#" onclick="showPage('shop')" style="color:var(--sienna)">Start shopping →</a></p>`;

	document.getElementById("dashProfileContent").innerHTML = `
    <div style="max-width:500px;display:flex;flex-direction:column;gap:16px">
      <div class="fg"><label>First Name</label><input type="text" value="${currentUser.firstName || ""}" id="pf-first"/></div>
      <div class="fg"><label>Last Name</label><input type="text" value="${currentUser.lastName || ""}" id="pf-last"/></div>
      <div class="fg"><label>Email</label><input type="email" value="${currentUser.email || ""}" id="pf-email" readonly style="background:var(--cream-3)"/></div>
      <div class="fg"><label>Phone</label><input type="text" value="${currentUser.phone || ""}" id="pf-phone"/></div>
      <div class="fg"><label>Address</label><input type="text" value="${currentUser.addr || ""}" id="pf-addr"/></div>
      <button class="btn-primary" onclick="saveProfile()">Save Changes</button>
    </div>`;
}

function saveProfile() {
	currentUser.firstName = document.getElementById("pf-first").value;
	currentUser.lastName = document.getElementById("pf-last").value;
	currentUser.phone = document.getElementById("pf-phone").value;
	currentUser.addr = document.getElementById("pf-addr").value;
	const idx = registeredUsers.findIndex((u) => u.email === currentUser.email);
	if (idx > -1) {
		registeredUsers[idx] = { ...registeredUsers[idx], ...currentUser };
		localStorage.setItem("vkmj_regusers", JSON.stringify(registeredUsers));
	}
	localStorage.setItem("vkmj_user", JSON.stringify(currentUser));
	prefillCheckout();
	showToast("Profile updated successfully.");
}

function prefillTrack(id) {
	document.getElementById("trackInput").value = id;
	showPage("tracking");
	setTimeout(trackOrder, 200);
}

function switchAdmin(tab, el) {
	document
		.querySelectorAll(".admin-panel")
		.forEach((p) => p.classList.add("hidden"));
	document.getElementById("admin-" + tab)?.classList.remove("hidden");
	document
		.querySelectorAll("#page-admin .dn-btn")
		.forEach((b) => b.classList.remove("active"));
	if (el) el.classList.add("active");
	if (tab === "overview") renderAdminOverview();
	if (tab === "orders") renderAdminOrders();
	if (tab === "inventory") renderAdminInventory();
	if (tab === "users") renderAdminUsers();
	if (tab === "reports") renderAdminReports();
}

function renderAdmin() {
	renderAdminOverview();
}

function renderAdminOverview() {
	const totalRev = orders.reduce((s, o) => s + o.total, 0);
	const allUsers = [
		...ACCOUNTS.filter((a) => a.role !== "admin"),
		...registeredUsers,
	];
	document.getElementById("adminOverviewContent").innerHTML = `
    <div class="admin-stats">
      <div class="stat-card"><p class="stat-label">Total Revenue</p><p class="stat-val">₱${totalRev.toLocaleString()}</p><p class="stat-ch pos">+${orders.length} orders total</p></div>
      <div class="stat-card"><p class="stat-label">Total Orders</p><p class="stat-val">${orders.length}</p><p class="stat-ch">All time</p></div>
      <div class="stat-card"><p class="stat-label">Products</p><p class="stat-val">${products.length}</p><p class="stat-ch">Active listings</p></div>
      <div class="stat-card"><p class="stat-label">Customers</p><p class="stat-val">${allUsers.length}</p><p class="stat-ch">Registered users</p></div>
    </div>
    <h3>Recent Orders</h3>
    <div class="tbl-wrap"><table class="data-table">
      <thead><tr><th>Order ID</th><th>Customer</th><th>Email</th><th>Phone</th><th>Address</th><th>Items</th><th>Total</th><th>Payment</th><th>Date</th><th>Status</th><th>Update</th></tr></thead>
      <tbody>${orders
				.slice(-5)
				.reverse()
				.map(
					(o) => `
        <tr>
          <td style="font-family:'Playfair Display',serif;color:var(--sienna);white-space:nowrap">${o.id}</td>
          <td style="font-weight:600;color:var(--text)">${o.userName}</td>
          <td>${o.userEmail || "—"}</td><td>${o.userPhone || "—"}</td>
          <td style="max-width:140px;overflow:hidden;text-overflow:ellipsis">${o.userAddr || "—"}</td>
          <td>${o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}</td>
          <td>₱${o.total.toLocaleString()}</td>
          <td style="text-transform:capitalize">${o.payment || "gcash"}</td>
          <td>${o.date}</td>
          <td><span class="status-badge st-${o.status.toLowerCase()}">${o.status}</span></td>
          <td><select onchange="updateOrderStatus('${o.id}',this.value)" style="padding:5px 10px;font-size:.72rem;border:1px solid var(--border);border-radius:var(--r);background:var(--cream);color:var(--text);outline:none">
            <option ${o.status === "Processing" ? "selected" : ""}>Processing</option>
            <option ${o.status === "Packing" ? "selected" : ""}>Packing</option>
            <option ${o.status === "Shipped" ? "selected" : ""}>Shipped</option>
            <option ${o.status === "Delivered" ? "selected" : ""}>Delivered</option>
          </select></td>
        </tr>`,
				)
				.join("")}
      </tbody>
    </table></div>`;
}

function renderAdminOrders() {
	document.getElementById("adminOrdersContent").innerHTML = orders.length
		? `
    <div class="tbl-wrap"><table class="data-table">
      <thead><tr><th>Order ID</th><th>Customer</th><th>Email</th><th>Phone</th><th>Address</th><th>Items</th><th>Total</th><th>Payment</th><th>Date</th><th>Status</th><th>Update</th></tr></thead>
      <tbody>${orders
				.map(
					(o) => `
        <tr>
          <td style="font-family:'Playfair Display',serif;color:var(--sienna);white-space:nowrap">${o.id}</td>
          <td style="font-weight:600;color:var(--text)">${o.userName}</td>
          <td>${o.userEmail || "—"}</td><td>${o.userPhone || "—"}</td><td>${o.userAddr || "—"}</td>
          <td>${o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}</td>
          <td>₱${o.total.toLocaleString()}</td>
          <td style="text-transform:capitalize">${o.payment || "gcash"}</td>
          <td>${o.date}</td>
          <td><span class="status-badge st-${o.status.toLowerCase()}">${o.status}</span></td>
          <td><select onchange="updateOrderStatus('${o.id}',this.value)" style="padding:5px 10px;font-size:.72rem;border:1px solid var(--border);border-radius:var(--r);background:var(--cream);color:var(--text);outline:none">
            <option ${o.status === "Processing" ? "selected" : ""}>Processing</option>
            <option ${o.status === "Packing" ? "selected" : ""}>Packing</option>
            <option ${o.status === "Shipped" ? "selected" : ""}>Shipped</option>
            <option ${o.status === "Delivered" ? "selected" : ""}>Delivered</option>
          </select></td>
        </tr>`,
				)
				.join("")}
      </tbody>
    </table></div>`
		: `<p style="font-style:italic;color:var(--text-3)">No orders yet.</p>`;
}

function updateOrderStatus(id, status) {
	const o = orders.find((x) => x.id === id);
	if (!o) return;
	o.status = status;
	localStorage.setItem("vkmj_orders", JSON.stringify(orders));
	showToast(`Order ${id} updated to: ${status}`);
}

function renderAdminInventory() {
	document.getElementById("adminInventoryContent").innerHTML = `
    <div class="tbl-wrap"><table class="data-table">
      <thead><tr><th>Product</th><th>Category</th><th>Material</th><th>Size</th><th>Price</th><th>Stock</th><th>Status</th></tr></thead>
      <tbody>${products
				.map((p) => {
					const sc =
						p.stock === 0
							? "#c0392b"
							: p.stock <= 3
								? "#c4841a"
								: "var(--sienna)";
					const sl =
						p.stock === 0
							? "Out of Stock"
							: p.stock <= 3
								? "Low Stock"
								: "In Stock";
					return `<tr>
          <td style="font-weight:600;color:var(--text)">${p.name}</td>
          <td>${p.cat}</td><td>${p.material}</td><td>${p.size}</td>
          <td>₱${p.price.toLocaleString()}</td>
          <td style="color:${sc};font-weight:600">${p.stock} units</td>
          <td><span class="status-badge" style="background:${p.stock === 0 ? "rgba(192,57,43,.12)" : p.stock <= 3 ? "rgba(196,132,26,.12)" : "rgba(196,98,45,.12)"};color:${sc}">${sl}</span></td>
        </tr>`;
				})
				.join("")}
      </tbody>
    </table></div>`;
}

function renderAdminUsers() {
	const allU = [
		...ACCOUNTS.filter((a) => a.role !== "admin"),
		...registeredUsers,
	];
	document.getElementById("adminUsersContent").innerHTML = `
    <div class="tbl-wrap"><table class="data-table">
      <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Orders</th><th>Total Spent</th></tr></thead>
      <tbody>${allU
				.map((u) => {
					const uOrders = orders.filter((o) => o.userId === u.email);
					const spent = uOrders.reduce((s, o) => s + o.total, 0);
					const name = u.firstName
						? `${u.firstName} ${u.lastName}`
						: u.name || u.email;
					return `<tr>
          <td style="font-weight:600;color:var(--text)">${name}</td>
          <td>${u.email}</td><td>${u.phone || "—"}</td><td>${u.addr || "—"}</td>
          <td>${uOrders.length}</td><td>₱${spent.toLocaleString()}</td>
        </tr>`;
				})
				.join("")}
      </tbody>
    </table></div>`;
}

function renderAdminReports() {
	const totalRev = orders.reduce((s, o) => s + o.total, 0);
	const topProd = [...products].sort((a, b) => {
		const sa = orders.reduce(
			(s, o) =>
				s + o.items.filter((i) => i.id === a.id).reduce((x, i) => x + i.qty, 0),
			0,
		);
		const sb = orders.reduce(
			(s, o) =>
				s + o.items.filter((i) => i.id === b.id).reduce((x, i) => x + i.qty, 0),
			0,
		);
		return sb - sa;
	});
	document.getElementById("adminReportsContent").innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:3px;margin-bottom:40px">
      <div style="background:#fff;padding:30px;border-top:3px solid var(--sienna);border-radius:var(--r)">
        <p style="font-size:.62rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--text-3);margin-bottom:10px">Total Revenue</p>
        <p style="font-family:'Playfair Display',serif;font-size:2.1rem;font-weight:700;color:var(--text)">₱${totalRev.toLocaleString()}</p>
      </div>
      <div style="background:#fff;padding:30px;border-top:3px solid var(--rose);border-radius:var(--r)">
        <p style="font-size:.62rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--text-3);margin-bottom:10px">Average Order Value</p>
        <p style="font-family:'Playfair Display',serif;font-size:2.1rem;font-weight:700;color:var(--text)">₱${orders.length ? Math.round(totalRev / orders.length).toLocaleString() : 0}</p>
      </div>
    </div>
    <h3>Product Performance</h3>
    <div style="display:flex;flex-direction:column;gap:12px;margin-top:16px">
      ${topProd
				.map((p) => {
					const sold = orders.reduce(
						(s, o) =>
							s +
							o.items
								.filter((i) => i.id === p.id)
								.reduce((x, i) => x + i.qty, 0),
						0,
					);
					const rev = sold * p.price;
					const topSold = orders.reduce(
						(s, o) =>
							s +
							o.items
								.filter((i) => i.id === topProd[0]?.id)
								.reduce((x, i) => x + i.qty, 0),
						0,
					);
					const pct = topSold
						? Math.round((sold / Math.max(1, topSold)) * 100)
						: 0;
					return `<div style="display:flex;align-items:center;gap:16px">
          <span style="min-width:210px;font-size:.84rem;color:var(--text-2);font-weight:500">${p.name}</span>
          <div style="flex:1;height:28px;background:var(--cream-3);border-radius:60px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--sienna),var(--rose-lt));display:flex;align-items:center;padding:0 12px;font-size:.72rem;color:#fff;font-weight:600;min-width:${sold ? "60px" : "0"}">${sold ? `${sold} sold` : ""}</div>
          </div>
          <span style="font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:var(--sienna);min-width:100px;text-align:right">₱${rev.toLocaleString()}</span>
        </div>`;
				})
				.join("")}
    </div>`;
}

function setRating(n) {
	currentRating = n;
	document
		.querySelectorAll(".star")
		.forEach((s, i) => s.classList.toggle("lit", i < n));
}

function submitReview(e) {
	e.preventDefault();
	if (!currentRating) {
		showToast("Please select a star rating.");
		return;
	}
	const rev = {
		name: document.getElementById("revName").value,
		email: document.getElementById("revEmail").value,
		rating: currentRating,
		product: document.getElementById("revProduct").value,
		text: document.getElementById("revText").value,
		date: new Date().toLocaleDateString("en-PH"),
	};
	let saved = JSON.parse(localStorage.getItem("vkmj_reviews") || "[]");
	saved.unshift(rev);
	localStorage.setItem("vkmj_reviews", JSON.stringify(saved));
	renderReviewsList();
	e.target.reset();
	currentRating = 0;
	document.querySelectorAll(".star").forEach((s) => s.classList.remove("lit"));
	showToast("Thank you for your review!");
}

function renderReviewsList() {
	const el = document.getElementById("reviewsList");
	if (!el) return;
	const saved = JSON.parse(localStorage.getItem("vkmj_reviews") || "[]");
	const defaults = [
		{
			name: "Lara M.",
			rating: 5,
			product: "Crystal Luxe Cut Vase",
			text: "Absolutely stunning piece. The way it catches light in the morning is magical — it's the first thing guests comment on.",
			date: "Jan 2025",
		},
		{
			name: "Sofia R.",
			rating: 5,
			product: "GlowMist LED Vase",
			text: "I put this in my bedroom and it changed the whole ambiance. The soft glow is so calming. Worth every peso.",
			date: "Feb 2025",
		},
		{
			name: "Anna T.",
			rating: 4,
			product: "Bamboo Essence Vase",
			text: "Simple, natural, and beautiful. Paired it with some dried pampas grass and it looks like something from a design magazine.",
			date: "Mar 2025",
		},
	];
	const list = saved.length ? saved : defaults;
	el.innerHTML = list
		.map(
			(r) => `
    <div class="review-card">
      <div class="rc-stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
      <p class="rc-text">"${r.text}"</p>
      <p class="rc-author">${r.name}</p>
      ${r.product ? `<p class="rc-product">${r.product}</p>` : ""}
      <p class="rc-date">${r.date}</p>
    </div>`,
		)
		.join("");
}

function submitContact(e) {
	e.preventDefault();
	showToast("Message sent! We'll get back to you within 24 hours.");
	e.target.reset();
}

function showToast(msg) {
	const t = document.getElementById("toast");
	t.textContent = msg;
	t.classList.add("show");
	setTimeout(() => t.classList.remove("show"), 3200);
}
