import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'secondary';
  children?: ReactNode;
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  trend,
  variant = 'default',
  children 
}: StatCardProps) {
  const variantClasses = {
    default: 'stat-card',
    primary: 'stat-card stat-card-primary',
    secondary: 'stat-card stat-card-secondary',
  };

  return (
    <div className={`${variantClasses[variant]} animate-fade-in`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className={`text-xs font-medium ${variant !== 'default' ? 'opacity-90' : 'text-muted-foreground'}`}>
            {title}
          </p>
          <h3 className="text-xl lg:text-2xl font-bold font-heading mt-0.5">
            {value}
          </h3>
          {subtitle && (
            <p className={`text-xs mt-0.5 ${variant !== 'default' ? 'opacity-80' : 'text-muted-foreground'}`}>
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg ${variant !== 'default' ? 'bg-white/20' : 'bg-primary/10'}`}>
            <Icon className={`h-5 w-5 ${variant !== 'default' ? '' : 'text-primary'}`} />
          </div>
        )}
      </div>
      
      {trend && (
        <div className="flex items-center gap-1 text-xs">
          <span className={trend.isPositive ? 'text-success' : 'text-destructive'}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className={variant !== 'default' ? 'opacity-70' : 'text-muted-foreground'}>
            vs last month
          </span>
        </div>
      )}
      
      {children}
    </div>
  );
}
