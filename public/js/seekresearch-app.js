/* ==========================================================================
   1. PROFESSOR DATABASE (SEEKRESEARCH CORE)
   ========================================================================== */
const TOP_30_UNIVERSITIES = [
  { key: "mit", qsRank: "1", qsScore: "100", shortName: "MIT", fullName: "Massachusetts Institute of Technology (MIT)", city: "Cambridge, United States" },
  { key: "imperial", qsRank: "=2", qsScore: "99.2", shortName: "Imperial College London", fullName: "Imperial College London", city: "London, United Kingdom" },
  { key: "stanford", qsRank: "=2", qsScore: "99.2", shortName: "Stanford University", fullName: "Stanford University", city: "Stanford, United States" },
  { key: "oxford", qsRank: "4", qsScore: "98.6", shortName: "University of Oxford", fullName: "University of Oxford", city: "Oxford, United Kingdom" },
  { key: "harvard", qsRank: "5", qsScore: "97.4", shortName: "Harvard University", fullName: "Harvard University", city: "Cambridge, United States" },
  { key: "cambridge", qsRank: "6", qsScore: "97.1", shortName: "University of Cambridge", fullName: "University of Cambridge", city: "Cambridge, United Kingdom" },
  { key: "caltech", qsRank: "7", qsScore: "96.6", shortName: "Caltech", fullName: "California Institute of Technology (Caltech)", city: "Pasadena, United States" },
  { key: "eth", qsRank: "=8", qsScore: "96.3", shortName: "ETH Zurich", fullName: "ETH Zurich", city: "Zürich, Switzerland" },
  { key: "ucl", qsRank: "=8", qsScore: "96.3", shortName: "UCL", fullName: "University College London (UCL)", city: "London, United Kingdom" },
  { key: "nus", qsRank: "10", qsScore: "96.2", shortName: "NUS", fullName: "National University of Singapore (NUS)", city: "Singapore, Singapore" },
  { key: "hku", qsRank: "11", qsScore: "—", shortName: "HKU", fullName: "The University of Hong Kong", city: "Hong Kong SAR, China" },
  { key: "ntu", qsRank: "12", qsScore: "—", shortName: "NTU", fullName: "Nanyang Technological University (NTU)", city: "Singapore, Singapore" },
  { key: "pku", qsRank: "13", qsScore: "—", shortName: "Peking University", fullName: "Peking University", city: "Beijing, China" },
  { key: "tsinghua", qsRank: "14", qsScore: "—", shortName: "Tsinghua University", fullName: "Tsinghua University", city: "Beijing, China" },
  { key: "upenn", qsRank: "15", qsScore: "—", shortName: "UPenn", fullName: "University of Pennsylvania (Penn)", city: "Philadelphia, United States" },
  { key: "cornell", qsRank: "=16", qsScore: "—", shortName: "Cornell University", fullName: "Cornell University", city: "Ithaca, United States" },
  { key: "yale", qsRank: "=16", qsScore: "—", shortName: "Yale University", fullName: "Yale University", city: "New Haven, United States" },
  { key: "cuhk", qsRank: "18", qsScore: "—", shortName: "CUHK", fullName: "The Chinese University of Hong Kong (CUHK)", city: "Hong Kong SAR, China" },
  { key: "unsw", qsRank: "19", qsScore: "—", shortName: "UNSW Sydney", fullName: "UNSW Sydney", city: "Sydney, Australia" },
  { key: "jhu", qsRank: "=20", qsScore: "—", shortName: "Johns Hopkins", fullName: "Johns Hopkins University", city: "Baltimore, United States" },
  { key: "berkeley", qsRank: "=20", qsScore: "—", shortName: "UC Berkeley", fullName: "University of California, Berkeley (UC Berkeley)", city: "Berkeley, United States" },
  { key: "epfl", qsRank: "=22", qsScore: "—", shortName: "EPFL", fullName: "EPFL (École Polytechnique Fédérale de Lausanne)", city: "Lausanne, Switzerland" },
  { key: "melbourne", qsRank: "=22", qsScore: "—", shortName: "Univ. of Melbourne", fullName: "The University of Melbourne", city: "Melbourne, Australia" },
  { key: "uchicago", qsRank: "24", qsScore: "—", shortName: "UChicago", fullName: "University of Chicago", city: "Chicago, United States" },
  { key: "tum", qsRank: "25", qsScore: "89.1", shortName: "TU Munich", fullName: "Technical University of Munich (TU Munich)", city: "Munich, Germany" },
  { key: "fudan", qsRank: "26", qsScore: "89.0", shortName: "Fudan University", fullName: "Fudan University", city: "Shanghai, China" },
  { key: "princeton", qsRank: "27", qsScore: "88.9", shortName: "Princeton University", fullName: "Princeton University", city: "Princeton, United States" },
  { key: "sydney", qsRank: "28", qsScore: "88.4", shortName: "Univ. of Sydney", fullName: "The University of Sydney", city: "Sydney, Australia" },
  { key: "anu", qsRank: "29", qsScore: "87.6", shortName: "ANU", fullName: "Australian National University (ANU)", city: "Canberra, Australia" },
  { key: "mcgill", qsRank: "30", qsScore: "87.5", shortName: "McGill University", fullName: "McGill University", city: "Montreal, Canada" }
];

const UNI_MAP = Object.fromEntries(TOP_30_UNIVERSITIES.map(u => [u.key, u]));

