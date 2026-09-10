/**
 * Copy for the pages beneath /event-production/.
 * Five capability pages and five event-type pages, all rendered by
 * src/pages/event-production/[slug].astro. Keep claims to what the business
 * actually provides; project ids refer to src/content/news-and-projects/.
 */
import type { ImageMetadata } from 'astro';
import type { CapabilityKey } from './site';

import imgSound from '../assets/pages/danley-stage.jpg';
import imgLighting from '../assets/projects/aerospace-bristol-5th-anniversary/hangar.jpg';
import imgStaging from '../assets/news/konligo-fastival/roof-front.jpg';
import imgVideo from '../assets/news/led-video-wall-hire/hawkstone-viewing.jpg';
import imgPower from '../assets/pages/generator-100kva.jpg';
import imgCorporate from '../assets/projects/shield-group/stage-crowd.jpg';
import imgBrand from '../assets/projects/hawkstone-advert-launch/stage.jpg';
import imgFestivals from '../assets/projects/the-wurzels/crowd-from-stage.jpg';
import imgPrivate from '../assets/projects/festival-birthday-party/stage-night.jpg';
import imgArts from '../assets/projects/mount-without-bristol/venue.jpg';

export interface SubPage {
  slug: string;
  kind: 'capability' | 'event-type';
  service?: CapabilityKey;
  navName: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  image: ImageMetadata;
  imageAlt: string;
  /** Body copy: each string is a paragraph; headings prefixed with "## ". */
  body: string[];
  supplyHeading: string;
  supply: string[];
  projectIds: string[];
  newsIds?: string[];
  equipmentSection?: string;
}

