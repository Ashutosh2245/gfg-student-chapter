const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

// Default seed data for 7 departments
const initialDepartments = [
  { id: 1, name: 'Technical Team', slug: 'technical', description: 'Core software development, web engineering, competitive programming, and technical workshops.', icon: 'Code' },
  { id: 2, name: 'Social Media Team', slug: 'social-media', description: 'Managing brand presence, campaigns, digital outreach, and social analytics across platforms.', icon: 'Share2' },
  { id: 3, name: 'Event Management Team', slug: 'event-management', description: 'Planning, organizing, and executing seamless offline & online tech hackathons and workshops.', icon: 'Calendar' },
  { id: 4, name: 'Design Team', slug: 'design', description: 'UI/UX design, poster creation, branding assets, visual guides, and creative design systems.', icon: 'Palette' },
  { id: 5, name: 'Content & Research Team', slug: 'content-research', description: 'Drafting tech blogs, editorial newsletters, workshop scripts, research papers, and documentation.', icon: 'FileText' },
  { id: 6, name: 'Photography & Video Editing Team', slug: 'photography-video', description: 'Capturing event moments, producing recap reels, video editing, and media production.', icon: 'Camera' },
  { id: 7, name: 'PR & Outreach Team', slug: 'pr-outreach', description: 'Sponsorship management, community partnerships, guest speaker coordination, and public relations.', icon: 'Megaphone' }
];

// Default password hash for demo accounts: "gfgniet2026"
const DEFAULT_PASSWORD_HASH = "$2a$10$64W7w/O71ZpT/5Qx0y5Y8.e/K3Z9jKqj7U23l/K4J3H.123456789";

