export type ColorTheme = {
  mode: "light" | "dark";
  accent: string;
};

export type NavLabels = {
  wishes: string;
  schedule: string;
  qa: string;
  rsvp: string;
  gifting: string;
};

export type SectionsEnabled = {
  wishes: boolean;
  schedule: boolean;
  qa: boolean;
  rsvp: boolean;
  gifting: boolean;
};

export type RsvpRequiredFields = {
  first_name: boolean;
  last_name: boolean;
  email: boolean;
  phone: boolean;
  relationship: boolean;
  address: boolean;
  attending_for: boolean;
};

export type EventColor = {
  label: string;
  hex: string;
};

export type GiftMethodType = "bank_transfer" | "flutterwave" | "paystack" | "amazon";
export type WishStatus = "pending" | "approved" | "rejected";
export type FontStyle = "serif" | "sans" | "script";
export type AttendingFor = "bride" | "groom" | "both";

export interface InvitationCard {
  type: "print" | "digital";
  templateId: string;
  data: {
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
  };
}

export interface Couple {
  id: string;
  user_id: string;
  slug: string;
  bride_name: string;
  groom_name: string;
  tagline: string | null;
  wedding_date: string | null;
  hero_image_url: string | null;
  logo_url: string | null;
  color_theme: ColorTheme;
  font_style: FontStyle;
  nav_labels: NavLabels;
  sections_enabled: SectionsEnabled;
  gift_message: string | null;
  rsvp_deadline: string | null;
  rsvp_required_fields: RsvpRequiredFields;
  invitation_card: InvitationCard | null;
  gallery_images: string[];
  created_at: string;
  updated_at: string;
}

export interface WeddingEvent {
  id: string;
  couple_id: string;
  name: string;
  date: string | null;
  time: string | null;
  venue_name: string | null;
  venue_address: string | null;
  dress_groom: string | null;
  dress_bride: string | null;
  colors: EventColor[];
  position: number;
  created_at: string;
}

export interface RsvpSubmission {
  id: string;
  couple_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  relationship: string | null;
  address: string | null;
  attending_for: AttendingFor | null;
  created_at: string;
}

export interface WellWish {
  id: string;
  couple_id: string;
  wisher_name: string;
  message: string;
  media_url: string | null;
  media_type: "image" | "video" | null;
  status: WishStatus;
  created_at: string;
}

export interface GiftMethod {
  id: string;
  couple_id: string;
  type: GiftMethodType;
  bank_name: string | null;
  account_number: string | null;
  account_name: string | null;
  currency: string | null;
  link_url: string | null;
  position: number;
  created_at: string;
}

export interface FAQ {
  id: string;
  couple_id: string;
  question: string;
  answer: string;
  position: number;
  created_at: string;
}

// Supabase Database type — exact format required by @supabase/supabase-js generics
export type Database = {
  public: {
    Tables: {
      couples: {
        Row: Couple;
        Insert: Omit<Couple, "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Omit<Couple, "id" | "created_at" | "updated_at">>;
        Relationships: Array<{
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }>;
      };
      wedding_events: {
        Row: WeddingEvent;
        Insert: Omit<WeddingEvent, "id" | "created_at"> & { id?: string };
        Update: Partial<Omit<WeddingEvent, "id" | "created_at">>;
        Relationships: Array<{
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }>;
      };
      rsvp_submissions: {
        Row: RsvpSubmission;
        Insert: Omit<RsvpSubmission, "id" | "created_at"> & { id?: string };
        Update: Partial<Omit<RsvpSubmission, "id" | "created_at">>;
        Relationships: Array<{
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }>;
      };
      well_wishes: {
        Row: WellWish;
        Insert: Omit<WellWish, "id" | "created_at"> & { id?: string };
        Update: Partial<Omit<WellWish, "id" | "created_at">>;
        Relationships: Array<{
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }>;
      };
      gift_methods: {
        Row: GiftMethod;
        Insert: Omit<GiftMethod, "id" | "created_at"> & { id?: string };
        Update: Partial<Omit<GiftMethod, "id" | "created_at">>;
        Relationships: Array<{
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }>;
      };
      faqs: {
        Row: FAQ;
        Insert: Omit<FAQ, "id" | "created_at"> & { id?: string };
        Update: Partial<Omit<FAQ, "id" | "created_at">>;
        Relationships: Array<{
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }>;
      };
      page_views: {
        Row: { id: string; couple_id: string; viewed_at: string };
        Insert: { couple_id: string; id?: string };
        Update: { couple_id?: string };
        Relationships: Array<{
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }>;
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
