import {
  Code2,
  Cpu,
  BookOpen,
  Brain,
  Radio,
  CircuitBoard,
  Network,
  Database,
  Server,
  Sigma,
  Wrench,
  Briefcase,
  Users,
  FileText,
  type LucideIcon,
} from 'lucide-react';

export type Branch = 'cse' | 'ece';

export type TaskType = 'dsa' | 'core' | 'aptitude' | 'mock' | 'soft';

export interface PlacementTask {
  id: string;
  type: TaskType;
  title: string;
  estMinutes: number;
  topicId?: string; // optional link to /quiz/:topicId
}

export interface RoadmapPhase {
  id: string;
  title: string;
  weeks: string;
  description: string;
  outcomes: string[];
}

export interface PlacementSubject {
  id: string;
  name: string;
  icon: LucideIcon;
  topicId?: string;
  blurb: string;
}

export interface BranchConfig {
  branch: Branch;
  label: string;
  tagline: string;
  icon: LucideIcon;
  accent: string; // tailwind text color class
  companies: string[];
  roadmap: RoadmapPhase[];
  subjects: PlacementSubject[];
  todaysPlan: PlacementTask[];
  resumeChecklist: string[];
  projectIdeas: string[];
}

export const PLACEMENT_BRANCHES: Record<Branch, BranchConfig> = {
  cse: {
    branch: 'cse',
    label: 'Computer Science (CSE / IT)',
    tagline: 'DSA, CS fundamentals, system design — built into a 90-day rhythm.',
    icon: Code2,
    accent: 'text-primary-glow',
    companies: [
      'Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Wipro',
      'Accenture', 'Cognizant', 'Capgemini', 'Deloitte',
    ],
    roadmap: [
      {
        id: 'foundations',
        title: 'Foundations',
        weeks: 'Week 1–2',
        description: 'Programming refresh in C++/Java/Python + Git basics.',
        outcomes: ['Pick primary language', 'Solve 30 warm-up problems', 'Set up GitHub profile'],
      },
      {
        id: 'dsa',
        title: 'DSA Sprint',
        weeks: 'Week 3–6',
        description: 'Arrays, Strings, LinkedList, Trees, Graphs, DP — pattern by pattern.',
        outcomes: ['150 LeetCode-style problems', 'Two-pointer, sliding window, recursion mastery', 'Weekly contest participation'],
      },
      {
        id: 'core',
        title: 'CS Core',
        weeks: 'Week 7–9',
        description: 'OS, DBMS, Computer Networks, OOP — interview-grade.',
        outcomes: ['Crack 40 OS/DBMS MCQs', 'Build mini DBMS project', 'Explain TCP/IP in 2 min'],
      },
      {
        id: 'sysdesign',
        title: 'System Design Lite',
        weeks: 'Week 10',
        description: 'HLD basics — URL shortener, rate limiter, chat app.',
        outcomes: ['Draw 3 system diagrams', 'Understand caching + load balancing'],
      },
      {
        id: 'aptitude',
        title: 'Aptitude & Verbal',
        weeks: 'Week 11',
        description: 'Quant, LR, verbal for service-company rounds (TCS NQT, Infy).',
        outcomes: ['Score 80%+ on mock aptitude', 'Time-bound practice'],
      },
      {
        id: 'mocks',
        title: 'Mock Interviews',
        weeks: 'Week 12',
        description: 'Technical + HR mocks, resume polish, behavioural prep.',
        outcomes: ['5 mock interviews', 'STAR-format answers ready'],
      },
    ],
    subjects: [
      { id: 'dsa', name: 'Data Structures & Algorithms', icon: Brain, topicId: 'dsa', blurb: 'Patterns, not problems.' },
      { id: 'os', name: 'Operating Systems', icon: Server, topicId: 'os', blurb: 'Processes, threads, scheduling.' },
      { id: 'dbms', name: 'Databases (DBMS + SQL)', icon: Database, topicId: 'dbms', blurb: 'Joins, indexes, normalisation.' },
      { id: 'cn', name: 'Computer Networks', icon: Network, topicId: 'networking', blurb: 'OSI, TCP/IP, HTTP, DNS.' },
      { id: 'oop', name: 'OOP & Design', icon: Code2, topicId: 'oop', blurb: 'SOLID, patterns, principles.' },
      { id: 'apti', name: 'Aptitude', icon: Sigma, topicId: 'aptitude', blurb: 'Quant + LR + verbal.' },
    ],
    todaysPlan: [
      { id: 't1', type: 'dsa', title: 'Solve 2 array problems (easy + medium)', estMinutes: 30 },
      { id: 't2', type: 'core', title: 'Read: Process vs Thread + 10 MCQs', estMinutes: 15 },
      { id: 't3', type: 'mock', title: 'Daily 10-MCQ mixed quiz', estMinutes: 10, topicId: 'dsa' },
    ],
    resumeChecklist: [
      'One-page, ATS-friendly format',
      '2–3 projects with measurable impact',
      'GitHub + LinkedIn links in header',
      'Skills section grouped by category',
      'Quantified achievements (numbers!)',
    ],
    projectIdeas: [
      'Full-stack URL shortener with analytics',
      'Real-time chat app (Socket.io / WebRTC)',
      'AI-powered resume reviewer',
      'Distributed cache implementation',
    ],
  },
  ece: {
    branch: 'ece',
    label: 'Electronics & Communication (ECE)',
    tagline: 'Core electronics + coding combo — for VLSI, embedded, and core IT roles.',
    icon: CircuitBoard,
    accent: 'text-primary-glow',
    companies: [
      'Qualcomm', 'Texas Instruments', 'Intel', 'Bosch', 'L&T',
      'ISRO', 'DRDO', 'TCS', 'Infosys', 'Wipro',
    ],
    roadmap: [
      {
        id: 'foundations',
        title: 'Foundations',
        weeks: 'Week 1–2',
        description: 'C programming refresh + basic Python for tooling.',
        outcomes: ['Strong on pointers & memory', 'Comfortable with embedded C idioms'],
      },
      {
        id: 'aptitude',
        title: 'Aptitude',
        weeks: 'Week 3–4',
        description: 'Quant, LR, verbal — required for every campus drive.',
        outcomes: ['90%+ on mock aptitude tests'],
      },
      {
        id: 'core',
        title: 'Core Electronics',
        weeks: 'Week 5–8',
        description: 'Digital, Analog, Signals & Systems, EMFT, Communication.',
        outcomes: ['Master Boolean & K-maps', 'Solve 50 signals problems', 'Explain AM/FM/PCM'],
      },
      {
        id: 'electives',
        title: 'Specialisation',
        weeks: 'Week 9–10',
        description: 'Pick a track: Embedded / VLSI / Networking / DSP.',
        outcomes: ['1 hands-on project in chosen track'],
      },
      {
        id: 'dsa',
        title: 'DSA Basics',
        weeks: 'Week 11',
        description: 'Enough DSA to clear coding rounds at IT services + product co.',
        outcomes: ['60 problems across arrays, strings, recursion'],
      },
      {
        id: 'mocks',
        title: 'Mock Interviews',
        weeks: 'Week 12',
        description: 'Technical (core + code) + HR rounds.',
        outcomes: ['5 mock interviews', 'Confident project walkthrough'],
      },
    ],
    subjects: [
      { id: 'digital', name: 'Digital Electronics', icon: CircuitBoard, blurb: 'Logic gates, FSMs, K-maps.' },
      { id: 'analog', name: 'Analog Electronics', icon: Cpu, blurb: 'BJT, MOSFET, op-amps.' },
      { id: 'signals', name: 'Signals & Systems', icon: Radio, blurb: 'Fourier, Laplace, Z-transform.' },
      { id: 'comm', name: 'Communication Systems', icon: Radio, blurb: 'AM/FM, digital comm, noise.' },
      { id: 'emft', name: 'EMFT', icon: Wrench, blurb: 'Maxwell, waves, transmission lines.' },
      { id: 'embedded', name: 'Embedded / Microcontrollers', icon: Cpu, blurb: '8051, ARM, peripherals.' },
      { id: 'dsa-ece', name: 'DSA (Coding Rounds)', icon: Brain, topicId: 'dsa', blurb: 'For IT + product roles.' },
      { id: 'apti-ece', name: 'Aptitude', icon: Sigma, topicId: 'aptitude', blurb: 'Quant + LR + verbal.' },
    ],
    todaysPlan: [
      { id: 't1', type: 'core', title: 'Digital Electronics: K-map worksheet (10 Qs)', estMinutes: 20 },
      { id: 't2', type: 'aptitude', title: 'Aptitude drill — 15 quant problems', estMinutes: 20 },
      { id: 't3', type: 'mock', title: 'Daily 10-MCQ ECE mixed quiz', estMinutes: 10 },
    ],
    resumeChecklist: [
      'Highlight core electronics projects (not just web/AI)',
      'Mention tools: MATLAB, Cadence, Xilinx, Keil, Proteus',
      'Internships at core companies / labs',
      'IEEE / technical paper publications if any',
      'Quantify: simulated, designed, tested...',
    ],
    projectIdeas: [
      'IoT-based home automation (ESP32)',
      'Line-following robot with PID control',
      '4-bit ALU design on FPGA',
      'Real-time signal denoising in MATLAB',
    ],
  },
};

