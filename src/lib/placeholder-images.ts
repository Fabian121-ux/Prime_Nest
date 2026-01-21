import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  title?: string;
  location?: string;
  price?: string;
  type?: 'rental' | 'service';
  verified?: boolean;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;
