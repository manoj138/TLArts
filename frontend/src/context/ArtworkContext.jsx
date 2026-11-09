import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ARTWORKS_DATA } from '../data/artworks';
import { authApi, artworkApi, getFullImageUrl } from '../api/apiClient';

const ArtworkContext = createContext();

const OWNER_PASSCODE = 'TLARTS@02';
const STORAGE_KEY = 'tlarts_all_artworks_v1';
const AUTH_KEY = 'tlarts_owner_auth';
const TOKEN_KEY = 'tlarts_admin_token';

export function ArtworkProvider({ children }) {
  const [artworks, setArtworks] = useState(ARTWORKS_DATA);
  const [isOwner, setIsOwner] = useState(false);
  const [currentView, setCurrentView] = useState('portfolio'); // 'portfolio' | 'studio'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch artworks from live backend API or fallback to curated default collection
  const refreshArtworks = useCallback(async () => {
    try {
      setIsLoading(true);
      const liveArtworks = await artworkApi.getAll();
      if (Array.isArray(liveArtworks) && liveArtworks.length > 0) {
        const formatted = liveArtworks.map((art) => ({
          ...art,
          id: art._id || art.id,
          imageUrl: getFullImageUrl(art.imageUrl)
        }));
        setArtworks(formatted);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formatted));
        return;
      }
    } catch (e) {
      console.warn('Backend artworks fetch notice (using cached/default artworks):', e.message);
    } finally {
      setIsLoading(false);
    }

    // Fallback: check localStorage or default ARTWORKS_DATA
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setArtworks(parsed);
          return;
        }
      }
    } catch (err) {
      console.error('Error parsing local artworks:', err);
    }
    setArtworks(ARTWORKS_DATA);
  }, []);

  // Check auth session & load artworks on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const storedAuth = localStorage.getItem(AUTH_KEY) === 'true';

    if (token) {
      authApi.getMe()
        .then(() => setIsOwner(true))
        .catch(() => {
          if (storedAuth) setIsOwner(true);
          else localStorage.removeItem(TOKEN_KEY);
        });
    } else if (storedAuth) {
      setIsOwner(true);
    }

    refreshArtworks();
  }, [refreshArtworks]);

  // Login verification via Backend API with offline fallback
  const verifyPasscode = async (enteredPasscode) => {
    const code = enteredPasscode.trim();
    try {
      const response = await authApi.login({ passcode: code });
      if (response && response.data && response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(AUTH_KEY, 'true');
        setIsOwner(true);
        setIsAuthModalOpen(false);
        setCurrentView('studio');
        return { success: true };
      }
    } catch (apiError) {
      console.warn('Backend login attempt error, checking fallback passcode:', apiError.message);
      // Offline / Direct fallback for owner passcode
      if (code === OWNER_PASSCODE) {
        localStorage.setItem(AUTH_KEY, 'true');
        setIsOwner(true);
        setIsAuthModalOpen(false);
        setCurrentView('studio');
        return { success: true };
      }
      const errMsg = apiError.response?.data?.message || 'Incorrect Passcode. Access Denied.';
      return { success: false, error: errMsg };
    }

    if (code === OWNER_PASSCODE) {
      localStorage.setItem(AUTH_KEY, 'true');
      setIsOwner(true);
      setIsAuthModalOpen(false);
      setCurrentView('studio');
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
    localStorage.removeItem(TOKEN_KEY);
    setCurrentView('portfolio');
  };

  // Add new artwork (supports File upload or direct image URL)
  const addArtwork = async (newArt, imageFile = null) => {
    try {
      const formData = new FormData();
      formData.append('title', newArt.title || 'Untitled Sketch');
      formData.append('category', newArt.category || 'Realistic Portraits');
      formData.append('medium', newArt.medium || 'Graphite & Charcoal');
      if (newArt.dimensions) formData.append('dimensions', newArt.dimensions);
      if (newArt.year) formData.append('year', newArt.year.toString());
      if (newArt.description) formData.append('description', newArt.description);
      if (newArt.instagramPostUrl) formData.append('instagramPostUrl', newArt.instagramPostUrl);
      if (typeof newArt.isFeatured !== 'undefined') formData.append('isFeatured', newArt.isFeatured);

      if (imageFile instanceof File || imageFile instanceof Blob) {
        formData.append('image', imageFile);
      } else if (newArt.imageUrl) {
        formData.append('imageUrl', newArt.imageUrl);
      }

      const created = await artworkApi.create(formData);
      if (created) {
        const formatted = {
          ...created,
          id: created._id || created.id,
          imageUrl: getFullImageUrl(created.imageUrl)
        };
        setArtworks((prev) => [formatted, ...prev]);
        return formatted;
      }
    } catch (e) {
      console.warn('Backend artwork create failed, falling back to local memory:', e.message);
    }

    // Local fallback
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

  // Update existing artwork
  const updateArtwork = async (id, updatedFields, newImageFile = null) => {
    try {
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
      if (isMongoId) {
        const formData = new FormData();
        Object.keys(updatedFields).forEach((key) => {
          if (updatedFields[key] !== undefined && updatedFields[key] !== null) {
            formData.append(key, updatedFields[key]);
          }
        });
        if (newImageFile instanceof File || newImageFile instanceof Blob) {
          formData.append('image', newImageFile);
        }

        const updated = await artworkApi.update(id, formData);
        if (updated) {
          const formatted = {
            ...updated,
            id: updated._id || updated.id,
            imageUrl: getFullImageUrl(updated.imageUrl)
          };
          setArtworks((prev) => prev.map((art) => (art.id === id ? formatted : art)));
          return formatted;
        }
      }
    } catch (e) {
      console.warn('Backend artwork update failed, updating locally:', e.message);
    }

    setArtworks((prev) => {
      const updated = prev.map((art) => (art.id === id ? { ...art, ...updatedFields } : art));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Delete artwork
  const deleteArtwork = async (id) => {
    try {
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
      if (isMongoId) {
        await artworkApi.delete(id);
      }
    } catch (e) {
      console.warn('Backend artwork delete failed, deleting locally:', e.message);
    }

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
        isLoading,
        refreshArtworks,
        openStudio,
        closeStudio,
        verifyPasscode,
        logoutOwner,
        addArtwork,
        updateArtwork,
        deleteArtwork,
        deleteCustomArtwork: deleteArtwork,
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
