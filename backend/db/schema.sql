-- GFG Student Chapter NIET Database Schema
-- Database: PostgreSQL

DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS event_images CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS xp_transactions CASCADE;
DROP TABLE IF EXISTS task_submissions CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- 1. Departments
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'Layers',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('PRESIDENT', 'VICE_PRESIDENT', 'COORDINATOR', 'LEAD', 'CO_LEAD')),
    department_id INT REFERENCES departments(id) ON DELETE SET NULL,
    position VARCHAR(100) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    linkedin_url VARCHAR(255),
    instagram_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tasks
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    department_id INT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    assigned_to_user_id INT REFERENCES users(id) ON DELETE SET NULL,
    priority VARCHAR(20) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    difficulty VARCHAR(20) DEFAULT 'MEDIUM' CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD', 'MAJOR')),
    xp_points INT NOT NULL DEFAULT 10,
    deadline TIMESTAMP,
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'REVISION_REQUIRED', 'COMPLETED')),
    created_by_user_id INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Task Submissions
CREATE TABLE task_submissions (
    id SERIAL PRIMARY KEY,
    task_id INT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    submitted_by_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT,
    proof_url VARCHAR(500),
    proof_type VARCHAR(50) DEFAULT 'LINK',
    status VARCHAR(30) DEFAULT 'UNDER_REVIEW' CHECK (status IN ('UNDER_REVIEW', 'APPROVED', 'REJECTED', 'REVISION_REQUIRED')),
    reviewer_comment TEXT,
    reviewed_by_user_id INT REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. XP Audit Transactions
CREATE TABLE xp_transactions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id INT REFERENCES tasks(id) ON DELETE SET NULL,
    xp_amount INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    awarded_by_user_id INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Events
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    venue VARCHAR(200) NOT NULL,
    event_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'UPCOMING' CHECK (status IN ('UPCOMING', 'ONGOING', 'COMPLETED')),
    banner_url VARCHAR(500),
    registration_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Event Images
CREATE TABLE event_images (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    caption VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Achievements
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    badge_icon VARCHAR(50) DEFAULT 'Award',
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Audit Logs
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    actor_user_id INT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_entity VARCHAR(50) NOT NULL,
    target_id VARCHAR(50),
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for optimal querying
CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_tasks_department ON tasks(department_id);
CREATE INDEX idx_tasks_assigned_user ON tasks(assigned_to_user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_xp_user ON xp_transactions(user_id);
CREATE INDEX idx_submissions_task ON task_submissions(task_id);
