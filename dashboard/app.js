/**
 * Netflix Content & Viewer Engagement Interactive Controller
 */

let netflixData = null;
let charts = {};

async function init() {
  try {
    if (window.NETFLIX_SUMMARY) {
      netflixData = window.NETFLIX_SUMMARY;
    } else {
      const res = await fetch('netflix_summary.json');
      netflixData = await res.json();
    }
    renderKPIs(netflixData.kpis);
    renderTrendChart(netflixData.yearlyTrends);
    renderAgeCertChart(netflixData.ageCertifications);
    renderGenreChart(netflixData.genres);
    renderCountryChart(netflixData.topCountries);
    renderAICharts(netflixData.aiIntelligence);
    renderTitlesTable(netflixData.topRatedTitles);
    setupFilters();
  } catch (err) {
    console.error('Failed to load netflix data:', err);
  }
}

function renderAICharts(ai) {
  if (!ai) return;

  // 1. Engagement Tiers Donut Chart
  const tiers = ai.engagementTiers;
  const labels = tiers.map(t => t.tierName);
  const data = tiers.map(t => t.count);

  const ctxEng = document.getElementById('engagementChart')?.getContext('2d');
  if (ctxEng) {
    charts.engagement = new Chart(ctxEng, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: ['#e50914', '#10b981', '#3b82f6', '#64748b'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 10 } } }
      }
    });
  }

  // 2. Nearest Neighbor Recommender Output
  const recContainer = document.getElementById('recommenderOutput');
  if (recContainer && ai.recommender.recommendations.length > 0) {
    const firstSeed = ai.recommender.recommendations[0];
    recContainer.innerHTML = '';
    firstSeed.topMatches.forEach((m, idx) => {
      const div = document.createElement('div');
      div.style.cssText = 'padding: 8px 12px; background: rgba(255, 255, 255, 0.04); border-radius: 6px; display: flex; justify-content: space-between; align-items: center;';
      div.innerHTML = `
        <div>
          <span style="font-weight: 700; color: #f4f4f5;">#${idx + 1} ${m.targetTitle}</span>
          <span style="font-size: 11px; color: #a1a1aa; margin-left: 8px;">(${m.targetType})</span>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span style="font-size: 11px; background: rgba(59, 130, 246, 0.15); color: #60a5fa; padding: 2px 6px; border-radius: 4px;">Cosine: ${(m.similarityScore * 100).toFixed(1)}%</span>
          <span class="score-badge high">⭐ ${m.imdbScore}</span>
        </div>
      `;
      recContainer.appendChild(div);
    });
  }
}

function renderKPIs(kpis) {
  document.getElementById('kpiTotal').textContent = kpis.totalTitles.toLocaleString();
  document.getElementById('kpiRatio').textContent = `${kpis.moviePct}% / ${kpis.showPct}%`;
  document.getElementById('kpiScore').textContent = `${kpis.avgScore} / 10`;
  document.getElementById('kpiVotes').textContent = `${(kpis.totalVotes / 1e6).toFixed(1)}M`;
  document.getElementById('kpiRuntime').textContent = `${kpis.avgRuntimeMinutes} Min`;
}

function renderTrendChart(trends) {
  const years = Object.keys(trends).sort((a, b) => parseInt(a) - parseInt(b)).filter(y => parseInt(y) >= 2000);
  const movies = years.map(y => trends[y].movies);
  const shows = years.map(y => trends[y].shows);

  const ctx = document.getElementById('trendChart').getContext('2d');
  charts.trend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Movies',
          data: movies,
          borderColor: '#e50914',
          backgroundColor: 'rgba(229, 9, 20, 0.15)',
          fill: true,
          tension: 0.3,
          borderWidth: 2
        },
        {
          label: 'TV Shows',
          data: shows,
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.15)',
          fill: true,
          tension: 0.3,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#94a3b8' } } },
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#94a3b8' } },
        y: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#94a3b8' } }
      }
    }
  });
}

function renderAgeCertChart(certs) {
  const sorted = Object.entries(certs).sort((a, b) => b[1] - a[1]).slice(0, 7);
  const labels = sorted.map(s => s[0]);
  const data = sorted.map(s => s[1]);

  const ctx = document.getElementById('ageCertChart').getContext('2d');
  charts.age = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#e50914', '#f43f5e', '#a855f7', '#f59e0b', '#06b6d4', '#10b981', '#64748b'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 10 } } }
    }
  });
}

function renderGenreChart(genres) {
  const top = genres.slice(0, 8);
  const labels = top.map(g => g.genre.charAt(0).toUpperCase() + g.genre.slice(1));
  const counts = top.map(g => g.count);
  const scores = top.map(g => g.avgScore);

  const ctx = document.getElementById('genreChart').getContext('2d');
  charts.genre = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Title Count',
          data: counts,
          backgroundColor: 'rgba(229, 9, 20, 0.75)',
          borderRadius: 6,
          yAxisID: 'y'
        },
        {
          type: 'line',
          label: 'Avg IMDb Rating (1-10)',
          data: scores,
          borderColor: '#f59e0b',
          backgroundColor: '#f59e0b',
          borderWidth: 2,
          pointRadius: 4,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#94a3b8' } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
        y: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#94a3b8' }, title: { display: true, text: 'Titles', color: '#64748b' } },
        y1: { position: 'right', grid: { display: false }, min: 5, max: 8.5, ticks: { color: '#fbbf24' }, title: { display: true, text: 'IMDb', color: '#fbbf24' } }
      }
    }
  });
}

function renderCountryChart(countries) {
  const labels = countries.map(c => c.country);
  const counts = countries.map(c => c.count);

  const ctx = document.getElementById('countryChart').getContext('2d');
  charts.country = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Titles Produced',
        data: counts,
        backgroundColor: 'rgba(168, 85, 247, 0.75)',
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#94a3b8' } },
        y: { grid: { display: false }, ticks: { color: '#94a3b8' } }
      }
    }
  });
}

function renderTitlesTable(titles) {
  const tbody = document.querySelector('#titlesTable tbody');
  tbody.innerHTML = '';

  titles.slice(0, 15).forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${t.title}</strong></td>
      <td><span class="type-pill ${t.type.toLowerCase()}">${t.type}</span></td>
      <td>${t.releaseYear}</td>
      <td>${t.ageCert}</td>
      <td>${t.primaryGenre}</td>
      <td><span class="score-badge high">⭐ ${t.imdbScore}</span></td>
      <td>${t.imdbVotes.toLocaleString()}</td>
      <td><strong style="color: #34d399">${t.preferenceScore} / 100</strong></td>
    `;
    tbody.appendChild(tr);
  });
}

function setupFilters() {
  document.getElementById('typeFilter').addEventListener('change', (e) => {
    const val = e.target.value;
    let filtered = netflixData.topRatedTitles;
    if (val !== 'ALL') {
      filtered = filtered.filter(t => t.type === val);
    }
    renderTitlesTable(filtered);
  });
}

document.addEventListener('DOMContentLoaded', init);