const PROFESSORS_LIST = [
  // #1 MIT
  {
    id: "mit_barzilay", uniKey: "mit", name: "Prof. Regina Barzilay",
    lab: "CSAIL & Jameel Clinic (EECS)", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "School of Engineering Distinguished Professor for AI and Health. Develops machine learning models for early oncology screening and computational drug and antibiotic discovery.",
    focus: "AI in oncology, early cancer diagnostics & molecular antibiotic discovery",
    verifiedUrl: "https://www.csail.mit.edu/person/regina-barzilay"
  },
  {
    id: "mit_rus", uniKey: "mit", name: "Prof. Daniela Rus",
    lab: "Director, MIT CSAIL (EECS)", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "Viterbi Professor and CSAIL Director advancing distributed robotics, soft autonomous systems, deformable tactile skins, and real-world machine learning.",
    focus: "Autonomous robotics, soft robot skin & self-organizing robot collectives",
    verifiedUrl: "https://www.csail.mit.edu/"
  },
  {
    id: "mit_lo", uniKey: "mit", name: "Prof. Andrew W. Lo",
    lab: "MIT Sloan · Laboratory for Financial Engineering", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: true,
    summary: "Director of the Lab for Financial Engineering researching systemic risk, behavioral finance (Adaptive Markets Hypothesis), ML in finance, and biomedical financing.",
    focus: "Adaptive Markets Hypothesis, systemic financial risk & healthcare finance",
    verifiedUrl: "https://mitsloan.mit.edu/faculty/academic-groups/finance/faculty"
  },
  {
    id: "mit_acemoglu", uniKey: "mit", name: "Prof. Daron Acemoglu",
    lab: "MIT Dept. of Economics (SHASS)", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: false,
    summary: "Institute Professor studying political economy, institutions, technology and labor economics, macroeconomic growth, and economic development.",
    focus: "Political economy, institutional economics, automation & labor markets",
    verifiedUrl: "https://mitsloan.mit.edu/faculty/academic-groups/applied-economics"
  },
  {
    id: "mit_reinhart", uniKey: "mit", name: "Prof. Christoph Reinhart",
    lab: "Dept. of Architecture · Sustainable Design Lab", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Leads interdisciplinary environmental building performance, computational daylighting workflows, and low-carbon urban architecture research.",
    focus: "Sustainable architectural simulation, daylighting & urban energy workflows",
    verifiedUrl: "https://architecture.mit.edu/people"
  },
  {
    id: "mit_ishii", uniKey: "mit", name: "Prof. Hiroshi Ishii",
    lab: "MIT Media Lab · Tangible Media Group", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Pioneered Tangible Bits and Radical Atoms, bridging physical materials, interactive design, human-computer interaction, and expressive media.",
    focus: "Tangible interfaces, programmable materials & interactive design media",
    verifiedUrl: "https://www.media.mit.edu/people/"
  },
  {
    id: "mit_bahr", uniKey: "mit", name: "Prof. Arthur Bahr",
    lab: "MIT Literature Section (SHASS)", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Section Head specializing in medieval literature, textual criticism, manuscript materiality, and archival compilation studies.",
    focus: "Medieval manuscripts, textual criticism & material literary history",
    verifiedUrl: "https://lit.mit.edu/faculty"
  },
  {
    id: "mit_ekmekcioglu", uniKey: "mit", name: "Prof. Lerna Ekmekcioglu",
    lab: "MIT History Section (SHASS)", pillar: "Humanities", discipline: "History", highSchoolFriendly: false,
    summary: "McMillan-Stewart Professor and Section Head investigating modern Middle Eastern history, minority survival, gender politics, and historical memory.",
    focus: "Modern Middle Eastern history, gender politics & historical memory",
    verifiedUrl: "https://history.mit.edu/"
  },

  // =2 Imperial College London
  {
    id: "imp_derham", uniKey: "imperial", name: "Prof. Claudia de Rham",
    lab: "Dept. of Physics · Theoretical Physics", pillar: "Sciences", discipline: "Physics", highSchoolFriendly: false,
    summary: "Professor of Theoretical Physics advancing cosmology, massive gravity models, and foundational tests of gravitation.",
    focus: "Theoretical cosmology, gravity theories & fundamental astrophysics",
    verifiedUrl: "https://www.imperial.ac.uk/physics/people/"
  },
  {
    id: "imp_bull", uniKey: "imperial", name: "Prof. Anthony M. J. Bull",
    lab: "Dept. of Bioengineering", pillar: "Sciences", discipline: "Bio", highSchoolFriendly: true,
    summary: "Professor of Musculoskeletal Mechanics studying biomechanics, surgical injury mechanics, and translational assistive bioengineering.",
    focus: "Musculoskeletal biomechanics, trauma mechanisms & bioengineering devices",
    verifiedUrl: "https://www.imperial.ac.uk/bioengineering/people/"
  },
  {
    id: "imp_allen", uniKey: "imperial", name: "Prof. Franklin Allen",
    lab: "Imperial Business School · Brevan Howard Centre", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: true,
    summary: "Executive Director of the Brevan Howard Centre for Financial Analysis focusing on corporate finance, asset pricing bubbles, and comparative financial systems.",
    focus: "Financial crises, corporate governance & comparative financial markets",
    verifiedUrl: "https://www.imperial.ac.uk/business-school/faculty/"
  },
  {
    id: "imp_kosowski", uniKey: "imperial", name: "Prof. Robert Kosowski",
    lab: "Imperial Business School (Finance)", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: true,
    summary: "Studies quantitative asset management, hedge fund risk premiums, mutual fund performance evaluation, and empirical finance.",
    focus: "Asset pricing, hedge fund performance & quantitative risk modeling",
    verifiedUrl: "https://www.imperial.ac.uk/business-school/faculty/"
  },
  {
    id: "imp_shorten", uniKey: "imperial", name: "Prof. Robert Shorten",
    lab: "Dyson School of Design Engineering", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Head of the Dyson School of Design Engineering bridging circular engineering design, smart mobility systems, and cyber-physical infrastructure.",
    focus: "Human-centered systems design, smart mobility & distributed control",
    verifiedUrl: "https://www.imperial.ac.uk/design-engineering/people/"
  },
  {
    id: "imp_deterding", uniKey: "imperial", name: "Prof. Sebastian Deterding",
    lab: "Dyson School of Design Engineering", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Chair in Design Engineering focusing on human-centered technology design, behavioral interaction systems, and ethical interactive media.",
    focus: "Human-centered design engineering, interaction systems & motivational design",
    verifiedUrl: "https://www.imperial.ac.uk/design-engineering/people/"
  },
  {
    id: "imp_dihal", uniKey: "imperial", name: "Dr. Kanta Dihal",
    lab: "Centre for Languages, Culture & Communication", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Associate Professor in Science Communication exploring global cultural narratives of artificial intelligence, ethics, and science communication.",
    focus: "AI narratives across cultures, ethics & public science communication",
    verifiedUrl: "https://www.imperial.ac.uk/"
  },

  // =2 Stanford University
  {
    id: "stanford_feifei", uniKey: "stanford", name: "Prof. Fei-Fei Li",
    lab: "Dept. of Computer Science & Stanford HAI", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "Co-Director of Stanford HAI researching computer vision, spatial intelligence, cognitive neuroscience, and ambient AI for healthcare.",
    focus: "Spatial intelligence, computer vision & human-centered AI systems",
    verifiedUrl: "https://profiles.stanford.edu/fei-fei-li"
  },
  {
    id: "stanford_demarzo", uniKey: "stanford", name: "Prof. Peter DeMarzo",
    lab: "Stanford Graduate School of Business", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: false,
    summary: "Mizuho Financial Group Professor examining corporate finance, dynamic capital structure, executive compensation, and financial contracting.",
    focus: "Corporate finance, dynamic financial contracting & market design",
    verifiedUrl: "https://www.gsb.stanford.edu/faculty-research/faculty"
  },
  {
    id: "stanford_kelley", uniKey: "stanford", name: "Prof. David Kelley",
    lab: "Stanford d.school & Mechanical Engineering", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Founder of the Hasso Plattner Institute of Design (d.school), pioneering human-centered design thinking, iterative prototyping, and creative methodology.",
    focus: "Human-centered design thinking, prototyping methodology & creative inquiry",
    verifiedUrl: "https://dschool.stanford.edu/directory"
  },
  {
    id: "stanford_winterer", uniKey: "stanford", name: "Prof. Caroline Winterer",
    lab: "Dept. of History (School of H&S)", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "William Robertson Coe Professor examining the history of science, technology, environment, and 18th- and 19th-century intellectual networks.",
    focus: "Intellectual history, history of science & early Enlightenment networks",
    verifiedUrl: "https://history.stanford.edu/people/faculty"
  },
  {
    id: "stanford_cao", uniKey: "stanford", name: "Prof. Rosa Cao",
    lab: "Dept. of Philosophy (School of H&S)", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Studies philosophy of mind, neuroscience, cognitive computation, and conceptual foundations bridging biology and artificial intelligence.",
    focus: "Philosophy of neuroscience, computation & representation in AI",
    verifiedUrl: "https://philosophy.stanford.edu/people/faculty"
  },

  // #4 University of Oxford
  {
    id: "ox_bronstein", uniKey: "oxford", name: "Prof. Michael Bronstein",
    lab: "Dept. of Computer Science", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "DeepMind Professor of Artificial Intelligence specializing in geometric deep learning, graph neural networks, and protein design ML.",
    focus: "Geometric deep learning, graph neural networks & molecular AI",
    verifiedUrl: "https://www.cs.ox.ac.uk/"
  },
  {
    id: "ox_snaith", uniKey: "oxford", name: "Prof. Henry Snaith",
    lab: "Dept. of Physics · Condensed Matter", pillar: "Sciences", discipline: "Physics", highSchoolFriendly: false,
    summary: "Professor of Physics pioneering metal-halide perovskite photovoltaics, tandem solar energy materials, and semiconductor optoelectronics.",
    focus: "Perovskite photovoltaics, clean energy semiconductors & solid-state physics",
    verifiedUrl: "https://www.physics.ox.ac.uk/"
  },
  {
    id: "ox_jenkinson", uniKey: "oxford", name: "Prof. Tim Jenkinson",
    lab: "Saïd Business School", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: false,
    summary: "Professor of Finance specializing in private equity performance, institutional asset management, venture finance, and IPO markets.",
    focus: "Private equity, institutional asset management & capital formation",
    verifiedUrl: "https://www.sbs.ox.ac.uk/"
  },
  {
    id: "ox_bordalo", uniKey: "oxford", name: "Prof. Pedro Bordalo",
    lab: "Saïd Business School", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: true,
    summary: "Researches psychologically grounded models of economic choice, memory and selective attention, stereotyping, and macroeconomic credit cycles.",
    focus: "Behavioral macroeconomics, diagnostic expectations & credit cycles",
    verifiedUrl: "https://www.sbs.ox.ac.uk/"
  },
  {
    id: "ox_kiaer", uniKey: "oxford", name: "Prof. Ian Kiaer",
    lab: "The Ruskin School of Art", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Head of the Ruskin School of Art exploring practice-led visual research, sculptural installation, fragile architecture, and philosophy.",
    focus: "Practice-led fine art research, architectural models & material poetics",
    verifiedUrl: "https://www.rsa.ox.ac.uk/"
  },
  {
    id: "oxford_frankopan", uniKey: "oxford", name: "Prof. Peter Frankopan",
    lab: "Faculty of History", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Professor of Global History researching Silk Road exchange networks, Eurasian environmental history, and long-run global transformations.",
    focus: "Global connectivity history, Eurasian networks & climate in history",
    verifiedUrl: "https://www.history.ox.ac.uk/people"
  },

  // #5 Harvard University
  {
    id: "harv_barak", uniKey: "harvard", name: "Prof. Boaz Barak",
    lab: "Harvard SEAS · Computer Science", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "Gordon McKay / Catalyst Professor investigating computational complexity, cryptography, theoretical foundations of deep learning, and AI safety.",
    focus: "Deep learning theory, cryptographic complexity & AI alignment foundations",
    verifiedUrl: "https://seas.harvard.edu/faculty-research"
  },
  {
    id: "harv_lewis", uniKey: "harvard", name: "Prof. Jennifer Lewis",
    lab: "Harvard SEAS & Wyss Institute", pillar: "Sciences", discipline: "Bio", highSchoolFriendly: false,
    summary: "Hansjorg Wyss Professor advancing 3D bioprinting, vascularized organoids, microfluidics, and programmable soft biomaterials.",
    focus: "3D bioprinting, vascularized tissues & programmable functional materials",
    verifiedUrl: "https://seas.harvard.edu/faculty-research"
  },
  {
    id: "harv_lerner", uniKey: "harvard", name: "Prof. Josh Lerner",
    lab: "Harvard Business School (Finance)", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: true,
    summary: "Jacob H. Schiff Professor of Investment Banking studying venture capital, private equity ecosystems, and R&D innovation policy.",
    focus: "Venture capital economics, private equity & science commercialization",
    verifiedUrl: "https://www.hbs.edu/faculty"
  },
  {
    id: "harv_ivashina", uniKey: "harvard", name: "Prof. Victoria Ivashina",
    lab: "Harvard Business School (Finance)", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: false,
    summary: "Lovett-Learned Professor focusing on banking intermediation, corporate credit markets, institutional investing, and macro-finance.",
    focus: "Corporate credit intermediation, banking stability & institutional capital",
    verifiedUrl: "https://www.hbs.edu/faculty"
  },
  {
    id: "harv_whiting", uniKey: "harvard", name: "Prof. Sarah Whiting",
    lab: "Harvard Graduate School of Design (GSD)", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Dean of the GSD examining contemporary urbanism, civic infrastructure, architectural theory, and the public role of spatial design.",
    focus: "Urban architectural theory, civic public form & spatial design criticism",
    verifiedUrl: "https://www.gsd.harvard.edu/faculty/"
  },
  {
    id: "harv_jasanoff", uniKey: "harvard", name: "Prof. Maya Jasanoff",
    lab: "Dept. of History (FAS)", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Coolidge Professor and Department Chair examining global empires, cosmopolitanism, cultural mobility, and oceanic modern history.",
    focus: "Imperial global history, maritime mobility & literary-historical biography",
    verifiedUrl: "https://history.fas.harvard.edu/people"
  },

  // #6 University of Cambridge
  {
    id: "cam_atature", uniKey: "cambridge", name: "Prof. Mete Atatüre",
    lab: "Cavendish Laboratory (Dept. of Physics)", pillar: "Sciences", discipline: "Physics", highSchoolFriendly: false,
    summary: "Head of the Cavendish Laboratory specializing in quantum optics, diamond spin qubits, quantum sensing, and semiconductor nanophotonics.",
    focus: "Solid-state spin qubits, quantum networks & optical control",
    verifiedUrl: "https://www.phy.cam.ac.uk"
  },
  {
    id: "cam_buttery", uniKey: "cambridge", name: "Prof. Paula Buttery",
    lab: "Computer Laboratory (Dept. of CST)", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "Professor of Natural Language Processing and AI studying computational linguistics, low-resource NLP, and automated language assessment.",
    focus: "Computational linguistics, low-resource NLP & human-AI language models",
    verifiedUrl: "https://www.cst.cam.ac.uk"
  },
  {
    id: "cam_lambrecht", uniKey: "cambridge", name: "Prof. Bart Lambrecht",
    lab: "Cambridge Judge Business School", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: false,
    summary: "Head of the Finance Group investigating dynamic corporate governance, investment decisions under uncertainty, M&A, and real options.",
    focus: "Corporate governance, investment under uncertainty & dynamic finance",
    verifiedUrl: "https://www.jbs.cam.ac.uk/faculty-research/faculty-a-z/"
  },
  {
    id: "cam_campbell", uniKey: "cambridge", name: "Prof. James Campbell",
    lab: "Dept. of Architecture", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Professor of Architecture and Construction History examining historical masonry, timber structures, libraries, and architectural craft.",
    focus: "Construction history, historic library architecture & structural heritage",
    verifiedUrl: "https://www.arct.cam.ac.uk/people"
  },
  {
    id: "cam_arnold", uniKey: "cambridge", name: "Prof. John H. Arnold",
    lab: "Faculty of History", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Professor of Medieval History analyzing belief systems, inquisitorial archives, social history, and everyday intellectual culture.",
    focus: "Medieval European history, archival belief studies & historiography",
    verifiedUrl: "https://www.hist.cam.ac.uk/people"
  },

  // #7 Caltech
  {
    id: "caltech_endres", uniKey: "caltech", name: "Prof. Manuel Endres",
    lab: "Division of PMA (Physics)", pillar: "Sciences", discipline: "Physics", highSchoolFriendly: false,
    summary: "Pioneer in optical tweezer neutral-atom arrays, Rydberg quantum computing, entanglement metrology, and many-body quantum control.",
    focus: "Rydberg atom quantum arrays, entanglement control & quantum metrology",
    verifiedUrl: "https://www.pma.caltech.edu/people"
  },
  {
    id: "caltech_elowitz", uniKey: "caltech", name: "Prof. Michael Elowitz",
    lab: "Division of BBE (Bioengineering)", pillar: "Sciences", discipline: "Bio", highSchoolFriendly: true,
    summary: "Co-founder of modern synthetic biology studying genetic circuits, cellular stochastic noise, and synthetic multicellular programming.",
    focus: "Synthetic gene circuits, single-cell dynamics & cell fate programming",
    verifiedUrl: "https://www.bbe.caltech.edu/people/faculty"
  },
  {
    id: "caltech_camerer", uniKey: "caltech", name: "Prof. Colin F. Camerer",
    lab: "Division of HSS · T&C Chen Center", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: true,
    summary: "Axline Professor of Business Economics combining behavioral game theory, financial bubbles, and fMRI/eye-tracking neuroeconomics.",
    focus: "Behavioral economics, neuroeconomics & strategic market reasoning",
    verifiedUrl: "https://www.hss.caltech.edu/people"
  },
  {
    id: "caltech_jacobson", uniKey: "caltech", name: "Prof. Brian R. Jacobson",
    lab: "Division of HSS (Visual & Spatial Culture)", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Studies the history of cinema, media infrastructures, industrial exhibition design, and the built environments of visual media.",
    focus: "Visual culture, media studios & infrastructure design history",
    verifiedUrl: "https://www.hss.caltech.edu/people"
  },
  {
    id: "caltech_buchwald", uniKey: "caltech", name: "Prof. Diana Kormos Buchwald",
    lab: "Division of HSS · Einstein Papers Project", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Director and General Editor of The Einstein Papers Project, researching 20th-century physics history, scientific manuscripts, and relativity.",
    focus: "History of modern physics & documentary curation of Einstein's archive",
    verifiedUrl: "https://www.hss.caltech.edu/people"
  },

  // =8 ETH Zurich
  {
    id: "eth_vechev", uniKey: "eth", name: "Prof. Dr. Martin Vechev",
    lab: "D-INFK · Secure, Reliable & Intelligent Systems Lab", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "Leads the SRI Lab combining formal verification, static program synthesis, trustworthy AI reasoning, and certified neural network robustness.",
    focus: "Reliable AI, formal verification & neural code synthesis",
    verifiedUrl: "https://inf.ethz.ch/people/faculty/faculty.html"
  },
  {
    id: "eth_gersbach", uniKey: "eth", name: "Prof. Dr. Hans Gersbach",
    lab: "D-MTEC · KOF Swiss Economic Institute", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: false,
    summary: "Head of Chair of Macroeconomics researching innovation policy design, banking stability, institutional design, and green transitions.",
    focus: "Macroeconomic policy design, innovation economics & financial stability",
    verifiedUrl: "https://mtec.ethz.ch/the-department/people/professors.html"
  },
  {
    id: "eth_schlueter", uniKey: "eth", name: "Prof. Dr. Arno Schlueter",
    lab: "D-ARCH · Architecture & Building Systems", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Advances adaptive solar building envelopes, zero-carbon architecture, and digital integration of energy systems into spatial design.",
    focus: "Adaptive zero-carbon building skins & computational architecture systems",
    verifiedUrl: "https://arch.ethz.ch/en/the-department/faculty/professors.html"
  },
  {
    id: "eth_boenig", uniKey: "eth", name: "Prof. Dr. Margarita Boenig-Liptsin",
    lab: "D-GESS · Ethics, Technology & Society", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Studies Science & Technology Studies (STS), digital citizenship, algorithmic governance, and ethical frameworks for technical societies.",
    focus: "STS, ethics of computing & digital citizenship across technological shifts",
    verifiedUrl: "https://gess.ethz.ch/en/the-department/people/professorships.html"
  },

  // =8 UCL
  {
    id: "ucl_deisenroth", uniKey: "ucl", name: "Prof. Marc Deisenroth",
    lab: "UCL Centre for Artificial Intelligence (CS)", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "Google DeepMind Chair of ML and AI developing data-efficient reinforcement learning, Bayesian optimization, and AI for fusion & climate.",
    focus: "Probabilistic RL, Bayesian control & scientific AI for climate/fusion",
    verifiedUrl: "https://www.ucl.ac.uk/computer-science/people"
  },
  {
    id: "ucl_ravasi", uniKey: "ucl", name: "Prof. Davide Ravasi",
    lab: "UCL School of Management (Canary Wharf)", pillar: "Commerce", discipline: "Management", highSchoolFriendly: false,
    summary: "Director and Professor of Management studying organizational identity, strategic design culture, and qualitative analytics in digital firms.",
    focus: "Organizational identity, strategy & design-driven corporate innovation",
    verifiedUrl: "https://www.ucl.ac.uk/management/"
  },
  {
    id: "ucl_hanna", uniKey: "ucl", name: "Prof. Sean Hanna",
    lab: "The Bartlett School of Architecture", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Investigates machine learning, spatial computation, automated generative geometry, and complex morphology in architectural design.",
    focus: "AI in architectural generation, spatial syntax & algorithmic design",
    verifiedUrl: "https://www.ucl.ac.uk/bartlett/architecture/people"
  },
  {
    id: "ucl_bruzzi", uniKey: "ucl", name: "Prof. Stella Bruzzi",
    lab: "UCL Faculty of Arts & Humanities", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Executive Dean leading interdisciplinary humanities research in film theory, documentary media, gender narratives, and cultural archives.",
    focus: "Film and documentary theory, visual culture & humanities methodology",
    verifiedUrl: "https://www.ucl.ac.uk/arts-humanities/"
  },

  // #10 NUS
  {
    id: "nus_shokri", uniKey: "nus", name: "Assoc. Prof. Reza Shokri",
    lab: "NUS School of Computing", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "Pioneering differential privacy auditing, data privacy threats in large models, and algorithmic fairness in trustworthy machine learning.",
    focus: "Data privacy in AI, membership inference & trustworthy machine learning",
    verifiedUrl: "https://www.comp.nus.edu.sg/about/people/"
  },
  {
    id: "nus_yam", uniKey: "nus", name: "Prof. Sam Yam Kai Chi",
    lab: "NUS Business School (Management & Org)", pillar: "Commerce", discipline: "Management", highSchoolFriendly: true,
    summary: "Studies organizational behavior, human-AI and human-robot workplace collaboration, ethical leadership, and behavioral decision science.",
    focus: "Human-AI workplace coexistence & behavioral organizational science",
    verifiedUrl: "https://bizfaculty.nus.edu.sg/faculty-directory/"
  },
  {
    id: "nus_widodo", uniKey: "nus", name: "Prof. Johannes Widodo",
    lab: "CDE · Dept. of Architecture", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Directs Asian architectural heritage conservation and urban morphology studies balancing historic preservation with tropical urban density.",
    focus: "Asian urban heritage conservation & sustainable tropical architecture",
    verifiedUrl: "https://cde.nus.edu.sg/arch/people/staff/"
  },
  {
    id: "nus_qu", uniKey: "nus", name: "Prof. Qu Hsueh Ming",
    lab: "FASS · Dept. of Philosophy", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Head of Philosophy focusing on early modern epistemology, David Hume, Immanuel Kant, and historical philosophical arguments.",
    focus: "Early modern philosophy, Humean epistemology & Kantian ethics",
    verifiedUrl: "https://fass.nus.edu.sg/"
  },

  // #11 HKU
  {
    id: "hku_chiribella", uniKey: "hku", name: "Prof. Giulio Chiribella",
    lab: "School of Computing & Data Science (CDS)", pillar: "Sciences", discipline: "Physics", highSchoolFriendly: false,
    summary: "Researches quantum information theory, indefinite causal order, quantum communication channels, and foundational quantum computation.",
    focus: "Quantum information, quantum causation & quantum communication theory",
    verifiedUrl: "https://www.cds.hku.hk/people/academic-staff/"
  },
  {
    id: "hku_cai", uniKey: "hku", name: "Prof. Hongbin Cai",
    lab: "HKU Business School", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: false,
    summary: "Dean and Chair of Economics examining game theory, industrial organization, institutional contracts, and East Asian economic development.",
    focus: "Contract theory, market microstructure & East Asian economic institutions",
    verifiedUrl: "https://www.hkubs.hku.hk/"
  },
  {
    id: "hku_chang", uniKey: "hku", name: "Prof. Yung Ho Chang",
    lab: "HKU Faculty of Architecture", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Dean and renowned architect exploring material tectonic vernacular, contemporary urbanism, and cross-cultural spatial design.",
    focus: "Contemporary tectonic architecture, material craft & urban design",
    verifiedUrl: "https://www.arch.hku.hk/"
  },
  {
    id: "hku_sterken", uniKey: "hku", name: "Prof. Rachel Sterken",
    lab: "HKU Faculty of Arts · Philosophy", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Investigates philosophy of language, social generics, semantic communication, and how language structures beliefs and AI discourse.",
    focus: "Philosophy of language, linguistic pragmatics & conceptual engineering",
    verifiedUrl: "https://arts.hku.hk/"
  },

  // #12 NTU
  {
    id: "ntu_loy", uniKey: "ntu", name: "Prof. Chen Change Loy",
    lab: "College of Computing & Data Science (CCDS)", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "Nanyang Professor advancing generative visual synthesis, image restoration, neural rendering, and deep computer vision architectures.",
    focus: "Generative computer vision, image restoration & deep learning models",
    verifiedUrl: "https://www.ntu.edu.sg/education/faculty-directory"
  },
  {
    id: "ntu_boh", uniKey: "ntu", name: "Prof. Wai Fong Boh",
    lab: "Nanyang Business School (NBS)", pillar: "Commerce", discipline: "Management", highSchoolFriendly: false,
    summary: "President's Chair in Information Systems researching knowledge management, digital platform ecosystems, and corporate IT innovation.",
    focus: "Digital platform strategy, IT management & enterprise knowledge networks",
    verifiedUrl: "https://www.ntu.edu.sg/education/faculty-directory"
  },
  {
    id: "ntu_nanetti", uniKey: "ntu", name: "Prof. Andrea Nanetti",
    lab: "School of Art, Design & Media (ADM)", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Integrates AR/AI interfaces with historical cartography, interactive visualization, and cross-cultural digital heritage design.",
    focus: "Interactive historical cartography, AR heritage & digital humanities design",
    verifiedUrl: "https://www.ntu.edu.sg/education/faculty-directory"
  },
  {
    id: "ntu_sung", uniKey: "ntu", name: "Dr. Winnie Sung",
    lab: "School of Humanities (SoH)", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Focuses on early Confucian philosophy, moral psychology, and comparative ethics bridging analytic philosophy and Chinese thought.",
    focus: "Early Confucian ethics, moral psychology & comparative philosophy",
    verifiedUrl: "https://www.ntu.edu.sg/education/faculty-directory"
  },

  // #13 Peking University
  {
    id: "pku_gao", uniKey: "pku", name: "Prof. Wen Gao",
    lab: "School of Computer Science / EECS", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "Boyaa Chair Professor advancing video coding standards, large-scale multimedia intelligence, computer vision, and neuromorphic vision.",
    focus: "Multimedia AI, video compression standards & brain-inspired computer vision",
    verifiedUrl: "https://cs.pku.edu.cn/info/1089/11751.htm"
  },
  {
    id: "pku_liu", uniKey: "pku", name: "Prof. Qiao Liu",
    lab: "Guanghua School of Management", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: false,
    summary: "Dean and Professor of Finance researching corporate finance, empirical asset pricing, capital allocation, and carbon-neutral transition economics.",
    focus: "Corporate finance, empirical asset pricing & institutional capital markets",
    verifiedUrl: "https://en.gsm.pku.edu.cn/faculty/en/faculty.htm"
  },
  {
    id: "pku_wang", uniKey: "pku", name: "Prof. Wang Fang",
    lab: "College of Architecture & Landscape Arch", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Leads ecological infrastructure, human-water basin adaptability, and spatiotemporal urban resilience planning.",
    focus: "Watershed ecological landscape, urban resilience & geo-design",
    verifiedUrl: "http://www.cala.pku.edu.cn"
  },
  {
    id: "pku_rong", uniKey: "pku", name: "Prof. Rong Xinjiang",
    lab: "Dept. of History · Ancient History", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Renowned authority on Silk Road history, Dunhuang manuscripts, and ancient Eurasian cultural and textual exchanges.",
    focus: "Silk Road archival history, Dunhuang studies & Inner Asian exchange",
    verifiedUrl: "http://www.hist.pku.edu.cn"
  },

  // #14 Tsinghua University
  {
    id: "tsinghua_yao", uniKey: "tsinghua", name: "Prof. Andrew Chi-Chih Yao",
    lab: "IIIS (Yao Class)", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "Turing Award laureate leading theoretical computer science, algorithmic complexity, quantum information, and computational cryptography.",
    focus: "Theoretical CS, quantum computing foundations & algorithmic game theory",
    verifiedUrl: "https://iiis.tsinghua.edu.cn/en/"
  },
  {
    id: "tsinghua_bai", uniKey: "tsinghua", name: "Prof. Bai Chong-En",
    lab: "School of Economics & Management", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: false,
    summary: "Dean of Tsinghua SEM studying macroeconomics, public finance, institutional economic reform, and fiscal productivity dynamics.",
    focus: "Macroeconomics, institutional reform & public financial policy",
    verifiedUrl: "https://www.sem.tsinghua.edu.cn/en/1.2.7"
  },
  {
    id: "tsinghua_zhao", uniKey: "tsinghua", name: "Prof. Zhao Chao",
    lab: "Academy of Arts & Design", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Researches healthcare product design, inclusive user experience, interactive service systems, and design-driven social innovation.",
    focus: "Healthcare UX/industrial design, inclusive systems & interactive media",
    verifiedUrl: "https://www.enad.tsinghua.edu.cn/Academics/Faculty/A_Z.htm"
  },
  {
    id: "tsinghua_zhuang", uniKey: "tsinghua", name: "Prof. Zhuang Weimin",
    lab: "School of Architecture", pillar: "Design", discipline: "Architecture", highSchoolFriendly: false,
    summary: "Leads architectural design methodology, post-occupancy evaluation, and sustainable public civic buildings.",
    focus: "Architectural design methodology & civic building evaluation",
    verifiedUrl: "https://www.arch.tsinghua.edu.cn/en/People/Faculty.htm"
  },
  {
    id: "tsinghua_liu", uniKey: "tsinghua", name: "Prof. Liu Fenrong",
    lab: "Dept. of Philosophy (Humanities)", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Professor of Logic examining preference logic, epistemic social choice, and logical formal reasoning in multi-agent LLMs.",
    focus: "Philosophical logic, social agency & logical reasoning for AI",
    verifiedUrl: "https://www.phil.tsinghua.edu.cn/philen/Faculty/Professors/Content.htm"
  },

  // #15 UPenn
  {
    id: "penn_alur", uniKey: "upenn", name: "Prof. Rajeev Alur",
    lab: "Penn CIS (Computer & Info Science)", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "Zisman Family Professor advancing formal methods, automated verification, syntax-guided program synthesis, and cyber-physical systems.",
    focus: "Formal verification, cyber-physical systems & program synthesis",
    verifiedUrl: "https://www.cis.upenn.edu/people/faculty/"
  },
  {
    id: "penn_goldstein", uniKey: "upenn", name: "Prof. Itay Goldstein",
    lab: "The Wharton School (Finance)", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: true,
    summary: "Ehrenkranz Family Professor investigating information transmission in financial markets, banking fragility, crises, and FinTech.",
    focus: "Financial crises, information economics in markets & FinTech stability",
    verifiedUrl: "https://fnce.wharton.upenn.edu/faculty/"
  },
  {
    id: "penn_braham", uniKey: "upenn", name: "Prof. William W. Braham",
    lab: "Weitzman School of Design (Architecture)", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Director of Center for Environmental Building + Design focusing on building energy systems, ecological performance, and architectural theory.",
    focus: "Environmental architecture, building energy systems & urban ecology",
    verifiedUrl: "https://www.design.upenn.edu/people?field_department_target_id=38"
  },
  {
    id: "penn_farmer", uniKey: "upenn", name: "Prof. Jared Farmer",
    lab: "Dept. of History (SAS)", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Walter H. Annenberg Professor and Chair specializing in environmental history, deep time, ancient ecology, and digital humanities.",
    focus: "Environmental history, deep ecological timelines & digital humanities",
    verifiedUrl: "https://www.history.upenn.edu/people/standing-faculty"
  },

  // =16 Cornell University
  {
    id: "cornell_kleinberg", uniKey: "cornell", name: "Prof. Jon Kleinberg",
    lab: "Bowers CIS · Dept. of Computer Science", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "Tisch University Professor bridging computer science and economics through network science, algorithmic fairness, and social computing.",
    focus: "Algorithmic fairness, information networks & behavioral AI-economics",
    verifiedUrl: "https://www.cs.cornell.edu/people/faculty"
  },
  {
    id: "cornell_karolyi", uniKey: "cornell", name: "Prof. Andrew Karolyi",
    lab: "SC Johnson College of Business", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: true,
    summary: "Dean and Finance Professor studying global capital markets, climate/sustainable finance, institutional flows, and international asset pricing.",
    focus: "Sustainable climate finance & global capital market integration",
    verifiedUrl: "https://business.cornell.edu/faculty-research/faculty/"
  },
  {
    id: "cornell_sabin", uniKey: "cornell", name: "Prof. Jenny Sabin",
    lab: "College of Architecture, Art & Planning (AAP)", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Wiesenberger Professor combining bio-inspired computational architecture, adaptive cellular materials, and digital fabrication.",
    focus: "Bio-inspired architectural robotics, cellular computation & adaptive skins",
    verifiedUrl: "https://aap.cornell.edu/people"
  },
  {
    id: "cornell_baptist", uniKey: "cornell", name: "Prof. Edward E. Baptist",
    lab: "Dept. of History (Arts & Sciences)", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Researches 19th-century economic expansion, historical credit systems, political economy, and archival capitalism studies.",
    focus: "Economic history, financial instrumentation & archival political economy",
    verifiedUrl: "https://history.cornell.edu/department-faculty"
  },

  // =16 Yale University
  {
    id: "yale_spielman", uniKey: "yale", name: "Prof. Daniel A. Spielman",
    lab: "Dept. of Computer Science (SEAS)", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "Sterling Professor known for smoothed analysis of algorithms, spectral graph theory, randomized experimental design, and network ML.",
    focus: "Spectral graph theory, smoothed analysis & algorithmic linear algebra",
    verifiedUrl: "https://engineering.yale.edu/departments/computer-science"
  },
  {
    id: "yale_metrick", uniKey: "yale", name: "Prof. Andrew Metrick",
    lab: "Yale School of Management (ICF)", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: false,
    summary: "Directs the Yale Program on Financial Stability researching systemic banking policy, venture finance, and macroprudential crisis tools.",
    focus: "Financial stability policy, venture finance & banking regulation",
    verifiedUrl: "https://som.yale.edu/faculty-research/faculty-directory"
  },
  {
    id: "yale_berke", uniKey: "yale", name: "Prof. Deborah Berke",
    lab: "Yale School of Architecture", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Dean and Hoppin Professor examining adaptive reuse of civic buildings, sustainable architecture, and everyday spatial craft.",
    focus: "Adaptive reuse architecture, material clarity & civic space design",
    verifiedUrl: "https://www.architecture.yale.edu/faculty"
  },
  {
    id: "yale_blight", uniKey: "yale", name: "Prof. David Blight",
    lab: "Dept. of History", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Sterling Professor of History researching intellectual history, public historical memory, and nineteenth-century constitutional transformation.",
    focus: "Intellectual history, public memory & archival textual biography",
    verifiedUrl: "https://history.yale.edu/people/faculty"
  },

  // #18 CUHK
  {
    id: "cuhk_king", uniKey: "cuhk", name: "Prof. Irwin King",
    lab: "Dept. of Computer Science & Engineering", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "Professor of CSE focusing on trustworthy machine learning, social computing, graph neural networks, and educational NLP systems.",
    focus: "Trustworthy AI, graph neural networks & educational recommender tech",
    verifiedUrl: "https://www.cse.cuhk.edu.hk"
  },
  {
    id: "cuhk_zhang", uniKey: "cuhk", name: "Prof. Dennis Zhang",
    lab: "CUHK Business School (DOT)", pillar: "Commerce", discipline: "Management", highSchoolFriendly: true,
    summary: "Examines data-driven operations analytics, demand forecasting, marketplace pricing algorithms, and platform economics.",
    focus: "Platform marketplace optimization & quantitative supply chain AI",
    verifiedUrl: "https://www.bschool.cuhk.edu.hk"
  },
  {
    id: "cuhk_ng", uniKey: "cuhk", name: "Prof. Edward Yan-Yung Ng",
    lab: "CUHK School of Architecture", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Yao Ling Sun Professor researching urban climatology, high-density tropical ventilation corridors, and sustainable green building.",
    focus: "Urban wind corridors, climatic urban design & net-zero green architecture",
    verifiedUrl: "https://www.arch.cuhk.edu.hk"
  },
  {
    id: "cuhk_cheung", uniKey: "cuhk", name: "Prof. Cheung Sui Wai",
    lab: "Dept. of History (Faculty of Arts)", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Examines Ming and Qing dynasty socio-economic institutions, commodity pricing history, and regional East Asian historical archives.",
    focus: "Ming-Qing socio-economic archives & pre-modern commodity markets",
    verifiedUrl: "https://www.history.cuhk.edu.hk"
  },

  // #19 UNSW Sydney
  {
    id: "unsw_simmons", uniKey: "unsw", name: "Prof. Michelle Simmons",
    lab: "School of Physics · Silicon Quantum Computing", pillar: "Sciences", discipline: "Physics", highSchoolFriendly: false,
    summary: "Scientia Professor advancing atomic electronics in silicon and sub-nanometer precision single-atom qubit architectures.",
    focus: "Atom-precision silicon qubits & nanoscale quantum computing hardware",
    verifiedUrl: "https://research.unsw.edu.au/people/scientia-professor-michelle-yvonne-simmons"
  },
  {
    id: "unsw_masulis", uniKey: "unsw", name: "Prof. Ronald Masulis",
    lab: "UNSW Business School (Banking & Finance)", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: true,
    summary: "Scientia Professor researching empirical corporate finance, board governance, M&A structure, and institutional equity issuances.",
    focus: "Corporate governance, M&A policy & empirical corporate capital markets",
    verifiedUrl: "https://www.unsw.edu.au/business"
  },
  {
    id: "unsw_murray", uniKey: "unsw", name: "Assoc. Prof. Ainslie Murray",
    lab: "UNSW Arts, Design & Architecture (ADA)", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Explores experimental spatial design, site-responsive urban architecture, and cross-disciplinary studio pedagogy.",
    focus: "Spatial architectural experimentation & site-responsive built form",
    verifiedUrl: "https://www.unsw.edu.au/ada"
  },
  {
    id: "unsw_annesley", uniKey: "unsw", name: "Prof. Claire Annesley",
    lab: "UNSW Arts, Design & Architecture (ADA)", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Dean of ADA researching comparative political institutions, gender equality in governance, and public humanities policy.",
    focus: "Institutional governance, gender representation & public policy analysis",
    verifiedUrl: "https://www.unsw.edu.au/ada"
  },

  // =20 Johns Hopkins University
  {
    id: "jhu_miller", uniKey: "jhu", name: "Prof. Michael I. Miller",
    lab: "Dept. of Biomedical Engineering (Director)", pillar: "Sciences", discipline: "Bio", highSchoolFriendly: true,
    summary: "Bessie Darling Massey Professor and BME Director developing computational anatomy, diffeomorphic brain mapping, and imaging science.",
    focus: "Computational neuroanatomy, brain imaging science & biomedical data",
    verifiedUrl: "https://www.bme.jhu.edu/people/faculty"
  },
  {
    id: "jhu_agarwal", uniKey: "jhu", name: "Prof. Ritu Agarwal",
    lab: "Johns Hopkins Carey Business School", pillar: "Commerce", discipline: "Management", highSchoolFriendly: true,
    summary: "Wm. Polk Carey Distinguished Professor researching digital health analytics, AI governance in medicine, and IT-enabled care.",
    focus: "Digital health economics, healthcare AI adoption & analytics strategy",
    verifiedUrl: "https://carey.jhu.edu/faculty-research/faculty-directory"
  },
  {
    id: "jhu_jones", uniKey: "jhu", name: "Prof. Martha Jones",
    lab: "Dept. of History", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Society of Black Alumni Presidential Professor investigating constitutional history, citizenship law, and 19th-century archives.",
    focus: "Legal history, constitutional citizenship & African American archives",
    verifiedUrl: "https://history.jhu.edu/people/faculty"
  },
  {
    id: "jhu_carroll", uniKey: "jhu", name: "Prof. Sean Carroll",
    lab: "Dept. of Philosophy & Physics", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Homewood Professor of Natural Philosophy exploring quantum foundations, spacetime emergence, complexity theory, and philosophy of physics.",
    focus: "Philosophy of quantum mechanics, spacetime emergence & complexity",
    verifiedUrl: "https://philosophy.jhu.edu/people/faculty"
  },

  // =20 UC Berkeley
  {
    id: "berkeley_levine", uniKey: "berkeley", name: "Prof. Sergey Levine",
    lab: "EECS & Berkeley AI Research (BAIR)", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "Advancing deep reinforcement learning, offline robot learning policies, and generalist end-to-end sensorimotor agents.",
    focus: "Deep reinforcement learning, generalist robot control & offline RL",
    verifiedUrl: "https://www.eecs.berkeley.edu/people/faculty/sergey-levine"
  },
  {
    id: "berkeley_doudna", uniKey: "berkeley", name: "Prof. Jennifer Doudna",
    lab: "Molecular & Cell Biology / IGI", pillar: "Sciences", discipline: "Bio", highSchoolFriendly: true,
    summary: "Nobel Laureate and Founder of IGI investigating structural RNA mechanisms and precision CRISPR-Cas genome engineering.",
    focus: "CRISPR-Cas molecular mechanisms, structural RNA & precision genomics",
    verifiedUrl: "https://mcb.berkeley.edu/faculty/mcb/jennifer-a-doudna"
  },
  {
    id: "berkeley_malmendier", uniKey: "berkeley", name: "Prof. Ulrike Malmendier",
    lab: "Haas School of Business (Finance)", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: false,
    summary: "Researches behavioral corporate finance, experience effects on macroeconomic inflation expectations, and managerial decision biases.",
    focus: "Behavioral finance, inflation expectations & corporate decision biases",
    verifiedUrl: "https://haas.berkeley.edu/finance/faculty/"
  },
  {
    id: "berkeley_rael", uniKey: "berkeley", name: "Prof. Ronald Rael",
    lab: "College of Environmental Design (CED)", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Pioneers robotic additive 3D printing of zero-carbon earthen/biomaterial structures and regenerative border architecture.",
    focus: "3D-printed earthen architecture, circular biomaterials & robotic craft",
    verifiedUrl: "https://ced.berkeley.edu/academics/architecture/faculty-and-staff/"
  },
  {
    id: "berkeley_shanken", uniKey: "berkeley", name: "Prof. Andrew Shanken",
    lab: "Dept. of Architecture & History", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Studies architectural historiography, cultural memory in monuments, consumer urbanism, and unbuilt 'paper architecture'.",
    focus: "Memory in built environments, World's Fair design & architectural history",
    verifiedUrl: "https://history.berkeley.edu/people/current-faculty"
  },

  // =22 EPFL
  {
    id: "epfl_vidick", uniKey: "epfl", name: "Prof. Thomas Vidick",
    lab: "School of Computer & Comm Sciences (IC)", pillar: "Sciences", discipline: "Physics", highSchoolFriendly: false,
    summary: "Full Professor researching quantum cryptography, interactive proof verification protocols, and quantum complexity bounds.",
    focus: "Quantum cryptographic verification, nonlocal games & complexity theory",
    verifiedUrl: "https://www.epfl.ch/schools/ic/research/faculty-members/"
  },
  {
    id: "epfl_gruber", uniKey: "epfl", name: "Prof. Marc Gruber",
    lab: "College of Management of Tech (CDM)", pillar: "Commerce", discipline: "Management", highSchoolFriendly: true,
    summary: "Specializes in scientific entrepreneurship, venture market identification strategies, and lab-to-market commercialization.",
    focus: "Technology commercialization, deep-tech venture strategy & innovation",
    verifiedUrl: "https://www.epfl.ch/schools/cdm/faculty/"
  },
  {
    id: "epfl_parascho", uniKey: "epfl", name: "Prof. Stefana Parascho",
    lab: "ENAC · Laboratory for Creative Computation", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Directs CRCL exploring multi-robot cooperative timber/stone construction and computational geometric design workflows.",
    focus: "Multi-robot architectural fabrication & computational design geometry",
    verifiedUrl: "https://www.epfl.ch/schools/enac/education/architecture/professors-enac/"
  },
  {
    id: "epfl_kaplan", uniKey: "epfl", name: "Prof. Frédéric Kaplan",
    lab: "Digital Humanities Laboratory (DHLAB)", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Leads Europe's Time Machine initiative digitizing centuries of historical urban archives with AI computer vision and GIS.",
    focus: "Digital humanities, Venetian historical archives & urban Time Machines",
    verifiedUrl: "https://www.epfl.ch/labs/dhlab/people/"
  },

  // =22 University of Melbourne
  {
    id: "melb_zobel", uniKey: "melbourne", name: "Prof. Justin Zobel",
    lab: "School of Computing & Info Systems", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "Redmond Barry Distinguished Professor advancing search engine indexing algorithms, text compression, and research evaluation metrics.",
    focus: "Information retrieval, scalable text algorithms & scientific methodology",
    verifiedUrl: "https://cis.unimelb.edu.au"
  },
  {
    id: "melb_hollenberg", uniKey: "melbourne", name: "Prof. Lloyd Hollenberg",
    lab: "School of Physics · Quantum Sensing", pillar: "Sciences", discipline: "Physics", highSchoolFriendly: false,
    summary: "Thomas Baker Chair developing nanodiamond NV-center quantum biosensing and spin-based quantum computing architectures.",
    focus: "Quantum biosensing with diamond defects & silicon quantum computation",
    verifiedUrl: "https://physics.unimelb.edu.au"
  },
  {
    id: "melb_akcay", uniKey: "melbourne", name: "Prof. Yalçın Akçay",
    lab: "Melbourne Business School", pillar: "Commerce", discipline: "Management", highSchoolFriendly: true,
    summary: "Examines data-driven revenue management, inventory rationing analytics, service pricing models, and operations strategy.",
    focus: "Operations optimization, dynamic pricing & business decision analytics",
    verifiedUrl: "https://mbs.edu/faculty-and-research/faculty"
  },
  {
    id: "melb_hill", uniKey: "melbourne", name: "Prof. Dan Hill",
    lab: "Melbourne School of Design", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Director of MSD investigating civic strategic design, regenerative urban streets, climate-adaptive public landscapes, and policy.",
    focus: "Strategic civic design, urban ecology & net-zero cities",
    verifiedUrl: "https://msd.unimelb.edu.au"
  },
  {
    id: "melb_edele", uniKey: "melbourne", name: "Prof. Mark Edele",
    lab: "SHAPS (Dept. of History)", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Hansen Chair in History studying 20th-century Eurasian social history, war archives, demobilization, and political transitions.",
    focus: "Eurasian 20th-century history, conflict archives & state society",
    verifiedUrl: "https://shaps.unimelb.edu.au"
  },

  // #24 University of Chicago
  {
    id: "uchic_zhao", uniKey: "uchicago", name: "Prof. Ben Y. Zhao",
    lab: "Dept. of Computer Science (SAND Lab)", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "Neubauer Professor leading adversarial ML security and creator protection systems including Glaze and Nightshade.",
    focus: "Adversarial ML security, Glaze/Nightshade artist protection & privacy",
    verifiedUrl: "https://computerscience.uchicago.edu/people/faculty/"
  },
  {
    id: "uchic_mullainathan", uniKey: "uchicago", name: "Prof. Sendhil Mullainathan",
    lab: "Chicago Booth School of Business", pillar: "Commerce", discipline: "Management", highSchoolFriendly: true,
    summary: "University Professor bridging behavioral economics and machine learning to audit clinical decisions, poverty dynamics, and algorithms.",
    focus: "Behavioral economics + ML, algorithmic equity & scientific discovery tools",
    verifiedUrl: "https://www.chicagobooth.edu/faculty-and-insights/faculty-directory"
  },
  {
    id: "uchic_budish", uniKey: "uchicago", name: "Prof. Eric Budish",
    lab: "Kenneth C. Griffin Dept. of Economics & Booth", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: false,
    summary: "Rothmeier Professor studying high-frequency trading market design (frequent batch auctions), crypto security economics, and patent law.",
    focus: "Financial market design, batch auctions & innovation incentives",
    verifiedUrl: "https://economics.uchicago.edu/people/faculty"
  },
  {
    id: "uchic_ando", uniKey: "uchicago", name: "Prof. Clifford Ando",
    lab: "Dept. of History & Classics", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Distinguished Service Professor researching Roman imperial law, civic institutions, ancient political theory, and religious history.",
    focus: "Roman legal institutions, ancient empires & political jurisprudence",
    verifiedUrl: "https://history.uchicago.edu/people/faculty"
  },

  // #25 TU Munich
  {
    id: "tum_niessner", uniKey: "tum", name: "Prof. Dr. Matthias Niessner",
    lab: "TUM CIT · Visual Computing & AI Lab", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "Leads visual computing research in 3D scene reconstruction, neural rendering, generative geometry, and digital twins.",
    focus: "3D computer vision, neural rendering & generative spatial geometry",
    verifiedUrl: "https://www.cs.cit.tum.de/en/cs/people/professors/"
  },
  {
    id: "tum_kaserer", uniKey: "tum", name: "Prof. Dr. Christoph Kaserer",
    lab: "TUM School of Management", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: false,
    summary: "Chair of Financial Management researching European capital markets, infrastructure investing, banking governance, and private equity.",
    focus: "Capital market valuation, European corporate finance & infrastructure risk",
    verifiedUrl: "https://www.mgt.tum.de/faculty-research/professors"
  },
  {
    id: "tum_kere", uniKey: "tum", name: "Prof. Diebédo Francis Kéré",
    lab: "TUM Dept. of Architecture", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Pritzker Prize laureate and Professor of Architectural Design and Participation championing climate-responsive vernacular building.",
    focus: "Participatory community architecture & passive climate-smart materials",
    verifiedUrl: "https://www.arc.ed.tum.de/en/arc/people/professors/"
  },
  {
    id: "tum_gasser", uniKey: "tum", name: "Prof. Dr. Urs Gasser",
    lab: "TUM School of Social Sciences & Technology", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Dean of SOT focusing on global AI regulation, data governance policy, digital constitutionalism, and information society law.",
    focus: "AI governance, information policy & law of digital transformation",
    verifiedUrl: "https://www.sot.tum.de/en/sot/people/professors/"
  },

  // #26 Fudan University
  {
    id: "fudan_qiu", uniKey: "fudan", name: "Prof. Xipeng Qiu",
    lab: "School of Computer Science (NLP)", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "Leads Fudan NLP & MOSS conversational LLM development, sparse attention architectures, and autonomous AI agent tool use.",
    focus: "Large language models, FudanNLP/MOSS & long-context reasoning",
    verifiedUrl: "https://cs.fudan.edu.cn"
  },
  {
    id: "fudan_fan", uniKey: "fudan", name: "Prof. Fan Longzhen",
    lab: "Fudan School of Management (FDSM)", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: false,
    summary: "Professor of Finance analyzing term structure interest models, Chinese bond pricing dynamics, and quantitative financial risk.",
    focus: "Term structure models, Chinese bond markets & quantitative asset risk",
    verifiedUrl: "https://www.fdsm.fudan.edu.cn/"
  },
  {
    id: "fudan_wu", uniKey: "fudan", name: "Prof. Jingping Wu",
    lab: "Dept. of History", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Examines 20th-century Chinese economic and financial history, modern Shanghai banking archives, and diplomatic records.",
    focus: "Modern Chinese financial history & Shanghai banking archives",
    verifiedUrl: "https://history.fudan.edu.cn"
  },
  {
    id: "fudan_xu", uniKey: "fudan", name: "Prof. Yingjin Xu",
    lab: "School of Philosophy", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Investigates philosophy of artificial intelligence, cognitive heuristics, Wittgenstein, and general artificial intelligence logic.",
    focus: "Philosophy of AI, non-axiomatic reasoning & epistemology",
    verifiedUrl: "https://philosophy.fudan.edu.cn"
  },

  // #27 Princeton University
  {
    id: "prince_arora", uniKey: "princeton", name: "Prof. Sanjeev Arora",
    lab: "Dept. of Computer Science", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "Charles C. Fitzmorris Professor developing mathematical theory for deep learning optimization, emergent LLM reasoning, and complexity.",
    focus: "Mathematical deep learning theory, emergent LLM capabilities & algorithms",
    verifiedUrl: "https://www.cs.princeton.edu/people/faculty"
  },
  {
    id: "prince_brunnermeier", uniKey: "princeton", name: "Prof. Markus Brunnermeier",
    lab: "Dept. of Economics & Bendheim Center", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: false,
    summary: "Edwards S. Sanford Professor studying financial bubbles, liquidity spirals, sovereign debt resilience, and CBDC monetary economics.",
    focus: "Systemic financial crises, digital currency theory & macro-finance",
    verifiedUrl: "https://economics.princeton.edu/"
  },
  {
    id: "prince_colomina", uniKey: "princeton", name: "Prof. Beatriz Colomina",
    lab: "Princeton School of Architecture", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Howard Crosby Butler Professor researching modern architecture history, medicalization of domestic design, and print media technologies.",
    focus: "Architecture & media history, X-Ray aesthetics & modern design theory",
    verifiedUrl: "https://soa.princeton.edu/content/faculty"
  },
  {
    id: "prince_rustow", uniKey: "princeton", name: "Prof. Marina Rustow",
    lab: "Dept. of History · Near Eastern Archives", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Khedouri A. Zilkha Professor directing computational and historical reconstruction of medieval Cairo Geniza archival manuscripts.",
    focus: "Medieval Mediterranean history & Cairo Geniza manuscript reconstruction",
    verifiedUrl: "https://history.princeton.edu/people/faculty"
  },

  // #28 University of Sydney
  {
    id: "usyd_bartlett", uniKey: "sydney", name: "Prof. Stephen Bartlett",
    lab: "School of Physics · Sydney Nano Institute", pillar: "Sciences", discipline: "Physics", highSchoolFriendly: true,
    summary: "Director of Sydney Nano researching fault-tolerant quantum error-correcting codes, topological phases, and quantum architectures.",
    focus: "Quantum error correction codes, fault tolerance & quantum architectures",
    verifiedUrl: "https://www.sydney.edu.au/science/schools/school-of-physics"
  },
  {
    id: "usyd_maguire", uniKey: "sydney", name: "Prof. Steven Maguire",
    lab: "University of Sydney Business School", pillar: "Commerce", discipline: "Management", highSchoolFriendly: true,
    summary: "Researches strategic entrepreneurship, institutional change around emerging risks/sustainability, and technology governance.",
    focus: "Risk governance strategy, sustainable business transitions & innovation",
    verifiedUrl: "https://www.sydney.edu.au/business"
  },
  {
    id: "usyd_mcneill", uniKey: "sydney", name: "Prof. Donald McNeill",
    lab: "School of Architecture, Design & Planning", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Studies global urban governance, tech infrastructure districts, volumetric urban design, and contemporary megaprojects.",
    focus: "Volumetric urbanism, smart-city infrastructure & architectural geography",
    verifiedUrl: "https://www.sydney.edu.au/architecture"
  },
  {
    id: "usyd_adkins", uniKey: "sydney", name: "Prof. Lisa Adkins",
    lab: "Faculty of Arts & Social Sciences (FASS)", pillar: "Humanities", discipline: "History", highSchoolFriendly: false,
    summary: "Dean of FASS examining asset economies, contemporary social inequality, housing finance impacts on society, and economic sociology.",
    focus: "Economic sociology, household asset wealth & social theory",
    verifiedUrl: "https://www.sydney.edu.au/arts/about/our-people.html"
  },

  // #29 ANU
  {
    id: "anu_ness", uniKey: "anu", name: "Prof. Melissa Ness",
    lab: "RSAA · Mount Stromlo Observatory", pillar: "Sciences", discipline: "Physics", highSchoolFriendly: true,
    summary: "Astrophysicist applying generative machine learning to massive stellar spectroscopic surveys to decode the Milky Way's archaeology.",
    focus: "Galactic archaeology, stellar spectroscopy & astronomical ML classifiers",
    verifiedUrl: "https://physics.anu.edu.au"
  },
  {
    id: "anu_xie", uniKey: "anu", name: "Prof. Lexing Xie",
    lab: "ANU School of Computing · CMLab", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "Leads Computational Media Lab focusing on multimodal ML, social network diffusion models, point processes, and factual language AI.",
    focus: "Multimodal ML, information diffusion dynamics & computational media",
    verifiedUrl: "https://comp.anu.edu.au"
  },
  {
    id: "anu_berndt", uniKey: "anu", name: "Prof. Antje Berndt",
    lab: "ANU College of Business & Economics", pillar: "Commerce", discipline: "Finance", highSchoolFriendly: false,
    summary: "Researches corporate credit derivatives, sovereign default risk premia, macroeconomic asset pricing, and treasury markets.",
    focus: "Credit risk premia, sovereign debt spreads & term structure pricing",
    verifiedUrl: "https://cbe.anu.edu.au"
  },
  {
    id: "anu_hinchcliffe", uniKey: "anu", name: "Assoc. Prof. Geoff Hinchcliffe",
    lab: "ANU School of Art & Design", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Head of School of Art & Design pioneering generative data visualization, interactive digital media archives, and generous interfaces.",
    focus: "Cultural data visualization, generous interfaces & interactive design",
    verifiedUrl: "https://soad.cass.anu.edu.au"
  },
  {
    id: "anu_waldby", uniKey: "anu", name: "Prof. Catherine Waldby",
    lab: "Research School of Social Sciences", pillar: "Humanities", discipline: "History", highSchoolFriendly: false,
    summary: "Director of RSSS studying biomedical bioethics, sociology of tissue/stem-cell biobanks, and science-policy governance.",
    focus: "Bioethics, sociology of biomedicine & global reproductive biobanking",
    verifiedUrl: "https://www.anu.edu.au"
  },

  // #30 McGill University
  {
    id: "mcgill_precup", uniKey: "mcgill", name: "Prof. Doina Precup",
    lab: "McGill School of Computer Science", pillar: "Sciences", discipline: "AI", highSchoolFriendly: true,
    summary: "Canada CIFAR AI Chair advancing reinforcement learning theory, temporal abstraction (options framework), and healthcare ML applications.",
    focus: "Temporal abstraction in RL, safe reinforcement learning & healthcare AI",
    verifiedUrl: "https://www.cs.mcgill.ca/people/faculty/"
  },
  {
    id: "mcgill_cohen", uniKey: "mcgill", name: "Prof. Maxime Cohen",
    lab: "Desautels Faculty of Management", pillar: "Commerce", discipline: "Management", highSchoolFriendly: true,
    summary: "SCALE AI Chair in Data Science for Retail focusing on algorithmic pricing, omnichannel retail analytics, and AI operations.",
    focus: "Retail data science, algorithmic demand pricing & operations AI",
    verifiedUrl: "https://www.mcgill.ca/desautels/research/faculty"
  },
  {
    id: "mcgill_bressani", uniKey: "mcgill", name: "Prof. Martin Bressani",
    lab: "Peter Guo-hua Fu School of Architecture", pillar: "Design", discipline: "Architecture", highSchoolFriendly: true,
    summary: "Macdonald Professor researching 19th-century architectural theory, structural rationalism (Viollet-le-Duc), and spatial psychology.",
    focus: "Architectural rationalism, historical theory & spatial psychology",
    verifiedUrl: "https://www.mcgill.ca/architecture/people"
  },
  {
    id: "mcgill_desbarats", uniKey: "mcgill", name: "Prof. Catherine Desbarats",
    lab: "Dept. of History & Classical Studies", pillar: "Humanities", discipline: "History", highSchoolFriendly: true,
    summary: "Examines early modern colonization, French Atlantic networks, indigenous diplomacy archives, and transnational trade history.",
    focus: "Early modern Atlantic world, archival colonialism & trade history",
    verifiedUrl: "https://www.mcgill.ca/history/about/people"
  }
];

