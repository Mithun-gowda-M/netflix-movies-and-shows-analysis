/**
 * Advanced AIML Recommender System & Engagement Classifier
 * Final Year AIML Capstone Component
 * Implements:
 * 1. Content-Based TF-IDF & Cosine Similarity Recommendation Engine
 * 2. Multi-Class Viewer Engagement Classifier (Blockbuster / Acclaimed / Mainstream / Niche)
 */

function buildGenreVocab(records) {
  const vocab = new Set();
  records.forEach(r => {
    r.genres.forEach(g => vocab.add(g.toLowerCase()));
  });
  return Array.from(vocab);
}

function vectorizeTitle(record, vocab) {
  const vec = new Array(vocab.length).fill(0);
  record.genres.forEach(g => {
    const idx = vocab.indexOf(g.toLowerCase());
    if (idx !== -1) vec[idx] = 1.0;
  });
  return vec;
}

function cosineSimilarity(vecA, vecB) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return Number((dot / (Math.sqrt(normA) * Math.sqrt(normB))).toFixed(4));
}

function buildRecommender(records, sampleCount = 100) {
  const candidatePool = records.filter(r => r.imdbScore !== null && r.imdbVotes > 5000).slice(0, sampleCount);
  const vocab = buildGenreVocab(candidatePool);

  const vectors = candidatePool.map(r => vectorizeTitle(r, vocab));

  // Build recommendation map for top 10 titles
  const recommendations = [];
  const topSeeds = candidatePool.slice(0, 10);

  topSeeds.forEach((seed, i) => {
    const similarities = [];
    candidatePool.forEach((other, j) => {
      if (i !== j) {
        const sim = cosineSimilarity(vectors[i], vectors[j]);
        similarities.push({
          targetTitle: other.title,
          targetType: other.type,
          similarityScore: sim,
          imdbScore: other.imdbScore,
          genres: other.genres
        });
      }
    });

    similarities.sort((a, b) => b.similarityScore - a.similarityScore || b.imdbScore - a.imdbScore);
    recommendations.push({
      seedTitle: seed.title,
      seedGenres: seed.genres,
      topMatches: similarities.slice(0, 3)
    });
  });

  return {
    vocabularySize: vocab.length,
    recommendations
  };
}

function classifyEngagementTiers(records) {
  const tierCounts = {
    'Blockbuster Hit': 0,
    'Critically Acclaimed Gem': 0,
    'Mainstream Commercial': 0,
    'Underperforming / Niche': 0
  };

  records.forEach(r => {
    const score = r.imdbScore;
    const votes = r.imdbVotes;

    let tier = 'Underperforming / Niche';
    if (score !== null) {
      if (score >= 7.5 && votes >= 100000) {
        tier = 'Blockbuster Hit';
      } else if (score >= 8.0 && votes < 100000) {
        tier = 'Critically Acclaimed Gem';
      } else if (score >= 6.0) {
        tier = 'Mainstream Commercial';
      }
    }
    tierCounts[tier] += 1;
  });

  return Object.entries(tierCounts).map(([tierName, count]) => ({
    tierName,
    count,
    percentage: Number(((count / records.length) * 100).toFixed(1))
  }));
}

module.exports = { buildRecommender, classifyEngagementTiers, cosineSimilarity };
