/**
 * Educational content for the "Words Without Meaning" game
 * Contains educational messages, linguistic concepts, and takeaways
 */

/**
 * Educational messages displayed during gameplay
 */
export const educationalMessages = [
  // Context and meaning messages (general)
  {
    id: "edu_msg_001",
    text: "Words have no inherent meaning without context. The same word can have completely different meanings depending on how it's used.",
    category: "context",
    difficulty: "easy",
    relatedWords: []
  },
  {
    id: "edu_msg_002",
    text: "Context is the primary determinant of meaning in language. Without surrounding words and situational context, individual words can be ambiguous.",
    category: "context",
    difficulty: "easy",
    relatedWords: []
  },
  {
    id: "edu_msg_003",
    text: "The meaning of a word isn't contained within the word itself, but in how we use it in relation to other words and our shared understanding.",
    category: "meaning",
    difficulty: "medium",
    relatedWords: []
  },
  {
    id: "edu_msg_004",
    text: "Words are arbitrary symbols that gain meaning through social convention and usage, not from any inherent connection to what they represent.",
    category: "meaning",
    difficulty: "medium",
    relatedWords: []
  },
  
  // Homonym messages
  {
    id: "edu_msg_005",
    text: "Words like 'bank' are called homonyms - they have the same spelling and pronunciation but completely different meanings depending on context.",
    category: "homonym",
    difficulty: "easy",
    relatedWords: ["bank", "bat", "bear", "fair", "kind"]
  },
  {
    id: "edu_msg_006",
    text: "Homonyms often arise when words from different etymological origins evolve to have the same spelling and pronunciation.",
    category: "homonym",
    difficulty: "medium",
    relatedWords: ["bank", "spring", "light", "bark"]
  },
  {
    id: "edu_msg_007",
    text: "Homonyms demonstrate how language is a system of arbitrary symbols - the word 'bank' has no inherent connection to either financial institutions or river edges.",
    category: "homonym",
    difficulty: "medium",
    relatedWords: ["bank", "spring", "bat"]
  },
  
  // Polyseme messages
  {
    id: "edu_msg_008",
    text: "The word 'run' demonstrates polysemy - it has multiple related meanings that evolved from the same root concept of movement.",
    category: "polyseme",
    difficulty: "easy",
    relatedWords: ["run", "head", "face", "play"]
  },
  {
    id: "edu_msg_009",
    text: "Polysemy occurs when a word develops multiple related meanings through metaphorical extension, specialization, or generalization.",
    category: "polyseme",
    difficulty: "medium",
    relatedWords: ["run", "head", "light", "face"]
  },
  {
    id: "edu_msg_010",
    text: "Unlike homonyms, polysemes have meanings that share a common origin and often retain a trace of their related meaning, though context is still essential to determine which meaning is intended.",
    category: "polyseme",
    difficulty: "hard",
    relatedWords: ["run", "head", "face", "play"]
  },
  
  // Contronym messages
  {
    id: "edu_msg_011",
    text: "'Sanction' is an auto-antonym or contronym - a word that can have contradictory meanings. It can mean both 'to penalize' and 'to approve,' making context essential for understanding.",
    category: "contronym",
    difficulty: "medium",
    relatedWords: ["sanction", "cleave", "oversight", "dust"]
  },
  {
    id: "edu_msg_012",
    text: "Contronyms like 'cleave' (to split apart or to stick together) show how dramatically context affects meaning - the same word can mean opposite things.",
    category: "contronym",
    difficulty: "hard",
    relatedWords: ["cleave", "sanction", "oversight", "screen"]
  },
  {
    id: "edu_msg_013",
    text: "The existence of contronyms (words with contradictory meanings) is perhaps the strongest evidence that words themselves don't contain meaning - context determines everything.",
    category: "contronym",
    difficulty: "hard",
    relatedWords: ["sanction", "cleave", "oversight", "dust"]
  },
  
  // Semantic shift messages
  {
    id: "edu_msg_014",
    text: "Words change meaning over time through a process called semantic shift. For example, 'awful' originally meant 'inspiring awe' but now means 'very bad'.",
    category: "semantic_shift",
    difficulty: "medium",
    relatedWords: ["awful", "nice", "egregious", "silly"]
  },
  {
    id: "edu_msg_015",
    text: "'Egregious' has undergone a complete reversal in meaning - it originally meant 'remarkably good' but now means 'remarkably bad'.",
    category: "semantic_shift",
    difficulty: "hard",
    relatedWords: ["egregious", "awful", "terrific", "nice"]
  },
  {
    id: "edu_msg_016",
    text: "Semantic shift demonstrates that word meanings aren't fixed but evolve through usage over time, further showing that meaning isn't inherent to words themselves.",
    category: "semantic_shift",
    difficulty: "hard",
    relatedWords: ["awful", "nice", "egregious", "silly"]
  },
  
  // Part of speech variation messages
  {
    id: "edu_msg_017",
    text: "Many words can function as different parts of speech depending on context. 'Light' can be a noun, verb, or adjective with different meanings in each case.",
    category: "part_of_speech_variation",
    difficulty: "easy",
    relatedWords: ["light", "run", "bank", "table"]
  },
  {
    id: "edu_msg_018",
    text: "The word 'address' changes meaning when used as a noun (a location) versus a verb (to speak to someone), showing how grammatical function affects meaning.",
    category: "part_of_speech_variation",
    difficulty: "medium",
    relatedWords: ["address", "light", "run", "table"]
  },
  {
    id: "edu_msg_019",
    text: "Part of speech conversion is a common way that languages create new meanings for existing words, demonstrating the flexibility of language and the importance of context.",
    category: "part_of_speech_variation",
    difficulty: "medium",
    relatedWords: ["light", "run", "address", "table"]
  }
];

