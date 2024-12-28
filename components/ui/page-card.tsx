import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Card } from './card';
import { Ionicons } from '@expo/vector-icons';
import type { PageTemplate } from '@/types/page-template';

interface PageTemplateCardProps {
  template: PageTemplate;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

export function PageCard({ template, onFavorite, isFavorite = false }: PageTemplateCardProps) {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this page template: ${template.name} - ${template.templateName}`,
        url: template.image, // Note: This will only work on iOS
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card style={styles.card}>
      <Image
        source={{ uri: template.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {template.name}
        </Text>

        <View style={styles.footer}>
          <View style={styles.agent}>
            <Text style={styles.templateName} numberOfLines={1}>
              {template.templateName}
            </Text>
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
    padding: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    height: 32,
  },
  templateName: {
    fontSize: 12,
    color: '#666',
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
    fontSize: 12,
    color: '#666',
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
    flexDirection: 'row',
    paddingTop: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  agent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    marginLeft: 8,
  },
});

