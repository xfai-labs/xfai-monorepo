import { motion } from 'framer-motion';
import Hero from '@landing/components/Hero';
import BackedBy from '@landing/components/BackedBy';
import Features from '@landing/components/Features';
import SupportedChains from '@landing/components/SupportedChains';
import GettingStarted from '@landing/components/GettingStarted';
import DocumentationFeatures from '@landing/components/DocumentationFeatures';

export default function Home() {
  return (
    <motion.div
      key="homepage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 75, mass: 0.5 }}
      className="flex w-full grow flex-col items-center gap-12 self-stretch lg:gap-16 2xl:gap-24"
    >
      <Hero />
      <BackedBy />
      <Features />
      <SupportedChains />
      <GettingStarted />
      <DocumentationFeatures />
    </motion.div>
  );
}

// Lorem Ipsum
