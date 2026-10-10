/**
 * Netflix Content & Viewer Engagement Analytics Engine
 */

const fs = require('fs');
const path = require('path');

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const records = [];
  
  for (let i = 1; i < lines.length; i++) {
    const row = [];
    let insideQuote = false;
    let entry = '';
    for (const char of lines[i]) {
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        row.push(entry.trim());
        entry = '';
      } else {
        entry += char;
      }
    }
    row.push(entry.trim());

    if (row.length >= headers.length) {
      const rec = {};
      headers.forEach((h, idx) => rec[h] = row[idx]);
      records.push(rec);
    }
  }
  return records;
}

function cleanArrayField(str) {
  if (!str) return [];
  // handles "['crime', 'drama']" or "['US']"
  const cleaned = str.replace(/[\[\]'"]/g, '').split(',').map(s => s.trim()).filter(Boolean);
  return cleaned;
}

function processNetflixData(csvPath) {
  const raw = parseCSV(fs.readFileSync(csvPath, 'utf-8'));

  let totalTitles = 0;
  let movieCount = 0;
  let showCount = 0;
  let totalScore = 0;
  let scoreCount = 0;
  let totalVotes = 0;
  let totalRuntime = 0;
  let runtimeCount = 0;

  const yearMap = {};
  const genreMap = {};
  const ageCertMap = {};
  const countryMap = {};

  const cleanRecords = [];

  raw.forEach(r => {
    const title = r.title || 'Untitled';
    const type = (r.type || 'MOVIE').toUpperCase();
    const releaseYear = parseInt(r.release_year, 10) || null;
    const ageCert = r.age_certification || 'Unrated';
    const runtime = parseFloat(r.runtime) || 0;
    const genres = cleanArrayField(r.genres);
    const countries = cleanArrayField(r.production_countries);
    const seasons = parseInt(r.seasons, 10) || (type === 'MOVIE' ? 0 : 1);
    const imdbScore = parseFloat(r.imdb_score) || null;
    const imdbVotes = parseInt(r.imdb_votes, 10) || 0;

    totalTitles += 1;
    if (type === 'MOVIE') movieCount += 1;
    else showCount += 1;

    if (imdbScore !== null) {
      totalScore += imdbScore;
      scoreCount += 1;
    }
    totalVotes += imdbVotes;

    if (runtime > 0) {
      totalRuntime += runtime;
      runtimeCount += 1;
    }

    // Predictive Viewer Preference Score (0 to 100)
    // Blend of IMDb score (0-10) and logarithmic scale of popularity votes
    let preferenceScore = 50;
    if (imdbScore !== null && imdbVotes > 0) {
      const normalizedScore = (imdbScore / 10) * 60; // 0 to 60 pts
      const normalizedVotes = Math.min(40, (Math.log10(imdbVotes + 1) / 6) * 40); // 0 to 40 pts
      preferenceScore = Number((normalizedScore + normalizedVotes).toFixed(1));
    }

    // Yearly trend
    if (releaseYear && releaseYear >= 1990) {
      if (!yearMap[releaseYear]) yearMap[releaseYear] = { movies: 0, shows: 0, total: 0 };
      if (type === 'MOVIE') yearMap[releaseYear].movies += 1;
      else yearMap[releaseYear].shows += 1;
      yearMap[releaseYear].total += 1;
    }

    // Genres
    genres.forEach(g => {
      if (!genreMap[g]) genreMap[g] = { count: 0, totalScore: 0, scoreCount: 0, totalVotes: 0 };
      genreMap[g].count += 1;
      if (imdbScore !== null) {
        genreMap[g].totalScore += imdbScore;
        genreMap[g].scoreCount += 1;
      }
      genreMap[g].totalVotes += imdbVotes;
    });

    // Age Cert
    ageCertMap[ageCert] = (ageCertMap[ageCert] || 0) + 1;

    // Countries
    countries.forEach(c => {
      countryMap[c] = (countryMap[c] || 0) + 1;
    });

    cleanRecords.push({
      title,
      type,
      releaseYear,
      ageCert,
      runtime,
      genres,
      primaryGenre: genres[0] || 'General',
      countries,
      primaryCountry: countries[0] || 'Unknown',
      seasons,
      imdbScore,
      imdbVotes,
      preferenceScore
    });
  });

  // Top Genres
  const topGenres = Object.entries(genreMap).map(([genre, d]) => ({
    genre,
    count: d.count,
    avgScore: d.scoreCount > 0 ? Number((d.totalScore / d.scoreCount).toFixed(2)) : 0,
    totalVotes: d.totalVotes
  })).sort((a, b) => b.count - a.count);

  // Top Countries
  const topCountries = Object.entries(countryMap).map(([country, count]) => ({
    country,
    count
  })).sort((a, b) => b.count - a.count).slice(0, 10);

  // Top Rated & High Engagement Titles
  const topRatedTitles = cleanRecords
    .filter(r => r.imdbVotes > 10000 && r.imdbScore !== null)
    .sort((a, b) => b.imdbScore - a.imdbScore)
    .slice(0, 15);

  const avgScore = scoreCount > 0 ? Number((totalScore / scoreCount).toFixed(2)) : 0;
  const avgRuntime = runtimeCount > 0 ? Number((totalRuntime / runtimeCount).toFixed(1)) : 0;

  return {
    kpis: {
      totalTitles,
      movieCount,
      showCount,
      moviePct: Number(((movieCount / totalTitles) * 100).toFixed(1)),
      showPct: Number(((showCount / totalTitles) * 100).toFixed(1)),
      avgScore,
      totalVotes,
      avgRuntimeMinutes: avgRuntime
    },
    yearlyTrends: yearMap,
    genres: topGenres.slice(0, 12),
    ageCertifications: ageCertMap,
    topCountries,
    topRatedTitles,
    sampleRecords: cleanRecords.slice(0, 50)
  };
}

module.exports = { processNetflixData, parseCSV, cleanArrayField };

if (require.main === module) {
  const csvPath = path.join(__dirname, '..', 'data', 'netflix_titles.csv');
  const summary = processNetflixData(csvPath);
  console.log('--- Netflix Analytics Summary ---');
  console.log(JSON.stringify(summary.kpis, null, 2));
  fs.writeFileSync(path.join(__dirname, '..', 'dashboard', 'netflix_summary.json'), JSON.stringify(summary, null, 2));
  console.log('Saved summary to dashboard/netflix_summary.json');
}
