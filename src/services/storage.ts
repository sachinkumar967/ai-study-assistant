import { UserProfile, ChatSession, ChatMessage, SubjectId, StudyModeId } from '../types';

const USERS_KEY = 'ai_study_users_v1';
const CURRENT_USER_KEY = 'ai_study_current_user_v1';
const CHATS_KEY_PREFIX = 'ai_study_chats_v1_';
const THEME_KEY = 'ai_study_theme_v1';

export const DEMO_USER: UserProfile = {
  id: 'usr_demo_student',
  name: 'Alex Rivera',
  email: 'alex.student@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  gradeLevel: 'High School (11th Grade)',
  targetGoal: 'Master Calculus & CS, Ace AP/College Prep',
  streakDays: 7,
  doubtsSolved: 42,
  minutesStudied: 380,
  favoriteSubjects: ['Mathematics', 'Science', 'Programming'],
  createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
};

// Seed sample chat sessions for realistic student history
export function createSeedChats(userId: string): ChatSession[] {
  return [
    {
      id: `chat_seed_1_${userId}`,
      title: 'Solving Quadratic Equations with Formula',
      subject: 'Mathematics',
      mode: 'doubt_solver',
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      messages: [
        {
          id: 'msg_1',
          role: 'user',
          content: 'Can you solve 3x² - 5x - 2 = 0 step by step using the quadratic formula?',
          timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
          subject: 'Mathematics',
          mode: 'doubt_solver',
        },
        {
          id: 'msg_2',
          role: 'assistant',
          content: `### 🎯 Problem Breakdown & Given Information
We have a second-degree polynomial equation:
$$3x^2 - 5x - 2 = 0$$
Standard quadratic form: $ax^2 + bx + c = 0$
- **$a = 3$**
- **$b = -5$**
- **$c = -2$**

### 🔑 Core Principles & Formulas Needed
The Quadratic Formula:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

Discriminant: $D = b^2 - 4ac$

### 📝 Step-by-Step Solution
**Step 1: Compute the Discriminant ($D$)**
$$D = (-5)^2 - 4(3)(-2)$$
$$D = 25 - (-24) = 25 + 24 = 49$$
Since $49 > 0$, there are **two distinct real roots**, and because $49$ is a perfect square ($\\sqrt{49} = 7$), the roots are rational!

**Step 2: Substitute into Quadratic Formula**
$$x = \\frac{-(-5) \\pm \\sqrt{49}}{2(3)}$$
$$x = \\frac{5 \\pm 7}{6}$$

**Step 3: Calculate both roots**
1. Positive branch:
   $$x_1 = \\frac{5 + 7}{6} = \\frac{12}{6} = 2$$
2. Negative branch:
   $$x_2 = \\frac{5 - 7}{6} = \\frac{-2}{6} = -\\frac{1}{3}$$

### 💡 Final Result
The solutions are:
$$\\mathbf{x = 2} \\quad \\text{and} \\quad \\mathbf{x = -\\frac{1}{3}}$$

### ⚠️ Common Mistakes & Pro-Tip
*Watch the signs!* When $b = -5$, $-b = -(-5) = +5$. A very common student error is writing $-5$ outside the radical. Double-check your factoring: $(3x + 1)(x - 2) = 3x^2 - 6x + x - 2 = 3x^2 - 5x - 2 = 0$. It matches perfectly!`,
          timestamp: new Date(Date.now() - 2 * 3600000 + 15000).toISOString(),
          subject: 'Mathematics',
          mode: 'doubt_solver',
        },
      ],
    },
    {
      id: `chat_seed_2_${userId}`,
      title: 'Newton\'s Third Law & Momentum',
      subject: 'Science',
      mode: 'concept_simplifier',
      createdAt: new Date(Date.now() - 26 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 26 * 3600000).toISOString(),
      messages: [
        {
          id: 'msg_3',
          role: 'user',
          content: 'Why doesn\'t Newton\'s 3rd law cancel out all forces in the universe if action equals reaction?',
          timestamp: new Date(Date.now() - 26 * 3600000).toISOString(),
          subject: 'Science',
          mode: 'concept_simplifier',
        },
        {
          id: 'msg_4',
          role: 'assistant',
          content: `### 1. The Core Idea in 1 Sentence
Action and reaction forces never cancel out because they **always act on two completely different objects**, never on the same object!

### 2. The Everyday Analogy
Imagine you and your friend are both wearing roller skates facing each other.
If you push your friend with your hands:
- **Action:** Your hands push your friend forward.
- **Reaction:** Your friend's chest pushes your hands backward with equal force.
Result? Your friend rolls backward, AND you roll backward!
Neither force cancels out because *one force was on your friend* and *one force was on you*.

### 3. How it Actually Works
1. **Newton's 2nd Law applies to ONE object:** $F_{net} = m \\cdot a$. To find if an object accelerates, you only sum forces acting ON that single object.
2. **Third Law pairs are on different bodies:** If Earth pulls downward on an apple with gravitational force $F$, the apple simultaneously pulls upward on the Earth with gravitational force $F$.
3. **Why only the apple falls:** The Earth has huge mass ($6 \\times 10^{24}$ kg), so Earth's acceleration is imperceptible, whereas the light apple accelerates at $9.8 \\text{ m/s}^2$.

### 4. Why it Matters in Real Life
This is how rockets propel themselves through empty space: the engine forcefully expels exhaust gases backward (action), and those escaping gases propel the rocket forward (reaction) without needing any air to "push against"!`,
          timestamp: new Date(Date.now() - 26 * 3600000 + 12000).toISOString(),
          subject: 'Science',
          mode: 'concept_simplifier',
        },
      ],
    },
  ];
}

