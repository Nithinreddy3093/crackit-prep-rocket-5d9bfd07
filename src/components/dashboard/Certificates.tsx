
import React from 'react';
import { Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export interface Certificate {
  id: number;
  name: string;
  issueDate: string;
  score: string;
}

interface CertificatesProps {
  certificates: Certificate[];
}

const Certificates: React.FC<CertificatesProps> = ({ certificates }) => {
  return (
    <Card className="bg-darkBlue-800 border-darkBlue-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-white">Certificates</CardTitle>
          <Trophy className="h-5 w-5 text-primary" />
        </div>
        <CardDescription className="text-gray-400">
          Your earned certifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="flex items-start space-x-4 p-4 rounded-lg bg-darkBlue-700/50 border border-darkBlue-600">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{cert.name}</h3>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
                  <p className="text-gray-400 text-sm">
                    Issued on {new Date(cert.issueDate).toLocaleDateString()}
                  </p>
                  <div className="mt-2 sm:mt-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                    Score: {cert.score}
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-primary hover:bg-primary/10"
                onClick={() => {
                  toast({
                    title: "Certificate Details",
                    description: `Viewing details for ${cert.name}`,
                    variant: "default",
                  });
                }}
              >
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Certificates;
