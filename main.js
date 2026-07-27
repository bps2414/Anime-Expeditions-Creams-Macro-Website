/* ==========================================================================
   Cream's Macro | Anime Expeditions — Landing Page Client JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  fetchGitHubReleaseStats();
  fetchGitHubGitLog();
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
    console.log('GitHub Releases API info:', err);
  }
}

/**
 * Fetches recent commit git log from official GitHub repository (No Secrets/API Keys Required)
 */
async function fetchGitHubGitLog() {
  const commitsUrl = 'https://api.github.com/repos/Cweamy/Anime-Expeditions-Creams-Macro/commits?per_page=8';
  const container = document.getElementById('git-log-list');
  if (!container) return;

  try {
    const response = await fetch(commitsUrl);
    if (!response.ok) {
      container.innerHTML = `<div class="git-log-error">Could not load commit history from GitHub.</div>`;
      return;
    }

    const commits = await response.json();
    if (!commits || commits.length === 0) {
      container.innerHTML = `<div class="git-log-error">No recent commits found.</div>`;
      return;
    }

    let html = '';
    commits.forEach(item => {
      const shaShort = item.sha.substring(0, 7);
      const commitUrl = item.html_url;
      const rawMsg = item.commit.message || '';
      const firstLine = rawMsg.split('\n')[0];
      const authorName = item.commit.author ? item.commit.author.name : 'Contributor';
      const commitDate = item.commit.author ? formatDate(item.commit.author.date) : '';

      html += `
        <div class="git-log-item">
          <div class="git-log-header">
            <a href="${commitUrl}" target="_blank" class="git-sha-badge" title="View commit on GitHub">
              #${shaShort}
            </a>
            <span class="git-log-date">${commitDate}</span>
          </div>
          <div class="git-log-msg">${escapeHtml(firstLine)}</div>
          <div class="git-log-author">by <strong>${escapeHtml(authorName)}</strong></div>
        </div>
      `;
    });

    container.innerHTML = html;
  } catch (err) {
    console.log('GitHub Commits API info:', err);
    if (container) {
      container.innerHTML = `<div class="git-log-error">Unable to fetch live git log.</div>`;
    }
  }
}

/**
 * Helper to format ISO date to relative/readable format
 */
function formatDate(isoStr) {
  if (!isoStr) return '';
  const date = new Date(isoStr);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * Scroll reveal animations for feature cards
 */
function initScrollEffects() {
  const cards = document.querySelectorAll('.bento-box, .dl-card, .tutorial-grid, .git-log-item');

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
    card.style.transform = 'translateY(16px)';
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(card);
  });
}