export const PLACEMENT_BRANCH_LIST: BranchConfig[] = [
  PLACEMENT_BRANCHES.cse,
  PLACEMENT_BRANCHES.ece,
];

export const HR_QUESTIONS: string[] = [
  'Tell me about yourself.',
  'Why this company?',
  'Walk me through your strongest project.',
  'A time you handled conflict in a team.',
  'Where do you see yourself in 5 years?',
  'Strengths and weaknesses — be specific.',
  'Why should we hire you over other candidates?',
];

export const TASK_TYPE_META: Record<TaskType, { label: string; icon: LucideIcon }> = {
  dsa: { label: 'DSA', icon: Brain },
  core: { label: 'Core', icon: BookOpen },
  aptitude: { label: 'Aptitude', icon: Sigma },
  mock: { label: 'Mock', icon: Briefcase },
  soft: { label: 'Soft skills', icon: Users },
};

export const RESUME_ICON = FileText;

// ---------------- Daily task pools (rotated) ----------------
const CSE_POOL: PlacementTask[] = [
  { id: 'c-arr', type: 'dsa', title: 'Arrays: 2 problems (1 easy + 1 medium)', estMinutes: 30, topicId: 'dsa' },
  { id: 'c-str', type: 'dsa', title: 'Strings & sliding window: 2 problems', estMinutes: 30, topicId: 'dsa' },
  { id: 'c-ll', type: 'dsa', title: 'Linked List: reverse + cycle detection', estMinutes: 25, topicId: 'dsa' },
  { id: 'c-tree', type: 'dsa', title: 'Trees: traversals + 1 medium', estMinutes: 35, topicId: 'dsa' },
  { id: 'c-graph', type: 'dsa', title: 'Graphs: BFS / DFS template revision', estMinutes: 30, topicId: 'dsa' },
  { id: 'c-dp', type: 'dsa', title: 'DP: 1 classic problem (Knapsack/LCS)', estMinutes: 40, topicId: 'dsa' },
  { id: 'c-os1', type: 'core', title: 'OS: Process vs Thread + 10 MCQs', estMinutes: 15, topicId: 'os' },
  { id: 'c-os2', type: 'core', title: 'OS: Deadlocks & scheduling — 10 MCQs', estMinutes: 15, topicId: 'os' },
  { id: 'c-db1', type: 'core', title: 'DBMS: Joins & normalisation — 10 MCQs', estMinutes: 15, topicId: 'dbms' },
  { id: 'c-db2', type: 'core', title: 'SQL: write 5 queries (joins + aggregates)', estMinutes: 20, topicId: 'dbms' },
  { id: 'c-cn1', type: 'core', title: 'Networks: TCP vs UDP + 10 MCQs', estMinutes: 15, topicId: 'networking' },
  { id: 'c-cn2', type: 'core', title: 'HTTP, DNS, OSI model recap', estMinutes: 15, topicId: 'networking' },
  { id: 'c-oop', type: 'core', title: 'OOP: SOLID principles + 10 MCQs', estMinutes: 15, topicId: 'oop' },
  { id: 'c-apt1', type: 'aptitude', title: 'Quant: 15 problems (time-bound)', estMinutes: 20, topicId: 'aptitude' },
  { id: 'c-apt2', type: 'aptitude', title: 'Logical reasoning: 15 problems', estMinutes: 20, topicId: 'aptitude' },
  { id: 'c-mock', type: 'mock', title: 'Daily mixed mock quiz (10 Qs)', estMinutes: 12, topicId: 'dsa' },
  { id: 'c-soft', type: 'soft', title: 'Practice "Tell me about yourself" out loud', estMinutes: 10 },
  { id: 'c-soft2', type: 'soft', title: 'Write 1 STAR-format project story', estMinutes: 15 },
];

