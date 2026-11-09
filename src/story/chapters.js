// Story mode: Nayan's life in nine chapters, one rasa (emotion) per chapter.
//
// Every chapter pairs an Indian source with a world source. Narration is original to Dwandva.
// Quotes are only from public-domain works and are always credited. Where a quote is in
// Sanskrit, Hindi or Japanese, `orig` holds the original and `text` an English rendering
// written for this game (marked with `rendering: true`).
//
// Panel types:
//   scene  narration over the arena. who: 'nayan' | 'both' | 'emotion' | 'none'
//          pose / epose: idle | crouch | block | win | hit | ko (for Nayan / the emotion)
//   quote  a quotation with its source
// Each chapter also has a `duel` panel (shown just before the fight), `win` panels and a `lose` line.

export const CHAPTERS = [
  {
    id: 'bhayanaka', n: 1, age: 6, emotion: 'bhayanaka', stage: 'aangan', cpu: 0,
    rasa: 'Bhayanaka', english: 'Fear', dev: 'भयानक',
    sources: [
      { writer: 'Rabindranath Tagore', work: 'The Hero', year: '1913', from: 'India' },
      { writer: 'Brothers Grimm', work: 'The Youth Who Went Forth to Learn What Fear Was', year: '1812', from: 'Germany' },
    ],
    intro: [
      { type: 'scene', who: 'nayan', pose: 'crouch', text: "The power has gone out again. Nayan is six. His name means 'eyes', but tonight he cannot see a thing. The courtyard after dark is the biggest place in the world, and every rustle in the neem tree has teeth." },
      { type: 'quote', text: 'Mother, let us imagine we are travelling, and passing through a strange and dangerous country.', by: 'Rabindranath Tagore', work: 'The Hero, from The Crescent Moon (1913)' },
      { type: 'scene', who: 'nayan', pose: 'block', text: "In Tagore's poem, a small boy rides beside his mother's palanquin and dreams of fighting off a band of robbers. In the Grimms' old tale, a youth roams the world trying to learn how to be afraid. Nayan has the opposite problem." },
      { type: 'quote', text: 'If I could but shudder!', by: 'Brothers Grimm', work: 'The Youth Who Went Forth to Learn What Fear Was (1812), tr. Margaret Hunt' },
    ],
    duel: { text: 'Something unfolds from the shadow of the tree. It is taller than the house, and its eyes are two cold lamps.', line: 'I am every sound you cannot name. Run inside, little one.' },
    win: [{ type: 'scene', who: 'nayan', pose: 'win', text: 'Fear does not vanish. It shrinks to the size of a shadow, and shadows need light to exist. Nayan walks back inside slowly, on purpose.' }],
    lose: 'Nayan runs inside and pulls the blanket over his head. Fear waits patiently by the door.',
  },
  {
    id: 'hasya', n: 2, age: 9, emotion: 'hasya', stage: 'mela', cpu: 0,
    rasa: 'Hasya', english: 'Laughter', dev: 'हास्य',
    sources: [
      { writer: 'Tenali Rama', work: 'folk tales of the Vijayanagara court', year: '16th century', from: 'India' },
      { writer: 'Mark Twain', work: 'The Adventures of Tom Sawyer', year: '1876', from: 'USA' },
    ],
    intro: [
      { type: 'scene', who: 'nayan', pose: 'idle', text: 'Nayan is nine, and the mela has come to town. He has just discovered that a good joke can get you out of trouble, or into a great deal more of it.' },
      { type: 'scene', who: 'none', text: 'Tenali Rama, the court poet of Vijayanagara, once heard thieves lurking near his house. He told his wife, loudly, that their jewels were hidden at the bottom of the well. The thieves hauled water all night. By morning his garden was soaked, and the well held only stones.' },
      { type: 'quote', text: 'Work consists of whatever a body is obliged to do, and Play consists of whatever a body is not obliged to do.', by: 'Mark Twain', work: 'The Adventures of Tom Sawyer (1876)' },
    ],
    duel: { text: 'A grinning figure in white cartwheels out between the stalls, laughing at nothing, and then at Nayan.', line: "Laugh with me, or I'll laugh at you. Your choice!" },
    win: [{ type: 'scene', who: 'both', pose: 'win', text: 'Nayan learns the difference between laughing with someone and laughing at them. Hasya bows, still giggling, and lets him keep the joke.' }],
    lose: "Everyone is laughing, and Nayan can't tell who the joke is on.",
  },
  {
    id: 'adbhuta', n: 3, age: 12, emotion: 'adbhuta', stage: 'ramgiri', cpu: 0,
    rasa: 'Adbhuta', english: 'Wonder', dev: 'अद्भुत',
    sources: [
      { writer: 'Kalidasa', work: 'Meghaduta (The Cloud Messenger)', year: 'c. 5th century', from: 'India' },
      { writer: 'Lewis Carroll', work: "Alice's Adventures in Wonderland", year: '1865', from: 'England' },
    ],
    intro: [
      { type: 'scene', who: 'nayan', pose: 'idle', text: 'At twelve, Nayan climbs the hill behind his school to watch the first monsoon clouds roll in. They are so enormous that the sky seems to lean down to look at him.' },
      { type: 'scene', who: 'none', text: "Some fifteen centuries ago, Kalidasa imagined an exiled yaksha on Ramagiri hill, begging a passing rain cloud to carry a message to the one he loved. In Meghaduta, the cloud's journey north becomes a map of every river, city and mountain worth wondering at, with cranes flying alongside." },
      { type: 'quote', text: 'Curiouser and curiouser!', by: 'Lewis Carroll', work: "Alice's Adventures in Wonderland (1865)" },
    ],
    duel: { text: "A golden figure steps out of the thunderhead, scattering light like a question that won't stop asking itself.", line: 'Why is the sky so big? Why are you so small? Keep up!' },
    win: [{ type: 'scene', who: 'nayan', pose: 'win', text: 'Wonder cannot be beaten, only carried. Nayan walks down the hill with more questions than he brought up, and it feels exactly like winning.' }],
    lose: 'The cloud drifts on without him.',
  },
  {
    id: 'raudra', n: 4, age: 15, emotion: 'raudra', stage: 'akhada', cpu: 1,
    rasa: 'Raudra', english: 'Anger', dev: 'रौद्र',
    sources: [
      { writer: 'Vyasa', work: "Mahabharata, Bhima's vow", year: 'ancient', from: 'India' },
      { writer: 'Homer', work: 'The Iliad', year: 'c. 8th century BCE', from: 'Greece' },
    ],
    intro: [
      { type: 'scene', who: 'nayan', pose: 'block', text: "Fifteen. A boy at the akhada mocked Nayan's father, and now Nayan's fists won't unclench. The heat starts in his ears and spreads down his arms." },
      { type: 'scene', who: 'none', text: 'In the Mahabharata, Bhima watched Draupadi dragged into the hall of dice and swore a terrible vow of revenge. His anger kept that promise for thirteen years, and it was never only his to carry.' },
      { type: 'quote', text: 'Sing, O goddess, the anger of Achilles son of Peleus, that brought countless ills upon the Achaeans.', by: 'Homer', work: 'The Iliad, tr. Samuel Butler (1898)' },
    ],
    duel: { text: "The air in the pit catches fire. A red figure rises from the dust, wearing Nayan's own clenched jaw.", line: 'Hit something. Hit anything. Hit me!' },
    win: [{ type: 'scene', who: 'nayan', pose: 'idle', text: "Nayan doesn't win by being angrier. He wins by choosing where the anger goes. Raudra cools into an ember small enough to carry." }],
    lose: "Anger wins, and Nayan says things he can't take back.",
  },
  {
    id: 'bibhatsa', n: 5, age: 17, emotion: 'bibhatsa', stage: 'rooftop', cpu: 1,
    rasa: 'Bibhatsa', english: 'Disgust', dev: 'बीभत्स',
    sources: [
      { writer: 'Kabir', work: 'dohas on empty ritual', year: '15th century', from: 'India' },
      { writer: 'Charles Dickens', work: 'Oliver Twist', year: '1838', from: 'England' },
    ],
    intro: [
      { type: 'scene', who: 'nayan', pose: 'idle', text: 'At seventeen, Nayan moves to the city for college. From the hostel roof he can see how much some people have, and how little others are allowed.' },
      { type: 'quote', text: 'Please, sir, I want some more.', by: 'Charles Dickens', work: 'Oliver Twist (1838)' },
      { type: 'quote', orig: 'Mālā pherat jug bhayā, phirā na man kā pher', text: 'An age spent turning the prayer beads, and the mind has not turned once.', by: 'Kabir', work: 'doha (15th century)', rendering: true },
    ],
    duel: { text: 'Something bloated and blue seeps up through the rain, wearing every face Nayan has learned to despise.', line: 'Look away, like everyone else. Or look closer, and hate them all.' },
    win: [{ type: 'scene', who: 'nayan', pose: 'idle', text: 'Disgust turns out to be a compass, not a home. Nayan keeps the part that points at injustice and lets go of the part that sneers.' }],
    lose: 'Nayan turns from the window and decides nothing can ever be fixed.',
  },
  {
    id: 'shringara', n: 6, age: 21, emotion: 'shringara', stage: 'garden', cpu: 1,
    rasa: 'Shringara', english: 'Love', dev: 'शृंगार',
    sources: [
      { writer: 'Kalidasa', work: 'Abhijnanashakuntalam (Shakuntala)', year: 'c. 5th century', from: 'India' },
      { writer: 'William Shakespeare', work: 'Romeo and Juliet', year: '1597', from: 'England' },
    ],
    intro: [
      { type: 'scene', who: 'nayan', pose: 'idle', text: "Twenty-one. Her name doesn't matter here. What matters is that Nayan forgets how to speak whenever she walks past the lotus pond in the college garden." },
      { type: 'scene', who: 'none', text: "In Kalidasa's Shakuntala, a king falls in love with a girl in a forest hermitage, forgets her under a curse, and remembers only when he sees the ring he gave her. Love, Kalidasa suggests, is also a way of remembering." },
      { type: 'quote', text: 'My bounty is as boundless as the sea, / My love as deep; the more I give to thee, / The more I have, for both are infinite.', by: 'William Shakespeare', work: 'Romeo and Juliet (1597)' },
    ],
    duel: { text: 'A dark, graceful figure drifts across the pond without breaking the water, trailing petals.', line: "You'll give me everything. Everyone does. Shall we dance?" },
    win: [{ type: 'scene', who: 'both', pose: 'idle', text: 'Nayan learns that love asks to be held, not clutched. Shringara smiles and stays, quieter now, like music from another room.' }],
    lose: 'Nayan loses himself completely, which is not the same as finding someone.',
  },
  {
    id: 'veera', n: 7, age: 30, emotion: 'veera', stage: 'kurukshetra', cpu: 2,
    rasa: 'Veera', english: 'Courage', dev: 'वीर',
    sources: [
      { writer: 'Bhagavad Gita', work: "Krishna's counsel to Arjuna", year: 'ancient', from: 'India' },
      { writer: 'Alfred, Lord Tennyson', work: 'Ulysses', year: '1842', from: 'England' },
    ],
    intro: [
      { type: 'scene', who: 'nayan', pose: 'idle', text: 'At thirty, Nayan has a family, a job he is good at, and a choice. He can speak up about something wrong at work and risk all of it, or stay quiet and keep everything.' },
      { type: 'scene', who: 'none', text: "On the field of Kurukshetra, Arjuna dropped his bow between two armies and refused to fight. Krishna's reply became the Bhagavad Gita, and its word for life's pairs of opposites gives this game its name: dvandva." },
      { type: 'quote', orig: 'sukha-duḥkhe same kṛtvā lābhālābhau jayājayau', text: 'Holding pleasure and pain alike, gain and loss, victory and defeat…', by: 'Bhagavad Gita', work: '2.38', rendering: true },
      { type: 'quote', text: 'To strive, to seek, to find, and not to yield.', by: 'Alfred, Lord Tennyson', work: 'Ulysses (1842)' },
    ],
    duel: { text: 'A golden warrior plants a spear in the dust and looks at Nayan as if they have met before. They have.', line: "Courage isn't the absence of fear. It's me. Earn me." },
    win: [{ type: 'scene', who: 'both', pose: 'win', text: "Nayan speaks up. It costs him, and it is worth it. Veera doesn't leave; he becomes the steadiness in Nayan's voice." }],
    lose: 'Nayan stays quiet, and the silence grows heavier every day.',
  },
  {
    id: 'karuna', n: 8, age: 50, emotion: 'karuna', stage: 'ghat', cpu: 2,
    rasa: 'Karuna', english: 'Sorrow', dev: 'करुण',
    sources: [
      { writer: 'Valmiki', work: 'Ramayana, the krauncha birds', year: 'ancient', from: 'India' },
      { writer: 'Anton Chekhov', work: 'Misery', year: '1886', from: 'Russia' },
    ],
    intro: [
      { type: 'scene', who: 'nayan', pose: 'idle', text: 'Nayan is fifty when his mother dies. He carries her ashes to the river at dusk, where the evening lamps float out like small, brave boats.' },
      { type: 'scene', who: 'none', text: 'The first poem in Sanskrit, the story goes, was born from grief. The sage Valmiki saw a hunter shoot one of a pair of krauncha birds, and his sorrow (shoka) poured out as a verse (shloka). From that verse grew the Ramayana.' },
      { type: 'quote', orig: 'mā niṣāda pratiṣṭhāṃ tvam agamaḥ śāśvatīḥ samāḥ', text: 'Hunter, may you find no rest for all the endless years.', by: 'Valmiki', work: 'Ramayana, Bala Kanda', rendering: true },
      { type: 'quote', text: 'To whom shall I tell my grief?', by: 'Anton Chekhov', work: 'Misery (1886), tr. Constance Garnett' },
    ],
    duel: { text: 'A grey figure rises from the water, moving slowly, as if every step costs something.', line: "Don't fight me yet. Feel me first. Then fight, if you still can." },
    win: [{ type: 'scene', who: 'nayan', pose: 'idle', text: "Karuna is sorrow, and it is also compassion: the grief that teaches you to recognise everyone else's. Nayan goes home and calls his son." }],
    lose: "The grief pulls Nayan under for a while. That is allowed. Come back when you're ready.",
  },
  {
    id: 'shanta', n: 9, age: 75, emotion: 'shanta', stage: 'pond', cpu: 0, rule: 'stillness', time: 60,
    rasa: 'Shanta', english: 'Peace', dev: 'शान्त',
    sources: [
      { writer: 'Rabindranath Tagore', work: 'Gitanjali', year: '1912', from: 'India' },
      { writer: 'Matsuo Bashō', work: 'the old pond haiku', year: '1686', from: 'Japan' },
    ],
    intro: [
      { type: 'scene', who: 'nayan', pose: 'idle', text: 'Seventy-five. Nayan\'s knees ache and his grandchildren talk too fast. Every morning he sits by the old pond behind the house and waits for nothing in particular.' },
      { type: 'quote', orig: 'furu ike ya / kawazu tobikomu / mizu no oto', text: 'An old pond. / A frog jumps in. / The sound of water.', by: 'Matsuo Bashō', work: '1686', rendering: true },
      { type: 'scene', who: 'none', text: 'All his life, Nayan has fought: fear, laughter, wonder, anger, disgust, love, courage, sorrow. This last one cannot be fought. It can only be met.' },
    ],
    duel: { text: 'A figure made of morning light settles beside the pond. It will not attack, and you cannot hurt it. Stand still near it, fists lowered, until calm fills.', line: 'There is nothing left to win.' },
    win: [
      { type: 'quote', text: 'Where the mind is without fear and the head is held high…', by: 'Rabindranath Tagore', work: 'Gitanjali 35 (1912)' },
      { type: 'scene', who: 'finale', text: 'For a moment Nayan is six again, in a courtyard at night, and the dark is only the dark. Around him stand every emotion he has met, not as enemies but as the colours of one life.' },
      { type: 'end' },
    ],
    lose: "Nayan couldn't sit still. Peace waits. It always has.",
  },
];
