// lib_interactions.js — Generic PyXML action dispatcher
//
// Connects data-action attributes to JavaScript handlers.
// Widgets register themselves in window._widgets with methods like refresh().
// New actions can be added by extending ACTION_HANDLERS.

// Global widget registry — widgets register themselves here
window._widgets = window._widgets || {};

// --- Action Handlers ---
// Each handler receives the element that was interacted with.
var ACTION_HANDLERS = {

    // Navigate to a URL
    'navigate': function(el) {
        var url = el.dataset.url || el.getAttribute('href');
        if (url) {
            // Preserve language parameter
            if (typeof url_language === 'function') {
                window.location.href = url + url_language();
            } else {
                window.location.href = url;
            }
        }
    },

    // Open a modal by target ID
    'open_modal': function(el) {
        var targetId = el.dataset.actionTarget;
        if (!targetId) return;
        var modal = document.getElementById(targetId);
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
        }
    },

    // Close a modal (button_close uses target attribute)
    'close_modal': function(el) {
        var targetId = el.dataset.actionTarget;
        if (!targetId) return;
        var modal = document.getElementById(targetId);
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    },

    // Refresh a registered widget (e.g. random citation)
    'refresh_target': function(el) {
        var targetId = el.dataset.actionTarget;
        if (!targetId) return;
        if (window._widgets[targetId] &&
            typeof window._widgets[targetId].refresh === 'function') {
            window._widgets[targetId].refresh();
        }
    }
};

// --- Event Binding ---
document.addEventListener('DOMContentLoaded', function() {
    var elements = document.querySelectorAll('[data-action]');
    elements.forEach(function(el) {
        var actionName = el.dataset.action;
        var handler = ACTION_HANDLERS[actionName];
        if (handler) {
            el.addEventListener('click', function(e) {
                e.preventDefault();
                handler(el);
            });
        }
    });
});
