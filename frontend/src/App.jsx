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
import './App.css';

function App() {
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const handleSelectArtwork = (artwork) => {
    setSelectedArtwork(artwork);
  };

  const handleCloseModal = () => {
    setSelectedArtwork(null);
  };

  return (
    <div className="app-container">
      {/* Editorial Fixed Navbar */}
      <Navbar />

      {/* CRITICAL: Preserved Hero Scrolling Canvas Animation (Information updated only) */}
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
    </div>
  );
}

export default App;
