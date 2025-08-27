
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ContactForm from '@/components/ContactForm';
import { Mail, Phone, Home } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      <Hero 
        backgroundImage="/lovable-uploads/eb0ae85c-cc80-479e-bbfc-354ecf4178a5.png"
        title="Get In Touch"
        subtitle="Have questions or ready to begin your poetic journey? We're here to help."
        buttonText="Contact Now"
        buttonLink="#contact-form"
      />
      
      {/* Contact Section */}
      <section id="contact-form" className="py-12 md:py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 relative overflow-hidden order-2 lg:order-1">
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-b from-pink-400 to-crimson opacity-10"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-b from-pink-400 to-crimson opacity-10"></div>
              
              <h2 className="text-xl md:text-2xl lg:text-3xl font-playfair font-bold mb-2">
                <span className="text-crimson">Send</span> Us a Message
              </h2>
              
              <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
                Fill out the form below, and we'll get back to you as soon as possible.
              </p>
              
              <ContactForm />
            </div>
            
            <div className="flex flex-col justify-between order-1 lg:order-2">
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-playfair font-bold mb-2">
                  <span className="text-crimson">Contact</span> Information
                </h2>
                
                <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
                  Reach out to us using any of the methods below. We're eager to hear from you and answer any questions you may have.
                </p>
                
                <div className="space-y-4 md:space-y-6">
                  <ContactInfo 
                    icon={<Phone size={20} className="md:w-6 md:h-6" />}
                    title="Contact Us"
                    details={[
                      "+263 71 550 3026",
                      "+263 778 203 483",
                      "+263 711 611 961"
                    ]}
                  />
                  
                  <ContactInfo 
                    icon={<Mail size={20} className="md:w-6 md:h-6" />}
                    title="Email"
                    details={["brightmindspoetry1408@gmail.com"]}
                  />
                </div>
              </div>
              

            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-12 md:py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-center mb-8 md:mb-12">
            <span className="text-crimson">Frequently</span> Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <FAQItem 
              question="How do I submit my poetry?"
              answer="Visit our gallery page to submit your poetry. We accept various formats including text, images, videos, and documents."
            />
            
            <FAQItem 
              question="What types of poetry do you accept?"
              answer="We welcome all forms of poetry - traditional, contemporary, spoken word, and experimental. Share your unique voice with us!"
            />
            
            <FAQItem 
              question="How long does it take to review submissions?"
              answer="We aim to review and respond to submissions within 2-3 business days."
            />
            
            <FAQItem 
              question="Can I submit multiple poems?"
              answer="Yes, you can submit up to 3 poems at a time. Each poem should be submitted separately."
            />
            
            <FAQItem 
              question="What happens after my poem is accepted?"
              answer="Your poem will be featured in our gallery and shared with our community. You'll also receive feedback from our poetry experts."
            />
            
            <FAQItem 
              question="How can I support Bright Minds Poetry?"
              answer="Share our platform with fellow poets, submit your work, and engage with our community. Your support helps us grow and inspire more poets!"
            />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

interface ContactInfoProps {
  icon: React.ReactNode;
  title: string;
  details: string[];
}

const ContactInfo = ({ icon, title, details }: ContactInfoProps) => {
  return (
    <div className="flex">
      <div className="mr-3 md:mr-4 text-crimson flex-shrink-0">
        {icon}
      </div>
      
      <div>
        <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2">{title}</h3>
        <ul className="space-y-1 text-gray-600 text-sm md:text-base">
          {details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-base md:text-lg font-playfair font-semibold mb-2 md:mb-3">
        {question}
      </h3>
      
      <p className="text-gray-600 text-sm md:text-base">
        {answer}
      </p>
    </div>
  );
};

export default Contact;
