export interface TopicWithPriority {
  name: string;
  priority: 'high' | 'medium' | 'low';
  description?: string;
  icon?: string;
}

export interface ProcessStep {
  step: string;
  description: string;
  tips?: string;
  duration?: string;
}

export interface QuestionPattern {
  type: string;
  frequency: 'common' | 'occasional' | 'rare';
  examples: string[];
}

export interface Requirement {
  text: string;
  mandatory: boolean;
}

export interface CompanyData {
  name: string;
  shortName: string;
  logo: string;
  tagline: string;
  description: string;
  hiringPattern: string;
  rolesOffered: string[];
  averageSalary: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: TopicWithPriority[];
  process: ProcessStep[];
  questionPatterns: QuestionPattern[];
  requirements: Requirement[];
  specialConditions?: string[];
  quizTopicId: string;
  resourceTags: string[];
}

export const companyData: Record<string, CompanyData> = {
  infosys: {
    name: 'Infosys',
    shortName: 'Infosys',
    logo: '🏢',
    tagline: 'Navigate your digital transformation',
    description: 'Infosys is a global leader in next-generation digital services and consulting, enabling clients in 46 countries to navigate their digital transformation. With over 300,000 employees, Infosys offers extensive career growth opportunities for freshers.',
    hiringPattern: 'Infosys conducts campus recruitment drives in Tier-1, Tier-2, and Tier-3 colleges. They hire in bulk for System Engineer and Power Programmer roles. Hiring peaks between August-December.',
    rolesOffered: ['System Engineer', 'Senior System Engineer', 'Power Programmer', 'Digital Specialist Engineer'],
    averageSalary: '₹3.6 - 9.5 LPA',
    difficulty: 'Medium',
    topics: [
      { name: 'Data Structures & Algorithms', priority: 'high', description: 'Arrays, Strings, Linked Lists, Trees, Sorting, Searching' },
      { name: 'SQL & Database Management', priority: 'high', description: 'Joins, Subqueries, Normalization, ACID properties' },
      { name: 'Programming Fundamentals', priority: 'high', description: 'Java/Python basics, OOPs concepts' },
      { name: 'Operating Systems', priority: 'medium', description: 'Process management, Memory management, Deadlocks' },
      { name: 'Computer Networks', priority: 'medium', description: 'OSI model, TCP/IP, HTTP, DNS' },
      { name: 'Aptitude & Logical Reasoning', priority: 'medium', description: 'Quantitative aptitude, Logical puzzles, Verbal ability' },
      { name: 'Pseudo Code', priority: 'low', description: 'Code tracing and output prediction' }
    ],
    process: [
      { step: 'Online Assessment', description: 'MCQs on aptitude, logical reasoning, verbal ability, and pseudo code', tips: 'Practice time management - 65 mins for 65 questions', duration: '65 mins' },
      { step: 'Coding Round', description: '2-3 coding problems of easy to medium difficulty', tips: 'Focus on DSA basics and code optimization', duration: '90 mins' },
      { step: 'Technical Interview', description: 'Core CS concepts, project discussion, and problem-solving', tips: 'Be thorough with your resume projects' },
      { step: 'HR Interview', description: 'Behavioral questions, company knowledge, and salary discussion', tips: 'Research Infosys values and recent news' }
    ],
    questionPatterns: [
      { type: 'MCQ - Aptitude', frequency: 'common', examples: ['Time & Work', 'Percentages', 'Profit & Loss', 'Number Series'] },
      { type: 'MCQ - Logical Reasoning', frequency: 'common', examples: ['Blood Relations', 'Coding-Decoding', 'Syllogisms', 'Arrangements'] },
      { type: 'Pseudo Code', frequency: 'common', examples: ['Output prediction', 'Error identification', 'Code completion'] },
      { type: 'Coding - DSA', frequency: 'common', examples: ['Array manipulation', 'String operations', 'Pattern printing'] },
      { type: 'Verbal Ability', frequency: 'occasional', examples: ['Reading comprehension', 'Para jumbles', 'Error spotting'] }
    ],
    requirements: [
      { text: '60% or above in 10th, 12th, and Graduation', mandatory: true },
      { text: 'No active backlogs at the time of joining', mandatory: true },
      { text: 'Maximum 1 year gap in education', mandatory: true },
      { text: 'B.E/B.Tech/M.E/M.Tech/MCA/M.Sc from recognized university', mandatory: true },
      { text: 'Strong communication skills', mandatory: false }
    ],
    specialConditions: ['Bond: 1 year for System Engineer', 'Training in Mysore campus for 3-6 months'],
    quizTopicId: 'infosys-prep',
    resourceTags: ['aptitude', 'java', 'sql', 'dsa']
  },
  tcs: {
    name: 'Tata Consultancy Services',
    shortName: 'TCS',
    logo: '🏛️',
    tagline: 'Building on Belief',
    description: 'TCS is an Indian multinational IT services and consulting company headquartered in Mumbai. It is part of the Tata Group and is one of the largest IT employers in India with over 600,000 employees.',
    hiringPattern: 'TCS conducts the National Qualifier Test (NQT) multiple times a year. They offer three tracks: Ninja (3.36 LPA), Digital (7 LPA), and Prime (9 LPA) based on performance.',
    rolesOffered: ['Assistant System Engineer (Ninja)', 'Digital Specialist (Digital)', 'Prime Hire (Prime)'],
    averageSalary: '₹3.36 - 9 LPA',
    difficulty: 'Medium',
    topics: [
      { name: 'Quantitative Aptitude', priority: 'high', description: 'Number system, Algebra, Geometry, Arithmetic' },
      { name: 'Programming Logic', priority: 'high', description: 'C/Java basics, Flowcharts, Pseudo code' },
      { name: 'Data Structures', priority: 'high', description: 'Arrays, Strings, Linked Lists, Stacks, Queues' },
      { name: 'SQL & Database', priority: 'medium', description: 'Basic queries, Joins, Group by, Subqueries' },
      { name: 'Verbal Ability', priority: 'medium', description: 'Grammar, Vocabulary, Reading comprehension' },
      { name: 'Core Computer Science', priority: 'medium', description: 'OS, CN, DBMS fundamentals' },
      { name: 'Coding (Advanced)', priority: 'low', description: 'Required for Digital & Prime tracks only' }
    ],
    process: [
      { step: 'TCS NQT Registration', description: 'Register on TCS NextStep portal and complete profile', tips: 'Keep all documents ready for verification' },
      { step: 'NQT Foundation', description: 'Aptitude, Reasoning, Verbal, Programming MCQs', tips: 'This is mandatory for all tracks', duration: '90 mins' },
      { step: 'NQT Advanced', description: 'Coding problems for Digital and Prime tracks', tips: 'Practice medium-level DSA problems', duration: '60 mins' },
      { step: 'Technical Interview', description: 'CS fundamentals, Projects, Coding questions', tips: 'Revise your projects and be confident' },
      { step: 'Managerial Round', description: 'Situational questions, Leadership scenarios', tips: 'Show problem-solving and team skills' },
      { step: 'HR Interview', description: 'Background verification, Salary discussion', tips: 'Be honest and show enthusiasm for TCS' }
    ],
    questionPatterns: [
      { type: 'MCQ - Aptitude', frequency: 'common', examples: ['P&C', 'Probability', 'Time Speed Distance', 'Work & Time'] },
      { type: 'MCQ - Reasoning', frequency: 'common', examples: ['Puzzles', 'Seating Arrangement', 'Data Interpretation'] },
      { type: 'Programming MCQs', frequency: 'common', examples: ['Output questions', 'Code debugging', 'Algorithm tracing'] },
      { type: 'Coding - Basic', frequency: 'common', examples: ['Pattern printing', 'Number operations', 'String reversal'] },
      { type: 'Coding - Advanced', frequency: 'occasional', examples: ['Graph problems', 'DP basics', 'Tree operations'] }
    ],
    requirements: [
      { text: 'Minimum 60% in 10th, 12th, and Graduation', mandatory: true },
      { text: 'All backlogs must be cleared before joining', mandatory: true },
      { text: 'Full-time degree only (No part-time/distance)', mandatory: true },
      { text: 'Maximum 2 years gap allowed', mandatory: true },
      { text: 'Good analytical and communication skills', mandatory: false }
    ],
    specialConditions: ['Service Agreement: 2 years bond with ₹75,000 penalty', 'Initial posting can be anywhere in India'],
    quizTopicId: 'tcs-nqt',
    resourceTags: ['aptitude', 'reasoning', 'programming', 'sql']
  },
  wipro: {
    name: 'Wipro',
    shortName: 'Wipro',
    logo: '🌻',
    tagline: 'Spirit of Innovation',
    description: 'Wipro Limited is a leading global IT, consulting, and business process services company. Headquartered in Bangalore, Wipro employs over 250,000 people serving clients across six continents.',
    hiringPattern: 'Wipro conducts multiple hiring programs including WASE (Wipro Academy of Software Excellence), WILP (Work Integrated Learning Programme), and regular campus placements.',
    rolesOffered: ['Project Engineer', 'Software Developer', 'WILP Trainee', 'WASE Engineer'],
    averageSalary: '₹3.5 - 6.5 LPA',
    difficulty: 'Medium',
    topics: [
      { name: 'Quantitative Aptitude', priority: 'high', description: 'Arithmetic, Algebra, Data Interpretation' },
      { name: 'Logical Reasoning', priority: 'high', description: 'Puzzles, Coding-Decoding, Arrangements' },
      { name: 'Verbal Ability', priority: 'high', description: 'Grammar, Comprehension, Essay writing' },
      { name: 'Programming Concepts', priority: 'medium', description: 'C/C++/Java basics, OOPs' },
      { name: 'Data Structures', priority: 'medium', description: 'Arrays, Strings, Basic algorithms' },
      { name: 'Technical Fundamentals', priority: 'low', description: 'OS, DBMS, Networks basics' }
    ],
    process: [
      { step: 'Online Assessment', description: 'Aptitude, Logical Reasoning, Verbal Ability', tips: 'Focus on speed and accuracy', duration: '60 mins' },
      { step: 'Written Coding Test', description: 'Online coding round with 2 problems', tips: 'Practice array and string problems', duration: '60 mins' },
      { step: 'Essay Writing', description: 'Write an essay on a given topic', tips: 'Focus on structure and grammar', duration: '20 mins' },
      { step: 'Technical Interview', description: 'Programming, CS concepts, Project discussion', tips: 'Be clear about your projects' },
      { step: 'HR Interview', description: 'Fitment check, Salary discussion', tips: 'Show flexibility and eagerness to learn' }
    ],
    questionPatterns: [
      { type: 'MCQ - Aptitude', frequency: 'common', examples: ['Percentages', 'Ratios', 'Simple Interest', 'Time & Work'] },
      { type: 'Logical Reasoning', frequency: 'common', examples: ['Series completion', 'Analogies', 'Direction sense'] },
      { type: 'Verbal Ability', frequency: 'common', examples: ['Synonyms/Antonyms', 'Sentence correction', 'Fill in blanks'] },
      { type: 'Coding Problems', frequency: 'common', examples: ['Prime numbers', 'Palindrome check', 'Factorial'] },
      { type: 'Essay Writing', frequency: 'occasional', examples: ['Technology topics', 'Current affairs', 'Abstract topics'] }
    ],
    requirements: [
      { text: 'Minimum 60% throughout academics', mandatory: true },
      { text: 'No active backlogs', mandatory: true },
      { text: 'Maximum 1 year gap in education', mandatory: true },
      { text: 'B.E/B.Tech/M.E/M.Tech/MCA/M.Sc eligible', mandatory: true },
      { text: 'Adaptability and willingness to relocate', mandatory: false }
    ],
    specialConditions: ['Service Agreement: 1 year for campus hires', 'Initial training in Bangalore/Chennai'],
    quizTopicId: 'wipro-nlth',
    resourceTags: ['aptitude', 'logical-reasoning', 'verbal', 'programming']
  },
  accenture: {
    name: 'Accenture',
    shortName: 'Accenture',
    logo: '💼',
    tagline: 'Let there be change',
    description: 'Accenture is a global professional services company with leading capabilities in digital, cloud, and security. Serving clients in more than 120 countries, Accenture drives innovation to improve the way the world works and lives.',
    hiringPattern: 'Accenture hires through campus placement and off-campus drives. They offer roles in ASE, Associate, and Specialist categories with a focus on communication skills.',
    rolesOffered: ['Associate Software Engineer', 'Application Developer', 'Analyst', 'Specialist'],
    averageSalary: '₹4.5 - 8 LPA',
    difficulty: 'Easy',
    topics: [
      { name: 'Communication Skills', priority: 'high', description: 'Verbal and written communication assessment' },
      { name: 'Analytical Ability', priority: 'high', description: 'Problem-solving and critical thinking' },
      { name: 'Attention to Detail', priority: 'high', description: 'Error detection and data accuracy' },
      { name: 'Programming Fundamentals', priority: 'medium', description: 'Basic coding and logic' },
      { name: 'SQL & Database Concepts', priority: 'medium', description: 'Basic queries and operations' },
      { name: 'Logical Reasoning', priority: 'low', description: 'Pattern recognition, sequences' }
    ],
    process: [
      { step: 'Cognitive Assessment', description: 'Tests analytical and problem-solving abilities', tips: 'Practice logical puzzles and patterns', duration: '50 mins' },
      { step: 'Technical Assessment', description: 'Programming MCQs and basic coding', tips: 'Focus on fundamentals', duration: '40 mins' },
      { step: 'Coding Round', description: '2 coding problems of easy-medium difficulty', tips: 'Code readability matters', duration: '45 mins' },
      { step: 'Communication Assessment', description: 'Video-based communication evaluation', tips: 'Speak clearly and confidently' },
      { step: 'HR Interview', description: 'Behavioral and situational questions', tips: 'Use STAR method for answers' }
    ],
    questionPatterns: [
      { type: 'Cognitive - Abstract Reasoning', frequency: 'common', examples: ['Pattern matching', 'Visual sequences', 'Logical deduction'] },
      { type: 'Cognitive - Numerical', frequency: 'common', examples: ['Data analysis', 'Quick calculations', 'Number patterns'] },
      { type: 'Technical MCQs', frequency: 'common', examples: ['Programming basics', 'DBMS concepts', 'Networking basics'] },
      { type: 'Coding', frequency: 'common', examples: ['Array operations', 'String manipulation', 'Basic algorithms'] },
      { type: 'Communication', frequency: 'common', examples: ['Video response', 'Email writing', 'Presentation'] }
    ],
    requirements: [
      { text: '60% or above in academics', mandatory: true },
      { text: 'Good communication skills (Verbal & Written)', mandatory: true },
      { text: 'Willingness to relocate anywhere in India', mandatory: true },
      { text: 'Ability to work in rotational shifts', mandatory: true },
      { text: 'No active backlogs at time of joining', mandatory: false }
    ],
    specialConditions: ['Communication skills are heavily weighted', 'Flexible work arrangements available'],
    quizTopicId: 'accenture-prep',
    resourceTags: ['communication', 'aptitude', 'programming', 'sql']
  },
  cognizant: {
    name: 'Cognizant',
    shortName: 'CTS',
    logo: '🔷',
    tagline: 'Intuition Engineered',
    description: 'Cognizant is an American multinational IT services and consulting company headquartered in New Jersey. With operations in 40+ countries and over 340,000 employees, Cognizant is a Fortune 500 company.',
    hiringPattern: 'Cognizant conducts GenC, GenC Next, and GenC Elevate programs for campus hiring. They also have regular off-campus drives through their career portal.',
    rolesOffered: ['Programmer Analyst Trainee (GenC)', 'Digital Specialist (GenC Next)', 'Technology Specialist (GenC Elevate)'],
    averageSalary: '₹4 - 7 LPA',
    difficulty: 'Medium',
    topics: [
      { name: 'Analytical Reasoning', priority: 'high', description: 'Critical thinking and problem analysis' },
      { name: 'Quantitative Aptitude', priority: 'high', description: 'Mathematics and numerical ability' },
      { name: 'Computer Programming', priority: 'high', description: 'C/C++/Java/Python fundamentals' },
      { name: 'Data Structures', priority: 'medium', description: 'Arrays, Linked Lists, Trees, Graphs' },
      { name: 'DBMS & SQL', priority: 'medium', description: 'Queries, Normalization, Transactions' },
      { name: 'OOPS Concepts', priority: 'medium', description: 'Inheritance, Polymorphism, Encapsulation' },
      { name: 'Verbal Ability', priority: 'low', description: 'English comprehension and grammar' }
    ],
    process: [
      { step: 'Online Aptitude Test', description: 'Quantitative, Logical, Verbal sections', tips: 'Time management is crucial', duration: '60 mins' },
      { step: 'Coding Assessment', description: '2 coding problems for GenC Next and Elevate', tips: 'Focus on problem-solving approach', duration: '60 mins' },
      { step: 'AI Interview (SVAR)', description: 'Automated video interview with AI evaluation', tips: 'Speak naturally and make eye contact' },
      { step: 'Technical Interview', description: 'Programming, CS concepts, Projects', tips: 'Know your projects inside out' },
      { step: 'HR Interview', description: 'Background check, Offer discussion', tips: 'Be professional and honest' }
    ],
    questionPatterns: [
      { type: 'Aptitude', frequency: 'common', examples: ['Algebra', 'Mensuration', 'Data Interpretation', 'Probability'] },
      { type: 'Logical Reasoning', frequency: 'common', examples: ['Coding-Decoding', 'Blood Relations', 'Arrangements'] },
      { type: 'Verbal', frequency: 'common', examples: ['Para jumbles', 'Reading comprehension', 'Vocabulary'] },
      { type: 'Coding', frequency: 'common', examples: ['Pattern programs', 'Array problems', 'String operations'] },
      { type: 'Automata Fix', frequency: 'occasional', examples: ['Debug given code', 'Complete partial code'] }
    ],
    requirements: [
      { text: 'Minimum 60% in 10th, 12th, and Graduation', mandatory: true },
      { text: 'No standing backlogs at time of assessment', mandatory: true },
      { text: 'B.E/B.Tech/M.E/M.Tech/MCA eligible', mandatory: true },
      { text: 'Maximum 1 year gap allowed', mandatory: true },
      { text: 'Good problem-solving skills', mandatory: false }
    ],
    specialConditions: ['SVAR (AI Interview) is unique to Cognizant', 'GenC Elevate requires higher coding skills'],
    quizTopicId: 'cognizant-genC',
    resourceTags: ['aptitude', 'programming', 'sql', 'dsa']
  },
  amazon: {
    name: 'Amazon',
    shortName: 'Amazon',
    logo: '📦',
    tagline: 'Work Hard. Have Fun. Make History.',
    description: 'Amazon is a multinational technology company focusing on e-commerce, cloud computing (AWS), AI, and digital streaming. Known for its rigorous interview process emphasizing Leadership Principles and system design.',
    hiringPattern: 'Amazon conducts campus hiring for SDE-1 roles and off-campus drives throughout the year. They focus heavily on DSA, System Design, and behavioral questions based on Leadership Principles.',
    rolesOffered: ['Software Development Engineer (SDE-1)', 'Quality Assurance Engineer', 'Support Engineer', 'Business Analyst'],
    averageSalary: '₹12 - 32 LPA',
    difficulty: 'Hard',
    topics: [
      { name: 'Data Structures & Algorithms', priority: 'high', description: 'Arrays, Trees, Graphs, Dynamic Programming, Recursion' },
      { name: 'System Design', priority: 'high', description: 'Scalability, Load Balancing, Database Design, Microservices' },
      { name: 'Leadership Principles', priority: 'high', description: 'Customer Obsession, Ownership, Bias for Action, Deep Dive' },
      { name: 'Object-Oriented Design', priority: 'medium', description: 'Design patterns, SOLID principles, Class diagrams' },
      { name: 'Problem Solving', priority: 'medium', description: 'Optimization techniques, Time/Space complexity analysis' },
      { name: 'Operating Systems', priority: 'low', description: 'Multithreading, Concurrency, Memory management' }
    ],
    process: [
      { step: 'Online Assessment (OA)', description: 'Coding problems + Work Simulation questions', tips: 'Practice medium-hard LeetCode problems', duration: '90 mins' },
      { step: 'Phone Screen', description: '1-2 coding problems with a recruiter or engineer', tips: 'Think aloud and communicate your approach', duration: '45-60 mins' },
      { step: 'Onsite/Virtual Loop', description: '4-5 rounds: DSA, System Design, Bar Raiser, Hiring Manager', tips: 'Use STAR method for behavioral questions' },
      { step: 'Bar Raiser Interview', description: 'Behavioral deep-dive on Leadership Principles', tips: 'Prepare 10+ stories covering different LPs' },
      { step: 'Hiring Manager Round', description: 'Team fit, role discussion, and final evaluation', tips: 'Ask insightful questions about the team' }
    ],
    questionPatterns: [
      { type: 'Coding - DSA', frequency: 'common', examples: ['Two Pointers', 'Sliding Window', 'BFS/DFS', 'Dynamic Programming'] },
      { type: 'System Design', frequency: 'common', examples: ['Design URL Shortener', 'Design Twitter', 'Design Parking Lot'] },
      { type: 'Leadership Principles', frequency: 'common', examples: ['Tell me about a time you disagreed with your manager', 'Describe a failure'] },
      { type: 'Object-Oriented Design', frequency: 'occasional', examples: ['Design Chess', 'Design Elevator', 'Design Library System'] },
      { type: 'SQL & Database', frequency: 'rare', examples: ['Complex queries', 'Database optimization'] }
    ],
    requirements: [
      { text: 'Strong problem-solving skills with DSA proficiency', mandatory: true },
      { text: 'B.Tech/M.Tech from recognized university', mandatory: true },
      { text: 'Good understanding of at least one OOP language', mandatory: true },
      { text: 'Excellent communication and collaboration skills', mandatory: true },
      { text: 'Prior internship experience preferred', mandatory: false }
    ],
    specialConditions: ['Bar Raiser can veto any candidate', 'Multiple rounds on same day during onsite'],
    quizTopicId: 'amazon-sde',
    resourceTags: ['dsa', 'system-design', 'leadership-principles', 'oops']
  },
  microsoft: {
    name: 'Microsoft',
    shortName: 'Microsoft',
    logo: '🪟',
    tagline: 'Empowering every person and organization on the planet to achieve more',
    description: 'Microsoft is a global technology leader in cloud computing (Azure), productivity software (Office 365), gaming (Xbox), and AI. Known for collaborative culture and focus on growth mindset.',
    hiringPattern: 'Microsoft hires through campus placement, internships, and off-campus referrals. They emphasize coding skills, problem-solving, and cultural fit. IDC (India Development Center) roles are highly competitive.',
    rolesOffered: ['Software Engineer', 'Program Manager', 'Data Scientist', 'Support Engineer'],
    averageSalary: '₹15 - 40 LPA',
    difficulty: 'Hard',
    topics: [
      { name: 'Data Structures & Algorithms', priority: 'high', description: 'Trees, Graphs, DP, String manipulation, Recursion' },
      { name: 'System Design Basics', priority: 'high', description: 'Architecture, Scalability, API design' },
      { name: 'Object-Oriented Programming', priority: 'high', description: 'Design patterns, Inheritance, Polymorphism' },
      { name: 'Database Concepts', priority: 'medium', description: 'SQL, NoSQL, Indexing, Normalization' },
      { name: 'Operating Systems', priority: 'medium', description: 'Threading, Process management, Memory' },
      { name: 'Computer Networks', priority: 'low', description: 'HTTP, TCP/IP, DNS, Load balancing' }
    ],
    process: [
      { step: 'Online Coding Test', description: '3 coding problems on Codility or HackerRank', tips: 'Focus on correctness before optimization', duration: '75 mins' },
      { step: 'Group Fly Round', description: 'On-campus coding round on paper', tips: 'Write clean, readable code', duration: '60 mins' },
      { step: 'Technical Round 1', description: 'DSA problem-solving with code writing', tips: 'Discuss edge cases proactively' },
      { step: 'Technical Round 2', description: 'System design or advanced coding', tips: 'Think about scalability from the start' },
      { step: 'Hiring Manager / AA Round', description: 'Behavioral + technical fit assessment', tips: 'Show growth mindset and curiosity' }
    ],
    questionPatterns: [
      { type: 'Coding - Algorithms', frequency: 'common', examples: ['Binary Search variants', 'Tree traversals', 'Graph algorithms', 'DP'] },
      { type: 'Coding - Data Structures', frequency: 'common', examples: ['LinkedList manipulation', 'Stack/Queue problems', 'Heap operations'] },
      { type: 'System Design', frequency: 'occasional', examples: ['Design notification system', 'Design cache', 'Design rate limiter'] },
      { type: 'Behavioral', frequency: 'common', examples: ['Growth mindset examples', 'Conflict resolution', 'Learning from failure'] },
      { type: 'OS & Networking', frequency: 'rare', examples: ['Thread synchronization', 'Deadlock scenarios'] }
    ],
    requirements: [
      { text: 'Strong fundamentals in CS and programming', mandatory: true },
      { text: 'B.E/B.Tech/M.Tech in CS/IT or related field', mandatory: true },
      { text: 'Proficiency in at least one programming language', mandatory: true },
      { text: 'Good analytical and problem-solving skills', mandatory: true },
      { text: 'Competitive programming experience is a plus', mandatory: false }
    ],
    specialConditions: ['Growth mindset is a key evaluation criteria', 'Multiple positions in Azure, Office, and other teams'],
    quizTopicId: 'microsoft-sde',
    resourceTags: ['dsa', 'system-design', 'oops', 'os']
  },
  google: {
    name: 'Google',
    shortName: 'Google',
    logo: '🔍',
    tagline: 'Organize the world\'s information and make it universally accessible',
    description: 'Google is the world\'s leading search engine company and a pioneer in AI, cloud computing, and digital advertising. Known for exceptionally high interview bar and focus on algorithmic thinking.',
    hiringPattern: 'Google hires through campus placements at top institutes, internships (STEP, SWE Intern), and experienced hiring. The process is highly competitive with focus on algorithms and "Googleyness".',
    rolesOffered: ['Software Engineer (L3)', 'Software Engineer Intern', 'Site Reliability Engineer', 'Technical Solutions Engineer'],
    averageSalary: '₹25 - 50 LPA',
    difficulty: 'Hard',
    topics: [
      { name: 'Advanced Algorithms', priority: 'high', description: 'Graph algorithms, DP, Greedy, Divide & Conquer' },
      { name: 'Data Structures', priority: 'high', description: 'Trees, Tries, Heaps, Hash Maps, Segment Trees' },
      { name: 'System Design', priority: 'high', description: 'Distributed systems, MapReduce, Consistency models' },
      { name: 'Time/Space Complexity', priority: 'high', description: 'Big-O analysis, Optimization techniques' },
      { name: 'Behavioral (Googleyness)', priority: 'medium', description: 'Collaboration, Ambiguity handling, Leadership' },
      { name: 'Domain Knowledge', priority: 'low', description: 'ML basics, Networking (for specific roles)' }
    ],
    process: [
      { step: 'Online Assessment', description: 'Coding challenges on Google\'s platform', tips: 'Practice on LeetCode Hard problems', duration: '90 mins' },
      { step: 'Phone Interviews (2)', description: 'Algorithmic coding with Google engineers', tips: 'Use Google Docs for coding', duration: '45 mins each' },
      { step: 'Virtual Onsite (4-5 rounds)', description: 'Coding, System Design, Googleyness rounds', tips: 'Be ready to code on whiteboard/docs' },
      { step: 'Hiring Committee Review', description: 'All feedback reviewed by hiring committee', tips: 'Consistent performance across rounds matters' },
      { step: 'Team Matching', description: 'Match with suitable team post-approval', tips: 'Research teams you\'re interested in' }
    ],
    questionPatterns: [
      { type: 'Algorithmic Coding', frequency: 'common', examples: ['Graph traversal', 'Dynamic Programming', 'Binary Search on answer'] },
      { type: 'Data Structure Design', frequency: 'common', examples: ['LRU Cache', 'Implement Trie', 'Design HashMap'] },
      { type: 'System Design', frequency: 'common', examples: ['Design YouTube', 'Design Google Drive', 'Design Search Autocomplete'] },
      { type: 'Googleyness & Leadership', frequency: 'common', examples: ['Handling disagreements', 'Working in ambiguity', 'Mentoring others'] },
      { type: 'Math & Puzzles', frequency: 'rare', examples: ['Probability problems', 'Brain teasers'] }
    ],
    requirements: [
      { text: 'Exceptional problem-solving and algorithmic skills', mandatory: true },
      { text: 'Strong coding ability in at least one language', mandatory: true },
      { text: 'B.Tech/M.Tech from premier institute preferred', mandatory: true },
      { text: 'Understanding of computer science fundamentals', mandatory: true },
      { text: 'Competitive programming achievements valued', mandatory: false }
    ],
    specialConditions: ['Hiring Committee decides final outcome', 'Team matching happens after approval'],
    quizTopicId: 'google-swe',
    resourceTags: ['algorithms', 'system-design', 'dsa', 'competitive-programming']
  },
  ibm: {
    name: 'IBM',
    shortName: 'IBM',
    logo: '🖥️',
    tagline: 'Let\'s put smart to work',
    description: 'IBM (International Business Machines) is a global technology company providing cloud computing, AI, and consulting services. With over 100 years of innovation, IBM offers diverse roles in technology and consulting.',
    hiringPattern: 'IBM conducts campus recruitment through IBM Cognitive Ability Assessment. They hire for Associate System Engineer, Application Developer, and Consultant roles. Off-campus drives are also frequent.',
    rolesOffered: ['Associate System Engineer', 'Application Developer', 'Package Consultant', 'Data Scientist'],
    averageSalary: '₹4.5 - 12 LPA',
    difficulty: 'Medium',
    topics: [
      { name: 'Aptitude & Reasoning', priority: 'high', description: 'Quantitative, Logical reasoning, Verbal ability' },
      { name: 'Programming Fundamentals', priority: 'high', description: 'Java, Python, C++ basics and OOPs' },
      { name: 'Data Structures', priority: 'medium', description: 'Arrays, Strings, LinkedList, Trees' },
      { name: 'Database & SQL', priority: 'medium', description: 'Queries, Joins, Normalization' },
      { name: 'Computer Networks', priority: 'medium', description: 'OSI model, Protocols, Networking basics' },
      { name: 'Cloud & AI Basics', priority: 'low', description: 'IBM Cloud, Watson AI fundamentals' }
    ],
    process: [
      { step: 'Cognitive Ability Assessment', description: 'MCQs on aptitude, reasoning, English, domain', tips: 'Practice verbal and quantitative aptitude', duration: '60 mins' },
      { step: 'Coding Assessment', description: '1-2 coding problems of easy-medium level', tips: 'Focus on code correctness and edge cases', duration: '45 mins' },
      { step: 'Technical Interview', description: 'Programming, CS fundamentals, Project discussion', tips: 'Be thorough with your resume projects' },
      { step: 'Managerial Interview', description: 'Situational questions and team fit assessment', tips: 'Show leadership and collaboration skills' },
      { step: 'HR Interview', description: 'Background verification, Salary negotiation', tips: 'Be clear about your career goals' }
    ],
    questionPatterns: [
      { type: 'MCQ - Aptitude', frequency: 'common', examples: ['Number series', 'Percentages', 'Probability', 'Data interpretation'] },
      { type: 'MCQ - Reasoning', frequency: 'common', examples: ['Coding-Decoding', 'Blood relations', 'Syllogisms', 'Puzzles'] },
      { type: 'Verbal Ability', frequency: 'common', examples: ['Reading comprehension', 'Grammar', 'Vocabulary'] },
      { type: 'Technical MCQs', frequency: 'common', examples: ['DBMS concepts', 'OS basics', 'Networking', 'Programming'] },
      { type: 'Coding', frequency: 'occasional', examples: ['Array manipulation', 'String operations', 'Basic algorithms'] }
    ],
    requirements: [
      { text: 'Minimum 60% in 10th, 12th, and Graduation', mandatory: true },
      { text: 'No active backlogs at the time of joining', mandatory: true },
      { text: 'B.E/B.Tech/MCA/M.Tech in relevant fields', mandatory: true },
      { text: 'Good communication skills', mandatory: true },
      { text: 'Willingness to work in any IBM location', mandatory: false }
    ],
    specialConditions: ['IBM offers diverse roles across consulting and technology', 'Global mobility opportunities available'],
    quizTopicId: 'ibm-prep',
    resourceTags: ['aptitude', 'programming', 'sql', 'verbal']
  }
};

export const getCompanyByName = (name: string): CompanyData | undefined => {
  return companyData[name.toLowerCase()];
};

export const getAllCompanies = (): string[] => {
  return Object.keys(companyData);
};
