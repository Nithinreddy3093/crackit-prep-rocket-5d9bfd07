import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Flame, Target, TrendingUp, Star, Award, Crown,
  Zap, CheckCircle, Shield, BarChart3, Lock, Sparkles,
  ArrowLeft, Medal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useBadgeSystem } from '@/hooks/useBadgeSystem';
import { useAuth } from '@/contexts/AuthContext';
import {
  BADGE_TIER_COLORS,
  BADGE_CATEGORY_LABELS,
  type UserBadgeWithDefinition,
  type BadgeTier,
  type BadgeCategory,
} from '@/services/badgeEngine';

// Reuse icon map
const ICON_MAP: Record<string, React.ReactNode> = {
  Code: <span className="lucide"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></span>,
  Database: <span className="lucide"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg></span>,
  Cpu: <Zap className="h-5 w-5" />,
  Brain: <Star className="h-5 w-5" />,
  Box: <Shield className="h-5 w-5" />,
  Building: <Award className="h-5 w-5" />,
  Landmark: <Crown className="h-5 w-5" />,
  Scale: <Trophy className="h-5 w-5" />,
  Flame: <Flame className="h-5 w-5" />,
  Target: <Target className="h-5 w-5" />,
  Star: <Star className="h-5 w-5" />,
  Zap: <Zap className="h-5 w-5" />,
  CheckCircle: <CheckCircle className="h-5 w-5" />,
  TrendingUp: <TrendingUp className="h-5 w-5" />,
  Sword: <Shield className="h-5 w-5" />,
  ArrowUp: <TrendingUp className="h-5 w-5" />,
  Play: <Star className="h-5 w-5" />,
  Award: <Award className="h-5 w-5" />,
  Trophy: <Trophy className="h-5 w-5" />,
  Crown: <Crown className="h-5 w-5" />,
  HelpCircle: <Target className="h-5 w-5" />,
  BookOpen: <BarChart3 className="h-5 w-5" />,
};

const getBadgeIcon = (icon: string) => ICON_MAP[icon] || <Award className="h-5 w-5" />;

const TIER_ORDER: BadgeTier[] = ['platinum', 'gold', 'silver', 'bronze'];

