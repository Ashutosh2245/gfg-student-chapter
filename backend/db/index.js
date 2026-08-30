const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const DATA_FILE_PATH = path.join(__dirname, 'dataStore.json');

// Initial seed data for 7 departments
const initialDepartments = [
  { id: 1, name: 'Technical Team', slug: 'technical', description: 'Core software development, web engineering, competitive programming, and technical workshops.', icon: 'Code' },
  { id: 2, name: 'Social Media Team', slug: 'social-media', description: 'Managing brand presence, campaigns, digital outreach, and social analytics across platforms.', icon: 'Share2' },
  { id: 3, name: 'Event Management Team', slug: 'event-management', description: 'Planning, organizing, and executing seamless offline & online tech hackathons and workshops.', icon: 'Calendar' },
  { id: 4, name: 'Design Team', slug: 'design', description: 'UI/UX design, poster creation, branding assets, visual guides, and creative design systems.', icon: 'Palette' },
  { id: 5, name: 'Content & Research Team', slug: 'content-research', description: 'Drafting tech blogs, editorial newsletters, workshop scripts, research papers, and documentation.', icon: 'FileText' },
  { id: 6, name: 'Photography & Video Editing Team', slug: 'photography-video', description: 'Capturing event moments, producing recap reels, video editing, and media production.', icon: 'Camera' },
  { id: 7, name: 'PR & Outreach Team', slug: 'pr-outreach', description: 'Sponsorship management, community partnerships, guest speaker coordination, and public relations.', icon: 'Megaphone' }
];

const DEFAULT_PASSWORD_HASH = "$2a$10$64W7w/O71ZpT/5Qx0y5Y8.e/K3Z9jKqj7U23l/K4J3H.123456789";

const initialUsers = [
  {
    id: 1,
    name: 'Aarav Sharma',
    email: 'president@gfgniet.ac.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'PRESIDENT',
    department_id: null,
    position: 'Chapter President',
    bio: 'Passionate tech leader and full-stack developer dedicated to building a thriving developer community at NIET.',
    avatar_url: '/logo.jpeg',
    linkedin_url: 'https://www.linkedin.com/in/ashutosh-kumar-92612b236',
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
  }
];

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
  }
];

class DatabaseManager {
  constructor() {
    this.usePostgres = false;
    this.pool = null;
    
    this.departments = [];
    this.users = [];
    this.tasks = [];
    this.taskSubmissions = [];
    this.xpTransactions = [];
    this.events = [];
    this.auditLogs = [];

    // Load from local persistent JSON store if exists
    this.loadFromFile();

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
            console.warn('⚠️ PostgreSQL service not connected. Operating with persistent local file store adapter.');
          }
        });
      } catch (err) {
        console.warn('⚠️ PostgreSQL connection failed. Operating with persistent local file store adapter.');
      }
    }
  }

  loadFromFile() {
    try {
      if (fs.existsSync(DATA_FILE_PATH)) {
        const raw = fs.readFileSync(DATA_FILE_PATH, 'utf8');
        const data = JSON.parse(raw);
        this.departments = data.departments || [...initialDepartments];
        this.users = data.users || [...initialUsers];
        this.tasks = data.tasks || [];
        this.taskSubmissions = data.taskSubmissions || [];
        this.xpTransactions = data.xpTransactions || [];
        this.events = data.events || [...initialEvents];
        this.auditLogs = data.auditLogs || [];
        console.log('💾 Loaded data from persistent store:', DATA_FILE_PATH);
      } else {
        this.departments = [...initialDepartments];
        this.users = [...initialUsers];
        this.tasks = [];
        this.taskSubmissions = [];
        this.xpTransactions = [];
        this.events = [...initialEvents];
        this.auditLogs = [];
        this.saveToFile();
      }
    } catch (err) {
      console.error('Error loading dataStore.json, fallback to defaults:', err.message);
      this.departments = [...initialDepartments];
      this.users = [...initialUsers];
      this.tasks = [];
      this.taskSubmissions = [];
      this.xpTransactions = [];
      this.events = [...initialEvents];
      this.auditLogs = [];
    }
  }

  saveToFile() {
    try {
      const data = {
        departments: this.departments,
        users: this.users,
        tasks: this.tasks,
        taskSubmissions: this.taskSubmissions,
        xpTransactions: this.xpTransactions,
        events: this.events,
        auditLogs: this.auditLogs
      };
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error persisting data to dataStore.json:', err.message);
    }
  }

  async query(text, params = []) {
    if (this.usePostgres && this.pool) {
      try {
        return await this.pool.query(text, params);
      } catch (err) {
        console.error('PostgreSQL Query Error, falling back to persistent memory store:', err.message);
      }
    }

    // Auto save on any state mutations
    const result = this.memoryQuery(text, params);
    this.saveToFile();
    return result;
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
