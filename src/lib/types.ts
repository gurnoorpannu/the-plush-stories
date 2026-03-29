export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  amazonLink?: string;
  flipkartLink?: string;
  meeshoLink?: string;
  otherLink?: string;
  isBestseller: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  order: number;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  announcementBar?: string;
  showAnnouncementBar: boolean;
  contactPhone: string;
  contactEmail?: string;
  instagramLink?: string;
  facebookLink?: string;
  whatsappNumber: string;
}
