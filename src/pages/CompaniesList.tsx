import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CompanyCard from '@/components/CompanyCard';
import { companyData } from '@/data/companyData';
import { motion } from 'framer-motion';

const CompaniesList = () => {
  // Get companies from actual data with proper logos
  const companyLogos: Record<string, string> = {
    infosys: 'https://brandlogos.net/wp-content/uploads/2023/10/infosys-logo-brandlogos.net_.png',
    tcs: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/512px-Tata_Consultancy_Services_Logo.svg.png',
    wipro: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/512px-Wipro_Primary_Logo_Color_RGB.svg.png',
    accenture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/512px-Accenture.svg.png',
    cognizant: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Cognizant_logo.svg/512px-Cognizant_logo.svg.png',
    amazon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/512px-Amazon_logo.svg.png',
    microsoft: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png',
    google: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/512px-Google_2015_logo.svg.png',
    ibm: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/512px-IBM_logo.svg.png',
  };

  const difficultyColors = {
    Easy: 'text-green-400 bg-green-500/10',
    Medium: 'text-yellow-400 bg-yellow-500/10',
    Hard: 'text-red-400 bg-red-500/10',
  };

  const companies = Object.entries(companyData).map(([key, company]) => ({
    key,
    name: company.name,
    logo: companyLogos[key] || '/placeholder.svg',
    description: company.tagline,
    salary: company.averageSalary,
    difficulty: company.difficulty,
    rolesCount: company.rolesOffered.length,
    to: `/companies/${key}`,
  }));

  // Separate into service-based and product-based companies
  const serviceBased = companies.filter(c => 
    ['infosys', 'tcs', 'wipro', 'accenture', 'cognizant', 'ibm'].includes(c.key)
  );
  const productBased = companies.filter(c => 
    ['amazon', 'microsoft', 'google'].includes(c.key)
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">Company Interview Guides</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Practice with company-specific interview patterns to improve your chances of getting hired. 
            Each guide includes eligibility criteria, selection process, and tailored mock tests.
          </p>
        </motion.div>

        {/* Product-Based Companies */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-semibold text-foreground">🚀 Product-Based Companies</h2>
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">High Package</span>
          </div>
          <p className="text-muted-foreground mb-6">
            Top tech giants known for challenging interviews focusing on DSA, System Design, and problem-solving.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productBased.map((company, index) => (
              <motion.div
                key={company.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <CompanyCard
                  name={company.name}
                  logo={company.logo}
                  description={company.description}
                  to={company.to}
                />
                <div className="mt-2 flex items-center justify-between px-2 text-sm">
                  <span className="text-muted-foreground">{company.salary}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${difficultyColors[company.difficulty]}`}>
                    {company.difficulty}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Service-Based Companies */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-semibold text-foreground">🏢 Service-Based Companies</h2>
            <span className="text-xs px-2 py-1 bg-secondary/50 text-secondary-foreground rounded-full">Mass Hiring</span>
          </div>
          <p className="text-muted-foreground mb-6">
            Major IT services companies with structured campus recruitment programs and extensive training.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {serviceBased.map((company, index) => (
              <motion.div
                key={company.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <CompanyCard
                  name={company.name}
                  logo={company.logo}
                  description={company.description}
                  to={company.to}
                />
                <div className="mt-2 flex items-center justify-between px-2 text-sm">
                  <span className="text-muted-foreground">{company.salary}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${difficultyColors[company.difficulty]}`}>
                    {company.difficulty}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Info Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 p-6 bg-card/50 border border-border/50 rounded-xl"
        >
          <h3 className="text-xl font-semibold text-foreground mb-4">📚 What's Included in Each Guide?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/20 rounded-lg">
              <span className="text-2xl">📋</span>
              <h4 className="font-medium text-foreground mt-2">Eligibility Criteria</h4>
              <p className="text-sm text-muted-foreground mt-1">Academic requirements, backlogs policy, and special conditions</p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <span className="text-2xl">🔄</span>
              <h4 className="font-medium text-foreground mt-2">Selection Process</h4>
              <p className="text-sm text-muted-foreground mt-1">Step-by-step interview rounds with tips and duration</p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <span className="text-2xl">📖</span>
              <h4 className="font-medium text-foreground mt-2">Important Topics</h4>
              <p className="text-sm text-muted-foreground mt-1">Priority-based topics to focus on for each company</p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <span className="text-2xl">🎯</span>
              <h4 className="font-medium text-foreground mt-2">Mock Tests</h4>
              <p className="text-sm text-muted-foreground mt-1">Company-specific practice tests matching actual patterns</p>
            </div>
          </div>
        </motion.section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CompaniesList;
