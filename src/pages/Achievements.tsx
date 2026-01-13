import { MainLayout } from '@/components/layout/MainLayout';
import { useBudget } from '@/contexts/BudgetContext';
import { Badge } from '@/types';
import { Award, Trophy, Shield, Calendar, Tags, Sparkles, Footprints, Lock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const ICON_MAP: Record<string, React.ElementType> = {
  Footprints: Footprints,
  Shield: Shield,
  Trophy: Trophy,
  Calendar: Calendar,
  Tags: Tags,
  Sparkles: Sparkles,
};

export default function Achievements() {
  const { badges, financialSummary } = useBudget();

  const earnedBadges = badges.filter(b => b.earnedAt);
  const inProgressBadges = badges.filter(b => !b.earnedAt && (b.progress || 0) > 0);
  const lockedBadges = badges.filter(b => !b.earnedAt && !b.progress);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-LS', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  };

  const renderBadge = (badge: Badge, isEarned: boolean) => {
    const IconComponent = ICON_MAP[badge.icon] || Award;
    const progress = badge.maxProgress ? ((badge.progress || 0) / badge.maxProgress) * 100 : 0;
    
    return (
      <div 
        key={badge.id}
        className={`stat-card relative overflow-hidden ${
          isEarned ? 'border-primary/50' : ''
        }`}
      >
        {isEarned && (
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 to-transparent" />
        )}
        
        <div className="flex items-start gap-4">
          <div className={`p-4 rounded-xl ${
            isEarned 
              ? 'badge-earned' 
              : badge.progress 
                ? 'bg-muted' 
                : 'badge-locked'
          }`}>
            {!isEarned && !badge.progress && <Lock className="h-6 w-6 absolute top-2 right-2 opacity-50" />}
            <IconComponent className="h-8 w-8" />
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold">{badge.name}</h4>
            <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
            
            {isEarned && badge.earnedAt && (
              <p className="text-xs text-primary mt-2">
                Earned on {formatDate(badge.earnedAt)}
              </p>
            )}
            
            {!isEarned && badge.maxProgress && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>{badge.requirement}</span>
                  <span>{badge.progress} / {badge.maxProgress}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-heading flex items-center gap-3">
            <Award className="h-8 w-8 text-primary" />
            Achievements
          </h1>
          <p className="text-muted-foreground mt-2">
            Earn badges and track your financial milestones
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card stat-card-primary text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-80" />
            <p className="text-3xl font-bold font-heading">{earnedBadges.length}</p>
            <p className="text-sm opacity-80 mt-1">Badges Earned</p>
          </div>
          <div className="stat-card text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-warning" />
            <p className="text-3xl font-bold font-heading">{inProgressBadges.length}</p>
            <p className="text-sm text-muted-foreground mt-1">In Progress</p>
          </div>
          <div className="stat-card text-center">
            <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-3xl font-bold font-heading">{lockedBadges.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Locked</p>
          </div>
          <div className="stat-card text-center">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-info" />
            <p className="text-3xl font-bold font-heading">{financialSummary.healthScore}</p>
            <p className="text-sm text-muted-foreground mt-1">Health Score</p>
          </div>
        </div>

        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-warning" />
              Earned Badges
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {earnedBadges.map(badge => renderBadge(badge, true))}
            </div>
          </div>
        )}

        {/* In Progress */}
        {inProgressBadges.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              In Progress
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inProgressBadges.map(badge => renderBadge(badge, false))}
            </div>
          </div>
        )}

        {/* Locked */}
        {lockedBadges.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2 text-muted-foreground">
              <Lock className="h-5 w-5" />
              Locked Badges
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lockedBadges.map(badge => renderBadge(badge, false))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="stat-card bg-primary/5 border-primary/20">
          <h4 className="font-semibold mb-3">💡 Tips to Earn More Badges</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Log transactions consistently every day</li>
            <li>• Stay within your monthly budget</li>
            <li>• Complete savings challenges</li>
            <li>• Categorize all your transactions</li>
            <li>• Set and achieve savings goals</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}
