export interface TarotCard {
  name: string;
  emoji: string;
  arcana: 'Major' | 'Minor';
  suit?: 'Wands' | 'Cups' | 'Swords' | 'Pentacles';
  meaning: {
    upright: string;
    reversed: string;
  };
  keywords: string[];
}

export const tarotDeck: TarotCard[] = [
  // Major Arcana
  {
    name: 'The Fool',
    emoji: '🤡',
    arcana: 'Major',
    meaning: {
      upright: 'Beginnings, innocence, spontaneity, a free spirit, originality, adventure.',
      reversed: 'Recklessness, being taken advantage of, inconsideration, risk-taking, naivete.',
    },
    keywords: ["beginnings", "freedom", "innocence"]
  },
  {
    name: 'The Magician',
    emoji: '🧙‍♂️',
    arcana: 'Major',
    meaning: {
      upright: 'Manifestation, resourcefulness, power, inspired action, skill, concentration.',
      reversed: 'Manipulation, poor planning, latent talents, deceit, illusion.',
    },
    keywords: ["manifestation", "power", "skill"]
  },
  {
    name: 'The High Priestess',
    emoji: '🔮',
    arcana: 'Major',
    meaning: {
      upright: 'Intuition, sacred knowledge, divine feminine, the subconscious mind, secrets.',
      reversed: 'Secrets, disconnected from intuition, withdrawal and silence, hidden agendas.',
    },
    keywords: ["intuition", "mystery", "wisdom"]
  },
  {
    name: 'The Empress',
    emoji: '👑',
    arcana: 'Major',
    meaning: {
      upright: 'Femininity, beauty, nature, nurturing, abundance, creativity.',
      reversed: 'Creative block, dependence on others, smothering, emptiness.',
    },
    keywords: ["creativity", "abundance", "motherhood"]
  },
  {
    name: 'The Emperor',
    emoji: '🏛️',
    arcana: 'Major',
    meaning: {
      upright: 'Authority, establishment, structure, a father figure, control, ambition.',
      reversed: 'Domination, excessive control, lack of discipline, inflexibility, tyrannical.',
    },
    keywords: ["leadership", "stability", "control"]
  },
  {
    name: 'The Hierophant',
    emoji: '🙏',
    arcana: 'Major',
    meaning: {
      upright: 'Spiritual wisdom, religious beliefs, conformity, tradition, institutions, guidance.',
      reversed: 'Personal beliefs, freedom, challenging the status quo, rebellion, non-conformity.',
    },
    keywords: ["tradition", "conformity", "spirituality"]
  },
  {
    name: 'The Lovers',
    emoji: '💞',
    arcana: 'Major',
    meaning: {
      upright: 'Love, harmony, relationships, values alignment, choices, a union.',
      reversed: 'Disharmony, imbalance, misalignment of values, conflict, one-sidedness.',
    },
    keywords: ["love", "choice", "harmony"]
  },
  {
    name: 'The Chariot',
    emoji: '🏇',
    arcana: 'Major',
    meaning: {
      upright: 'Control, willpower, victory, assertion, determination, success.',
      reversed: 'Lack of control and direction, opposition, lack of direction, aggression.',
    },
    keywords: ["determination", "success", "control"]
  },
  {
    name: 'Strength',
    emoji: '🦁',
    arcana: 'Major',
    meaning: {
      upright: 'Strength, courage, patience, control, compassion, inner power.',
      reversed: 'Weakness, self-doubt, lack of self-discipline, vulnerability, insecurity.',
    },
    keywords: ["inner strength", "bravery", "compassion"]
  },
  {
    name: 'The Hermit',
    emoji: '🧘‍♂️',
    arcana: 'Major',
    meaning: {
      upright: 'Soul-searching, introspection, being alone, inner guidance, wisdom.',
      reversed: 'Isolation, loneliness, withdrawal, paranoia, reclusion.',
    },
    keywords: ["introspection", "guidance", "solitude"]
  },
  {
    name: 'Wheel of Fortune',
    emoji: '🎡',
    arcana: 'Major',
    meaning: {
      upright: 'Good luck, karma, life cycles, destiny, a turning point, change.',
      reversed: 'Bad luck, resistance to change, breaking cycles, misfortune.',
    },
    keywords: ["change", "cycles", "fate"]
  },
  {
    name: 'Justice',
    emoji: '⚖️',
    arcana: 'Major',
    meaning: {
      upright: 'Justice, fairness, truth, cause and effect, law, clarity.',
      reversed: 'Unfairness, lack of accountability, dishonesty, prejudice.',
    },
    keywords: ["fairness", "truth", "law"]
  },
  {
    name: 'The Hanged Man',
    emoji: '🤸‍♂️',
    arcana: 'Major',
    meaning: {
      upright: 'Pause, surrender, letting go, new perspectives, sacrifice.',
      reversed: 'Delays, resistance, stalling, indecision, needless sacrifice.',
    },
    keywords: ["surrender", "new perspective", "pause"]
  },
  {
    name: 'Death',
    emoji: '💀',
    arcana: 'Major',
    meaning: {
      upright: 'Endings, change, transformation, transition, letting go.',
      reversed: 'Resistance to change, personal transformation, inner purging, stagnation.',
    },
    keywords: ["endings", "transformation", "change"]
  },
  {
    name: 'Temperance',
    emoji: '🍵',
    arcana: 'Major',
    meaning: {
      upright: 'Balance, moderation, patience, purpose, finding meaning.',
      reversed: 'Imbalance, excess, self-healing, re-alignment, discord.',
    },
    keywords: ["balance", "moderation", "patience"]
  },
  {
    name: 'The Devil',
    emoji: '😈',
    arcana: 'Major',
    meaning: {
      upright: 'Shadow self, attachment, addiction, restriction, sexuality, materialism.',
      reversed: 'Releasing limiting beliefs, exploring dark thoughts, detachment, freedom.',
    },
    keywords: ["addiction", "bondage", "materialism"]
  },
  {
    name: 'The Tower',
    emoji: '💥',
    arcana: 'Major',
    meaning: {
      upright: 'Sudden change, upheaval, chaos, revelation, awakening, disaster.',
      reversed: 'Personal transformation, fear of change, averting disaster, delaying the inevitable.',
    },
    keywords: ["upheaval", "chaos", "revelation"]
  },
  {
    name: 'The Star',
    emoji: '✨',
    arcana: 'Major',
    meaning: {
      upright: 'Hope, faith, purpose, renewal, spirituality, inspiration.',
      reversed: 'Lack of faith, despair, self-trust, disconnection, discouragement.',
    },
    keywords: ["hope", "renewal", "inspiration"]
  },
  {
    name: 'The Moon',
    emoji: '🌙',
    arcana: 'Major',
    meaning: {
      upright: 'Illusion, fear, anxiety, subconscious, intuition, dreams.',
      reversed: 'Release of fear, repressed emotion, inner confusion, clarity.',
    },
    keywords: ["illusion", "fear", "intuition"]
  },
  {
    name: 'The Sun',
    emoji: '☀️',
    arcana: 'Major',
    meaning: {
      upright: 'Positivity, fun, warmth, success, vitality, joy.',
      reversed: 'Inner child, feeling down, overly optimistic, lack of success.',
    },
    keywords: ["success", "vitality", "joy"]
  },
  {
    name: 'Judgement',
    emoji: '🎺',
    arcana: 'Major',
    meaning: {
      upright: 'Judgement, rebirth, inner calling, absolution, awakening.',
      reversed: 'Self-doubt, inner critic, ignoring the call, legal complications.',
    },
    keywords: ["rebirth", "absolution", "awakening"]
  },
  {
    name: 'The World',
    emoji: '🌍',
    arcana: 'Major',
    meaning: {
      upright: 'Completion, integration, accomplishment, travel, fulfillment.',
      reversed: 'Seeking personal closure, short-cuts, delays, lack of completion.',
    },
    keywords: ["completion", "accomplishment", "integration"]
  },
  // Minor Arcana - Wands
  {
    name: 'Ace of Wands',
    emoji: '🔥',
    arcana: 'Minor',
    suit: 'Wands',
    meaning: {
      upright: 'Inspiration, new opportunities, growth, potential, creativity.',
      reversed: 'An emerging idea, lack of direction, distractions, delays.',
    },
    keywords: ["potential", "inspiration", "new beginnings"]
  },
  {
    name: 'Two of Wands',
    emoji: '🗺️',
    arcana: 'Minor',
    suit: 'Wands',
    meaning: {
      upright: 'Future planning, progress, decisions, discovery, partnership.',
      reversed: 'Fear of unknown, lack of planning, personal goals, playing it safe.',
    },
    keywords: ["planning", "decisions", "progress"]
  },
  {
    name: 'Three of Wands',
    emoji: '🚢',
    arcana: 'Minor',
    suit: 'Wands',
    meaning: {
      upright: 'Preparation, foresight, enterprise, expansion, looking ahead.',
      reversed: 'Lack of foresight, unexpected delays, obstacles to long-term goals.',
    },
    keywords: ["expansion", "foresight", "waiting"]
  },
  {
    name: 'Four of Wands',
    emoji: '🎉',
    arcana: 'Minor',
    suit: 'Wands',
    meaning: {
      upright: 'Celebration, joy, harmony, relaxation, homecoming, community.',
      reversed: 'Personal celebration, inner harmony, conflict with others, transition.',
    },
    keywords: ["celebration", "harmony", "home"]
  },
  {
    name: 'Five of Wands',
    emoji: '⚔️',
    arcana: 'Minor',
    suit: 'Wands',
    meaning: {
      upright: 'Conflict, disagreements, competition, tension, diversity.',
      reversed: 'Inner conflict, conflict avoidance, releasing tension, finding solutions.',
    },
    keywords: ["conflict", "competition", "disagreements"]
  },
  {
    name: 'Six of Wands',
    emoji: '🏆',
    arcana: 'Minor',
    suit: 'Wands',
    meaning: {
      upright: 'Public recognition, victory, success, progress, self-confidence.',
      reversed: 'Private achievement, personal definition of success, fall from grace, egotism.',
    },
    keywords: ["victory", "recognition", "success"]
  },
  {
    name: 'Seven of Wands',
    emoji: '🛡️',
    arcana: 'Minor',
    suit: 'Wands',
    meaning: {
      upright: 'Challenge, competition, perseverance, protection, standing up for beliefs.',
      reversed: 'Exhaustion, giving up, overwhelmed, not defending oneself.',
    },
    keywords: ["perseverance", "challenge", "defense"]
  },
  {
    name: 'Eight of Wands',
    emoji: '✈️',
    arcana: 'Minor',
    suit: 'Wands',
    meaning: {
      upright: 'Speed, action, air travel, movement, swift change, alignment.',
      reversed: 'Delays, frustration, resisting change, internal alignment.',
    },
    keywords: ["action", "speed", "change"]
  },
  {
    name: 'Nine of Wands',
    emoji: '🤕',
    arcana: 'Minor',
    suit: 'Wands',
    meaning: {
      upright: 'Resilience, courage, persistence, test of faith, boundaries.',
      reversed: 'Inner resources, struggle, overwhelm, defensive, paranoia.',
    },
    keywords: ["resilience", "courage", "boundaries"]
  },
  {
    name: 'Ten of Wands',
    emoji: '😩',
    arcana: 'Minor',
    suit: 'Wands',
    meaning: {
      upright: 'Burden, extra responsibility, hard work, stress, accomplishment.',
      reversed: 'Doing it all, carrying the burden, delegation, release.',
    },
    keywords: ["burden", "responsibility", "stress"]
  },
  {
    name: 'Page of Wands',
    emoji: '👦🔥',
    arcana: 'Minor',
    suit: 'Wands',
    meaning: {
      upright: 'Enthusiasm, exploration, discovery, free spirit, creative ideas.',
      reversed: 'Newly-formed ideas, redirecting energy, self-limiting beliefs, a spiritual path.',
    },
    keywords: ["enthusiasm", "exploration", "creativity"]
  },
  {
    name: 'Knight of Wands',
    emoji: '👨‍🚀🔥',
    arcana: 'Minor',
    suit: 'Wands',
    meaning: {
      upright: 'Energy, passion, inspired action, adventure, impulsiveness.',
      reversed: 'Passion project, haste, scattered energy, delays, frustration.',
    },
    keywords: ["passion", "adventure", "action"]
  },
  {
    name: 'Queen of Wands',
    emoji: '👩‍👑🔥',
    arcana: 'Minor',
    suit: 'Wands',
    meaning: {
      upright: 'Courage, confidence, independence, social butterfly, determination.',
      reversed: 'Self-respect, self-confidence, introverted, a blocked social life.',
    },
    keywords: ["confidence", "courage", "independence"]
  },
  {
    name: 'King of Wands',
    emoji: '👨‍👑🔥',
    arcana: 'Minor',
    suit: 'Wands',
    meaning: {
      upright: 'Natural-born leader, vision, entrepreneur, honour, charisma.',
      reversed: 'Impulsiveness, haste, ruthless, high expectations, lack of leadership.',
    },
    keywords: ["leadership", "vision", "honor"]
  },
  // Minor Arcana - Cups
  {
    name: 'Ace of Cups',
    emoji: '💧',
    arcana: 'Minor',
    suit: 'Cups',
    meaning: {
      upright: 'Love, new relationships, compassion, creativity, emotional beginnings.',
      reversed: 'Self-love, intuition, repressed emotions, creative block.',
    },
    keywords: ["love", "new feelings", "compassion"]
  },
  {
    name: 'Two of Cups',
    emoji: '🥂',
    arcana: 'Minor',
    suit: 'Cups',
    meaning: {
      upright: 'Unified love, partnership, mutual attraction, connection.',
      reversed: 'Self-love, break-ups, disharmony, distrust, imbalance.',
    },
    keywords: ["partnership", "love", "connection"]
  },
  {
    name: 'Three of Cups',
    emoji: '💃',
    arcana: 'Minor',
    suit: 'Cups',
    meaning: {
      upright: 'Celebration, friendship, creativity, collaborations, community.',
      reversed: 'Independence, alone time, hardcore partying, ‘three’s a crowd’.',
    },
    keywords: ["celebration", "friendship", "community"]
  },
  {
    name: 'Four of Cups',
    emoji: '😒',
    arcana: 'Minor',
    suit: 'Cups',
    meaning: {
      upright: 'Meditation, contemplation, apathy, reevaluation, withdrawal.',
      reversed: 'Retreat, withdrawal, checking in for alignment, introspection.',
    },
    keywords: ["apathy", "contemplation", "disconnection"]
  },
  {
    name: 'Five of Cups',
    emoji: '😭',
    arcana: 'Minor',
    suit: 'Cups',
    meaning: {
      upright: 'Regret, failure, disappointment, pessimism, loss.',
      reversed: 'Personal setbacks, self-forgiveness, moving on, acceptance.',
    },
    keywords: ["loss", "regret", "disappointment"]
  },
  {
    name: 'Six of Cups',
    emoji: '👶',
    arcana: 'Minor',
    suit: 'Cups',
    meaning: {
      upright: 'Revisiting the past, childhood memories, innocence, joy, nostalgia.',
      reversed: 'Living in the past, forgiveness, lacking playfulness, maturity.',
    },
    keywords: ["nostalgia", "innocence", "reunion"]
  },
  {
    name: 'Seven of Cups',
    emoji: '🤔',
    arcana: 'Minor',
    suit: 'Cups',
    meaning: {
      upright: 'Opportunities, choices, wishful thinking, illusion, fantasy.',
      reversed: 'Alignment, personal values, overwhelmed by choices, clarity.',
    },
    keywords: ["choices", "illusion", "daydreaming"]
  },
  {
    name: 'Eight of Cups',
    emoji: '🚶‍♀️',
    arcana: 'Minor',
    suit: 'Cups',
    meaning: {
      upright: 'Disappointment, abandonment, withdrawal, escapism, seeking truth.',
      reversed: 'Trying one more time, indecision, aimless drifting, walking away.',
    },
    keywords: ["walking away", "withdrawal", "disappointment"]
  },
  {
    name: 'Nine of Cups',
    emoji: '😊',
    arcana: 'Minor',
    suit: 'Cups',
    meaning: {
      upright: 'Contentment, satisfaction, gratitude, wish come true, happiness.',
      reversed: 'Inner happiness, materialism, dissatisfaction, indulgence.',
    },
    keywords: ["wishes fulfilled", "satisfaction", "contentment"]
  },
  {
    name: 'Ten of Cups',
    emoji: '👨‍👩‍👧‍👦',
    arcana: 'Minor',
    suit: 'Cups',
    meaning: {
      upright: 'Divine love, blissful relationships, harmony, alignment, family.',
      reversed: 'Disconnected from others, struggling relationships, seeking connection.',
    },
    keywords: ["harmony", "family", "fulfillment"]
  },
  {
    name: 'Page of Cups',
    emoji: '👦💧',
    arcana: 'Minor',
    suit: 'Cups',
    meaning: {
      upright: 'Creative opportunities, intuitive messages, curiosity, possibility.',
      reversed: 'New ideas, doubting intuition, creative blocks, emotional immaturity.',
    },
    keywords: ["creativity", "intuition", "curiosity"]
  },
  {
    name: 'Knight of Cups',
    emoji: '👨‍🚀💧',
    arcana: 'Minor',
    suit: 'Cups',
    meaning: {
      upright: 'Creativity, romance, charm, imagination, beauty, following your heart.',
      reversed: 'Overactive imagination, unrealistic, jealousy, moodiness, creative block.',
    },
    keywords: ["romance", "charm", "imagination"]
  },
  {
    name: 'Queen of Cups',
    emoji: '👩‍👑💧',
    arcana: 'Minor',
    suit: 'Cups',
    meaning: {
      upright: 'Compassionate, caring, emotionally stable, intuitive, in flow.',
      reversed: 'Inner feelings, self-care, self-love, co-dependency, emotional insecurity.',
    },
    keywords: ["compassion", "intuition", "emotional security"]
  },
  {
    name: 'King of Cups',
    emoji: '👨‍👑💧',
    arcana: 'Minor',
    suit: 'Cups',
    meaning: {
      upright: 'Emotionally balanced, compassionate, diplomatic, in control.',
      reversed: 'Self-compassion, inner feelings, moodiness, emotionally manipulative.',
    },
    keywords: ["emotional balance", "diplomacy", "compassion"]
  },
  // Minor Arcana - Swords
  {
    name: 'Ace of Swords',
    emoji: '🗡️',
    arcana: 'Minor',
    suit: 'Swords',
    meaning: {
      upright: 'Breakthroughs, new ideas, mental clarity, success, truth.',
      reversed: 'Inner clarity, re-thinking an idea, clouded judgement, confusion.',
    },
    keywords: ["clarity", "breakthrough", "new ideas"]
  },
  {
    name: 'Two of Swords',
    emoji: '⚖️',
    arcana: 'Minor',
    suit: 'Swords',
    meaning: {
      upright: 'Difficult decisions, weighing up options, an impasse, avoidance.',
      reversed: 'Indecision, confusion, information overload, stalemate.',
    },
    keywords: ["indecision", "stalemate", "choices"]
  },
  {
    name: 'Three of Swords',
    emoji: '💔',
    arcana: 'Minor',
    suit: 'Swords',
    meaning: {
      upright: 'Heartbreak, emotional pain, sorrow, grief, hurt, separation.',
      reversed: 'Negative self-talk, releasing pain, optimism, forgiveness.',
    },
    keywords: ["heartbreak", "sorrow", "pain"]
  },
  {
    name: 'Four of Swords',
    emoji: '🛌',
    arcana: 'Minor',
    suit: 'Swords',
    meaning: {
      upright: 'Rest, relaxation, meditation, contemplation, recuperation.',
      reversed: 'Exhaustion, burn-out, deep contemplation, stagnation.',
    },
    keywords: ["rest", "contemplation", "recuperation"]
  },
  {
    name: 'Five of Swords',
    emoji: '😠',
    arcana: 'Minor',
    suit: 'Swords',
    meaning: {
      upright: 'Conflict, disagreements, competition, defeat, winning at all costs.',
      reversed: 'Reconciliation, making amends, past resentment, desire to reconcile.',
    },
    keywords: ["conflict", "defeat", "betrayal"]
  },
  {
    name: 'Six of Swords',
    emoji: '🚣‍♀️',
    arcana: 'Minor',
    suit: 'Swords',
    meaning: {
      upright: 'Transition, change, rite of passage, releasing baggage, moving on.',
      reversed: 'Personal transition, resistance to change, unfinished business.',
    },
    keywords: ["transition", "moving on", "release"]
  },
  {
    name: 'Seven of Swords',
    emoji: '🤫',
    arcana: 'Minor',
    suit: 'Swords',
    meaning: {
      upright: 'Betrayal, deception, getting away with something, acting strategically.',
      reversed: 'Imposter syndrome, self-deceit, keeping secrets, coming clean.',
    },
    keywords: ["deception", "betrayal", "stealth"]
  },
  {
    name: 'Eight of Swords',
    emoji: '⛓️',
    arcana: 'Minor',
    suit: 'Swords',
    meaning: {
      upright: 'Negative thoughts, self-imposed restriction, imprisonment, victim mentality.',
      reversed: 'Self-limiting beliefs, inner critic, releasing negative thoughts, open to new perspectives.',
    },
    keywords: ["restriction", "limitation", "victim mentality"]
  },
  {
    name: 'Nine of Swords',
    emoji: '😰',
    arcana: 'Minor',
    suit: 'Swords',
    meaning: {
      upright: 'Anxiety, worry, fear, depression, nightmares, despair.',
      reversed: 'Inner turmoil, deep-seated fears, secrets, releasing worry.',
    },
    keywords: ["anxiety", "fear", "despair"]
  },
  {
    name: 'Ten of Swords',
    emoji: '😵',
    arcana: 'Minor',
    suit: 'Swords',
    meaning: {
      upright: 'Painful endings, deep wounds, betrayal, loss, crisis, rock bottom.',
      reversed: 'Recovery, regeneration, resisting an inevitable end, can’t get any worse.',
    },
    keywords: ["endings", "betrayal", "crisis"]
  },
  {
    name: 'Page of Swords',
    emoji: '👦🗡️',
    arcana: 'Minor',
    suit: 'Swords',
    meaning: {
      upright: 'New ideas, curiosity, thirst for knowledge, new ways of communicating.',
      reversed: 'Self-expression, all talk and no action, haphazard action, haste.',
    },
    keywords: ["curiosity", "new ideas", "communication"]
  },
  {
    name: 'Knight of Swords',
    emoji: '👨‍🚀🗡️',
    arcana: 'Minor',
    suit: 'Swords',
    meaning: {
      upright: 'Ambitious, action-oriented, driven to succeed, fast-thinking.',
      reversed: 'Restless, unfocused, impulsive, burn-out, missed opportunities.',
    },
    keywords: ["ambition", "action", "haste"]
  },
  {
    name: 'Queen of Swords',
    emoji: '👩‍👑🗡️',
    arcana: 'Minor',
    suit: 'Swords',
    meaning: {
      upright: 'Independent, unbiased judgement, clear boundaries, direct communication.',
      reversed: 'Overly-emotional, easily influenced, bitchy, cold-hearted, cruel.',
    },
    keywords: ["independence", "clear boundaries", "truth"]
  },
  {
    name: 'King of Swords',
    emoji: '👨‍👑🗡️',
    arcana: 'Minor',
    suit: 'Swords',
    meaning: {
      upright: 'Mental clarity, intellectual power, authority, truth, analytical.',
      reversed: 'Quiet power, inner truth, misuse of power, manipulation, tyrannical.',
    },
    keywords: ["authority", "truth", "intellect"]
  },
  // Minor Arcana - Pentacles
  {
    name: 'Ace of Pentacles',
    emoji: '💰',
    arcana: 'Minor',
    suit: 'Pentacles',
    meaning: {
      upright: 'New financial or career opportunities, manifestation, abundance.',
      reversed: 'Lost opportunity, lack of planning and foresight, financial insecurity.',
    },
    keywords: ["opportunity", "manifestation", "abundance"]
  },
  {
    name: 'Two of Pentacles',
    emoji: '⚖️',
    arcana: 'Minor',
    suit: 'Pentacles',
    meaning: {
      upright: 'Multiple priorities, time management, prioritization, adaptability.',
      reversed: 'Over-committed, disorganisation, re-prioritising, financial disarray.',
    },
    keywords: ["balance", "prioritization", "adaptability"]
  },
  {
    name: 'Three of Pentacles',
    emoji: '🤝',
    arcana: 'Minor',
    suit: 'Pentacles',
    meaning: {
      upright: 'Teamwork, collaboration, learning, implementation, building on success.',
      reversed: 'Disharmony, misalignment, working alone, lack of collaboration.',
    },
    keywords: ["teamwork", "collaboration", "skill"]
  },
  {
    name: 'Four of Pentacles',
    emoji: '🏦',
    arcana: 'Minor',
    suit: 'Pentacles',
    meaning: {
      upright: 'Saving money, security, conservatism, scarcity, control.',
      reversed: 'Over-spending, greed, self-protection, letting go of control.',
    },
    keywords: ["security", "control", "saving"]
  },
  {
    name: 'Five of Pentacles',
    emoji: '🥶',
    arcana: 'Minor',
    suit: 'Pentacles',
    meaning: {
      upright: 'Financial loss, poverty, lack mindset, isolation, worry.',
      reversed: 'Recovery from financial loss, spiritual poverty, forgiveness.',
    },
    keywords: ["poverty", "insecurity", "loss"]
  },
  {
    name: 'Six of Pentacles',
    emoji: '🤲',
    arcana: 'Minor',
    suit: 'Pentacles',
    meaning: {
      upright: 'Giving, receiving, sharing wealth, generosity, charity.',
      reversed: 'Self-care, unpaid debts, one-sided charity, strings-attached gifts.',
    },
    keywords: ["generosity", "charity", "sharing"]
  },
  {
    name: 'Seven of Pentacles',
    emoji: '🌱',
    arcana: 'Minor',
    suit: 'Pentacles',
    meaning: {
      upright: 'Long-term view, sustainable results, perseverance, investment.',
      reversed: 'Lack of long-term vision, limited success or reward, impatience.',
    },
    keywords: ["patience", "investment", "perseverance"]
  },
  {
    name: 'Eight of Pentacles',
    emoji: '🛠️',
    arcana: 'Minor',
    suit: 'Pentacles',
    meaning: {
      upright: 'Apprenticeship, repetitive tasks, mastery, skill development.',
      reversed: 'Self-development, perfectionism, misdirected activity, lack of motivation.',
    },
    keywords: ["mastery", "skill development", "diligence"]
  },
  {
    name: 'Nine of Pentacles',
    emoji: '💎',
    arcana: 'Minor',
    suit: 'Pentacles',
    meaning: {
      upright: 'Abundance, luxury, self-sufficiency, financial independence, fruits of labor.',
      reversed: 'Self-worth, over-working, financial dependency, hustling.',
    },
    keywords: ["abundance", "self-sufficiency", "luxury"]
  },
  {
    name: 'Ten of Pentacles',
    emoji: '🏰',
    arcana: 'Minor',
    suit: 'Pentacles',
    meaning: {
      upright: 'Wealth, financial security, family, long-term success, contribution.',
      reversed: 'The dark side of wealth, financial failure or loss, loneliness.',
    },
    keywords: ["legacy", "wealth", "family"]
  },
  {
    name: 'Page of Pentacles',
    emoji: '👦💰',
    arcana: 'Minor',
    suit: 'Pentacles',
    meaning: {
      upright: 'Manifestation, financial opportunity, skill development, new career.',
      reversed: 'Lack of progress, procrastination, learn from failure, getting organised.',
    },
    keywords: ["manifestation", "opportunity", "learning"]
  },
  {
    name: 'Knight of Pentacles',
    emoji: '👨‍🚀💰',
    arcana: 'Minor',
    suit: 'Pentacles',
    meaning: {
      upright: 'Hard work, productivity, routine, conservatism, diligence.',
      reversed: 'Self-discipline, boredom, feeling ‘stuck’, perfectionism.',
    },
    keywords: ["hard work", "routine", "diligence"]
  },
  {
    name: 'Queen of Pentacles',
    emoji: '👩‍👑💰',
    arcana: 'Minor',
    suit: 'Pentacles',
    meaning: {
      upright: 'Nurturing, practical, providing financially, a working parent.',
      reversed: 'Financial independence, self-care, work-home conflict, jealousy.',
    },
    keywords: ["nurturing", "practicality", "security"]
  },
  {
    name: 'King of Pentacles',
    emoji: '👨‍👑💰',
    arcana: 'Minor',
    suit: 'Pentacles',
    meaning: {
      upright: 'Wealth, business, leadership, security, discipline, abundance.',
      reversed: 'Financially inept, obsessed with wealth and status, stubborn.',
    },
    keywords: ["wealth", "leadership", "security"]
  },
];