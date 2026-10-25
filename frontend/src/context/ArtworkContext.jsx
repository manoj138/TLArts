import { createContext, useContext, useState, useEffect } from 'react';
import { ARTWORKS_DATA } from '../data/artworks';

const ArtworkContext = createContext();

const OWNER_PASSCODE = 'TLARTS@02';
const STORAGE_KEY = 'tlarts_custom_artworks';
const AUTH_KEY = 'tlarts_owner_auth';

export function ArtworkProvider({ children }) {
  const [artworks, setArtworks] = useState(ARTWORKS_DATA);
  const [isOwner, setIsOwner] = useState(false);
  const [currentView, setCurrentView] = useState('portfolio'); // 'portfolio' | 'studio'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Load custom artworks & auth state from localStorage on mount
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem(AUTH_KEY) === 'true';
      setIsOwner(storedAuth);

      const storedArtworks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(storedArtworks) && storedArtworks.length > 0) {
        // Merge custom artworks at the beginning
        setArtworks([...storedArtworks, ...ARTWORKS_DATA]);
      }
    } catch (e) {
      console.error('Failed to load local artworks:', e);
    }
  }, []);

  // Login verification
  const verifyPasscode = (enteredPasscode) => {
    if (enteredPasscode.trim() === OWNER_PASSCODE) {
      setIsOwner(true);
      localStorage.setItem(AUTH_KEY, 'true');
      setIsAuthModalOpen(false);
      setCurrentView('studio'); // Open full page studio dashboard immediately!
      return { success: true };
    }
    return { success: false, error: 'Incorrect Passcode. Access Denied.' };
  };

  const openStudio = () => {
    if (isOwner) {
      setCurrentView('studio');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const closeStudio = () => {
    setCurrentView('portfolio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logoutOwner = () => {
    setIsOwner(false);
    localStorage.removeItem(AUTH_KEY);
    setCurrentView('portfolio');
  };

  // Add new artwork
  const addArtwork = (newArt) => {
    const artworkEntry = {
      id: `custom-sketch-${Date.now()}`,
      slug: (newArt.title || 'custom-sketch').toLowerCase().replace(/\s+/g, '-'),
      year: newArt.year || `${new Date().getFullYear()}`,
      isCustom: true,
      ...newArt
    };

    const existingCustom = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updatedCustom = [artworkEntry, ...existingCustom];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCustom));
    setArtworks([...updatedCustom, ...ARTWORKS_DATA]);
    return artworkEntry;
  };

  // Delete a custom added artwork
  const deleteCustomArtwork = (id) => {
    const existingCustom = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updatedCustom = existingCustom.filter((art) => art.id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCustom));
    setArtworks([...updatedCustom, ...ARTWORKS_DATA]);
  };

  return (
    <ArtworkContext.Provider
      value={{
        artworks,
        isOwner,
        currentView,
        setCurrentView,
        isAuthModalOpen,
        setIsAuthModalOpen,
        openStudio,
        closeStudio,
        verifyPasscode,
        logoutOwner,
        addArtwork,
        deleteCustomArtwork
      }}
    >
      {children}
    </ArtworkContext.Provider>
  );
}

export function useArtworks() {
  const context = useContext(ArtworkContext);
  if (!context) {
    throw new Error('useArtworks must be used within an ArtworkProvider');
  }
  return context;
}
