
import { Card } from "@/components/ui/card";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ServiceCard = ({ title, description, icon }: ServiceCardProps) => {
  return (
    <Card className="p-6 border-none shadow-lg hover:shadow-xl transition-shadow bg-white hover:bg-white/90 group">
      <div className="h-16 w-16 rounded-full bg-crimson/10 flex items-center justify-center mb-5 group-hover:bg-crimson/20 transition-colors">
        <div className="text-crimson">
          {icon}
        </div>
      </div>
      
      <h3 className="text-xl font-playfair font-semibold mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600">
        {description}
      </p>
    </Card>
  );
};

export default ServiceCard;
