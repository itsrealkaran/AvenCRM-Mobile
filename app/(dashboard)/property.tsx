import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { PropertyCard } from '@/components/ui/property-card';
import type { Property } from '@/types/property';

// This would normally come from an API
const MOCK_PROPERTIES: Property[] = [
  {
    id: "cm729b41a000bqqb4ypgf8jzp",
    slug: "yep5ivt6m729b3vqmak9eesv", 
    isVerified: true,
    cardDetails: {
      id: "1739406796097",
      beds: 4,
      sqft: 2280,
      baths: 3,
      image: "https://aven.s3.ap-south-1.amazonaws.com/1739385520016-A2189907_30.jpg",
      price: 799000,
      title: "316 Savanna Way",
      address: "316 Savanna Way, Calgary, T3J0Y6",
      parking: 4,
      isVerified: false
    },
    createdAt: "2025-02-12T18:40:53.607Z",
    createdBy: {
      id: "cm6s6kjkr00rhqqt57vzon2br",
      name: "Karan Singh", 
      email: "agent@avencrm.com"
    }
  },
  {
    id: "cm729b41a000bqqb4ypgf8jz2",
    slug: "yep5ivt6m729b3vqmak9ee2v",
    isVerified: true,
    cardDetails: {
      id: "1739406796098",
      beds: 3,
      sqft: 1850,
      baths: 2,
      image: "https://aven.s3.ap-south-1.amazonaws.com/1739385520016-A2189907_31.jpg",
      price: 475000,
      title: "28 Westgate Ave",
      address: "28 Westgate Ave, Calgary, T3J0Y7",
      parking: 2,
      isVerified: true
    },
    createdAt: "2025-02-12T18:41:53.607Z", 
    createdBy: {
      id: "cm6s6kjkr00rhqqt57vzon2br",
      name: "Karan Singh",
      email: "agent@avencrm.com"
    }
  },
  {
    id: "cm729b41a000bqqb4ypgf8jz3",
    slug: "yep5ivt6m729b3vqmak9ee3v",
    isVerified: false,
    cardDetails: {
      id: "1739406796099", 
      beds: 5,
      sqft: 2500,
      baths: 3,
      image: "https://aven.s3.ap-south-1.amazonaws.com/1739385520016-A2189907_32.jpg",
      price: 725000,
      title: "135 Lake View Dr",
      address: "135 Lake View Dr, Calgary, T3J0Y8",
      parking: 3,
      isVerified: false
    },
    createdAt: "2025-02-12T18:42:53.607Z",
    createdBy: {
      id: "cm6s6kjkr00rhqqt57vzon2br", 
      name: "Karan Singh",
      email: "agent@avencrm.com"
    }
  }
];

export default function Property() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Properties</Text>
      </View>
      <ScrollView style={styles.content}>
        {MOCK_PROPERTIES.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 2,
    paddingHorizontal: 26,
    gap: 12,
  },
});
