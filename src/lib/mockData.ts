import type { ScrapedData } from '@/types'

const barbershopData: ScrapedData = {
  title: 'Classic Cuts Barbershop',
  description: 'Premium grooming experience in the heart of downtown. Traditional barbering meets modern style.',
  heroText: 'Where Style Meets Tradition',
  headings: ['Our Services', 'Why Choose Us', 'Meet Our Barbers', 'Visit Us'],
  bodyText: [
    'Experience the art of traditional barbering combined with modern techniques.',
    'Our skilled barbers bring decades of experience to every cut.',
    'Walk-ins welcome, appointments preferred for the best experience.',
  ],
  images: [
    'https://images.unsplash.com/photo-1585747860019-8965e8cda8ab?w=800',
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800',
  ],
  testimonials: [
    { author: 'James R.', text: 'Best barbershop in town. The attention to detail is incredible.', rating: 5 },
    { author: 'Michael T.', text: 'Finally found a place that gets my fade right every time.', rating: 5 },
    { author: 'David K.', text: 'Great atmosphere, skilled barbers, and fair prices. Highly recommend!', rating: 4 },
  ],
  contact: {
    phone: '(555) 123-4567',
    email: 'info@classiccutsbarbershop.com',
    address: '123 Main Street, Downtown',
  },
  socialLinks: {
    instagram: 'https://instagram.com/classiccutsbarbershop',
    facebook: 'https://facebook.com/classiccutsbarbershop',
  },
  colors: ['#1a1a2e', '#e94560', '#0f3460'],
  category: 'barbershop',
  services: [
    { name: 'Classic Haircut', description: 'Traditional scissor cut with hot towel finish' },
    { name: 'Fade & Taper', description: 'Modern fade with precision lineup' },
    { name: 'Beard Trim', description: 'Shape and sculpt with straight razor detail' },
    { name: 'Hot Towel Shave', description: 'Luxurious straight razor shave experience' },
    { name: 'Kids Cut', description: 'Patient, friendly cuts for young gentlemen' },
    { name: 'Hair & Beard Combo', description: 'Complete grooming package' },
  ],
}

const restaurantData: ScrapedData = {
  title: 'Saveur Kitchen & Bar',
  description: 'Contemporary dining with locally sourced ingredients. A culinary journey through seasonal flavors.',
  heroText: 'Farm to Table, Heart to Soul',
  headings: ['Our Menu', 'The Experience', 'Chef\'s Table', 'Reserve Your Table'],
  bodyText: [
    'Every dish tells a story of local farmers, seasonal ingredients, and culinary passion.',
    'Our ever-changing menu reflects the best of what each season has to offer.',
    'Private dining experiences available for special occasions.',
  ],
  images: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800',
  ],
  testimonials: [
    { author: 'Sarah M.', text: 'An unforgettable dining experience. The tasting menu was phenomenal.', rating: 5 },
    { author: 'Robert L.', text: 'Beautiful ambiance and incredible food. Our new favorite spot.', rating: 5 },
    { author: 'Emma C.', text: 'The seasonal menu never disappoints. Always something new to discover.', rating: 4 },
  ],
  contact: {
    phone: '(555) 987-6543',
    email: 'reservations@saveurkitchen.com',
    address: '456 Oak Avenue, Arts District',
  },
  socialLinks: {
    instagram: 'https://instagram.com/saveurkitchen',
    facebook: 'https://facebook.com/saveurkitchen',
    twitter: 'https://twitter.com/saveurkitchen',
  },
  colors: ['#2d1b00', '#d4a373', '#fefae0'],
  category: 'restaurant',
  services: [
    { name: 'Lunch Service', description: 'Tue-Sat, 11:30 AM - 2:30 PM' },
    { name: 'Dinner Service', description: 'Tue-Sun, 5:30 PM - 10:00 PM' },
    { name: 'Sunday Brunch', description: 'Sun, 10:00 AM - 3:00 PM' },
    { name: 'Private Dining', description: 'Chef\'s table for up to 12 guests' },
    { name: 'Catering', description: 'Custom menus for your special events' },
    { name: 'Wine Pairing', description: 'Curated pairings with seasonal selections' },
  ],
}

