const starterProducts = [
{ id: 1, name: "Alimento premium para gatos", category: "Alimento", price: 58900, stock: 24, sold: 148, rating: 4.8, ratingsCount: 32, image: "/ASSETS/imagenes/tienda/comidagato.jpg", description: "Alimento completo para gatos adultos, con nutrientes esenciales para apoyar su energía, digestión y pelaje." },
{ id: 2, name: "Ratón de juguete", category: "Juguetes", price: 12900, stock: 41, sold: 126, rating: 4.6, ratingsCount: 21, image: "/ASSETS/imagenes/tienda/raton.jpg", description: "Juguete ligero para estimular el instinto de juego y la actividad diaria de tu gato." },
{ id: 3, name: "Cama nube para mascotas", category: "Camas", price: 79900, stock: 8, sold: 93, rating: 4.9, ratingsCount: 18, image: "/ASSETS/imagenes/tienda/cama.jpg", description: "Cama suave y acogedora para que tu compañero descanse cómodamente." },
{ id: 4, name: "Collar ajustable", category: "Accesorios", price: 18900, stock: 35, sold: 71, rating: 4.5, ratingsCount: 14, image: "/ASSETS/imagenes/tienda/collar.jpg", description: "Collar ajustable, cómodo y práctico para el día a día de tu mascota." },
{ id: 5, name: "Champú suave", category: "Higiene", price: 24900, stock: 0, sold: 45, rating: 4.4, ratingsCount: 9, image: "/ASSETS/imagenes/tienda/champu.jpg", description: "Producto de higiene para acompañar la rutina de baño de tu mascota." },
{ id: 6, name: "Pelota interactiva", category: "Juguetes", price: 15900, stock: 19, sold: 38, rating: 4.7, ratingsCount: 11, image: "/ASSETS/imagenes/tienda/pelota.jpg", description: "Pelota para fomentar el movimiento, el juego y el enriquecimiento diario." },
{ id: 7, name: "Plato antideslizante", category: "Accesorios", price: 22900, stock: 17, sold: 24, rating: 4.2, ratingsCount: 6, image: "/ASSETS/imagenes/tienda/comidagato.jpg", description: "Plato práctico con base estable para servir alimento o agua." },
{ id: 8, name: "Kit de cepillado", category: "Higiene", price: 31900, stock: 12, sold: 19, rating: 4.6, ratingsCount: 7, image: "/ASSETS/imagenes/tienda/cepillo.jpg", description: "Accesorios básicos para ayudar a mantener el pelaje de tu mascota cuidado." }
];

const STORAGE_KEY = "saki_admin_products_v1";
let products = loadProducts();
let pendingDeleteId = null;
let activeDetailsId = null;

const $ = (selector) => document.querySelector(selector);
const productGrid = $("#productGrid");
const formModal = bootstrap.Modal.getOrCreateInstance($("#productFormModal"));
const detailsModal = bootstrap.Modal.getOrCreateInstance($("#productDetailsModal"));
const deleteModal = bootstrap.Modal.getOrCreateInstance($("#deleteProductModal"));
const toast = bootstrap.Toast.getOrCreateInstance($("#appToast"), { delay: 2600 });

function loadProducts() {
try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return starterProducts.map(p => ({ ...p }));

    const savedProducts = JSON.parse(saved);
    return savedProducts.map(product => {
    const starter = starterProducts.find(item => Number(item.id) === Number(product.id));
    // Actualiza solo la imagen; conserva los demás datos guardados del producto.
    return starter ? { ...product, image: starter.image } : product;
    });
} catch (e) {
    return starterProducts.map(p => ({ ...p }));
}
}
function saveProducts() {
try { localStorage.setItem(STORAGE_KEY, JSON.stringify(products)); }
catch (error) { showToast("No se pudo guardar en este navegador. Revisa el almacenamiento disponible."); }
}
function escapeHtml(value) {
return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[char]);
}
function money(value) {
return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(Number(value) || 0);
}
function stars(value) {
const rounded = Math.round(Number(value) || 0);
return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}
function showToast(message) {
$("#toastMessage").textContent = message;
toast.show();
}
function findProduct(id) { return products.find(p => p.id === Number(id)); }