/* Populate Top 30 University Selector */
(function populateUniversityDropdown() {
  const select = document.getElementById('uniFilterSelect');
  if (!select) return;
  TOP_30_UNIVERSITIES.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u.key;
    const scorePart = u.qsScore && u.qsScore !== '—' ? ` · ${u.qsScore}` : '';
    opt.textContent = `QS #${u.qsRank} · ${u.shortName} (${u.city.split(',')[0]}${scorePart})`;
    select.appendChild(opt);
  });
})();

let currentPillar = 'all';
let currentDiscipline = 'all';
let currentUniversity = 'all';

function getFacultyInitials(fullName) {
  const cleaned = fullName
    .replace(/^(Assoc\.|Asst\.)\s+Prof\.\s+/i, '')
    .replace(/^Prof\.\s+(Dr\.\s+)?/i, '')
    .replace(/^Dr\.\s+/i, '')
    .trim();
  const parts = cleaned.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return cleaned[0].toUpperCase();
}

function findInputByNameAndValue(name, value) {
  const targetVal = String(value ?? '');
  const inputs = document.getElementsByName(name);
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value === targetVal) return inputs[i];
  }
  return null;
}

function isSafeHttpUrl(rawUrl) {
  try {
    const parsed = new URL(String(rawUrl || ''));
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function bindProfessorsGridDelegation(grid) {
  if (!grid || grid.dataset.profDelegationBound === '1') return;
  grid.dataset.profDelegationBound = '1';
  grid.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const btn = target.closest('button[data-prof-id]');
    if (!btn || !grid.contains(btn)) return;
    const profId = btn.dataset.profId;
    if (!profId) return;
    if (btn.classList.contains('btn-prof-draft')) {
      loadProfessorForDraft(profId);
    } else if (btn.classList.contains('btn-prof-intel')) {
      inspectLabTopics(profId);
    }
  });
}

