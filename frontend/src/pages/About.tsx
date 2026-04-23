
import NavBar from '@/components/NavBar';
import React, { Suspense } from 'react';
const Footer = React.lazy(() => import('@/components/Footer'));
import Hero from '@/components/Hero';
import SectionHeader from '@/components/SectionHeader';
import { Separator } from '@/components/ui/separator';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      <Hero 
        backgroundImage="/lovable-uploads/6edb5562-fff6-4fa7-90c6-8c9302543b87.png"
        title="About Our Journey"
        subtitle="Discover the story behind Bright Minds Poetry and our passion for the written word."
        buttonText="Join Our Community"
        buttonLink="/contact"
      />
      
      {/* Our Story Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <SectionHeader 
            title="Our Story"
            subtitle="The journey of Bright Minds Poetry from a small writing group to a thriving literary community."
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            <div className="animate-slide-up">
              <h3 className="text-2xl font-playfair font-bold mb-4">
                <span className="text-crimson">How</span> It All Began
              </h3>
              
              <p className="text-gray-700 mb-6">
                The journey that led to the creation of Bright Minds began in 2021, in the most humble of places—a small WhatsApp group of friends sharing and celebrating poetry. We called ourselves <span className="font-semibold text-crimson">Sound of Silence</span>, and from those simple beginnings, a powerful movement was born.
              </p>
              <p className="text-gray-700 mb-6">
                Inspired by the passion and creativity within our group, I realized that poets deserved a stage far greater than a messaging app. The dream of a true poetry community took root, and in 2022, with the encouragement and help of close friends, I began designing what would become Bright Minds. Together, we transformed a shared vision into a living, breathing platform.
              </p>
              <p className="text-gray-700">
                What began as a WhatsApp group where friends connected over verses has blossomed into a global community—a welcoming home for poets everywhere. Today, Bright Minds is more than just a website; it is a vibrant space where poets from every corner of the world can share their work, find inspiration, and connect with others who believe in the magic of words.
              </p>
            </div>
            
            <div className="animate-slide-up">
              <h3 className="text-2xl font-playfair font-bold mb-4">
                <span className="text-crimson">Where</span> We Are Today
              </h3>
              
              <p className="text-gray-700 mb-6">
                From those first verses shared in a WhatsApp group, Bright Minds Poetry has blossomed into a thriving global platform dedicated to elevating the voices of poets everywhere. Today, we are more than a community—we are a movement, empowering writers to share their poems with the world and connect with kindred spirits across continents.
              </p>
              <p className="text-gray-700 mb-6">
                Our gallery is a testament to this growth, now featuring a diverse collection of poetry publications that are ready to be read and downloaded by anyone, anywhere. We believe every poet deserves a stage, and Bright Minds makes that possible—whether you are sharing a single poem or publishing an entire collection.
              </p>
              <p className="text-gray-700">
                As we continue to grow, our commitment remains unwavering: to collaborate with poets from all walks of life and to amplify their voices to a wider audience. The journey that began with a handful of friends is now a beacon for poets around the world, inviting all to join, create, and inspire through the power of words.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission & Vision Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-playfair font-bold mb-10">
              Our <span className="text-crimson">Mission</span> & <span className="text-crimson">Vision</span>
            </h2>
            
            <div className="mb-12">
              <h3 className="text-2xl font-playfair mb-4">Mission</h3>
              <p className="text-gray-700">
                To cultivate a vibrant community where poetry thrives as a relevant, accessible, and transformative art form 
                that connects people across backgrounds and experiences.
              </p>
            </div>
            
            <Separator className="max-w-xs mx-auto my-10 bg-crimson/20" />
            
            <div>
              <h3 className="text-2xl font-playfair mb-4">Vision</h3>
              <p className="text-gray-700">
                A world where poetry is recognized and celebrated as an essential element of cultural expression, personal growth, 
                and community building—where everyone has the opportunity to discover their poetic voice.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <SectionHeader 
            title="Our Team"
            subtitle="Meet the dedicated individuals behind Bright Minds Poetry who bring our vision to life."
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {teamMembers.map((member, index) => (
              <TeamMember 
                key={index}
                name={member.name}
                role={member.role}
                bio={member.bio}
              />
            ))}
          </div>
        </div>
      </section>
      
      <Suspense fallback={<div className="h-24 flex items-center justify-center">Loading footer...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
};

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
}

const TeamMember = ({ name, role, bio }: TeamMemberProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
      <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-crimson rounded-full mb-4 flex items-center justify-center text-white text-2xl font-bold">
        {name.split(' ').map(n => n[0]).join('')}
      </div>
      
      <h3 className="text-xl font-playfair font-semibold">{name}</h3>
      <p className="text-crimson mb-3">{role}</p>
      <p className="text-gray-600">{bio}</p>
    </div>
  );
};

const teamMembers = [
  {
    name: "Tavonga Allan Urayayi",
    role: "Founder & Visionary Poet",
    bio: "Tavonga is the creative force behind Bright Minds Poetry, driven by a bold dream to unite poets around the globe. As the author of 'Diary Of A Monster'—one of our featured publications—and a prolific poet whose works grace our gallery, Tavonga transformed a simple idea into a thriving community and digital stage for poetic voices everywhere. His passion for poetry and innovation inspires everything we do."
  },
  {
    name: "Tanatswa Olsen Mazambani",
    role: "Designer & Full-Stack Developer",
    bio: "Tanatswa is the architect behind Bright Minds' digital experience, designing and building both the user interface and back-end systems. As the first to share poetry on the platform, he set the creative tone and technical foundation for our thriving community. His vision, versatility, and technical mastery have shaped Bright Minds into a welcoming home for poets worldwide."
  },
  {
    name: "Daryl Tawana Chibange",
    role: "Poet & Collections Curator",
    bio: "Daryl is a talented poet whose dedication has shaped the heart of Bright Minds. He played a pivotal role by compiling three impactful poetry collections—H.O.P.E, Blackout, and Unsent Messages. These works showcase the vibrant creativity of our community and make our poetry accessible to all."
  }
];

export default About;
