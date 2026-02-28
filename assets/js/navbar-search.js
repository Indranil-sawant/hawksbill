/**
 * NAVBAR GLOBAL SEARCH
 * Hawksbill Technik – service-details.html search integration
 *
 * Features:
 * - Toggle search panel with icon click (instant open/close)
 * - Keyboard shortcut: / or Ctrl+K opens search
 * - Escape closes
 * - Indexes SERVICES_CATALOG (categories + subcategories + all items)
 * - Deep-links to service-details.html?category=X&sub=Y
 * - Highlight matched text in results
 * - Works on every page (index.html, service-details.html, etc.)
 */

import SERVICES_CATALOG from './services-data.js';

// ─── Icon map (Bootstrap Icons class per category) ───────────────
const CATEGORY_ICONS = {
    fitok_instrumentation: 'bi-tools',
    gas_generators:        'bi-lightning-charge',
    sampling_systems:      'bi-droplet-half',
    analytical_instruments:'bi-speedometer',
    industrial_projects:   'bi-gear-wide-connected',
    laboratory_accessories:'bi-stars',
};
const DEFAULT_ICON = 'bi-box';

// ─── Type badge colors ────────────────────────────────────────────
const TYPE_COLORS = {
    Service:     '#0ea5e9',
    Subcategory: '#8b5cf6',
    Item:        '#64748b',
};

document.addEventListener('DOMContentLoaded', () => {
    initNavbarSearch();
});

function initNavbarSearch() {
    const header = document.querySelector('#header .container');
    if (!header) return;

    // Build the search index from SERVICES_CATALOG
    const index = buildIndex();

    // ── Create Search Toggle Button ──
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'navbar-search-toggle';
    toggleBtn.className = 'navbar-search-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle search');
    toggleBtn.innerHTML = '<i class="bi bi-search"></i>';

    // Insert before .btn-getstarted (or append to header)
    const cta = header.querySelector('.btn-getstarted');
    if (cta) {
        header.insertBefore(toggleBtn, cta);
    } else {
        header.appendChild(toggleBtn);
    }

    // ── Create Fullwidth Search Panel (appended to <header>) ──
    const searchPanel = document.createElement('div');
    searchPanel.id = 'navbar-search-panel';
    searchPanel.className = 'navbar-search-panel';
    searchPanel.setAttribute('aria-hidden', 'true');
    searchPanel.innerHTML = `
        <div class="nsp-inner container">
            <div class="nsp-input-row">
                <i class="bi bi-search nsp-search-icon"></i>
                <input
                    type="text"
                    id="navbar-search-input"
                    class="nsp-input"
                    placeholder="Search services, products, categories…"
                    autocomplete="off"
                    spellcheck="false"
                >
                <kbd class="nsp-hint">ESC</kbd>
            </div>
            <div id="navbar-search-results" class="nsp-results" role="listbox" aria-label="Search results"></div>
        </div>
    `;

    const headerEl = document.getElementById('header');
    headerEl.appendChild(searchPanel);

    const input  = document.getElementById('navbar-search-input');
    const results = document.getElementById('navbar-search-results');
    let isOpen = false;

    // ── Open / Close ──────────────────────────────────────────────
    function openSearch() {
        isOpen = true;
        searchPanel.classList.add('open');
        searchPanel.setAttribute('aria-hidden', 'false');
        toggleBtn.classList.add('active');
        toggleBtn.querySelector('i').className = 'bi bi-x-lg';
        // Single tick lets visibility:visible propagate before focus
        setTimeout(() => input.focus(), 0);
    }

    function closeSearch() {
        isOpen = false;
        searchPanel.classList.remove('open');
        searchPanel.setAttribute('aria-hidden', 'true');
        toggleBtn.classList.remove('active');
        toggleBtn.querySelector('i').className = 'bi bi-search';
        results.innerHTML = '';
        input.value = '';
    }

    // Toggle on icon click
    toggleBtn.addEventListener('click', () => {
        isOpen ? closeSearch() : openSearch();
    });

    // Keyboard shortcut: / or Ctrl+K
    document.addEventListener('keydown', (e) => {
        if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && !isOpen) {
            const tag = document.activeElement.tagName.toLowerCase();
            if (tag !== 'input' && tag !== 'textarea') {
                e.preventDefault();
                openSearch();
            }
        }
        if (e.key === 'Escape' && isOpen) {
            closeSearch();
        }
    });

    // Click outside panel to close
    document.addEventListener('click', (e) => {
        if (isOpen && !searchPanel.contains(e.target) && e.target !== toggleBtn) {
            closeSearch();
        }
    });

    // ── Search Input ─────────────────────────────────────────────
    input.addEventListener('input', () => {
        const term = input.value.trim();
        renderResults(term, index, results);
    });

    // Keyboard navigation in results
    input.addEventListener('keydown', (e) => {
        const items = results.querySelectorAll('.nsp-result-item');
        const focused = results.querySelector('.nsp-result-item.kbd-focus');
        let idx = Array.from(items).indexOf(focused);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (focused) focused.classList.remove('kbd-focus');
            idx = (idx + 1) % items.length;
            items[idx]?.classList.add('kbd-focus');
            items[idx]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (focused) focused.classList.remove('kbd-focus');
            idx = idx <= 0 ? items.length - 1 : idx - 1;
            items[idx]?.classList.add('kbd-focus');
            items[idx]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
            const link = focused?.querySelector('a');
            if (link) { link.click(); closeSearch(); }
        }
    });
}

