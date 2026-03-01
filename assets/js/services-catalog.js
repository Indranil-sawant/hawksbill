/**
 * SERVICES PAGE LOGIC (v1 - Subcategory Landing Pages)
 * Adapted from PRODUCTS PAGE pattern.
 *
 * Features:
 * - Dynamic Sidebar with Subcategories
 * - Main View: Service Category Cards (existing HTML cards preserved)
 * - Subcategory View: Dedicated Landing Page with Hero + Item Cards
 * - Pseudo-Routing via URL Search Params (?category=gas_generators&sub=nitrogen_generators)
 * - Global Enquiry Modal with product/service name pre-fill
 */

import SERVICES_CATALOG from './services-data.js';
import SERVICE_SUBCATEGORY_META from './service-subcategory-data.js';

const DEFAULT_ICON = '⚙️';

document.addEventListener('DOMContentLoaded', () => {
    initServiceCatalog();
    // NOTE: Modal open/close + form submit handled by contact-handler.js
    setupServiceSearch();

    // Listen for browser back/forward buttons
    window.addEventListener('popstate', handleServiceRouting);
});

// ─────────────────────────────────────────────────────────────────
// 0. BOOTSTRAP
// ─────────────────────────────────────────────────────────────────

function initServiceCatalog() {
    const navRoot = document.getElementById('service-sidebar-nav-list');
    if (navRoot) renderServiceSidebar(navRoot);
    handleServiceRouting();
}

// ─────────────────────────────────────────────────────────────────
// 1. ROUTING HANDLER
// ─────────────────────────────────────────────────────────────────

function handleServiceRouting() {
    const params = new URLSearchParams(window.location.search);
    const subKey = params.get('sub');
    const parentKey = params.get('category');

    const root = document.getElementById('services-root');
    const staticGrid = document.getElementById('servicesGrid');
    const staticProductList = document.getElementById('product-list');
    const searchContainer = document.querySelector('.service-search-container');
    const pageTitle = document.querySelector('.page-title');

    if (!root) return;

    root.innerHTML = '';

    if (subKey && parentKey) {
        // ── SUBCATEGORY VIEW ──
        if (staticGrid) staticGrid.closest('section')?.classList.add('d-none');
        if (staticProductList) staticProductList.classList.add('d-none');
        if (searchContainer) searchContainer.classList.add('d-none');
        if (pageTitle) pageTitle.style.display = 'none';

        renderServiceSubcategoryPage(root, parentKey, subKey);
        updateServiceSidebarActiveState(parentKey, subKey);
    } else {
        // ── MAIN CATALOG VIEW ──
        if (staticGrid) staticGrid.closest('section')?.classList.remove('d-none');
        if (staticProductList) staticProductList.classList.remove('d-none');
        if (searchContainer) searchContainer.classList.remove('d-none');
        if (pageTitle) pageTitle.style.display = '';

        updateServiceSidebarActiveState(parentKey || null, null);

        // Scroll to a specific category card if requested
        if (parentKey) {
            setTimeout(() => {
                const el = document.querySelector(`[data-category="${parentKey}"]`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 400);
        }
    }
}

// ─────────────────────────────────────────────────────────────────
// 2. SIDEBAR
// ─────────────────────────────────────────────────────────────────

function renderServiceSidebar(navRoot) {
    navRoot.innerHTML = '';

    Object.entries(SERVICES_CATALOG).forEach(([key, data]) => {
        const li = document.createElement('li');
        li.className = 'svc-nav-item';

        // Parent link
        const link = document.createElement('a');
        link.href = `?category=${key}`;
        link.className = 'svc-nav-link-parent';
        link.dataset.key = key;
        link.innerHTML = `<i class="bi ${data.icon || 'bi-box'}"></i><span>${data.title}</span>`;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            serviceNavigateTo(key, null);
        });

        li.appendChild(link);

        // Subcategories
        if (data.subcategories) {
            const subUl = document.createElement('ul');
            subUl.className = 'svc-nav-sub-list';

            Object.keys(data.subcategories).forEach(subKey => {
                const subLi = document.createElement('li');
                const subLink = document.createElement('a');
                subLink.href = `?category=${key}&sub=${subKey}`;
                subLink.className = 'svc-nav-link-child';
                subLink.dataset.parent = key;
                subLink.dataset.sub = subKey;
                subLink.textContent = formatTitle(subKey);

                subLink.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    serviceNavigateTo(key, subKey);
                });

                subLi.appendChild(subLink);
                subUl.appendChild(subLi);
            });

            li.appendChild(subUl);
        }

        navRoot.appendChild(li);
    });
}

