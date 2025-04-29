import type { FC } from 'react';
import { Scissors, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card'; // Removed CardHeader, CardTitle, CardDescription
import { Separator } from '@/components/ui/separator';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  // Category might exist but is not displayed here
}

interface ServiceListProps {
  services: Service[]; // Can be one or multiple services
}

export const ServiceList: FC<ServiceListProps> = ({ services }) => {
  // Determine if it's a single service display (used on the /services page card)
  const isSingleService = services.length === 1;

  return (
    <div className={isSingleService ? '' : 'space-y-4'}> {/* Remove outer spacing if only one service */}
      {services.map((service, index) => (
        <div key={service.id}>
          {/* Use Card only if it's NOT a single service display */}
          <Card className={isSingleService ? "border-none shadow-none p-0 bg-transparent" : "border-none shadow-none p-0"}>
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold flex items-center text-primary"> {/* Ensure text color */}
                  {!isSingleService && <Scissors className="mr-2 h-5 w-5 text-primary" />} {/* Show icon only if multiple */}
                   {service.name}
                </h3>
                <span className="text-lg font-semibold text-primary flex items-center"> {/* Ensure text color */}
                  <DollarSign className="mr-1 h-4 w-4 text-accent" /> {/* Accent color for price icon */}
                  {service.price.toFixed(2)} {/* Format price */}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{service.duration} minutes</span>
              </div>
            </CardContent>
          </Card>
          {/* Add separator only if there are multiple services and it's not the last one */}
          {!isSingleService && index < services.length - 1 && <Separator className="my-4 border-border/50" />}
        </div>
      ))}
    </div>
  );
};
