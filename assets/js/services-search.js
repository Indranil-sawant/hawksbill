/**
 * Service Search Functionality
 * Includes Autocomplete and Highlight features
 */

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('serviceSearch');
  const serviceCards = document.querySelectorAll('.service-card-item'); // Kept for reference if needed, but unused for search
  const productCards = document.querySelectorAll('.product-category');
  const noResultsMsg = document.getElementById('noServicesFound');
  const productSection = document.getElementById('product-list');
  const searchWrapper = document.querySelector('.search-wrapper');

  if (!searchInput) return;

  // 1. Build Autocomplete Index (Only for Products now)
  let searchIndex = new Set();
  
  // Add Product Categories and Items to Index
  productCards.forEach(card => {
    const title = card.querySelector('h3').textContent.trim();
    if (title) searchIndex.add(title);
    
    const items = card.querySelectorAll('li');
    items.forEach(item => {
      const text = item.textContent.trim();
      if (text) searchIndex.add(text);
    });
  });

  const uniqueItems = Array.from(searchIndex).sort();

  // Create Autocomplete List Container
  const autocompleteList = document.createElement('div');
  autocompleteList.setAttribute('id', 'autocomplete-list');
  autocompleteList.setAttribute('class', 'autocomplete-items');
  searchWrapper.appendChild(autocompleteList);

  // Helper: Highlight Text in Elements
  function highlightTextInElement(element, query) {
    if (!element) return;
    
    // Remove existing highlights
    const highlights = element.querySelectorAll('.search-highlight');
    highlights.forEach(span => {
        const text = document.createTextNode(span.textContent);
        span.parentNode.replaceChild(text, span);
    });
    element.normalize();
    
    if (!query) return;

    // Use TreeWalker to safely find and replace text nodes
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    const nodes = [];
    while(walker.nextNode()) {
        if (walker.currentNode.textContent.toLowerCase().includes(query)) {
            nodes.push(walker.currentNode);
        }
    }

    nodes.forEach(node => {
        const text = node.textContent;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'); 
        
        if (!regex.test(text)) return;
        
        const fragment = document.createDocumentFragment();
        let lastIdx = 0;
        
        text.replace(regex, (match, p1, offset) => {
            // Text before match
            fragment.appendChild(document.createTextNode(text.slice(lastIdx, offset)));
            
            // Highlighted match
            const span = document.createElement('span');
            span.className = 'search-highlight';
            span.textContent = match;
            fragment.appendChild(span);
            
            lastIdx = offset + match.length;
            return match; 
        });
        
        // Text after last match
        fragment.appendChild(document.createTextNode(text.slice(lastIdx)));
        
        node.parentNode.replaceChild(fragment, node);
    });
  }

  // Helper: Perform Search and Highlight
  function performSearch(query) {
    let hasVisibleProduct = false;
    const lowerQuery = query.toLowerCase();

    // 1. Reset Service Cards (Ensure they are always visible and clean)
    if (serviceCards.length) {
        serviceCards.forEach(card => {
             // Ensure visible
             card.closest('.col-lg-4').style.display = '';
             card.classList.remove('filtered-out');
             
             // Remove highlights if any exist from previous state
             const titleEl = card.querySelector('h3');
             const descEl = card.querySelector('p');
             highlightTextInElement(titleEl, '');
             highlightTextInElement(descEl, '');
        });
    }

    // 2. Filter Product Categories (Search Logic Active Here)
    if (productCards.length) {
      productCards.forEach(card => {
        const titleEl = card.querySelector('h3');
        const listItems = card.querySelectorAll('li');
        
        const content = card.textContent.toLowerCase();
        const isMatch = content.includes(lowerQuery);

        if (isMatch || query === '') {
          card.closest('.col-lg-4').style.display = '';
          hasVisibleProduct = true;
          
          if (query !== '') {
            // Highlight Title
            highlightTextInElement(titleEl, lowerQuery);
            // Highlight Items
            listItems.forEach(li => {
                highlightTextInElement(li, lowerQuery);
            });
          } else {
             // Cleanup highlights when query is empty
             highlightTextInElement(titleEl, '');
             listItems.forEach(li => highlightTextInElement(li, ''));
          }

        } else {
          card.closest('.col-lg-4').style.display = 'none';
           // Cleanup
           highlightTextInElement(titleEl, '');
           listItems.forEach(li => highlightTextInElement(li, ''));
        }
      });
      
      // Toggle Product Section Visibility
      if (productSection) {
        if (!hasVisibleProduct && query !== '') {
          productSection.style.display = 'none';
        } else {
          productSection.style.display = '';
        }
      }
    }

    // 3. No Results Message
    // Since service cards are always visible, "No Results" might be confusing if shown globally.
    // However, if the user is looking for a specific product and it's not found in the list, 
    // we might still want to indicate that. 
    // Given the request, the "search function" is disabled for the top section.
    // We will show the no results message ONLY if there are NO products found AND the query is not empty.
    // But since the service grid is always there, maybe we hide the message to avoid clutter?
    // Let's hide it to be safe, as "No Services Found" is technically false if the grid is there.
    if (noResultsMsg) {
       noResultsMsg.classList.add('d-none');
    }
  }

  // Close list helper
  function closeAllLists(elmnt) {
    while (autocompleteList.firstChild) {
      autocompleteList.removeChild(autocompleteList.firstChild);
    }
  }

  // Input Event Listener
  searchInput.addEventListener('input', function(e) {
    const val = this.value;
    const query = val.toLowerCase().trim();
    
    closeAllLists();
    
    if (!val) {
      performSearch('');
      return false;
    }

    // Autocomplete Logic
    const matches = uniqueItems.filter(item => item.toLowerCase().includes(query));
    if (matches.length > 0) {
        matches.slice(0, 10).forEach(match => {
            const b = document.createElement("DIV");
            b.className = "autocomplete-item";
            
            const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
            // Use simple string matching for list item creation
            // (Reusing previous logic but simplified)
            b.innerHTML = match.replace(re, "<strong>$1</strong>");
            
            b.dataset.value = match;
            
            b.addEventListener("click", function(e) {
                searchInput.value = this.dataset.value;
                closeAllLists();
                performSearch(searchInput.value.trim());
                scrollToFirstMatch(); 
            });
            autocompleteList.appendChild(b);
        });
    }

    performSearch(query);
  });

  // Handle Enter Key
  searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
          e.preventDefault();
          closeAllLists();
          scrollToFirstMatch();
      }
  });

  // Helper: Scroll to first visible match
  function scrollToFirstMatch() {
      // Find the first visible product card
      const visibleCard = Array.from(productCards).find(card => {
          return card.closest('.col-lg-4').style.display !== 'none';
      });

      if (visibleCard) {
          // Scroll to the card with some offset for the sticky header
          const headerOffset = 100;
          const elementPosition = visibleCard.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
          });
      } else if (productSection && productSection.style.display !== 'none') {
          // If no specific card found but section is visible (fallback)
          productSection.scrollIntoView({ behavior: 'smooth' });
      }
  }

  // Close list when clicking elsewhere
  document.addEventListener("click", function (e) {
    if (e.target !== searchInput && e.target !== autocompleteList) {
        closeAllLists();
    }
  });

});
