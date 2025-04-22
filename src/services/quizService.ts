
import { generateAIFeedback } from './geminiService';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Extended mock questions for various topics
const MOCK_QUESTIONS: Record<string, Question[]> = {
  "Data Structures and Algorithms": [
    {
      id: 1,
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
      correctAnswer: 1,
      explanation: "Binary search has a time complexity of O(log n) because it divides the search space in half with each iteration."
    },
    {
      id: 2,
      question: "Which data structure operates on a LIFO (Last In, First Out) principle?",
      options: ["Queue", "Stack", "Linked List", "Binary Tree"],
      correctAnswer: 1,
      explanation: "A stack follows the Last In, First Out (LIFO) principle, where the last element added is the first one to be removed."
    },
    {
      id: 3,
      question: "Which of the following sorting algorithms has the worst-case time complexity of O(n²)?",
      options: ["Merge Sort", "Quick Sort", "Bubble Sort", "Heap Sort"],
      correctAnswer: 2,
      explanation: "Bubble Sort has a worst-case time complexity of O(n²) as it compares adjacent elements and swaps them if they are in the wrong order."
    },
    {
      id: 4,
      question: "What is the space complexity of depth-first search?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correctAnswer: 2,
      explanation: "Depth-first search has a space complexity of O(n) in the worst case due to the recursion stack or explicit stack used to track visited nodes."
    },
    {
      id: 5,
      question: "Which data structure is most suitable for implementing a priority queue?",
      options: ["Array", "Linked List", "Heap", "Hash Table"],
      correctAnswer: 2,
      explanation: "A heap is most suitable for implementing a priority queue because it efficiently supports insertion and deletion of elements based on priority."
    },
    {
      id: 6,
      question: "What is the time complexity of finding an element in a hash table?",
      options: ["O(1) average case", "O(log n)", "O(n)", "O(n log n)"],
      correctAnswer: 0,
      explanation: "Hash tables provide O(1) average case time complexity for lookups, though the worst case can be O(n) if there are many collisions."
    },
    {
      id: 7,
      question: "Which of the following is NOT an in-place sorting algorithm?",
      options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Quick Sort"],
      correctAnswer: 2,
      explanation: "Merge Sort is not an in-place sorting algorithm because it requires O(n) additional space for merging the sub-arrays during the sorting process."
    },
    {
      id: 8,
      question: "What data structure would you use to implement a breadth-first search?",
      options: ["Stack", "Queue", "Heap", "Hash Table"],
      correctAnswer: 1,
      explanation: "A queue is used to implement breadth-first search because it processes nodes in a first-in, first-out (FIFO) manner, ensuring that all nodes at a given depth are processed before moving to the next level."
    },
    {
      id: 9,
      question: "What is the worst-case time complexity of quicksort?",
      options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
      correctAnswer: 1,
      explanation: "The worst-case time complexity of quicksort is O(n²) which occurs when the pivot chosen is consistently the smallest or largest element, making the partition highly unbalanced."
    },
    {
      id: 10,
      question: "Which of the following data structures allows for O(1) access to elements by index?",
      options: ["Linked List", "Array", "Binary Search Tree", "Hash Map"],
      correctAnswer: 1,
      explanation: "Arrays provide O(1) access to elements by index because they store elements in contiguous memory locations, allowing direct computation of an element's address using its index."
    }
  ],
  "Object-Oriented Programming": [
    {
      id: 1,
      question: "What is encapsulation in OOP?",
      options: [
        "The ability of a class to inherit from multiple classes",
        "The concept of bundling data and methods that operate on that data within a single unit",
        "The ability of objects to take on many forms",
        "The process of hiding implementation details"
      ],
      correctAnswer: 1,
      explanation: "Encapsulation is the bundling of data and methods that operate on that data within a single unit (class), often including information hiding."
    },
    {
      id: 2,
      question: "What is inheritance in OOP?",
      options: [
        "The concept of bundling data and methods together",
        "The ability of a class to inherit properties and behaviors from another class",
        "The ability to create multiple instances of a class",
        "The process of defining multiple methods with the same name"
      ],
      correctAnswer: 1,
      explanation: "Inheritance is a mechanism where a new class (derived class) can inherit properties and behaviors from an existing class (base class)."
    },
    {
      id: 3,
      question: "What is polymorphism in OOP?",
      options: [
        "The ability to create multiple instances of a class",
        "The concept of bundling data and methods together",
        "The ability of objects to take on many forms",
        "The process of hiding implementation details"
      ],
      correctAnswer: 2,
      explanation: "Polymorphism is the ability of objects to take on many forms, allowing objects of different classes to be treated as objects of a common superclass."
    },
    {
      id: 4,
      question: "What is abstraction in OOP?",
      options: [
        "The process of hiding implementation details while showing only functionality",
        "The ability of a class to inherit from multiple classes",
        "The concept of bundling data and methods together",
        "The ability to create multiple instances of a class"
      ],
      correctAnswer: 0,
      explanation: "Abstraction is the process of hiding complex implementation details and showing only the necessary features of an object."
    },
    {
      id: 5,
      question: "What is a constructor in OOP?",
      options: [
        "A method used to destroy objects",
        "A special method used to initialize objects",
        "A method used to copy objects",
        "A method used to compare objects"
      ],
      correctAnswer: 1,
      explanation: "A constructor is a special method that is automatically called when an object is created, used to initialize the object's attributes."
    },
    {
      id: 6,
      question: "What is method overloading in OOP?",
      options: [
        "Defining multiple methods with the same name but different signatures in the same class",
        "Redefining a method in a derived class with the same signature as in the base class",
        "Creating a new instance of a class",
        "Hiding implementation details of a method"
      ],
      correctAnswer: 0,
      explanation: "Method overloading is defining multiple methods with the same name but different parameters (signatures) in the same class, allowing for different behaviors based on the arguments passed."
    },
    {
      id: 7,
      question: "What is method overriding in OOP?",
      options: [
        "Defining multiple methods with the same name but different signatures in the same class",
        "Redefining a method in a derived class with the same signature as in the base class",
        "Creating a new instance of a class",
        "Hiding implementation details of a method"
      ],
      correctAnswer: 1,
      explanation: "Method overriding is providing a new implementation for a method in a derived class that already exists in the base class, allowing the derived class to change or extend the behavior of the inherited method."
    },
    {
      id: 8,
      question: "What is an interface in OOP?",
      options: [
        "A class that cannot be instantiated",
        "A contract that specifies methods a class must implement",
        "A way to achieve multiple inheritance",
        "A way to encapsulate data"
      ],
      correctAnswer: 1,
      explanation: "An interface is a contract that specifies a set of methods a class must implement, defining what an object can do without specifying how it does it."
    },
    {
      id: 9,
      question: "What is an abstract class in OOP?",
      options: [
        "A class that cannot be instantiated and may contain abstract methods",
        "A class that can only have static methods",
        "A class that implements multiple interfaces",
        "A class with only private members"
      ],
      correctAnswer: 0,
      explanation: "An abstract class is a class that cannot be instantiated and may contain abstract methods (methods without implementation) that must be implemented by derived classes."
    },
    {
      id: 10,
      question: "What is a design pattern in OOP?",
      options: [
        "A reusable solution to a commonly occurring problem in software design",
        "A way to document class hierarchies",
        "A tool for generating code automatically",
        "A method for testing object-oriented programs"
      ],
      correctAnswer: 0,
      explanation: "A design pattern in OOP is a reusable solution to a common problem in software design, providing a template for solving specific types of problems and promoting code reusability and maintainability."
    }
  ],
  "Web Development": [
    {
      id: 1,
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Multi Language",
        "Hyper Transfer Markup Language",
        "Home Tool Markup Language"
      ],
      correctAnswer: 0,
      explanation: "HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages."
    },
    {
      id: 2,
      question: "Which CSS property is used to control the spacing between elements?",
      options: ["spacing", "margin", "padding", "border"],
      correctAnswer: 1,
      explanation: "The margin property in CSS is used to control the spacing between elements by creating space around elements, outside of any defined borders."
    },
    {
      id: 3,
      question: "Which of the following is NOT a JavaScript framework/library?",
      options: ["React", "Angular", "Vue", "Django"],
      correctAnswer: 3,
      explanation: "Django is a high-level Python web framework, not a JavaScript framework or library."
    },
    {
      id: 4,
      question: "What is the purpose of the 'viewport' meta tag in HTML?",
      options: [
        "To set the background color of the web page",
        "To define the size and scale of the viewport",
        "To link external CSS files",
        "To set the character encoding"
      ],
      correctAnswer: 1,
      explanation: "The viewport meta tag is used to control the width and scaling of the viewport, which is essential for responsive web design."
    },
    {
      id: 5,
      question: "What is the correct way to write a JavaScript array?",
      options: [
        "var colors = 'red', 'green', 'blue'",
        "var colors = (1:'red', 2:'green', 3:'blue')",
        "var colors = ['red', 'green', 'blue']",
        "var colors = 1=('red'), 2=('green'), 3=('blue')"
      ],
      correctAnswer: 2,
      explanation: "In JavaScript, arrays are written with square brackets, and array items are separated by commas."
    },
    {
      id: 6,
      question: "What does CORS stand for in web development?",
      options: [
        "Cross-Origin Resource Sharing",
        "Create, Open, Read, Send",
        "Compile, Optimize, Run, Script",
        "Component Object Runtime System"
      ],
      correctAnswer: 0,
      explanation: "CORS stands for Cross-Origin Resource Sharing, which is a mechanism that allows many resources (e.g., fonts, JavaScript, etc.) on a web page to be requested from another domain outside the domain from which the resource originated."
    },
    {
      id: 7,
      question: "Which of the following is a CSS preprocessor?",
      options: ["jQuery", "SASS", "React", "Express"],
      correctAnswer: 1,
      explanation: "SASS (Syntactically Awesome Style Sheets) is a CSS preprocessor that extends CSS with features like variables, nested rules, and mixins, making CSS more maintainable and easier to write."
    },
    {
      id: 8,
      question: "What is the purpose of the localStorage object in JavaScript?",
      options: [
        "To style HTML elements", 
        "To store data on the client's browser", 
        "To make HTTP requests", 
        "To create animations"
      ],
      correctAnswer: 1,
      explanation: "The localStorage object in JavaScript is used to store data on the client's browser with no expiration time. The data will persist even after the browser is closed and reopened."
    },
    {
      id: 9,
      question: "Which HTTP method is idempotent?",
      options: ["POST", "GET", "PATCH", "DELETE"],
      correctAnswer: 1,
      explanation: "GET is idempotent, meaning that making the same request multiple times will produce the same result as making it once, without changing the state of the server."
    },
    {
      id: 10,
      question: "What is a closure in JavaScript?",
      options: [
        "A way to close the browser window",
        "A function that has access to variables from its outer (enclosing) function's scope",
        "A method to close database connections",
        "A syntax for ending a code block"
      ],
      correctAnswer: 1,
      explanation: "A closure in JavaScript is a function that has access to variables from its outer (enclosing) function's scope, even after the outer function has returned, allowing for data encapsulation and private variables."
    }
  ],
  "Operating Systems": [
    {
      id: 1,
      question: "What is the main purpose of an operating system?",
      options: [
        "To run applications",
        "To manage hardware resources",
        "To connect to the internet",
        "To store files"
      ],
      correctAnswer: 1,
      explanation: "The main purpose of an operating system is to manage computer hardware resources and provide common services for computer programs."
    },
    {
      id: 2,
      question: "What is a process in the context of operating systems?",
      options: [
        "A program in execution",
        "A part of the memory",
        "A type of file system",
        "A hardware component"
      ],
      correctAnswer: 0,
      explanation: "A process is a program in execution. It is the unit of work in most computer systems and consists of the program code, current activity, and related resources."
    },
    {
      id: 3,
      question: "What is virtual memory?",
      options: [
        "A type of RAM",
        "A technique that uses disk space as an extension of RAM",
        "A special type of cache memory",
        "Memory used by virtual machines only"
      ],
      correctAnswer: 1,
      explanation: "Virtual memory is a memory management technique that uses disk space as an extension of RAM, allowing programs to use more memory than physically available."
    },
    {
      id: 4,
      question: "What is a deadlock in operating systems?",
      options: [
        "A situation where a computer crashes",
        "A situation where processes are unable to proceed because each is waiting for resources held by another",
        "A type of computer virus",
        "When the CPU usage is 100%"
      ],
      correctAnswer: 1,
      explanation: "A deadlock is a situation where two or more processes are unable to proceed because each is waiting for resources held by another process in the group."
    },
    {
      id: 5,
      question: "What is the purpose of a file system in an operating system?",
      options: [
        "To secure the operating system from viruses",
        "To organize and manage files on storage devices",
        "To execute programs faster",
        "To connect to the internet"
      ],
      correctAnswer: 1,
      explanation: "A file system is used to organize and store files on storage devices, providing a way to organize data in a hierarchical structure of directories or folders."
    },
    {
      id: 6,
      question: "What is a page fault in virtual memory systems?",
      options: [
        "A programming error in the operating system",
        "When a process accesses a memory page that is not currently mapped to physical memory",
        "When a hard drive fails to respond",
        "When two pages have the same address"
      ],
      correctAnswer: 1,
      explanation: "A page fault occurs when a process accesses a memory page that is not currently mapped to physical memory, requiring the operating system to retrieve the data from secondary storage (like a hard drive) and load it into RAM."
    },
    {
      id: 7,
      question: "What is the difference between preemptive and non-preemptive scheduling?",
      options: [
        "Preemptive scheduling uses priorities, non-preemptive doesn't",
        "Preemptive scheduling allows the OS to interrupt a running process, non-preemptive doesn't",
        "Preemptive scheduling is used in mainframes, non-preemptive in personal computers",
        "There is no difference"
      ],
      correctAnswer: 1,
      explanation: "In preemptive scheduling, the operating system can interrupt a currently running process to allocate the CPU to another process, while in non-preemptive scheduling, once a process starts running, it continues until it terminates or blocks for I/O."
    },
    {
      id: 8,
      question: "What is thrashing in operating systems?",
      options: [
        "When a computer is infected with a virus",
        "When a hard drive is about to fail",
        "When the system spends more time paging than executing",
        "When multiple processes are competing for CPU time"
      ],
      correctAnswer: 2,
      explanation: "Thrashing occurs when the operating system spends more time paging (swapping data between memory and disk) than executing application code, significantly degrading system performance due to excessive page faults."
    },
    {
      id: 9,
      question: "What is a semaphore in operating systems?",
      options: [
        "A type of computer virus",
        "A synchronization primitive used to control access to shared resources",
        "A special type of process that runs in the background",
        "A hardware component that connects to the CPU"
      ],
      correctAnswer: 1,
      explanation: "A semaphore is a synchronization primitive used to control access to shared resources in a multi-process or multi-threaded environment, helping prevent race conditions and ensure mutual exclusion."
    },
    {
      id: 10,
      question: "What is context switching in operating systems?",
      options: [
        "Changing from one application to another by the user",
        "The process of saving the state of a process or thread so it can be restored and resumed later",
        "Switching between different operating systems on the same computer",
        "Changing the theme or appearance of the operating system"
      ],
      correctAnswer: 1,
      explanation: "Context switching is the process of saving the state of a currently running process or thread so that it can be restored and resumed later, allowing multiple processes to share a single CPU resource."
    }
  ],
  "Database Management": [
    {
      id: 1,
      question: "What is the highest normal form in database normalization?",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      correctAnswer: 3,
      explanation: "BCNF (Boyce-Codd Normal Form) is a higher normal form than 3NF. While 5NF and 6NF exist, BCNF is often considered the highest practical normal form in most database designs."
    },
    {
      id: 2,
      question: "Which of the following is NOT a type of database index?",
      options: ["B-Tree index", "Hash index", "Matrix index", "Bitmap index"],
      correctAnswer: 2,
      explanation: "Matrix index is not a standard type of database index. Common index types include B-Tree, Hash, Bitmap, and Full-text indices."
    },
    {
      id: 3,
      question: "What does ACID stand for in database transactions?",
      options: [
        "Atomicity, Consistency, Isolation, Durability",
        "Availability, Consistency, Integration, Durability",
        "Atomicity, Concurrency, Integrity, Dependability",
        "Automation, Consistency, Isolation, Durability"
      ],
      correctAnswer: 0,
      explanation: "ACID stands for Atomicity, Consistency, Isolation, and Durability, which are the key properties that guarantee reliable processing of database transactions."
    },
    {
      id: 4,
      question: "What is a foreign key in a relational database?",
      options: [
        "A key used to encrypt database records",
        "A field that uniquely identifies each record in a table",
        "A field that refers to the primary key in another table",
        "A key that is imported from another database"
      ],
      correctAnswer: 2,
      explanation: "A foreign key is a field (or collection of fields) in one table that refers to the primary key in another table, establishing a link between the two tables."
    },
    {
      id: 5,
      question: "What is database sharding?",
      options: [
        "A technique for deleting unnecessary data",
        "A method for encrypting sensitive data",
        "The process of breaking up a large database into smaller, more manageable pieces",
        "A backup strategy for databases"
      ],
      correctAnswer: 2,
      explanation: "Database sharding is a horizontal partitioning technique that splits a large database into smaller, faster, more manageable pieces called shards, which can be stored on different servers to distribute the load."
    },
    {
      id: 6,
      question: "What is a stored procedure in a database?",
      options: [
        "A set of SQL statements that have been saved for reuse",
        "A way to store data temporarily in memory",
        "A method for backing up database tables",
        "A type of index structure"
      ],
      correctAnswer: 0,
      explanation: "A stored procedure is a prepared SQL code that can be saved and reused, allowing for more efficient execution and reducing network traffic between clients and the database server."
    },
    {
      id: 7,
      question: "What is a NoSQL database?",
      options: [
        "A database that doesn't support any form of SQL",
        "A database designed to handle structured data only",
        "A database that provides a mechanism for storage and retrieval of data that is modeled differently from the tabular relations used in relational databases",
        "A database used exclusively for big data applications"
      ],
      correctAnswer: 2,
      explanation: "A NoSQL (Not Only SQL) database is designed for distributed data stores with needs beyond traditional relational databases, often providing a mechanism for storage and retrieval of data that is modeled differently from the tabular relations used in relational databases."
    },
    {
      id: 8,
      question: "What is the purpose of an EXPLAIN statement in SQL?",
      options: [
        "To explain the syntax of SQL commands",
        "To document the database schema",
        "To analyze and display the execution plan of a query",
        "To explain error messages"
      ],
      correctAnswer: 2,
      explanation: "The EXPLAIN statement in SQL is used to analyze and display the execution plan of a query, showing how the database will retrieve the required data and helping developers optimize query performance."
    },
    {
      id: 9,
      question: "What is database replication?",
      options: [
        "Making exact copies of a database",
        "The process of copying data from one database server to another and keeping the databases synchronized",
        "A backup technique",
        "The process of normalizing database tables"
      ],
      correctAnswer: 1,
      explanation: "Database replication is the process of copying data from one database server (the master) to one or more other database servers (slaves) and keeping them synchronized, providing improved availability, reliability, and performance."
    },
    {
      id: 10,
      question: "What is a deadlock in database systems?",
      options: [
        "When the database server crashes",
        "When two or more transactions are waiting for each other to release locks",
        "When a query takes too long to execute",
        "When database tables become corrupted"
      ],
      correctAnswer: 1,
      explanation: "A deadlock in database systems occurs when two or more transactions are waiting indefinitely for each other to release locks on resources, resulting in a situation where none of the transactions can proceed."
    }
  ],
  "Cyber Security": [
    {
      id: 1,
      question: "What is a man-in-the-middle attack?",
      options: [
        "A type of DoS attack that floods a server with traffic",
        "An attack where an unauthorized party positions themselves between communications",
        "A type of malware that encrypts files and demands ransom",
        "A brute force attack against user passwords"
      ],
      correctAnswer: 1,
      explanation: "A man-in-the-middle attack occurs when an attacker secretly intercepts and possibly alters communications between two parties who believe they are directly communicating with each other."
    },
    {
      id: 2,
      question: "What is the primary purpose of a firewall?",
      options: [
        "To detect and remove viruses",
        "To monitor network traffic for suspicious activity",
        "To control incoming and outgoing network traffic based on predetermined security rules",
        "To encrypt data during transmission"
      ],
      correctAnswer: 2,
      explanation: "A firewall's primary purpose is to establish a barrier between a trusted internal network and untrusted external networks, controlling traffic based on security rules."
    },
    {
      id: 3,
      question: "What is a DDoS attack?",
      options: [
        "Data Delivery over Secure Socket",
        "Distributed Denial of Service",
        "Domain-based Delivery of Services",
        "Dynamic Data Security System"
      ],
      correctAnswer: 1,
      explanation: "DDoS (Distributed Denial of Service) is an attack where multiple compromised systems are used to target a single system, such as a website or server, with the intent of overwhelming it with traffic and making it unavailable to users."
    },
    {
      id: 4,
      question: "What is phishing?",
      options: [
        "A technique to speed up network connections",
        "A type of encryption protocol",
        "A fraudulent attempt to obtain sensitive information by disguising as a trustworthy entity",
        "A method to recover lost passwords"
      ],
      correctAnswer: 2,
      explanation: "Phishing is a fraudulent attempt to obtain sensitive information such as usernames, passwords, and credit card details by disguising as a trustworthy entity in electronic communications."
    },
    {
      id: 5,
      question: "What is a zero-day vulnerability?",
      options: [
        "A security flaw that is patched on the day it is discovered",
        "A security flaw that has been present in software since day zero of its release",
        "A security flaw that is known to the attacker but not yet known to the software vendor or to antivirus vendors",
        "A vulnerability that takes zero days to exploit"
      ],
      correctAnswer: 2,
      explanation: "A zero-day vulnerability is a security flaw that is unknown to those who should be interested in mitigating it, including the vendor of the target software, and is being actively exploited by attackers before the vendor becomes aware and fixes it."
    },
    {
      id: 6,
      question: "What is the purpose of a VPN (Virtual Private Network)?",
      options: [
        "To speed up internet connections",
        "To provide a secure, encrypted connection over a less secure network",
        "To block all online advertisements",
        "To store sensitive files in the cloud"
      ],
      correctAnswer: 1,
      explanation: "A VPN (Virtual Private Network) creates a secure, encrypted connection over a less secure network, such as the public internet, providing privacy and anonymity by hiding the user's internet activity and location."
    },
    {
      id: 7,
      question: "What is the principle of least privilege in cybersecurity?",
      options: [
        "Granting users the minimum levels of access necessary to complete their job functions",
        "Ensuring that all security systems are as simple as possible",
        "Providing multiple layers of security controls",
        "Using the least expensive security solutions available"
      ],
      correctAnswer: 0,
      explanation: "The principle of least privilege is a computer security concept that dictates that users should be granted the minimum levels of access or permissions needed to perform their job functions, reducing the potential damage from accidents, errors, or unauthorized use."
    },
    {
      id: 8,
      question: "What is the difference between symmetric and asymmetric encryption?",
      options: [
        "Symmetric encryption is faster, asymmetric is more secure",
        "Symmetric encryption uses one key for both encryption and decryption, asymmetric uses different keys",
        "Symmetric encryption is used for stored data, asymmetric for transmitted data",
        "There is no significant difference"
      ],
      correctAnswer: 1,
      explanation: "Symmetric encryption uses the same key for both encryption and decryption, while asymmetric encryption uses a pair of keys (public and private) where data encrypted with one key can only be decrypted with the other key."
    },
    {
      id: 9,
      question: "What is a SQL injection attack?",
      options: [
        "An attack that inserts malicious SQL code into a database query",
        "A method to optimize SQL database performance",
        "A tool to repair corrupted SQL databases",
        "A legitimate database administration technique"
      ],
      correctAnswer: 0,
      explanation: "A SQL injection attack involves inserting malicious SQL code into a database query, typically via input fields on a web application, potentially allowing attackers to view, modify, or delete data they normally couldn't access."
    },
    {
      id: 10,
      question: "What is two-factor authentication (2FA)?",
      options: [
        "A method that requires two people to approve access",
        "An authentication method that requires two different authentication factors",
        "A security system that checks credentials twice",
        "A backup authentication system used when the primary fails"
      ],
      correctAnswer: 1,
      explanation: "Two-factor authentication (2FA) is an authentication method that requires users to provide two different types of verification factors to prove their identity, typically something they know (password) and something they have (mobile device) or something they are (biometric verification)."
    }
  ],
  "Machine Learning": [
    {
      id: 1,
      question: "What is overfitting in machine learning?",
      options: [
        "When a model performs well on training data but poorly on unseen data",
        "When a model is too simple to capture the underlying pattern in the data",
        "When the training process takes too long to complete",
        "When the model requires too much memory"
      ],
      correctAnswer: 0,
      explanation: "Overfitting occurs when a machine learning model learns the training data too well, capturing noise and random fluctuations as if they were patterns. This results in good performance on the training data but poor generalization to new, unseen data."
    },
    {
      id: 2,
      question: "What is the purpose of a loss function in machine learning?",
      options: [
        "To measure the physical space occupied by the model",
        "To quantify how well the model's predictions match the actual data",
        "To reduce the number of features used by the model",
        "To speed up the training process"
      ],
      correctAnswer: 1,
      explanation: "A loss function in machine learning measures the difference between the model's predictions and the actual target values, quantifying how well the model is performing and providing a value to be minimized during training."
    },
    {
      id: 3,
      question: "What is the difference between supervised and unsupervised learning?",
      options: [
        "Supervised learning is faster, unsupervised learning is more accurate",
        "Supervised learning requires more data than unsupervised learning",
        "Supervised learning uses labeled data with known outputs, unsupervised learning uses unlabeled data",
        "Supervised learning is used for classification, unsupervised only for regression"
      ],
      correctAnswer: 2,
      explanation: "Supervised learning involves training models on labeled data where the correct outputs are known, enabling the model to learn the relationship between inputs and outputs. Unsupervised learning uses unlabeled data and identifies patterns, relationships, or structures without predefined outputs."
    },
    {
      id: 4,
      question: "What is gradient descent in machine learning?",
      options: [
        "A technique for reducing the number of features",
        "An algorithm used to find the minimum of a function by iteratively moving in the direction of steepest descent",
        "A method for evaluating model performance",
        "A technique for visualizing high-dimensional data"
      ],
      correctAnswer: 1,
      explanation: "Gradient descent is an optimization algorithm used to minimize the loss function by iteratively moving in the direction of the steepest descent (negative gradient). It updates the model parameters to find the minimum of the function, which corresponds to the best model performance."
    },
    {
      id: 5,
      question: "What is a decision tree in machine learning?",
      options: [
        "A diagram used to plan the machine learning project",
        "A flowchart-like structure where internal nodes represent decisions based on features",
        "A tool for deciding which algorithm to use",
        "A method for combining multiple models"
      ],
      correctAnswer: 1,
      explanation: "A decision tree is a flowchart-like model where internal nodes represent decisions based on feature values, branches represent the outcome of those decisions, and leaf nodes represent the final output or class. It makes predictions by following the appropriate path from root to leaf."
    },
    {
      id: 6,
      question: "What is the purpose of cross-validation in machine learning?",
      options: [
        "To make models run faster by using parallel processing",
        "To ensure the model performs well on different subsets of the data, reducing overfitting",
        "To combine multiple models for better performance",
        "To validate the model across different programming languages"
      ],
      correctAnswer: 1,
      explanation: "Cross-validation is a technique used to assess how well a model will generalize to an independent dataset by partitioning the original dataset into training and validation sets multiple times. It helps detect overfitting and provides a more reliable estimate of model performance."
    },
    {
      id: 7,
      question: "What is a neural network?",
      options: [
        "A network of computers used for distributed computing",
        "A computational model inspired by the structure and function of biological neural networks",
        "A database schema designed for machine learning applications",
        "A visualization tool for complex data"
      ],
      correctAnswer: 1,
      explanation: "A neural network is a computational model inspired by the structure and function of biological neural networks in the human brain. It consists of interconnected nodes (neurons) organized in layers that process information by passing it through multiple transformations to produce an output."
    },
    {
      id: 8,
      question: "What is the purpose of feature scaling in machine learning?",
      options: [
        "To increase the number of features to improve model accuracy",
        "To normalize features to a similar range for better model performance and convergence",
        "To reduce the size of the dataset for faster processing",
        "To remove irrelevant features from the dataset"
      ],
      correctAnswer: 1,
      explanation: "Feature scaling is the process of normalizing or standardizing numerical features to bring them to a similar range. This improves the performance and convergence speed of many machine learning algorithms that are sensitive to the scale of input features."
    },
    {
      id: 9,
      question: "What is a confusion matrix in machine learning?",
      options: [
        "A visualization of where a model gets confused",
        "A matrix used to measure the computational complexity of algorithms",
        "A table used to evaluate the performance of a classification model",
        "A mathematical technique for solving complex equations"
      ],
      correctAnswer: 2,
      explanation: "A confusion matrix is a table used to evaluate the performance of a classification model by summarizing the predictions made by the model compared to the actual values. It shows the number of true positives, false positives, true negatives, and false negatives."
    },
    {
      id: 10,
      question: "What is ensemble learning in machine learning?",
      options: [
        "A technique for training models simultaneously on multiple machines",
        "A method that combines multiple models to improve performance",
        "A type of neural network architecture",
        "A way to teach machine learning to beginners"
      ],
      correctAnswer: 1,
      explanation: "Ensemble learning is a technique that combines multiple individual models (often called 'weak learners') to create a more powerful predictive model (a 'strong learner'). Common ensemble methods include random forests, gradient boosting, and bagging, which help improve accuracy and reduce overfitting."
    }
  ]
};