const Achievements: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { badges, stats, streak, strengths, loading } = useBadgeSystem();

  const earnedBadges = badges.filter(b => b.earned);
  const lockedBadges = badges.filter(b => !b.earned);

  // Stats cards data
  const statCards = [
    {
      label: 'Badges Earned',
      value: earnedBadges.length,
      total: badges.length,
      icon: <Trophy className="h-5 w-5" />,
      color: 'text-yellow-400',
      bg: 'from-yellow-500/20 to-amber-500/10',
    },
    {
      label: 'Current Streak',
      value: streak?.currentStreak || 0,
      suffix: 'days',
      icon: <Flame className="h-5 w-5" />,
      color: 'text-orange-400',
      bg: 'from-orange-500/20 to-red-500/10',
    },
    {
      label: 'Longest Streak',
      value: streak?.longestStreak || 0,
      suffix: 'days',
      icon: <Zap className="h-5 w-5" />,
      color: 'text-purple-400',
      bg: 'from-purple-500/20 to-pink-500/10',
    },
    {
      label: 'Strengths Found',
      value: strengths.strengths.length,
      icon: <Target className="h-5 w-5" />,
      color: 'text-emerald-400',
      bg: 'from-emerald-500/20 to-teal-500/10',
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Sign in to view Achievements</h1>
          <p className="text-muted-foreground mb-6">Track your badges, strengths, and progress.</p>
          <Link to="/login" className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
            Sign In
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-yellow-400" />
              Achievements
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {earnedBadges.length} of {badges.length} badges unlocked
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statCards.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="border-border/50 bg-card">
                    <CardContent className="p-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.bg} flex items-center justify-center ${s.color} mb-3`}>
                        {s.icon}
                      </div>
                      <p className="text-2xl font-bold text-foreground">
                        {s.value}
                        {s.total !== undefined && <span className="text-sm text-muted-foreground font-normal">/{s.total}</span>}
                        {s.suffix && <span className="text-sm text-muted-foreground font-normal ml-1">{s.suffix}</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Tier Progress */}
            <Card className="border-border/50 bg-card mb-8">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-foreground flex items-center gap-2">
                  <Medal className="h-5 w-5 text-primary" />
                  Tier Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {TIER_ORDER.map(tier => {
                    const total = badges.filter(b => b.tier === tier).length;
                    const earned = badges.filter(b => b.tier === tier && b.earned).length;
                    const pct = total > 0 ? Math.round((earned / total) * 100) : 0;
                    const colors = BADGE_TIER_COLORS[tier];
                    return (
                      <div key={tier} className="text-center">
                        <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center mb-2`}>
                          <span className="text-white font-bold text-sm">{earned}</span>
                        </div>
                        <p className={`text-sm font-semibold capitalize ${colors.text}`}>{tier}</p>
                        <p className="text-xs text-muted-foreground">{earned}/{total}</p>
                        <Progress value={pct} className="h-1.5 mt-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Strengths Section */}
            {strengths.strengths.length > 0 && (
              <Card className="border-border/50 bg-card mb-8">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-foreground flex items-center gap-2">
                    💪 Your Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {strengths.strengths.slice(0, 6).map((s, i) => (
                      <motion.div
                        key={s.topic}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/30"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${BADGE_TIER_COLORS[s.tier].bg}`}>
                          <span className="text-white text-sm font-bold">{Math.round(s.accuracy)}%</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{s.displayName}</p>
                          <p className="text-xs text-muted-foreground">{s.attempts} attempts</p>
                        </div>
                        {s.badge && (
                          <Badge variant="outline" className={`text-[10px] ${BADGE_TIER_COLORS[s.tier].border} ${BADGE_TIER_COLORS[s.tier].text}`}>
                            {s.badge.name}
                          </Badge>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Badge Gallery */}
            <Tabs defaultValue="all">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Badge Gallery</h2>
                <TabsList className="bg-muted/50 border border-border/30">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="earned" className="text-xs">Earned ({earnedBadges.length})</TabsTrigger>
                  <TabsTrigger value="locked" className="text-xs">Locked ({lockedBadges.length})</TabsTrigger>
                </TabsList>
              </div>

              {(['all', 'earned', 'locked'] as const).map(tab => (
                <TabsContent key={tab} value={tab}>
                  {(Object.entries(BADGE_CATEGORY_LABELS) as [BadgeCategory, string][]).map(([cat, label]) => {
                    const catBadges = (tab === 'all' ? badges : tab === 'earned' ? earnedBadges : lockedBadges)
                      .filter(b => b.category === cat);
                    if (catBadges.length === 0) return null;
                    return (
                      <div key={cat} className="mb-8">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">{label}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                          {catBadges.map((badge, idx) => (
                            <BadgeGalleryCard key={badge.id} badge={badge} index={idx} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </TabsContent>
              ))}
            </Tabs>

            {/* Weaknesses / Improvement Areas */}
            {strengths.weaknesses.length > 0 && (
              <Card className="border-border/50 bg-card mt-8">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-foreground flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Areas to Improve
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {strengths.weaknesses.slice(0, 3).map(w => (
                      <div key={w.topic} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/20">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-destructive/10">
                          <span className="text-destructive text-sm font-bold">{Math.round(w.accuracy)}%</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{w.displayName}</p>
                          <p className="text-xs text-muted-foreground">{w.attempts} attempts · Keep practicing!</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

// Badge card for gallery
const BadgeGalleryCard: React.FC<{ badge: UserBadgeWithDefinition; index: number }> = ({ badge, index }) => {
  const tierColors = BADGE_TIER_COLORS[badge.tier];
  const isLocked = !badge.earned;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            className={`relative flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-300 cursor-pointer
              ${isLocked
                ? 'bg-muted/30 border-border/20 opacity-60 hover:opacity-80'
                : `bg-gradient-to-br ${tierColors.bg} ${tierColors.border} shadow-lg ${tierColors.glow} hover:scale-105`
              }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2
              ${isLocked ? 'bg-muted text-muted-foreground' : 'bg-white/20 text-white'}`}>
              {isLocked && <Lock className="h-4 w-4 absolute" />}
              {getBadgeIcon(badge.icon)}
            </div>
            <p className={`text-xs font-semibold mb-1 ${isLocked ? 'text-muted-foreground' : 'text-white'}`}>
              {badge.name}
            </p>
            <Badge
              variant="outline"
              className={`text-[9px] px-1.5 py-0 ${isLocked ? 'border-border/30 text-muted-foreground' : `${tierColors.border} ${tierColors.text}`}`}
            >
              {badge.tier}
            </Badge>
            {isLocked && (badge.progress || 0) > 0 && (
              <div className="w-full mt-2">
                <Progress value={badge.progress} className="h-1" />
                <p className="text-[9px] text-muted-foreground mt-0.5">{badge.progress}%</p>
              </div>
            )}
            {!isLocked && badge.earnedDate && (
              <p className="text-[9px] text-white/60 mt-1">
                {new Date(badge.earnedDate).toLocaleDateString()}
              </p>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs p-3">
          <p className="font-semibold text-sm">{badge.name}</p>
          <p className="text-muted-foreground text-xs mb-1">{badge.description}</p>
          <p className="text-xs flex items-center gap-1">
            <Target className="h-3 w-3 text-primary" />
            {badge.requirement}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Achievements;
