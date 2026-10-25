import { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import HeroScroll from './components/HeroScroll/HeroScroll';
import ArtistIntroduction from './components/ArtistIntroduction/ArtistIntroduction';
import FeaturedSketches from './components/FeaturedSketches/FeaturedSketches';
import SketchGallery from './components/SketchGallery/SketchGallery';
import CreativeProcess from './components/CreativeProcess/CreativeProcess';
import InstagramSection from './components/InstagramSection/InstagramSection';
import EnquirySection from './components/EnquirySection/EnquirySection';
import Footer from './components/Footer/Footer';
import ArtworkModal from './components/ArtworkModal/ArtworkModal';
import OwnerAuthModal from './components/OwnerPortal/OwnerAuthModal';
import AddArtworkModal from './components/OwnerPortal/AddArtworkModal';
import OwnerFloatingBar from './components/OwnerPortal/OwnerFloatingBar';
import { ArtworkProvider } from './context/ArtworkContext';
import './App.css';

function AppContent() {
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const handleSelectArtwork = (artwork) => {
    setSelectedArtwork(artwork);
  };

  const handleCloseModal = () => {
    setSelectedArtwork(null);
  };

  return (
    <div className="app-container">
      {/* Editorial Fixed Navbar with 4-Click Secret Trigger */}
      <Navbar />

      {/* CRITICAL: Preserved Hero Scrolling Canvas Animation (Untouched) */}
      <HeroScroll />

      {/* Main Portfolio Sections */}
      <main id="main-portfolio" className="main-content">
        {/* 1. Artist Introduction & Philosophy */}
        <ArtistIntroduction />

        {/* 2. Curated Featured Sketches */}
        <FeaturedSketches onSelectArtwork={handleSelectArtwork} />

        {/* 3. Complete Sketch Gallery with Search & Category Filters */}
        <SketchGallery onSelectArtwork={handleSelectArtwork} />

        {/* 4. The 5-Stage Creative Sketching Process */}
        <CreativeProcess />

        {/* 5. Official Instagram Connection (@artist_tushar_02) */}
        <InstagramSection />

        {/* 6. Custom Sketch Commission Booking Interface */}
        <EnquirySection />

        {/* 7. Footer */}
        <Footer />
      </main>

      {/* Artwork Curatorial Modal with Direct Instagram Link */}
      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={handleCloseModal}
        />
      )}

      {/* Secret Owner Portal Components */}
      <OwnerAuthModal />
      <AddArtworkModal />
      <OwnerFloatingBar />
    </div>
  );
}

export default function App() {
  return (
    <ArtworkProvider>
      <AppContent />
    </ArtworkProvider>
  );
}
