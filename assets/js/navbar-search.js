/**
 * NAVBAR INLINE SEARCH — Hawksbill Technik
 * Always-visible search bar in the navbar (desktop).
 * Mobile: full-width slide-down overlay triggered by search icon.
 */

import SERVICES_CATALOG from './services-data.js';

const CATEGORY_ICONS = {
    instrumentation_fittings: 'bi-tools',
    gas_generators:         'bi-lightning-charge',
    sampling_systems:       'bi-droplet-half',
    analytical_instruments: 'bi-speedometer',
    industrial_projects:    'bi-gear-wide-connected',
    laboratory_accessories: 'bi-stars',
};

const TYPE_COLORS = {
    Service:     '#0ea5e9',
    Subcategory: '#8b5cf6',
    Item:        '#64748b',
};

document.addEventListener('DOMContentLoaded', () => {
    const index = buildIndex();

    // ── Desktop inline search bar ──────────────────────────────────
    initDesktopSearch(index);

    // ── Mobile overlay search ──────────────────────────────────────
    initMobileSearch(index);
});

// ─── Desktop Search ─────────────────────────────────────────────
function initDesktopSearch(index) {
    const input    = document.getElementById('nav-search-input');
    const dropdown = document.getElementById('nav-search-dropdown');
    if (!input || !dropdown) return;

    input.addEventListener('input', () => {
        const term = input.value.trim();
        if (!term) { hideDropdown(dropdown); return; }
        renderDropdown(term, index, dropdown);
    });

    input.addEventListener('focus', () => {
        if (!input.value.trim()) renderCategories(index, dropdown);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#nav-search-bar')) hideDropdown(dropdown);
    });

    input.addEventListener('keydown', (e) => {
        handleKeyNav(e, dropdown, input);
    });
}

// ─── Mobile Overlay Search ──────────────────────────────────────
function initMobileSearch(index) {
    const trigger  = document.getElementById('mobile-search-trigger');
    const overlay  = document.getElementById('mobile-search-overlay');
    const closeBtn = document.getElementById('mobile-search-close');
    const input    = document.getElementById('mobile-search-input');
    const dropdown = document.getElementById('mobile-search-dropdown');

    if (!trigger || !overlay || !input || !dropdown) return;

    // ── Open ──────────────────────────────────────────────────────
    trigger.addEventListener('click', () => openOverlay());

    // ── Close via X button ────────────────────────────────────────
    if (closeBtn) closeBtn.addEventListener('click', () => closeOverlay());

    // ── Close on outside click ────────────────────────────────────
    overlay.addEventListener('click', (e) => {
        // Only close if the click was directly on the backdrop (not inner content)
        if (e.target === overlay) closeOverlay();
    });

    // ── Escape key ───────────────────────────────────────────────
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
            closeOverlay();
        }
    });

    // ── Live search input ─────────────────────────────────────────
    input.addEventListener('input', () => {
        const term = input.value.trim();
        if (!term) { hideMsoDropdown(dropdown); return; }
        renderMobileDropdown(term, index, dropdown);
    });

    // Show category shortcuts when focused on empty input
    input.addEventListener('focus', () => {
        if (!input.value.trim()) renderMobileCategories(index, dropdown);
    });

    // ── Keyboard nav inside mobile overlay ────────────────────────
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { closeOverlay(); return; }
        handleKeyNav(e, dropdown, input);
    });

    // ── Helpers ───────────────────────────────────────────────────
    function openOverlay() {
        overlay.removeAttribute('hidden');
        // Force reflow so the CSS transition fires
        overlay.getBoundingClientRect();
        overlay.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // prevent background scroll on iOS
        // Auto-focus the input
        setTimeout(() => input.focus(), 50);
    }

    function closeOverlay() {
        overlay.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hideMsoDropdown(dropdown);
        input.value = '';
        // Re-hide after transition ends
        overlay.addEventListener('transitionend', () => {
            if (!overlay.classList.contains('is-open')) {
                overlay.setAttribute('hidden', '');
            }
        }, { once: true });
    }
}

// ─── Mobile dropdown helpers ─────────────────────────────────────
function hideMsoDropdown(dropdown) {
    dropdown.innerHTML = '';
    dropdown.classList.remove('active');
}

function renderMobileDropdown(term, index, dropdown) {
    const q = term.toLowerCase();
    const matches = index
        .filter(e => e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q))
        .sort((a, b) => {
            const aS = a.title.toLowerCase().startsWith(q);
            const bS = b.title.toLowerCase().startsWith(q);
            if (aS !== bS) return aS ? -1 : 1;
            const order = { Service: 0, Subcategory: 1, Item: 2 };
            return (order[a.type] ?? 3) - (order[b.type] ?? 3);
        })
        .slice(0, 9);

    dropdown.innerHTML = '';

    if (matches.length === 0) {
        dropdown.innerHTML = `<div class="nsd-empty">No results for "<strong>${esc(term)}</strong>"</div>`;
        dropdown.classList.add('active');
        return;
    }

    matches.forEach(res => {
        const item = document.createElement('div');
        item.className = 'nsd-item';
        item.innerHTML = `
            <a href="${res.url}" class="nsd-link">
                <span class="nsd-icon"><i class="bi ${res.icon}"></i></span>
                <span class="nsd-body">
                    <span class="nsd-title">${highlight(res.title, term)}</span>
                    <span class="nsd-cat">${esc(res.category)}</span>
                </span>
                <span class="nsd-badge" style="color:${TYPE_COLORS[res.type]}">${res.type}</span>
            </a>
        `;
        dropdown.appendChild(item);
    });

    dropdown.classList.add('active');
}

