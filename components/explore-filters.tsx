'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';

const departments = [
  'Engineering',
  'Design',
  'Business',
  'Marketing',
  'Data Science',
  'Product',
  'Finance',
  'HR'
];

const skillCategories = [
  'Frontend Development',
  'Backend Development',
  'Mobile Development',
  'Data Science',
  'UI/UX Design',
  'Product Management',
  'Content Writing',
  'Video Editing',
  'Photography',
  'Music Production'
];

interface ExploreFiltersProps {
  onSearch: (query: string) => void;
  onDepartmentChange: (department: string | null) => void;
  onCategoryChange: (category: string | null) => void;
}

export function ExploreFilters({
  onSearch,
  onDepartmentChange,
  onCategoryChange
}: ExploreFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleDepartmentChange = (value: string) => {
    const newDept = value === 'all' ? null : value;
    setSelectedDepartment(newDept);
    onDepartmentChange(newDept);
  };

  const handleCategoryChange = (value: string) => {
    const newCategory = value === 'all' ? null : value;
    setSelectedCategory(newCategory);
    onCategoryChange(newCategory);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment(null);
    setSelectedCategory(null);
    onSearch('');
    onDepartmentChange(null);
    onCategoryChange(null);
  };

  const hasActiveFilters = searchQuery || selectedDepartment || selectedCategory;

  return (
    <div
      className={`transition-all duration-1000 mb-8 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
      }`}
    >
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search skills, sessions, or creators..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-12 h-12 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 md:w-auto md:min-w-48">
            <Select value={selectedDepartment || 'all'} onValueChange={handleDepartmentChange}>
              <SelectTrigger className="h-10 bg-white border border-border rounded-lg">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 md:w-auto md:min-w-48">
            <Select value={selectedCategory || 'all'} onValueChange={handleCategoryChange}>
              <SelectTrigger className="h-10 bg-white border border-border rounded-lg">
                <SelectValue placeholder="Skill Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {skillCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="border-border hover:bg-light-grey"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2">
            {searchQuery && (
              <Badge variant="secondary" className="bg-light-grey text-foreground">
                Search: {searchQuery}
                <button
                  onClick={() => handleSearch('')}
                  className="ml-2 hover:opacity-70"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedDepartment && (
              <Badge variant="secondary" className="bg-light-grey text-foreground">
                {selectedDepartment}
                <button
                  onClick={() => handleDepartmentChange('all')}
                  className="ml-2 hover:opacity-70"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="secondary" className="bg-light-grey text-foreground">
                {selectedCategory}
                <button
                  onClick={() => handleCategoryChange('all')}
                  className="ml-2 hover:opacity-70"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