export const subPages: SubPage[] = [
  /* ------------------------------------------------------------- Capabilities */
  {
    slug: 'sound',
    kind: 'capability',
    service: 'sound',
    navName: 'Sound',
    title: 'Event sound hire and engineering',
    metaTitle: 'Event Sound Hire Bristol & the Cotswolds | PA Systems, Wireless Mics, Engineers',
    metaDescription:
      'PA systems from 20 people to 20,000, Danley and d&b loudspeakers, Sennheiser wireless microphones and Allen & Heath mixing, with engineers on site. Event sound hire from Thornbury for Bristol, the Cotswolds and the South West.',
    intro:
      'From a lectern microphone to a festival main stage, we design the sound system around the audience, the space and the acts, then send engineers who know the kit and the venues.',
    image: imgSound,
    imageAlt: 'Band performing on an outdoor stage with a Danley loudspeaker in the foreground',
    body: [
      'Loud Hire has more than 30 years of experience in professional audio. We stock systems for indoor and outdoor events of every size, and we specify each one with around 30% more headroom than the event needs, so the system never sounds strained.',
      '## Systems for every scale',
      'For festivals, racecourse shows and headline acts we use our Danley Sound Labs J7-95 loudspeakers with BC415 subwoofers: a true single-source system that covers large crowds with low distortion and a small footprint, and has drawn compliments from touring engineers and fans alike. For corporate events, high-end private parties and theatre we hold d&b audiotechnik C and Q series systems with D12 and D20 amplification. Martin Audio W8LM line array and W8C point-source systems cover long-throw and town-centre work, and Electro-Voice active systems suit smaller rooms and DIY parties.',
      '## Mixing, wireless and networking',
      'Front-of-house and monitor mixing is on Allen & Heath SQ, Avantis and dLive consoles, with line-split systems so a touring engineer can run their own console alongside ours. All our mixing systems are Dante-ready, which lets us split feeds for broadcast and monitoring, send audio over a fibre network to remote speakers across a site, and set up a remote override so every system on site can be shut down for emergency announcements.',
      'We stock more than 60 channels of Sennheiser EW-D and EW-DX wireless microphones and in-ear monitoring, racked in 4s and 8s and ready to go, and we can guide you through OFCOM licensing.',
      '## Difficult sites',
      'Sound is where experience shows. We have flown and angled systems to keep noise off homes 60m from a festival stage, time-aligned a 2km run of speakers for 13,000 runners, and put a battery-powered system in a hot air balloon. If the site is awkward, tell us early and we will design around it.',
    ],
    supplyHeading: 'What we supply',
    supply: [
      'Danley Sound Labs J7-95 and SM80 loudspeakers, BC415 and TH-Mini subwoofers, DNA amplification',
      'd&b audiotechnik C and Q series with D12 and D20 amplifiers',
      'Martin Audio W8LM line array, W8C, WS218X subwoofers and LE12J monitors on Linea Research amplifiers',
      'Electro-Voice ETX, ZLX and Everse active systems',
      'Allen & Heath SQ5, SQ6, CQ18T, Avantis and dLive mixing, with GX4816 stage boxes',
      'Sennheiser EW-D and EW-DX wireless microphones, IEM, Shure, sE and AKG wired microphones, DI boxes',
      'Horn speaker systems for large-site announcements and 100V line',
      'Sound engineers, system design and site-wide audio networking',
    ],
    projectIds: [
      'the-wurzels-bath-racecourse',
      'gloucester-tall-ships-festival',
      'eats-everything-hot-air-balloon',
      'bristol-10k',
      'proms-in-the-park-speech-house',
      'ilford-queens-jubilee',
    ],
    newsIds: ['danley-sound-labs-pa', 'wireless-microphone-hire', 'martin-audio-line-array', 'great-sound-without-feedback'],
    equipmentSection: 'sound',
  },
  {
    slug: 'lighting',
    kind: 'capability',
    service: 'lighting',
    navName: 'Lighting',
    title: 'Event lighting design and hire',
    metaTitle: 'Event Lighting Hire Bristol & the Cotswolds | Stage, Architectural & Programmed Shows',
    metaDescription:
      'Stage and architectural lighting for corporate events, festivals, weddings and theatre: LED washes, moving lights, followspots, festoon and uplighting, designed in advance and operated by our crew. Based in Thornbury, serving Bristol, the Cotswolds and the South West.',
    intro:
      'Lighting that suits the occasion: a subtle wash for a dinner, a programmed show for a festival stage, uplighting and festoon across a whole site.',
    image: imgLighting,
    imageAlt: 'Historic aircraft in a museum hangar washed in deep blue light for an evening event',
    body: [
      'Every performance and every room can be improved by the right lighting, and spoiled by the wrong kind. We design the rig around what the event needs to look like, plan it in advance, and where it helps we pre-visualise the show so you can see the look before the night.',
      '## Stage and show lighting',
      'Our stock is built around efficient, high-output LED fixtures: Chauvet Maverick MK2 washes, Ovation F-915FC LED fresnels, Rogue outdoor beams, Spectra pars, battens and floods, Elumen8 Hex pars and Tour Batten sunstrips. For theatre and precision work we add ETC Source Four profiles with gobos, Selecon fresnels and LDR followspots. Control is on ChamSys MQ70 and Zero 88 FLX consoles, with timecode where a show needs to lock to music or fireworks.',
      '## Architectural and ambient lighting',
      'Outside the stage we supply festoon in runs from 7.5m to 100m on dimmers, battery uplighters, high-power tree uplighting, IP-rated outdoor floods and tower lights for site safety. It is often the ambient lighting, not the stage, that makes a private event or a corporate dinner feel finished.',
      '## Working within the venue',
      'LED rigs draw a fraction of the power of conventional lighting. That lets us light listed buildings and museums from their existing floor sockets, and run a full stage rig alongside the PA on a limited supply without a generator.',
    ],
    supplyHeading: 'What we supply',
    supply: [
      'Chauvet Maverick MK2 washes, Ovation F-915FC LED fresnels and Rogue outdoor beams',
      'Spectra Par, Batten and Flood fixtures, Elumen8 Alu Hex pars and Tour Batten TW sunstrips',
      'ETC Source Four profiles, Selecon Acclaim fresnels and profiles, PAR64 conventionals',
      'LDR Canto and Alba followspots',
      'ChamSys MQ70 and Zero 88 FLX consoles, dimmers, DMX distribution and wireless DMX',
      'Festoon, battery uplighters, outdoor LED floods and tower lights',
      'Haze, pyro control and effects',
      'Lighting design, pre-visualisation, timecode programming and operators',
    ],
    projectIds: [
      'downend-fireworks-lighting',
      'aerospace-bristol-5th-anniversary',
      'shakespeare-at-the-mount-without',
      'festival-style-tipi-wedding',
      'shield-group-corporate-festival',
      'bristol-boxing-night',
    ],
    newsIds: ['stage-lighting-investments-2019', 'elumen8-alu-hex-par-64', 'theatre-lighting-and-sound-hire'],
    equipmentSection: 'lighting',
  },
  {
    slug: 'staging',
    kind: 'capability',
    service: 'staging',
    navName: 'Staging',
    title: 'Stage hire: decks, roofs and trailer stages',
    metaTitle: 'Stage Hire Bristol & the Cotswolds | Litedeck, Konligo Roofs & Trailer Stages',
    metaDescription:
      'Indoor decks and risers, the Konligo Fastival stage roof for outdoor events, and Stagemobil trailer stages up to 10m x 6m with our sister company Big Stage Hire. Stage hire and rigging from Thornbury for Bristol, the Cotswolds and the South West.',
    intro:
      'The right platform for the space, built quickly and safely: Litedeck for rooms and risers, our Konligo Fastival roof for outdoor events, and trailer stages for festivals with Big Stage Hire.',
    image: imgStaging,
    imageAlt: 'Konligo Fastival stage roof with a singer performing and guests seated at picnic benches',
    body: [
      'Staging sets the scale of an event, and the speed it can be built and removed often decides whether a site or a schedule works at all. We hold our own decking and stage roof, and for large outdoor stages we work with our sister company Big Stage Hire, so one plan covers the stage and everything on it.',
      '## Decks and platforms',
      'Our Litedeck stock, more than 60 panels in 8ft x 4ft, 4ft x 4ft, 8ft x 2ft and 4ft x 2ft sizes, builds stages, risers, catwalks and camera platforms indoors and out, with pit rail, cable access sections and steps. Tipi and marquee stages, church and museum platforms, and stage-deck bases for video walls all come from the same stock.',
      '## Konligo Fastival stage roof',
      'For smaller outdoor events that deserve better than a gazebo, our Konligo Fastival roof builds in around 20 minutes straight onto grass or onto a Litedeck base. It has 6m x 4m of internal space, 200kg of roof loading for front and back light, and a back wall that can carry your event branding.',
      '## Trailer stages and large structures',
      'With Big Stage Hire we supply Stagemobil L and XXL trailer stages up to 10m x 6m, ideal where the build window is short: a trailer stage and rapid-deployment sound had a London high street live within two hours. Larger structures, a 12m x 10m Prolyte roof, delay towers and custom Layher scaffold builds, are available for festivals and main stages. We also carry F34 truss, chain hoists and our 6m x 6m ground-support structure for flying screens and lighting.',
    ],
    supplyHeading: 'What we supply',
    supply: [
      'Litedeck staging in four panel sizes, with legs, pit rail, steps and cable access sections',
      'Konligo Fastival stage roof (6m x 4m internal, 200kg roof loading)',
      'Stagemobil L and XXL trailer stages with Big Stage Hire',
      '12m x 10m Prolyte roof, delay towers and Layher scaffold structures',
      'F34 truss, CM Lodestar and manual chain hoists, 6m x 6m ground support',
      'Crank stands, speaker stands, stage weights and rigging accessories',
      'Site layout and CAD planning, crew for build and de-rig',
    ],
    projectIds: [
      'konligo-fastival-stage-roof',
      'hawkstone-advert-launch',
      'gloucester-tall-ships-festival',
      'proms-in-the-park-speech-house',
      'ilford-queens-jubilee',
      'festival-style-tipi-wedding',
    ],
    newsIds: ['konligo-fastival-stage-roof', '2022-review'],
    equipmentSection: 'staging',
  },
  {
    slug: 'video',
    kind: 'capability',
    service: 'video',
    navName: 'Video',
    title: 'LED video wall, screen and projection hire',
    metaTitle: 'LED Video Wall Hire Bristol & the Cotswolds | Screens, Projection & Live Broadcast',
    metaDescription:
      'Outdoor-rated 3.9mm LED video walls up to 6,000 nits, 55 to 85 inch displays, laser projection and live streaming for presentations, launches and big-screen broadcasts. Video hire from Thornbury for Bristol, the Cotswolds and the South West.',
    intro:
      'A screen bright enough for daylight, built on the ground, a stage deck or truss, with playback, cameras and streaming handled by the same team that does your sound and lighting.',
    image: imgVideo,
    imageAlt: 'Audience watching a live television broadcast on an outdoor LED video wall',
    body: [
      'Video is where a launch, a presentation or a big-screen viewing either lands or falls flat. We own our LED wall and display stock rather than sub-hiring it, so the screen, the content and the audio are planned together.',
      '## LED video wall',
      'Our 3.9mm pixel pitch LED wall is rated for indoor and outdoor use, with excellent colour and up to 6,000 nits of brightness that we adjust to the conditions. The usual starting size is 4m x 2m; we have supplied 5.5m x 3m for World Cup football and a 7m x 3m wall above a stage for an advert launch. It builds from level ground, on a Litedeck base, suspended from our 6m x 6m black truss structure, or on a Tomcat video wall structure for larger screens, all controlled by Novastar processing.',
      '## Playback, cameras and streaming',
      'For a simple presentation we take a feed straight from your laptop with sound. For more involved events we provide a full video control package to switch between presentations, live cameras and remote speakers joining virtually, and we can stream the output. In remote locations a Starlink link keeps the stream running.',
      '## Displays and projection',
      'Where a wall is too much, our 55 to 85 inch commercial displays can be linked to share the same content around a site or used stand-alone, and our 6,100-lumen Sony laser projector with fast-fold screens suits conferences, dinners and indoor screenings.',
    ],
    supplyHeading: 'What we supply',
    supply: [
      '3.9mm outdoor-rated LED video wall in any configuration, Novastar processing',
      'Ground, stage-deck, 6m x 6m truss and Tomcat mounting structures',
      '55 to 85 inch commercial displays, linked or stand-alone',
      'Sony VPL-FHZ66 6,100-lumen laser projector and fast-fold screens',
      'Video playback and switching, cameras, live streaming and Starlink connectivity',
      'Microphones, PA and lighting to complete the presentation',
    ],
    projectIds: ['hawkstone-advert-launch', 'video-wall-for-stretch-tent'],
    newsIds: ['led-video-wall-hire'],
    equipmentSection: 'video',
  },
  {
    slug: 'power',
    kind: 'capability',
    service: 'power',
    navName: 'Power',
    title: 'Event power: generators, distribution and cabling',
    metaTitle: 'Event Power Hire Bristol & the Cotswolds | Generators, Distribution & Cabling',
    metaDescription:
      'Generators from 20kVA to 115kVA, three-phase and single-phase distribution, cabling, tower lights and battery power for events with no mains supply. Planned alongside your sound, lighting and staging. Based in Thornbury, serving Bristol, the Cotswolds and the South West.',
    intro:
      'Power planned alongside the production, so the generator, the distribution and the cable runs are sized for the whole site, including caterers and bars, and arrive with the rest of the kit.',
    image: imgPower,
    imageAlt: 'JCB generator in a white enclosure',
    body: [
      'Temporary power is the part of an event nobody notices until it fails. Because we plan it with the sound, lighting, staging and video, the supply is sized for everything on site, not just our own equipment, and it arrives on the same truck with the same crew.',
      '## Generators',
      'Our fleet runs from a 20kVA FG Wilson set for small sites, through 60kVA road-tow generators for festival stages and marquees, to JCB 105kVA and 115kVA sets for larger productions. All are regularly serviced and tested. On a busy summer weekend we regularly have four or more generators out across the South West.',
      '## Distribution and cabling',
      'We carry 63A and 32A three-phase distribution with individually protected outlets, single-phase distros, and a large stock of 63A, 32A, 16A, Socapex and PowerCon cabling, all tested before and after every hire. Tower lights cover site safety after dark.',
      '## Battery and silent power',
      'Where a diesel generator is unwelcome, or impossible, we build battery and inverter systems: 1,000W inverter units on 76Ah battery packs powered a PA for a thousand people at a carbon rally, and a full DJ rig in a hot air balloon basket.',
    ],
    supplyHeading: 'What we supply',
    supply: [
      'FG Wilson 20kVA, 60kVA road-tow and JCB 105kVA and 115kVA generators',
      '63A and 32A three-phase distribution, single-phase distros with RCBO protection',
      '63A, 32A, 16A, 13A, Socapex and PowerCon cabling and adaptors',
      'Generac VB9 tower lights',
      '1,000W inverter units and 12V 76Ah battery packs',
      'Site power planning, load calculations and on-site technicians',
    ],
    projectIds: [
      'carbon-action-rally-college-green',
      'video-wall-for-stretch-tent',
      'festival-style-tipi-wedding',
      'shield-group-corporate-festival',
      'eats-everything-hot-air-balloon',
      'ilford-queens-jubilee',
    ],
    equipmentSection: 'power',
  },

  /* ------------------------------------------------------------- Event types */
  {
    slug: 'corporate-events',
    kind: 'event-type',
    navName: 'Corporate events',
    title: 'Corporate event production',
    metaTitle: 'Corporate Event Production Bristol & the Cotswolds | Conferences, Dinners & Celebrations',
    metaDescription:
      'Sound, lighting, staging, video and power for conferences, awards dinners, team meetings, company celebrations and staff festivals. One production partner across Bristol, the Cotswolds and the South West, based in Thornbury.',
    intro:
      'Conferences, awards dinners, team meetings, anniversaries and staff festivals. We handle the technical side so your event looks organised because it is.',
    image: imgCorporate,
    imageAlt: 'Crowd in front of a lit festival stage at a company summer event at Bath Racecourse',
    body: [
      'When you host a conference, a launch or a company celebration you go to a lot of effort to create the right environment for your guests. Our job is to enhance that with seamless sound, considered lighting and screens that just work, and to make the whole thing easier to organise by giving you one team to deal with.',
      '## What a corporate package usually includes',
      'Speech reinforcement that is clear to every seat, radio microphones for presenters and panels, a lectern or headset options, screens or an LED wall for presentations, playback and video switching, lighting that flatters the room and the stage, and a stage or riser where one is needed. If the day turns into an evening we add DJ or band systems, dance-floor lighting and uplighting without a second supplier. We can also record the conference audio for you to distribute afterwards.',
      '## How we work with you',
      'Every client has one named contact from the first call to the de-rig. We meet you, visit the venue, and produce a plan and a quote that show what your budget delivers. Our crew has extensive experience in the corporate sector and understands its timings, its dress codes and its expectations.',
      '## Experience',
      "Recent corporate work includes an evening celebration and exhibition reveal for Aerospace Bristol, a two-day corporate festival for Shield Group at Bath Racecourse, a daylight LED wall for an NFU Mutual team meeting and sound for British Airways' Flight-Ops summer fly-in.",
    ],
    supplyHeading: 'Typically included',
    supply: [
      'Conference PA with lectern, handheld and headset radio microphones',
      'LED video wall or displays, laptop playback, video switching and recording',
      'Stage, riser or lectern staging',
      'Room, stage and ambient lighting',
      'Evening entertainment sound and lighting',
      'Site or venue power where the supply is limited',
      'A named production contact and crew on site throughout',
    ],
    projectIds: [
      'aerospace-bristol-5th-anniversary',
      'shield-group-corporate-festival',
      'video-wall-for-stretch-tent',
      'british-airways-summer-fly-in',
    ],
  },
  {
    slug: 'brand-launches',
    kind: 'event-type',
    navName: 'Brand launches',
    title: 'Brand and product launch production',
    metaTitle: 'Brand Launch Event Production Bristol & the Cotswolds | Sound, LED Walls & Staging',
    metaDescription:
      'Production for product launches, advert premieres, press days and hospitality: LED walls for the reveal, sound for presenters and live acts, lighting, staging and overnight builds. Bristol, the Cotswolds and the South West.',
    intro:
      'A launch has one moment that matters. We build everything around it: the screen, the sound, the stage and the schedule that gets it all in place without disturbing the venue.',
    image: imgBrand,
    imageAlt: 'Presenter on a branded stage at a Hawkstone launch event',
    body: [
      'Launches bring together a brand team, an agency, a venue and often a film crew. What they need from production is a reliable partner who can deliver the technical plan, hit the build window and make the reveal look as good in the room as it does on camera.',
      '## Built around the moment',
      'For the launch of the new Hawkstone TV adverts at The Farmer’s Dog we built overnight so the pub could trade as normal, put a Danley PA and subtle lighting on a 10m x 6m stage from Big Stage Hire, and rigged a 7m x 3m LED video wall above the stage for the premiere itself, with radio microphones for every member of The Farmers Choir. For a single launch we put a sound system in a hot air balloon.',
      '## What a launch package usually includes',
      'An LED wall or screens sized to the content and the audience, video playback and switching, sound for presenters, DJs and live acts, stage and lighting that suit the brand, power where the site has none, and a crew who can build and strike to a tight schedule. Where the launch is being filmed or streamed we work with the film crew on feeds and camera positions.',
    ],
    supplyHeading: 'Typically included',
    supply: [
      'LED video wall or displays with playback and switching',
      'PA and wireless microphones for presenters and performers',
      'Stage, roof and branded set elements',
      'Lighting design for the room and for camera',
      'Overnight or short-window builds and de-rigs',
      'Generators and distribution for outdoor or off-grid sites',
    ],
    projectIds: ['hawkstone-advert-launch', 'eats-everything-hot-air-balloon', 'aerospace-bristol-5th-anniversary'],
    newsIds: ['led-video-wall-hire'],
  },
  {
    slug: 'festivals',
    kind: 'event-type',
    navName: 'Festivals and public events',
    title: 'Festival and public event production',
    metaTitle: 'Festival & Public Event Production Bristol, Cotswolds & South West | Stages, Sound & Lighting',
    metaDescription:
      'Main stages, racecourse shows, town-centre events, proms, fireworks and mass-participation sports: full production packages with noise management, tight build windows and site power. Loud Hire, based in Thornbury near Bristol.',
    intro:
      'Main stages, racecourse shows, town-centre celebrations, proms in the park and firework displays. Full production packages for organisers who need it to work first time.',
    image: imgFestivals,
    imageAlt: 'View from the stage of a crowd of thousands at Bath Racecourse',
    body: [
      'We have provided sound, lighting and staging for festivals and public events across Bristol, the Cotswolds and the South West for more than 30 years, from the Gloucester Tall Ships Festival and the summer shows at Bath Racecourse to town-centre events in London and firework displays in Bristol. Because we are local we can visit the site and talk through the plan before you commit.',
      '## Designed for the site',
      'Public events bring their own constraints: off-site noise limits, short build windows around road closures or racing, audiences spread over long distances, and power that has to reach the whole site. We have flown and angled PA to protect neighbours 60m from a stage, redeployed a full system overnight in just over four hours, covered guests camped 100m from the stage, and synchronised a lighting show to fireworks by timecode.',
      '## What a festival package usually includes',
      'A stage sized for the line-up, from our Konligo Fastival roof to Stagemobil trailer stages with Big Stage Hire, a Danley or Martin Audio PA with monitors and a line-split for touring engineers, stage lighting with an operator, generators and distribution for the stage and site, and crew from build to strike. We can add LED walls for big-screen viewing and horn systems for site-wide announcements.',
    ],
    supplyHeading: 'Typically included',
    supply: [
      'Stage roofs and trailer stages up to 10m x 6m',
      'Festival PA with front-of-house and monitor mixing, wireless microphones and line-split',
      'Stage lighting rig with operator, timecode where required',
      'Generators, distribution and site cabling',
      'LED video walls for big-screen viewing',
      'Site-wide announcement systems',
      'Crew for build, show and de-rig, including overnight turnarounds',
    ],
    projectIds: [
      'gloucester-tall-ships-festival',
      'the-wurzels-bath-racecourse',
      'downend-fireworks-lighting',
      'proms-in-the-park-speech-house',
      'ilford-queens-jubilee',
      'christmas-concert-ilford',
      'bristol-10k',
      'santas-float-bristol',
    ],
  },
  {
    slug: 'private-events',
    kind: 'event-type',
    navName: 'Private events',
    title: 'Private event and wedding production',
    metaTitle: 'Private Party & Wedding Production Bristol & the Cotswolds | Sound, Lighting, Staging & Power',
    metaDescription:
      'Festival-style parties, weddings and celebrations on private land: site planning, stages, sound for bands and DJs, lighting, festoon and generators from one team. Loud Hire serves Bristol, the Cotswolds and the South West from Thornbury.',
    intro:
      'Festival-style birthdays, tipi weddings and celebrations on private land, planned and delivered by one team so you can be a host rather than a project manager.',
    image: imgPrivate,
    imageAlt: 'Outdoor stage lit in blue and purple with guests dancing at a private party',
    body: [
      'Private events on private land are the most rewarding to work on and the easiest to get wrong. A field has no power, no stage and no lighting, and the caterers, the bar and the toilets all need a supply too. We start with a site visit and a layout plan, work out the power with your other suppliers, and then provide the stage, sound and lighting as one package.',
      '## What a private event package usually includes',
      'A stage sized for the band, from a Litedeck platform inside a tipi to our Konligo Fastival roof or a trailer stage for a bigger party, a PA and engineer for bands and DJs, stage lighting, festoon and uplighting across the site, and a generator with distribution for everything. For DJs we supply Pioneer CDJ and DJM playback; for smaller gatherings our party PA packages are available as dry hire.',
      '## Experience',
      'We have turned a working farm near Hereford into a one-night festival for a joint birthday, lit a festival-style tipi wedding with 200m of festoon and uplit trees, and supplied the sound for a private party headlined by Gorgon City.',
    ],
    supplyHeading: 'Typically included',
    supply: [
      'Site visit, layout plan and power planning with your other suppliers',
      'Stage for bands and DJs, indoor or outdoor',
      'PA with engineer, DJ playback equipment',
      'Stage lighting, festoon, uplighting and tree lighting',
      'Generator and distribution for the whole site',
      'Build, show support and de-rig',
    ],
    projectIds: [
      'festival-birthday-party-herefordshire',
      'festival-style-tipi-wedding',
      'gorgon-city-private-party',
      'konligo-fastival-stage-roof',
    ],
  },
  {
    slug: 'performing-arts',
    kind: 'event-type',
    navName: 'Theatre and performing arts',
    title: 'Theatre and performing arts production',
    metaTitle: 'Theatre Lighting & Sound Hire Bristol & the Cotswolds | Performing Arts Production',
    metaDescription:
      'Lighting, sound, radio microphones and staging for theatre productions, concerts, schools and performing arts venues, as full production or dry hire with training. Loud Hire, Thornbury near Bristol.',
    intro:
      'Drama without distraction: lighting, sound and staging for productions, concerts and shows in theatres, churches, schools and unusual spaces.',
    image: imgArts,
    imageAlt: 'The Mount Without in Bristol lit in red for a theatre production',
    body: [
      'Theatre, musicals and dramatic performances are easily undermined by the wrong lighting, sound or effects. We believe the three should work together to support the mood of the piece, and we plan them with the director and the set design rather than around them.',
      '## Lighting for performance',
      'Even coverage of the acting area, whether on a proscenium stage or in the round, comes from careful fixture selection and placement at the design stage. Flats generally want steep front light from generic fixtures; cut-outs such as trees may need a harder beam from behind for depth. We supply LED and tungsten stage lighting, profiles with gobos, fresnels, followspots and consoles, and we are as happy handing the desk to your own operator as running it ourselves.',
      '## Sound and staging',
      'Our Sennheiser EW-D wireless racks with theatre headsets are in constant use with production venues, theatre schools and event spaces around Bristol, Bath and Gloucestershire, and we can include set-up and basic training for technicians new to them. Litedeck platforms build stages, thrusts and risers in venues that have none.',
    ],
    supplyHeading: 'Typically included',
    supply: [
      'LED and tungsten stage lighting, profiles, fresnels, followspots and control',
      'Radio microphones with theatre headsets, digital mixing and processing',
      'Litedeck staging, risers and platforms',
      'Haze and effects',
      'Dry hire with set-up and training, or full production with operators',
    ],
    projectIds: ['shakespeare-at-the-mount-without', 'proms-in-the-park-speech-house', 'christmas-concert-ilford'],
    newsIds: ['theatre-lighting-and-sound-hire', 'wireless-microphone-hire'],
  },
];

export const capabilityPages = subPages.filter((p) => p.kind === 'capability');
export const eventTypePages = subPages.filter((p) => p.kind === 'event-type');
