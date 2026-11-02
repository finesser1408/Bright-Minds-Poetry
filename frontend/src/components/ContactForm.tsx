
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { name, email, subject, message } = formData;
      await apiClient.post('/messages/', { name, email, subject, content: message });
      toast({
        title: "Message Sent!",
        description: "Your message has been emailed to our team. We'll get back to you soon.",
        variant: "default",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.detail || "There was a problem sending your message. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="bg-white/90 border-none focus:ring-crimson"
        />
      </div>
      
      <div>
        <Input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="bg-white/90 border-none focus:ring-crimson"
        />
      </div>
      
      <div>
        <Input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="bg-white/90 border-none focus:ring-crimson"
        />
      </div>
      
      <div>
        <Textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          className="bg-white/90 border-none focus:ring-crimson min-h-[150px]"
        />
      </div>
      
      <Button 
        type="submit"
        className="w-full bg-crimson hover:bg-crimson/90 text-white"
      >
        Send Message
      </Button>
    </form>
  );
};

export default ContactForm;
