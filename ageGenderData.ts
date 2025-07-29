// Interface for age-gender demographic data
export interface AgeGenderDatum {
  ageRange: string;
  male: number;
  female: number;
}

// Sample dataset with six age ranges and example percentages
// Each age range's male and female percentages sum to 100
export const sampleAgeGenderData: AgeGenderDatum[] = [
  {
    ageRange: "0-17",
    male: 51.2,
    female: 48.8
  },
  {
    ageRange: "18-24",
    male: 50.8,
    female: 49.2
  },
  {
    ageRange: "25-34",
    male: 49.7,
    female: 50.3
  },
  {
    ageRange: "35-44",
    male: 49.9,
    female: 50.1
  },
  {
    ageRange: "45-64",
    male: 48.6,
    female: 51.4
  },
  {
    ageRange: "65+",
    male: 45.2,
    female: 54.8
  }
];
