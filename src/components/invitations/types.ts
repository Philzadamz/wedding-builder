export interface CardData {
  brideName: string;
  groomName: string;
  weddingDate: string;
  weddingTime: string;
  ceremonyVenue: string;
  ceremonyAddress: string;
  receptionVenue: string;
  receptionAddress: string;
  dressCode: string;
  rsvpDeadline: string;
  rsvpEmail: string;
  websiteUrl: string;
  hashtag: string;
  specialInstructions: string;
  couplePhotoUrl: string;
}

export interface PrintTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  primaryBg: string;
  primaryText: string;
  accentColor: string;
  mutedText: string;
  borderColor: string;
}

export interface DigitalTemplate {
  id: string;
  name: string;
  category: string;
  coverBg: string;
  coverText: string;
  coverAccent: string;
  interiorBg: string;
  interiorText: string;
  interiorAccent: string;
  dividerColor: string;
}

export type PrintCategory =
  | "All" | "Luxury" | "Classic" | "Minimalist"
  | "Floral" | "Royal" | "African" | "Modern" | "Beach" | "Vintage";
