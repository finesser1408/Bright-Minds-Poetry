
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  image: string;
  title: string;
  description: string;
  reverse?: boolean;
}

const ProjectCard = ({ image, title, description, reverse = false }: ProjectCardProps) => {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 gap-8 items-center",
      reverse ? "md:flex-row-reverse" : ""
    )}>
      <div className={cn(
        "relative overflow-hidden rounded-lg shadow-md border-2 border-crimson min-h-[300px]",
        reverse ? "md:order-2" : "md:order-1"
      )}>
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end">
          <div className="p-6">
            <h4 className="text-xl font-playfair font-semibold text-white">{title}</h4>
          </div>
        </div>
      </div>
      
      <div className={cn(
        "animate-slide-up",
        reverse ? "md:order-1" : "md:order-2"
      )}>
        <h3 className="text-2xl font-playfair font-bold mb-4">
          <span className="text-crimson">{title.split(' ')[0]}</span>
          {" " + title.split(' ').slice(1).join(' ')}
        </h3>
        <p className="text-gray-700">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;