function renderMobileCategories(index, dropdown) {
    const cats = index.filter(e => e.type === 'Service').slice(0, 6);
    dropdown.innerHTML = `<div class="nsd-header">Browse Categories</div>`;
    cats.forEach(res => {
        const item = document.createElement('div');
        item.className = 'nsd-item';
        item.innerHTML = `
            <a href="${res.url}" class="nsd-link">
                <span class="nsd-icon"><i class="bi ${res.icon}"></i></span>
                <span class="nsd-body">
                    <span class="nsd-title">${esc(res.title)}</span>
                    <span class="nsd-cat">Service Category</span>
                </span>
            </a>
        `;
        dropdown.appendChild(item);
    });
    dropdown.classList.add('active');
}

// ─── Shared keyboard navigation ──────────────────────────────────
function handleKeyNav(e, dropdown, input) {
    const items  = dropdown.querySelectorAll('.nsd-item');
    const active = dropdown.querySelector('.nsd-item.focus');
    let idx = [...items].indexOf(active);

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        active?.classList.remove('focus');
        idx = (idx + 1) % items.length;
        items[idx]?.classList.add('focus');
        items[idx]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        active?.classList.remove('focus');
        idx = idx <= 0 ? items.length - 1 : idx - 1;
        items[idx]?.classList.add('focus');
        items[idx]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
        const link = active?.querySelector('a') ?? dropdown.querySelector('.nsd-item a');
        if (link) { link.click(); hideDropdown(dropdown); }
    }
}

// ─── Desktop dropdown visibility ────────────────────────────────
function hideDropdown(dropdown) {
    dropdown.innerHTML = '';
    dropdown.classList.remove('active');
}

// ─── Render search results (desktop) ────────────────────────────
function renderDropdown(term, index, dropdown) {
    const q = term.toLowerCase();

    const matches = index
        .filter(e => e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q))
        .sort((a, b) => {
            const aS = a.title.toLowerCase().startsWith(q);
            const bS = b.title.toLowerCase().startsWith(q);
            if (aS !== bS) return aS ? -1 : 1;
            const order = { Service: 0, Subcategory: 1, Item: 2 };
            return (order[a.type] ?? 3) - (order[b.type] ?? 3);
        })
        .slice(0, 9);

    dropdown.innerHTML = '';

    if (matches.length === 0) {
        dropdown.innerHTML = `<div class="nsd-empty">No results for "<strong>${esc(term)}</strong>"</div>`;
        dropdown.classList.add('active');
        return;
    }

    matches.forEach(res => {
        const item = document.createElement('div');
        item.className = 'nsd-item';
        item.innerHTML = `
            <a href="${res.url}" class="nsd-link">
                <span class="nsd-icon"><i class="bi ${res.icon}"></i></span>
                <span class="nsd-body">
                    <span class="nsd-title">${highlight(res.title, term)}</span>
                    <span class="nsd-cat">${esc(res.category)}</span>
                </span>
                <span class="nsd-badge" style="color:${TYPE_COLORS[res.type]}">${res.type}</span>
            </a>
        `;
        dropdown.appendChild(item);
    });

    dropdown.classList.add('active');
}

// ─── Show category shortcuts when bar is focused empty (desktop) ─
function renderCategories(index, dropdown) {
    const cats = index.filter(e => e.type === 'Service').slice(0, 6);
    dropdown.innerHTML = `<div class="nsd-header">Browse Categories</div>`;
    cats.forEach(res => {
        const item = document.createElement('div');
        item.className = 'nsd-item';
        item.innerHTML = `
            <a href="${res.url}" class="nsd-link">
                <span class="nsd-icon"><i class="bi ${res.icon}"></i></span>
                <span class="nsd-body">
                    <span class="nsd-title">${esc(res.title)}</span>
                    <span class="nsd-cat">Service Category</span>
                </span>
            </a>
        `;
        dropdown.appendChild(item);
    });
    dropdown.classList.add('active');
}

// ─── Build flat search index ─────────────────────────────────────
function buildIndex() {
    const idx  = [];
    const base = getBase();

    Object.entries(SERVICES_CATALOG).forEach(([catKey, data]) => {
        const icon = CATEGORY_ICONS[catKey] || 'bi-box';

        idx.push({ type: 'Service', title: data.title, category: 'Category',
            url: `${base}service-details.html?category=${catKey}`, icon });

        Object.entries(data.subcategories || {}).forEach(([subKey, items]) => {
            const sub = fmt(subKey);
            idx.push({ type: 'Subcategory', title: sub, category: data.title,
                url: `${base}service-details.html?category=${catKey}&sub=${subKey}`, icon });

            items.forEach(item => {
                idx.push({ type: 'Item', title: item, category: `${data.title} › ${sub}`,
                    url: `${base}service-details.html?category=${catKey}&sub=${subKey}`, icon });
            });
        });
    });

    return idx;
}

// ─── Helpers ────────────────────────────────────────────────────
function highlight(text, term) {
    const safe = esc(text);
    const re   = new RegExp(`(${escRe(esc(term))})`, 'gi');
    return safe.replace(re, '<mark class="nsd-hl">$1</mark>');
}
function esc(s)   { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function fmt(s)   { return s.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' '); }
function getBase() {
    const d = window.location.pathname.split('/').filter(Boolean).length;
    return d > 1 ? '../'.repeat(d - 1) : '';
}
