export interface Property {
  id: string;
  slug: string;
  isVerified: boolean;
  cardDetails: {
    id: string;
    beds: number;
    sqft: number;
    baths: number;
    image: string;
    price: number;
    title: string;
    address: string;
    parking: number;
    isVerified: boolean;
  };
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
}
