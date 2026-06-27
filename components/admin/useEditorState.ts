'use client';

import { useAdminState } from './useAdminState';

interface UseEditorStateReturn {
  getCurrentItems: () => any[];
  setCurrentItems: (newItems: any[]) => void;
  getCollectionName: () => string;
}

interface UseEditorStateProps {
  activeTab: string;
  videos: any[];
  snippets: any[];
  lives: any[];
  photos: any[];
  setVideos: (videos: any[]) => void;
  setSnippets: (snippets: any[]) => void;
  setLives: (lives: any[]) => void;
  setPhotos: (photos: any[]) => void;
}

export function useEditorState({
  activeTab,
  videos,
  snippets,
  lives,
  photos,
  setVideos,
  setSnippets,
  setLives,
  setPhotos,
}: UseEditorStateProps): UseEditorStateReturn {
  const getCurrentItems = () => {
    switch (activeTab) {
      case 'videos':
        return videos;
      case 'snippets':
        return snippets;
      case 'lives':
        return lives;
      case 'photos':
        return photos;
      default:
        return [];
    }
  };

  const setCurrentItems = (newItems: any[]) => {
    switch (activeTab) {
      case 'videos':
        setVideos(newItems);
        break;
      case 'snippets':
        setSnippets(newItems);
        break;
      case 'lives':
        setLives(newItems);
        break;
      case 'photos':
        setPhotos(newItems);
        break;
    }
  };

  const getCollectionName = () => {
    return activeTab === 'photos' ? 'photos' : 'videos';
  };

  return {
    getCurrentItems,
    setCurrentItems,
    getCollectionName,
  };
}