function renderProfessors(list) {
  const grid = document.getElementById('professorsGrid');
  const countLabel = document.getElementById('facultyCountLabel');
  const uniCount = new Set(list.map(p => p.uniKey)).size;
  if (countLabel) {
    countLabel.textContent = `[ ${list.length} VERIFIED FACULTY · ${uniCount} TOP-30 UNIS ]`;
  }
  if (!grid) return;

  bindProfessorsGridDelegation(grid);
  grid.replaceChildren();

  if (list.length === 0) {
    const emptyEl = document.createElement('div');
    emptyEl.style.gridColumn = '1 / -1';
    emptyEl.style.textAlign = 'center';
    emptyEl.style.padding = '4rem 1rem';
    emptyEl.style.color = 'rgba(255,255,255,0.65)';
    emptyEl.style.fontFamily = 'var(--font-mono)';
    emptyEl.textContent = 'No verified faculty matched your current pillar / university / keyword combination. Try resetting a filter!';
    grid.appendChild(emptyEl);
    return;
  }

  const pillarIcons = { Sciences: '🔬', Commerce: '💼', Design: '🎨', Humanities: '📜' };
  const pillarClass = {
    Sciences: 'pillar-sciences',
    Commerce: 'pillar-commerce',
    Design: 'pillar-design',
    Humanities: 'pillar-humanities'
  };

  const frag = document.createDocumentFragment();
  list.forEach((p) => {
    const u = UNI_MAP[p.uniKey] || { fullName: '', shortName: '', qsRank: '', city: '' };
    const initials = getFacultyInitials(p.name);
    const focusLabel = p.pillar === 'Commerce'
      ? 'Verified Economic / Market Research'
      : p.pillar === 'Design'
        ? 'Verified Studio / Design Focus'
        : p.pillar === 'Humanities'
          ? 'Verified Scholarly / Archival Focus'
          : 'Verified Lab Research Focus';

    const card = document.createElement('div');
    card.className = 'prof-card-analog';

    const topBadgesRow = document.createElement('div');
    topBadgesRow.className = 'prof-top-badges-row';

    const qsBadge = document.createElement('span');
    qsBadge.className = 'qs-rank-badge';
    qsBadge.title = `${u.fullName} (${u.city})`;
    qsBadge.textContent = `🏛 QS #${u.qsRank} · ${u.shortName}`;

    const pillarBadge = document.createElement('span');
    pillarBadge.className = `pillar-badge ${pillarClass[p.pillar] || ''}`.trim();
    pillarBadge.textContent = `${pillarIcons[p.pillar] || ''} ${p.pillar}`.trim();

    topBadgesRow.append(qsBadge, pillarBadge);

    const cardHeader = document.createElement('div');
    cardHeader.className = 'prof-card-header';

    const avatar = document.createElement('div');
    avatar.className = 'prof-avatar-circle';
    avatar.textContent = initials;

    const metaWrap = document.createElement('div');
    metaWrap.className = 'prof-meta-wrap';

    const nameEl = document.createElement('h3');
    nameEl.className = 'prof-name';
    nameEl.textContent = p.name || '';

    const uniEl = document.createElement('div');
    uniEl.className = 'prof-uni';
    uniEl.appendChild(document.createTextNode(u.fullName || ''));
    if (p.highSchoolFriendly) {
      uniEl.appendChild(document.createTextNode(' '));
      const hsTag = document.createElement('span');
      hsTag.style.display = 'inline-block';
      hsTag.style.marginLeft = '0.4rem';
      hsTag.style.padding = '0.12rem 0.5rem';
      hsTag.style.background = 'rgba(56,189,248,0.15)';
      hsTag.style.border = '1px solid rgba(56,189,248,0.35)';
      hsTag.style.borderRadius = 'var(--radius-pill)';
      hsTag.style.fontSize = '0.62rem';
      hsTag.style.color = '#7dd3fc';
      hsTag.style.fontFamily = 'var(--font-mono)';
      hsTag.textContent = '🎓 Pre-College Fit';
      uniEl.appendChild(hsTag);
    }

    const labEl = document.createElement('div');
    labEl.className = 'prof-lab';
    labEl.textContent = `${p.lab || ''} · ${u.city || ''}`;

    metaWrap.append(nameEl, uniEl, labEl);
    cardHeader.append(avatar, metaWrap);

    const bioEl = document.createElement('p');
    bioEl.className = 'prof-bio-text';
    bioEl.textContent = p.summary || '';

    const citationBox = document.createElement('div');
    citationBox.className = 'prof-citation-box';

    const citationLbl = document.createElement('div');
    citationLbl.className = 'citation-label';
    const citationSpan = document.createElement('span');
    citationSpan.textContent = focusLabel;
    citationLbl.appendChild(citationSpan);

    const citationTitle = document.createElement('div');
    citationTitle.className = 'citation-title';
    citationTitle.title = p.focus || '';
    citationTitle.textContent = `✦ ${p.focus || ''}`;

    citationBox.append(citationLbl, citationTitle);

    const verifiedLink = document.createElement('a');
    verifiedLink.className = 'prof-verified-link';
    verifiedLink.href = isSafeHttpUrl(p.verifiedUrl) ? p.verifiedUrl : '#';
    verifiedLink.target = '_blank';
    verifiedLink.rel = 'noopener noreferrer';
    verifiedLink.textContent = '✓ Verified on Official University Site ↗';

    const actionsRow = document.createElement('div');
    actionsRow.className = 'prof-actions-row';

    const draftBtn = document.createElement('button');
    draftBtn.type = 'button';
    draftBtn.className = 'btn-prof-draft';
    draftBtn.dataset.profId = String(p.id || '');
    draftBtn.textContent = 'Draft Cold Email ➔';

    const infoBtn = document.createElement('button');
    infoBtn.type = 'button';
    infoBtn.className = 'btn-prof-intel';
    infoBtn.dataset.profId = String(p.id || '');
    infoBtn.textContent = 'Profile Info';

    actionsRow.append(draftBtn, infoBtn);
    card.append(topBadgesRow, cardHeader, bioEl, citationBox, verifiedLink, actionsRow);
    frag.appendChild(card);
  });

  grid.appendChild(frag);
}

