export interface NasaMediaData {
  nasa_id: string;
  media_type: string;
  title: string;
  description: string;
  date_created: string;
  center?: string;
  keywords?: string[];
  photographer?: string;
  location?: string;
  secondary_creator?: string;
}

export interface NasaMediaLink {
  href: string;
  rel?: string;
  render?: string;
}

export interface NasaMediaItem {
  data: NasaMediaData[];
  links?: NasaMediaLink[];
  href?: string;
}

export interface NasaSearchMetadata {
  total_hits: number;
}

export interface NasaSearchCollection {
  version: string;
  href: string;
  items: NasaMediaItem[];
  metadata?: NasaSearchMetadata;
  links?: NasaMediaLink[];
}

export interface NasaSearchResponse {
  collection: NasaSearchCollection;
}

