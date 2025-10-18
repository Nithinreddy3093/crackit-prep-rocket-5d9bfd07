import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { BookOpen, Code, Database, Cpu, Search, Download, BookOpenCheck, Lock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import PaymentModal from '@/components/PaymentModal';
import { Skeleton } from '@/components/ui/skeleton';

interface StudyGuide {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  page_count: number;
  is_premium: boolean;
  price: number;
  hasAccess?: boolean;
}

const StudyGuides = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [studyGuides, setStudyGuides] = useState<StudyGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    guideId: string;
    guideTitle: string;
    amount: number;
  }>({
    isOpen: false,
    guideId: '',
    guideTitle: '',
    amount: 0,
  });

  useEffect(() => {
    fetchStudyGuides();
  }, [user]);

  const fetchStudyGuides = async () => {
    try {
      setLoading(true);
      const { data: guides, error: guidesError } = await supabase
        .from('study_guides')
        .select('*');

      if (guidesError) throw guidesError;

      // Check user access for premium guides
      if (user && guides) {
        const { data: accessData } = await supabase
          .from('study_guide_access')
          .select('guide_id, access_granted')
          .eq('user_id', user.id)
          .eq('access_granted', true);

        const accessMap = new Map(accessData?.map((a: any) => [a.guide_id, true]));
        
        const guidesWithAccess = guides.map((guide: any) => ({
          ...guide,
          hasAccess: !guide.is_premium || accessMap.has(guide.id),
        }));

        setStudyGuides(guidesWithAccess as StudyGuide[]);
      } else {
        setStudyGuides(guides as StudyGuide[] || []);
      }
    } catch (error) {
      console.error('Error fetching study guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (guide: StudyGuide) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to access study guides',
        variant: 'destructive',
      });
      return;
    }

    if (guide.is_premium && !guide.hasAccess) {
      setPaymentModal({
        isOpen: true,
        guideId: guide.id,
        guideTitle: guide.title,
        amount: guide.price,
      });
    } else {
      // Download logic for free or purchased guides
      toast({
        title: 'Downloading...',
        description: `Starting download of ${guide.title}`,
      });
      console.log(`Downloading ${guide.title}`);
    }
  };

  // Get all unique categories
  const categories = Array.from(new Set(studyGuides.map(guide => guide.category)));
  
  // Filter guides based on search query, category and difficulty
  const filteredGuides = studyGuides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? guide.category === selectedCategory : true;
    const matchesDifficulty = selectedDifficulty ? guide.difficulty === selectedDifficulty : true;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleDifficultyClick = (difficulty: string) => {
    setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty);
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'DSA':
        return <Code className="h-6 w-6 text-primary" />;
      case 'Databases':
        return <Database className="h-6 w-6 text-primary" />;
      case 'OS':
      case 'System Design':
        return <Cpu className="h-6 w-6 text-primary" />;
      default:
        return <BookOpen className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
            <BookOpenCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Study Guides</h1>
          <p className="text-blue-200 max-w-2xl mx-auto">
            Access our comprehensive collection of study guides to prepare for technical interviews.
            Each guide is carefully crafted by industry experts to help you succeed.
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search study guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-darkBlue-700/50 border-darkBlue-600 text-white"
              />
            </div>
            <Button 
              variant={!selectedCategory && !selectedDifficulty && !searchQuery ? "default" : "outline"}
              className={!selectedCategory && !selectedDifficulty && !searchQuery ? "bg-primary" : "border-primary/50 text-primary"}
              onClick={() => {
                setSelectedCategory(null);
                setSelectedDifficulty(null);
                setSearchQuery('');
              }}
            >
              Clear Filters
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-white/80 mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Badge
                    key={category}
                    className={`cursor-pointer ${selectedCategory === category ? 
                      'bg-primary text-white' : 
                      'bg-darkBlue-700 text-white/70 hover:text-white border border-darkBlue-600'}`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-white/80 mb-2">Difficulty</h3>
              <div className="flex flex-wrap gap-2">
                {['beginner', 'intermediate', 'advanced'].map(difficulty => (
                  <Badge
                    key={difficulty}
                    className={`cursor-pointer ${selectedDifficulty === difficulty ? 
                      'bg-primary text-white' : 
                      'bg-darkBlue-700 text-white/70 hover:text-white border border-darkBlue-600'}`}
                    onClick={() => handleDifficultyClick(difficulty)}
                  >
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Study Guides Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-darkBlue-800/50 border-darkBlue-700">
                <div className="p-6">
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <Card key={guide.id} className="bg-darkBlue-800/50 border-darkBlue-700 backdrop-blur-sm overflow-hidden hover:border-primary/30 transition-all">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      {getIcon(guide.category)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`
                        ${guide.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                          guide.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 
                          'bg-red-500/20 text-red-400 border-red-500/30'}
                      `}>
                        {guide.difficulty.charAt(0).toUpperCase() + guide.difficulty.slice(1)}
                      </Badge>
                      {guide.is_premium && (
                        guide.hasAccess ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Lock className="h-5 w-5 text-yellow-500" />
                        )
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{guide.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">{guide.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-white/60">
                    <Badge variant="outline" className="bg-transparent border-white/20">
                      {guide.category}
                    </Badge>
                    <div>
                      {guide.page_count} pages • PDF
                    </div>
                  </div>
                  
                  {guide.is_premium && !guide.hasAccess && (
                    <div className="mt-4 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-center">
                      <span className="text-yellow-400 font-semibold">₹{guide.price}</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4 bg-darkBlue-700/50 border-t border-darkBlue-600">
                  <Button 
                    onClick={() => handleDownload(guide)}
                    className="w-full"
                    variant={guide.is_premium && !guide.hasAccess ? 'default' : 'outline'}
                  >
                    {guide.is_premium && !guide.hasAccess ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Purchase Access
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download Guide
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-darkBlue-800/50 backdrop-blur-sm border border-darkBlue-700 rounded-xl">
            <BookOpen className="h-12 w-12 text-white/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Study Guides Found</h2>
            <p className="text-white/70 max-w-md mx-auto">
              We couldn't find any study guides matching your search criteria. Try adjusting your filters or search term.
            </p>
          </div>
        )}
      </main>
      
      <Footer />
      
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ ...paymentModal, isOpen: false })}
        studyGuideId={paymentModal.guideId}
        studyGuideTitle={paymentModal.guideTitle}
        amount={paymentModal.amount}
        onSuccess={fetchStudyGuides}
      />
    </div>
  );
};

export default StudyGuides;
