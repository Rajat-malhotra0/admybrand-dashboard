/**
 * Parses follower count strings like "2.4M", "980K", "12,300" into plain numbers.
 * 
 * @param str - The follower count string to parse
 * @returns The parsed number value
 * 
 * @example
 * parseFollowerCount("2.4M") // returns 2400000
 * parseFollowerCount("980K") // returns 980000
 * parseFollowerCount("12,300") // returns 12300
 * parseFollowerCount("1.5B") // returns 1500000000
 */
export function parseFollowerCount(str: string): number {
  if (!str || typeof str !== 'string') {
    return 0;
  }

  // Remove any whitespace and convert to uppercase for consistent processing
  const cleanStr = str.trim().toUpperCase();
  
  // Handle empty string
  if (cleanStr === '') {
    return 0;
  }

  // Extract the numeric part and the suffix with more strict regex
  // Allow only one decimal point and proper number formatting
  const match = cleanStr.match(/^(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?)([KMBT]?)$/);
  
  if (!match) {
    return 0; // Invalid format
  }

  const [, numericPart, suffix] = match;
  
  // Remove commas and parse the numeric part
  const baseNumber = parseFloat(numericPart.replace(/,/g, ''));
  
  if (isNaN(baseNumber)) {
    return 0;
  }

  // Apply the multiplier based on the suffix
  switch (suffix) {
    case 'K':
      return baseNumber * 1000;
    case 'M':
      return baseNumber * 1000000;
    case 'B':
      return baseNumber * 1000000000;
    case 'T':
      return baseNumber * 1000000000000;
    default:
      return baseNumber;
  }
}