// Auth Helpers
export function getAllRegisteredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [DEMO_USER];
  } catch {
    return [DEMO_USER];
  }
}

export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (err) {
    console.error('Error saving current user:', err);
  }
}

export function loginUser(email: string, password?: string): { success: boolean; user?: UserProfile; error?: string } {
  const users = getAllRegisteredUsers();
  const trimmed = email.trim().toLowerCase();
  const found = users.find((u) => u.email.toLowerCase() === trimmed);

  if (!found) {
    // If it's the demo email or user just typed anything, we can create or allow if wanted, but standard check:
    return {
      success: false,
      error: 'No account found with this email. Please check your spelling or sign up below.',
    };
  }

  setCurrentUser(found);
  return { success: true, user: found };
}

export function signupUser(params: {
  name: string;
  email: string;
  password?: string;
  gradeLevel?: string;
  targetGoal?: string;
  avatar?: string;
}): { success: boolean; user?: UserProfile; error?: string } {
  const users = getAllRegisteredUsers();
  const trimmed = params.email.trim().toLowerCase();

  if (users.some((u) => u.email.toLowerCase() === trimmed)) {
    return {
      success: false,
      error: 'An account with this email address already exists. Please log in.',
    };
  }

  const newUser: UserProfile = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: params.name.trim() || 'Student',
    email: trimmed,
    avatar:
      params.avatar ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(params.name || 'Scholar')}`,
    gradeLevel: params.gradeLevel || 'High School',
    targetGoal: params.targetGoal || 'Master STEM & Core Subjects',
    streakDays: 1,
    doubtsSolved: 0,
    minutesStudied: 15,
    favoriteSubjects: ['Mathematics', 'Science'],
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  setCurrentUser(newUser);

  // Initialize seed chats for this student
  const seedChats = createSeedChats(newUser.id);
  saveUserChats(newUser.id, seedChats);

  return { success: true, user: newUser };
}

export function loginAsDemoGuest(): UserProfile {
  let users = getAllRegisteredUsers();
  let demo = users.find((u) => u.id === DEMO_USER.id);
  if (!demo) {
    demo = DEMO_USER;
    users.push(demo);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  setCurrentUser(demo);

  // Ensure demo has chats
  const existing = getUserChats(demo.id);
  if (existing.length === 0) {
    saveUserChats(demo.id, createSeedChats(demo.id));
  }

  return demo;
}

export function logoutUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function updateUserProfile(updates: Partial<UserProfile>): UserProfile | null {
  const current = getCurrentUser();
  if (!current) return null;

  const updated: UserProfile = { ...current, ...updates };
  setCurrentUser(updated);

  // Update in users registry
  const users = getAllRegisteredUsers();
  const index = users.findIndex((u) => u.id === current.id);
  if (index >= 0) {
    users[index] = updated;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  return updated;
}

export function recordStudyActivity(doubtsCount: number = 1, minutes: number = 5): void {
  const current = getCurrentUser();
  if (!current) return;

  updateUserProfile({
    doubtsSolved: (current.doubtsSolved || 0) + doubtsCount,
    minutesStudied: (current.minutesStudied || 0) + minutes,
  });
}

// Chat Persistence
export function getUserChats(userId: string): ChatSession[] {
  try {
    const raw = localStorage.getItem(`${CHATS_KEY_PREFIX}${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
    // Return seed if empty
    const seeded = createSeedChats(userId);
    saveUserChats(userId, seeded);
    return seeded;
  } catch {
    return [];
  }
}

export function saveUserChats(userId: string, chats: ChatSession[]): void {
  try {
    localStorage.setItem(`${CHATS_KEY_PREFIX}${userId}`, JSON.stringify(chats));
  } catch (err) {
    console.error('Error saving chats:', err);
  }
}

export function saveOrUpdateChat(userId: string, session: ChatSession): ChatSession[] {
  const chats = getUserChats(userId);
  const index = chats.findIndex((c) => c.id === session.id);
  if (index >= 0) {
    chats[index] = session;
  } else {
    chats.unshift(session);
  }
  saveUserChats(userId, chats);
  return chats;
}

export function deleteChat(userId: string, chatId: string): ChatSession[] {
  const chats = getUserChats(userId);
  const filtered = chats.filter((c) => c.id !== chatId);
  saveUserChats(userId, filtered);
  return filtered;
}

export function clearAllChats(userId: string): void {
  saveUserChats(userId, []);
}

// Theme storage
export function getSavedTheme(): 'dark' | 'light' {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {}
  return 'dark'; // Default premium dark theme
}

export function saveTheme(theme: 'dark' | 'light'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch {}
}
