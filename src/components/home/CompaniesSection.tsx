
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CompanyCard from '@/components/CompanyCard';

const CompaniesSection = () => {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Practice by Company
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
              Take tests modeled after specific companies' interview patterns to improve your chances of getting hired.
            </p>
          </div>
          <div className="mt-5 flex lg:mt-0">
            <Link
              to="/companies"
              className="inline-flex items-center rounded-md border border-primary bg-background px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
            >
              View all companies
              <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <CompanyCard
            name="Infosys"
            logo="https://brandlogos.net/wp-content/uploads/2023/10/infosys-logo-brandlogos.net_.png"
            description="Technical aptitude & coding patterns as per Infosys' hiring process."
            to="/companies/infosys"
          />
          <CompanyCard
            name="TCS"
            logo="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/512px-Tata_Consultancy_Services_Logo.svg.png"
            description="TCS National Qualifier Test (NQT) style questions and practice tests."
            to="/companies/tcs"
          />
          <CompanyCard
            name="Wipro"
            logo="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/512px-Wipro_Primary_Logo_Color_RGB.svg.png"
            description="Designed based on Wipro NLTH and other selection processes."
            to="/companies/wipro"
          />
          <CompanyCard
            name="Accenture"
            logo="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/512px-Accenture.svg.png"
            description="Technical, analytical and coding challenges based on Accenture's process."
            to="/companies/accenture"
          />
        </div>
      </div>
    </section>
  );
};

export default CompaniesSection;
