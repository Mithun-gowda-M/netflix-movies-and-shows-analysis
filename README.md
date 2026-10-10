# 🎬 Netflix Movies and Shows Analysis (Power BI Mini Project 4)

[![Test Suite](https://img.shields.io/badge/tests-5%2F5%20passed-brightgreen.svg)]()
[![Platform](https://img.shields.io/badge/platform-Power%20BI%20%7C%20Web-blue.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()

Comprehensive entertainment analytics uncovering content library evolution, audience targeting, genre popularity, and viewer preference modeling across **5,806 global titles** streaming on Netflix.

---

## 🎯 Key Streaming Insights & Findings
- **Catalog Distribution**: **3,759 Movies (64.7%)** vs **2,047 TV Shows (35.3%)**.
- **Average IMDb Score**: **6.53 / 10** across rated titles.
- **Viewer Engagement**: Over **123.28 Million global votes** logged on IMDb.
- **Audience Targeting**: Mature audiences (TV-MA & R) represent the largest programming investment, followed by TV-14 young adult content.
- **Top Production Nations**: United States, United Kingdom, India, and South Korea dominate global original commissions.

---

## 📁 Repository Architecture
```
netflix-movies-and-shows-analysis/
├── data/
│   ├── netflix_titles.csv       # 5,806 raw catalog titles with IMDb scores
│   └── DATA_DICTIONARY.md       # Metadata documentation & schema details
├── src/
│   └── netflix_analytics.js     # Array parsing, predictive score & stats engine
├── dashboard/
│   ├── index.html               # Cinema-inspired interactive dashboard
│   ├── styles.css               # Netflix red & sleek dark UI styling
│   ├── app.js                   # Chart.js dynamic slicers & scoring engine
│   └── netflix_summary.json     # Precomputed catalog aggregations
├── power_bi/
│   ├── measures.dax             # Production DAX for preference scoring & tiers
│   ├── power_query.m            # Power Query M array unwrapping & ETL
│   └── REPORT_GUIDE.md          # Visual-by-visual layout & dashboard guide
└── tests/
    └── netflix_analytics.test.js # Automated testing suite
```

---

## 📊 Power BI DAX Measures Reference
Located in [`power_bi/measures.dax`](power_bi/measures.dax):
- `Predictive Viewer Preference Score = ([Average IMDb Rating] / 10 * 60) + (LOG10([Total Viewer Votes] + 1) / 6 * 40)`
- `Content Quality Tier = SWITCH(TRUE(), [Average IMDb Rating] >= 8.0, "Acclaimed", ...)`
- `Movie Share %` and `TV Show Share %`
- `Mature Content Share %` and `Family Friendly Share %`

---

## 🧪 Testing & Execution
Run the automated test suite verifying dataset parsing, array sanitation, and scoring mathematics:
```bash
node tests/netflix_analytics.test.js
```

---

## 💻 Running the Web Companion
Open `dashboard/index.html` directly in any web browser or serve locally:
```bash
npx serve dashboard
```

---

## 📄 License
MIT License. Developed for streaming entertainment strategy and catalog optimization.