function updateServiceSidebarActiveState(parentKey, subKey) {
    document.querySelectorAll('.svc-nav-link-parent, .svc-nav-link-child').forEach(a => {
        a.classList.remove('active');
    });

    if (parentKey) {
        const pLink = document.querySelector(`.svc-nav-link-parent[data-key="${parentKey}"]`);
        if (pLink) {
            pLink.classList.add('active');
            // Expand sublists
            const subList = pLink.nextElementSibling;
            if (subList) subList.classList.add('expanded');
        }
    }

    if (subKey) {
        const sLink = document.querySelector(`.svc-nav-link-child[data-parent="${parentKey}"][data-sub="${subKey}"]`);
        if (sLink) sLink.classList.add('active');
    }
}

// ─────────────────────────────────────────────────────────────────
// 3. SUBCATEGORY LANDING PAGE
// ─────────────────────────────────────────────────────────────────

function renderServiceSubcategoryPage(root, parentKey, subKey) {
    const parentData = SERVICES_CATALOG[parentKey];
    if (!parentData) {
        root.innerHTML = '<h3 class="text-center py-5">Category not found.</h3>';
        return;
    }

    const items = parentData.subcategories?.[subKey];
    if (!items) {
        root.innerHTML = '<h3 class="text-center py-5">Subcategory not found.</h3>';
        return;
    }

    const meta = SERVICE_SUBCATEGORY_META[subKey]
        || SERVICE_SUBCATEGORY_META[parentKey]
        || SERVICE_SUBCATEGORY_META.default;

    const itemsArray = Array.isArray(items) ? items : [];

    const container = document.createElement('div');
    container.className = 'svc-subcategory-view';

    // ── Back Button ──
    const backBtn = document.createElement('a');
    backBtn.className = 'svc-back-btn';
    backBtn.href = `?category=${parentKey}`;
    backBtn.innerHTML = '← Back to Services';
    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        serviceNavigateTo(parentKey, null);
    });
    container.appendChild(backBtn);

    // ── Breadcrumb ──
    const crumb = document.createElement('div');
    crumb.className = 'svc-breadcrumb';
    crumb.innerHTML = `
        <span class="crumb-home" onclick="serviceNavigateTo(null,null)" style="cursor:pointer">Services</span>
        <i class="bi bi-chevron-right"></i>
        <span class="crumb-parent" onclick="serviceNavigateTo('${parentKey}',null)" style="cursor:pointer">${parentData.title}</span>
        <i class="bi bi-chevron-right"></i>
        <span class="crumb-current">${formatTitle(subKey)}</span>
    `;
    container.appendChild(crumb);

    // ── Hero Banner ──
    const hero = document.createElement('div');
    hero.className = 'svc-sub-hero';
    hero.style.backgroundImage = `url('${meta.image}')`;
    hero.innerHTML = `
        <div class="svc-sub-hero-overlay"></div>
        <div class="svc-sub-hero-content">
            <div class="svc-sub-hero-icon"><i class="bi ${parentData.icon || 'bi-box'}"></i></div>
            <h1 class="svc-sub-hero-title">${formatTitle(subKey)}</h1>
            <p class="svc-sub-hero-desc">${meta.description}</p>
            <button class="svc-enquire-all-btn enquiry-trigger" data-product="${formatTitle(subKey)} (${parentData.title})">
                Enquire About This Category <i class="bi bi-arrow-right-circle ms-2"></i>
            </button>
        </div>
    `;
    container.appendChild(hero);

    // ── Section Title ──
    const sectionTitle = document.createElement('div');
    sectionTitle.className = 'svc-items-heading';
    sectionTitle.innerHTML = `
        <h2>Available ${formatTitle(subKey)} Products &amp; Services</h2>
        <p>${itemsArray.length} item${itemsArray.length !== 1 ? 's' : ''} available</p>
    `;
    container.appendChild(sectionTitle);

    // ── Items Grid ──
    const grid = document.createElement('div');
    grid.className = 'svc-items-grid';

    if (itemsArray.length > 0) {
        itemsArray.forEach(itemName => {
            const card = createServiceItemCard(itemName, parentData.title, parentData.icon);
            grid.appendChild(card);
        });
    } else {
        grid.innerHTML = '<p class="text-center py-4">No items listed in this section.</p>';
    }

    container.appendChild(grid);
    root.appendChild(container);

    // Scroll to top of content
    const headerEl = document.getElementById('header');
    const headerH = headerEl ? headerEl.offsetHeight : 80;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─────────────────────────────────────────────────────────────────
