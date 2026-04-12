import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, Globe, Lock, MessageCircle, Send, HelpCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const contactCards = [
  {
    icon: Mail,
    title: 'Email Us',
    detail: 'crackit2245@gmail.com',
    sub: 'Response within 24 hours',
    href: 'mailto:crackit2245@gmail.com',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: Phone,
    title: 'Call / WhatsApp',
    detail: '+91 7093569420',
    sub: 'Mon–Sat, 10 am – 6 pm IST',
    href: 'tel:+917093569420',
    gradient: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-400',
  },
  {
    icon: Globe,
    title: 'Location',
    detail: '100 % Online',
    sub: 'Accessible worldwide',
    href: undefined,
    gradient: 'from-purple-500/20 to-violet-500/20',
    iconColor: 'text-purple-400',
  },
  {
    icon: Lock,
    title: 'Privacy Inquiries',
    detail: 'beatsmawa2003@gmail.com',
    sub: 'Secure & confidential',
    href: 'mailto:beatsmawa2003@gmail.com',
    gradient: 'from-orange-500/20 to-amber-500/20',
    iconColor: 'text-orange-400',
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('contact_submissions').insert([
        {
          name: formData.name,
          email: formData.email,
          message: `[${formData.subject || 'General'}] ${formData.message}`,
          status: 'new',
        },
      ]);
      if (error) throw error;
      toast.success("Message sent! We'll respond within 24 hours.");
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact form error:', err);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <MessageCircle className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">We'd love to hear from you</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Get in Touch</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Have questions about CrackIt? Need help with your account? Our team is ready to assist you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="max-w-6xl mx-auto px-4 -mt-4 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="h-full bg-card/80 backdrop-blur-sm border-border hover:border-primary/30 transition-colors">
                  <CardContent className="p-5 flex flex-col items-start gap-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.gradient}`}>
                      <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">{card.title}</p>
                      {card.href ? (
                        <a href={card.href} className="text-sm text-primary hover:underline break-all">
                          {card.detail}
                        </a>
                      ) : (
                        <p className="text-sm text-primary font-medium">{card.detail}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Form + Sidebar */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-1">Send Us a Message</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Fill out the form and we'll get back to you within 24 hours.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                          Name *
                        </label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Your full name" />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                          Email *
                        </label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
                      <Select value={formData.subject} onValueChange={(v) => setFormData((p) => ({ ...p, subject: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General">General Inquiry</SelectItem>
                          <SelectItem value="Technical">Technical Issue</SelectItem>
                          <SelectItem value="Feedback">Feedback</SelectItem>
                          <SelectItem value="Partnership">Partnership / Collaboration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                        Message *
                      </label>
                      <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="How can we help you?" />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                      {isSubmitting ? (
                        'Sending…'
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              className="lg:col-span-2 flex flex-col gap-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* WhatsApp */}
              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-10 w-10 text-green-400 mx-auto mb-3" />
                  <h3 className="font-bold text-foreground mb-1">Chat on WhatsApp</h3>
                  <p className="text-sm text-muted-foreground mb-4">Get instant replies from our support team.</p>
                  <Button asChild variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10 w-full">
                    <a href="https://wa.me/917093569420" target="_blank" rel="noopener noreferrer">
                      Open WhatsApp
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardContent className="p-6 text-center">
                  <HelpCircle className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-foreground mb-1">Check our FAQ</h3>
                  <p className="text-sm text-muted-foreground mb-4">Find answers to common questions quickly.</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/faq">
                      Browse FAQ
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
