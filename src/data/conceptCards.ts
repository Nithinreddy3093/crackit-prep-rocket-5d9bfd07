// Concept cards — the "lookup" replacement for W3Schools/GFG.
// Short, scannable definition → example → gotcha → micro-MCQ.
// Each card maps to an existing topicId so "Practice now" can deep-link to /quiz/:topicId.

export interface ConceptCard {
  id: string;
  topicId: string;       // existing quiz topic id
  topicLabel: string;
  title: string;
  oneLiner: string;      // <120 chars
  definition: string;
  example: string;       // code or worked example, kept short
  gotcha: string;        // common interview trap
  micro: { q: string; a: string };
  tags: string[];
}

export const CONCEPT_CARDS: ConceptCard[] = [
  // ---------- DSA ----------
  {
    id: 'dsa-time-complexity',
    topicId: 'dsa', topicLabel: 'DSA',
    title: 'Big-O cheat sheet',
    oneLiner: 'How fast does your code grow as input grows?',
    definition: 'Big-O describes the upper bound of an algorithm\'s runtime as input size n → ∞. We care about the dominating term only.',
    example: 'for i in n: for j in n: ... → O(n²)\nfor i in n: ... → O(n)\nbinary search → O(log n)',
    gotcha: 'O(2n) and O(n) are the same. Constants are dropped. But for interviews, mention the constant if it matters (e.g. cache misses).',
    micro: { q: 'What is the time complexity of binary search?', a: 'O(log n)' },
    tags: ['complexity', 'big-o', 'analysis'],
  },
  {
    id: 'dsa-arrays-vs-linkedlist',
    topicId: 'dsa', topicLabel: 'DSA',
    title: 'Array vs Linked List',
    oneLiner: 'Random access vs cheap insert — pick your trade-off.',
    definition: 'Arrays give O(1) index access but O(n) insert. Linked lists give O(1) insert at known node but O(n) lookup.',
    example: 'arr[5] → instant\nlinkedList.get(5) → walk 5 nodes\nlist.insertAfter(node) → instant',
    gotcha: 'In real CPUs, arrays often beat linked lists even for inserts because of cache locality.',
    micro: { q: 'What is the lookup time of a singly linked list?', a: 'O(n)' },
    tags: ['array', 'linked-list', 'data-structures'],
  },
  {
    id: 'dsa-hashmap',
    topicId: 'dsa', topicLabel: 'DSA',
    title: 'Hash Maps in one minute',
    oneLiner: 'Average O(1) lookup, but only if your hash is good.',
    definition: 'A hash map stores key→value pairs using a hash function to index into a bucket array. Collisions are handled via chaining or open addressing.',
    example: 'map["alice"] = 90  // hash("alice") % size → bucket\nmap["alice"]        // same hash → instant',
    gotcha: 'Worst case is O(n) if all keys collide. Iteration order is NOT guaranteed in most languages (Java HashMap, C++ unordered_map).',
    micro: { q: 'What is the average-case time complexity of hashmap lookup?', a: 'O(1)' },
    tags: ['hashmap', 'hashing'],
  },
  {
    id: 'dsa-recursion',
    topicId: 'dsa', topicLabel: 'DSA',
    title: 'Recursion = base case + smaller subproblem',
    oneLiner: 'No base case = stack overflow.',
    definition: 'A function calls itself with a smaller input until it reaches a base case. Every recursion can be rewritten iteratively with an explicit stack.',
    example: 'factorial(n) =\n  if n <= 1: return 1\n  return n * factorial(n - 1)',
    gotcha: 'Recursion depth in Python is ~1000 by default. For deep trees, prefer iteration or sys.setrecursionlimit.',
    micro: { q: 'What does every recursive function need to terminate?', a: 'A base case' },
    tags: ['recursion', 'algorithms'],
  },
  {
    id: 'dsa-dp',
    topicId: 'dsa', topicLabel: 'DSA',
    title: 'Dynamic Programming — when to reach for it',
    oneLiner: 'Overlapping subproblems + optimal substructure → DP.',
    definition: 'DP caches solutions to subproblems so each is solved once. Two flavours: top-down (memoization) and bottom-up (tabulation).',
    example: 'fib(n) naive: O(2^n)\nfib(n) memoized: O(n)\nKnapsack, LCS, edit distance — all classic DP.',
    gotcha: 'If subproblems don\'t overlap, DP buys you nothing — that\'s just divide-and-conquer.',
    micro: { q: 'What two properties signal that a problem is solvable with DP?', a: 'Overlapping subproblems and optimal substructure' },
    tags: ['dp', 'dynamic-programming'],
  },

  // ---------- OS ----------
  {
    id: 'os-process-vs-thread',
    topicId: 'os', topicLabel: 'Operating Systems',
    title: 'Process vs Thread',
    oneLiner: 'Same address space or not — that\'s the whole story.',
    definition: 'A process has its own memory; threads inside a process share memory. Threads are lighter to create and switch but need synchronization.',
    example: 'Chrome tab = process (isolated crashes)\nWeb worker / Java Thread = thread (shared heap)',
    gotcha: 'Python\'s GIL means CPU-bound threads do NOT run in parallel — use multiprocessing instead.',
    micro: { q: 'Do threads of the same process share memory?', a: 'Yes' },
    tags: ['process', 'thread', 'concurrency'],
  },
  {
    id: 'os-deadlock',
    topicId: 'os', topicLabel: 'Operating Systems',
    title: 'Deadlock — the 4 conditions',
    oneLiner: 'Break any one and you\'re safe.',
    definition: 'Deadlock needs all four: mutual exclusion, hold-and-wait, no preemption, circular wait. Coffman conditions.',
    example: 'T1 holds A, waits for B\nT2 holds B, waits for A\n→ deadlock',
    gotcha: 'Always acquire locks in the same global order across the codebase. Cheap fix that prevents most deadlocks in practice.',
    micro: { q: 'How many Coffman conditions must hold for deadlock?', a: '4' },
    tags: ['deadlock', 'concurrency'],
  },

  // ---------- DBMS ----------
  {
    id: 'db-joins',
    topicId: 'dbms', topicLabel: 'Databases',
    title: 'SQL Joins in 30 seconds',
    oneLiner: 'INNER = both sides. LEFT = keep left even if right is null.',
    definition: 'INNER JOIN returns matching rows. LEFT JOIN keeps all rows from the left table. RIGHT JOIN keeps the right. FULL keeps both.',
    example: 'SELECT u.name, o.total\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id',
    gotcha: 'Filtering a LEFT JOIN in WHERE on the right table silently turns it into an INNER JOIN. Use ON instead.',
    micro: { q: 'Which join keeps all rows from the left table even without matches?', a: 'LEFT JOIN' },
    tags: ['sql', 'joins'],
  },
  {
    id: 'db-indexes',
    topicId: 'dbms', topicLabel: 'Databases',
    title: 'When indexes help (and when they hurt)',
    oneLiner: 'Faster reads, slower writes, more disk.',
    definition: 'An index is a sorted lookup structure (usually B-tree) on one or more columns. Lets the engine skip a full table scan.',
    example: 'CREATE INDEX idx_user_email ON users(email);\n-- WHERE email = ? now uses the index',
    gotcha: 'Indexes on low-cardinality columns (e.g. boolean) are usually useless. Composite index column order matters.',
    micro: { q: 'Do indexes speed up writes?', a: 'No — they slow writes down' },
    tags: ['index', 'sql', 'performance'],
  },
  {
    id: 'db-normalization',
    topicId: 'dbms', topicLabel: 'Databases',
    title: 'Normalization — 1NF / 2NF / 3NF',
    oneLiner: 'Remove redundancy, one fact in one place.',
    definition: '1NF: atomic columns. 2NF: no partial dependency on a composite key. 3NF: no transitive dependency.',
    example: '❌ orders(id, customer_name, customer_city)\n✅ orders(id, customer_id) + customers(id, name, city)',
    gotcha: 'Over-normalizing kills read performance. Analytics tables are often deliberately denormalized.',
    micro: { q: 'Which normal form removes transitive dependencies?', a: '3NF' },
    tags: ['normalization', 'sql'],
  },

  // ---------- Networking ----------
  {
    id: 'net-tcp-vs-udp',
    topicId: 'networking', topicLabel: 'Networking',
    title: 'TCP vs UDP',
    oneLiner: 'TCP = reliable & ordered. UDP = fast & you handle the rest.',
    definition: 'TCP is connection-oriented with handshake, retransmits, and ordering. UDP is fire-and-forget — no handshake, no guarantees.',
    example: 'HTTP, SSH, email → TCP\nDNS, video calls, online games → UDP',
    gotcha: 'HTTP/3 runs on UDP (via QUIC) to avoid head-of-line blocking from TCP.',
    micro: { q: 'Which protocol guarantees in-order delivery?', a: 'TCP' },
    tags: ['tcp', 'udp', 'networking'],
  },
  {
    id: 'net-http-status',
    topicId: 'networking', topicLabel: 'Networking',
    title: 'HTTP status codes you must know',
    oneLiner: '2xx success, 3xx redirect, 4xx your fault, 5xx my fault.',
    definition: '200 OK, 201 Created, 301 Moved Permanently, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Rate Limit, 500 Server Error, 503 Unavailable.',
    example: 'POST /api/login → 401 (bad password)\nGET /api/admin → 403 (logged in, not allowed)',
    gotcha: '401 means "not authenticated"; 403 means "authenticated but not authorized". Interviewers love this distinction.',
    micro: { q: 'What status code means rate-limited?', a: '429' },
    tags: ['http', 'rest', 'networking'],
  },

  // ---------- OOP ----------
  {
    id: 'oop-solid',
    topicId: 'oop', topicLabel: 'OOP',
    title: 'SOLID in plain English',
    oneLiner: 'Five rules for code that doesn\'t rot.',
    definition: 'S: Single Responsibility. O: Open for extension, closed for modification. L: Liskov substitution. I: Interface segregation. D: Dependency inversion.',
    example: 'Don\'t add a 6th if-branch to a class — extend it (OCP).\nDepend on PaymentGateway interface, not StripeGateway concrete (DIP).',
    gotcha: 'SOLID is a guideline, not a religion. Premature abstraction is its own sin.',
    micro: { q: 'What does the D in SOLID stand for?', a: 'Dependency Inversion' },
    tags: ['solid', 'oop', 'design'],
  },
  {
    id: 'oop-overload-override',
    topicId: 'oop', topicLabel: 'OOP',
    title: 'Overloading vs Overriding',
    oneLiner: 'Same name, different signatures vs same signature, different class.',
    definition: 'Overloading: multiple methods with the same name but different parameter lists (compile-time). Overriding: subclass redefines a method (run-time).',
    example: 'Overload: add(int, int) and add(double, double)\nOverride: Dog.bark() replaces Animal.bark()',
    gotcha: 'Python and JavaScript don\'t support true overloading — the last definition wins.',
    micro: { q: 'Is overloading resolved at compile time or run time?', a: 'Compile time' },
    tags: ['oop', 'polymorphism'],
  },

  // ---------- Aptitude ----------
  {
    id: 'apti-percent',
    topicId: 'aptitude', topicLabel: 'Aptitude',
    title: 'Percentage shortcuts',
    oneLiner: 'Of = multiply. Increase = (new − old) / old × 100.',
    definition: '"x% of y" = x/100 × y. Successive percent changes don\'t add: a 10% rise then 10% fall is a 1% NET loss.',
    example: '20% of 150 = 30\n100 → +10% = 110 → −10% = 99 (not 100)',
    gotcha: 'Discount on discount: 20% + 30% off ≠ 50% off. It\'s 1 − 0.8 × 0.7 = 44%.',
    micro: { q: '10% rise followed by 10% fall on 100 gives?', a: '99' },
    tags: ['aptitude', 'percent'],
  },
];

export const getConceptCard = (id: string) =>
  CONCEPT_CARDS.find((c) => c.id === id);

export const getCardsByTopic = (topicId: string) =>
  CONCEPT_CARDS.filter((c) => c.topicId === topicId);
