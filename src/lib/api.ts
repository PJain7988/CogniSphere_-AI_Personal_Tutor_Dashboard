import { UserProfile, Lesson } from './AppContext';

/**
 * Simulates a secure, asynchronous API request to the CogniSphere AI Tutor server.
 * Handles natural language questions and returns high-fidelity, context-aware answers.
 */
export async function askTutor(
  message: string, 
  profile: UserProfile, 
  lessonsList: Lesson[]
): Promise<string> {
  // Simulate standard REST API network roundtrip latency (1000ms)
  await new Promise(resolve => setTimeout(resolve, 1000));

  const name = profile.name;
  const difficulty = profile.difficulty;
  const level = profile.level;
  const streak = profile.streak;
  
  // Find current syllabus metrics
  const activeLesson = lessonsList.find(l => l.progress > 0 && l.progress < 100) || 
                       lessonsList.find(l => l.progress === 0) || 
                       lessonsList[0];
  const activeTitle = activeLesson ? activeLesson.title : "Introduction to Python";
  const activeProgress = activeLesson ? activeLesson.progress : 0;
  const activeSubject = activeLesson ? activeLesson.subject : "CS";
  const completedCount = lessonsList.filter(l => l.progress === 100).length;

  const cleanText = message.toLowerCase().trim();

  // 1. Greetings
  if (cleanText === 'hi' || cleanText === 'hello' || cleanText === 'hey' || cleanText === 'hlo' || cleanText === 'hola') {
    return `### Hello, ${name}! 👋
As your AI tutor, I am ready to study when you are. I see you're currently working on the **${difficulty}** track, maintaining a solid **${streak}-day** study streak!

We can:
- Review your current course: **${activeTitle}** (${activeProgress}% done)
- Practice with a custom quiz (just type \`quiz\`)
- Discuss details about eigenvectors, calculus limits, DNA sequencing, or Python graphs.

What is on your mind today?`;
  } 

  // 2. Project / Platform details
  if (cleanText.includes('project') || cleanText.includes('cognisphere') || cleanText.includes('what is this') || cleanText.includes('about')) {
    return `### About CogniSphere 🌌
CogniSphere is a premium, AI-driven adaptive dashboard designed to optimize your learning velocity.
- **User profile**: Student **${name}**
- **Difficulty tier**: **${difficulty}**
- **Level standing**: Level **${level}** (**${profile.xp} / ${profile.xpNextLevel} XP**)
- **Target objective**: "${profile.goals}"

You can click sidebar routes to study **Lessons**, check **Progress** charts, review **Tutor Analytics**, or chat with me. Ask me any math, science, or code question to get started!`;
  }

  // 3. Help menu
  if (cleanText === 'help' || cleanText === 'menu' || cleanText === 'features') {
    return `### AI Tutor Capabilities 🛠️
I can assist you with these topics and options:
- **Calculus Foundations**: Limits, continuity, derivatives, and integrations.
- **Linear Algebra**: Matrices, eigenvectors, and eigenvalues.
- **Biology & Chemistry**: DNA sequencing, genetics, and thermodynamics.
- **Computer Science**: Python basics, data structures, and graph traversal.
- **Skill assessments**: Ask me for a \`quiz\` on any subject!

How can I support your study session?`;
  }

  // 4. Thank you
  if (cleanText === 'thanks' || cleanText === 'thank you') {
    return `You're very welcome, **${name}**! Keeping up active collaboration is the key to mastering the **${difficulty}** track. I've awarded you **+15 XP** for our productive session. Let me know what we study next!`;
  }

  // 5. Calculus Limits
  if (cleanText.includes('calculus') || cleanText.includes('limit') || cleanText.includes('continuity')) {
    return `### Understanding Calculus Limits
Limits form the foundation of derivatives and integration.
- **Concept**: $\\lim_{x \\to c} f(x) = L$ means as $x$ gets arbitrarily close to $c$, $f(x)$ approaches $L$.
- **Continuity Condition**: A function $f(x)$ is continuous at $x = c$ if:
  1. $f(c)$ is defined.
  2. $\\lim_{x \\to c} f(x)$ exists.
  3. $\\lim_{x \\to c} f(x) = f(c)$.

Would you like to try solving a limit problem?`;
  } 

  // 6. Eigenvectors
  if (cleanText.includes('eigenvector') || cleanText.includes('eigenvalue') || cleanText.includes('linear algebra') || cleanText.includes('matrix')) {
    return `### Eigenvalues & Eigenvectors Explained
In linear algebra, a non-zero vector $v$ is an **eigenvector** of a square matrix $A$ if it satisfies:
$$A v = \\lambda v$$
where $\\lambda$ is a scalar known as the **eigenvalue**.

- **Geometric Intuition**: Multiplication by matrix $A$ only scales the vector $v$, without changing its direction.
- **Solving**: To find them, solve the characteristic equation: $\\det(A - \\lambda I) = 0$.

Would you like to walk through a $2\\times2$ matrix example?`;
  } 

  // 7. Biology / DNA
  if (cleanText.includes('genetics') || cleanText.includes('dna') || cleanText.includes('biology')) {
    return `### Introduction to DNA Sequencing
DNA contains the genetic blueprint of living organisms, structured as a double helix composed of four nucleotides:
- **Adenine (A)** pairs with **Thymine (T)**
- **Cytosine (C)** pairs with **Guanine (G)**

Modern sequencing methods (like Next-Gen Sequencing) read millions of small fragments in parallel, and assemble them bioically to resolve entire genomes. Let me know if you want to test your knowledge with a mini-quiz!`;
  } 

  // 8. Python / CS
  if (cleanText.includes('python') || cleanText.includes('dsa') || cleanText.includes('algorithm') || cleanText.includes('data structures') || cleanText.includes('graph')) {
    return `### Graph Traversal Algorithms
Graphs represent networks of nodes (vertices) connected by edges. The two primary methods of exploring a graph are:
1. **Breadth-First Search (BFS)**:
   - Explores neighbors layer-by-layer.
   - Uses a **Queue** (FIFO) data structure.
   - Ideal for finding the *shortest path* in unweighted graphs.
2. **Depth-First Search (DFS)**:
   - Explores as deep as possible down a path before backtracking.
   - Uses a **Stack** (LIFO) or recursion.
   - Perfect for checking connectivity or topological sorting.

Would you like me to write a Python snippet for BFS/DFS?`;
  } 

  // 9. Quiz
  if (cleanText.includes('quiz') || cleanText.includes('test')) {
    return `### Quick Assessment: Calculus Foundations
Here is a single-question quiz for you:
What is the value of $\\lim_{x \\to 0} \\frac{\\sin(x)}{x}$?
- A) $0$
- B) $1$
- C) $\\infty$
- D) Undefined

Reply with your answer (e.g. "B") and I'll score it for you!`;
  } 

  // 10. Quiz Answer B
  if (cleanText === 'b' || cleanText.includes('answer b') || cleanText === '1') {
    return `🎉 **Correct!** $\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$. 
This is a standard trigonometric limit proven using the Squeeze Theorem. Excellent job, **${name}**! I've awarded you **50 XP** for the correct answer.`;
  }

  // 11. Generic Fallback
  return `### Reviewing your query: "${message}"
I've noted your question, **${name}**! While I am optimizing my database for that specific inquiry, let's keep up your momentum on your **${difficulty}** track:
- **Active Course**: **${activeTitle}** (**${activeProgress}%** complete)
- **Current Syllabus progress**: **${completedCount} of ${lessonsList.length}** modules completed

Would you like me to explain a concept in **${activeSubject}**, or generate a custom quiz to boost your XP?`;
}
