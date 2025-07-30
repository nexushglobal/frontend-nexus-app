import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface Props {
  className: string;
  icon: LucideIcon;
  title: string;
  value: number | undefined;
  subtitle: string;
}

const SummaryPointCard = ({
  className,
  icon: Icon,
  title,
  value,
  subtitle,
}: Props) => {
  return (
    <Card
      className={cn(
        'relative overflow-hidden rounded-xl px-4 border shadow-sm',
        className,
      )}
    >
      <div
        className={cn(
          'absolute -top-16 -right-16 w-32 h-32 rounded-full blur-xl',
          className,
        )}
      ></div>
      <CardContent>
        <div className="mb-4 flex items-center gap-3">
          <Icon className="h-5 w-5" />
          <h3 className="text-base font-medium">{title}</h3>
        </div>
        <p className="text-3xl font-bold mt-2 relative z-10">{value}</p>
        <p className="text-sm mt-1 relative z-10">{subtitle}</p>
      </CardContent>
      <div
        className={cn(
          'absolute -bottom-8 -left-8 w-24 h-24 rounded-full blur-lg',
          className,
        )}
      ></div>
    </Card>
  );
};

export default SummaryPointCard;