// Generate difficulty-specific prompts for AI question generation
const generatePromptForTopic = (topic: string, difficulty: string = 'intermediate'): string => {
  const difficultyGuide = {
    beginner: "fundamental concepts, basic definitions, and simple applications. Questions should be straightforward with clear options.",
    intermediate: "practical applications, moderate complexity scenarios, and standard techniques. Questions should require solid understanding of the topic.",
    advanced: "complex problems, edge cases, optimization techniques, and advanced concepts. Questions should challenge even experienced professionals."
  }[difficulty as 'beginner' | 'intermediate' | 'advanced'];

  return `
    Generate a multiple-choice question on ${topic} with exactly 4 options and one correct answer.
    The question should test knowledge of ${difficultyGuide}
    The question should be specific, technically accurate, and clear.
    The correct answer should be defensible and unambiguous.
    Provide a detailed explanation for why the correct answer is right and why the distractors are wrong.
    
    Format your response as JSON with the following structure:
    {
      "question": "The complete question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0, // Index of correct answer (0-3)
      "explanation": "Detailed explanation of why the answer is correct and others are wrong"
    }
  `;
};

// Function to generate questions with improved AI prompting
export const generateQuestions = async (topic: string, difficulty: string = 'intermediate'): Promise<Question[]> => {
  console.log(`Generating questions for topic: ${topic} at ${difficulty} difficulty`);
  
  try {
    // If we have mock questions for this topic, use them as a fallback
    const mockQuestionsForTopic = MOCK_QUESTIONS[topic];
    
    if (mockQuestionsForTopic) {
      // Return 10 questions for the quiz
      const randomizedQuestions = [...mockQuestionsForTopic]
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);
      
      return randomizedQuestions;
    }
    
    // For topics not in our mock database, return DSA questions as default
    return MOCK_QUESTIONS["Data Structures and Algorithms"]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
  } catch (error) {
    console.error("Error generating questions:", error);
    // Always fall back to mock questions if there's an error
    return MOCK_QUESTIONS["Data Structures and Algorithms"]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
  }
};

// We'll use the existing geminiService.ts for AI feedback analysis