// 4. CARD CREATORS
// ─────────────────────────────────────────────────────────────────

function createServiceItemCard(name, categoryName, iconClass) {
    const el = document.createElement('div');
    el.className = 'svc-item-card';
    el.innerHTML = `
        <div class="svc-item-card-icon">
            <i class="bi ${iconClass || 'bi-gear'}"></i>
        </div>
        <div class="svc-item-card-body">
            <div class="svc-item-card-category">${categoryName}</div>
            <h3 class="svc-item-card-title">${name}</h3>
            <button class="svc-item-card-btn enquiry-trigger" data-product="${name}">
                Enquire Now <i class="bi bi-arrow-right"></i>
            </button>
        </div>
    `;
    return el;
}

// ─────────────────────────────────────────────────────────────────
// 5. NAVIGATION HELPER
// ─────────────────────────────────────────────────────────────────

function serviceNavigateTo(category, sub) {
    let url = window.location.pathname;
    if (category) {
        url += `?category=${category}`;
        if (sub) url += `&sub=${sub}`;
    }
    window.history.pushState({}, '', url);
    handleServiceRouting();
}

// Expose for inline onclick (breadcrumbs)
window.serviceNavigateTo = serviceNavigateTo;

// ─────────────────────────────────────────────────────────────────
// 6. SEARCH (for main catalog view — existing cards)
// ─────────────────────────────────────────────────────────────────

function setupServiceSearch() {
    const input = document.getElementById('serviceSearch');
    if (!input) return;

    // This hooks into existing services-search.js logic — no conflict.
    // We only add the routing redirect if a subcategory view is active.
    input.addEventListener('input', (e) => {
        const term = e.target.value.trim();
        const params = new URLSearchParams(window.location.search);
        if (params.get('sub') && term.length > 0) {
            // Reset to main catalog view so search can work across all cards
            window.history.pushState({}, '', window.location.pathname);
            handleServiceRouting();
        }
    });
}

// ─────────────────────────────────────────────────────────────────
// 7. ENQUIRY MODAL
// ─────────────────────────────────────────────────────────────────

function setupServiceEnquiryModal() {
    const modal = document.getElementById('svc-enquiry-modal');
    if (!modal) return;

    const closeBtn = document.getElementById('svc-modal-close');
    const form = document.getElementById('svc-enquiry-form');

    function openModal(productName) {
        document.getElementById('svc-modal-product-name').textContent = productName || 'Service';
        document.getElementById('svc-form-product-name').value = productName || 'General Service';
        document.getElementById('svc-form-page-url').value = window.location.href;

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(() => {
            const status = document.getElementById('svc-enquiry-status');
            if (status) status.textContent = '';
        }, 400);
    }

    // Open via delegation — works for dynamically created buttons too
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.enquiry-trigger');
        if (trigger) {
            e.preventDefault();
            const productName = trigger.dataset.product || trigger.textContent.trim();
            openModal(productName);
        }
    });



    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    // Submit handler (hidden iframe / Google Apps Script approach)
    if (form) {
        form.addEventListener('submit', (e) => {
            const status = document.getElementById('svc-enquiry-status');
            if (status) {
                status.textContent = 'Sending enquiry…';
                status.className = 'svc-status sending';
            }

            setTimeout(() => {
                if (status) {
                    status.textContent = '✓ Enquiry Sent Successfully!';
                    status.className = 'svc-status success';
                }
                form.reset();
                setTimeout(closeModal, 2000);
            }, 1500);
        });
    }
}

// ─────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────

function formatTitle(str) {
    if (!str) return '';
    return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
