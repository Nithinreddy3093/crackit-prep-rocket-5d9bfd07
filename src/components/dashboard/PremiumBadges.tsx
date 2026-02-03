import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, Database, Cpu, Brain, Box, Building, Landmark, Scale,
  Flame, Target, Star, Zap, CheckCircle, TrendingUp, Sword, ArrowUp,
  Play, Award, Trophy, Crown, HelpCircle, BookOpen,
  Lock, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { useBadgeSystem } from '@/hooks/useBadgeSystem';
import { 
  BADGE_TIER_COLORS, 
  BADGE_CATEGORY_LABELS,
  UserBadgeWithDefinition,
  BadgeTier,
  BadgeCategory 
} from '@/services/badgeEngine';

interface PremiumBadgesProps {
  forceRefresh?: boolean;
  showCategories?: boolean;
  maxDisplay?: number;
}

// Icon mapping
const ICON_MAP: Record<string, React.ReactNode> = {
  Code: <Code className="h-6 w-6" />,
  Database: <Database className="h-6 w-6" />,
  Cpu: <Cpu className="h-6 w-6" />,
  Brain: <Brain className="h-6 w-6" />,
  Box: <Box className="h-6 w-6" />,
  Building: <Building className="h-6 w-6" />,
  Landmark: <Landmark className="h-6 w-6" />,
  Scale: <Scale className="h-6 w-6" />,
  Flame: <Flame className="h-6 w-6" />,
  Target: <Target className="h-6 w-6" />,
  Star: <Star className="h-6 w-6" />,
  Zap: <Zap className="h-6 w-6" />,
  CheckCircle: <CheckCircle className="h-6 w-6" />,
  TrendingUp: <TrendingUp className="h-6 w-6" />,
  Sword: <Sword className="h-6 w-6" />,
  ArrowUp: <ArrowUp className="h-6 w-6" />,
  Play: <Play className="h-6 w-6" />,
  Award: <Award className="h-6 w-6" />,
  Trophy: <Trophy className="h-6 w-6" />,
  Crown: <Crown className="h-6 w-6" />,
  HelpCircle: <HelpCircle className="h-6 w-6" />,
  BookOpen: <BookOpen className="h-6 w-6" />,
};

const BadgeIcon: React.FC<{ icon: string; className?: string }> = ({ icon, className }) => {
  const IconComponent = ICON_MAP[icon] || <Award className="h-6 w-6" />;
  return <span className={className}>{IconComponent}</span>;
};

