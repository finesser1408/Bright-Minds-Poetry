
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

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
      const res = await fetch('http://localhost:8000/api/messages/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, content: message })
      });
      if (!res.ok) throw new Error('Failed to send message');
      toast({
        title: "Message Sent!",
        description: "We'll get back to you soon.",
        variant: "default",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again later.",
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
