import { useEffect, useRef, useCallback, useState } from 'react';
import './map.css';

// ════════════════════════════════════════════════════════
//  TYPES
// ════════════════════════════════════════════════════════

export interface RuneParticle {
  x: number; y: number; symbol: string; size: number;
  speedX: number; speedY: number; rotation: number; rotSpeed: number; alpha: number;
}
export interface BookPage { title: string; taught: string; learnt: string; }
export interface Book { id: string; spineTitle: string; spineColor: string; coverColor: string; pages: BookPage[]; }
export interface Door {
  id: string; icon: string; ornamentL: string; ornamentR: string;
  label: string; subtitle: string; tag: string;
  roomTitle: string; roomDesc: string;
  glowColor: string; doorImg: string; tintColor: string;
  nodeLabel: string; books: Book[];
}

// ════════════════════════════════════════════════════════
//  DATA  (8 doors, 3 books each)
// ════════════════════════════════════════════════════════

const RUNE_SET = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛈ', 'ᛇ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ', '⚡', '✦', '✧', '⊕', '⊗', '⋆'];

export const ALL_DOORS: Door[] = [
  {
    id: 'weapons', icon: '🌙', ornamentL: '⛧', ornamentR: '☀️',
    label: 'WEAPONS', subtitle: 'corridor of celestial wonders', tag: 'celestial navigation',
    glowColor: '#8b6cf7', doorImg: '/door.png', tintColor: 'rgba(14,6,46,0.70)', nodeLabel: 'I',
    roomTitle: 'The Hall of Astronomy', roomDesc: 'Celestial globes hum with orichalcum. The astrolabe of Hypatia still turns.',
    books: [
      // Book 1: Resume & Cover Letter Writing
      {
        id: 'resume-writing', spineTitle: 'Resume & Cover Letter Writing', spineColor: '#4a3090', coverColor: '#1a0a40',
        pages: [
          { title: 'Resume Writing', learnt: 'Resume is tailored to a job position. Chromological Format goes backwords in time. Functional is better suited for graduating students. Always check for grammar and formatting errors. Use action verbs to highlight your skills. Guantify and qualify skills', taught: 'What is Resume. The standard format for writing Resume both Chronological and Functional. Tips' },
          { title: 'Cover Letter Writing', learnt: 'Research the organization mission, vision and values. The cover letter must be customized for the specific company, cover two or three key requirements from the job advertisement', taught: 'Basic cover letter format. ' },
          { title: 'Recommendation Letter Writing', learnt: '', taught: '' },
        ]
      },

      // Book 2: How to Learn 
      {
        id: 'learning', spineTitle: 'How to Learn', spineColor: '#3a2080', coverColor: '#0e0630',
        pages: [
          { title: 'How to Learn', learnt: 'Two forms of learning, focused and diffuse. Focused Model requires concentration while Diffused is in a relaxed environment.', taught: 'Learning techniques, Learning models' },
        ]
      },

      // Book 3: Git & GitHub
      {
        id: 'version-control', spineTitle: 'Version Control', spineColor: '#5a3a9a', coverColor: '#180848',
        pages: [
          { title: 'Git & GitHub', learnt: 'Created by Linus Torvald in 2005.', taught: 'For millennia sailors used the stars to cross oceans. Polaris sits almost directly above Earth\'s north pole. The Southern Cross guides southern hemisphere navigators. Sextants measure the angle between stars and the horizon to calculate latitude.' },
          ]
      },
    ],
  },
  {
    id: 'Truth', icon: '📚', ornamentL: '✍️', ornamentR: '💡',
    label: 'THE TRUTH', subtitle: 'words, time & the art of thinking', tag: 'skills & communication',
    glowColor: '#2ecc71', doorImg: '/door-alchemy.svg', tintColor: 'rgba(0,18,6,0.65)', nodeLabel: 'II',
    roomTitle: 'The Scholar\'s Alcove', roomDesc: 'Six volumes rest here — each one a tool forged for the mind that dares to lead.',
    books: [
      // Book 1: ICT Track 2 Vol 2
      {
        id: 'ict-track', spineTitle: 'ICT Track Vol 2', spineColor: '#1a6a30', coverColor: '#0a2a12',
        pages: [
          {
            title: 'Intro to Python',
            taught: 'Discused Python syntax using NoteBook, this like function, data types, control statements e.t.c. Practical Exercise: Maize Farmer Problem, Height Converter',
            learnt: 'Python is a high-level, dynamically typed programming language. Its huge library and cross platform capabilities are what makes it good for DataScience. Python uses snale_case naming convention and is case-sensitive. '
          },
        ]
      },

      // Book 2: Work & Time Management
      {
        id: 'time-work', spineTitle: 'Work & Time Management', spineColor: '#2a8a40', coverColor: '#0d3018',
        pages: [
          {
            title: 'Work & Time Management',
            taught: 'Eisenhower Matrix and Prioritization - Prioritizing work against importance and urgency. Time Blocking Strategies - Utilizing techniques such as Promodoro to reduce mental fatigue. Utilizing tools like Calenders, Reminders to help with task management and reminders so as to reduce last minute rash. Defining goals and tasks for easier management and visualizing what "Done" looks to you so that you can be able to keep yourself accountable',
            learnt: 'I learnt using the Eisenhower Matrix as a tool for work management. Defining what the end of task look like helps me plan the task better and also helps with self accountability. Task tracking helps in identifiying and planing todo schedules with a clear and planned timeline. Time blocking works better when leaveraging tools and being rigid with your schedule.'
          },
        ]
      },

      // Book 3: Public Speaking
      {
        id: 'public-speaking', spineTitle: 'Speaking & Writing Speech', spineColor: '#1a5a28', coverColor: '#081e10',
        pages: [
          {
            title: 'Mastering the Stage',
            taught: 'Why Public Speecking skills matters in Tech just as much the tech skills. Understanding stage presence and wways to capture the attention of your audience using the Mehrabian Formula. Prompt Speeking formula to use when on stage.',
            learnt: 'Techincal Interviews, Team Collaborations, Leadership presence all rely on this skill. The Mwhrabian Formula suggest 55% of stage presence is reliant on body language, 38% on tone of voice and 7% on the words spoken. Practising the speech and visualizing sucess are all under preparation formula. Techinques to boost confidence iclude Power pose, Box Breathing, Anchor Phrase, Picking an Ally in the audience. The PREP framework for Prompt to speech.'
          },
        ]
      },

      // Book 4: Storytelling in Speech Writing
      {
        id: 'speech-writing', spineTitle: 'Storytelling in Speech Writing', spineColor: '#1a5a28', coverColor: '#081e10',
        pages: [
          {
            title: 'Building the Middle',
            taught: 'Building the missle part of the speech to add depth and context to the speech after the openning paragraph. This paragraphs should by Vivid - described by words, used to show contex of the story behind the speech and have higlights lessons to draw from. Also taught the Rights and Wrongs when it comes to building the center of the speech. Final paragraphs restates the point from the story, outline the lessons and end on a creative and optimistic outlook ',
            learnt: 'Write only one lessons per paragraph for smooth transition and clear highlights. Avoid introducing new characters in the areas esspecially if they are not relevant or part of the story. Depth is much better than quantity in this section. Short sentences will always win and are quite helpful when it comes to delivery. Avoid using Rhetorical Devices in the speech.'
          },
        ]
      },

      // Book 5: Mozilla Global Assemblies 1
      {
        id: 'mozilla-KamiLimu', spineTitle: 'Mozilla Global Assemblies', spineColor: '#1a5a28', coverColor: '#081e10',
        pages: [
          {
            title: 'AI x Democracy',
            taught: 'Responsible use of Artifical Intelligence inaccordance to Human Ethics. Levaraging on AI to improve democracy within the society. Identifying areas in which AI can be used to enable quality Information, Institutions transparency and expand Civic Space. Challenges and opportunities AI imposes on Higher Education and Research. Responsible AI in action',
            learnt: 'Responsible Computing prctices. How AI can be leveraged to improve democracy within the society. Researching and identfying problems that can be solved within the society. Challenges and opportunities AI imposes on Higher Education and Research. '
          },
        ]
      },

      // Book 6: Principles of Innovation
      {
        id: 'principle-innovation', spineTitle: 'Principles of Innovation', spineColor: '#1a5a28', coverColor: '#081e10',
        pages: [
          {
            title: 'Principles of Innovation',
            taught: 'What is innovation. Types in which innovations can be classified into. What qualities make a good innovation. The areas which creativity and innovation intersect. Two paths from which innovation opportunity is drawn from: Demand Pull & Technical Push. Innovation and its impact on the World.',
            learnt: 'The practical implemtation of ideas that results to the introduction of new or improvements of goods/services is Innovation. The difference between Incremental Innovation vs Radical Innovation. Creativity sparks ideas while Innovation implements those new ideas into practical solutions. The impact of innovation can be measured immediately or in the long run. Not all innovation sparks startups and not all startups are based on innovation '
          },
        ]
      },
    ],
  },
  {
    id: 'mythos', icon: '🐉', ornamentL: '🏺', ornamentR: '📖',
    label: 'LEGENDARIUM', subtitle: 'whispers of forgotten gods', tag: 'mythic epics',
    glowColor: '#e67e22', doorImg: '/door-mythos.svg', tintColor: 'rgba(28,8,0,0.62)', nodeLabel: 'III',
    roomTitle: 'The Hall of Epics', roomDesc: 'The Muses breathe softly between papyrus pages. Heroes walk these walls.',
    books: [
      {
        id: 'greek-myths', spineTitle: 'Greek Myths', spineColor: '#8a4a10', coverColor: '#2a1600',
        pages: [
          { title: 'The Olympians', taught: '', learnt: 'Twelve gods ruled from Olympus: Zeus (sky & thunder), Hera (marriage), Poseidon (sea), Demeter (harvest), Athena (wisdom), Apollo (sun & arts), Artemis (moon & hunt), Ares (war), Aphrodite (love), Hephaestus (forge), Hermes (messengers), Dionysus (wine).' },
          { title: 'The Iliad & Odyssey', taught: '', learnt: 'The Iliad covers 51 days in the ten-year Trojan War — Achilles\'s rage, Hector\'s nobility, the fall of Troy. The Odyssey follows Odysseus\'s 10-year voyage home: Cyclops, Sirens, Circe, and the suitors of Ithaca.' }
        ]
      },
      {
        id: 'world-myths', spineTitle: 'World Myths', spineColor: '#9a5a18', coverColor: '#2e1a08',
        pages: [
          { title: 'Creation Myths', taught: '', learnt: 'Every culture explains its origins: Egyptian Atum rose from chaos waters; Norse Ymir\'s body became the world; Hindu Brahma created from a lotus; Aztec gods sacrificed themselves to create the Fifth Sun. These stories encode deep truths about how cultures understand existence.' },
          { title: 'The Hero\'s Journey', taught: '', learnt: 'Joseph Campbell identified a universal mythic structure: the hero receives a call to adventure, crosses a threshold, faces trials, finds a boon, and returns transformed. Gilgamesh, Heracles, Osiris, Beowulf, Buddha — all follow this pattern.' }
        ]
      },
      {
        id: 'lost-civilizations', spineTitle: 'Lost Worlds', spineColor: '#7a3a08', coverColor: '#220e00',
        pages: [
          { title: 'Atlantis & Lost Lands', taught: '', learnt: 'Plato described Atlantis in 360 BCE as a powerful naval empire that sank in a single day. The Bronze Age collapse (1200 BCE) saw the Mycenaeans, Hittites, and Egyptians all fall within decades — its causes still debated.' },
          { title: 'The Emerald Tablet', taught: '', learnt: 'Attributed to Hermes Trismegistus: "As above, so below." Medieval alchemists believed it encoded the secret of transmutation. Modern interpretation reads it as a metaphor for the relationship between macrocosm and microcosm, mind and matter.' }
        ]
      },
    ],
  },
  {
    id: 'geometry', icon: '🔺', ornamentL: '📐', ornamentR: '⬟',
    label: 'THE MAP CHAMBER', subtitle: 'sacred geometry & cartomancy', tag: 'sacred cartography',
    glowColor: '#3498db', doorImg: '/door-geometry.svg', tintColor: 'rgba(0,12,28,0.62)', nodeLabel: 'IV',
    roomTitle: "The Cartographers' Apse", roomDesc: 'Every map is a spell. The lines between places carry hidden power.',
    books: [
      {
        id: 'mathematics', spineTitle: 'Mathematics', spineColor: '#1a5a8a', coverColor: '#081828',
        pages: [
          { title: 'Euclidean Geometry', taught: '', learnt: 'Euclid\'s Elements (300 BCE) built all of geometry from five postulates. The fifth — that parallel lines never meet — held for 2000 years until Riemann and Lobachevsky proved curved geometries were equally valid. Einstein used Riemannian geometry to describe spacetime in General Relativity.' },
          { title: 'Calculus & Change', taught: '', learnt: 'Newton and Leibniz independently invented calculus in the 1660s–70s. Derivatives measure instantaneous rate of change; integrals sum continuous quantities. The fundamental theorem links them: differentiation and integration are inverse operations.' }
        ]
      },
      {
        id: 'sacred-geo', spineTitle: 'Sacred Geometry', spineColor: '#0a4a7a', coverColor: '#041220',
        pages: [
          { title: 'The Golden Ratio', taught: '', learnt: 'φ ≈ 1.618 appears in the Fibonacci sequence, nautilus shells, sunflower spirals, the proportions of the Parthenon, and the DNA helix. A rectangle with sides in ratio φ:1 can be recursively subdivided into a square and a smaller golden rectangle forever.' },
          { title: 'Sacred Patterns', taught: '', learnt: 'The Flower of Life — overlapping circles in hexagonal symmetry — appears in temples from Egypt to China. The Platonic solids were believed by Plato to be the building blocks of fire, earth, air, the cosmos, and water respectively.' }
        ]
      },
      {
        id: 'cartography', spineTitle: 'Cartography', spineColor: '#2a6a9a', coverColor: '#0a1e30',
        pages: [
          { title: 'History of Maps', taught: '', learnt: 'Ptolemy\'s 2nd-century world map used latitude and longitude with projection techniques. Arab cartographer al-Idrisi (1154 CE) produced the most accurate medieval maps. The Age of Exploration produced Mercator\'s 1569 projection — still the default web map today.' },
          { title: 'Modern Mapping', taught: '', learnt: 'GPS uses 24+ satellites, triangulating your position from signal timing to within metres. GIS layers data onto maps — population, climate, geology. Google Earth combines satellite imagery, terrain data, and street photography into a complete digital twin of Earth.' }
        ]
      },
    ],
  },
  {
    id: 'spirits', icon: '👁️', ornamentL: '☽', ornamentR: '☾',
    label: 'SPIRIT OBSERVATORY', subtitle: 'the veil between worlds', tag: 'esoteric visions',
    glowColor: '#9b59b6', doorImg: '/door-spirits.svg', tintColor: 'rgba(16,4,28,0.62)', nodeLabel: 'V',
    roomTitle: 'The Threshold Library', roomDesc: 'Half here, half elsewhere. These books exist on both sides of the veil.',
    books: [
      {
        id: 'philosophy', spineTitle: 'Philosophy', spineColor: '#5a2a8a', coverColor: '#180828',
        pages: [
          { title: 'The Big Questions', taught: '', learnt: 'Philosophy asks: What exists? (metaphysics) What can we know? (epistemology) What is good? (ethics)? Socrates claimed to know nothing; Descartes doubted everything until "I think, therefore I am"; Hume questioned causation; Kant synthesised empiricism and rationalism.' },
          { title: 'Consciousness', taught: '', learnt: 'The "hard problem" of consciousness: why does physical brain activity feel like something? Philosophers debate whether consciousness is reducible to physics (physicalism), requires something extra (dualism), or pervades all matter (panpsychism).' }
        ]
      },
      {
        id: 'psychology', spineTitle: 'Psychology', spineColor: '#6a3a9a', coverColor: '#1e0a30',
        pages: [
          { title: 'How the Mind Works', taught: '', learnt: 'The brain has ~86 billion neurons, each making thousands of connections. System 1 (fast, intuitive) and System 2 (slow, deliberate) thinking describe cognitive biases — the predictable errors in human reasoning, catalogued by Kahneman.' },
          { title: 'Memory & Learning', taught: '', learnt: 'Working memory holds ~7 items for seconds. Long-term memory encodes through repetition, emotion, and meaning. The hippocampus consolidates memories during sleep. Spaced repetition is the single most evidence-backed method for retaining knowledge.' }
        ]
      },
      {
        id: 'meditation', spineTitle: 'Inner Worlds', spineColor: '#4a1a7a', coverColor: '#140420',
        pages: [
          { title: 'Meditation & Mindfulness', taught: '', learnt: 'Meditation training changes brain structure: regular practice thickens the prefrontal cortex and shrinks the amygdala. MBSR has clinical evidence for reducing anxiety, chronic pain, and depression. Even 10 minutes daily produces measurable changes in 8 weeks.' },
          { title: 'Dreams & the Unconscious', taught: '', learnt: 'REM sleep consolidates emotional memories and facilitates creative connections. Jung described the unconscious as containing a "shadow" (repressed aspects of self) and archetypes — universal patterns shared across all human cultures and myths.' }
        ]
      },
    ],
  },
  {
    id: 'bestiary', icon: '🦄', ornamentL: '🐺', ornamentR: '🦅',
    label: 'THE BESTIARY VAULTS', subtitle: 'where mythic creatures dwell', tag: 'creatures of legend',
    glowColor: '#27ae60', doorImg: '/door-bestiary.svg', tintColor: 'rgba(0,10,2,0.62)', nodeLabel: 'VI',
    roomTitle: 'The Menagerie of Wonders', roomDesc: 'Illustrated volumes stir on the shelves. Something watches from between the pages.',
    books: [
      {
        id: 'biology', spineTitle: 'Biology', spineColor: '#1a6a2a', coverColor: '#081e0a',
        pages: [
          { title: 'The Cell — Unit of Life', taught: '', learnt: 'Every living thing is made of cells. The mitochondria converts glucose to ATP through cellular respiration. Your body contains ~37 trillion cells, each containing ~2 metres of DNA coiled into chromosomes.' },
          { title: 'Evolution by Natural Selection', taught: '', learnt: 'Darwin\'s 1859 insight: individuals with heritable traits better suited to their environment survive and reproduce more. All life on Earth shares a common ancestor ~3.7 billion years ago. The tree of life branches into three domains: Bacteria, Archaea, and Eukarya.' }
        ]
      },
      {
        id: 'ecology', spineTitle: 'Ecology', spineColor: '#2a7a38', coverColor: '#0a2210',
        pages: [
          { title: 'Ecosystems & Food Webs', taught: '', learnt: 'An ecosystem is a community of organisms interacting with their physical environment. Only ~10% of energy transfers between trophic levels. Keystone species have disproportionate effects: removing wolves from Yellowstone changed the entire river system.' },
          { title: 'Biodiversity & Conservation', taught: '', learnt: 'Earth hosts ~8.7 million species; only ~1.5 million are named. We are in the 6th mass extinction. Coral reefs cover 0.1% of the ocean floor but support 25% of all marine species.' }
        ]
      },
      {
        id: 'animals', spineTitle: 'Animal Kingdom', spineColor: '#187a28', coverColor: '#061a08',
        pages: [
          { title: 'Extraordinary Animals', taught: '', learnt: 'Octopuses have three hearts and can edit their own RNA. Tardigrades survive vacuum and radiation. Migratory birds navigate by Earth\'s magnetic field. Ants have been farming fungi for 60 million years.' },
          { title: 'Plants & Fungi', taught: '', learnt: 'Plants communicate through root networks and airborne chemicals. Fungi are more closely related to animals than plants. Mycorrhizal networks link tree roots across forests, sharing nutrients and chemical warning signals between trees.' }
        ]
      },
    ],
  },
  {
    id: 'forge', icon: '⚒️', ornamentL: '🔥', ornamentR: '⚙️',
    label: 'THE FORGE OF MINDS', subtitle: 'where ideas are hammered into form', tag: 'technology & invention',
    glowColor: '#e74c3c', doorImg: '/door-forge.svg', tintColor: 'rgba(30,6,0,0.65)', nodeLabel: 'VII',
    roomTitle: 'The Workshop of Inventions', roomDesc: 'Every tool here was once only a thought. The heat of making still radiates from the walls.',
    books: [
      {
        id: 'computing', spineTitle: 'Computing', spineColor: '#7a1a10', coverColor: '#220800',
        pages: [
          { title: 'How Computers Think', taught: '', learnt: 'Everything in a computer is binary — 0s and 1s. Modern CPUs have billions of transistors. Logic gates (AND, OR, NOT) combine to perform arithmetic, memory, and control. The stored-program concept (von Neumann, 1945) defines all modern computers.' },
          { title: 'The Internet', taught: '', learnt: 'The internet is a global network using TCP/IP protocols. Packets of data travel independently and reassemble at the destination. The web was invented by Tim Berners-Lee in 1989 as a way to share physics papers at CERN.' }
        ]
      },
      {
        id: 'ai', spineTitle: 'Artificial Intelligence', spineColor: '#8a2018', coverColor: '#280a06',
        pages: [
          { title: 'Machine Learning', taught: '', learnt: 'Instead of programming rules, ML systems learn patterns from data. Neural networks stack layers of weighted connections. Training adjusts weights using backpropagation. Deep learning powers image recognition, translation, and speech recognition.' },
          { title: 'AI & the Future', taught: '', learnt: 'Narrow AI excels at specific tasks — chess, protein folding (AlphaFold solved 200 million protein structures), radiology. Large Language Models learn language statistics. Alignment (making AI goals match human values) is the central unsolved safety challenge.' }
        ]
      },
      {
        id: 'engineering', spineTitle: 'Engineering', spineColor: '#6a1208', coverColor: '#1e0602',
        pages: [
          { title: 'Structural Engineering', taught: '', learnt: 'The Eiffel Tower\'s iron lattice distributes wind loads through triangular trusses. The Romans invented concrete that gets stronger underwater — the secret (volcanic ash + seawater) was only decoded in 2017. The Panama Canal lifts ships 26 metres using lock chambers.' },
          { title: 'Space Engineering', taught: '', learnt: 'The Saturn V rocket burned 15 tonnes of propellant per second. SpaceX\'s reusable Falcon 9 reduced launch costs 90x. The International Space Station orbits at 400km, travelling 28,000 km/h — completing 16 sunrises every 24 hours.' }
        ]
      },
    ],
  },
  {
    id: 'oracle', icon: '🔮', ornamentL: '𓂀', ornamentR: '✦',
    label: "THE ORACLE'S THRONE", subtitle: 'where all knowledge converges', tag: 'synthesis & wisdom',
    glowColor: '#d4af37', doorImg: '/door-oracle.svg', tintColor: 'rgba(20,14,0,0.65)', nodeLabel: 'VIII',
    roomTitle: 'The Chamber of Synthesis', roomDesc: 'This is where all threads meet. The final door opens inward.',
    books: [
      {
        id: 'history', spineTitle: 'History', spineColor: '#8a7800', coverColor: '#261e00',
        pages: [
          { title: 'The Shape of History', taught: '', learnt: 'History is not a straight line. Civilisations rise (agricultural surplus enables specialisation) and fall (climate change, disease, internal division). The Bronze Age collapse (~1200 BCE), Rome\'s fall, the Black Death — each reshuffled the global order.' },
          { title: 'Globalisation', taught: '', learnt: 'The Silk Road connected China to Rome by 130 BCE. The Columbian Exchange (post-1492) moved crops, animals, and disease between hemispheres. Industrial capitalism, the telegraph, container shipping, and the internet each collapsed distances.' }
        ]
      },
      {
        id: 'physics', spineTitle: 'Physics', spineColor: '#9a8800', coverColor: '#2a2000',
        pages: [
          { title: 'Quantum Mechanics', taught: '', learnt: 'At the quantum scale, particles exist as probability waves until measured. Superposition, entanglement, and the uncertainty principle describe a reality profoundly alien to everyday experience — yet quantum mechanics is the most precisely tested theory in science.' },
          { title: 'Relativity & Spacetime', taught: '', learnt: 'Einstein\'s Special Relativity (1905): the speed of light is constant; time slows at high speeds. General Relativity (1915): gravity is the curvature of spacetime by mass. GPS satellites must correct for both effects or they\'d drift 11km per day.' }
        ]
      },
      {
        id: 'synthesis', spineTitle: 'The Great Web', spineColor: '#7a6a00', coverColor: '#1e1800',
        pages: [
          { title: 'How Everything Connects', taught: '', learnt: 'Chemistry explains biology; biology explains psychology; physics underlies chemistry; mathematics describes physics. No knowledge lives in isolation. The most creative breakthroughs happen at the edges — where two fields collide unexpectedly.' },
          { title: 'The Art of Learning', taught: '', learnt: 'The Feynman Technique: explain a concept simply enough for a child; identify gaps; return to the source; simplify further. Retrieval (testing yourself) beats re-reading. The goal is not to memorise facts but to build a mental model of how the world works.' }
        ]
      },
    ],
  },
];

function getDoorBackground(door: Door | null): string {
  if (!door) return 'radial-gradient(circle at 20% 30%, #0a0616, #02010a)';
  const color = door.glowColor;
  // Each door gets a unique pattern mix based on its id
  switch (door.id) {
    case 'weapons':
      return `radial-gradient(ellipse at 20% 30%, ${color}15, #020012), repeating-linear-gradient(45deg, ${color}08 0px, ${color}08 2px, transparent 2px, transparent 8px)`;
    case 'Truth':
      return `radial-gradient(circle at 80% 20%, ${color}20, #051505), repeating-linear-gradient(0deg, #2ecc7110 1px, transparent 1px, transparent 30px)`;
    case 'mythos':
      return `radial-gradient(circle at 40% 70%, ${color}25, #1a0a00), repeating-linear-gradient(115deg, ${color}10 0px, ${color}10 3px, transparent 3px, transparent 20px)`;
    case 'geometry':
      return `radial-gradient(ellipse at 60% 40%, ${color}18, #001028), repeating-linear-gradient(90deg, ${color}08 0px, ${color}08 5px, transparent 5px, transparent 25px)`;
    case 'spirits':
      return `radial-gradient(circle at 30% 80%, ${color}20, #0e0418), repeating-radial-gradient(circle at 20% 40%, ${color}10 1px, transparent 1px, transparent 15px)`;
    case 'bestiary':
      return `radial-gradient(ellipse at 70% 60%, ${color}22, #021008), repeating-linear-gradient(45deg, #27ae6010 0px, #27ae6010 2px, transparent 2px, transparent 12px)`;
    case 'forge':
      return `radial-gradient(circle at 50% 20%, ${color}1a, #1c0400), repeating-linear-gradient(135deg, ${color}0c 0px, ${color}0c 2px, transparent 2px, transparent 10px)`;
    case 'oracle':
      return `radial-gradient(ellipse at 90% 80%, ${color}28, #141000), repeating-linear-gradient(0deg, ${color}10 1px, transparent 1px, transparent 40px)`;
    default:
      return `radial-gradient(circle at 50% 50%, ${color}15, #02010a)`;
  }
}

