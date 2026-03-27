'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { ExploreFilters } from '@/components/explore-filters';
import { ExploreFeed } from '@/components/explore-feed';
import { Footer } from '@/components/footer';

export default function ExplorePage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleDepartmentChange = (department: string | null) => {
    setSelectedDepartment(department);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  if (!isPageLoaded) {
    return null;
  }

  return (
    <div className="min-h-screen bg-warm-cream">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page header */}
        <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Explore Skills & Sessions
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover thousands of skills being shared by students in your network
          </p>
        </div>

        {/* Filters and Feed */}
        <div className="animate-in fade-in slide-in-from-top-8 duration-1000 delay-100">
          <ExploreFilters
            onSearch={handleSearch}
            onDepartmentChange={handleDepartmentChange}
            onCategoryChange={handleCategoryChange}
          />

          <ExploreFeed
            searchQuery={searchQuery}
            department={selectedDepartment}
            category={selectedCategory}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}