
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CompanyCard from '@/components/CompanyCard';

const CompaniesList = () => {
  const companies = [
    {
      name: "Infosys",
      logo: "/placeholder.svg",
      description: "Technical aptitude & coding patterns as per Infosys' hiring process.",
      to: "/companies/infosys"
    },
    {
      name: "TCS",
      logo: "/placeholder.svg",
      description: "TCS National Qualifier Test (NQT) style questions and practice tests.",
      to: "/companies/tcs"
    },
    {
      name: "Wipro",
      logo: "/placeholder.svg",
      description: "Designed based on Wipro NLTH and other selection processes.",
      to: "/companies/wipro"
    },
    {
      name: "Accenture",
      logo: "/placeholder.svg",
      description: "Technical, analytical and coding challenges based on Accenture's process.",
      to: "/companies/accenture"
    },
    {
      name: "Amazon",
      logo: "/placeholder.svg",
      description: "Preparation material for Amazon's SDE interviews focusing on algorithms and system design.",
      to: "/companies/amazon"
    },
    {
      name: "Microsoft",
      logo: "/placeholder.svg",
      description: "Practice materials tailored to Microsoft's interview process and coding standards.",
      to: "/companies/microsoft"
    },
    {
      name: "Google",
      logo: "/placeholder.svg",
      description: "Comprehensive guide to Google's technical interview process and question patterns.",
      to: "/companies/google"
    },
    {
      name: "IBM",
      logo: "/placeholder.svg",
      description: "Questions and materials based on IBM's technical assessment and interview rounds.",
      to: "/companies/ibm"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Company Interview Guides</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Practice with company-specific interview patterns to improve your chances of getting hired. Each guide is tailored to the actual interview process of the company.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {companies.map((company, index) => (
            <CompanyCard
              key={index}
              name={company.name}
              logo={company.logo}
              description={company.description}
              to={company.to}
            />
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CompaniesList;