const dentalData: ScrapedData = {
  title: 'Bright Smile Dental Care',
  description: 'Comprehensive dental care for the whole family. Modern technology, gentle approach.',
  heroText: 'Your Smile, Our Priority',
  headings: ['Our Services', 'Meet Our Team', 'Patient Testimonials', 'Schedule an Appointment'],
  bodyText: [
    'State-of-the-art dental care in a comfortable, welcoming environment.',
    'Our team of experienced professionals is dedicated to your oral health.',
    'New patients welcome. Most insurance plans accepted.',
  ],
  images: [
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800',
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800',
    'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800',
  ],
  testimonials: [
    { author: 'Patricia W.', text: 'Dr. Chen is amazing. My kids actually look forward to dental visits now!', rating: 5 },
    { author: 'Tom B.', text: 'Professional, painless, and thorough. Best dental experience I\'ve had.', rating: 5 },
    { author: 'Linda S.', text: 'The whole team makes you feel comfortable from the moment you walk in.', rating: 5 },
  ],
  contact: {
    phone: '(555) 456-7890',
    email: 'hello@brightsmiledentalcare.com',
    address: '789 Elm Street, Suite 200, Medical Center',
  },
  socialLinks: {
    facebook: 'https://facebook.com/brightsmiledentalcare',
    instagram: 'https://instagram.com/brightsmiledentalcare',
  },
  colors: ['#ffffff', '#00b4d8', '#0077b6'],
  category: 'dental',
  services: [
    { name: 'General Dentistry', description: 'Cleanings, exams, and preventive care' },
    { name: 'Cosmetic Dentistry', description: 'Whitening, veneers, and smile makeovers' },
    { name: 'Orthodontics', description: 'Invisalign and traditional braces' },
    { name: 'Dental Implants', description: 'Permanent tooth replacement solutions' },
    { name: 'Emergency Care', description: 'Same-day appointments for urgent issues' },
    { name: 'Pediatric Dentistry', description: 'Gentle care for growing smiles' },
  ],
}

const fitnessData: ScrapedData = {
  title: 'Peak Performance Fitness',
  description: 'Transform your body and mind. Expert-led training programs for every fitness level.',
  heroText: 'Unleash Your Potential',
  headings: ['Programs', 'Our Trainers', 'Success Stories', 'Join Today'],
  bodyText: [
    'Whether you\'re just starting out or pushing for your next PR, we\'ve got you covered.',
    'Our certified trainers design personalized programs tailored to your goals.',
    'State-of-the-art equipment and a supportive community to keep you motivated.',
  ],
  images: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
  ],
  testimonials: [
    { author: 'Alex K.', text: 'Lost 30 pounds in 4 months. The trainers here changed my life.', rating: 5 },
    { author: 'Maria G.', text: 'Best gym I\'ve ever been to. The community is incredibly supportive.', rating: 5 },
    { author: 'Chris P.', text: 'Top-notch equipment and knowledgeable staff. Worth every penny.', rating: 4 },
  ],
  contact: {
    phone: '(555) 321-0987',
    email: 'info@peakperformancefitness.com',
    address: '321 Fitness Blvd, Westside',
  },
  socialLinks: {
    instagram: 'https://instagram.com/peakperformancefitness',
    youtube: 'https://youtube.com/peakperformancefitness',
    facebook: 'https://facebook.com/peakperformancefitness',
  },
  colors: ['#000000', '#ff6b35', '#f7c59f'],
  category: 'fitness',
  services: [
    { name: 'Personal Training', description: '1-on-1 sessions with certified trainers' },
    { name: 'Group Classes', description: 'HIIT, Yoga, Spin, Boxing, and more' },
    { name: 'Nutrition Coaching', description: 'Custom meal plans and macro tracking' },
    { name: 'Strength Training', description: 'Progressive overload programming' },
    { name: 'Recovery Zone', description: 'Sauna, cold plunge, and stretching area' },
    { name: 'Online Programs', description: 'Train anywhere with our app' },
  ],
}

const mockDataSets: ScrapedData[] = [barbershopData, restaurantData, dentalData, fitnessData]

export function getMockScrapedData(businessName: string): ScrapedData {
  const lower = businessName.toLowerCase()

  if (lower.includes('barber') || lower.includes('hair') || lower.includes('cut')) {
    return { ...barbershopData, title: businessName }
  }
  if (lower.includes('restaurant') || lower.includes('kitchen') || lower.includes('food') || lower.includes('cafe')) {
    return { ...restaurantData, title: businessName }
  }
  if (lower.includes('dental') || lower.includes('dentist') || lower.includes('smile') || lower.includes('tooth')) {
    return { ...dentalData, title: businessName }
  }
  if (lower.includes('fitness') || lower.includes('gym') || lower.includes('training') || lower.includes('sport')) {
    return { ...fitnessData, title: businessName }
  }

  // Default: pick randomly based on business name length
  const index = businessName.length % mockDataSets.length
  const data = mockDataSets[index]
  return { ...data, title: businessName }
}
