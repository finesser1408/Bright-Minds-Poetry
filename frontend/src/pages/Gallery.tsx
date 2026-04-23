
import { useState, useEffect } from 'react';
import React, { Suspense } from 'react';

// Components
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import SectionHeader from '@/components/SectionHeader';

// Services
import { fetchGalleryItems, type GalleryItem } from '@/services/galleryService';

// Lazy-loaded components
const Footer = React.lazy(() => import('@/components/Footer'));
const GalleryGrid = React.lazy(() => import('@/components/gallery/GalleryGrid'));

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('poem');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGalleryItems = async () => {
      try {
        setLoading(true);
        const items = await fetchGalleryItems();
        setGalleryItems(items);
      } catch (err) {
        console.error('Failed to load gallery items:', err);
        setError('Failed to load gallery items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadGalleryItems();
  }, []);

  const handleTabChange = async (value: string) => {
    setActiveTab(value);
    try {
      setLoading(true);
      const type = value === 'all' ? undefined : value as 'publication' | 'poem';
      const items = await fetchGalleryItems(type);
      setGalleryItems(items);
    } catch (err) {
      console.error(`Failed to load ${value} items:`, err);
      setError(`Failed to load ${value} items. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      <Hero 
        backgroundImage="/lovable-uploads/6edb5562-fff6-4fa7-90c6-8c9302543b87.png"
        title="Poetry Gallery"
        subtitle="Explore our collection of visual poetry and publications."
        buttonText="Submit Your Work"
        buttonLink="/contact"
      />
      
      {/* Gallery Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <SectionHeader 
            title="Our Collection"
            subtitle="Explore our curated selection of visual poetry and literary works."
            centered
          />
          
          <Suspense fallback={<div className="text-center py-12">Loading gallery...</div>}>
            <GalleryGrid 
              items={galleryItems}
              loading={loading}
              error={error}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Suspense>
        </div>
      </section>
      
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Gallery;