/** New component: floating dust that follows the mouse */
function MagicDust() {
  const [particles, setParticles] = useState<{ x: number; y: number; id: number }[]>([]);
  const nextId = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addParticle = useCallback((x: number, y: number) => {
    const id = nextId.current++;
    setParticles(prev => [...prev, { x, y, id }]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id));
    }, 800);
  }, []);

  useEffect(() => {
    let lastX = 0, lastY = 0;
    const onMove = (e: MouseEvent) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const dx = Math.abs(e.clientX - lastX);
      const dy = Math.abs(e.clientY - lastY);
      if (dx > 5 || dy > 5) {
        addParticle(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
        timeoutRef.current = setTimeout(() => { timeoutRef.current = null; }, 16);
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [addParticle]);

  return (
    <div className="magic-dust-container" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9998 }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, gold, #ffb347)',
            filter: 'blur(1px)',
            opacity: 0.7,
            transform: 'translate(-50%, -50%)',
            animation: 'dustFade 0.8s ease-out forwards',
          }}
        />
      ))}
      <style>{`
        @keyframes dustFade {
          0% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(2.5); }
        }
      `}</style>
    </div>
  );
}


// ════════════════════════════════════════════════════════
//  CANVAS RUNES (Background Effect)
// ════════════════════════════════════════════════════════

function RuneCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runesRef = useRef<RuneParticle[]>([]);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    runesRef.current = Array.from({ length: 45 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      symbol: RUNE_SET[Math.floor(Math.random() * RUNE_SET.length)],
      size: 12 + Math.random() * 24,
      speedX: (Math.random() - 0.5) * 0.18, speedY: (Math.random() - 0.5) * 0.12 + (Math.random() > 0.6 ? 0.06 : -0.03),
      rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.005,
      alpha: 0.08 + Math.random() * 0.22,
    }));
    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      for (const r of runesRef.current) {
        r.x += r.speedX; r.y += r.speedY; r.rotation += r.rotSpeed;
        if (r.x < -50) r.x = w + 30; if (r.x > w + 50) r.x = -30;
        if (r.y < -50) r.y = h + 30; if (r.y > h + 50) r.y = -30;
        ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(r.rotation);
        ctx.globalAlpha = r.alpha; ctx.font = `${r.size}px serif`;
        ctx.fillStyle = '#d4af37'; ctx.shadowColor = '#f0c040'; ctx.shadowBlur = 5;
        ctx.fillText(r.symbol, 0, 0); ctx.restore();
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.5 }} />;
}

// ════════════════════════════════════════════════════════
//  FIREFLIES
// ════════════════════════════════════════════════════════

