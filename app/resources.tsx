import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image, TextInput } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'worksheet' | 'video' | 'reading' | 'quiz' | 'activity';
  subject: string;
  thumbnail: string;
  dateAdded: string;
  isNew: boolean;
  downloads: number;
}

const initialResources: Resource[] = [
  {
    id: '1',
    title: 'Algebra Fundamentals',
    description: 'Comprehensive guide to basic algebra concepts with practice problems',
    type: 'worksheet',
    subject: 'Mathematics',
    thumbnail: '📝',
    dateAdded: '2023-10-15',
    isNew: false,
    downloads: 128
  },
  {
    id: '2',
    title: 'Solar System Interactive',
    description: 'Interactive guide to the solar system with 3D models and quizzes',
    type: 'activity',
    subject: 'Science',
    thumbnail: '🪐',
    dateAdded: '2023-11-10',
    isNew: true,
    downloads: 85
  },
  {
    id: '3',
    title: 'World War II Timeline',
    description: 'Comprehensive timeline of major events during World War II',
    type: 'reading',
    subject: 'History',
    thumbnail: '📚',
    dateAdded: '2023-10-28',
    isNew: false,
    downloads: 103
  },
  {
    id: '4',
    title: 'Grammar Essentials Quiz',
    description: 'Test your knowledge of English grammar rules and conventions',
    type: 'quiz',
    subject: 'English',
    thumbnail: '✏️',
    dateAdded: '2023-11-12',
    isNew: true,
    downloads: 76
  },
  {
    id: '5',
    title: 'Basics of Coding',
    description: 'Introduction to programming concepts with simple examples',
    type: 'video',
    subject: 'Computer Science',
    thumbnail: '💻',
    dateAdded: '2023-10-30',
    isNew: false,
    downloads: 154
  },
  {
    id: '6',
    title: 'Geometry Formulas Cheat Sheet',
    description: 'Quick reference guide for geometry formulas and theorems',
    type: 'worksheet',
    subject: 'Mathematics',
    thumbnail: '📐',
    dateAdded: '2023-11-14',
    isNew: true,
    downloads: 62
  },
  {
    id: '7',
    title: 'Photosynthesis Explained',
    description: 'Comprehensive explanation of the photosynthesis process',
    type: 'video',
    subject: 'Science',
    thumbnail: '🌱',
    dateAdded: '2023-10-22',
    isNew: false,
    downloads: 97
  },
  {
    id: '8',
    title: 'Creative Writing Prompts',
    description: 'Collection of writing prompts to inspire creative storytelling',
    type: 'activity',
    subject: 'English',
    thumbnail: '✍️',
    dateAdded: '2023-11-05',
    isNew: false,
    downloads: 118
  }
];

