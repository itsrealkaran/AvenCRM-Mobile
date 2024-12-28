import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Share, Dimensions } from 'react-native';
import { Card } from './card';
import { Ionicons } from '@expo/vector-icons';
import type { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

export function PropertyCard({ property, onFavorite, isFavorite = false }: PropertyCardProps) {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this property: ${property.address}, ${property.city} ${property.state} ${property.zipCode} - $${property.price.toLocaleString()}`,
        url: property.image, // Note: This will only work on iOS
      });
    } catch (error) {
      console.error(error);
    }
  };

  const formatPrice = (price: number) => {
    return `$ ${price.toLocaleString()}`;
  };

  return (
    <Card style={styles.card}>
      <Image
        source={{ uri: property.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.address} numberOfLines={3}>
          {property.address}, {property.city} {property.state} {property.zipCode}
        </Text>
        <Text style={styles.price}>{formatPrice(property.price)}</Text>
        
        <View style={styles.specs}>
          <View style={styles.specItem}>
            <Ionicons name="bed-outline" size={14} color="#666" />
            <Text style={styles.specText}>{property.bedrooms}</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="water-outline" size={14} color="#666" />
            <Text style={styles.specText}>{property.bathrooms}</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="square-outline" size={14} color="#666" />
            <Text style={styles.specText}>{property.squareFeet.toLocaleString()} ft²</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.agent}>
            <Image
              source={{ uri: property.agent.avatar }}
              style={styles.agentAvatar}
            />
            <Text style={styles.agentName} numberOfLines={1}>{property.agent.name}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Ionicons name="share-social-outline" size={18} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onFavorite} style={styles.actionButton}>
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={18} 
                color={isFavorite ? "#FF4B4B" : "#666"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 8,
  },
  address: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
    height: 32, // Fixed height for 2 lines
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5932EA',
    marginBottom: 4,
  },
  specs: {
    flexDirection: 'row',
    marginBottom: 4,
    gap: 8,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  specText: {
    fontSize: 10,
    color: '#666',
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
    flexDirection: 'row',
    paddingTop: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  agent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  agentAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  agentName: {
    fontSize: 10,
    color: '#333',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionButton: {
    padding: 2,
  },
});

