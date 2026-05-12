export interface SavedNote {
  id: string;
  title: string;
  originalText: string;
  summary: string;
  keyPoints: string;
  quiz: any[];
  flashcards: any[];
  timestamp: number;
}

const STORAGE_KEY = "ai_study_notes";

export const storageService = {
  getNotes: (): SavedNote[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveNote: (note: Omit<SavedNote, "id" | "timestamp">) => {
    const notes = storageService.getNotes();
    const newNote: SavedNote = {
      ...note,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    notes.unshift(newNote);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return newNote;
  },

  clearAll: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  deleteNote: (id: string) => {
    const notes = storageService.getNotes();
    const filtered = notes.filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  searchNotes: (query: string): SavedNote[] => {
    const notes = storageService.getNotes();
    const q = query.toLowerCase();
    return notes.filter(n => 
      n.title.toLowerCase().includes(q) || 
      n.summary.toLowerCase().includes(q)
    );
  }
};