/**
 * Linguistic concepts explained in the game
 */
export const linguisticConcepts = [
  {
    id: "context_dependency",
    name: "Context Dependency",
    description: "The principle that words derive their meaning from the surrounding words, phrases, and situational context rather than having fixed, inherent meanings.",
    examples: [
      "The word 'bank' means something completely different in 'river bank' versus 'bank account'.",
      "Without context, the sentence 'They saw the bat' could refer to a flying mammal or a sports equipment."
    ],
    relatedConcepts: ["ambiguity", "polysemy", "homonymy"]
  },
  {
    id: "homonym",
    name: "Homonymy",
    description: "When words have the same spelling and pronunciation but different, unrelated meanings, often because they come from different etymological origins.",
    examples: [
      "Bank (financial institution) and bank (river edge) are homonyms.",
      "Bat (flying mammal) and bat (sports equipment) are homonyms."
    ],
    relatedConcepts: ["context_dependency", "ambiguity", "homograph", "homophone"]
  },
  {
    id: "polyseme",
    name: "Polysemy",
    description: "When a single word has multiple related meanings that evolved from the same original concept, often through metaphorical extension.",
    examples: [
      "The word 'head' can refer to a body part, a person in charge, or the front of a line.",
      "The word 'run' has related meanings across 'run a race', 'run a business', and 'run water'."
    ],
    relatedConcepts: ["context_dependency", "semantic_shift", "metaphorical_extension"]
  },
  {
    id: "contronym",
    name: "Contronym (Auto-antonym)",
    description: "A word that can have contradictory or opposite meanings depending on the context, representing an extreme case of context dependency.",
    examples: [
      "Sanction can mean both 'to permit' and 'to penalize'.",
      "Cleave can mean both 'to split apart' and 'to stick together'."
    ],
    relatedConcepts: ["context_dependency", "ambiguity", "semantic_shift"]
  },
  {
    id: "semantic_shift",
    name: "Semantic Shift",
    description: "The process by which word meanings change over time, sometimes dramatically, demonstrating that meanings are not fixed properties of words.",
    examples: [
      "Awful originally meant 'inspiring awe' but now means 'very bad'.",
      "Nice originally meant 'foolish or stupid' but now means 'pleasant or agreeable'."
    ],
    relatedConcepts: ["language_evolution", "amelioration", "pejoration"]
  },
  {
    id: "part_of_speech_variation",
    name: "Part of Speech Variation",
    description: "When the same word can function as different parts of speech (noun, verb, adjective, etc.) with different meanings in each case.",
    examples: [
      "Light as a noun (a source of illumination), verb (to ignite), or adjective (not heavy).",
      "Run as a noun (a jog) or verb (to move quickly)."
    ],
    relatedConcepts: ["context_dependency", "grammatical_function", "conversion"]
  },
  {
    id: "ambiguity",
    name: "Ambiguity",
    description: "When a word, phrase, or sentence can be interpreted in multiple ways, requiring context to determine the intended meaning.",
    examples: [
      "The sentence 'I saw her duck' could mean either 'I saw her lower her head' or 'I saw the duck that belongs to her'.",
      "The word 'bank' is ambiguous without context."
    ],
    relatedConcepts: ["context_dependency", "homonymy", "polysemy"]
  }
];

/**
 * Educational takeaways presented at the end of the game
 */
export const educationalTakeaways = [
  {
    id: "takeaway_001",
    text: "Words have no inherent meaning without context. The same word can have completely different meanings depending on how it's used.",
    conceptId: "context_dependency",
    difficulty: "easy"
  },
  {
    id: "takeaway_002",
    text: "Homonyms like 'bank' and 'bat' show how words that sound identical can refer to completely unrelated concepts.",
    conceptId: "homonym",
    difficulty: "easy"
  },
  {
    id: "takeaway_003",
    text: "Polysemous words have multiple related meanings that evolved from the same concept, showing how meaning shifts over time.",
    conceptId: "polyseme",
    difficulty: "medium"
  },
  {
    id: "takeaway_004",
    text: "Context is the primary determinant of meaning in language, which is why isolated words can be ambiguous or misleading.",
    conceptId: "context_dependency",
    difficulty: "easy"
  },
  {
    id: "takeaway_005",
    text: "The phenomenon of words having contradictory meanings (contronyms) demonstrates that meaning isn't contained within words themselves but in how we use them.",
    conceptId: "contronym",
    difficulty: "hard"
  },
  {
    id: "takeaway_006",
    text: "Words change meaning over time through semantic shift, showing that meanings aren't fixed properties of words but evolve through usage.",
    conceptId: "semantic_shift",
    difficulty: "medium"
  },
  {
    id: "takeaway_007",
    text: "The same word can function as different parts of speech with different meanings, demonstrating the flexibility of language and importance of grammatical context.",
    conceptId: "part_of_speech_variation",
    difficulty: "medium"
  },
  {
    id: "takeaway_008",
    text: "Ambiguity in language is resolved through context, showing that communication depends on shared understanding beyond just the words themselves.",
    conceptId: "ambiguity",
    difficulty: "medium"
  },
  {
    id: "takeaway_009",
    text: "Words are arbitrary symbols that gain meaning through social convention and usage, not from any inherent connection to what they represent.",
    conceptId: "context_dependency",
    difficulty: "hard"
  },
  {
    id: "takeaway_010",
    text: "The study of how words derive meaning from context is central to linguistics, philosophy of language, and cognitive science.",
    conceptId: "context_dependency",
    difficulty: "hard"
  }
];