function renderStats() {
$("#totalProducts").textContent = products.length;
$("#availableProducts").textContent = products.filter(p => Number(p.stock) > 0).length;
$("#totalSold").textContent = products.reduce((sum, p) => sum + (Number(p.sold) || 0), 0).toLocaleString("es-CO");
const rated = products.filter(p => Number(p.ratingsCount) > 0);
$("#topRating").textContent = rated.length
    ? (rated.reduce((sum, p) => sum + Number(p.rating || 0), 0) / rated.length).toFixed(1) + " ★"
    : "—";
}

function getVisibleProducts() {
const query = $("#searchInput").value.trim().toLocaleLowerCase("es");
const category = $("#categoryFilter").value;
const sort = $("#sortFilter").value;
let list = products.filter(p => {
    const matchesQuery = [p.name, p.category, p.description].some(v => String(v || "").toLocaleLowerCase("es").includes(query));
    return matchesQuery && (!category || p.category === category);
});
if (sort === "priceAsc") list.sort((a, b) => a.price - b.price);
else if (sort === "priceDesc") list.sort((a, b) => b.price - a.price);
else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
else if (sort === "sold") list.sort((a, b) => b.sold - a.sold);
else list.sort((a, b) => b.id - a.id);
return list;
}

function renderProducts() {
const list = getVisibleProducts();
productGrid.innerHTML = list.map(p => `
    <article class="product-card" data-open-details="${p.id}" tabindex="0" role="button" aria-label="Ver detalles de ${escapeHtml(p.name)}">
    <div class="product-image-wrap">
        <img class="product-image" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy"
            onerror="this.onerror=null;this.src='https://placehold.co/800x600/f2e9e9/456563?text=Producto';">
        ${p.sold >= 90 ? '<span class="product-badge best"><i class="bi bi-trophy-fill me-1"></i>Más vendido</span>' : '<span class="product-badge">' + escapeHtml(p.category) + '</span>'}
    </div>
    <div class="product-body">
        <div class="product-category">${escapeHtml(p.category)}</div>
        <h3 class="product-name">${escapeHtml(p.name)}</h3>
        <p class="product-desc">${escapeHtml(p.description)}</p>
        <div class="d-flex justify-content-between align-items-center gap-2">
        <span class="product-price">${money(p.price)}</span>
        <span class="stock-text">${Number(p.stock) > 0 ? `${Number(p.stock)} uds.` : '<span class="text-danger fw-bold">Agotado</span>'}</span>
        </div>
        <div class="mt-2"><span class="rating">${stars(p.rating)}</span> <span class="rating-count">${Number(p.rating || 0).toFixed(1)} (${Number(p.ratingsCount) || 0})</span></div>
        <div class="card-actions">
        <button type="button" class="details-btn" data-action="details" data-id="${p.id}">Ver detalles</button>
        <button type="button" class="icon-btn" data-action="edit" data-id="${p.id}" aria-label="Editar ${escapeHtml(p.name)}" title="Editar"><i class="bi bi-pencil"></i></button>
        <button type="button" class="icon-btn" data-action="delete" data-id="${p.id}" aria-label="Eliminar ${escapeHtml(p.name)}" title="Eliminar"><i class="bi bi-trash3"></i></button>
        </div>
    </div>
    </article>
`).join("");
$("#emptyState").classList.toggle("d-none", list.length !== 0);
productGrid.classList.toggle("d-none", list.length === 0);
renderStats();
renderBestSellers();
}