const ResourcesScreen = () => {
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleSubjectFilter = (subject: string | null) => {
    setSelectedSubject(subject === selectedSubject ? null : subject);
  };

  const handleTypeFilter = (type: string | null) => {
    setSelectedType(type === selectedType ? null : type);
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery 
      ? resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesSubject = selectedSubject 
      ? resource.subject === selectedSubject 
      : true;
    
    const matchesType = selectedType 
      ? resource.type === selectedType 
      : true;
    
    return matchesSearch && matchesSubject && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'worksheet':
        return <MaterialIcons name="description" size={18} color="#4CAF50" />;
      case 'video':
        return <MaterialIcons name="ondemand-video" size={18} color="#F44336" />;
      case 'reading':
        return <MaterialIcons name="menu-book" size={18} color="#2196F3" />;
      case 'quiz':
        return <MaterialIcons name="quiz" size={18} color="#FF9800" />;
      case 'activity':
        return <MaterialIcons name="extension" size={18} color="#9C27B0" />;
      default:
        return <MaterialIcons name="article" size={18} color="#757575" />;
    }
  };

  const subjects = [...new Set(resources.map(r => r.subject))];
  const types = [...new Set(resources.map(r => r.type))];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: "Learning Resources",
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FFFCF9' },
          headerTintColor: '#5e17eb',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#5e17eb" />
            </TouchableOpacity>
          ),
        }}
      />
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#757575" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search resources..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#757575" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>Subjects:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {subjects.map(subject => (
            <TouchableOpacity
              key={subject}
              style={[
                styles.filterButton,
                selectedSubject === subject && styles.activeFilterButton
              ]}
              onPress={() => handleSubjectFilter(subject)}
            >
              <Text 
                style={[
                  styles.filterButtonText,
                  selectedSubject === subject && styles.activeFilterButtonText
                ]}
              >
                {subject}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <Text style={styles.filterTitle}>Types:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {types.map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterButton,
                selectedType === type && styles.activeFilterButton
              ]}
              onPress={() => handleTypeFilter(type)}
            >
              <Text 
                style={[
                  styles.filterButtonText,
                  selectedType === type && styles.activeFilterButtonText
                ]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Resources List */}
      <ScrollView contentContainerStyle={styles.resourcesContainer}>
        {filteredResources.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={60} color="#CCCCCC" />
            <Text style={styles.emptyStateText}>No resources found matching your criteria</Text>
          </View>
        ) : (
          filteredResources.map(resource => (
            <TouchableOpacity 
              key={resource.id} 
              style={styles.resourceCard}
              onPress={() => {
                // In a real app, this would navigate to the resource detail page
                console.log(`Opening resource: ${resource.title}`);
              }}
            >
              <View style={styles.resourceHeader}>
                <Text style={styles.resourceEmoji}>{resource.thumbnail}</Text>
                <View style={styles.resourceTitleContainer}>
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                  <View style={styles.resourceMeta}>
                    {getTypeIcon(resource.type)}
                    <Text style={styles.resourceType}>
                      {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                    </Text>
                    <Text style={styles.resourceSubject}>{resource.subject}</Text>
                  </View>
                </View>
                {resource.isNew && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.resourceDescription}>{resource.description}</Text>
              
              <View style={styles.resourceFooter}>
                <Text style={styles.dateText}>{resource.dateAdded}</Text>
                <View style={styles.downloadCount}>
                  <MaterialIcons name="cloud-download" size={14} color="#5e17eb" />
                  <Text style={styles.downloadText}>{resource.downloads}</Text>
                </View>
                
                <TouchableOpacity style={styles.downloadButton}>
                  <Text style={styles.downloadButtonText}>Download</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      
      {/* Quick Resource Categories */}
      <View style={styles.quickCategories}>
        <TouchableOpacity style={styles.categoryButton}>
          <FontAwesome5 name="star" size={20} color="#FFC107" />
          <Text style={styles.categoryText}>Featured</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.categoryButton}>
          <FontAwesome5 name="clock" size={20} color="#4CAF50" />
          <Text style={styles.categoryText}>Recent</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.categoryButton}>
          <FontAwesome5 name="download" size={20} color="#2196F3" />
          <Text style={styles.categoryText}>Downloaded</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.categoryButton}>
          <FontAwesome5 name="heart" size={20} color="#F44336" />
          <Text style={styles.categoryText}>Favorites</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFCF9',
  },
  backButton: {
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filtersContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginVertical: 8,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  activeFilterButton: {
    backgroundColor: '#5e17eb',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#757575',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  resourcesContainer: {
    padding: 15,
    paddingBottom: 70, // Make room for the bottom categories
  },
  resourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  resourceHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  resourceEmoji: {
    fontSize: 36,
    marginRight: 12,
  },
  resourceTitleContainer: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceType: {
    fontSize: 13,
    color: '#757575',
    marginLeft: 4,
    marginRight: 8,
  },
  resourceSubject: {
    fontSize: 13,
    color: '#5e17eb',
    fontWeight: '500',
  },
  newBadge: {
    backgroundColor: '#F44336',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  resourceDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
    lineHeight: 20,
  },
  resourceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#757575',
  },
  downloadCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
  downloadButton: {
    backgroundColor: '#5e17eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 10,
    textAlign: 'center',
  },
  quickCategories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  categoryButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 12,
    color: '#333333',
    marginTop: 4,
  },
});

export default ResourcesScreen; 