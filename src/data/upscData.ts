// UPSC Exam Data and Configuration

export interface UPSCSubject {
  id: string;
  title: string;
  description: string;
  icon: string;
  topics: string[];
  questionCount: number;
  timeLimit: number;
  weightage: 'high' | 'medium' | 'low';
  color: string;
}

export interface UPSCExamStage {
  id: string;
  title: string;
  description: string;
  duration: string;
  papers: string[];
  passingCriteria: string;
}

// UPSC Civil Services Exam Stages
export const UPSC_EXAM_STAGES: UPSCExamStage[] = [
  {
    id: 'prelims',
    title: 'Preliminary Examination',
    description: 'Objective type screening test with 2 papers - GS Paper I and CSAT Paper II',
    duration: '2 hours per paper',
    papers: ['General Studies Paper I (200 marks)', 'CSAT Paper II (200 marks)'],
    passingCriteria: 'Qualifying in nature, only GS Paper I marks counted for cutoff'
  },
  {
    id: 'mains',
    title: 'Main Examination',
    description: 'Written examination with 9 papers covering Essay, GS, and Optional subjects',
    duration: '3 hours per paper',
    papers: [
      'Essay (250 marks)',
      'GS Paper I - Heritage & Culture (250 marks)',
      'GS Paper II - Governance & Polity (250 marks)',
      'GS Paper III - Economy & Environment (250 marks)',
      'GS Paper IV - Ethics (250 marks)',
      'Optional Paper I & II (500 marks)',
      'Language Papers (Qualifying)'
    ],
    passingCriteria: 'Based on aggregate marks, top candidates qualify for Interview'
  },
  {
    id: 'interview',
    title: 'Personality Test',
    description: 'Face-to-face interview assessing personality, mental alertness, and suitability',
    duration: '30-45 minutes',
    papers: ['Personal Interview (275 marks)'],
    passingCriteria: 'Final merit list based on Mains + Interview marks'
  }
];