function renderBestSellers() {
const best = [...products].sort((a, b) => Number(b.sold) - Number(a.sold)).slice(0, 3);
$("#bestSellersList").innerHTML = best.length ? best.map((p, index) => `
    <div class="best-seller-row">
    <span class="fw-bold text-secondary" style="width:20px">0${index + 1}</span>
    <img src="${escapeHtml(p.image)}" alt="" onerror="this.onerror=null;this.src='https://placehold.co/100x100/f2e9e9/456563?text=+';">
    <div class="flex-grow-1 min-w-0"><div class="fw-bold">${escapeHtml(p.name)}</div><div class="small text-secondary">${escapeHtml(p.category)}</div></div>
    <div class="text-end"><div class="fw-bold">${Number(p.sold).toLocaleString("es-CO")}</div><div class="small text-secondary">vendidos</div></div>
    </div>`).join("") : '<p class="text-secondary mb-0">Aún no hay productos en el catálogo.</p>';
}

function resetForm() {
$("#productForm").reset();
$("#productId").value = "";
$("#productSold").value = 0;
$("#productFormTitle").textContent = "Registrar producto";
$("#saveProductText").textContent = "Agregar producto";
}
function openEditForm(id) {
const p = findProduct(id);
if (!p) return;
resetForm();
$("#productId").value = p.id;
$("#productName").value = p.name;
$("#productCategory").value = p.category;
$("#productPrice").value = p.price;
$("#productStock").value = p.stock;
$("#productSold").value = p.sold;
$("#productImage").value = p.image;
$("#productDescription").value = p.description;
$("#productFormTitle").textContent = "Editar producto";
$("#saveProductText").textContent = "Guardar cambios";
formModal.show();
}

function openDetails(id) {
const p = findProduct(id);
if (!p) return;
activeDetailsId = p.id;
$("#detailsTitle").textContent = p.name;
$("#detailsBody").innerHTML = `
    <div class="row g-4 align-items-start">
    <div class="col-md-5">
        <img class="details-image" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}"
            onerror="this.onerror=null;this.src='https://placehold.co/800x600/f2e9e9/456563?text=Producto';">
    </div>
    <div class="col-md-7">
        <span class="eyebrow">${escapeHtml(p.category)}</span>
        <h3 class="mt-3 mb-2">${escapeHtml(p.name)}</h3>
        <div class="rating fs-5">${stars(p.rating)} <span class="rating-count">${Number(p.rating || 0).toFixed(1)} · ${Number(p.ratingsCount) || 0} calificaciones</span></div>
        <div class="details-price my-3">${money(p.price)}</div>
        <p class="text-secondary">${escapeHtml(p.description)}</p>
        <div class="row g-2 my-3">
        <div class="col-6"><div class="p-3 rounded-4" style="background:#e7f3f2"><div class="small text-secondary">Existencias</div><strong>${Number(p.stock)} unidades</strong></div></div>
        <div class="col-6"><div class="p-3 rounded-4" style="background:#fff3dd"><div class="small text-secondary">Vendidos</div><strong>${Number(p.sold)} unidades</strong></div></div>
        </div>
        <hr>
        <label class="form-label" for="newRating">Agregar una calificación de prueba</label>
        <div class="d-flex gap-2">
        <select class="form-select" id="newRating" aria-label="Calificación de 1 a 5 estrellas">
            <option value="5">★★★★★ — Excelente</option>
            <option value="4">★★★★☆ — Muy bueno</option>
            <option value="3">★★★☆☆ — Bueno</option>
            <option value="2">★★☆☆☆ — Regular</option>
            <option value="1">★☆☆☆☆ — Malo</option>
        </select>
        <button class="primary-btn flex-shrink-0" id="submitRatingBtn" type="button">Calificar</button>
        </div>
        <div class="field-help">Demo: esta acción simula una nueva valoración y actualiza el promedio localmente.</div>
        <div class="d-flex gap-2 mt-4">
        <button class="secondary-btn" type="button" id="detailsEditBtn"><i class="bi bi-pencil me-1"></i>Editar</button>
        <button class="secondary-btn" type="button" id="detailsDeleteBtn"><i class="bi bi-trash3 me-1"></i>Eliminar</button>
        </div>
    </div>
    </div>`;
detailsModal.show();
}

