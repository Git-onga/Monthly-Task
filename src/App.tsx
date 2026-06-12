import { useState } from 'react';
import Landing from './pages/Landing';
import Map from './pages/MapPage';
import RoomPage from './pages/RoomPage';
import BookPage from './pages/BookPage';
import Finale from './pages/Finale';
import MagicCursor from './components/MagicCursor';
import { ALL_DOORS } from './pages/MapPage';

type Page = 'landing' | 'map' | 'room' | 'book' | 'finale';

export default function App() {
  const [page, setPage]                   = useState<Page>('landing');
  const [selectedDoorId, setSelectedDoorId] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  // How many doors are unlocked — starts at 1 so Door I is always open.
  const [unlockedCount, setUnlockedCount] = useState<number>(1);

  const handleUnlockNext = () => {
    setUnlockedCount(prev => Math.min(prev + 1, ALL_DOORS.length));
  };

  // Index of the currently open room door (0-based)
  const currentDoorIndex = ALL_DOORS.findIndex(d => d.id === selectedDoorId);
  // True when the player is inside the last currently-unlocked door
  const isAtUnlockBoundary = currentDoorIndex === unlockedCount - 1
    && unlockedCount < ALL_DOORS.length;

  return (
    <>
      <MagicCursor />

      {page === 'landing' && (
        <Landing onBegin={() => setPage('map')} />
      )}

      {page === 'map' && (
        <Map
          onBack={() => setPage('landing')}
          onEnterRoom={(doorId) => {
            setSelectedDoorId(doorId);
            setPage('room');
          }}
          onFinale={() => setPage('finale')}
          unlockedCount={unlockedCount}
        />
      )}

      {page === 'room' && selectedDoorId && (
        <RoomPage
          doorId={selectedDoorId}
          onBack={() => setPage('map')}
          onOpenBook={(bookId) => {
            setSelectedBookId(bookId);
            setPage('book');
          }}
          showUnlockButton={isAtUnlockBoundary}
          onUnlockNext={() => {
            handleUnlockNext();
            setPage('map');
          }}
        />
      )}

      {page === 'book' && selectedDoorId && selectedBookId && (
        <BookPage
          doorId={selectedDoorId}
          bookId={selectedBookId}
          onBack={() => setPage('room')}
          onNavigateBook={(bookId) => setSelectedBookId(bookId)}
        />
      )}

      {page === 'finale' && (
        <Finale
          onReturn={() => {
            setSelectedDoorId(null);
            setSelectedBookId(null);
            setPage('landing');
          }}
        />
      )}
    </>
  );
}