function handleProfFilter() {
  const query = document.getElementById('profSearchInput').value.toLowerCase().trim();

  const filtered = PROFESSORS_LIST.filter(p => {
    const u = UNI_MAP[p.uniKey];
    if (currentPillar !== 'all' && p.pillar !== currentPillar) return false;
    if (currentUniversity !== 'all' && p.uniKey !== currentUniversity) return false;

    if (currentDiscipline === 'HighSchool') {
      if (!p.highSchoolFriendly) return false;
    } else if (currentDiscipline !== 'all' && p.discipline !== currentDiscipline) {
      return false;
    }

    if (query) {
      const hay = [
        p.name, u.shortName, u.fullName, u.city, `qs ${u.qsRank}`, `#${u.qsRank}`,
        p.lab, p.pillar, p.discipline, p.focus, p.summary
      ].join(' ').toLowerCase();
      return hay.includes(query);
    }
    return true;
  });

  renderProfessors(filtered);
}

function setPillar(pillar) {
  currentPillar = pillar;
  document.querySelectorAll('.pillar-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-pillar') === pillar);
  });
  handleProfFilter();
}

function setDiscipline(disc) {
  currentDiscipline = disc;
  document.querySelectorAll('.filter-chip-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-discipline') === disc);
  });
  handleProfFilter();
}

function setUniversityFilter(uniKey) {
  currentUniversity = uniKey || 'all';
  handleProfFilter();
}

renderProfessors(PROFESSORS_LIST);

let selectedColdMailProfId = 'mit_barzilay';
let isMailManuallyEdited = false;
let currentMailEditorMode = 'edit';
const DAILY_MAIL_LIMIT = 5;
const DAILY_QUOTA_STORAGE_KEY = 'seekresearch_daily_mail_v1';

function getTodayDateKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDailyMailCount() {
  try {
    const raw = localStorage.getItem(DAILY_QUOTA_STORAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.date === getTodayDateKey() && typeof parsed.count === 'number') {
      return Math.max(0, Math.min(DAILY_MAIL_LIMIT, parsed.count));
    }
  } catch (err) {
    // Ignore storage errors
  }
  return 0;
}

function saveDailyMailCount(count) {
  try {
    localStorage.setItem(DAILY_QUOTA_STORAGE_KEY, JSON.stringify({
      date: getTodayDateKey(),
      count
    }));
  } catch (err) {
    // Ignore storage errors
  }
}

function renderDailyMailQuota() {
  const count = getDailyMailCount();
  const remaining = Math.max(0, DAILY_MAIL_LIMIT - count);
  const badge = document.getElementById('dailyRateLimitBadge');
  const radar = document.getElementById('radarDailyCapMetric');
  if (badge) {
    if (remaining === 0) {
      badge.style.color = '#fca5a5';
      badge.textContent = `⚠ DAILY LIMIT REACHED: ${count} / ${DAILY_MAIL_LIMIT} OUTREACH EMAILS USED TODAY (0 LEFT)`;
    } else {
      badge.style.color = 'var(--cyan-bright)';
      badge.textContent = `✦ RATE LIMIT: ${count} / ${DAILY_MAIL_LIMIT} OUTREACH EMAILS USED TODAY (${remaining} LEFT)`;
    }
  }
  if (radar) {
    radar.textContent = `${remaining} / ${DAILY_MAIL_LIMIT} Left`;
    radar.style.color = remaining === 0 ? '#fca5a5' : 'var(--amber-warm)';
  }
}

function consumeDailyMailQuota() {
  const count = getDailyMailCount();
  if (count >= DAILY_MAIL_LIMIT) {
    showToast(`⚠ Daily limit reached (${DAILY_MAIL_LIMIT} / ${DAILY_MAIL_LIMIT} emails today). Click ↻ Reset to clear guest preview counter.`);
    return false;
  }
  saveDailyMailCount(count + 1);
  renderDailyMailQuota();
  return true;
}

function getSelectedColdMailProfId() {
  return selectedColdMailProfId;
}

function resetDailyMailQuota() {
  if (window.SeekFirebaseBridge?.isSignedIn?.()) {
    showToast('Daily 5/day allowance for signed-in accounts is protected in Cloud Firestore.');
    return;
  }
  saveDailyMailCount(0);
  renderDailyMailQuota();
  showToast(`↻ Guest daily preview counter reset to 0 / ${DAILY_MAIL_LIMIT} used today.`);
}

function createDomEl(tag, opts = {}, ...children) {
  const el = document.createElement(tag);
  if (opts.className) el.className = opts.className;
  if (opts.text !== undefined) el.textContent = String(opts.text);
  if (opts.type) el.type = opts.type;
  if (opts.href) el.href = opts.href;
  if (opts.target) el.target = opts.target;
  if (opts.rel) el.rel = opts.rel;
  if (opts.attrs) {
    Object.entries(opts.attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
  }
  children.forEach((child) => {
    if (child !== null && child !== undefined && child !== false) {
      el.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    }
  });
  return el;
}

function toSafeExternalUrl(url, fallback = 'https://scholar.google.com/') {
  try {
    const parsed = new URL(String(url || '').trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : fallback;
  } catch {
    return fallback;
  }
}

function populateColdMailProfSelect() {
  const sel = document.getElementById('profDirectorySelect');
  if (!sel) return;
  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = '— Pick any of 138 Verified Top-30 Professors —';
  sel.replaceChildren(defaultOpt);
  TOP_30_UNIVERSITIES.forEach(u => {
    const group = document.createElement('optgroup');
    group.label = `QS #${u.qsRank} · ${u.shortName} (${u.city})`;
    PROFESSORS_LIST.filter(p => p.uniKey === u.key).forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `${p.name} [${p.pillar}] — ${p.focus.slice(0, 48)}${p.focus.length > 48 ? '...' : ''}`;
      group.appendChild(opt);
    });
    sel.appendChild(group);
  });
  sel.value = selectedColdMailProfId;
}

function renderSelectedProfResearchCard(profId) {
  const box = document.getElementById('selectedProfResearchCard');
  if (!box) return;
  const p = PROFESSORS_LIST.find(x => x.id === profId) || PROFESSORS_LIST[0];
  if (!p) return;
  const u = UNI_MAP[p.uniKey];
  const scholarQuery = `${p.name.replace(/^Prof\.\s*/i, '')} ${u ? u.shortName : ''}`.trim();
  const scholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(scholarQuery)}`;
  const safeVerifiedUrl = toSafeExternalUrl(p.verifiedUrl, scholarUrl);

  box.replaceChildren(
    createDomEl(
      'div',
      { className: 'prof-card-head-row' },
      createDomEl('div', { className: 'prof-card-eyebrow', text: '📚 Verified Faculty Research & Works' }),
      createDomEl('span', { className: 'prof-card-qs-pill', text: `QS #${u ? u.qsRank : ''} · ${p.pillar}` })
    ),
    createDomEl(
      'div',
      { className: 'prof-card-title' },
      `${p.name} — `,
      createDomEl('span', { className: 'prof-card-lab', text: `${p.lab} (${u ? u.shortName : ''})` })
    ),
    createDomEl(
      'div',
      { className: 'prof-card-portfolio' },
      createDomEl('strong', { className: 'prof-card-portfolio-lead', text: 'Research Portfolio:' }),
      ` ${p.summary}`
    ),
    createDomEl('div', {
      className: 'prof-card-focus-line',
      text: `✦ Primary Paper / Research Focus: ${p.focus}`
    }),
    createDomEl(
      'div',
      { className: 'prof-research-links-row' },
      createDomEl('a', {
        className: 'prof-research-ext-link',
        href: safeVerifiedUrl,
        target: '_blank',
        rel: 'noopener noreferrer',
        text: '✓ Official Uni Profile & Papers ↗'
      }),
      createDomEl('a', {
        className: 'prof-research-ext-link',
        href: scholarUrl,
        target: '_blank',
        rel: 'noopener noreferrer',
        text: '🔎 Google Scholar Publications ↗'
      })
    )
  );
}

function loadProfessorForDraft(profId, stayInStudio = false) {
  const p = PROFESSORS_LIST.find(x => x.id === profId);
  if (!p) return;
  const u = UNI_MAP[p.uniKey];
  selectedColdMailProfId = p.id;
  isMailManuallyEdited = false;

  const dirSelect = document.getElementById('profDirectorySelect');
  if (dirSelect) dirSelect.value = p.id;

  document.getElementById('targetProfInput').value = p.name;
  document.getElementById('targetUniInput').value = `${u.shortName} (QS #${u.qsRank}) · ${p.lab}`;
  document.getElementById('targetPaperInput').value = p.focus;

  const workInput = document.getElementById('targetResearchWorkInput');
  if (workInput) {
    workInput.value = `${p.summary} Key papers and lab inquiries focus on ${p.focus}.`;
  }
  renderSelectedProfResearchCard(p.id);

  const currentChecked = document.querySelector('input[name="emailStrategy"]:checked')?.value;
  if (currentChecked !== 'highschool') {
    const mappedStrategy = p.pillar === 'Commerce'
      ? 'commerce'
      : p.pillar === 'Design'
        ? 'design'
        : p.pillar === 'Humanities'
          ? 'humanities'
          : 'undergrad';
    const radio = findInputByNameAndValue('emailStrategy', mappedStrategy);
    if (radio) radio.checked = true;
  }

  updateColdEmail();
  if (!stayInStudio) {
    scrollToSection('coldMailer');
  }
  showToast(`Loaded ${p.name}'s research & drafted email!`);
}

function inspectLabTopics(profId) {
  const p = PROFESSORS_LIST.find(x => x.id === profId);
  if (!p) return;
  const u = UNI_MAP[p.uniKey];
  alert(`[${p.name} // ${u.fullName} (QS #${u.qsRank})]\nPillar: ${p.pillar} · School/Lab: ${p.lab}\nLocation: ${u.city}\n\nVerified Research Focus:\n${p.summary}\n\nKey Topic:\n${p.focus}\n\nOfficial University Directory URL:\n${p.verifiedUrl}`);
}

/* ==========================================================================
   2. ACADEMIC COLD EMAIL GENERATOR, EDITABLE STUDIO & 5/DAY QUOTA
   ========================================================================== */
let lastGeneratedPlainText = "";
let lastGeneratedSubject = "";

function setMailEditorMode(mode) {
  currentMailEditorMode = mode === 'preview' ? 'preview' : 'edit';
  const editor = document.getElementById('emailBodyEditor');
  const previewBox = document.getElementById('emailBodyText');
  const btnEdit = document.getElementById('btnMailModeEdit');
  const btnPrev = document.getElementById('btnMailModePreview');

  if (btnEdit) btnEdit.classList.toggle('active', currentMailEditorMode === 'edit');
  if (btnPrev) btnPrev.classList.toggle('active', currentMailEditorMode === 'preview');
  if (editor) editor.style.display = currentMailEditorMode === 'edit' ? 'block' : 'none';
  if (previewBox) previewBox.style.display = currentMailEditorMode === 'preview' ? 'block' : 'none';
}

function syncWordCountFromText(text) {
  const trimmed = (text || '').trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const metric = document.getElementById('wordCountMetric');
  if (metric) metric.textContent = `${words} words`;
}

function onManualMailEdit() {
  isMailManuallyEdited = true;
  const subEl = document.getElementById('subjectEditorInput');
  const bodyEl = document.getElementById('emailBodyEditor');
  const stateBadge = document.getElementById('mailEditStateBadge');
  const previewBox = document.getElementById('emailBodyText');

  lastGeneratedSubject = subEl ? subEl.value : '';
  lastGeneratedPlainText = bodyEl ? bodyEl.value : '';
  syncWordCountFromText(lastGeneratedPlainText);
  if (previewBox) {
    previewBox.textContent = lastGeneratedPlainText;
  }
  if (stateBadge) {
    stateBadge.textContent = '✏ Custom Edited';
    stateBadge.style.color = 'var(--amber-warm)';
  }
}

function resetManualMailEdits() {
  isMailManuallyEdited = false;
  updateColdEmail();
  showToast('↻ Draft regenerated from professor research & student data.');
}

function resetManualAndGenerate() {
  isMailManuallyEdited = false;
  updateColdEmail();
}

function buildColdEmailParts(strategy, ctx) {
  const { profLastName, institution, paperTitle, researchWork, studentName, studentSchool, skills, project } = ctx;
  const t = (tag) => ({ tag });
  const templates = {
    highschool: {
      subject: `Pre-college research inquiry — ${studentName} (${studentSchool})`,
      parts: [
        `Dear Professor ${profLastName},\n\nI hope your semester is going well. My name is `, t(studentName), `, and I am a pre-college student (`, t(studentSchool), `).\n\n`,
        `I have been closely studying your group's research at `, t(institution), ` — notably `, t(researchWork), ` In particular, your work on `, t(paperTitle), ` stood out deeply to me.\n\n`,
        `Outside of my standard school coursework, I have been studying `, t(skills), `. Recently, I `, t(project), `.\n\n`,
        `I recognize how demanding faculty schedules are and expect zero funding. If your group has remote computational, archival, or data-curation tasks where a high school apprentice could assist your graduate researchers for 6–10 hours per week, I would be honored to help. Alternatively, I would deeply appreciate 1–2 foundational readings you recommend.\n\n`,
        `Thank you very much for your time. My resume and brief work summary are attached.\n\nSincerely,\n${studentName}\n${studentSchool}`
      ]
    },
    commerce: {
      subject: `Research Assistant Inquiry (${paperTitle.slice(0, 34)}...) — ${studentName}`,
      parts: [
        `Dear Professor ${profLastName},\n\nI hope you are having a productive term. My name is `, t(studentName), `, a `, t(studentSchool), `.\n\n`,
        `I have been following your scholarship at `, t(institution), `, spanning `, t(researchWork), ` Specifically, your empirical framework examining `, t(paperTitle), ` stood out strongly to me.\n\n`,
        `With training in `, t(skills), `, I recently `, t(project), `. I am eager to contribute to dataset preparation, econometric coding, or literature synthesis alongside your research team.\n\n`,
        `If you anticipate any part-time undergraduate/pre-doctoral RA needs this semester, might you have 10 minutes for a brief conversation? My CV and transcript are attached for your convenience.\n\n`,
        `Respectfully yours,\n${studentName}\n${studentSchool}`
      ]
    },
    design: {
      subject: `Studio & Design Research Inquiry — ${studentName} (${studentSchool})`,
      parts: [
        `Dear Professor ${profLastName},\n\nI hope your studio term is going well. My name is `, t(studentName), `, a `, t(studentSchool), `.\n\n`,
        `I have long admired your research & design practice at `, t(institution), `: `, t(researchWork), ` Your investigation of `, t(paperTitle), ` resonated deeply with my studio focus.\n\n`,
        `Drawing from my background in `, t(skills), `, I recently `, t(project), `. I would love to support ongoing studio prototypes, fabrication documentation, spatial analysis, or exhibition research.\n\n`,
        `If your lab has room for a dedicated student collaborator, I would welcome a brief 10-minute chat or feedback on my selected design portfolio (attached with my CV).\n\n`,
        `Warm regards,\n${studentName}\n${studentSchool}`
      ]
    },
    humanities: {
      subject: `Archival / Humanities Research Inquiry — ${studentName} (${studentSchool})`,
      parts: [
        `Dear Professor ${profLastName},\n\nI hope your semester is going well. My name is `, t(studentName), `, and I am a `, t(studentSchool), `.\n\n`,
        `I read with deep engagement your scholarship at `, t(institution), ` — including `, t(researchWork), ` Your insights on `, t(paperTitle), ` raised compelling questions for my own coursework.\n\n`,
        `Focusing on `, t(skills), `, I recently `, t(project), `. Should any of your current book projects or archival/digital humanities initiatives need assistance with primary-source indexing or bibliographic research, I would be delighted to help.\n\n`,
        `Thank you warmly for your time and scholarship; I have attached my CV and a short writing sample.\n\n`,
        `Sincerely,\n${studentName}\n${studentSchool}`
      ]
    },
    undergrad: {
      subject: `Prospective undergraduate research inquiry — ${studentName} (${studentSchool})`,
      parts: [
        `Dear Professor ${profLastName},\n\nI hope your semester is going well. My name is `, t(studentName), `, and I am a `, t(studentSchool), `.\n\n`,
        `I have been closely reading your lab’s body of research at `, t(institution), ` — specifically how `, t(researchWork), ` Your work on `, t(paperTitle), ` made me eager to learn more.\n\n`,
        `Over the past year, I have built foundations in `, t(skills), `. Recently, I `, t(project), `.\n\n`,
        `I would be grateful for the opportunity to assist with starter tasks, benchmark evaluation, or literature synthesis in your group. Would you or a postdoctoral researcher have 10 minutes for a brief conversation, or recommend a key paper I should read next?\n\n`,
        `Respectfully yours,\n${studentName}\n${studentSchool}`
      ]
    },
    summer: {
      subject: `Summer Research / REU Inquiry (${paperTitle.slice(0, 32)}...) — ${studentName}`,
      parts: [
        `Dear Professor ${profLastName},\n\nI am writing to inquire if your research group at `, t(institution), ` anticipates openings for summer researchers or visiting fellows.\n\n`,
        `I have followed your research trajectory closely: `, t(researchWork), ` In particular, `, t(paperTitle), ` aligns directly with my technical preparation in `, t(skills), `, where I recently `, t(project), `.\n\n`,
        `I am available full-time over the summer to assist with experiments, data pipelines, studio builds, or archival analysis. My CV is attached for reference.\n\n`,
        `Thank you for your time,\n${studentName}`
      ]
    },
    grad: {
      subject: `Prospective Graduate / PhD Inquiry — ${paperTitle.slice(0, 30)} — ${studentName}`,
      parts: [
        `Dear Professor ${profLastName},\n\nI am a prospective graduate applicant hoping to pursue research with your group at `, t(institution), `. Exploring your scholarly work (`, t(researchWork), `) — particularly `, t(paperTitle), ` — resonated deeply with my academic direction.\n\n`,
        `My background spans `, t(skills), `, and I recently `, t(project), `. Are you planning to recruit new Master's or doctoral students for the upcoming admissions cycle?\n\n`,
        `Thank you very much,\n${studentName}`
      ]
    },
    default: {
      subject: `Question regarding "${paperTitle.slice(0, 38)}" — ${studentName}`,
      parts: [
        `Dear Professor ${profLastName},\n\nI have been studying your broader research at `, t(institution), ` (`, t(researchWork), `), especially regarding `, t(paperTitle), `.\n\n`,
        `While working on `, t(project), ` using `, t(skills), `, a specific methodological question emerged about how your framework extends to adjacent settings. Should you have a brief moment, I would deeply appreciate any follow-up paper you recommend.\n\n`,
        `Best regards,\n${studentName}`
      ]
    }
  };
  return templates[strategy] || templates.default;
}

