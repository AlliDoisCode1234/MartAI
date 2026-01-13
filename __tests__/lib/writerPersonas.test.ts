import { describe, it, expect, beforeEach } from 'vitest';
import {
  WRITER_POOL,
  CONTENT_MANAGERS,
  CONTENT_DIRECTOR,
  selectWriterPersona,
  generatePersonaPrompt,
  getWritersForCategory,
  type WriterPersona,
} from '../../lib/ai/writerPersonas';

/**
 * Writer Personas Test Suite
 *
 * Tests for the AI writing team architecture:
 * - Persona selection based on industry/tone
 * - Unique signature traits per writer
 * - Prompt generation with persona context
 * - No generic/repetitive phrases
 */

describe('Writer Personas: Team Structure', () => {
  describe('Team Hierarchy', () => {
    it('should have 1 director', () => {
      expect(CONTENT_DIRECTOR).toBeDefined();
      expect(CONTENT_DIRECTOR.id).toBe('director_phoenix');
    });

    it('should have 5 managers', () => {
      expect(CONTENT_MANAGERS.length).toBe(5);
      const specialties = CONTENT_MANAGERS.map((m) => m.specialty);
      expect(specialties).toContain('Technology & SaaS');
      expect(specialties).toContain('Health & Wellness');
      expect(specialties).toContain('Business & Entrepreneurship');
    });

    it('should have at least 20 writers', () => {
      expect(WRITER_POOL.length).toBeGreaterThanOrEqual(20);
    });

    it('should have unique IDs for all personas', () => {
      const allIds = [
        CONTENT_DIRECTOR.id,
        ...CONTENT_MANAGERS.map((m) => m.id),
        ...WRITER_POOL.map((w) => w.id),
      ];
      const uniqueIds = new Set(allIds);
      expect(uniqueIds.size).toBe(allIds.length);
    });
  });

  describe('Persona Uniqueness', () => {
    it('should have unique signature traits per writer', () => {
      const allTraits = WRITER_POOL.flatMap((w) => w.signatureTraits);
      // Allow some overlap but check diversity
      const uniqueTraits = new Set(allTraits);
      expect(uniqueTraits.size).toBeGreaterThan(WRITER_POOL.length * 2);
    });

    it('should have different avoid patterns per writer', () => {
      const avoidPatterns = WRITER_POOL.map((w) => w.avoidPatterns.join('|'));
      // Each writer should have unique avoid patterns
      const uniquePatterns = new Set(avoidPatterns);
      expect(uniquePatterns.size).toBeGreaterThan(WRITER_POOL.length / 2);
    });

    it('should have varied opening styles', () => {
      const openingStyles = WRITER_POOL.flatMap((w) => w.openingStyles);
      // No generic openers allowed
      const genericOpeners = ['In this article', 'Welcome to', 'Today we will'];
      openingStyles.forEach((style) => {
        genericOpeners.forEach((generic) => {
          expect(style.toLowerCase()).not.toContain(generic.toLowerCase());
        });
      });
    });
  });
});

describe('Writer Personas: Selection Algorithm', () => {
  it('should select tech writer for technology industry', () => {
    const writer = selectWriterPersona('blog', 'API Documentation');
    expect(writer.specialty.toLowerCase()).toContain('api');
  });

  it('should select health writer for medical content', () => {
    const writer = selectWriterPersona('service', 'medical aesthetics');
    expect(
      ['health', 'medical', 'wellness', 'aesthetics'].some((term) =>
        writer.specialty.toLowerCase().includes(term)
      )
    ).toBe(true);
  });

  it('should respect tone preference', () => {
    const formalWriter = selectWriterPersona('blog', 'legal', 'formal');
    expect(formalWriter.tone).toBe('formal');
  });

  it('should return a writer even for unknown industry', () => {
    const writer = selectWriterPersona('blog', 'underwater basket weaving');
    expect(writer).toBeDefined();
    expect(writer.id).toMatch(/^writer_/);
  });
});

describe('Writer Personas: Prompt Generation', () => {
  let testWriter: WriterPersona;

  beforeEach(() => {
    testWriter = WRITER_POOL.find((w) => w.id === 'writer_001')!;
  });

  it('should include persona name and specialty', () => {
    const prompt = generatePersonaPrompt(testWriter, 'REST API Guide', 'how_to');
    expect(prompt).toContain(testWriter.name);
    expect(prompt).toContain(testWriter.specialty);
  });

  it('should include all signature traits', () => {
    const prompt = generatePersonaPrompt(testWriter, 'any topic', 'blog');
    testWriter.signatureTraits.forEach((trait) => {
      expect(prompt).toContain(trait);
    });
  });

  it('should include avoid patterns', () => {
    const prompt = generatePersonaPrompt(testWriter, 'any topic', 'blog');
    testWriter.avoidPatterns.forEach((pattern) => {
      expect(prompt).toContain(pattern);
    });
  });

  it('should include opening and closing style options', () => {
    const prompt = generatePersonaPrompt(testWriter, 'any topic', 'blog');
    expect(prompt).toContain('OPENING STYLE OPTIONS');
    expect(prompt).toContain('CLOSING STYLE OPTIONS');
  });
});

describe('Writer Personas: Category Matching', () => {
  it('should return relevant writers for technology category', () => {
    const techWriters = getWritersForCategory('technology');
    expect(techWriters.length).toBeGreaterThan(0);
    // Tech writers should have technical or advanced vocabulary
    techWriters.forEach((w) => {
      expect(['technical', 'advanced']).toContain(w.vocabularyLevel);
    });
  });

  it('should return health writers for wellness category', () => {
    const healthWriters = getWritersForCategory('health');
    expect(healthWriters.length).toBeGreaterThan(0);
  });

  it('should return default set for unknown category', () => {
    const writers = getWritersForCategory('alien_technology');
    expect(writers.length).toBeGreaterThanOrEqual(5);
  });
});

describe('Writer Personas: Anti-Generic Patterns', () => {
  const BANNED_PHRASES = [
    'In this article',
    'In this comprehensive guide',
    'Without further ado',
    "Let's dive in",
    'As we all know',
    'It is important to note',
    'In conclusion',
    'To sum up',
    'At the end of the day',
    'When it comes to',
  ];

  it('should not include banned phrases in signature traits', () => {
    WRITER_POOL.forEach((writer) => {
      writer.signatureTraits.forEach((trait) => {
        BANNED_PHRASES.forEach((banned) => {
          expect(trait.toLowerCase()).not.toContain(banned.toLowerCase());
        });
      });
    });
  });

  it('should have banned phrases in avoidPatterns', () => {
    // At least some writers should explicitly ban generic phrases
    const allAvoidPatterns = WRITER_POOL.flatMap((w) => w.avoidPatterns);
    const bannedCount = BANNED_PHRASES.filter((banned) =>
      allAvoidPatterns.some((pattern) =>
        pattern.toLowerCase().includes(banned.toLowerCase().split(' ')[0])
      )
    ).length;
    expect(bannedCount).toBeGreaterThan(0);
  });
});
