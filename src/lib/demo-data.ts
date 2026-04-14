/**
 * Hardcoded demo data used when Firebase is not configured.
 * Mirrors exactly what the seed script would write to Firestore.
 */
import type { Course, Review } from '@/types';

export const DEMO_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Complete Ethical Hacking & Cybersecurity Bootcamp',
    slug: 'ethical-hacking-bootcamp',
    description:
      'Master ethical hacking, penetration testing, and cybersecurity fundamentals. Learn to think like an attacker to build unbreakable defenses using Kali Linux, Metasploit, and more.',
    category: 'Cybersecurity',
    level: 'Intermediate',
    price: 45000,
    originalPrice: 75000,
    duration: '32 hours',
    lessons: 84,
    students: 1243,
    rating: 4.8,
    instructor: 'Dr. Chukwuemeka Obi',
    instructorBio:
      'CEH-certified security professional with 12+ years securing financial infrastructure. Former security consultant to CBN and leading Nigerian banks.',
    thumbnail: '',
    curriculum: [
      {
        moduleTitle: 'Introduction to Ethical Hacking',
        lessons: [
          { title: 'What is Ethical Hacking?', videoURL: '', duration: '12 min' },
          { title: 'Setting Up Kali Linux', videoURL: '', duration: '25 min' },
          { title: 'Attack Methodologies Overview', videoURL: '', duration: '18 min' },
        ],
      },
      {
        moduleTitle: 'Network Penetration Testing',
        lessons: [
          { title: 'Network Scanning with Nmap', videoURL: '', duration: '30 min' },
          { title: 'Vulnerability Assessment', videoURL: '', duration: '35 min' },
          { title: 'Exploitation with Metasploit', videoURL: '', duration: '45 min' },
        ],
      },
      {
        moduleTitle: 'Web Application Security',
        lessons: [
          { title: 'OWASP Top 10 Deep Dive', videoURL: '', duration: '28 min' },
          { title: 'SQL Injection Attacks & Defenses', videoURL: '', duration: '40 min' },
          { title: 'XSS and CSRF', videoURL: '', duration: '32 min' },
        ],
      },
    ],
    published: true,
    createdAt: '2024-01-15T10:00:00Z',
    tags: ['hacking', 'security', 'kali linux', 'penetration testing'],
  },
  {
    id: 'course-2',
    title: 'Full-Stack Web Development with Next.js & TypeScript',
    slug: 'fullstack-nextjs-typescript',
    description:
      'Build production-grade web applications from scratch using Next.js 14, TypeScript, Tailwind CSS, and PostgreSQL. Deploy to Vercel like a pro.',
    category: 'Web Development',
    level: 'Intermediate',
    price: 38000,
    originalPrice: 60000,
    duration: '48 hours',
    lessons: 112,
    students: 2105,
    rating: 4.9,
    instructor: 'Ngozi Effiong',
    instructorBio:
      'Full-stack engineer with 8 years of experience. Core contributor to several open-source projects. Builds systems serving millions of users.',
    thumbnail: '',
    curriculum: [
      {
        moduleTitle: 'HTML, CSS & JavaScript Foundations',
        lessons: [
          { title: 'HTML Semantics & Accessibility', videoURL: '', duration: '22 min' },
          { title: 'CSS Grid and Flexbox Mastery', videoURL: '', duration: '38 min' },
          { title: 'JavaScript ES2024 Features', videoURL: '', duration: '45 min' },
        ],
      },
      {
        moduleTitle: 'React & Next.js Fundamentals',
        lessons: [
          { title: 'React 18 Concepts', videoURL: '', duration: '35 min' },
          { title: 'Next.js App Router Deep Dive', videoURL: '', duration: '50 min' },
          { title: 'Server vs Client Components', videoURL: '', duration: '28 min' },
        ],
      },
      {
        moduleTitle: 'TypeScript for Production',
        lessons: [
          { title: 'TypeScript Types & Interfaces', videoURL: '', duration: '30 min' },
          { title: 'Generics & Utility Types', videoURL: '', duration: '35 min' },
          { title: 'Type-Safe API Routes', videoURL: '', duration: '40 min' },
        ],
      },
    ],
    published: true,
    createdAt: '2024-01-20T10:00:00Z',
    tags: ['nextjs', 'typescript', 'react', 'web development'],
  },
  {
    id: 'course-3',
    title: 'Data Science & Machine Learning with Python',
    slug: 'data-science-python',
    description:
      'From data cleaning to neural networks — master the full data science pipeline with Python, Pandas, Scikit-learn, and TensorFlow. Build 10 real-world projects.',
    category: 'Data Science',
    level: 'Beginner',
    price: 42000,
    originalPrice: 70000,
    duration: '55 hours',
    lessons: 130,
    students: 1876,
    rating: 4.7,
    instructor: 'Tunde Babalola',
    instructorBio:
      'PhD in Machine Learning from University of Lagos. Former research scientist at Microsoft Africa Research Institute. Makes AI approachable.',
    thumbnail: '',
    curriculum: [
      {
        moduleTitle: 'Python for Data Science',
        lessons: [
          { title: 'Python Basics & Data Types', videoURL: '', duration: '20 min' },
          { title: 'NumPy Arrays & Operations', videoURL: '', duration: '32 min' },
          { title: 'Pandas DataFrames', videoURL: '', duration: '45 min' },
        ],
      },
      {
        moduleTitle: 'Machine Learning Fundamentals',
        lessons: [
          { title: 'Supervised vs Unsupervised Learning', videoURL: '', duration: '25 min' },
          { title: 'Linear Regression from Scratch', videoURL: '', duration: '40 min' },
          { title: 'Decision Trees & Random Forests', videoURL: '', duration: '38 min' },
        ],
      },
    ],
    published: true,
    createdAt: '2024-02-01T10:00:00Z',
    tags: ['python', 'machine learning', 'data science', 'tensorflow'],
  },
  {
    id: 'course-4',
    title: 'AWS Cloud Practitioner to Solutions Architect',
    slug: 'aws-cloud-architect',
    description:
      'Master Amazon Web Services from zero to Solutions Architect level. Covers EC2, S3, RDS, Lambda, VPC, and prepares you for the AWS-SAA certification exam.',
    category: 'Cloud Computing',
    level: 'Beginner',
    price: 50000,
    originalPrice: 80000,
    duration: '40 hours',
    lessons: 96,
    students: 945,
    rating: 4.8,
    instructor: 'Amaka Okonkwo',
    instructorBio:
      'AWS Solutions Architect Professional and Kubernetes expert. Helped scale cloud infrastructure at Flutterwave and Paystack.',
    thumbnail: '',
    curriculum: [
      {
        moduleTitle: 'AWS Foundations',
        lessons: [
          { title: 'What is Cloud Computing?', videoURL: '', duration: '15 min' },
          { title: 'AWS Global Infrastructure', videoURL: '', duration: '20 min' },
          { title: 'IAM: Identity & Access Management', videoURL: '', duration: '35 min' },
        ],
      },
      {
        moduleTitle: 'Core AWS Services',
        lessons: [
          { title: 'EC2 Instances Deep Dive', videoURL: '', duration: '40 min' },
          { title: 'S3 Storage & Lifecycle Policies', videoURL: '', duration: '30 min' },
          { title: 'RDS & Database Options', videoURL: '', duration: '35 min' },
        ],
      },
    ],
    published: true,
    createdAt: '2024-02-10T10:00:00Z',
    tags: ['aws', 'cloud', 'solutions architect', 'certification'],
  },
  {
    id: 'course-5',
    title: 'Flutter Mobile Development — Build iOS & Android Apps',
    slug: 'flutter-mobile-development',
    description:
      'Learn to build beautiful, high-performance iOS and Android apps with a single codebase using Flutter and Dart. From widgets to production deployment on the app stores.',
    category: 'Mobile Development',
    level: 'Beginner',
    price: 35000,
    originalPrice: 55000,
    duration: '38 hours',
    lessons: 88,
    students: 782,
    rating: 4.6,
    instructor: 'Emeka Nwosu',
    instructorBio:
      'Senior mobile engineer with apps reaching 500K+ downloads on the Play Store. 7 years with Flutter since its beta release.',
    thumbnail: '',
    curriculum: [
      {
        moduleTitle: 'Dart Programming Language',
        lessons: [
          { title: 'Dart Variables & Types', videoURL: '', duration: '18 min' },
          { title: 'Functions & Classes in Dart', videoURL: '', duration: '30 min' },
          { title: 'Async/Await & Futures', videoURL: '', duration: '25 min' },
        ],
      },
      {
        moduleTitle: 'Flutter UI Development',
        lessons: [
          { title: 'Widgets: Stateless vs Stateful', videoURL: '', duration: '28 min' },
          { title: 'Layouts: Column, Row, Stack', videoURL: '', duration: '32 min' },
          { title: 'Navigation & Routing', videoURL: '', duration: '30 min' },
        ],
      },
    ],
    published: true,
    createdAt: '2024-02-15T10:00:00Z',
    tags: ['flutter', 'dart', 'mobile', 'ios', 'android'],
  },
  {
    id: 'course-6',
    title: 'DevOps Engineering: Docker, Kubernetes & CI/CD',
    slug: 'devops-docker-kubernetes',
    description:
      'Master modern DevOps practices. Learn Docker containerization, Kubernetes orchestration, GitHub Actions CI/CD pipelines, and infrastructure as code with Terraform.',
    category: 'DevOps',
    level: 'Advanced',
    price: 55000,
    originalPrice: 90000,
    duration: '44 hours',
    lessons: 98,
    students: 634,
    rating: 4.9,
    instructor: 'Amaka Okonkwo',
    instructorBio:
      'Kubernetes Certified Administrator. Built CI/CD pipelines handling 1,000+ deployments daily at top Nigerian fintechs.',
    thumbnail: '',
    curriculum: [
      {
        moduleTitle: 'Docker Fundamentals',
        lessons: [
          { title: 'What is Containerization?', videoURL: '', duration: '15 min' },
          { title: 'Writing Your First Dockerfile', videoURL: '', duration: '28 min' },
          { title: 'Docker Compose for Multi-Container Apps', videoURL: '', duration: '35 min' },
        ],
      },
      {
        moduleTitle: 'Kubernetes Orchestration',
        lessons: [
          { title: 'Kubernetes Architecture Overview', videoURL: '', duration: '30 min' },
          { title: 'Pods, Deployments & Services', videoURL: '', duration: '40 min' },
          { title: 'Helm Charts & Package Management', videoURL: '', duration: '35 min' },
        ],
      },
    ],
    published: true,
    createdAt: '2024-02-20T10:00:00Z',
    tags: ['docker', 'kubernetes', 'devops', 'ci/cd', 'terraform'],
  },
  {
    id: 'course-7',
    title: 'UI/UX Design Mastery: Figma to Production',
    slug: 'ux-design-figma',
    description:
      'Design stunning user interfaces and experiences from concept to developer handoff. Master Figma, design systems, user research, prototyping, and usability testing.',
    category: 'UI/UX Design',
    level: 'Beginner',
    price: 32000,
    originalPrice: 50000,
    duration: '30 hours',
    lessons: 72,
    students: 1102,
    rating: 4.7,
    instructor: 'Damilola Adekunle',
    instructorBio:
      'Senior product designer with a portfolio spanning fintech, healthtech, and e-commerce across 3 continents. 8 years crafting digital experiences.',
    thumbnail: '',
    curriculum: [
      {
        moduleTitle: 'Design Principles',
        lessons: [
          { title: 'The 7 Principles of Good Design', videoURL: '', duration: '20 min' },
          { title: 'Color Theory for Digital Products', videoURL: '', duration: '28 min' },
          { title: 'Typography in UI Design', videoURL: '', duration: '22 min' },
        ],
      },
      {
        moduleTitle: 'Figma Mastery',
        lessons: [
          { title: 'Figma Interface & Core Tools', videoURL: '', duration: '30 min' },
          { title: 'Components & Auto-Layout', videoURL: '', duration: '38 min' },
          { title: 'Prototyping & Interactions', videoURL: '', duration: '35 min' },
        ],
      },
    ],
    published: true,
    createdAt: '2024-03-01T10:00:00Z',
    tags: ['figma', 'ui design', 'ux', 'design systems', 'prototyping'],
  },
  {
    id: 'course-8',
    title: 'CompTIA Network+ Certification Prep',
    slug: 'comptia-network-plus',
    description:
      'Complete preparation for the CompTIA Network+ certification. Covers TCP/IP, network topologies, routing, switching, wireless networking, security, and troubleshooting.',
    category: 'Networking',
    level: 'Beginner',
    price: 28000,
    originalPrice: 45000,
    duration: '35 hours',
    lessons: 80,
    students: 568,
    rating: 4.5,
    instructor: 'Dr. Chukwuemeka Obi',
    instructorBio:
      'CompTIA Network+, Security+, and CEH certified. 15 years of networking and cybersecurity experience across telco and banking sectors.',
    thumbnail: '',
    curriculum: [
      {
        moduleTitle: 'Networking Fundamentals',
        lessons: [
          { title: 'OSI vs TCP/IP Model', videoURL: '', duration: '25 min' },
          { title: 'IP Addressing & Subnetting', videoURL: '', duration: '40 min' },
          { title: 'Ethernet & Switching Basics', videoURL: '', duration: '30 min' },
        ],
      },
      {
        moduleTitle: 'Routing & WAN Technologies',
        lessons: [
          { title: 'Static vs Dynamic Routing', videoURL: '', duration: '28 min' },
          { title: 'OSPF & BGP Overview', videoURL: '', duration: '35 min' },
          { title: 'VPN Technologies', videoURL: '', duration: '30 min' },
        ],
      },
    ],
    published: true,
    createdAt: '2024-03-10T10:00:00Z',
    tags: ['networking', 'comptia', 'certification', 'tcp/ip'],
  },
];