// ─── Build Flat Search Index ──────────────────────────────────────
function buildIndex() {
    const idx = [];
    const base = getBasePath();

    Object.entries(SERVICES_CATALOG).forEach(([catKey, data]) => {
        const icon = CATEGORY_ICONS[catKey] || DEFAULT_ICON;

        // Category itself
        idx.push({
            type: 'Service',
            title: data.title,
            category: 'Category',
            url: `${base}service-details.html?category=${catKey}`,
            icon,
        });

        // Subcategories + items
        if (data.subcategories) {
            Object.entries(data.subcategories).forEach(([subKey, items]) => {
                const subTitle = formatTitle(subKey);

                // Subcategory
                idx.push({
                    type: 'Subcategory',
                    title: subTitle,
                    category: data.title,
                    url: `${base}service-details.html?category=${catKey}&sub=${subKey}`,
                    icon,
                });

                // Individual items
                items.forEach(item => {
                    idx.push({
                        type: 'Item',
                        title: item,
                        category: `${data.title} › ${subTitle}`,
                        url: `${base}service-details.html?category=${catKey}&sub=${subKey}`,
                        icon,
                    });
                });
            });
        }
    });

    return idx;
}

// ─── Render Results ───────────────────────────────────────────────
function renderResults(term, index, container) {
    container.innerHTML = '';

    if (term.length < 1) {
        // Show popular categories when empty & focused
        renderPopular(index, container);
        return;
    }

    const q = term.toLowerCase();
    const matches = index.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    );

    // Sort: exact start-of-title first, then category, then items
    matches.sort((a, b) => {
        const aStart = a.title.toLowerCase().startsWith(q);
        const bStart = b.title.toLowerCase().startsWith(q);
        if (aStart && !bStart) return -1;
        if (!aStart && bStart) return 1;
        // type priority
        const order = { Service: 0, Subcategory: 1, Item: 2 };
        return (order[a.type] ?? 3) - (order[b.type] ?? 3);
    });

    const limited = matches.slice(0, 10);

    if (limited.length === 0) {
        container.innerHTML = `
            <div class="nsp-empty">
                <i class="bi bi-search" style="font-size:1.5rem; opacity:0.3;"></i>
                <p>No results for "<strong>${escapeHtml(term)}</strong>"</p>
                <span>Try "nitrogen", "FITOK", "valves", "sampling"…</span>
            </div>
        `;
        return;
    }

    // Group header
    const hdr = document.createElement('div');
    hdr.className = 'nsp-results-header';
    hdr.textContent = `${matches.length} result${matches.length !== 1 ? 's' : ''}`;
    container.appendChild(hdr);

    const list = document.createElement('ul');
    list.className = 'nsp-results-list';

    limited.forEach(res => {
        const li = document.createElement('li');
        li.className = 'nsp-result-item';
        li.innerHTML = `
            <a href="${res.url}" class="nsp-result-link">
                <span class="nsp-result-icon"><i class="bi ${res.icon}"></i></span>
                <span class="nsp-result-body">
                    <span class="nsp-result-title">${highlight(res.title, term)}</span>
                    <span class="nsp-result-category">${escapeHtml(res.category)}</span>
                </span>
                <span class="nsp-result-type" style="background:${TYPE_COLORS[res.type] || '#94a3b8'}20; color:${TYPE_COLORS[res.type] || '#94a3b8'};">${res.type}</span>
                <i class="bi bi-arrow-right nsp-result-arrow"></i>
            </a>
        `;
        list.appendChild(li);
    });

    container.appendChild(list);

    if (matches.length > 10) {
        const more = document.createElement('div');
        more.className = 'nsp-see-more';
        more.innerHTML = `<a href="service-details.html">View all results on Services page <i class="bi bi-arrow-right ms-1"></i></a>`;
        container.appendChild(more);
    }
}

// ─── Popular / Default State ──────────────────────────────────────
function renderPopular(index, container) {
    const categories = index.filter(e => e.type === 'Service').slice(0, 6);
    if (categories.length === 0) return;

    const hdr = document.createElement('div');
    hdr.className = 'nsp-results-header';
    hdr.textContent = 'Browse Categories';
    container.appendChild(hdr);

    const list = document.createElement('ul');
    list.className = 'nsp-results-list';

    categories.forEach(res => {
        const li = document.createElement('li');
        li.className = 'nsp-result-item';
        li.innerHTML = `
            <a href="${res.url}" class="nsp-result-link">
                <span class="nsp-result-icon"><i class="bi ${res.icon}"></i></span>
                <span class="nsp-result-body">
                    <span class="nsp-result-title">${escapeHtml(res.title)}</span>
                    <span class="nsp-result-category">Service Category</span>
                </span>
                <i class="bi bi-arrow-right nsp-result-arrow"></i>
            </a>
        `;
        list.appendChild(li);
    });

    container.appendChild(list);
}

// ─── Helpers ──────────────────────────────────────────────────────
function highlight(text, term) {
    if (!term) return escapeHtml(text);
    const safe = escapeHtml(text);
    const safeQ = escapeRegex(escapeHtml(term));
    return safe.replace(new RegExp(`(${safeQ})`, 'gi'), '<mark class="nsp-hl">$1</mark>');
}

function escapeHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function formatTitle(str) {
    if (!str) return '';
    return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/** Resolve base path so links work on both index.html and service-details.html */
function getBasePath() {
    // If we're already at root level, no prefix needed; same for any page in root
    const path = window.location.pathname;
    const depth = path.split('/').filter(Boolean).length;
    return depth > 1 ? '../'.repeat(depth - 1) : '';
}
