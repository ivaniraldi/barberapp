import type { FC } from 'react';
import { Scissors, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

interface ServiceListProps {
  services: Service[];
}

export const ServiceList: FC<ServiceListProps> = ({ services }) => {
  return (
    <div className="space-y-4">
      {services.map((service, index) => (
        <div key={service.id}>
          <Card className="border-none shadow-none p-0">
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold flex items-center">
                  <Scissors className="mr-2 h-5 w-5 text-primary" />
                  {service.name}
                </h3>
                <span className="text-lg font-semibold text-primary flex items-center">
                  <DollarSign className="mr-1 h-4 w-4" />
                  {service.price}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{service.duration} minutes</span>
              </div>
            </CardContent>
          </Card>
          {index < services.length - 1 && <Separator className="my-4" />}
        </div>
      ))}
    </div>
  );
};