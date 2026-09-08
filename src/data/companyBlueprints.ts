export interface BlueprintSection {
  id: string;
  name: string;
  questionCount: number;
  minutes: number;
  difficultyMix: { easy: number; medium: number; hard: number };
  archetypes: string[];
  description: string;
}

export interface CompanyBlueprint {
  id: string;
  displayName: string;
  testName: string;
  totalDurationMinutes: number;
  cutoffPercentage: number;
  negativeMarking: boolean;
  notes: string;
  sections: BlueprintSection[];
}

export const COMPANY_BLUEPRINTS: Record<string, CompanyBlueprint> = {
  tcs: {
    id: 'tcs',
    displayName: 'TCS',
    testName: 'TCS NQT (National Qualifier Test)',
    totalDurationMinutes: 90,
    cutoffPercentage: 70,
    negativeMarking: false,
    notes:
      'Section-locked and adaptive. You cannot return to a previous section. Speed matters as much as accuracy — the Numerical section is the usual elimination point.',
    sections: [
      {
        id: 'numerical',
        name: 'Numerical Ability',
        questionCount: 20,
        minutes: 25,
        difficultyMix: { easy: 6, medium: 10, hard: 4 },
        archetypes: [
          'time speed and distance',
          'percentages and profit-loss',
          'ratio and proportion',
          'number system and divisibility',
          'permutation, combination and probability',
          'mensuration and geometry',
          'averages, mixtures and allegation',
        ],
        description: 'Quantitative aptitude under tight time pressure.',
      },
      {
        id: 'verbal',
        name: 'Verbal Ability',
        questionCount: 15,
        minutes: 15,
        difficultyMix: { easy: 6, medium: 7, hard: 2 },
        archetypes: [
          'reading comprehension inference',
          'sentence correction and grammar',
          'para jumbles',
          'synonyms and antonyms in context',
          'fill in the blanks with prepositions and articles',
        ],
        description: 'English usage, comprehension and sentence structure.',
      },
      {
        id: 'reasoning',
        name: 'Reasoning Ability',
        questionCount: 20,
        minutes: 25,
        difficultyMix: { easy: 6, medium: 10, hard: 4 },
        archetypes: [
          'seating arrangement',
          'blood relations',
          'syllogism',
          'data interpretation from tables and charts',
          'coding-decoding',
          'series completion',
          'statement and conclusion',
        ],
        description: 'Logical and analytical reasoning puzzles.',
      },
      {
        id: 'programming-logic',
        name: 'Programming Logic',
        questionCount: 10,
        minutes: 15,
        difficultyMix: { easy: 3, medium: 5, hard: 2 },
        archetypes: [
          'output prediction for C snippets with pointers',
          'time complexity of loops',
          'data structure selection',
          'recursion trace',
          'OOP concept identification',
          'compilation and runtime error identification',
        ],
        description: 'Language-agnostic coding logic and output prediction.',
      },
      {
        id: 'coding',
        name: 'Hands-On Coding',
        questionCount: 10,
        minutes: 10,
        difficultyMix: { easy: 4, medium: 4, hard: 2 },
        archetypes: [
          'string manipulation approach',
          'array traversal logic',
          'pattern printing logic',
          'choosing the correct loop or condition to complete a program',
          'debugging a broken snippet',
        ],
        description: 'Applied coding logic in a multiple-choice format.',
      },
    ],
  },

  infosys: {
    id: 'infosys',
    displayName: 'Infosys',
    testName: 'Infosys Specialist / SE Assessment',
    totalDurationMinutes: 100,
    cutoffPercentage: 65,
    negativeMarking: false,
    notes:
      'Reasoning-heavy with a distinctive puzzle section. No negative marking, so never leave a question blank. Pseudocode questions decide the Power Programmer shortlist.',
    sections: [
      {
        id: 'reasoning',
        name: 'Logical Reasoning',
        questionCount: 15,
        minutes: 25,
        difficultyMix: { easy: 3, medium: 8, hard: 4 },
        archetypes: [
          'arrangement and pattern puzzles',
          'data sufficiency',
          'visual and figure series',
          'clocks and calendars',
          'direction sense',
        ],
        description: 'Infosys-style logic with heavier puzzle weighting.',
      },
      {
        id: 'quantitative',
        name: 'Quantitative Aptitude',
        questionCount: 10,
        minutes: 35,
        difficultyMix: { easy: 2, medium: 5, hard: 3 },
        archetypes: [
          'time and work',
          'probability',
          'number series',
          'profit and loss',
          'algebra and equations',
          'data interpretation',
        ],
        description: 'Fewer questions, but noticeably harder than TCS.',
      },
      {
        id: 'pseudocode',
        name: 'Pseudocode',
        questionCount: 5,
        minutes: 10,
        difficultyMix: { easy: 1, medium: 3, hard: 1 },
        archetypes: [
          'trace the pseudocode output',
          'identify the loop invariant',
          'complete the missing pseudocode line',
          'complexity of a pseudocode block',
        ],
        description: 'Read, trace and reason about language-neutral pseudocode.',
      },
      {
        id: 'puzzle',
        name: 'Puzzle Solving',
        questionCount: 4,
        minutes: 10,
        difficultyMix: { easy: 1, medium: 2, hard: 1 },
        archetypes: [
          'classic interview puzzles',
          'weighing and measuring puzzles',
          'river crossing and logic grid puzzles',
          'probability puzzles',
        ],
        description: 'The section most candidates underprepare for.',
      },
      {
        id: 'verbal',
        name: 'Verbal Ability',
        questionCount: 20,
        minutes: 20,
        difficultyMix: { easy: 7, medium: 10, hard: 3 },
        archetypes: [
          'reading comprehension',
          'error spotting',
          'sentence completion',
          'para summary',
        ],
        description: 'Standard English proficiency assessment.',
      },
    ],
  },

  wipro: {
    id: 'wipro',
    displayName: 'Wipro',
    testName: 'Wipro Elite NTH',
    totalDurationMinutes: 138,
    cutoffPercentage: 60,
    negativeMarking: false,
    notes:
      'Includes a written communication essay round that many candidates ignore — it is scored and it matters. Sections are time-locked individually.',
    sections: [
      {
        id: 'aptitude',
        name: 'Quantitative Aptitude',
        questionCount: 16,
        minutes: 16,
        difficultyMix: { easy: 5, medium: 8, hard: 3 },
        archetypes: [
          'percentages and averages',
          'time speed distance',
          'simple and compound interest',
          'ratio and mixtures',
          'number theory basics',
        ],
        description: 'One minute per question — pure speed maths.',
      },
      {
        id: 'logical',
        name: 'Logical Reasoning',
        questionCount: 14,
        minutes: 14,
        difficultyMix: { easy: 4, medium: 7, hard: 3 },
        archetypes: [
          'coding decoding',
          'analogy and classification',
          'seating arrangement',
          'logical deduction',
          'flowchart interpretation',
        ],
        description: 'Standard reasoning with flowchart-style questions.',
      },
      {
        id: 'english',
        name: 'English Verbal',
        questionCount: 12,
        minutes: 12,
        difficultyMix: { easy: 5, medium: 6, hard: 1 },
        archetypes: [
          'reading comprehension',
          'vocabulary in context',
          'grammar correction',
          'sentence rearrangement',
        ],
        description: 'Verbal ability, moderate difficulty.',
      },
      {
        id: 'technical',
        name: 'Technical MCQ',
        questionCount: 16,
        minutes: 20,
        difficultyMix: { easy: 4, medium: 8, hard: 4 },
        archetypes: [
          'C and Java output prediction',
          'DBMS and SQL queries',
          'operating system concepts',
          'computer networks basics',
          'data structures operations',
        ],
        description: 'Core CS fundamentals across five subjects.',
      },
      {
        id: 'coding',
        name: 'Coding Logic',
        questionCount: 10,
        minutes: 30,
        difficultyMix: { easy: 3, medium: 5, hard: 2 },
        archetypes: [
          'algorithm approach selection',
          'edge-case identification',
          'complexity trade-offs',
          'debugging a failing test case',
        ],
        description: 'Two coding problems in the real test — practised here as applied logic.',
      },
      {
        id: 'written-communication',
        name: 'Written Communication',
        questionCount: 8,
        minutes: 20,
        difficultyMix: { easy: 3, medium: 4, hard: 1 },
        archetypes: [
          'essay structure and coherence',
          'identifying the strongest topic sentence',
          'tone and register for business writing',
          'concise rewriting',
        ],
        description: 'Wipro scores your written English — most candidates skip preparing this.',
      },
    ],
  },

  accenture: {
    id: 'accenture',
    displayName: 'Accenture',
    testName: 'Accenture Cognitive & Technical Assessment',
    totalDurationMinutes: 90,
    cutoffPercentage: 65,
    negativeMarking: false,
    notes:
      'Cognitive section is heavily time-pressured with a large question count. Communication assessment (MS Office and pronunciation) is a separate qualifying gate.',
    sections: [
      {
        id: 'cognitive',
        name: 'Cognitive Ability',
        questionCount: 25,
        minutes: 25,
        difficultyMix: { easy: 9, medium: 12, hard: 4 },
        archetypes: [
          'verbal ability and comprehension',
          'critical reasoning',
          'numerical ability',
          'abstract and pattern reasoning',
        ],
        description: 'Broad cognitive screen — accuracy under speed.',
      },
      {
        id: 'technical',
        name: 'Technical Assessment',
        questionCount: 20,
        minutes: 25,
        difficultyMix: { easy: 6, medium: 10, hard: 4 },
        archetypes: [
          'common applications and MS Office concepts',
          'fundamentals of networking and security',
          'pseudocode output',
          'cloud and emerging technology awareness',
          'DBMS and SQL basics',
        ],
        description: 'Wider and shallower than other companies — includes MS Office and cloud awareness.',
      },
      {
        id: 'coding',
        name: 'Coding',
        questionCount: 10,
        minutes: 20,
        difficultyMix: { easy: 4, medium: 4, hard: 2 },
        archetypes: [
          'string and array problem approach',
          'choosing the correct data structure',
          'code completion',
          'output prediction in Java or Python',
        ],
        description: 'Two coding problems in the real test, in your chosen language.',
      },
      {
        id: 'communication',
        name: 'Communication Assessment',
        questionCount: 10,
        minutes: 20,
        difficultyMix: { easy: 5, medium: 4, hard: 1 },
        archetypes: [
          'sentence mastery and grammar',
          'professional email etiquette',
          'listening comprehension style questions',
          'vocabulary appropriateness',
        ],
        description: 'A qualifying gate at Accenture, not a formality.',
      },
    ],
  },

  cognizant: {
    id: 'cognizant',
    displayName: 'Cognizant',
    testName: 'Cognizant GenC / GenC Next',
    totalDurationMinutes: 100,
    cutoffPercentage: 60,
    negativeMarking: false,
    notes:
      'Automata Fix — repairing broken code rather than writing it — is the section that separates GenC from GenC Next candidates.',
    sections: [
      {
        id: 'aptitude',
        name: 'Quantitative Aptitude',
        questionCount: 16,
        minutes: 20,
        difficultyMix: { easy: 5, medium: 8, hard: 3 },
        archetypes: [
          'arithmetic and percentages',
          'time and work',
          'probability and permutations',
          'data interpretation',
          'number series',
        ],
        description: 'Moderate difficulty quantitative screen.',
      },
      {
        id: 'logical',
        name: 'Logical Reasoning',
        questionCount: 14,
        minutes: 20,
        difficultyMix: { easy: 4, medium: 7, hard: 3 },
        archetypes: [
          'puzzles and arrangements',
          'syllogisms',
          'statement and assumption',
          'visual reasoning',
          'decision making',
        ],
        description: 'Logic and decision-making scenarios.',
      },
      {
        id: 'verbal',
        name: 'Verbal Ability',
        questionCount: 15,
        minutes: 20,
        difficultyMix: { easy: 6, medium: 7, hard: 2 },
        archetypes: [
          'reading comprehension',
          'grammar and error correction',
          'contextual vocabulary',
          'sentence ordering',
        ],
        description: 'Standard verbal assessment.',
      },
      {
        id: 'automata-fix',
        name: 'Automata Fix (Code Debugging)',
        questionCount: 10,
        minutes: 25,
        difficultyMix: { easy: 3, medium: 5, hard: 2 },
        archetypes: [
          'find the bug in a C or Java function',
          'fix an off-by-one error',
          'correct a wrong condition or operator',
          'repair a broken recursion base case',
          'identify why a test case fails',
        ],
        description: 'Cognizant\'s signature round — you debug, you do not write from scratch.',
      },
      {
        id: 'technical',
        name: 'Computer Fundamentals',
        questionCount: 15,
        minutes: 15,
        difficultyMix: { easy: 5, medium: 7, hard: 3 },
        archetypes: [
          'data structures and algorithms',
          'DBMS and SQL',
          'operating systems',
          'OOP concepts',
          'networking basics',
        ],
        description: 'Core CS knowledge check.',
      },
    ],
  },

  capgemini: {
    id: 'capgemini',
    displayName: 'Capgemini',
    testName: 'Capgemini Exceller / Game-Based Assessment',
    totalDurationMinutes: 95,
    cutoffPercentage: 60,
    negativeMarking: false,
    notes:
      'Uses game-based cognitive assessment plus a behavioural round. Pseudocode is heavily weighted and English comprehension is unusually long.',
    sections: [
      {
        id: 'game-aptitude',
        name: 'Game-Based Aptitude',
        questionCount: 15,
        minutes: 20,
        difficultyMix: { easy: 5, medium: 7, hard: 3 },
        archetypes: [
          'grid challenge and spatial reasoning',
          'motion challenge and pattern tracking',
          'digit challenge and working memory',
          'switch challenge and rule-switching logic',
        ],
        description: 'Cognitive puzzles modelled on Capgemini\'s game rounds.',
      },
      {
        id: 'pseudocode',
        name: 'Pseudocode',
        questionCount: 20,
        minutes: 25,
        difficultyMix: { easy: 6, medium: 10, hard: 4 },
        archetypes: [
          'trace pseudocode output',
          'loop and array pseudocode',
          'recursion in pseudocode',
          'complete the missing statement',
          'complexity of the given pseudocode',
        ],
        description: 'The highest-weighted section at Capgemini.',
      },
      {
        id: 'english',
        name: 'English Comprehension',
        questionCount: 20,
        minutes: 25,
        difficultyMix: { easy: 7, medium: 10, hard: 3 },
        archetypes: [
          'long passage comprehension',
          'inference and tone',
          'vocabulary in context',
          'grammar and syntax',
        ],
        description: 'Longer passages than most other company tests.',
      },
      {
        id: 'behavioural',
        name: 'Behavioural Competency',
        questionCount: 15,
        minutes: 15,
        difficultyMix: { easy: 8, medium: 6, hard: 1 },
        archetypes: [
          'situational judgement at work',
          'teamwork and conflict scenarios',
          'ownership and accountability',
          'client-facing professionalism',
        ],
        description: 'Consistency matters more than cleverness here.',
      },
      {
        id: 'technical',
        name: 'Technical MCQ',
        questionCount: 10,
        minutes: 10,
        difficultyMix: { easy: 4, medium: 4, hard: 2 },
        archetypes: [
          'DBMS and SQL',
          'operating systems',
          'data structures',
          'cloud and web basics',
        ],
        description: 'Light technical layer for the Exceller track.',
      },
    ],
  },
};

export const COMPANY_BLUEPRINT_LIST: CompanyBlueprint[] = [
  COMPANY_BLUEPRINTS.tcs,
  COMPANY_BLUEPRINTS.infosys,
  COMPANY_BLUEPRINTS.wipro,
  COMPANY_BLUEPRINTS.accenture,
  COMPANY_BLUEPRINTS.cognizant,
  COMPANY_BLUEPRINTS.capgemini,
];

export function getBlueprint(id?: string): CompanyBlueprint | undefined {
  if (!id) return undefined;
  return COMPANY_BLUEPRINTS[id.toLowerCase()];
}

export function totalQuestions(bp: CompanyBlueprint): number {
  return bp.sections.reduce((sum, s) => sum + s.questionCount, 0);
}