const BadgeCard: React.FC<{ badge: UserBadgeWithDefinition; index: number }> = ({ badge, index }) => {
  const tierColors = BADGE_TIER_COLORS[badge.tier];
  const isLocked = !badge.earned;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={`relative group cursor-pointer ${isLocked ? 'opacity-60' : ''}`}
          >
            <div
              className={`
                relative flex flex-col items-center text-center p-4 rounded-xl
                border transition-all duration-300
                ${isLocked 
                  ? 'bg-white/5 border-white/10' 
                  : `bg-gradient-to-br ${tierColors.bg} ${tierColors.border} shadow-lg ${tierColors.glow}`
                }
                ${!isLocked ? 'hover:scale-105 hover:shadow-xl' : 'hover:bg-white/10'}
              `}
            >
              {/* Glow effect for earned badges */}
              {!isLocked && (
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${tierColors.bg} opacity-20 blur-xl`} />
              )}

              {/* Badge icon */}
              <div className={`
                relative z-10 w-14 h-14 rounded-full flex items-center justify-center mb-3
                ${isLocked 
                  ? 'bg-white/10 text-white/40' 
                  : 'bg-white/20 text-white'
                }
              `}>
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-white/40 absolute" />
                  </div>
                )}
                <BadgeIcon icon={badge.icon} />
              </div>

              {/* Badge name */}
              <p className={`relative z-10 text-sm font-semibold mb-1 ${isLocked ? 'text-white/60' : 'text-white'}`}>
                {badge.name}
              </p>

              {/* Tier badge */}
              <Badge 
                variant="outline" 
                className={`text-[10px] px-2 py-0 ${isLocked ? 'border-white/20 text-white/40' : `${tierColors.border} ${tierColors.text}`}`}
              >
                {badge.tier.charAt(0).toUpperCase() + badge.tier.slice(1)}
              </Badge>

              {/* Progress bar for locked badges */}
              {isLocked && (badge.progress || 0) > 0 && (
                <div className="w-full mt-2">
                  <Progress value={badge.progress} className="h-1 bg-white/10" />
                  <p className="text-[10px] text-white/40 mt-1">{badge.progress}% complete</p>
                </div>
              )}

              {/* Earned date for earned badges */}
              {!isLocked && badge.earnedDate && (
                <p className="text-[10px] text-white/60 mt-2">
                  Earned {new Date(badge.earnedDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs bg-darkBlue-800 border-white/10 text-white p-3"
        >
          <p className="font-semibold text-sm mb-1">{badge.name}</p>
          <p className="text-white/70 text-xs mb-2">{badge.description}</p>
          <div className="flex items-center gap-1 text-xs">
            <Target className="h-3 w-3 text-primary" />
            <span className="text-white/60">{badge.requirement}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const PremiumBadges: React.FC<PremiumBadgesProps> = ({ 
  forceRefresh, 
  showCategories = true,
  maxDisplay 
}) => {
  const { badges, stats, streak, loading } = useBadgeSystem(forceRefresh);
  const [activeCategory, setActiveCategory] = useState<BadgeCategory | 'all'>('all');

  const filteredBadges = activeCategory === 'all' 
    ? badges 
    : badges.filter(b => b.category === activeCategory);

  const displayBadges = maxDisplay ? filteredBadges.slice(0, maxDisplay) : filteredBadges;
  const earnedBadges = badges.filter(b => b.earned);

  if (loading) {
    return (
      <Card className="bg-darkBlue-800 border-darkBlue-700">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            Badges & Achievements
          </CardTitle>
          <CardDescription className="text-gray-400">
            Loading your achievements...
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-32 rounded-xl bg-darkBlue-700" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-darkBlue-800 border-darkBlue-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              Badges & Achievements
            </CardTitle>
            <CardDescription className="text-gray-400">
              {earnedBadges.length} of {badges.length} badges earned
            </CardDescription>
          </div>
          
          {/* Stats Summary */}
          {stats && (
            <div className="flex gap-3">
              {streak && streak.currentStreak > 0 && (
                <div className="flex items-center gap-1 bg-orange-500/20 px-3 py-1 rounded-full">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-400 font-bold text-sm">{streak.currentStreak} day streak</span>
                </div>
              )}
              <div className="flex gap-1">
                {(Object.entries(stats.byTier) as [BadgeTier, number][])
                  .filter(([, count]) => count > 0)
                  .map(([tier, count]) => (
                    <Badge 
                      key={tier}
                      className={`bg-gradient-to-r ${BADGE_TIER_COLORS[tier].bg} border-0 text-white text-xs`}
                    >
                      {count} {tier}
                    </Badge>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {showCategories && (
          <Tabs defaultValue="all" className="mb-6" onValueChange={(v) => setActiveCategory(v as BadgeCategory | 'all')}>
            <TabsList className="bg-white/5 border border-white/10 flex-wrap h-auto p-1">
              <TabsTrigger 
                value="all" 
                className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-white"
              >
                All ({badges.length})
              </TabsTrigger>
              {(Object.entries(BADGE_CATEGORY_LABELS) as [BadgeCategory, string][]).map(([cat, label]) => {
                const count = badges.filter(b => b.category === cat).length;
                const earned = badges.filter(b => b.category === cat && b.earned).length;
                return (
                  <TabsTrigger 
                    key={cat}
                    value={cat}
                    className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-white"
                  >
                    {label.replace(' Badges', '')} ({earned}/{count})
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        )}

        {/* Recently Earned Section */}
        {stats && stats.recentlyEarned.length > 0 && activeCategory === 'all' && (
          <div className="mb-6">
            <h4 className="text-white/80 text-sm font-medium mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />
              Recently Earned
            </h4>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {stats.recentlyEarned.slice(0, 5).map((badge, index) => (
                <BadgeCard key={badge.id} badge={badge} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* All Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <AnimatePresence>
            {displayBadges.map((badge, index) => (
              <BadgeCard key={badge.id} badge={badge} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Almost There Section */}
        {stats && stats.lockedWithProgress.length > 0 && activeCategory === 'all' && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <h4 className="text-white/80 text-sm font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Almost There!
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {stats.lockedWithProgress.slice(0, 3).map((badge) => (
                <div 
                  key={badge.id}
                  className="bg-white/5 rounded-lg p-3 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50">
                    <BadgeIcon icon={badge.icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{badge.name}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={badge.progress} className="h-1 flex-1 bg-white/10" />
                      <span className="text-white/50 text-xs">{badge.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PremiumBadges;
