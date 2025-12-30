import { parseFollowerCount } from '../lib/utils/parseFollowerCount';

// Example usage of parseFollowerCount utility
console.log('=== Follower Count Parsing Examples ===');

// Basic usage examples
const examples = [
  '2.4M',    // 2,400,000
  '980K',    // 980,000
  '12,300',  // 12,300
  '1.5B',    // 1,500,000,000
  '750K',    // 750,000
  '15.7M',   // 15,700,000
];

console.log('\n1. Basic parsing:');
examples.forEach(value => {
  console.log(`${value} -> ${parseFollowerCount(value).toLocaleString()}`);
});

// Sorting example - useful for ordering influencers by follower count
console.log('\n2. Sorting example:');
const influencers = [
  { name: 'Alice', followers: '1.2M' },
  { name: 'Bob', followers: '850K' },
  { name: 'Charlie', followers: '2.5M' },
  { name: 'Diana', followers: '12,300' },
  { name: 'Eve', followers: '1.8M' },
];

const sortedByFollowers = influencers
  .sort((a, b) => parseFollowerCount(b.followers) - parseFollowerCount(a.followers))
  .map(inf => ({
    ...inf,
    numericFollowers: parseFollowerCount(inf.followers)
  }));

console.log('Sorted influencers (highest to lowest):');
sortedByFollowers.forEach(inf => {
  console.log(`${inf.name}: ${inf.followers} (${inf.numericFollowers.toLocaleString()})`);
});

// Edge cases and validation
console.log('\n3. Edge cases:');
const edgeCases = ['', '   ', 'invalid', '1.2.3K', '1MM', 'abc', null, undefined];
edgeCases.forEach(value => {
  console.log(`${JSON.stringify(value)} -> ${parseFollowerCount(value as string)}`);
});

// Filtering example - find influencers with more than 1M followers
console.log('\n4. Filtering example:');
const megaInfluencers = influencers.filter(inf => 
  parseFollowerCount(inf.followers) >= 1000000
);

console.log('Influencers with 1M+ followers:');
megaInfluencers.forEach(inf => {
  console.log(`${inf.name}: ${inf.followers}`);
});

export {};
