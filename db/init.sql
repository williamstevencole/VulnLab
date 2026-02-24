CREATE SCHEMA IF NOT EXISTS pentest_lab;
SET search_path to pentest_lab;

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    profile_color TEXT DEFAULT '#1d9bf0'
);

-- 2. Profiles Table
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT,
    bio TEXT,
    city TEXT
);

-- 3. Posts Table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Comments Table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DATA GENERATION SCRIPT
DO $$
DECLARE
    u_id INTEGER;
    p_id INTEGER;
    i INTEGER;
    usernames TEXT[] := ARRAY['admin_sys', 'sarah_j', 'mike_dev', 'crypto_king', 'chef_mario', 'sec_guru', 'gamer_pro', 'jane_d', 'john_s', 'alice_w', 'bob_b', 'charlie_b', 'david_b', 'eve_h', 'frank_s', 'grace_h', 'harry_p', 'isabel_a', 'jack_s', 'katherine_j', 'larry_p', 'marie_c', 'nikola_t', 'oprah_w', 'pablo_p', 'quentin_t', 'rosa_p', 'steve_j', 'thomas_e', 'ursula_l', 'vincent_v', 'walt_d', 'xena_w', 'yoda_m', 'linus_t', 'ada_l', 'alan_t', 'bill_g', 'mark_z', 'jeff_b', 'elon_m', 'tim_c', 'satya_n', 'sundar_p'];
    passwords TEXT[] := ARRAY['password123', 'qwerty', '123456', 'letmein', 'admin123', 'welcome', 'godmode', 'secret', 'password', 'hunter2', 'ninja', 'football', 'baseball', 'monkey', 'dragon', 'shadow', 'superman', 'batman', 'starwars'];
    colors TEXT[] := ARRAY['#1d9bf0', '#f4212e', '#ffad1f', '#17bf63', '#794bc4', '#e0245e', '#00ba7c', '#ff7a00'];
    post_contents TEXT[] := ARRAY[
        'Just setting up my vuln-twitter.',
        'Working on some new zero-day research today.',
        'Anyone else excited for the new tech stack?',
        'Python is the best language for scripting, period.',
        'Node.js concurrency is just unmatched for IO heavy apps.',
        'Is Bitcoin going to hit a new ATH this week?',
        'Does anyone have a good lasagna recipe?',
        'Found a weird bug in the login form...',
        'The security of this place is questionable.',
        'Traveling to Tokyo next week! Suggestions?',
        'Currently reading a book about distributed systems.',
        'Coffee is the fuel for my code.',
        'Why does CSS have to be so difficult sometimes?',
        'Finally finished my React project. It was a grind.',
        'Who else is watching the Quidditch finals tonight?',
        'The universe is under no obligation to make sense to you.',
        'Simple is better than complex.',
        'Readability counts.',
        'Now is better than never.',
        'Stay hungry, stay foolish.'
    ];
    comment_texts TEXT[] := ARRAY[
        'Totally agree with this!',
        'I am not so sure about that.',
        'Can you explain more?',
        'This is a game changer!',
        'Following this thread.',
        'LOL same.',
        'Great insight, thanks for sharing.',
        'I had the same issue yesterday.',
        'Interesting perspective.',
        'Nice post!',
        'Check your DMs.',
        'I tried this and it works.',
        'Wait, what?',
        'Indeed.',
        'Exactly!'
    ];
BEGIN
    FOR i IN 1..array_length(usernames, 1) LOOP
        INSERT INTO users (username, password, email, role, profile_color)
        VALUES (
            usernames[i], 
            CASE WHEN usernames[i] = 'admin_sys' THEN 'seguridadinformacion' ELSE passwords[(i % array_length(passwords, 1)) + 1] END, 
            usernames[i] || '@example.com',
            CASE WHEN usernames[i] = 'admin_sys' THEN 'admin' ELSE 'user' END,
            colors[(i % array_length(colors, 1)) + 1]
        ) RETURNING id INTO u_id;
        
        INSERT INTO profiles (user_id, full_name, bio) 
        VALUES (u_id, usernames[i], 'Passionate about tech');
    END LOOP;

    FOR i IN 1..70 LOOP
        INSERT INTO posts (user_id, content, created_at)
        VALUES (
            (SELECT id FROM users ORDER BY random() LIMIT 1),
            post_contents[(i % array_length(post_contents, 1)) + 1],
            now() - (i || ' hours')::interval
        ) RETURNING id INTO p_id;
        
        FOR j IN 1..(random() * 3 + 1) LOOP
            INSERT INTO comments (post_id, user_id, comment_text, created_at)
            VALUES (
                p_id,
                (SELECT id FROM users ORDER BY random() LIMIT 1),
                comment_texts[(floor(random() * array_length(comment_texts, 1)) + 1)::int],
                now() - (j || ' minutes')::interval
            );
        END LOOP;
    END LOOP;
END $$;