// UPSC Subjects for Quiz Topics
export const UPSC_SUBJECTS: UPSCSubject[] = [
  {
    id: 'upsc-polity',
    title: 'Indian Polity & Governance',
    description: 'Constitution, Parliament, Judiciary, Federalism, Panchayati Raj, Public Policy',
    icon: 'Scale',
    topics: [
      'Constitutional Framework',
      'Fundamental Rights & Duties',
      'Parliament & State Legislature',
      'Judiciary System',
      'Federalism & Centre-State Relations',
      'Panchayati Raj & Urban Governance',
      'Constitutional Bodies',
      'Election Commission & Electoral Reforms'
    ],
    questionCount: 15,
    timeLimit: 30,
    weightage: 'high',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'upsc-history',
    title: 'Indian History',
    description: 'Ancient, Medieval, Modern India, Art & Culture, Freedom Movement',
    icon: 'BookOpen',
    topics: [
      'Ancient India - Indus Valley to Gupta',
      'Medieval India - Delhi Sultanate to Mughals',
      'Modern India - British Rule',
      'Freedom Struggle & Movements',
      'Art & Architecture',
      'Indian Culture & Heritage',
      'Post-Independence India',
      'Important Personalities'
    ],
    questionCount: 15,
    timeLimit: 30,
    weightage: 'high',
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'upsc-geography',
    title: 'Indian & World Geography',
    description: 'Physical, Economic, Human Geography, Environment, Climate',
    icon: 'Globe',
    topics: [
      'Physical Geography of India',
      'Climate & Monsoons',
      'Natural Resources & Distribution',
      'Agricultural Geography',
      'Industrial Geography',
      'Human Geography & Demography',
      'World Physical Geography',
      'Environmental Geography'
    ],
    questionCount: 15,
    timeLimit: 30,
    weightage: 'high',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'upsc-economy',
    title: 'Indian Economy',
    description: 'Macroeconomics, Planning, Banking, Budget, International Trade',
    icon: 'TrendingUp',
    topics: [
      'Economic Planning in India',
      'Monetary & Fiscal Policy',
      'Banking & Financial Institutions',
      'Union Budget & Taxation',
      'Agriculture & Food Security',
      'Industrial Policy',
      'International Trade & BOP',
      'Government Schemes & Programs'
    ],
    questionCount: 15,
    timeLimit: 30,
    weightage: 'high',
    color: 'from-purple-500 to-violet-600'
  },
  {
    id: 'upsc-science',
    title: 'Science & Technology',
    description: 'Current S&T developments, Space, Biotech, IT, Defense Technology',
    icon: 'Atom',
    topics: [
      'Space Technology & ISRO',
      'Defense Technology & DRDO',
      'Biotechnology & Health',
      'Information Technology & AI',
      'Nuclear Energy & Policy',
      'Science in Everyday Life',
      'Recent Scientific Developments',
      'Environmental Technology'
    ],
    questionCount: 15,
    timeLimit: 25,
    weightage: 'medium',
    color: 'from-cyan-500 to-teal-600'
  },
  {
    id: 'upsc-environment',
    title: 'Environment & Ecology',
    description: 'Biodiversity, Climate Change, Conservation, Pollution, Sustainable Development',
    icon: 'Leaf',
    topics: [
      'Biodiversity & Conservation',
      'Climate Change & Global Warming',
      'Environmental Pollution',
      'Wildlife Protection',
      'Environmental Laws & Policies',
      'International Environmental Agreements',
      'Sustainable Development',
      'Disaster Management'
    ],
    questionCount: 15,
    timeLimit: 25,
    weightage: 'high',
    color: 'from-lime-500 to-green-600'
  },
  {
    id: 'upsc-csat',
    title: 'CSAT (Aptitude)',
    description: 'Comprehension, Logical Reasoning, Analytical Ability, Decision Making, Math',
    icon: 'Brain',
    topics: [
      'Reading Comprehension',
      'Logical Reasoning',
      'Analytical Ability',
      'Decision Making',
      'Basic Numeracy',
      'Data Interpretation',
      'Mental Ability',
      'Problem Solving'
    ],
    questionCount: 20,
    timeLimit: 40,
    weightage: 'medium',
    color: 'from-rose-500 to-pink-600'
  },
  {
    id: 'upsc-current-affairs',
    title: 'Current Affairs',
    description: 'National & International events, Government Schemes, Sports, Awards',
    icon: 'Newspaper',
    topics: [
      'National Events & Politics',
      'International Relations',
      'Government Schemes & Policies',
      'Economy & Business News',
      'Science & Technology Updates',
      'Sports & Awards',
      'Important Appointments',
      'Summits & Conferences'
    ],
    questionCount: 15,
    timeLimit: 30,
    weightage: 'high',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'upsc-ethics',
    title: 'Ethics & Integrity',
    description: 'Ethics in Public Administration, Emotional Intelligence, Case Studies',
    icon: 'Heart',
    topics: [
      'Ethics & Human Interface',
      'Attitude & Aptitude',
      'Emotional Intelligence',
      'Contributions of Moral Thinkers',
      'Public Service Values',
      'Probity in Governance',
      'Case Studies',
      'Corporate Governance'
    ],
    questionCount: 15,
    timeLimit: 30,
    weightage: 'high',
    color: 'from-violet-500 to-purple-600'
  }
];

// UPSC Important Statistics
export const UPSC_STATS = {
  totalVacancies2024: 1056,
  applicants2024: 1300000,
  selectionRatio: '0.08%',
  examConductedBy: 'Union Public Service Commission',
  eligibleAge: '21-32 years (with relaxations)',
  attempts: '6 for General, 9 for OBC, Unlimited for SC/ST',
  qualifications: 'Graduate in any discipline from recognized university'
};

// UPSC Important Dates (Sample - can be updated annually)
export const UPSC_IMPORTANT_DATES = [
  { event: 'Notification Release', date: 'February', status: 'upcoming' },
  { event: 'Application Deadline', date: 'March', status: 'upcoming' },
  { event: 'Prelims Examination', date: 'May/June', status: 'upcoming' },
  { event: 'Prelims Result', date: 'July', status: 'upcoming' },
  { event: 'Mains Examination', date: 'September', status: 'upcoming' },
  { event: 'Mains Result', date: 'December', status: 'upcoming' },
  { event: 'Interview/Personality Test', date: 'Jan-April', status: 'upcoming' },
  { event: 'Final Result', date: 'May', status: 'upcoming' }
];

// Previous Year Cutoffs (Sample data)
export const UPSC_CUTOFFS = {
  general: { prelims: 92.51, mains: 745, interview: 914 },
  obc: { prelims: 84.29, mains: 706, interview: 865 },
  sc: { prelims: 77.71, mains: 706, interview: 849 },
  st: { prelims: 72.84, mains: 695, interview: 831 },
  ews: { prelims: 85.71, mains: 718, interview: 870 }
};
