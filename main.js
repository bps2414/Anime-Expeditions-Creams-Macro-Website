/* ==========================================================================
   Cream's Macro | Anime Expeditions — Landing Page Client JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  fetchGitHubReleaseStats();
  initThemeSwitcher();
  initScrollEffects();
});

/**
 * Dynamically fetches the latest release version badge & download count from GitHub API
 */
async function fetchGitHubReleaseStats() {
  const repoUrl = 'https://api.github.com/repos/Cweamy/Anime-Expeditions-Creams-Macro/releases';
  const verBadge = document.getElementById('ver-badge');
  const downloadCountEl = document.getElementById('download-count');

  try {
    const response = await fetch(repoUrl);
    if (!response.ok) return;
    
    const releases = await response.json();
    if (!releases || releases.length === 0) return;

    const latestRelease = releases[0];
    if (latestRelease.tag_name && verBadge) {
      verBadge.textContent = latestRelease.tag_name;
    }

    // Calculate total downloads across all release assets
    let totalDownloads = 0;
    releases.forEach(rel => {
      if (rel.assets) {
        rel.assets.forEach(asset => {
          totalDownloads += asset.download_count || 0;
        });
      }
    });

    if (downloadCountEl && totalDownloads > 0) {
      downloadCountEl.textContent = totalDownloads.toLocaleString() + '+';
    }
  } catch (err) {
    console.log('GitHub API fetch info:', err);
  }
}

/**
 * Handles live accent theme switching (matching the Macro app UI theme picker)
 */
function initThemeSwitcher() {
  window.setThemeAccent = function(accent) {
    document.documentElement.setAttribute('data-theme-accent', accent);
    
    // Update active dot indicator
    document.querySelectorAll('.theme-dot').forEach(dot => {
      dot.classList.remove('active');
    });

    const activeDot = document.querySelector(`.theme-dot[onclick*="${accent}"]`);
    if (activeDot) {
      activeDot.classList.add('active');
    }
  };
}

/**
 * Scroll reveal animations for feature cards & elements
 */
function initScrollEffects() {
  const cards = document.querySelectorAll('.bento-card, .download-card, .tutorial-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });
}
