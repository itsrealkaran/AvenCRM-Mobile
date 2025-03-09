import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Share} from 'react-native';
import { Card } from './card';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { Property } from '@/types/property';
import { useAuth } from '@/contexts/auth-context';
import { useCurrency } from '@/contexts/currency-context';
interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const handleShare = async () => {
    try {
      const propertyUrl = `https://crm.avencrm.com/properties/${property.id}?agentId=${user?.id || property.createdBy.id}`;
      const message = `Check out this amazing property!\n\n${property.cardDetails.address}\n\nPrice: $${property.cardDetails.price.toLocaleString()}\n• ${property.cardDetails.beds} beds\n• ${property.cardDetails.baths} baths\n• ${property.cardDetails.parking} parking\n• ${property.cardDetails.sqft.toLocaleString()} sq ft\n\nView more details at: ${propertyUrl}`;
      
      await Share.share({
        message,
        url: property.cardDetails.image,
        title: property.cardDetails.title,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card style={styles.card}>
      <Image
        source={{ uri: property.cardDetails.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.address} numberOfLines={3}>
          {property.cardDetails.address}
        </Text>
        <Text style={styles.price}>{formatPrice(property.cardDetails.price)}</Text>
        
        <View style={styles.specs}>
          <View style={styles.specItem}>
            <Ionicons name="bed-outline" size={14} color="#666" />
            <Text style={styles.specText}>{property.cardDetails.beds}</Text>
          </View>
          <View style={styles.specItem}>
            <MaterialCommunityIcons name="bathtub-outline" size={14} color="#666" />
            <Text style={styles.specText}>{property.cardDetails.baths}</Text>
          </View>
          <View style={styles.specItem}>
            <MaterialCommunityIcons name="car" size={14} color="#666" />
            <Text style={styles.specText}>{property.cardDetails.parking}</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="expand-outline" size={14} color="#666" />
            <Text style={styles.specText}>{property.cardDetails.sqft.toLocaleString()} ft²</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.agent}>
            <View style={styles.agentAvatar} />
            <Text style={styles.agentName} numberOfLines={1}>{property.createdBy.name}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Ionicons name="share-social-outline" size={18} color="#666" />
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
    padding: 6,
  },
  address: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    height: 32,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5932EA',
    marginBottom: 4,
  },
  specs: {
    flexDirection: 'row',
    marginBottom: 4,
    gap: 12,
    paddingBottom: 8,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  specText: {
    fontSize: 12,
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
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  agentName: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
});