export const DEMO_REVIEWS: Review[] = [
  {
    id: 'review-1',
    courseId: 'course-1',
    studentId: 'demo-student-1',
    studentName: 'Emeka Nwosu',
    rating: 5,
    comment:
      "Best cybersecurity course I've taken. Dr. Obi explains complex concepts in a way that just clicks. The hands-on labs are incredibly practical.",
    createdAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'review-2',
    courseId: 'course-1',
    studentId: 'demo-student-2',
    studentName: 'Tola Adeyemi',
    rating: 5,
    comment:
      'Got my CEH certification after this course. The preparation was thorough and real-world. Highly recommend to anyone pursuing a security career.',
    createdAt: '2024-03-10T10:00:00Z',
  },
  {
    id: 'review-3',
    courseId: 'course-2',
    studentId: 'demo-student-3',
    studentName: 'Bola Cassidy',
    rating: 5,
    comment:
      "Ngozi is an exceptional teacher. The Next.js 14 content is cutting-edge and the TypeScript sections are very well structured. Worth every naira.",
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: 'review-4',
    courseId: 'course-3',
    studentId: 'demo-student-4',
    studentName: 'Adaeze Okonkwo',
    rating: 4,
    comment:
      'Comprehensive Python and data science content. The machine learning projects are portfolio-worthy. Could use more advanced neural network material.',
    createdAt: '2024-03-20T10:00:00Z',
  },
];

export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== '',
  );
}