function updateColdEmail() {
  const profName = document.getElementById('targetProfInput').value.trim() || 'Professor';
  const institution = document.getElementById('targetUniInput').value.trim() || 'your department';
  const paperTitle = document.getElementById('targetPaperInput').value.trim() || 'your recent faculty research';
  const researchWork = (document.getElementById('targetResearchWorkInput')?.value || '').trim()
    || `advancing research across ${paperTitle}`;
  const studentName = document.getElementById('studentNameInput').value.trim() || 'Maya Chen';
  const studentSchool = document.getElementById('studentSchoolInput').value.trim() || 'undergraduate student';
  const skills = document.getElementById('studentSkillsInput').value.trim() || 'analytical research methods';
  const project = document.getElementById('studentProjectInput').value.trim() || 'completed an independent study project in this domain';

  const strategy = document.querySelector('input[name="emailStrategy"]:checked')?.value || 'undergrad';
  const cleanedName = profName.replace(/,\s*FRS$/i, '').trim();
  const profLastName = cleanedName.split(' ').pop();

  const { subject, parts } = buildColdEmailParts(strategy, {
    profLastName,
    institution,
    paperTitle,
    researchWork,
    studentName,
    studentSchool,
    skills,
    project
  });
  const plainBody = parts.map((part) => (typeof part === 'string' ? part : part.tag)).join('');

  const radarWorkEl = document.getElementById('radarProfWorkStatus');
  if (radarWorkEl) {
    radarWorkEl.textContent = researchWork.length > 24 ? 'Included ✓' : 'Topic Only';
  }

  if (!isMailManuallyEdited) {
    const subInput = document.getElementById('subjectEditorInput');
    const bodyEditor = document.getElementById('emailBodyEditor');
    const previewBox = document.getElementById('emailBodyText');
    const stateBadge = document.getElementById('mailEditStateBadge');

    if (subInput) subInput.value = subject;
    if (bodyEditor) bodyEditor.value = plainBody;
    if (previewBox) {
      const nodes = parts.map((part) =>
        typeof part === 'string'
          ? document.createTextNode(part)
          : createDomEl('span', { className: 'email-var-tag', text: part.tag })
      );
      previewBox.replaceChildren(...nodes);
    }
    if (stateBadge) {
      stateBadge.textContent = '✦ Auto-Synced to Inputs';
      stateBadge.style.color = 'var(--cyan-bright)';
    }

    lastGeneratedPlainText = plainBody;
    lastGeneratedSubject = subject;
    syncWordCountFromText(plainBody);
  } else {
    const subInput = document.getElementById('subjectEditorInput');
    const bodyEditor = document.getElementById('emailBodyEditor');
    lastGeneratedSubject = subInput ? subInput.value : subject;
    lastGeneratedPlainText = bodyEditor ? bodyEditor.value : plainBody;
    syncWordCountFromText(lastGeneratedPlainText);
  }
}

populateColdMailProfSelect();
renderSelectedProfResearchCard(selectedColdMailProfId);
renderDailyMailQuota();
updateColdEmail();

function copyColdEmail() {
  const sub = document.getElementById('subjectEditorInput')?.value || lastGeneratedSubject;
  const body = document.getElementById('emailBodyEditor')?.value || lastGeneratedPlainText;
  if (body) {
    navigator.clipboard.writeText(`Subject: ${sub}\n\n${body}`).then(() => {
      showToast("📋 Cold email copied! Ready to paste into Gmail / Outlook.");
    }).catch(() => {
      showToast("Copied to clipboard!");
    });
  }
}

function openGmailComposeTab(gmailComposeUrl, successMessage) {
  const win = window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');
  if (!win) {
    showToast('Popup blocked by browser — SeekResearch stayed open. Click "📋 Copy Cold Email" to paste it manually.');
    return false;
  }
  showToast(successMessage);
  return true;
}

