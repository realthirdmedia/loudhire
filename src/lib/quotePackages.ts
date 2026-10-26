export interface QuotePackage {
  id: string;
  group: 'Festival production' | 'Corporate AV';
  name: string;
  duration: string;
  price: number;
  description: string;
  details: string[];
  extras?: { label: string; price: number }[];
}

const festivalTiers = [
  {
    id: 'intimate', name: 'Intimate Crowd Production', audience: 'Up to 500 people',
    stage: '7m × 6m Stagemobil L stage', sound: 'd&b C7 PA and Yamaha DM3 mixer',
    power: '16A single phase at the stage', oneDay: 2950, twoDay: 4720, band: 200,
  },
  {
    id: 'mid', name: 'Mid-Size Crowd Production', audience: 'Up to 1,200 people',
    stage: '7m × 6m Stagemobil L stage', sound: 'd&b Q1 line array and Yamaha DM3 mixer',
    power: '32A single phase at the stage', oneDay: 3450, twoDay: 5520, band: 300,
  },
  {
    id: 'large', name: 'Large Crowd Production', audience: '2,500–3,000 people',
    stage: '7m × 6m Stagemobil L stage with PA wings', sound: 'Danley J7 PA and Allen & Heath SQ5 mixer',
    power: '32A three phase at the stage', oneDay: 4850, twoDay: 7760, band: 300,
  },
  {
    id: 'extra-large', name: 'Extra Large Crowd Production', audience: '3,500–6,000 people',
    stage: '10m × 6m Stagemobil XXL stage with PA wings', sound: 'Danley J7 PA and Allen & Heath SQ6 mixer',
    power: '63A three phase at the stage', oneDay: 7300, twoDay: 11680, band: 500,
  },
];

export const quotePackages: QuotePackage[] = [
  ...festivalTiers.flatMap((tier) => ([
    { id: `festival-${tier.id}-1-day`, duration: 'One day', price: tier.oneDay },
    { id: `festival-${tier.id}-2-day`, duration: 'Two days', price: tier.twoDay },
  ]).map((variant): QuotePackage => ({
    ...variant,
    group: 'Festival production',
    name: tier.name,
    description: `${tier.audience}. Stage, sound, lighting and crew for a 4–5 hour live show each day.`,
    details: [tier.stage, tier.sound, tier.power, 'Headline price includes a DJ setup'],
    extras: [{ label: 'Full band setup', price: tier.band }],
  }))),
  {
    id: 'corporate-sound', group: 'Corporate AV', name: 'Sound Only', duration: 'Event', price: 650,
    description: 'A compact speech and music system for meetings and presentations.',
    details: ['2 Martin Audio X8 speakers', 'Digital mixer amp rack', 'Handheld and headset wireless microphones', 'Engineer included'],
  },
  {
    id: 'corporate-sound-visual', group: 'Corporate AV', name: 'Sound & Visual', duration: 'Event', price: 925,
    description: 'Sound plus one 75-inch display and a lectern.',
    details: ['2 Martin Audio X8 speakers', 'Digital mixer amp rack', 'Handheld and headset wireless microphones', '75-inch 4K display on stand', 'Truss lectern', 'Engineer included'],
  },
  {
    id: 'corporate-extended', group: 'Corporate AV', name: 'Extended Sound & Visual', duration: 'Event', price: 1125,
    description: 'Sound plus two 75-inch displays for a wider room.',
    details: ['2 Martin Audio X8 speakers', 'Digital mixer amp rack', 'Handheld and headset wireless microphones', '2 × 75-inch 4K displays on stands', 'Truss lectern', 'Engineer included'],
  },
  {
    id: 'corporate-video-wall', group: 'Corporate AV', name: 'Sound & Video Wall', duration: 'Event', price: 2200,
    description: 'Sound plus a 4m × 2m LED video wall.',
    details: ['2 Martin Audio X8 speakers', 'Digital mixer amp rack', 'Handheld and headset wireless microphones', '4m × 2m 3.8mm LED video wall', 'Engineer included'],
  },
];

export const packageById = (id: string) => quotePackages.find((item) => item.id === id);