const ECE_POOL: PlacementTask[] = [
  { id: 'e-dig1', type: 'core', title: 'Digital: K-map worksheet (10 Qs)', estMinutes: 20 },
  { id: 'e-dig2', type: 'core', title: 'Digital: FSM design — 1 problem', estMinutes: 25 },
  { id: 'e-ana', type: 'core', title: 'Analog: BJT biasing — 5 problems', estMinutes: 25 },
  { id: 'e-mos', type: 'core', title: 'MOSFET small-signal model + 5 Qs', estMinutes: 25 },
  { id: 'e-sig1', type: 'core', title: 'Signals: Fourier — 5 problems', estMinutes: 30 },
  { id: 'e-sig2', type: 'core', title: 'Signals: Z-transform basics + 5 Qs', estMinutes: 25 },
  { id: 'e-comm', type: 'core', title: 'Communication: AM/FM theory + 10 MCQs', estMinutes: 20 },
  { id: 'e-emft', type: 'core', title: 'EMFT: Maxwell equations recap', estMinutes: 20 },
  { id: 'e-embed', type: 'core', title: 'Embedded C: 1 small program + concepts', estMinutes: 30 },
  { id: 'e-apt1', type: 'aptitude', title: 'Quant: 15 problems (time-bound)', estMinutes: 20, topicId: 'aptitude' },
  { id: 'e-apt2', type: 'aptitude', title: 'Logical reasoning: 15 problems', estMinutes: 20, topicId: 'aptitude' },
  { id: 'e-dsa1', type: 'dsa', title: 'DSA: Arrays — 2 easy problems', estMinutes: 25, topicId: 'dsa' },
  { id: 'e-dsa2', type: 'dsa', title: 'DSA: Recursion — 2 problems', estMinutes: 30, topicId: 'dsa' },
  { id: 'e-mock', type: 'mock', title: 'Daily 10-MCQ ECE mixed quiz', estMinutes: 12 },
  { id: 'e-soft', type: 'soft', title: 'Practice 1-min self introduction', estMinutes: 10 },
  { id: 'e-soft2', type: 'soft', title: 'Explain a core project in 90 seconds', estMinutes: 15 },
];