async function openMailClient() {
  const sub = (document.getElementById('subjectEditorInput')?.value || lastGeneratedSubject || '').trim();
  const body = (document.getElementById('emailBodyEditor')?.value || lastGeneratedPlainText || '').trim();
  if (!body || !sub) {
    updateColdEmail();
  }

  const finalSub = document.getElementById('subjectEditorInput')?.value || lastGeneratedSubject;
  const finalBody = document.getElementById('emailBodyEditor')?.value || lastGeneratedPlainText;
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(finalSub)}&body=${encodeURIComponent(finalBody)}`;

  if (window.SeekFirebaseBridge?.isSignedIn?.()) {
    try {
      const res = await window.SeekFirebaseBridge.recordOutreachQuotaAndSubmission('gmail_compose');
      if (!res?.ok) {
        return;
      }
      openGmailComposeTab(
        gmailComposeUrl,
        `✉️ Opened Gmail & saved submission to Firestore (${res.count} / ${DAILY_MAIL_LIMIT} UTC today)!`
      );
    } catch (err) {
      showToast(err?.message || 'Submission blocked by daily quota rules.');
    }
    return;
  }

  if (!consumeDailyMailQuota()) return;
  openGmailComposeTab(
    gmailComposeUrl,
    `✉️ Opened Gmail compose (${getDailyMailCount()} / ${DAILY_MAIL_LIMIT} guest preview today)!`
  );
}

async function saveDraftOnly() {
  const profName = document.getElementById('targetProfInput').value || 'Professor';
  if (window.SeekFirebaseBridge?.isSignedIn?.()) {
    try {
      const res = await window.SeekFirebaseBridge.recordOutreachQuotaAndSubmission('draft_saved');
      if (res?.ok) {
        showToast(`📝 Draft saved to Firestore for ${profName} (${res.count} / ${DAILY_MAIL_LIMIT} today). Drafts are not scheduled or sent.`);
      }
    } catch (err) {
      showToast(err?.message || 'Could not save draft in Firestore.');
    }
    return;
  }
  if (!consumeDailyMailQuota()) return;
  showToast(`📝 Draft saved in Guest Preview for ${profName} (${getDailyMailCount()} / ${DAILY_MAIL_LIMIT} today). Not scheduled or sent.`);
}

function queueTuesdayCadence() {
  return saveDraftOnly();
}

function loadHighSchoolPreset() {
  isMailManuallyEdited = false;
  const hsRadio = document.querySelector('input[name="emailStrategy"][value="highschool"]');
  if (hsRadio) hsRadio.checked = true;
  document.getElementById('studentNameInput').value = 'Alex Zhao';
  document.getElementById('studentSchoolInput').value = '11th Grade · Lexington High School';
  document.getElementById('studentSkillsInput').value = 'Python, PyTorch, AP Calculus BC, AP Biology, Data Structures';
  document.getElementById('studentProjectInput').value = 'trained an image segmentation model on cell microscopy images for the regional science fair';
  updateColdEmail();
  scrollToSection('coldMailer');
  showToast('Loaded High School Pre-College Strategy into Studio!');
}

/* Toast Notification */
let toastTimeout = null;
function showToast(msg) {
  const toast = document.getElementById('toastPill');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ==========================================================================
   3. LIVE CAMPUS TIME CLOCK & TIMEZONE SWITCHER
   ========================================================================== */
const campusTimezones = [
  { name: 'Cambridge', tz: 'America/New_York', label: 'Currently in Cambridge (MIT/Harvard)', code: 'EST' },
  { name: 'Stanford', tz: 'America/Los_Angeles', label: 'Currently at Stanford (PST)', code: 'PST' },
  { name: 'Berkeley', tz: 'America/Los_Angeles', label: 'Currently in Berkeley (BAIR)', code: 'PST' },
  { name: 'Oxford', tz: 'Europe/London', label: 'Currently at Oxford University', code: 'GMT' },
  { name: 'Tokyo', tz: 'Asia/Tokyo', label: 'Currently at Univ. of Tokyo', code: 'JST' }
];
let currentCampusIdx = 0;

function updateCampusTime() {
  const active = campusTimezones[currentCampusIdx];
  const now = new Date();
  const options = {
    timeZone: active.tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  const str = new Intl.DateTimeFormat('en-US', options).format(now);
  document.getElementById('liveTimeTicker').textContent = str;
  document.getElementById('locationCityLabel').textContent = active.label;
}
setInterval(updateCampusTime, 1000);
updateCampusTime();

function cycleCampusTimezone() {
  currentCampusIdx = (currentCampusIdx + 1) % campusTimezones.length;
  updateCampusTime();
  document.getElementById('dockTimezoneBtn').textContent = `⏱ ${campusTimezones[currentCampusIdx].name} (${campusTimezones[currentCampusIdx].code})`;
}

/* ==========================================================================
   4. PROCEDURAL 35MM FILM GRAIN CANVAS
   ========================================================================== */
const grainCanvas = document.getElementById('filmGrainCanvas');
const grainCtx = grainCanvas.getContext('2d');
let grainEnabled = true;

function resizeGrain() {
  grainCanvas.width = window.innerWidth;
  grainCanvas.height = window.innerHeight;
}
resizeGrain();
window.addEventListener('resize', resizeGrain);

function renderGrainNoise() {
  if (!grainEnabled) {
    grainCtx.clearRect(0, 0, grainCanvas.width, grainCanvas.height);
    return;
  }

  const w = grainCanvas.width;
  const h = grainCanvas.height;
  const imgData = grainCtx.createImageData(w, h);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const val = Math.random() * 255;
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
    data[i + 3] = Math.random() * 32 + 10;
  }
  grainCtx.putImageData(imgData, 0, 0);
  requestAnimationFrame(renderGrainNoise);
}
renderGrainNoise();

function toggleFilmGrain() {
  grainEnabled = !grainEnabled;
  document.getElementById('dockGrainBtn').classList.toggle('active', grainEnabled);
  if (grainEnabled) renderGrainNoise();
  else grainCtx.clearRect(0, 0, grainCanvas.width, grainCanvas.height);
}

/* ==========================================================================
   5. INTERACTIVE LIGHT LEAK, TYPOGRAPHY & SILHOUETTE PARALLAX
   ========================================================================== */
const heroStageEl = document.getElementById('heroStage');
const silhouetteStage = document.getElementById('silhouetteStage');
const lightLeak = document.getElementById('anamorphicLightLeak');
const typoFaceTop = document.getElementById('typoFaceTop');
const typoToTop = document.getElementById('typoToTop');
const typoRowTop = document.querySelector('.typo-row-top');
const typoRowBottom = document.querySelector('.typo-row-bottom');

let parallaxMouseX = 0;
let parallaxMouseY = 0;
let parallaxRafPending = false;

function applyHeroParallax() {
  parallaxRafPending = false;
  const x = parallaxMouseX;
  const y = parallaxMouseY;

  const stageHeight = heroStageEl ? Math.max(heroStageEl.offsetHeight, 1) : Math.max(window.innerHeight, 1);
  const clampedScrollY = Math.min(Math.max(window.scrollY || window.pageYOffset || 0, 0), stageHeight);
  const topScrollY = Math.round(clampedScrollY * 0.12 * 10) / 10;
  const bottomScrollY = Math.round(clampedScrollY * 0.18 * 10) / 10;
  const silhouetteScrollY = Math.round(clampedScrollY * 0.08 * 10) / 10;

  if (silhouetteStage) {
    silhouetteStage.style.transform = `translateX(-50%) translate3d(${x * 22}px, ${y * 14 + silhouetteScrollY}px, 0)`;
  }
  if (lightLeak) {
    lightLeak.style.transform = `translate3d(${x * -40}px, ${y * -25 + topScrollY * 0.5}px, 0)`;
  }
  if (typoFaceTop) {
    typoFaceTop.style.transform = `translate3d(${x * -10}px, ${y * -6}px, 0)`;
  }
  if (typoToTop) {
    typoToTop.style.transform = `translate3d(${x * 12}px, ${y * 8}px, 0)`;
  }
  if (typoRowTop) {
    typoRowTop.style.transform = `translate3d(0, ${topScrollY}px, 0)`;
  }
  if (typoRowBottom) {
    // Keep #typoFBottom ("RE") and #typoCeBottom ("SEARCH") moving in lockstep as one word
    typoRowBottom.style.transform = `translate3d(${x * 8}px, ${y * 6 + bottomScrollY}px, 0)`;
  }
}

function scheduleHeroParallax() {
  if (parallaxRafPending) return;
  parallaxRafPending = true;
  window.requestAnimationFrame(applyHeroParallax);
}

window.addEventListener('mousemove', (e) => {
  parallaxMouseX = (e.clientX / window.innerWidth) - 0.5;
  parallaxMouseY = (e.clientY / window.innerHeight) - 0.5;
  scheduleHeroParallax();
}, { passive: true });

window.addEventListener('scroll', scheduleHeroParallax, { passive: true });
applyHeroParallax();

/* ==========================================================================
   6. PROCEDURAL ANALOG TAPE HISS
   ========================================================================== */
class AnalogTapeSound {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.noiseNode = null;
    this.gainNode = null;
  }

  init() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.05;
      b1 = 0.985 * b1 + white * 0.12;
      b2 = 0.950 * b2 + white * 0.25;
      output[i] = (b0 + b1 + b2) * 0.02;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, this.ctx.currentTime);

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.0001, this.ctx.currentTime);

    this.noiseNode.connect(filter);
    filter.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    this.noiseNode.start();
  }

  toggle() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    this.isPlaying = !this.isPlaying;
    const btn = document.getElementById('dockAudioBtn');

    if (this.isPlaying) {
      this.gainNode.gain.setTargetAtTime(0.12, this.ctx.currentTime, 0.4);
      btn.textContent = '♫ Tape Hiss: Active';
      btn.classList.add('active');
    } else {
      this.gainNode.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.3);
      btn.textContent = '♫ Tape Hiss: Off';
      btn.classList.remove('active');
    }
  }
}

const tapeSound = new AnalogTapeSound();
function toggleAnalogTapeSound() {
  tapeSound.toggle();
}

function scrollToSection(id) {
  syncHeaderClearance();
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function syncHeaderClearance() {
  const header = document.querySelector('.editorial-header');
  if (!header) return;
  const h = Math.ceil(header.getBoundingClientRect().height);
  if (h > 0) {
    document.documentElement.style.setProperty('--editorial-header-h', `${h}px`);
  }
}

/* ==========================================================================
   7. 21ST.DEV LAUNCH INTRO CONTROLLER (RED UPWARD OPENING SEQUENCE)
   ========================================================================== */
let launchIntroAnimId = null;
let launchIntroDismissTimeout = null;

function runLaunchIntro(duration = 3200) {
  const overlay = document.getElementById('launchIntroOverlay');
  const kicker = document.getElementById('launchKickerText');
  const title = document.getElementById('launchMainTitle');
  const tagline = document.getElementById('launchTaglineText');
  const badges = document.getElementById('launchBadgesCluster');
  const progressStage = document.getElementById('launchProgressStage');
  const progressFill = document.getElementById('launchProgressFill');
  const progressPercent = document.getElementById('launchProgressPercent');
  const directActions = document.getElementById('launchDirectActions');

  if (!overlay) return;

  if (launchIntroAnimId) cancelAnimationFrame(launchIntroAnimId);
  if (launchIntroDismissTimeout) clearTimeout(launchIntroDismissTimeout);

  overlay.style.display = 'flex';
  overlay.classList.remove('stage-exit');
  if (kicker) kicker.classList.add('revealed');
  if (title) title.classList.remove('revealed');
  if (tagline) tagline.classList.remove('revealed');
  if (badges) badges.classList.remove('revealed');
  if (progressStage) progressStage.classList.remove('revealed');
  if (directActions) directActions.classList.remove('revealed');
  if (progressFill) progressFill.style.width = '0%';
  if (progressPercent) progressPercent.textContent = '000%';

  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const p = Math.min(100, Math.round((elapsed / duration) * 100));

    if (progressFill) progressFill.style.width = p + '%';
    if (progressPercent) progressPercent.textContent = String(p).padStart(3, '0') + '%';

    if (p > 15 && title) {
      title.classList.add('revealed');
    }
    if (p > 45) {
      if (tagline) tagline.classList.add('revealed');
      if (badges) badges.classList.add('revealed');
      if (progressStage) progressStage.classList.add('revealed');
      if (directActions) directActions.classList.add('revealed');
    }

    if (p < 100) {
      launchIntroAnimId = requestAnimationFrame(step);
    } else {
      launchIntroDismissTimeout = setTimeout(() => {
        dismissLaunchIntro();
      }, 800);
    }
  }

  launchIntroAnimId = requestAnimationFrame(step);
}

function dismissLaunchIntro() {
  const overlay = document.getElementById('launchIntroOverlay');
  if (!overlay) return;
  if (launchIntroAnimId) cancelAnimationFrame(launchIntroAnimId);
  if (launchIntroDismissTimeout) clearTimeout(launchIntroDismissTimeout);

  // Slide upward
  overlay.classList.add('stage-exit');
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 950);
}

function dismissAndGoTo(sectionId) {
  dismissLaunchIntro();
  if (document.body.classList.contains('auth-gate-active')) {
    enterMainApp(sectionId);
    return;
  }
  setTimeout(() => {
    scrollToSection(sectionId);
  }, 450);
}

function replayLaunchIntro() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  runLaunchIntro(3200);
}

/* ==========================================================================
   8. STUDENT PORTAL UI CONTROLLER + FIREBASE AUTH & FIRESTORE BRIDGE
   ========================================================================== */
const LEVEL_META = {
  highschool: {
    label: 'High School',
    short: 'HS',
    badgeClass: 'lvl-highschool',
    hint: 'e.g. Grade 9, Grade 10, Grade 11, Grade 12, IB',
    grades: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'IB / A-Level'],
    defaultStrategy: 'highschool',
    strategyName: 'High School Strategy'
  },
  ug: {
    label: 'Undergraduate (UG)',
    short: 'UG',
    badgeClass: 'lvl-ug',
    hint: 'e.g. Freshman, Sophomore, Junior, Senior',
    grades: ['Year 1 (Freshman)', 'Year 2 (Sophomore)', 'Year 3 (Junior)', 'Year 4 (Senior)'],
    defaultStrategy: 'undergrad',
    strategyName: 'Undergrad RA Strategy'
  },
  uni: {
    label: 'University (Uni)',
    short: 'Uni',
    badgeClass: 'lvl-uni',
    hint: 'e.g. Year 1 Uni, Year 2 Uni, Honours Year',
    grades: ['Year 1 Uni', 'Year 2 Uni', 'Year 3 Honours', 'Year 4 Final'],
    defaultStrategy: 'undergrad',
    strategyName: 'University Research Inquiry'
  },
  ms: {
    label: "Master's (MS)",
    short: 'MS',
    badgeClass: 'lvl-ms',
    hint: 'e.g. MS Year 1, MS Year 2 (Thesis), MSc',
    grades: ['MS Year 1', 'MS Year 2 (Thesis)', 'MSc Taught', 'MPhil Track'],
    defaultStrategy: 'grad',
    strategyName: "Master's / Grad Inquiry"
  },
  pg: {
    label: 'Postgraduate (PG / PhD)',
    short: 'PG',
    badgeClass: 'lvl-pg',
    hint: 'e.g. PG Year 1, PhD Year 2, PhD Candidate',
    grades: ['PG Year 1', 'PG Diploma', 'PhD Year 2', 'PhD Candidate'],
    defaultStrategy: 'grad',
    strategyName: 'Postgrad / Doctoral Inquiry'
  }
};

let currentAuthTab = 'login';

function getActiveStudent() {
  return window.SeekFirebaseBridge?.getActiveProfile?.() || null;
}

function setAuthFeedback(boxId, message, type) {
  const box = document.getElementById(boxId);
  if (!box) return;
  if (!message) {
    box.className = 'auth-feedback-box';
    box.textContent = '';
    return;
  }
  box.className = `auth-feedback-box visible ${type || 'success'}`;
  box.textContent = message;
}

function enterMainApp(targetSectionId = 'heroStage') {
  document.body.classList.remove('auth-gate-active');
  document.body.classList.remove('account-modal-open');
  syncHeaderClearance();
  if (!targetSectionId || targetSectionId === 'heroStage') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    setTimeout(() => {
      scrollToSection(targetSectionId);
    }, 60);
  }
}

function closeStudentPortalModal() {
  document.body.classList.remove('account-modal-open');
  syncHeaderClearance();
}

function enterAsGuestAndGo(targetSectionId = 'heroStage') {
  dismissLaunchIntro();
  enterMainApp(targetSectionId);
  showToast('Viewing as Guest — sign in via top-right to store profiles & submissions in Firestore.');
}

function openStudentPortal(tab = 'login') {
  syncHeaderClearance();
  if (!getActiveStudent()) {
    switchAuthTab(tab);
  }
  if (document.body.classList.contains('auth-gate-active')) {
    window.scrollTo({ top: 0, behavior: 'auto' });
  } else {
    renderActiveAuthWorkspace();
    document.body.classList.add('account-modal-open');
    const portalEl = document.getElementById('studentPortalSection');
    if (portalEl) {
      portalEl.scrollTop = 0;
      requestAnimationFrame(() => { portalEl.scrollTop = 0; });
    }
  }
}

function switchAuthTab(tab) {
  currentAuthTab = tab === 'register' ? 'register' : 'login';
  const loginTab = document.getElementById('tabBtnLogin');
  const regTab = document.getElementById('tabBtnRegister');
  const loginForm = document.getElementById('loginFormPanel');
  const regForm = document.getElementById('registerFormPanel');

  if (loginTab) {
    loginTab.classList.toggle('active', currentAuthTab === 'login');
    loginTab.setAttribute('aria-selected', String(currentAuthTab === 'login'));
  }
  if (regTab) {
    regTab.classList.toggle('active', currentAuthTab === 'register');
    regTab.setAttribute('aria-selected', String(currentAuthTab === 'register'));
  }
  if (loginForm) loginForm.style.display = currentAuthTab === 'login' ? 'flex' : 'none';
  if (regForm) regForm.style.display = currentAuthTab === 'register' ? 'flex' : 'none';

  if (currentAuthTab === 'register') {
    const regGrade = document.getElementById('regGradeInput');
    if (regGrade && !regGrade.value.trim()) {
      const checkedLvl = document.querySelector('input[name="regAcademicLevel"]:checked')?.value || 'highschool';
      onRegisterLevelChange(checkedLvl);
    }
  }

  setAuthFeedback('authFeedbackBox', '', '');
  renderLiveStudentPreview();
}

function togglePasswordField(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  const isHidden = inp.type === 'password';
  inp.type = isHidden ? 'text' : 'password';
  if (btn) btn.textContent = isHidden ? 'Hide' : 'Show';
}

function populateGradeChips(containerId, inputId, level) {
  const container = document.getElementById(containerId);
  const input = document.getElementById(inputId);
  const meta = LEVEL_META[level] || LEVEL_META.highschool;
  if (!container) return;

  container.replaceChildren();
  const frag = document.createDocumentFragment();
  meta.grades.forEach((g) => {
    const isMatch = input && input.value.trim().toLowerCase() === g.toLowerCase();
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = isMatch ? 'grade-chip-btn active' : 'grade-chip-btn';
    btn.textContent = g;
    btn.addEventListener('click', () => selectGradeChip(inputId, containerId, g));
    frag.appendChild(btn);
  });
  container.appendChild(frag);
}

function selectGradeChip(inputId, containerId, gradeVal) {
  const input = document.getElementById(inputId);
  if (input) input.value = gradeVal;
  const container = document.getElementById(containerId);
  if (container) {
    container.querySelectorAll('.grade-chip-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent === gradeVal);
    });
  }
  renderLiveStudentPreview();
}

function onRegisterLevelChange(level) {
  const meta = LEVEL_META[level] || LEVEL_META.highschool;
  const hintEl = document.getElementById('regGradeHintLabel');
  const gradeInput = document.getElementById('regGradeInput');
  if (hintEl) hintEl.textContent = meta.hint;

  if (gradeInput) {
    const currentVal = gradeInput.value.trim();
    const allPresets = Object.values(LEVEL_META).flatMap(m => m.grades);
    if (!currentVal || allPresets.includes(currentVal)) {
      gradeInput.value = meta.grades[0];
    }
  }
  populateGradeChips('regGradeQuickChips', 'regGradeInput', level);
  renderLiveStudentPreview();
}

function getDraftRegistrationStudent() {
  const level = document.querySelector('input[name="regAcademicLevel"]:checked')?.value || 'highschool';
  const meta = LEVEL_META[level] || LEVEL_META.highschool;
  return {
    name: document.getElementById('regNameInput')?.value.trim() || 'Student Academic Pass',
    email: document.getElementById('regEmailInput')?.value.trim() || 'student@institution.edu',
    level,
    grade: document.getElementById('regGradeInput')?.value.trim() || meta.grades[0],
    school: document.getElementById('regSchoolInput')?.value.trim() || 'School / University',
    major: document.getElementById('regMajorInput')?.value.trim() || 'Interdisciplinary Research',
    pillar: document.getElementById('regPillarSelect')?.value || 'Sciences',
    skills: document.getElementById('regSkillsInput')?.value.trim() || 'Research Methods, Data Literacy',
    project: document.getElementById('regProjectInput')?.value.trim() || 'Independent inquiry project in progress',
    isDraftPreview: true
  };
}

function renderLiveStudentPreview(profileOverride) {
  const card = document.getElementById('studentCredentialCard');
  if (!card) return;

  const active = profileOverride !== undefined ? profileOverride : getActiveStudent();
  const neutralSignedOutPass = {
    name: 'No Active Student',
    email: 'Sign in or create an account',
    level: 'highschool',
    grade: '—',
    school: '—',
    major: '—',
    pillar: '—',
    skills: '—',
    project: '',
    isDraftPreview: true
  };
  const preview = active || (currentAuthTab === 'register' ? getDraftRegistrationStudent() : neutralSignedOutPass);
  const meta = LEVEL_META[preview.level] || LEVEL_META.highschool;
  const initials = active ? getFacultyInitials(preview.name || 'ST') : (currentAuthTab === 'register' ? getFacultyInitials(preview.name || 'ST') : '—');
  const statusEl = active
    ? createDomEl('span', { className: 'pass-status-active', text: '● FIREBASE PROFILE ACTIVE' })
    : currentAuthTab === 'register'
      ? createDomEl('span', { className: 'pass-status-draft', text: '✦ LIVE SIGN-UP PREVIEW' })
      : createDomEl('span', { className: 'pass-status-guest', text: 'SIGN IN FOR YOUR PASS' });

  const showIdentityBadge = Boolean(active || currentAuthTab === 'register');
  const passCells = [
    { label: 'Academic Level', value: showIdentityBadge ? meta.label : '—' },
    { label: 'Grade / Year', value: preview.grade },
    { label: 'School / University', value: preview.school || '—' },
    { label: 'Major · Research Pillar', value: showIdentityBadge ? `${preview.major || 'General'} · ${preview.pillar}` : '—' }
  ].map((cell) =>
    createDomEl(
      'div',
      { className: 'credential-cell' },
      createDomEl('span', { className: 'credential-cell-lbl', text: cell.label }),
      createDomEl('span', { className: 'credential-cell-val', text: cell.value })
    )
  );

  card.replaceChildren(
    createDomEl(
      'div',
      { className: 'credential-top-strip' },
      createDomEl('span', { text: 'SEEKRESEARCH // STUDENT DATA PASS' }),
      statusEl
    ),
    createDomEl(
      'div',
      { className: 'credential-identity-row' },
      createDomEl('div', { className: 'credential-avatar', text: initials }),
      createDomEl(
        'div',
        { className: 'pass-identity-info' },
        createDomEl(
          'div',
          { className: 'pass-identity-head' },
          createDomEl('h4', { className: 'pass-identity-name', text: preview.name }),
          showIdentityBadge
            ? createDomEl('span', { className: `credential-level-badge ${meta.badgeClass}`, text: meta.label })
            : null
        ),
        createDomEl('div', { className: 'pass-identity-email', text: preview.email })
      )
    ),
    createDomEl('div', { className: 'credential-meta-grid' }, ...passCells),
    createDomEl(
      'div',
      { className: 'pass-skills-box' },
      createDomEl(
        'div',
        { className: 'pass-skills-head' },
        createDomEl('span', { className: 'credential-cell-lbl pass-skills-lbl', text: 'Skills & Cold Mail Fit' }),
        createDomEl('span', {
          className: 'pass-skills-match',
          text: showIdentityBadge ? `Auto-Matches: ${meta.strategyName}` : 'No Profile Loaded'
        })
      ),
      createDomEl('div', { className: 'pass-skills-body', text: preview.skills || '—' })
    )
  );
}

function updateHeaderAndBannerUI(profileOverride) {
  const active = profileOverride !== undefined ? profileOverride : getActiveStudent();
  const headerBtn = document.getElementById('headerAuthBtn');
  const headerLbl = document.getElementById('headerAuthLabel');
  const dockBtn = document.getElementById('dockStudentBtn');
  const strip = document.getElementById('coldMailerProfileStrip');

  if (active) {
    const meta = LEVEL_META[active.level] || LEVEL_META.highschool;
    const firstName = (active.name || 'Student').split(' ')[0];
    if (headerBtn) headerBtn.classList.add('logged-in');
    if (headerLbl) headerLbl.textContent = `${firstName} · ${meta.short} (${active.grade})`;
    if (dockBtn) dockBtn.replaceChildren(createDomEl('span', { text: `● ${firstName} · ${meta.short}` }));
    if (strip) {
      const resyncBtn = createDomEl('button', {
        type: 'button',
        className: 'preset-prof-pill preset-pill-emerald',
        text: '↻ Re-Sync Data'
      });
      resyncBtn.addEventListener('click', () => syncActiveStudentToColdMailer(false));

      const editBtn = createDomEl('button', {
        type: 'button',
        className: 'preset-prof-pill',
        text: 'Edit Profile ↑'
      });
      editBtn.addEventListener('click', () => openStudentPortal('login'));

      strip.replaceChildren(
        createDomEl(
          'div',
          { className: 'strip-status-active' },
          '🪪 Logged In: ',
          createDomEl('strong', { text: active.name }),
          ` · ${meta.label} · ${active.grade} (${active.school || 'Student'})`
        ),
        createDomEl('div', { className: 'strip-actions-row' }, resyncBtn, editBtn)
      );
    }
  } else {
    if (headerBtn) headerBtn.classList.remove('logged-in');
    if (headerLbl) headerLbl.textContent = 'Login / Create Acc';
    if (dockBtn) dockBtn.replaceChildren(createDomEl('span', { text: '🪪 Student Account' }));
    if (strip) {
      const loginBtn = createDomEl('button', {
        type: 'button',
        className: 'preset-prof-pill preset-pill-cyan',
        text: 'Login / Create Acc ↑'
      });
      loginBtn.addEventListener('click', () => openStudentPortal('login'));

      strip.replaceChildren(
        createDomEl('div', {
          className: 'strip-status-guest',
          text: '🪪 Sign in with Firebase Auth (High School / UG / Uni / MS / PG) to save drafts & auto-fill mail'
        }),
        loginBtn
      );
    }
  }
}

function renderActiveAuthWorkspace(profileOverride) {
  const active = profileOverride !== undefined ? profileOverride : getActiveStudent();
  const outView = document.getElementById('authLoggedOutView');
  const inView = document.getElementById('authLoggedInView');

  if (active) {
    if (outView) outView.style.display = 'none';
    if (inView) inView.style.display = 'block';

    const meta = LEVEL_META[active.level] || LEVEL_META.highschool;
    const headEl = document.getElementById('activeProfileHeading');
    const subEl = document.getElementById('activeProfileEmailSub');
    const gridEl = document.getElementById('activeProfileSummaryGrid');
    const skillsEl = document.getElementById('activeProfileSkillsHighlight');

    if (headEl) headEl.textContent = active.name;
    if (subEl) subEl.textContent = `${active.email} · ${meta.label} (${active.grade})`;
    if (gridEl) {
      const summaryCells = [
        { label: 'Student Name', value: active.name },
        { label: 'Academic Level', badgeLabel: meta.label, badgeClass: meta.badgeClass },
        { label: 'Grade / Year', value: active.grade },
        { label: 'School / University', value: active.school || '—' },
        { label: 'Major / Track', value: active.major || '—' },
        { label: 'Preferred Pillar', value: active.pillar || 'Sciences' }
      ].map((item) =>
        createDomEl(
          'div',
          { className: 'credential-cell' },
          createDomEl('span', { className: 'credential-cell-lbl', text: item.label }),
          item.badgeLabel
            ? createDomEl(
                'span',
                { className: 'credential-cell-val' },
                createDomEl('span', { className: `credential-level-badge ${item.badgeClass}`, text: item.badgeLabel })
              )
            : createDomEl('span', { className: 'credential-cell-val', text: item.value })
        )
      );
      gridEl.replaceChildren(...summaryCells);
    }
    if (skillsEl) {
      skillsEl.replaceChildren(
        createDomEl('div', {}, createDomEl('strong', { text: 'Skills:' }), ` ${active.skills || 'Not set'}`),
        createDomEl('div', { className: 'profile-project-line' }, createDomEl('strong', { text: 'Project:' }), ` ${active.project || 'Not set'}`)
      );
    }
    toggleEditProfilePanel(false);
  } else {
    if (outView) outView.style.display = 'block';
    if (inView) inView.style.display = 'none';
  }

  renderLiveStudentPreview(active);
  updateHeaderAndBannerUI(active);
  syncHeaderClearance();
}

function clearStudentSessionUi(options = {}) {
  const clearColdMailer = Boolean(options?.clearColdMailer);
  const clearIds = [
    'loginEmailInput',
    'loginPasswordInput',
    'resetEmailInput',
    'regNameInput',
    'regEmailInput',
    'regPasswordInput',
    'regGradeInput',
    'regSchoolInput',
    'regMajorInput',
    'regSkillsInput',
    'regProjectInput',
    'editNameInput',
    'editGradeInput',
    'editSchoolInput',
    'editMajorInput',
    'editSkillsInput',
    'editProjectInput',
    'deleteAccountPasswordInput'
  ];
  clearIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  const regPillar = document.getElementById('regPillarSelect');
  if (regPillar) regPillar.value = 'Sciences';
  const editPillar = document.getElementById('editPillarSelect');
  if (editPillar) editPillar.value = 'Sciences';
  const defaultRegLvl = document.querySelector('input[name="regAcademicLevel"][value="highschool"]');
  if (defaultRegLvl) defaultRegLvl.checked = true;
  populateGradeChips('regGradeQuickChips', 'regGradeInput', 'highschool');

  const forgotBox = document.getElementById('forgotPasswordBox');
  if (forgotBox) forgotBox.style.display = 'none';
  const deleteBox = document.getElementById('deleteAccountConfirmBox');
  if (deleteBox) deleteBox.style.display = 'none';
  const editForm = document.getElementById('editProfileForm');
  if (editForm) editForm.style.display = 'none';
  const summaryBox = document.getElementById('activeProfileSummaryBox');
  if (summaryBox) summaryBox.style.display = 'flex';

  setAuthFeedback('authFeedbackBox', '', '');
  setAuthFeedback('profileEditFeedback', '', '');

  const headEl = document.getElementById('activeProfileHeading');
  if (headEl) headEl.textContent = 'Student Name';
  const subEl = document.getElementById('activeProfileEmailSub');
  if (subEl) subEl.textContent = '';
  const gridEl = document.getElementById('activeProfileSummaryGrid');
  if (gridEl) gridEl.replaceChildren();
  const skillsEl = document.getElementById('activeProfileSkillsHighlight');
  if (skillsEl) skillsEl.replaceChildren();

  const adminStudentsEl = document.getElementById('adminStudentsCount');
  if (adminStudentsEl) adminStudentsEl.textContent = '0 Students';
  const adminSubsEl = document.getElementById('adminSubmissionsCount');
  if (adminSubsEl) adminSubsEl.textContent = '0 Submissions';
  const adminListEl = document.getElementById('adminModerationList');
  if (adminListEl) adminListEl.replaceChildren();

  if (clearColdMailer) {
    const mailerIds = [
      'studentNameInput',
      'studentSchoolInput',
      'studentSkillsInput',
      'studentProjectInput',
      'targetProfInput',
      'targetUniInput',
      'targetPaperInput',
      'targetResearchWorkInput',
      'profDirectorySelect',
      'subjectEditorInput',
      'emailBodyEditor'
    ];
    mailerIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    const previewBox = document.getElementById('emailBodyText');
    if (previewBox) previewBox.replaceChildren();
    const profCard = document.getElementById('selectedProfResearchCard');
    if (profCard) {
      profCard.replaceChildren(
        createDomEl('div', {
          className: 'prof-card-empty-hint',
          text: 'Select a verified professor above or sign in to auto-populate faculty research details.'
        })
      );
    }
    selectedColdMailProfId = '';
    isMailManuallyEdited = false;
    lastGeneratedPlainText = '';
    lastGeneratedSubject = '';
    setMailEditorMode('edit');
    syncWordCountFromText('');

    const stateBadge = document.getElementById('mailEditStateBadge');
    if (stateBadge) {
      stateBadge.textContent = '✦ Cleared on Sign-Out';
      stateBadge.style.color = 'var(--cyan-bright)';
    }
    const defaultStrategy = document.querySelector('input[name="emailStrategy"][value="undergrad"]');
    if (defaultStrategy) defaultStrategy.checked = true;
  }

  renderLiveStudentPreview(null);
  updateHeaderAndBannerUI(null);
  syncHeaderClearance();
}

window.clearStudentSessionUi = clearStudentSessionUi;

function syncActiveStudentToColdMailer(shouldScrollAndToast = false, profileOverride) {
  const active = profileOverride !== undefined ? profileOverride : getActiveStudent();
  if (!active) return;

  if (!document.getElementById('targetProfInput')?.value?.trim()) {
    loadProfessorForDraft(selectedColdMailProfId || 'mit_barzilay', true);
  }

  const meta = LEVEL_META[active.level] || LEVEL_META.highschool;
  const nameInput = document.getElementById('studentNameInput');
  const schoolInput = document.getElementById('studentSchoolInput');
  const skillsInput = document.getElementById('studentSkillsInput');
  const projInput = document.getElementById('studentProjectInput');

  if (nameInput) nameInput.value = active.name || '';
  if (schoolInput) {
    const majorPart = active.major ? ` ${active.major}` : '';
    const schoolPart = active.school ? ` @ ${active.school}` : '';
    schoolInput.value = `${active.grade}${majorPart}${schoolPart}`;
  }
  if (skillsInput) skillsInput.value = active.skills || '';
  if (projInput) projInput.value = active.project || '';

  let targetStrategy = meta.defaultStrategy;
  if ((active.level === 'ug' || active.level === 'uni') && active.pillar) {
    if (active.pillar === 'Commerce') targetStrategy = 'commerce';
    else if (active.pillar === 'Design') targetStrategy = 'design';
    else if (active.pillar === 'Humanities') targetStrategy = 'humanities';
    else targetStrategy = 'undergrad';
  }
  const radio = findInputByNameAndValue('emailStrategy', targetStrategy);
  if (radio) radio.checked = true;

  isMailManuallyEdited = false;
  updateColdEmail();
  if (shouldScrollAndToast) {
    enterMainApp('coldMailer');
    showToast(`Synced ${active.name} (${meta.short} · ${active.grade}) into Cold Mail Generator!`);
  }
}

function warnFirebaseHttpRequired() {
  const msg = window.location.protocol === 'file:'
    ? 'Firebase modular ES SDK requires HTTP/HTTPS. Start the emulators (`npm run emulators`) and open http://127.0.0.1:5000/?emulator=1 rather than file://.'
    : 'Firebase SDK is still loading — please wait a second and try again.';
  setAuthFeedback('authFeedbackBox', msg, 'error');
  showToast(msg);
}

function handleStudentLogin(event) {
  event.preventDefault();
  if (window.SeekFirebaseBridge?.handleStudentLogin) {
    return window.SeekFirebaseBridge.handleStudentLogin(event);
  }
  warnFirebaseHttpRequired();
}

function handleStudentRegister(event) {
  event.preventDefault();
  if (window.SeekFirebaseBridge?.handleStudentRegister) {
    return window.SeekFirebaseBridge.handleStudentRegister(event);
  }
  warnFirebaseHttpRequired();
}

function togglePasswordResetPanel(forceOpen) {
  if (window.SeekFirebaseBridge?.togglePasswordResetPanel) {
    return window.SeekFirebaseBridge.togglePasswordResetPanel(forceOpen);
  }
  const panel = document.getElementById('forgotPasswordBox');
  if (panel) {
    const isHidden = window.getComputedStyle(panel).display === 'none';
    const next = typeof forceOpen === 'boolean' ? forceOpen : isHidden;
    panel.style.display = next ? 'flex' : 'none';
  }
}

function handlePasswordReset() {
  if (window.SeekFirebaseBridge?.handlePasswordReset) {
    return window.SeekFirebaseBridge.handlePasswordReset();
  }
  warnFirebaseHttpRequired();
}

function handleResendVerification() {
  if (window.SeekFirebaseBridge?.handleResendVerification) {
    return window.SeekFirebaseBridge.handleResendVerification();
  }
}

function handleRefreshVerification() {
  if (window.SeekFirebaseBridge?.handleRefreshVerification) {
    return window.SeekFirebaseBridge.handleRefreshVerification();
  }
}

function toggleDeleteAccountPanel(forceOpen) {
  if (window.SeekFirebaseBridge?.toggleDeleteAccountPanel) {
    return window.SeekFirebaseBridge.toggleDeleteAccountPanel(forceOpen);
  }
}

function handleConfirmDeleteAccount(event) {
  event.preventDefault();
  if (window.SeekFirebaseBridge?.handleConfirmDeleteAccount) {
    return window.SeekFirebaseBridge.handleConfirmDeleteAccount(event);
  }
  warnFirebaseHttpRequired();
}

function saveColdMailSubmission(channel = 'draft_saved') {
  if (window.SeekFirebaseBridge?.saveColdMailSubmission) {
    return window.SeekFirebaseBridge.saveColdMailSubmission(channel);
  }
  warnFirebaseHttpRequired();
}

function loadSubmissionIntoEditor(submissionId) {
  if (window.SeekFirebaseBridge?.loadSubmissionIntoEditor) {
    return window.SeekFirebaseBridge.loadSubmissionIntoEditor(submissionId);
  }
}

function cancelSubmissionEditMode() {
  if (window.SeekFirebaseBridge?.cancelSubmissionEditMode) {
    return window.SeekFirebaseBridge.cancelSubmissionEditMode();
  }
}

function deleteMySubmission(submissionId) {
  if (window.SeekFirebaseBridge?.deleteMySubmission) {
    return window.SeekFirebaseBridge.deleteMySubmission(submissionId);
  }
}

function adminLoadDashboard() {
  if (window.SeekFirebaseBridge?.adminLoadDashboard) {
    return window.SeekFirebaseBridge.adminLoadDashboard();
  }
}

function adminChangeSubmissionStatus(submissionId, newStatus) {
  if (window.SeekFirebaseBridge?.adminChangeSubmissionStatus) {
    return window.SeekFirebaseBridge.adminChangeSubmissionStatus(submissionId, newStatus);
  }
}

function toggleEditProfilePanel(forceState) {
  const form = document.getElementById('editProfileForm');
  const summary = document.getElementById('activeProfileSummaryBox');
  if (!form || !summary) return;

  const isHidden = window.getComputedStyle(form).display === 'none';
  const shouldShow = typeof forceState === 'boolean' ? forceState : isHidden;
  form.style.display = shouldShow ? 'flex' : 'none';
  summary.style.display = shouldShow ? 'none' : 'flex';

  if (shouldShow) {
    const active = getActiveStudent();
    if (!active) return;
    document.getElementById('editNameInput').value = active.name || '';
    document.getElementById('editGradeInput').value = active.grade || '';
    document.getElementById('editSchoolInput').value = active.school || '';
    document.getElementById('editMajorInput').value = active.major || '';
    document.getElementById('editPillarSelect').value = active.pillar || 'Sciences';
    document.getElementById('editSkillsInput').value = active.skills || '';
    document.getElementById('editProjectInput').value = active.project || '';
    const lvlRadio = findInputByNameAndValue('editAcademicLevel', active.level);
    if (lvlRadio) lvlRadio.checked = true;
    populateGradeChips('editGradeQuickChips', 'editGradeInput', active.level);
    setAuthFeedback('profileEditFeedback', '', '');
  }
}

function saveEditedStudentData(event) {
  event.preventDefault();
  if (window.SeekFirebaseBridge?.saveEditedStudentData) {
    return window.SeekFirebaseBridge.saveEditedStudentData(event);
  }
  warnFirebaseHttpRequired();
}

async function logoutStudentAccount(showMsg = true, targetTab = 'login') {
  if (window.SeekFirebaseBridge?.logoutStudentAccount) {
    return window.SeekFirebaseBridge.logoutStudentAccount(showMsg, targetTab);
  }
  document.body.classList.remove('account-modal-open');
  document.body.classList.add('auth-gate-active');
  clearStudentSessionUi({ clearColdMailer: true });
  switchAuthTab(targetTab);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (showMsg) showToast('Signed out — returned to Student Login Page.');
}

async function switchToCreateNewAccount() {
  await logoutStudentAccount(false, 'register');
}

function initStudentPortal() {
  onRegisterLevelChange('highschool');
  renderActiveAuthWorkspace(null);
  document.body.classList.add('auth-gate-active');
  syncHeaderClearance();
  if (window.location.protocol === 'file:') {
    setAuthFeedback(
      'authFeedbackBox',
      'Open http://127.0.0.1:5000/?emulator=1 after starting `npm run emulators` (instead of file://) so Firebase Authentication can initialize.',
      'error'
    );
  }
}

function bindSeekResearchEvents() {
  const UI_CLICK_ACTIONS = {
    'dismiss-intro': () => dismissLaunchIntro(),
    'guest-go': (el) => enterAsGuestAndGo(el.dataset.target || 'heroStage'),
    'open-portal': (el) => openStudentPortal(el.dataset.tab || 'login'),
    'scroll-section': (el) => {
      if (el.dataset.pillar) setPillar(el.dataset.pillar);
      if (el.dataset.target) scrollToSection(el.dataset.target);
    },
    'replay-intro': () => replayLaunchIntro(),
    'close-portal': () => closeStudentPortalModal(),
    'switch-auth-tab': (el) => switchAuthTab(el.dataset.authTab || 'login'),
    'toggle-reset-panel': () => togglePasswordResetPanel(),
    'send-reset-email': () => handlePasswordReset(),
    'toggle-edit-profile': (el) =>
      toggleEditProfilePanel(el.dataset.force === 'false' ? false : undefined),
    'create-new-account': () => switchToCreateNewAccount(),
    'logout-account': () => logoutStudentAccount(),
    'resend-verify': () => handleResendVerification(),
    'refresh-verify': () => handleRefreshVerification(),
    'sync-to-mailer': () => syncActiveStudentToColdMailer(true),
    'toggle-delete-panel': (el) =>
      toggleDeleteAccountPanel(el.dataset.force === 'false' ? false : undefined),
    'admin-refresh': () => adminLoadDashboard(),
    'load-hs-preset': () => loadHighSchoolPreset(),
    'load-prof-draft': (el) => {
      if (el.dataset.profId) loadProfessorForDraft(el.dataset.profId);
    },
    'reset-quota': () => resetDailyMailQuota(),
    'mail-mode': (el) => setMailEditorMode(el.dataset.mode || 'edit'),
    'regenerate-draft': () => resetManualMailEdits(),
    'copy-email': () => copyColdEmail(),
    'save-submission': () => saveColdMailSubmission('draft_saved'),
    'open-mail-client': () => openMailClient(),
    'save-draft-only': () => saveDraftOnly(),
    'cancel-sub-edit': () => cancelSubmissionEditMode(),
    'toggle-audio': () => toggleAnalogTapeSound(),
    'cycle-timezone': () => cycleCampusTimezone(),
    'toggle-grain': () => toggleFilmGrain()
  };

  document.addEventListener('click', (event) => {
    const targetEl = event.target instanceof Element ? event.target : null;
    if (!targetEl) return;

    const actionEl = targetEl.closest('[data-ui-action]');
    if (actionEl) {
      const handler = UI_CLICK_ACTIONS[actionEl.dataset.uiAction];
      if (handler) handler(actionEl, event);
      return;
    }

    const pwdBtn = targetEl.closest('.password-toggle-btn[data-password-target]');
    if (pwdBtn) {
      togglePasswordField(pwdBtn.dataset.passwordTarget, pwdBtn);
      return;
    }

    const pillarBtn = targetEl.closest('.pillar-tab-btn[data-pillar]');
    if (pillarBtn) {
      setPillar(pillarBtn.dataset.pillar);
      return;
    }

    const discBtn = targetEl.closest('.filter-chip-btn[data-discipline]');
    if (discBtn) {
      setDiscipline(discBtn.dataset.discipline);
    }
  });

  const phoneCallLink = document.getElementById('phoneCallLink');
  if (phoneCallLink) {
    phoneCallLink.addEventListener('click', (event) => {
      if (document.body.classList.contains('auth-gate-active')) {
        event.preventDefault();
        enterAsGuestAndGo('coldMailer');
      }
    });
  }

  document.getElementById('loginFormPanel')?.addEventListener('submit', handleStudentLogin);
  document.getElementById('registerFormPanel')?.addEventListener('submit', handleStudentRegister);
  document.getElementById('deleteAccountConfirmBox')?.addEventListener('submit', handleConfirmDeleteAccount);
  document.getElementById('editProfileForm')?.addEventListener('submit', saveEditedStudentData);

  const regPreviewInputIds = [
    'regNameInput',
    'regEmailInput',
    'regGradeInput',
    'regSchoolInput',
    'regMajorInput',
    'regSkillsInput',
    'regProjectInput'
  ];
  regPreviewInputIds.forEach((id) => {
    document.getElementById(id)?.addEventListener('input', () => renderLiveStudentPreview());
  });
  document.getElementById('regPillarSelect')?.addEventListener('change', () => renderLiveStudentPreview());

  document.querySelectorAll('input[name="regAcademicLevel"]').forEach((radio) => {
    radio.addEventListener('change', () => onRegisterLevelChange(radio.value));
  });
  document.querySelectorAll('input[name="editAcademicLevel"]').forEach((radio) => {
    radio.addEventListener('change', () => populateGradeChips('editGradeQuickChips', 'editGradeInput', radio.value));
  });

  document.getElementById('profSearchInput')?.addEventListener('input', () => handleProfFilter());
  document.getElementById('uniFilterSelect')?.addEventListener('change', (event) => {
    setUniversityFilter(event.target.value);
  });
  document.getElementById('profDirectorySelect')?.addEventListener('change', (event) => {
    if (event.target.value) loadProfessorForDraft(event.target.value, true);
  });

  const mailSyncInputIds = [
    'targetProfInput',
    'targetUniInput',
    'targetPaperInput',
    'targetResearchWorkInput',
    'studentNameInput',
    'studentSchoolInput',
    'studentSkillsInput',
    'studentProjectInput'
  ];
  mailSyncInputIds.forEach((id) => {
    document.getElementById(id)?.addEventListener('input', () => updateColdEmail());
  });

  document.querySelectorAll('input[name="emailStrategy"]').forEach((radio) => {
    radio.addEventListener('change', () => resetManualAndGenerate());
  });

  document.getElementById('subjectEditorInput')?.addEventListener('input', () => onManualMailEdit());
  document.getElementById('emailBodyEditor')?.addEventListener('input', () => onManualMailEdit());
}

bindSeekResearchEvents();
initStudentPortal();

window.addEventListener('resize', syncHeaderClearance);
if (typeof ResizeObserver === 'function') {
  const hdrEl = document.querySelector('.editorial-header');
  if (hdrEl) {
    new ResizeObserver(() => syncHeaderClearance()).observe(hdrEl);
  }
}

// Trigger opener on page load
window.addEventListener('DOMContentLoaded', () => {
  syncHeaderClearance();
  runLaunchIntro(3200);
});
