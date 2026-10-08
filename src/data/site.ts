/**
 * Site-wide facts and navigation. Edit here, not in components.
 */
export const site = {
  name: 'Loud Hire',
  legalName: 'Loud Hire',
  url: 'https://www.loudhire.co.uk',
  tagline: 'Sound, lighting, staging, video and power. Your complete event production partner.',
  description:
    'Loud Hire is an event production company based in Thornbury, serving Bristol, the Cotswolds and the wider South West. Sound, lighting, staging, video and power for corporate events, brand launches, festivals and private events, plus equipment dry hire.',
  phone: '0117 214 1470',
  phoneHref: 'tel:+441172141470',
  email: 'info@loudhire.co.uk',
  whatsapp: 'https://wa.link/ualu2x',
  address: {
    street: 'Hacket Lane',
    town: 'Thornbury',
    city: 'Bristol',
    postcode: 'BS35 3TY',
    country: 'United Kingdom',
  },
  addressLine: 'Hacket Lane, Thornbury, Bristol BS35 3TY',
  mapsHref: 'https://www.google.com/maps/dir/?api=1&destination=Loud+Hire+Hacket+Lane+Thornbury+Bristol+BS35+3TY',
  hours: 'Monday to Friday, 9am to 5pm. Warehouse visits by appointment.',
  areas: 'Bristol, the Cotswolds and the wider South West',
  social: {
    instagram: 'https://www.instagram.com/loudhire/',
    facebook: 'https://www.facebook.com/loudhire/',
  },
  sisterCompany: { name: 'Big Stage Hire', url: 'https://bigstagehire.co.uk/' },
  marketingCredit: { name: 'Third Media', url: 'https://www.thirdmedia.io/' },
} as const;

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Event Production', href: '/event-production/' },
  { label: 'Dry Hire', href: '/dry-hire/' },
  { label: 'Packages', href: '/quote/#packages' },
  { label: 'Quote Basket', href: '/quote/' },
  { label: 'News & Projects', href: '/news-and-projects/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
] as const;

export const cta = { label: 'Build a quote', href: '/quote/' } as const;

/** The five capabilities. Order matters: it is the order they appear everywhere. */
export const capabilities = [
  {
    key: 'sound',
    name: 'Sound',
    href: '/event-production/sound/',
    short: 'PA systems for 20 people or 20,000, wireless microphones, digital mixing and engineers who know the venues.',
    benefit:
      'Sound designed around the event, not the box list: from Danley and d&b systems for festivals and headline shows to discreet speech systems for conferences and dinners, all mixed and monitored by our engineers.',
  },
  {
    key: 'lighting',
    name: 'Lighting',
    href: '/event-production/lighting/',
    short: 'Stage, architectural and ambient lighting, from subtle corporate washes to programmed, timecoded shows.',
    benefit:
      'LED and conventional fixtures, moving lights, festoon and uplighting, designed in advance and pre-visualised so you can see the look before the night. Efficient rigs that respect venue power limits.',
  },
  {
    key: 'staging',
    name: 'Staging',
    href: '/event-production/staging/',
    short: 'Litedeck platforms, Konligo stage roofs and, with Big Stage Hire, trailer stages up to 10m x 6m.',
    benefit:
      'The right platform for the space, built quickly and safely: indoor decks and risers, our Konligo Fastival roof for smaller outdoor events, and Stagemobil trailer stages for festivals and main stages.',
  },
  {
    key: 'video',
    name: 'Video',
    href: '/event-production/video/',
    short: 'Outdoor-rated LED video walls, large displays and projection for playback, presentations and live broadcasts.',
    benefit:
      'A 3.9mm LED wall bright enough for daylight, built on the ground, a stage deck or truss, with playback, cameras and streaming handled by the same team that does your sound and lighting.',
  },
  {
    key: 'power',
    name: 'Power',
    href: '/event-production/power/',
    short: 'Generators from 20kVA to 100kVA+, distribution, cabling and battery power for sites with no mains supply.',
    benefit:
      'Power planned alongside the production, so the generator, distro and cable runs are sized for the whole site, including caterers and bars, and arrive with the rest of the kit.',
  },
] as const;

export type CapabilityKey = (typeof capabilities)[number]['key'];

export const serviceLabel: Record<CapabilityKey, string> = {
  sound: 'Sound',
  lighting: 'Lighting',
  staging: 'Staging',
  video: 'Video',
  power: 'Power',
};

/** Event types served with complete production packages. */
export const eventTypes = [
  {
    key: 'corporate-events',
    name: 'Corporate events',
    href: '/event-production/corporate-events/',
    short: 'Conferences, awards dinners, company celebrations and anniversaries.',
  },
  {
    key: 'brand-launches',
    name: 'Brand launches',
    href: '/event-production/brand-launches/',
    short: 'Product and advert launches, press days and hospitality with a big-screen moment.',
  },
  {
    key: 'festivals',
    name: 'Festivals and public events',
    href: '/event-production/festivals/',
    short: 'Main stages, racecourse shows, town-centre events and fireworks.',
  },
  {
    key: 'private-events',
    name: 'Private events',
    href: '/event-production/private-events/',
    short: 'Festival-style parties, weddings and celebrations on private land.',
  },
  {
    key: 'performing-arts',
    name: 'Theatre and performing arts',
    href: '/event-production/performing-arts/',
    short: 'Productions, concerts and shows in venues, churches and unusual spaces.',
  },
] as const;

/** Verified testimonials already published by the business. */
export const testimonials = [
  {
    quote:
      'Loud Hire were very professional and helpful from the moment we contacted them to packing up after the event. Our Proms in the Park event included many different acts which were all supported excellently, giving good sound over the whole range of music groups.',
    name: 'Jo Ainsworth',
    context: 'Proms in the Park, Google review',
  },
  {
    quote: 'It was great working with you and we look forward to next year.',
    name: 'Shield Group',
    context: 'Corporate festival, Bath Racecourse',
  },
  {
    quote: 'Thanks for taking good care of our corporate hire client.',
    name: 'Bath Racecourse',
    context: 'Venue partner',
  },
  {
    quote: 'Feedback from our regular fans said it was one of the best sounding shows they have ever done.',
    name: 'Touring engineer for The Wurzels',
    context: 'Bath Racecourse cider night',
  },
  {
    quote: 'Thanks so much for all your support. Everything looked amazing, thank you!',
    name: 'Aerospace Bristol',
    context: '5th anniversary celebration',
  },
  {
    quote:
      'Professional and friendly chap. We got the PA for a party exactly as advertised and pick-up and drop-off were easy. Would greatly recommend.',
    name: 'Mark Toolan',
    context: 'Dry hire, Google review',
  },
] as const;
