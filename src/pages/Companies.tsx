
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CompanyInfo from '@/components/companies/CompanyInfo';

const Companies = () => {
  const { companyName } = useParams();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CompanyInfo companyName={companyName} />
      <Footer />
    </div>
  );
};

export default Companies;
