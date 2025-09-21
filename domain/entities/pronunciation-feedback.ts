export type PronunciationFeedback = {
  overall: number;
  numericDuration: number;
  fluency: number;
  integrity: number;
  rearTone: string;
  speed: number;
  duration: string;
  resourceVersion: string;
  pauseCount: number;
  kernelVersion: string;
  pronunciation: number;
  rhythm: number;
  warning: { code: number; message: string }[]
  words: WordFeedback[];
};

export type WordFeedback = {
  word: string;
  charType: number;
  linkable: number;
  linked: number;
  span: Span;
  scores: {
    pronunciation: number;
    overall: number;
    prominence: number;
  };
  pause: {
    duration: number;
    type: number;
  };
  phonics: Phonic[];
  wordParts: WordPart[];
  phonemes: Phoneme[];
};

export type Span = {
  start: number;
  end: number;
};

export type Phonic = {
  spell: string;
  phoneme: string[];
  overall: number;
};

export type WordPart = {
  charType: number;
  part: string;
  beginIndex: number;
  endIndex: number;
};

export type Phoneme = {
  soundLike: string;
  readType: number;
  phoneme: string;
  span: Span;
  stressMark: number;
  pronunciation: number;
  insertedAfter: string[];
  insertedBefore: string[];
};
