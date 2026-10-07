import React from 'react';
import CollegeDetailsModule from '@/components/CollegeDetailsModule';
import { motion } from 'motion/react';

export default function CollegeDirectoryPage() {
  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CollegeDetailsModule
            title="Andhra Pradesh Engineering Colleges & Placement Directory"
            subtitle="Explore 50 premier engineering colleges and university campuses across Andhra Pradesh. Filter by district, view past multi-year placement statistics, top recruiting companies, and visit official college portals."
          />
        </motion.div>
      </div>
    </div>
  );
}
