
interface SectionHeaderProps {
  title: string;
  subtitle: string;
  centered?: boolean;
}

const SectionHeader = ({ title, subtitle, centered = false }: SectionHeaderProps) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
        <span className="text-crimson">{title.split(' ')[0]}</span>
        {" " + title.split(' ').slice(1).join(' ')}
      </h2>
      
      <p className="text-gray-600 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};

export default SectionHeader;