function requestDelete(id) {
const p = findProduct(id);
if (!p) return;
pendingDeleteId = p.id;
$("#deleteMessage").textContent = `Se eliminará “${p.name}” del catálogo. Esta acción no se puede deshacer.`;
deleteModal.show();
}

$("#openCreateBtn").addEventListener("click", resetForm);
$("#productForm").addEventListener("submit", event => {
event.preventDefault();
const idValue = $("#productId").value;
const existing = idValue ? findProduct(idValue) : null;
const product = {
    id: existing ? existing.id : Date.now(),
    name: $("#productName").value.trim(),
    category: $("#productCategory").value,
    price: Number($("#productPrice").value),
    stock: Number($("#productStock").value),
    sold: Number($("#productSold").value) || 0,
    image: $("#productImage").value.trim(),
    description: $("#productDescription").value.trim(),
    rating: existing ? Number(existing.rating) || 0 : 0,
    ratingsCount: existing ? Number(existing.ratingsCount) || 0 : 0
};
if (!product.name || !product.category || !product.image || !product.description ||
    !Number.isFinite(product.price) || product.price < 0 ||
    !Number.isInteger(product.stock) || product.stock < 0 ||
    !Number.isInteger(product.sold) || product.sold < 0) {
    showToast("Revisa los campos e ingresa valores válidos.");
    return;
}
if (existing) {
    products = products.map(p => p.id === existing.id ? product : p);
    showToast("Producto actualizado correctamente.");
} else {
    products.push(product);
    showToast("¡Producto agregado al catálogo!");
}
saveProducts();
renderProducts();
formModal.hide();
resetForm();
});

productGrid.addEventListener("click", event => {
const actionButton = event.target.closest("button[data-action]");
if (actionButton) {
    event.stopPropagation();
    const { action, id } = actionButton.dataset;
    if (action === "details") openDetails(id);
    if (action === "edit") openEditForm(id);
    if (action === "delete") requestDelete(id);
    return;
}
const card = event.target.closest("[data-open-details]");
if (card) openDetails(card.dataset.openDetails);
});
productGrid.addEventListener("keydown", event => {
if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-open-details]")) {
    event.preventDefault();
    openDetails(event.target.dataset.openDetails);
}
});

$("#detailsBody").addEventListener("click", event => {
if (event.target.closest("#submitRatingBtn")) {
    const p = findProduct(activeDetailsId);
    if (!p) return;
    const newRating = Number($("#newRating").value);
    const count = Number(p.ratingsCount) || 0;
    p.rating = count ? ((Number(p.rating) * count + newRating) / (count + 1)) : newRating;
    p.ratingsCount = count + 1;
    saveProducts();
    renderProducts();
    openDetails(p.id);
    showToast("¡Calificación agregada!");
}
if (event.target.closest("#detailsEditBtn")) {
    const id = activeDetailsId;
    detailsModal.hide();
    openEditForm(id);
}
if (event.target.closest("#detailsDeleteBtn")) {
    const id = activeDetailsId;
    detailsModal.hide();
    requestDelete(id);
}
});

$("#confirmDeleteBtn").addEventListener("click", () => {
if (pendingDeleteId === null) return;
products = products.filter(p => p.id !== pendingDeleteId);
saveProducts();
renderProducts();
pendingDeleteId = null;
deleteModal.hide();
showToast("Producto eliminado del catálogo.");
});

$("#searchInput").addEventListener("input", renderProducts);
$("#categoryFilter").addEventListener("change", renderProducts);
$("#sortFilter").addEventListener("change", renderProducts);
$("#clearSearchBtn").addEventListener("click", () => {
$("#searchInput").value = "";
$("#categoryFilter").value = "";
$("#sortFilter").value = "recent";
renderProducts();
});
$("#productFormModal").addEventListener("hidden.bs.modal", resetForm);

renderProducts();