import { parseFollowerCount } from '@/lib/utils/parseFollowerCount';

describe('Sorting Logic with parseFollowerCount', () => {
  // Sample influencer data for testing
  const sampleInfluencers = [
    { id: 1, name: 'Sarah Johnson', projects: 12, followers: '2.4M' },
    { id: 2, name: 'Mike Chen', projects: 8, followers: '1.8M' },
    { id: 3, name: 'Alex Rivera', projects: 15, followers: '980K' },
    { id: 4, name: 'Emma Davis', projects: 6, followers: '3.1M' },
    { id: 5, name: 'John Smith', projects: 20, followers: '500K' },
    { id: 6, name: 'Lisa Wong', projects: 9, followers: '1.2B' },
  ];

  test('parseFollowerCount correctly parses different formats', () => {
    expect(parseFollowerCount('2.4M')).toBe(2400000);
    expect(parseFollowerCount('980K')).toBe(980000);
    expect(parseFollowerCount('1.2B')).toBe(1200000000);
    expect(parseFollowerCount('12,300')).toBe(12300);
    expect(parseFollowerCount('500')).toBe(500);
  });

  test('sorting influencers by followers in descending order', () => {
    const sorted = [...sampleInfluencers].sort((a, b) => {
      const aFollowers = parseFollowerCount(a.followers);
      const bFollowers = parseFollowerCount(b.followers);
      return bFollowers - aFollowers; // desc order
    });

    // Expected order: Lisa Wong (1.2B) > Emma Davis (3.1M) > Sarah Johnson (2.4M) > Mike Chen (1.8M) > Alex Rivera (980K) > John Smith (500K)
    expect(sorted[0].name).toBe('Lisa Wong');
    expect(sorted[1].name).toBe('Emma Davis');
    expect(sorted[2].name).toBe('Sarah Johnson');
    expect(sorted[3].name).toBe('Mike Chen');
    expect(sorted[4].name).toBe('Alex Rivera');
    expect(sorted[5].name).toBe('John Smith');
  });

  test('sorting influencers by followers in ascending order', () => {
    const sorted = [...sampleInfluencers].sort((a, b) => {
      const aFollowers = parseFollowerCount(a.followers);
      const bFollowers = parseFollowerCount(b.followers);
      return aFollowers - bFollowers; // asc order
    });

    // Expected order: John Smith (500K) > Alex Rivera (980K) > Mike Chen (1.8M) > Sarah Johnson (2.4M) > Emma Davis (3.1M) > Lisa Wong (1.2B)
    expect(sorted[0].name).toBe('John Smith');
    expect(sorted[1].name).toBe('Alex Rivera');
    expect(sorted[2].name).toBe('Mike Chen');
    expect(sorted[3].name).toBe('Sarah Johnson');
    expect(sorted[4].name).toBe('Emma Davis');
    expect(sorted[5].name).toBe('Lisa Wong');
  });

  test('handles edge cases in parseFollowerCount', () => {
    expect(parseFollowerCount('')).toBe(0);
    expect(parseFollowerCount(undefined as any)).toBe(0);
    expect(parseFollowerCount(null as any)).toBe(0);
    expect(parseFollowerCount('invalid')).toBe(0);
  });

  test('demonstrates the complete sorting implementation', () => {
    // This simulates what the useSortedInfluencers hook does
    const sortInfluencers = (influencers: any[], sortOrder: 'asc' | 'desc') => {
      return [...influencers].sort((a, b) => {
        const aFollowers = parseFollowerCount(a.followers);
        const bFollowers = parseFollowerCount(b.followers);
        
        if (sortOrder === 'asc') {
          return aFollowers - bFollowers;
        } else {
          return bFollowers - aFollowers;
        }
      });
    };

    const descSorted = sortInfluencers(sampleInfluencers, 'desc');
    const ascSorted = sortInfluencers(sampleInfluencers, 'asc');

    // Verify that sorting actually reorders the array
    expect(descSorted[0].name).not.toBe(ascSorted[0].name);
    expect(descSorted[0].name).toBe('Lisa Wong'); // Highest
    expect(ascSorted[0].name).toBe('John Smith'); // Lowest

    // Verify that original array is not mutated
    expect(sampleInfluencers[0].name).toBe('Sarah Johnson');
  });
});