const initialUsers = [
  // Executive Leadership
  {
    id: 1,
    name: 'Ashutosh Kumar',
    email: 'president@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'PRESIDENT',
    department_id: null,
    position: 'Chapter President',
    bio: 'Passionate tech leader and full-stack developer dedicated to building a thriving developer community at NIET.',
    avatar_url: '/avatars/president.jpg',
    linkedin_url: 'https://linkedin.com/in/aarav-sharma-gfg',
    instagram_url: 'https://instagram.com/aarav_gfg',
    is_active: true
  },
  {
    id: 2,
    name: 'Ananya Verma',
    email: 'vp.tech@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'VICE_PRESIDENT',
    department_id: 1,
    position: 'Vice President (Technical)',
    bio: 'Competitive programmer and backend architect overseeing technical initiatives and hackathons.',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/ananya-verma-niet',
    instagram_url: 'https://instagram.com/ananya_v',
    is_active: true
  },
  {
    id: 3,
    name: 'Rohan Gupta',
    email: 'vp.ops@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'VICE_PRESIDENT',
    department_id: 3,
    position: 'Vice President (Operations)',
    bio: 'Event strategist ensuring seamless chapter logistics, partner relations, and community scale.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/rohan-gupta-ops',
    instagram_url: 'https://instagram.com/rohan_g',
    is_active: true
  },
  {
    id: 4,
    name: 'Isha Patel',
    email: 'coordinator1@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'COORDINATOR',
    department_id: 2,
    position: 'Chapter Coordinator',
    bio: 'Community builder coordinating social campaigns and student engagement programs.',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/isha-patel-coord',
    instagram_url: 'https://instagram.com/isha_p',
    is_active: true
  },
  {
    id: 5,
    name: 'Kabir Das',
    email: 'coordinator2@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'COORDINATOR',
    department_id: 7,
    position: 'Outreach Coordinator',
    bio: 'Fostering industry sponsorships and university partnerships.',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/kabir-das',
    instagram_url: 'https://instagram.com/kabir_d',
    is_active: true
  },

  // 1. Technical Team (Lead + 3 Co-Leads)
  {
    id: 6,
    name: 'Devansh Roy',
    email: 'lead.tech@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'LEAD',
    department_id: 1,
    position: 'Technical Team Lead',
    bio: 'Full-stack wizard, open-source enthusiast, leading dev sprints and code reviews.',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/devansh-roy',
    instagram_url: 'https://instagram.com/devansh_r',
    is_active: true
  },
  {
    id: 7,
    name: 'Kavya Singh',
    email: 'colead.tech1@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'CO_LEAD',
    department_id: 1,
    position: 'Technical Co-Lead (Web Frontend)',
    bio: 'Frontend enthusiast specialized in React, Tailwind, and interactive web UIs.',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/kavya-singh-web',
    instagram_url: 'https://instagram.com/kavya_s',
    is_active: true
  },
  {
    id: 8,
    name: 'Vikram Malhotra',
    email: 'colead.tech2@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'CO_LEAD',
    department_id: 1,
    position: 'Technical Co-Lead (Backend & Systems)',
    bio: 'Node.js & Database enthusiast building robust API microservices.',
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/vikram-malhotra-dev',
    instagram_url: 'https://instagram.com/vikram_m',
    is_active: true
  },
  {
    id: 9,
    name: 'Riddhi Joshi',
    email: 'colead.tech3@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'CO_LEAD',
    department_id: 1,
    position: 'Technical Co-Lead (Competitive Programming)',
    bio: 'Candidate Master on Codeforces, mentoring students in advanced data structures.',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/riddhi-joshi-cp',
    instagram_url: 'https://instagram.com/riddhi_j',
    is_active: true
  },

  // 2. Social Media Team (Lead + 3 Co-Leads)
  {
    id: 10,
    name: 'Priya Sharma',
    email: 'lead.social@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'LEAD',
    department_id: 2,
    position: 'Social Media Team Lead',
    bio: 'Digital strategist managing online engagement, Instagram Reels, and viral tech campaigns.',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/priya-sharma-social',
    instagram_url: 'https://instagram.com/priya_s',
    is_active: true
  },
  {
    id: 11,
    name: 'Amitabh Sen',
    email: 'colead.social1@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'CO_LEAD',
    department_id: 2,
    position: 'Social Media Co-Lead (LinkedIn)',
    bio: 'Drafting tech highlights, event announcements, and professional community updates.',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/amitabh-sen',
    instagram_url: 'https://instagram.com/amitabh_s',
    is_active: true
  },
  {
    id: 12,
    name: 'Tanvi Nair',
    email: 'colead.social2@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'CO_LEAD',
    department_id: 2,
    position: 'Social Media Co-Lead (Instagram)',
    bio: 'Reels video editor and social campaign manager.',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/tanvi-nair',
    instagram_url: 'https://instagram.com/tanvi_n',
    is_active: true
  },
  {
    id: 13,
    name: 'Harsh Vardhan',
    email: 'colead.social3@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'CO_LEAD',
    department_id: 2,
    position: 'Social Media Co-Lead (Analytics)',
    bio: 'Tracking social metrics, audience growth, and post performance analytics.',
    avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/harsh-vardhan-social',
    instagram_url: 'https://instagram.com/harsh_v',
    is_active: true
  },

  // 3. Event Management Team (Lead + 3 Co-Leads)
  {
    id: 14,
    name: 'Aditya Srivastava',
    email: 'lead.event@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'LEAD',
    department_id: 3,
    position: 'Event Management Lead',
    bio: 'Master planner organizing hackathons, venue booking, speaker slots, and logistics.',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/aditya-srivastava-events',
    instagram_url: 'https://instagram.com/aditya_s',
    is_active: true
  },
  {
    id: 15,
    name: 'Meera Rao',
    email: 'colead.event1@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'CO_LEAD',
    department_id: 3,
    position: 'Event Co-Lead (Logistics)',
    bio: 'Handling auditorium setup, audio-visual systems, and guest hosting.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/meera-rao',
    instagram_url: 'https://instagram.com/meera_r',
    is_active: true
  },
  {
    id: 16,
    name: 'Nikhil Saxena',
    email: 'colead.event2@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'CO_LEAD',
    department_id: 3,
    position: 'Event Co-Lead (Registration)',
    bio: 'Managing student check-ins, certificate distribution, and registration desks.',
    avatar_url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/nikhil-saxena',
    instagram_url: 'https://instagram.com/nikhil_s',
    is_active: true
  },
  {
    id: 17,
    name: 'Sneha Kulkarni',
    email: 'colead.event3@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'CO_LEAD',
    department_id: 3,
    position: 'Event Co-Lead (Hospitality)',
    bio: 'Coordinating guest speaker accommodations and student volunteer teams.',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/sneha-kulkarni',
    instagram_url: 'https://instagram.com/sneha_k',
    is_active: true
  },

  // 4. Design Team (Lead + 3 Co-Leads)
  {
    id: 18,
    name: 'Sanya Kapoor',
    email: 'lead.design@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'LEAD',
    department_id: 4,
    position: 'Design Team Lead',
    bio: 'UI/UX Lead crafting clean aesthetics, Figma design systems, and event banners.',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/sanya-kapoor-ux',
    instagram_url: 'https://instagram.com/sanya_k',
    is_active: true
  },
  {
    id: 19,
    name: 'Rohan Mehra',
    email: 'colead.design1@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'CO_LEAD',
    department_id: 4,
    position: 'Design Co-Lead (Posters)',
    bio: 'Graphic designer specialized in poster art, motion graphics, and typography.',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/rohan-mehra-design',
    instagram_url: 'https://instagram.com/rohan_m_des',
    is_active: true
  },
  {
    id: 20,
    name: 'Anushka Trivedi',
    email: 'colead.design2@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'CO_LEAD',
    department_id: 4,
    position: 'Design Co-Lead (UI/UX)',
    bio: 'Figma designer crafting web design systems and user journey prototypes.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/anushka-trivedi-ui',
    instagram_url: 'https://instagram.com/anushka_t',
    is_active: true
  },
  {
    id: 21,
    name: 'Yash Agarwal',
    email: 'colead.design3@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'CO_LEAD',
    department_id: 4,
    position: 'Design Co-Lead (Branding)',
    bio: 'Brand identity designer managing official chapter badges and merchandise vector art.',
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/yash-agarwal-design',
    instagram_url: 'https://instagram.com/yash_a_des',
    is_active: true
  },

  // 5. Content & Research Team (Lead + 3 Co-Leads)
  {
    id: 22,
    name: 'Ishaan Deshmukh',
    email: 'lead.content@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'LEAD',
    department_id: 5,
    position: 'Content & Research Lead',
    bio: 'Technical author and research lead managing GeeksforGeeks article submissions.',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/ishaan-deshmukh',
    instagram_url: 'https://instagram.com/ishaan_d',
    is_active: true
  },
  {
    id: 23,
    name: 'Divya Pandey',
    email: 'colead.content1@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'CO_LEAD',
    department_id: 5,
    position: 'Content Co-Lead (Technical Blogs)',
    bio: 'Writing tutorials on Python, Algorithms, and System Architecture.',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/divya-pandey-writer',
    instagram_url: 'https://instagram.com/divya_p',
    is_active: true
  },
  {
    id: 24,
    name: 'Siddharth Pillai',
    email: 'colead.content2@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'CO_LEAD',
    department_id: 5,
    position: 'Content Co-Lead (Newsletters)',
    bio: 'Authoring weekly GFG NIET dev updates and technology newsletters.',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/siddharth-pillai',
    instagram_url: 'https://instagram.com/siddharth_p',
    is_active: true
  },
  {
    id: 25,
    name: 'Kritika Sinha',
    email: 'colead.content3@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'CO_LEAD',
    department_id: 5,
    position: 'Content Co-Lead (Documentation)',
    bio: 'Maintaining project README files, API specs, and technical documentation.',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/kritika-sinha-docs',
    instagram_url: 'https://instagram.com/kritika_s',
    is_active: true
  },

  // 6. Photography & Video Editing Team (Lead + 3 Co-Leads)
  {
    id: 26,
    name: 'Varun Grover',
    email: 'lead.media@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'LEAD',
    department_id: 6,
    position: 'Photography & Media Lead',
    bio: 'Cinematographer and video director producing high-energy event aftermovies.',
    avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/varun-grover-media',
    instagram_url: 'https://instagram.com/varun_g_films',
    is_active: true
  },
  {
    id: 27,
    name: 'Prachi Jain',
    email: 'colead.media1@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'CO_LEAD',
    department_id: 6,
    position: 'Media Co-Lead (Photography)',
    bio: 'Event photographer capturing stage moments, hacker expressions, and award ceremonies.',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/prachi-jain-photo',
    instagram_url: 'https://instagram.com/prachi_j_clicks',
    is_active: true
  },
  {
    id: 28,
    name: 'Manish Rawat',
    email: 'colead.media2@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'CO_LEAD',
    department_id: 6,
    position: 'Media Co-Lead (Video Editing)',
    bio: 'Premiere Pro & After Effects video editor crafting fast-paced highlight reels.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/manish-rawat-edit',
    instagram_url: 'https://instagram.com/manish_r_edits',
    is_active: true
  },
  {
    id: 29,
    name: 'Shreya Ghosh',
    email: 'colead.media3@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'CO_LEAD',
    department_id: 6,
    position: 'Media Co-Lead (Motion Graphics)',
    bio: 'Motion graphics animator creating title cards and logo reveal animations.',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/shreya-ghosh-motion',
    instagram_url: 'https://instagram.com/shreya_g_anim',
    is_active: true
  },

  // 7. PR & Outreach Team (Lead + 3 Co-Leads)
  {
    id: 30,
    name: 'Karan Bhasin',
    email: 'lead.pr@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'LEAD',
    department_id: 7,
    position: 'PR & Outreach Team Lead',
    bio: 'Public relations strategist driving corporate sponsorships and industry speaker connections.',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/karan-bhasin-pr',
    instagram_url: 'https://instagram.com/karan_b',
    is_active: true
  },
  {
    id: 31,
    name: 'Simran Chadha',
    email: 'colead.pr1@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'CO_LEAD',
    department_id: 7,
    position: 'PR Co-Lead (Corporate Sponsorships)',
    bio: 'Managing sponsor proposals, pitch decks, and brand partner benefits.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/simran-chadha-pr',
    instagram_url: 'https://instagram.com/simran_c',
    is_active: true
  },
  {
    id: 32,
    name: 'Tarun Mathur',
    email: 'colead.pr2@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'CO_LEAD',
    department_id: 7,
    position: 'PR Co-Lead (Community Alliances)',
    bio: 'Partnering with developer communities across NCR colleges for joint hackathons.',
    avatar_url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/tarun-mathur',
    instagram_url: 'https://instagram.com/tarun_m',
    is_active: true
  },
  {
    id: 33,
    name: 'Nisha Bhatia',
    email: 'colead.pr3@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'CO_LEAD',
    department_id: 7,
    position: 'PR Co-Lead (Speaker Relations)',
    bio: 'Inviting tech lead speakers from Google, Microsoft, and Amazon for NIET keynotes.',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    linkedin_url: 'https://linkedin.com/in/nisha-bhatia-pr',
    instagram_url: 'https://instagram.com/nisha_b',
    is_active: true
  }
];

