import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lightbulb, Users, Trophy, Heart, Clock, TrendingUp, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function Careers() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    experience: '',
    coverLetter: ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let resumeUrl = '';

      // Upload resume if provided
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${Date.now()}_${formData.name.replace(/\s+/g, '_')}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(`applications/${fileName}`, resumeFile);

        if (uploadError) throw uploadError;
        resumeUrl = uploadData.path;
      }

      // Save application to database
      const { error } = await supabase
        .from('career_applications')
        .insert([
          {
            applicant_name: formData.name,
            applicant_email: formData.email,
            resume_url: resumeUrl,
            cover_letter: formData.coverLetter,
            position: formData.position,
            experience_level: formData.experience,
            status: 'new'
          }
        ]);

      if (error) throw error;

      toast.success('Application submitted successfully! We\'ll review it and get back to you soon.');
      setFormData({ name: '', email: '', position: '', experience: '', coverLetter: '' });
      setResumeFile(null);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">Join Our Team</h1>
          <p className="text-muted-foreground text-center mb-12 text-lg">
            Help us revolutionize technical education and empower the next generation
          </p>

          {/* Company Values */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <ValueCard icon={Lightbulb} title="Innovation" description="Push boundaries and create cutting-edge solutions" />
            <ValueCard icon={Users} title="Collaboration" description="Work together to achieve great things" />
            <ValueCard icon={Trophy} title="Excellence" description="Strive for the highest quality in everything" />
            <ValueCard icon={Heart} title="Empathy" description="Understanding and supporting our users and team" />
          </div>

          {/* Benefits */}
          <h2 className="text-3xl font-bold mb-6 text-center">Why Work With Us</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <BenefitItem icon={Clock} title="Flexible Work" items={['Remote-first company', 'Flexible hours', 'Work-life balance']} />
            <BenefitItem icon={TrendingUp} title="Growth & Learning" items={['Development budget', 'Mentorship programs', 'Conference attendance']} />
            <BenefitItem icon={Shield} title="Comprehensive Benefits" items={['Competitive salary', 'Health insurance', 'Paid time off']} />
          </div>

          {/* Application Form */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-2">Open Application</h2>
            <p className="text-muted-foreground mb-6">
              We're always looking for talented individuals to join our team. Submit your application below!
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="position" className="block text-sm font-medium mb-2">
                    Position of Interest *
                  </label>
                  <Input
                    id="position"
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                    placeholder="e.g., Software Engineer, Content Creator"
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium mb-2">
                    Experience Level *
                  </label>
                  <Select value={formData.experience} onValueChange={(value) => setFormData({ ...formData, experience: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                      <SelectItem value="junior">Junior (2-4 years)</SelectItem>
                      <SelectItem value="mid">Mid Level (4-7 years)</SelectItem>
                      <SelectItem value="senior">Senior (7-10 years)</SelectItem>
                      <SelectItem value="lead">Lead (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label htmlFor="resume" className="block text-sm font-medium mb-2">
                  Resume/CV (PDF, DOC, or DOCX)
                </label>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                />
              </div>

              <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium mb-2">
                  Cover Letter *
                </label>
                <Textarea
                  id="coverLetter"
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  required
                  placeholder="Tell us why you'd be a great fit for our team..."
                  rows={8}
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </Button>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

interface ValueCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const ValueCard = ({ icon: Icon, title, description }: ValueCardProps) => (
  <Card className="p-6 text-center">
    <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </Card>
);

interface BenefitItemProps {
  icon: React.ElementType;
  title: string;
  items: string[];
}

const BenefitItem = ({ icon: Icon, title, items }: BenefitItemProps) => (
  <Card className="p-6">
    <Icon className="w-10 h-10 mb-4 text-primary" />
    <h3 className="font-semibold mb-3">{title}</h3>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="text-sm text-muted-foreground flex items-center">
          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
          {item}
        </li>
      ))}
    </ul>
  </Card>
);
