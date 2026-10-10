/**
 * Automated Test Suite - Netflix Content Analytics & Recommender AI
 * Academic Capstone Submission • Final Year Engineering in AIML
 * Student: Mithun Gowda M (B.E. / B.Tech AIML)
 */
const assert = require('assert');
const path = require('path');
const { processNetflixData, cleanArrayField } = require('../src/netflix_analytics');

console.log('Running Netflix Analytics Test Suite...');

const csvPath = path.join(__dirname, '..', 'data', 'netflix_titles.csv');
const result = processNetflixData(csvPath);

// Test 1: Record Count & Split Conservation
assert(result.kpis.totalTitles > 5500, `Expected > 5500 titles, got ${result.kpis.totalTitles}`);
assert.strictEqual(result.kpis.movieCount + result.kpis.showCount, result.kpis.totalTitles, 'Movies + Shows must equal Total');
console.log(`✓ Test 1 Passed: Catalog volume verified (${result.kpis.totalTitles} titles: ${result.kpis.movieCount} movies, ${result.kpis.showCount} shows)`);

// Test 2: Array Field Cleaning Helper
const cleanedGenres = cleanArrayField("['crime', 'drama']");
assert.deepStrictEqual(cleanedGenres, ['crime', 'drama'], 'Array cleaning must extract array tokens');
console.log('✓ Test 2 Passed: Array parsing sanitization verified');

// Test 3: IMDb Rating Sanity
assert(result.kpis.avgScore > 5 && result.kpis.avgScore < 8.5, `IMDb average outside sanity bounds: ${result.kpis.avgScore}`);
console.log(`✓ Test 3 Passed: Global IMDb rating validated (${result.kpis.avgScore} / 10)`);

// Test 4: Predictive Preference Scores
result.topRatedTitles.forEach(t => {
  assert(t.preferenceScore >= 0 && t.preferenceScore <= 100, `Preference score outside 0-100: ${t.preferenceScore}`);
});
console.log('✓ Test 4 Passed: Predictive viewer preference scoring model validated');

// Test 5: Genre & Age Certification Mapping
assert(result.genres.length >= 8, 'Must extract top genres');
assert(Object.keys(result.ageCertifications).includes('TV-MA'), 'Must include TV-MA rating');
console.log('✓ Test 5 Passed: Genre and age certification classifications verified');

// Test 6: AIML Content-Based Recommender (Cosine Similarity)
const recs = result.aiIntelligence.recommender.recommendations;
assert(recs.length > 0, 'Must produce content recommendations');
recs.forEach(r => {
  assert(r.topMatches.length > 0, 'Seed title must have recommendations');
  r.topMatches.forEach(m => {
    assert(m.similarityScore >= 0 && m.similarityScore <= 1, `Cosine similarity out of bounds [0, 1]: ${m.similarityScore}`);
  });
});
console.log(`✓ Test 6 Passed: AIML TF-IDF & Cosine similarity recommender verified (Seed: ${recs[0].seedTitle} -> Top match: ${recs[0].topMatches[0].targetTitle})`);

// Test 7: AIML Viewer Engagement Classifier
const tiers = result.aiIntelligence.engagementTiers;
assert.strictEqual(tiers.length, 4, 'Must produce 4 engagement tiers');
const totalClassified = tiers.reduce((a, b) => a + b.count, 0);
assert.strictEqual(totalClassified, result.kpis.totalTitles, 'All titles must be classified into tiers');
console.log('✓ Test 7 Passed: AIML Multi-class viewer engagement classification validated');

console.log('\nAll Netflix Content Analytics tests passed successfully! (7/7)');
