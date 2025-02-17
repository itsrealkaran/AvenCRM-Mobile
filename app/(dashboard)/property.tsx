import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { PropertyCard } from '@/components/ui/property-card';
import type { Property } from '@/types/property';

// This would normally come from an API
const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    address: '92 ALLIUM PLACE',
    city: 'ORLANDO',
    state: 'FL',
    zipCode: '32827',
    price: 590693,
    bedrooms: 4,
    bathrooms: 4,
    squareFeet: 2096.00,
    image: '/placeholder.svg?height=400&width=600',
    agent: {
      id: '1',
      name: 'Jenny Wilson',
      avatar: '/placeholder.svg?height=64&width=64',
    },
  },
  {
    id: '2',
    address: '28 WESTGATE AVE',
    city: 'ORLANDO',
    state: 'FL',
    zipCode: '32827',
    price: 475000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1850.00,
    image: '/placeholder.svg?height=400&width=600',
    agent: {
      id: '2',
      name: 'Robert Johnson',
      avatar: '/placeholder.svg?height=64&width=64',
    },
  },
  {
    id: '3',
    address: '135 LAKE VIEW DR',
    city: 'ORLANDO',
    state: 'FL',
    zipCode: '32827',
    price: 725000,
    bedrooms: 5,
    bathrooms: 3,
    squareFeet: 2500.00,
    image: '/placeholder.svg?height=400&width=600',
    agent: {
      id: '1',
      name: 'Jenny Wilson',
      avatar: '/placeholder.svg?height=64&width=64',
    },
  },
  {
    id: '4',
    address: '47 PALM SPRINGS',
    city: 'ORLANDO',
    state: 'FL',
    zipCode: '32827',
    price: 550000,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2200.00,
    image: '/placeholder.svg?height=400&width=600',
    agent: {
      id: '2',
      name: 'Robert Johnson',
      avatar: '/placeholder.svg?height=64&width=64',
    },
  },
  {
    id: '5',
    address: '92 ALLIUM PLACE',
    city: 'ORLANDO',
    state: 'FL',
    zipCode: '32827',
    price: 590693,
    bedrooms: 4,
    bathrooms: 4,
    squareFeet: 2096.00,
    image: '/placeholder.svg?height=400&width=600',
    agent: {
      id: '1',
      name: 'Jenny Wilson',
      avatar: '/placeholder.svg?height=64&width=64',
    },
  },
  {
    id: '6',
    address: '28 WESTGATE AVE',
    city: 'ORLANDO',
    state: 'FL',
    zipCode: '32827',
    price: 475000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1850.00,
    image: '/placeholder.svg?height=400&width=600',
    agent: {
      id: '2',
      name: 'Robert Johnson',
      avatar: '/placeholder.svg?height=64&width=64',
    },
  },
  {
    id: '7',
    address: '135 LAKE VIEW DR',
    city: 'ORLANDO',
    state: 'FL',
    zipCode: '32827',
    price: 725000,
    bedrooms: 5,
    bathrooms: 3,
    squareFeet: 2500.00,
    image: '/placeholder.svg?height=400&width=600',
    agent: {
      id: '1',
      name: 'Jenny Wilson',
      avatar: '/placeholder.svg?height=64&width=64',
    },
  },
  {
    id: '8',
    address: '47 PALM SPRINGS',
    city: 'ORLANDO',
    state: 'FL',
    zipCode: '32827',
    price: 550000,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2200.00,
    image: '/placeholder.svg?height=400&width=600',
    agent: {
      id: '2',
      name: 'Robert Johnson',
      avatar: '/placeholder.svg?height=64&width=64',
    },
  },
];

export default function Property() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };

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
            isFavorite={favorites.has(property.id)}
            onFavorite={() => toggleFavorite(property.id)}
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