// Initial Tasks set to EMPTY so tasks default to ZERO and not assigned yet
const initialTasks = [];
const initialXPTransactions = [];
const initialTaskSubmissions = [];

const initialEvents = [
  {
    id: 1,
    title: 'CodeGenesis 2026: 24-Hour Hackathon',
    description: 'NIET GFG Student Chapter flagship 24-hour hackathon bringing together 300+ developers to build AI & Web3 solutions.',
    venue: 'Auditorium 1, NIET Campus',
    event_date: new Date(Date.now() + 14 * 86400000).toISOString(),
    status: 'UPCOMING',
    banner_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
    registration_url: 'https://unstop.com/hackathons/codegenesis-2026-niet'
  },
  {
    id: 2,
    title: 'Geeks Summer Coding Bootcamp',
    description: 'Interactive 3-day workshop on Data Structures, Algorithms, and System Design basics.',
    venue: 'Lab 4, Computer Science Block',
    event_date: new Date(Date.now() - 10 * 86400000).toISOString(),
    status: 'COMPLETED',
    banner_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200',
    registration_url: 'https://gfgniet.ac.in/events/bootcamp-2026'
  }
];

const initialAuditLogs = [
  { id: 1, actor_user_id: 1, action: 'SYSTEM_INIT', target_entity: 'SYSTEM', target_id: '1', details: { message: 'Initialized GFG NIET portal' }, created_at: new Date().toISOString() }
];

