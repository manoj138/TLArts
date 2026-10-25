import { createContext, useContext, useState, useEffect } from 'react';
import { ARTWORKS_DATA } from '../data/artworks';

const ArtworkContext = createContext();

const OWNER_PASSCODE = 'TLARTS@02';
const STORAGE_KEY = 'tlarts_all_artworks_v1';
const AUTH_KEY = 'tlarts_owner_auth';

export function ArtworkProvider({ children }) {
  const [artworks, setArtworks] = useState(ARTWORKS_DATA);
  const [isOwner, setIsOwner] = useState(false);
  const [currentView, setCurrentView] = useState('portfolio'); // 'portfolio' | 'studio'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Load artworks collection & auth state from localStorage on mount
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem(AUTH_KEY) === 'true';
      setIsOwner(storedAuth);

      const savedCollection = localStorage.getItem(STORAGE_KEY);
      if (savedCollection) {
        const parsed = JSON.parse(savedCollection);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setArtworks(parsed);
          return;
        }
      }

      // Check legacy custom artworks if any exist
      const legacyCustom = JSON.parse(localStorage.getItem('tlarts_custom_artworks') || '[]');
      if (Array.isArray(legacyCustom) && legacyCustom.length > 0) {
        const combined = [...legacyCustom, ...ARTWORKS_DATA];
        setArtworks(combined);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
      } else {
        // Initialize with default artworks
        setArtworks(ARTWORKS_DATA);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ARTWORKS_DATA));
      }
    } catch (e) {
      console.error('Failed to load local artworks:', e);
      setArtworks(ARTWORKS_DATA);
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
      id: `sketch-${Date.now()}`,
      slug: (newArt.title || 'custom-sketch').toLowerCase().replace(/\s+/g, '-'),
      year: newArt.year || `${new Date().getFullYear()}`,
      ...newArt
    };

    setArtworks((prev) => {
      const updated = [artworkEntry, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    return artworkEntry;
  };

  // Update existing artwork (title, category, image, notes, instagram url, etc.)
  const updateArtwork = (id, updatedFields) => {
    setArtworks((prev) => {
      const updated = prev.map((art) =>
        art.id === id ? { ...art, ...updatedFields } : art
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Delete any artwork by ID
  const deleteArtwork = (id) => {
    setArtworks((prev) => {
      const updated = prev.filter((art) => art.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Reset to original factory portfolio
  const resetToDefaultArtworks = () => {
    setArtworks(ARTWORKS_DATA);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ARTWORKS_DATA));
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
        updateArtwork,
        deleteArtwork,
        deleteCustomArtwork: deleteArtwork, // backward compatibility
        resetToDefaultArtworks
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