function Fireflies({ glowColor }: { glowColor: string }) {
  const flies = Array.from({ length: 18 }, (_, i) => ({
    left: `${5 + Math.random() * 90}%`,
    top: `${10 + Math.random() * 80}%`,
    color: glowColor,
    delay: `${(i * 0.7 + Math.random()).toFixed(1)}s`,
    duration: `${(5 + Math.random() * 6).toFixed(1)}s`,
  }));
  return (
    <div className="firefly-field" aria-hidden="true">
      {flies.map((f, i) => (
        <div key={i} className="firefly" style={{ left: f.left, top: f.top, color: f.color, animationDelay: f.delay, animationDuration: f.duration }} />
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  WAVY SVG PATH (Center spine layout connecting all doors)
// ════════════════════════════════════════════════════════

function WavyPath({ doorCount }: { doorCount: number }) {
  const W = 120;     // Wide viewBox width
  const segH = 400;  // tall spacing per door
  const totalH = segH * (doorCount - 1) + 60;
  const cx = W / 2;

  // Build a highly curvy S-curve path for the 8 doors
  let d = `M ${cx} 15`;
  for (let i = 0; i < doorCount - 1; i++) {
    const y0 = 15 + i * segH;
    const y1 = 15 + (i + 1) * segH;
    const mid = (y0 + y1) / 2;
    // Alternate curvy wave control points side-to-side (curving from left to right)
    const side = i % 2 === 0 ? -42 : 42;
    d += ` C ${cx + side} ${y0 + 55}, ${cx + side} ${mid - 25}, ${cx} ${y1}`;
  }

  // Node positions
  const nodes = Array.from({ length: doorCount }, (_, i) => ({ cx, cy: 15 + i * segH }));

  return (
    <div className="wavy-svg-wrap" style={{ height: totalH }}>
      <svg className="wavy-svg" viewBox={`0 0 ${W} ${totalH}`} preserveAspectRatio="none">
        <defs>
          <filter id="pathGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/* Chamber Spectrum linear gradient running down the path */}
          <linearGradient id="magicSpineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b6cf7" />
            <stop offset="14%" stopColor="#2ecc71" />
            <stop offset="28%" stopColor="#e67e22" />
            <stop offset="42%" stopColor="#3498db" />
            <stop offset="57%" stopColor="#9b59b6" />
            <stop offset="71%" stopColor="#27ae60" />
            <stop offset="85%" stopColor="#e74c3c" />
            <stop offset="100%" stopColor="#d4af37" />
          </linearGradient>
        </defs>

        {/* Thick ambient glow under-path */}
        <path d={d} fill="none" stroke="url(#magicSpineGrad)" strokeWidth="6" strokeLinecap="round"
          opacity="0.22" filter="url(#pathGlow)"
          strokeDasharray="4000" strokeDashoffset="4000"
          className="wavy-path-anim" />

        {/* Main path line */}
        <path d={d} fill="none" stroke="url(#magicSpineGrad)" strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray="4000" strokeDashoffset="4000"
          className="wavy-path-anim" />

        {/* Interactive nodes */}
        {nodes.map((n, i) => {
          const doorColor = ALL_DOORS[i]?.glowColor || '#d4af37';
          return (
            <g key={i}>
              <circle cx={n.cx} cy={n.cy} r="8.5" fill="none" stroke={doorColor}
                strokeWidth="1.8" opacity="0"
                className="wavy-node-anim"
                style={{ animationDelay: `${0.1 + i * 0.25}s` }} />
              <circle cx={n.cx} cy={n.cy} r="4.5" fill="#d4af37" opacity="0"
                className="wavy-node-anim"
                style={{ animationDelay: `${0.2 + i * 0.25}s` }} />
            </g>
          );
        })}

        {/* floating roman numerals */}
        {nodes.map((n, i) => (
          <text key={i} x={n.cx + 14} y={n.cy + 5} fontSize="9"
            fontFamily="Georgia, serif" fontWeight="bold" fill={ALL_DOORS[i]?.glowColor} opacity="0.65"
            className="wavy-node-anim"
            style={{ animationDelay: `${0.3 + i * 0.25}s` }}>
            {ALL_DOORS[i]?.nodeLabel}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  SPARKLE particles helper
// ════════════════════════════════════════════════════════

function spawnSparkle(x: number, y: number) {
  const el = document.createElement('div');
  el.textContent = RUNE_SET[Math.floor(Math.random() * RUNE_SET.length)];
  Object.assign(el.style, { position: 'fixed', left: `${x}px`, top: `${y}px`, fontSize: '24px', pointerEvents: 'none', zIndex: '9999', opacity: '0.9', filter: 'drop-shadow(0 0 6px gold)', transition: 'all 0.5s ease-out', transform: 'translate(-50%,-50%)' });
  document.body.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => { el.style.opacity = '0'; el.style.transform = 'translate(-50%,-130%) scale(0.5)'; }));
  setTimeout(() => el.remove(), 650);
}

// ════════════════════════════════════════════════════════
//  DOOR CARD component
// ════════════════════════════════════════════════════════

interface DoorCardProps {
  door: Door;
  stopNum: number;
  isLocked: boolean;
  onEnter: () => void;
}

function DoorCard({ door, stopNum, isLocked, onEnter }: DoorCardProps) {
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isLocked) return;
    spawnSparkle(e.clientX, e.clientY);
    for (let i = 1; i <= 5; i++) {
      setTimeout(() => spawnSparkle(e.clientX + (Math.random() - 0.5) * 70, e.clientY + (Math.random() - 0.5) * 70), i * 70);
    }
    setTimeout(() => { onEnter(); }, 450);
  }, [onEnter, isLocked]);

  return (
    <div
      className={`door-card${isLocked ? ' door-card--locked' : ''}`}
      style={{ '--glow': isLocked ? '#555' : door.glowColor } as React.CSSProperties}
      onClick={handleClick}
      role="button" tabIndex={isLocked ? -1 : 0}
      aria-label={isLocked ? `${door.label} — locked` : `${door.label} — enter the room`}
      aria-disabled={isLocked}
      onKeyDown={e => { if (!isLocked && (e.key === 'Enter' || e.key === ' ')) e.currentTarget.click(); }}>

      {/* Inner glow border */}
      <div className="door-inner-glow" />
      {/* Stop banner */}
      <div className="door-stop-banner">Month {stopNum}</div>

      {/* Scene */}
      <div className="door-scene" aria-hidden="true">
        <img src={door.doorImg} alt="" className="door-scene-img" draggable={false} />
        <div className="door-scene-tint" style={{ background: isLocked ? 'rgba(0,0,0,0.55)' : door.tintColor }} />
        <div className="door-scene-fade" />
      </div>

      {/* ── LOCKED OVERLAY ── */}
      {isLocked && (
        <div className="door-lock-overlay" aria-hidden="true">
          <div className="door-lock-bg" />
          <div className="door-lock-content">
            <div className="door-lock-icon-wrap">
              <div className="door-lock-ring door-lock-ring--outer" />
              <div className="door-lock-ring door-lock-ring--inner" />
              <span className="door-lock-icon">🔒</span>
            </div>
            <p className="door-lock-title">SEALED</p>
            <p className="door-lock-hint">Complete the previous chamber<br />to unseal this door</p>
            <div className="door-lock-runes" aria-hidden="true">
              {['ᚠ', 'ᛟ', 'ᚷ', 'ᛊ', 'ᚦ'].map((r, i) => (
                <span key={i} className="door-lock-rune" style={{ animationDelay: `${i * 0.4}s` }}>{r}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ornament */}
      <div className="door-ornament">
        <span className="ornament-wing">{door.ornamentL}</span>
        <span className="ornament-divider" />
        <span className="ornament-wing">{door.ornamentR}</span>
      </div>
      {/* Header */}
      <div className="door-header">
        <span className="door-icon" style={isLocked ? { filter: 'grayscale(1) opacity(0.4)' } : {}}>{door.icon}</span>
        <h2 className="door-label" style={isLocked ? { opacity: 0.45 } : {}}>{door.label}</h2>
        <p className="door-subtitle" style={isLocked ? { opacity: 0.3 } : {}}>{door.subtitle}</p>
      </div>
      <div className="door-tag" style={isLocked ? { opacity: 0.3 } : {}}>{door.tag}</div>
      <div className="door-handle" aria-hidden="true">
        <div className="handle-ring"><div className="handle-gem" /></div>
      </div>
      <div className="door-book-count" style={isLocked ? { opacity: 0.3 } : {}}>
        {isLocked ? '🔒 locked' : `📚 ${door.books.length} tomes within`}
      </div>
      <p className="door-cta">{isLocked ? '⛧ sealed by ancient magic ⛧' : '✧ enter the room ✧'}</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  MAP PAGE ROOT
// ════════════════════════════════════════════════════════

interface MapPageProps {
  onBack: () => void;
  onEnterRoom: (doorId: string) => void;
  onFinale: () => void;
  unlockedCount: number;
}

export default function MapPage({ onBack, onEnterRoom, onFinale, unlockedCount }: MapPageProps) {
  const [hoveredDoorId, setHoveredDoorId] = useState<string | null>(null);
  const [activeDoorBackground, setActiveDoorBackground] = useState<Door | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // When a door is clicked, we set its background as "active" until another is chosen
  const handleEnterRoom = useCallback((doorId: string) => {
    const door = ALL_DOORS.find(d => d.id === doorId);
    if (door) setActiveDoorBackground(door);
    onEnterRoom(doorId);
  }, [onEnterRoom]);

  // Update global page background based on hover or active room
  const currentBgDoor = hoveredDoorId ? ALL_DOORS.find(d => d.id === hoveredDoorId) : activeDoorBackground;
  const pageBackground = getDoorBackground(currentBgDoor ?? null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.background = pageBackground;
      containerRef.current.style.transition = 'background 0.6s ease';
    }
  }, [pageBackground]);

  // Scroll reveal observer (unchanged)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('map-card-slot--visible');
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );
    const cards = document.querySelectorAll('.map-card-slot:not(.map-card-slot--empty)');
    cards.forEach((card) => observer.observe(card));
    return () => cards.forEach((card) => observer.unobserve(card));
  }, []);

  return (
    <div ref={containerRef} className="map-root" style={{ background: pageBackground, transition: 'background 0.6s ease' }}>
      <RuneCanvas />
      <div className="map-ambient" aria-hidden="true" />
      <Fireflies glowColor="#d4af37" />

      {/* extra floating magical orbs that slowly change colour */}
      <div className="map-magic-orb" style={{ background: `radial-gradient(circle, #8b6cf7, transparent 70%)`, left: '15%', top: '25%' }} />
      <div className="map-magic-orb" style={{ background: `radial-gradient(circle, #e74c3c, transparent 70%)`, left: '80%', top: '65%', animationDelay: '4s' }} />
      <div className="map-magic-orb" style={{ background: `radial-gradient(circle, #d4af37, transparent 70%)`, left: '45%', top: '85%', animationDelay: '1.2s', width: '220px', height: '220px' }} />

      <div className="map-ground-fog" aria-hidden="true" />
      <MagicDust />  {/* ✨ mouse dust ✨ */}

      <main className="map-content">
        {/* Back button */}
        <nav className="map-top-nav">
          <button className="map-back-btn" onClick={onBack}>← Return to Gates</button>
        </nav>

        {/* Header (unchanged) */}
        <header className="map-header">
          <div className="header-stars" aria-hidden="true">
            {'✦ · ✧ · ⋆ · ✦ · ✧ · ⋆ · ✦ · ✧ · ⋆ · ✦'.split(' ').map((s, i) => (
              <span key={i} className="star-char" style={{ animationDelay: `${i * 0.14}s` }}>{s}</span>
            ))}
          </div>
          <h1 className="map-title">
            <span className="title-emblem">🏛️</span>
            <span>MAPPA ALEXANDRIAE</span>
            <span className="title-emblem">🏛️</span>
          </h1>
          <p className="map-tagline">« The great library's living map · where knowledge becomes doors »</p>
          <div className="map-badge">✨ enter each room · find the bookshelf · open a tome ✨</div>
          <div className="header-divider">
            <span className="divider-glyph">⚜</span>
            <span className="divider-line" />
            <span className="divider-glyph">𓂀</span>
            <span className="divider-line" />
            <span className="divider-glyph">⚜</span>
          </div>
        </header>

        {/* start marker */}
        <div className="map-start-marker">
          <div className="start-ring"><span>✦</span></div>
          <p className="start-label">BEGIN THE SCROLL</p>
          <div className="start-stem" />
        </div>

        {/* Journey container */}
        <div className="map-journey-container">
          <WavyPath doorCount={ALL_DOORS.length} />

          <div className="map-cards-list">
            {ALL_DOORS.map((door, i) => {
              const isLeft = i % 2 === 0;
              const isLocked = i >= unlockedCount;
              return (
                <div
                  key={door.id}
                  className="map-stop"
                  onMouseEnter={() => setHoveredDoorId(door.id)}
                  onMouseLeave={() => setHoveredDoorId(null)}
                >
                  <div className={`map-row${isLeft ? ' map-row--left' : ' map-row--right'}`}>
                    {isLeft ? (
                      <>
                        <div className="map-card-slot">
                          <DoorCard door={door} stopNum={i + 1} isLocked={isLocked} onEnter={() => handleEnterRoom(door.id)} />
                        </div>
                        <div className="map-spine-spacer" />
                        <div className="map-card-slot map-card-slot--empty" />
                      </>
                    ) : (
                      <>
                        <div className="map-card-slot map-card-slot--empty" />
                        <div className="map-spine-spacer" />
                        <div className="map-card-slot">
                          <DoorCard door={door} stopNum={i + 1} isLocked={isLocked} onEnter={() => handleEnterRoom(door.id)} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* end marker */}
        <div className="map-end-marker">
          <div className="end-stem" />
          <div className="end-ring"><span>𓂀</span></div>
          <p className="end-label">END OF REGION</p>
        </div>

        <div className="chapter-nav">
          <button className="chapter-nav-btn chapter-nav-btn--finale" onClick={onFinale}>
            ✦ Complete the Journey ✦
          </button>
        </div>

        <footer className="map-footer">
          <div className="footer-runes" aria-hidden="true">
            {['ᚠ', '𓂀', '⚜', 'ᛟ', '🜄', '⊕', 'ᚦ', '✦'].map((r, i) => (
              <span key={i} className="footer-rune" style={{ animationDelay: `${i * 0.3}s` }}>{r}</span>
            ))}
          </div>
          <p>✦ Eight doors · twenty-four tomes · infinite paths through knowledge ✦</p>
          <p className="footer-sub">floating runes weave the spell of Alexandria</p>
        </footer>
      </main>
    </div>
  );
}