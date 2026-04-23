
import { Card } from "@/components/ui/card";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

const TestimonialCard = ({ quote, author, role }: TestimonialCardProps) => {
  return (
    <Card className="p-6 border-none shadow-lg bg-white/80 backdrop-blur-sm relative">
      <div className="text-5xl font-playfair text-crimson/20 absolute top-2 left-4">❞</div>
      
      <div className="pt-6">
        <p className="text-gray-700 italic mb-6 relative z-10">
          {quote}
        </p>
        
        <div>
          <p className="font-semibold text-gray-900">{author}</p>
          <p className="text-sm text-crimson">{role}</p>
        </div>
      </div>
    </Card>
  );
};

export default TestimonialCard;
