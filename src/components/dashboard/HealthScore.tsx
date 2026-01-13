interface HealthScoreProps {
  score: number;
}

export function HealthScore({ score }: HealthScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'hsl(142, 71%, 45%)'; // Green
    if (score >= 60) return 'hsl(38, 92%, 50%)';  // Orange
    return 'hsl(0, 84%, 60%)';                     // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  const circumference = 2 * Math.PI * 45;
  const progress = (score / 100) * circumference;
  const strokeDashoffset = circumference - progress;

  return (
    <div className="stat-card animate-fade-in">
      <h4 className="text-sm font-medium text-muted-foreground mb-4">Financial Health Score</h4>
      
      <div className="flex items-center justify-center">
        <div className="health-score-ring">
          <svg width="128" height="128" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={getScoreColor(score)}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold font-heading">{score}</span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-4">
        <span 
          className="inline-block px-3 py-1 rounded-full text-sm font-medium"
          style={{ 
            backgroundColor: `${getScoreColor(score)}20`,
            color: getScoreColor(score)
          }}
        >
          {getScoreLabel(score)}
        </span>
      </div>
      
      <p className="text-xs text-muted-foreground text-center mt-3">
        Keep tracking to improve your score!
      </p>
    </div>
  );
}
