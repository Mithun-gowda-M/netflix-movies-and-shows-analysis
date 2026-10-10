# Netflix Movies and Shows - Power BI Report Guide

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
