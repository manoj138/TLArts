/**
 * Tushar Arts — Centralized Artwork Data Repository
 * Artist: Tushar Lohar (@artist_tushar_02)
 * Brand: Tushar Arts (Tushar Lohar Studio)
 * Instagram: https://www.instagram.com/artist_tushar_02/
 */

export const ARTIST_INFO = {
  brandName: 'Tushar Arts',
  fullName: 'Tushar Lohar Studio',
  artistName: 'Tushar Lohar',
  instagramUsername: '@artist_tushar_02',
  instagramUrl: 'https://www.instagram.com/artist_tushar_02/',
  tagline: 'Every Stroke Tells a Story.',
  bio: 'Specializing in hyper-realistic pencil sketches, graphite portraiture, and charcoal studies that capture raw human emotion and lifelike detail.',
  location: 'Maharashtra, India',
  email: 'tusharlohar.arts@gmail.com',
  whatsappNumber: '+919673400446',
  whatsappUrl: 'https://wa.me/919673400446'
};

export const ARTWORK_CATEGORIES = [
  'All',
  'Available for Sale',
  'Realistic Portraits',
  'Celebrity Sketches',
  'Couple Sketches',
  'Custom Sketches'
];

/**
 * Dynamic Artwork Repository — Seeded & managed live from MongoDB via Owner Studio CMS
 */
export const ARTWORKS_DATA = [];

export const CREATIVE_STEPS = [
  {
    step: '01',
    title: 'Initial Loomis & Grid Outline',
    description: 'Establishing millimeter-perfect anatomical proportions and facial angles to create an accurate structural foundation.',
    tool: '2H Hard Graphite & Fine Calipers'
  },
  {
    step: '02',
    title: 'Facial Geometry & Feature Placement',
    description: 'Mapping the subtle distances of eyes, nose curvature, and lip contour to capture the true identity of the subject.',
    tool: 'HB & 2B Precise Mechanical Pencils'
  },
  {
    step: '03',
    title: 'Tonal Value & Graphite Layering',
    description: 'Building deep contrast through multiple progressive passes of soft graphite and charcoal powder blending.',
    tool: '4B - 8B Pencils & Blending Stumps'
  },
  {
    step: '04',
    title: 'Micro-Textures & Negative Erasing',
    description: 'Carving individual pores, beard strands, and catchlights using precision mono zero and electric erasers.',
    tool: 'Tombow Mono Zero & White Gel Inks'
  },
  {
    step: '05',
    title: 'Fixative Seal & Archival Finish',
    description: 'Applying museum-grade UV matte fixative spray to permanently preserve every pencil stroke from oxidation.',
    tool: 'Winsor & Newton Archival Fixative'
  }
];
