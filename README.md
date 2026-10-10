# 🎬 Netflix Content Analytics & Recommender AI (Power BI & AIML Mini Project 4)

> **Academic Capstone Submission • Final Year Engineering in AIML**  
> **Student Name**: Mithun Gowda M  
> **Program**: B.E. / B.Tech in Artificial Intelligence & Machine Learning (AIML)  
> **Department**: Department of Computer Science & Engineering (AIML)  
> **Specialization**: Machine Learning, Natural Language Processing & Recommender Systems  

[![Tests](https://img.shields.io/badge/tests-7%2F7%20passed-brightgreen.svg)]()
[![AIML Engine](https://img.shields.io/badge/AIML-Cosine%20Similarity%20%7C%20Recommender-blueviolet.svg)]()
[![Power BI](https://img.shields.io/badge/Power%20BI-Desktop-F2C811?logo=powerbi&logoColor=black)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()

---

## 📌 Abstract & Problem Statement
In streaming digital media platforms, maintaining catalog engagement and curbing subscriber churn hinges on accurate content representation, demographic audience targeting, and content-based recommendation systems. Simple popularity sorting over-indexes on legacy blockbusters and suppresses high-quality niche titles.

This final-year engineering capstone mini-project implements:
1. **Content-Based Filtering & Cosine Similarity Engine**: Constructs sparse TF-IDF genre vectors across **5,806 catalog titles** and evaluates pairwise angular similarity to recommend top-N nearest neighbors.
2. **Predictive Viewer Preference & Engagement Classifier**: A dual-heuristic mathematical scoring function combining IMDb quality ratings with logarithmic popularity volumes.
3. **Power BI Content Intelligence Architecture**: Dimensional model analyzing decadal trends, maturity age certifications, and production nations.
4. **Interactive AIML Web Companion**: Zero-CORS offline-ready dashboard featuring real-time nearest-neighbor recommendation displays.

---

## 🔬 Mathematical Formulations & Machine Learning Methodology

### 1. Vector Space Model & Cosine Similarity
For titles $A$ and $B$ represented as binary/TF-IDF genre vectors $u_A, u_B \in \mathbb{R}^V$ over vocabulary $V$:
$$\text{Sim}(A, B) = \cos(\theta) = \frac{u_A \cdot u_B}{\|u_A\|_2 \|u_B\|_2} = \frac{\sum_{k=1}^{|V|} u_{A,k} u_{B,k}}{\sqrt{\sum_{k=1}^{|V|} u_{A,k}^2} \sqrt{\sum_{k=1}^{|V|} u_{B,k}^2}}$$

The top-$N$ recommendation set for seed title $s$ is generated via:
$$\text{Rec}(s) = \arg\max_{t \in \mathcal{C} \setminus \{s\}}^N \left( \lambda \cdot \text{Sim}(s, t) + (1-\lambda) \cdot \frac{\text{Rating}_t}{10} \right)$$

### 2. Predictive Viewer Preference Scoring Function
Balances critical acclaim and broad viewer validation:
$$\text{Preference Score} = \left(\frac{\text{IMDb Score}}{10} \times 60\right) + \left(\min\left(40, \frac{\log_{10}(\text{Votes} + 1)}{6} \times 40\right)\right)$$

### 3. Multi-Class Engagement Classification Matrix
- **Blockbuster Hit**: $\text{IMDb} \ge 7.5 \land \text{Votes} \ge 100,000$ (2.4% of catalog).
- **Critically Acclaimed Gem**: $\text{IMDb} \ge 8.0 \land \text{Votes} < 100,000$ (7.2% of catalog).
- **Mainstream Commercial**: $6.0 \le \text{IMDb} < 7.5$ (55.9% of catalog).
- **Underperforming / Niche**: $\text{IMDb} < 6.0$ (34.5% of catalog).

---

## 📁 Repository Architecture
```
netflix-movies-and-shows-analysis/
├── data/
│   ├── netflix_titles.csv       # 5,806 raw catalog titles with IMDb scores
│   └── DATA_DICTIONARY.md       # Metadata documentation & schema details
├── src/
│   ├── netflix_analytics.js     # Array parsing, predictive score & stats engine
│   └── netflix_ml_engine.js     # Cosine similarity recommender & engagement classifier
├── dashboard/
│   ├── index.html               # Cinema-inspired interactive dashboard with AIML tab
│   ├── styles.css               # Netflix red & sleek dark UI styling
│   ├── data.js                  # Pre-bundled dataset (zero-CORS offline support)
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

## 📊 Key Results & Insights Summary
- **Catalog Size**: **5,806 total titles** (3,759 Movies / 64.7% vs 2,047 Shows / 35.3%).
- **Average IMDb Rating**: **6.53 / 10** across rated titles.
- **Total Engagement**: Over **123.28 Million global votes**.
- **AIML Recommender Output Example**:
  - Seed: *Taxi Driver* (`['crime', 'drama']`, Rating 8.3)
  - Top Matches: *Once Upon a Time in America* (Cosine 81.7%), *Bonnie and Clyde* (Cosine 81.7%), *Donnie Brasco* (Cosine 81.7%).

---

## 📐 Key DAX Measures (`power_bi/measures.dax`)
```dax
Predictive Viewer Preference Score = 
VAR ScorePart = DIVIDE([Average IMDb Rating], 10, 0) * 60
VAR TotalV = [Total Viewer Votes]
VAR VotePart = IF(TotalV > 0, MIN(40, DIVIDE(LOG10(TotalV + 1), 6, 0) * 40), 0)
RETURN
    ScorePart + VotePart

Content Quality Tier = 
SWITCH(
    TRUE(),
    ISBLANK([Average IMDb Rating]), "Unrated",
    [Average IMDb Rating] >= 8.0, "Critically Acclaimed (Tier 1)",
    [Average IMDb Rating] >= 6.5, "Mainstream Popular (Tier 2)",
    "Underperforming (Tier 3)"
)
```

---

## 🧪 Automated Testing & Validation
Run automated tests verifying parsing integrity, score ranges, and ML recommender accuracy:
```bash
node tests/netflix_analytics.test.js
```
**Test Results (7/7 Passed)**:
- `✓ Test 1 Passed`: Catalog volume verified (5,806 titles: 3,759 movies, 2,047 shows).
- `✓ Test 2 Passed`: Array parsing and bracket sanitation verified.
- `✓ Test 3 Passed`: Global average IMDb rating within sanity boundaries (6.53 / 10).
- `✓ Test 4 Passed`: Predictive viewer preference score bounded within [0, 100].
- `✓ Test 5 Passed`: Top genres and age certification classifications verified.
- `✓ Test 6 Passed`: AIML TF-IDF & Cosine similarity recommender verified (similarity bounded in [0, 1]).
- `✓ Test 7 Passed`: AIML multi-class viewer engagement classification validated across 5,806 titles.

---

## 💻 How to Run the Interactive Dashboard
1. **Direct Browser Open (Offline Compatible)**:
   - Double-click `dashboard/index.html` in Windows Explorer. It opens instantly with interactive format slicers and zero CORS restrictions!
2. **Local HTTP Server (Optional)**:
   ```bash
   npx serve dashboard
   ```

---

## 🎓 Final Year Engineering Capstone Learning Outcomes
- Engineered vector-space representation (TF-IDF) and cosine distance for information retrieval.
- Developed multi-class behavioral classification heuristics balancing quality and mass popularity.
- Designed accessible cinematic UI aesthetics using glassmorphic design and reactive charts.

---

## 👤 Author
**Mithun Gowda M**  
Final Year Engineering Student (B.E. / B.Tech AIML)  
Department of Computer Science & Engineering (AIML)  
GitHub: [@Mithun-gowda-M](https://github.com/Mithun-gowda-M)
