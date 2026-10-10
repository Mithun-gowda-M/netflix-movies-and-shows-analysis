# Netflix Content Analytics & Recommender AI - Power BI Implementation Guide

> **Academic Capstone Submission • Final Year Engineering in AIML**  
> **Student Name**: Mithun Gowda M  
> **Program**: B.E. / B.Tech in Artificial Intelligence & Machine Learning (AIML)  
> **Department**: Department of Computer Science & Engineering (AIML)  
> **Repository**: [https://github.com/Mithun-gowda-M/netflix-movies-and-shows-analysis](https://github.com/Mithun-gowda-M/netflix-movies-and-shows-analysis)  

---
## 1. Overview
Analyzes 5,800+ titles on Netflix to uncover content library evolution, genre popularity, age rating audience targeting, and viewer preferences.

## 2. Visual Architecture
1. **Executive KPI Strip**:
   - Card 1: `Total Catalog Titles`
   - Card 2: `Movie Share %` vs `TV Show Share %`
   - Card 3: `Average IMDb Rating`
   - Card 4: `Total Viewer Votes`
   - Card 5: `Average Runtime Minutes`
   - Slicer: `type` (Movie, TV Show)

2. **Entertainment Trends Over Time (Top Left)**:
   - Visual: Stacked Area Chart
   - X-Axis: `release_year` (Filtered >= 2000)
   - Values: `[Total Catalog Titles]`
   - Legend: `type`

3. **Audience Targeting by Age Certification (Top Right)**:
   - Visual: Donut Chart
   - Legend: `age_certification`
   - Values: `[Total Catalog Titles]`

4. **Genre Matrix & Quality (Bottom Left)**:
   - Visual: Line and Clustered Column Chart
   - Shared Axis: `PrimaryGenre`
   - Column: `[Total Catalog Titles]`
   - Line: `[Average IMDb Rating]`

5. **Top Producing Countries (Bottom Right)**:
   - Visual: Horizontal Bar Chart
   - Y-Axis: `production_countries`
   - X-Axis: `[Total Catalog Titles]`


### 5. AIML Integration in Power BI
- **Cosine Recommender Lookup Table**: Ingest pairwise similarity scores ($>0.75$) into a bridge table for interactive title-to-title recommendations.
- **Engagement Tier Slicer**: Incorporate classification badges (`Blockbuster Hit`, `Critically Acclaimed`, `Mainstream Commercial`, `Niche`) as high-level category slicers.
- **Python Visual in Power BI Desktop**: Render TF-IDF genre keyword co-occurrence heatmaps directly in the report canvas.
