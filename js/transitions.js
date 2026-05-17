/* ═══════════════════════════════════════════════════════════════
   RecycleHelper — Global Transition Layer JS
   • Page enter/exit animations
   • Scroll reveal
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── Page enter animation ─────────────────────────────────── */
    function pageEnter() {
        document.body.classList.add('rh-entering');
        // Remove after animation completes so it doesn't block re-adds
        document.body.addEventListener('animationend', function onEnd() {
            document.body.classList.remove('rh-entering');
            document.body.removeEventListener('animationend', onEnd);
        });
    }

    /* ── Page exit on nav-link click ──────────────────────────── */
    function attachNavExits() {
        document.querySelectorAll('a.nav-link, a.about-cta-btn').forEach(function (link) {
            link.addEventListener('click', function (e) {
                var href = link.getAttribute('href');
                // Only intercept same-site page navigations
                if (!href || href.startsWith('#') || href.startsWith('mailto') ||
                    href.startsWith('http') || href.startsWith('tel')) return;
                e.preventDefault();
                document.body.classList.add('rh-leaving');
                setTimeout(function () {
                    window.location.href = href;
                }, 280);
            });
        });
    }

    /* ── Scroll reveal ────────────────────────────────────────── */
    function initScrollReveal() {
        // Elements to observe — add rh-reveal class via JS so pages work without it
        var selectors = [
            '.about-card',
            '.about-stat',
            '.about-value-row',
            '.mission-card',
            '.donate-reason',
            '.container-card',
            '.info-card'
        ].join(', ');

        var els = document.querySelectorAll(selectors);
        if (!els.length) return;

        // Only reveal elements that don't already have their own CSS animation
        // (those have opacity:0 + animation already — skip them to avoid conflict)
        var toReveal = Array.prototype.filter.call(els, function (el) {
            var style = window.getComputedStyle(el);
            var anim  = style.animationName;
            // If already has a named entrance animation → skip
            return !anim || anim === 'none';
        });

        if (!toReveal.length) return;

        toReveal.forEach(function (el) { el.classList.add('rh-reveal'); });

        if (!('IntersectionObserver' in window)) {
            // Fallback: reveal all immediately
            toReveal.forEach(function (el) { el.classList.add('rh-visible'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('rh-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        toReveal.forEach(function (el) { observer.observe(el); });
    }

    /* ── Boot ─────────────────────────────────────────────────── */
    function boot() {
        pageEnter();
        attachNavExits();
        initScrollReveal();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        // Small delay so theme.js has applied theme-ready first
        setTimeout(boot, 20);
    }
})();
