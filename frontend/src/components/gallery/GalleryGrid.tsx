import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GalleryItem } from "@/services/galleryService";
import GalleryItemComponent from "./GalleryItemComponent";

interface GalleryGridProps {
  items: GalleryItem[];
  loading: boolean;
  error: string | null;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const GalleryGrid = ({ 
  items, 
  loading, 
  error, 
  activeTab, 
  onTabChange 
}: GalleryGridProps) => {
  if (loading) {
    return <div className="py-12 text-center">Loading gallery items...</div>;
  }

  if (error) {
    return <div className="py-12 text-center text-red-500">{error}</div>;
  }

  if (items.length === 0) {
    return <div className="py-12 text-center text-gray-500">No items found in the gallery.</div>;
  }

  return (
    <div className="py-4">
      <div className="sticky top-16 z-10 bg-white/80 backdrop-blur-sm py-4 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <Tabs 
            value={activeTab} 
            onValueChange={onTabChange} 
            className="w-full max-w-2xl mx-auto"
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-50 p-1 rounded-lg">
              <TabsTrigger 
                value="poem" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 rounded-md transition-all"
              >
                <span className="flex items-center gap-2 px-4 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  Poems
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="publication" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 rounded-md transition-all"
              >
                <span className="flex items-center gap-2 px-4 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-newspaper">
                    <path d="M4 22h16a2 2 0 0 0 2-2V7.5L17.5 2H6a2 2 0 0 0-2 2v4"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <path d="M2 13v-1h6v1"></path>
                    <path d="M6 13v8h12v-6"></path>
                    <path d="M10 18h4"></path>
                  </svg>
                  Publications
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items
            .filter(item => {
              if (activeTab === 'poem') return item.item_type === 'poem';
              if (activeTab === 'publication') return item.item_type === 'publication';
              return true; // For 'all' tab
            })
            .map((item) => (
              <div key={item.id} className="cursor-pointer">
                <GalleryItemComponent 
                  image={item.media_file || ''}
                  title={item.title}
                  description={item.description || ''}
                  type={item.item_type}
                  mediaType={item.media_type}
                  thumbnail={item.thumbnail}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryGrid;