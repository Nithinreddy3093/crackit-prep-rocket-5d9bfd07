import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SimpleDashboard from '@/components/dashboard/SimpleDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700">
      <Navbar />
      <main className="flex-grow">
        <SimpleDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;