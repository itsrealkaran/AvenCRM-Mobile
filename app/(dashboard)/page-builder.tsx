import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { PageCard } from '@/components/ui/page-card';
import type { PageTemplate } from '@/types/page-template';

const MOCK_TEMPLATES: PageTemplate[] = [
  {
    id: '1',
    name: 'Modern Landing Page',
    templateName: 'landing-page-1',
    image: '/placeholder.svg?height=400&width=600',
  },
  {
    id: '2',
    name: 'E-commerce Product Page',
    templateName: 'product-page-1',
    image: '/placeholder.svg?height=401&width=600',
  },
  {
    id: '3',
    name: 'Blog Post Template',
    templateName: 'blog-post-1',
    image: '/placeholder.svg?height=400&width=600',
  },
  {
    id: '4',
    name: 'Portfolio Showcase',
    templateName: 'portfolio-1',
    image: '/placeholder.svg?height=400&width=600',
  },
  {
    id: '5',
    name: 'Contact Form Page',
    templateName: 'contact-form-1',
    image: '/placeholder.svg?height=400&width=600',
  },
  {
    id: '6',
    name: 'About Us Company Profile',
    templateName: 'about-us-1',
    image: '/placeholder.svg?height=400&width=600',
  },
  {
    id: '7',
    name: 'Services Overview',
    templateName: 'services-1',
    image: '/placeholder.svg?height=400&width=600',
  },
  {
    id: '8',
    name: 'Team Members Showcase',
    templateName: 'team-1',
    image: '/placeholder.svg?height=400&width=600',
  },
];

export default function PageBuilder() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (templateId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(templateId)) {
        newFavorites.delete(templateId);
      } else {
        newFavorites.add(templateId);
      }
      return newFavorites;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Page Builder</Text>
        <Text style={styles.subtitle}>Choose a template to start building your page</Text>
      </View>
      <ScrollView style={styles.content}>
        {MOCK_TEMPLATES.map((template) => (
          <PageCard
            key={template.id}
            template={template}
            isFavorite={favorites.has(template.id)}
            onFavorite={() => toggleFavorite(template.id)}
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
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  content: {
    padding: 2,
    paddingHorizontal: 26,
    gap: 12,
  },
});