// Database Wrapper Pool / Memory Store Manager
class DatabaseManager {
  constructor() {
    this.usePostgres = false;
    this.pool = null;
    
    this.departments = [...initialDepartments];
    this.users = [...initialUsers];
    this.tasks = [...initialTasks];
    this.taskSubmissions = [...initialTaskSubmissions];
    this.xpTransactions = [...initialXPTransactions];
    this.events = [...initialEvents];
    this.auditLogs = [...initialAuditLogs];

    if (process.env.DATABASE_URL) {
      try {
        this.pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
          connectionTimeoutMillis: 3000
        });
        
        this.pool.query('SELECT NOW()', (err, res) => {
          if (!err) {
            console.log('✅ Connected to PostgreSQL database successfully.');
            this.usePostgres = true;
          } else {
            console.warn('⚠️ PostgreSQL service not connected. Operating with high-speed memory store adapter.');
          }
        });
      } catch (err) {
        console.warn('⚠️ PostgreSQL connection failed. Operating with fallback memory store adapter.');
      }
    }
  }

  async query(text, params = []) {
    if (this.usePostgres && this.pool) {
      try {
        return await this.pool.query(text, params);
      } catch (err) {
        console.error('PostgreSQL Query Error, falling back to memory store:', err.message);
      }
    }

    return this.memoryQuery(text, params);
  }

  memoryQuery(text, params) {
    const cleanText = text.trim().replace(/\s+/g, ' ');
    const lowerText = cleanText.toLowerCase();

    if (lowerText.includes('from departments')) {
      if (lowerText.includes('where id =') || lowerText.includes('where slug =')) {
        const val = params[0];
        const dept = this.departments.find(d => d.id == val || d.slug == val);
        return { rows: dept ? [dept] : [] };
      }
      return { rows: this.departments };
    }

    if (lowerText.includes('from users')) {
      let filtered = [...this.users];
      if (lowerText.includes('where email =')) {
        const emailVal = params[0];
        filtered = filtered.filter(u => u.email.toLowerCase() === String(emailVal).toLowerCase());
      }
      if (lowerText.includes('where id =')) {
        const idVal = params[0];
        filtered = filtered.filter(u => u.id == idVal);
      }
      if (lowerText.includes('department_id =')) {
        const deptId = params[params.length - 1];
        filtered = filtered.filter(u => u.department_id == deptId);
      }
      const result = filtered.map(u => {
        const dept = this.departments.find(d => d.id === u.department_id);
        return { ...u, department_name: dept ? dept.name : null, department_slug: dept ? dept.slug : null };
      });
      return { rows: result };
    }

    if (lowerText.includes('from tasks')) {
      let filtered = [...this.tasks];
      if (lowerText.includes('where department_id =')) {
        const deptId = params[0];
        filtered = filtered.filter(t => t.department_id == deptId);
      }
      if (lowerText.includes('assigned_to_user_id =')) {
        const userId = params[0];
        filtered = filtered.filter(t => t.assigned_to_user_id == userId);
      }
      if (lowerText.includes('where id =')) {
        const taskId = params[0];
        filtered = filtered.filter(t => t.id == taskId);
      }
      return { rows: filtered };
    }

    if (lowerText.includes('from xp_transactions')) {
      return { rows: this.xpTransactions };
    }

    if (lowerText.includes('from events')) {
      return { rows: this.events };
    }

    if (lowerText.includes('from task_submissions')) {
      return { rows: this.taskSubmissions };
    }

    if (lowerText.includes('from audit_logs')) {
      return { rows: this.auditLogs };
    }

    return { rows: [] };
  }
}

const db = new DatabaseManager();

module.exports = {
  query: (text, params) => db.query(text, params),
  dbInstance: db
};