export const DAILY_POOLS: Record<Branch, PlacementTask[]> = {
  cse: CSE_POOL,
  ece: ECE_POOL,
};

export const WHY_BLURBS: Record<TaskType, string> = {
  dsa: 'DSA shows up in 90%+ of product-company coding rounds.',
  core: 'Core concepts are the #1 filter in technical interviews.',
  aptitude: 'Every campus drive (TCS, Infy, Wipro) starts with aptitude.',
  mock: 'Daily mocks build the muscle memory interviews demand.',
  soft: 'HR rounds reject more candidates than tech rounds do.',
};

// Deterministic daily plan — same day = same plan, rotates across days
export function getTodaysPlan(branch: Branch, intensity: 3 | 5 = 3, date: Date = new Date()): PlacementTask[] {
  const pool = DAILY_POOLS[branch];
  const dayNum = Math.floor(date.getTime() / 86400000); // days since epoch
  const types: TaskType[] = ['dsa', 'core', 'aptitude', 'mock', 'soft'];
  const pickFor = (type: TaskType, offset: number) => {
    const candidates = pool.filter((t) => t.type === type);
    if (candidates.length === 0) return null;
    return candidates[(dayNum + offset) % candidates.length];
  };
  const picks: PlacementTask[] = [];
  // Always include at least one DSA-ish + core + mock
  const order: TaskType[] = intensity === 5
    ? ['dsa', 'core', 'core', 'aptitude', 'mock']
    : ['dsa', 'core', 'mock'];
  // Branches with no real DSA pool fallback gracefully
  order.forEach((t, i) => {
    const task = pickFor(t, i) || pickFor('core', i) || pool[(dayNum + i) % pool.length];
    if (task && !picks.find((p) => p.id === task.id)) picks.push(task);
  });
  return picks;
}

export function pickDailyHR(date: Date = new Date()): string {
  const dayNum = Math.floor(date.getTime() / 86400000);
  return HR_QUESTIONS[dayNum % HR_QUESTIONS.length];
}

