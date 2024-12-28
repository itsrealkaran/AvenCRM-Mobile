export interface Property {
    id: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    image: string;
    agent: {
      id: string;
      name: string;
      avatar: string;
    };
  }
  
  