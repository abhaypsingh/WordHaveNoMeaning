/**
 * Word database for the "Words Without Meaning" game
 * Contains words with multiple meanings and contradiction sentences
 */

export const wordDatabase = [
  // Easy difficulty words
  {
    id: "word_001",
    text: "bank",
    difficulty: "easy",
    categories: ["noun", "verb", "homonym"],
    meanings: [
      {
        id: "meaning_001",
        definition: "A financial institution that accepts deposits and channels those deposits into lending activities",
        partOfSpeech: "noun",
        exampleSentences: [
          "I need to go to the bank to deposit my paycheck."
        ],
        contradictionSentences: [
          "After the heavy rain, the river bank was eroded significantly."
        ],
        isArchaic: false,
        synonyms: ["financial institution", "credit union"]
      },
      {
        id: "meaning_002",
        definition: "The land alongside or sloping down to a river or lake",
        partOfSpeech: "noun",
        exampleSentences: [
          "We had a picnic on the grassy bank by the river."
        ],
        contradictionSentences: [
          "The bank approved her loan application within a week."
        ],
        isArchaic: false,
        synonyms: ["shore", "riverside", "embankment"]
      },
      {
        id: "meaning_003",
        definition: "To tilt or incline an aircraft in a turn",
        partOfSpeech: "verb",
        exampleSentences: [
          "The pilot had to bank the plane sharply to avoid the storm."
        ],
        contradictionSentences: [
          "I bank with a local credit union rather than a national chain."
        ],
        isArchaic: false,
        synonyms: ["tilt", "incline", "angle"]
      }
    ],
    notes: "Classic example of a homonym with etymologically distinct meanings"
  },
  {
    id: "word_002",
    text: "light",
    difficulty: "easy",
    categories: ["noun", "adjective", "verb", "polyseme"],
    meanings: [
      {
        id: "meaning_004",
        definition: "The natural agent that stimulates sight and makes things visible",
        partOfSpeech: "noun",
        exampleSentences: [
          "The light from the sun streamed through the window."
        ],
        contradictionSentences: [
          "This suitcase is very light, I can carry it easily."
        ],
        isArchaic: false,
        synonyms: ["illumination", "brightness", "radiance"]
      },
      {
        id: "meaning_005",
        definition: "Having a low weight; not heavy",
        partOfSpeech: "adjective",
        exampleSentences: [
          "The package was surprisingly light and easy to lift."
        ],
        contradictionSentences: [
          "Could you turn on the light? It's too dark to see."
        ],
        isArchaic: false,
        synonyms: ["lightweight", "not heavy", "insubstantial"]
      },
      {
        id: "meaning_006",
        definition: "To ignite or set fire to something",
        partOfSpeech: "verb",
        exampleSentences: [
          "She struck a match to light the candle."
        ],
        contradictionSentences: [
          "The feather was so light that it floated on the breeze."
        ],
        isArchaic: false,
        synonyms: ["ignite", "kindle", "set fire to"]
      }
    ],
    notes: "Demonstrates how the same word can function as different parts of speech with distinct meanings"
  },
  {
    id: "word_003",
    text: "run",
    difficulty: "easy",
    categories: ["verb", "noun", "polyseme"],
    meanings: [
      {
        id: "meaning_007",
        definition: "To move at a speed faster than walking by taking quick steps",
        partOfSpeech: "verb",
        exampleSentences: [
          "She runs five miles every morning before work."
        ],
        contradictionSentences: [
          "The factory will run 24 hours a day to meet the deadline."
        ],
        isArchaic: false,
        synonyms: ["jog", "sprint", "dash"]
      },
      {
        id: "meaning_008",
        definition: "To operate or function",
        partOfSpeech: "verb",
        exampleSentences: [
          "The engine runs smoothly after the tune-up."
        ],
        contradictionSentences: [
          "I went for a long run through the park yesterday."
        ],
        isArchaic: false,
        synonyms: ["operate", "function", "work"]
      },
      {
        id: "meaning_009",
        definition: "A continuous series of performances or showings",
        partOfSpeech: "noun",
        exampleSentences: [
          "The play had a successful run of 200 performances."
        ],
        contradictionSentences: [
          "I need to run to catch the bus."
        ],
        isArchaic: false,
        synonyms: ["series", "sequence", "succession"]
      }
    ],
    notes: "Demonstrates how context determines whether a word is used as a verb or noun"
  },
  
  // Medium difficulty words
  {
    id: "word_004",
    text: "address",
    difficulty: "medium",
    categories: ["noun", "verb", "polyseme"],
    meanings: [
      {
        id: "meaning_010",
        definition: "The particulars of the place where someone lives or an organization is situated",
        partOfSpeech: "noun",
        exampleSentences: [
          "Please provide your name and address on the form."
        ],
        contradictionSentences: [
          "The president will address the nation about the crisis tonight."
        ],
        isArchaic: false,
        synonyms: ["location", "residence", "domicile"]
      },
      {
        id: "meaning_011",
        definition: "To speak to someone formally",
        partOfSpeech: "verb",
        exampleSentences: [
          "The CEO will address the shareholders at the annual meeting."
        ],
        contradictionSentences: [
          "What's your email address? I'll send you the documents."
        ],
        isArchaic: false,
        synonyms: ["speak to", "talk to", "make a speech to"]
      },
      {
        id: "meaning_012",
        definition: "To deal with or discuss a topic or problem",
        partOfSpeech: "verb",
        exampleSentences: [
          "The committee will address the issue of climate change."
        ],
        contradictionSentences: [
          "I can't remember his new address since he moved."
        ],
        isArchaic: false,
        synonyms: ["tackle", "deal with", "handle"]
      }
    ],
    notes: "Shows how a word can shift between noun and verb with related but distinct meanings"
  },
  {
    id: "word_005",
    text: "table",
    difficulty: "medium",
    categories: ["noun", "verb", "homonym"],
    meanings: [
      {
        id: "meaning_013",
        definition: "A piece of furniture with a flat top supported by one or more legs",
        partOfSpeech: "noun",
        exampleSentences: [
          "We sat around the kitchen table for dinner."
        ],
        contradictionSentences: [
          "The committee decided to table the discussion until next week."
        ],
        isArchaic: false,
        synonyms: ["desk", "counter", "stand"]
      },
      {
        id: "meaning_014",
        definition: "To postpone consideration of a proposal",
        partOfSpeech: "verb",
        exampleSentences: [
          "The board tabled the motion until more information was available."
        ],
        contradictionSentences: [
          "The wooden table was handcrafted from oak."
        ],
        isArchaic: false,
        synonyms: ["postpone", "defer", "shelve"]
      },
      {
        id: "meaning_015",
        definition: "A systematic arrangement of data in rows and columns",
        partOfSpeech: "noun",
        exampleSentences: [
          "The report included a table of annual sales figures."
        ],
        contradictionSentences: [
          "Let's table this discussion for now and come back to it later."
        ],
        isArchaic: false,
        synonyms: ["chart", "grid", "matrix"]
      }
    ],
    notes: "Interesting example where the verb form means almost the opposite in British vs. American English"
  },
  {
    id: "word_006",
    text: "spring",
    difficulty: "medium",
    categories: ["noun", "verb", "homonym"],
    meanings: [
      {
        id: "meaning_016",
        definition: "The season after winter and before summer",
        partOfSpeech: "noun",
        exampleSentences: [
          "The flowers bloom in spring."
        ],
        contradictionSentences: [
          "The metal spring in the mattress was poking through the fabric."
        ],
        isArchaic: false,
        synonyms: ["springtime", "vernal season"]
      },
      {
        id: "meaning_017",
        definition: "A coiled metal device that returns to its original shape when compressed or extended",
        partOfSpeech: "noun",
        exampleSentences: [
          "The spring in the pen mechanism was broken."
        ],
        contradictionSentences: [
          "We're planning a vacation for spring break."
        ],
        isArchaic: false,
        synonyms: ["coil", "spiral", "elastic device"]
      },
      {
        id: "meaning_018",
        definition: "To jump or leap suddenly",
        partOfSpeech: "verb",
        exampleSentences: [
          "The cat sprung from the sofa to the windowsill."
        ],
        contradictionSentences: [
          "The natural spring provided fresh water to the village."
        ],
        isArchaic: false,
        synonyms: ["leap", "jump", "bound"]
      }
    ],
    notes: "Multiple unrelated meanings that developed from different etymological roots"
  },
  
  // Hard difficulty words
  {
    id: "word_007",
    text: "sanction",
    difficulty: "hard",
    categories: ["noun", "verb", "contronym"],
    meanings: [
      {
        id: "meaning_019",
        definition: "A penalty or punishment for disobeying a law or rule",
        partOfSpeech: "noun",
        exampleSentences: [
          "The country faces economic sanctions for violating the treaty."
        ],
        contradictionSentences: [
          "The ethics committee sanctioned the new research protocol."
        ],
        isArchaic: false,
        synonyms: ["penalty", "punishment", "restriction"]
      },
      {
        id: "meaning_020",
        definition: "Official permission or approval for an action",
        partOfSpeech: "noun",
        exampleSentences: [
          "The project received the sanction of the board of directors."
        ],
        contradictionSentences: [
          "The government imposed sanctions on imports from that country."
        ],
        isArchaic: false,
        synonyms: ["authorization", "approval", "permission"]
      },
      {
        id: "meaning_021",
        definition: "To give official approval or permission for",
        partOfSpeech: "verb",
        exampleSentences: [
          "The committee sanctioned the proposal unanimously."
        ],
        contradictionSentences: [
          "The UN may sanction the country for human rights violations."
        ],
        isArchaic: false,
        synonyms: ["authorize", "approve", "permit"]
      }
    ],
    notes: "A contronym - a word that can have contradictory meanings"
  },
  {
    id: "word_008",
    text: "cleave",
    difficulty: "hard",
    categories: ["verb", "contronym"],
    meanings: [
      {
        id: "meaning_022",
        definition: "To split or sever something",
        partOfSpeech: "verb",
        exampleSentences: [
          "The axe cleaved the log in two."
        ],
        contradictionSentences: [
          "She cleaved to her principles despite the pressure to compromise."
        ],
        isArchaic: false,
        synonyms: ["split", "divide", "sever"]
      },
      {
        id: "meaning_023",
        definition: "To adhere or cling strongly to something",
        partOfSpeech: "verb",
        exampleSentences: [
          "He cleaved to his faith throughout the difficult times."
        ],
        contradictionSentences: [
          "The chef used a sharp knife to cleave the meat from the bone."
        ],
        isArchaic: false,
        synonyms: ["adhere", "cling", "stick"]
      }
    ],
    notes: "Classic example of a contronym - a word with two opposite meanings"
  },
  {
    id: "word_009",
    text: "egregious",
    difficulty: "hard",
    categories: ["adjective", "semantic_shift"],
    meanings: [
      {
        id: "meaning_024",
        definition: "Outstandingly bad; shocking",
        partOfSpeech: "adjective",
        exampleSentences: [
          "The report detailed the company's egregious violations of safety regulations."
        ],
        contradictionSentences: [
          "In ancient texts, the word 'egregious' was used to describe someone with remarkably good qualities."
        ],
        isArchaic: false,
        synonyms: ["flagrant", "glaring", "atrocious"]
      },
      {
        id: "meaning_025",
        definition: "Remarkably good; distinguished",
        partOfSpeech: "adjective",
        exampleSentences: [
          "The knight was known for his egregious courage in battle."
        ],
        contradictionSentences: [
          "The politician's egregious misconduct led to calls for resignation."
        ],
        isArchaic: true,
        synonyms: ["exceptional", "outstanding", "distinguished"]
      }
    ],
    notes: "Example of semantic shift - originally meant 'remarkably good' but now means 'remarkably bad'"
  },
  {
    id: "word_010",
    text: "oversight",
    difficulty: "hard",
    categories: ["noun", "contronym"],
    meanings: [
      {
        id: "meaning_026",
        definition: "An unintentional failure to notice or do something",
        partOfSpeech: "noun",
        exampleSentences: [
          "The error was due to an oversight in the review process."
        ],
        contradictionSentences: [
          "The committee provides oversight of government spending."
        ],
        isArchaic: false,
        synonyms: ["mistake", "error", "omission"]
      },
      {
        id: "meaning_027",
        definition: "The action of overseeing something; supervision",
        partOfSpeech: "noun",
        exampleSentences: [
          "The project was completed under the oversight of the senior engineer."
        ],
        contradictionSentences: [
          "The missing signature was a simple oversight."
        ],
        isArchaic: false,
        synonyms: ["supervision", "management", "control"]
      }
    ],
    notes: "Another contronym - can mean both 'supervision' and 'failure to notice'"
  }
];