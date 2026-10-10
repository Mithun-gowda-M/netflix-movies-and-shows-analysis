# Netflix Movies & Shows Data Dictionary

| Column Name | Data Type | Description | Example Values |
| :--- | :--- | :--- | :--- |
| `title` | Text | Name of the movie or television show | `Taxi Driver`, `Stranger Things` |
| `type` | Text | Format of the title | `MOVIE`, `SHOW` |
| `release_year` | Integer | Original calendar year of commercial release | `1976`, `2021` |
| `age_certification`| Text | Content maturity rating for audience targeting | `TV-MA`, `R`, `PG-13`, `TV-14` |
| `runtime` | Integer | Length of content in minutes | `113`, `45` |
| `genres` | Text / Array | List of thematic genres | `['crime', 'drama']` |
| `production_countries`| Text / Array | Sovereign countries where content was produced | `['US']`, `['GB']`, `['IN']` |
| `seasons` | Integer | Number of seasons available (shows only) | `1`, `4` |
| `imdb_id` | Text | Unique IMDb identifier | `tt0075314` |
| `imdb_score` | Decimal | Official IMDb average user rating (0.0 to 10.0) | `8.3`, `7.1` |
| `imdb_votes` | Integer | Total global user votes cast on IMDb | `795,222` |
