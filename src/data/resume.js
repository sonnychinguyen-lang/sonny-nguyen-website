export const resume = {
  name: 'Sonny Nguyen',
  title: 'Teacher · Head of English, K–7',
  email: 'sonny.chi.nguyen@gmail.com',
  location: 'Richmond, BC',
  experience: [
    {
      role: 'Head of English / Teacher / Tutor', org: 'ALPS Education', where: 'Richmond, BC', when: 'Sep 2025 – present',
      bullets: [
        'Lead English programming across K–7 at an after-school education service, including curriculum design and direct instruction in a mixed-grade classroom.',
        'Teach classes and tutor students one-on-one.',
        'Keep assessment records and program documentation for 80+ students.',
        'Report to leadership on student progress and program results, with recommendations.',
        'First point of contact for parents and staff on program questions.',
      ],
    },
    {
      role: 'Summer Case Worker', org: 'The Salvation Army Boundless', where: 'Vancouver, BC', when: 'Jun – Aug 2025',
      bullets: [
        'Supported families in the Mount Pleasant area, working out what each household needed from client records and conversations with partner agencies.',
        'Planned and led the Back2School backpack and school-supplies event.',
        'Kept case records for 200+ client files in Link2Feed, in line with policy and privacy requirements.',
        'Summarized service-use trends for leadership with recommended actions.',
        'Coordinated with 10+ community partners.',
      ],
    },
    {
      role: 'International Teacher & Health and Safety Lead', org: 'English First', where: 'Fuzhou, China', when: 'May 2024 – May 2025',
      bullets: [
        'Taught English as a second language to students aged 3–15 at a private English school.',
        'Health and safety lead for a 200+ person organization: looked into incidents, assessed risk and wrote reports with recommendations.',
        'Built and maintained a 200+ record incident and compliance database.',
        'Prepared risk assessments and compliance documentation for leadership.',
      ],
    },
  ],
  education: [
    {
      degree: 'Advanced Certificate in Forensic Investigations', school: 'British Columbia Institute of Technology', when: 'Sep 2025 – present',
      detail: ['Coursework in open-source research, link analysis (i2 Analyst’s Notebook) and geospatial analysis (ArcGIS)'],
    },
    {
      degree: 'Bachelor of Arts, Criminal Justice (Criminology)', school: 'University of the Fraser Valley', when: '2019 – 2023',
      detail: ['Criminal law, evidence and procedure, research methods (SPSS)'],
    },
  ],
  skills: [
    { group: 'Teaching', items: ['English Language Arts (K–7)', 'ESL / ELL', 'Curriculum design', 'Mixed-grade classes', 'One-on-one tutoring', 'Assessment & progress reporting', 'Parent communication'] },
    { group: 'Data & research', items: ['Excel dashboards', 'GIS mapping (ArcGIS)', 'Link analysis', 'Open-source research', 'SPSS', 'Report writing'] },
    { group: 'Tools', items: ['Word · PowerPoint · Outlook', 'Excel', 'ArcGIS', "i2 Analyst's Notebook"] },
    { group: 'Certifications', items: ['TEFL', 'TKT Young Learners', 'TKT Module 1'] },
  ],
}

// Longer notes for the Education page (/education). The resume above stays short;
// this is where the detail lives.
export const teaching = {
  intro: 'I teach English. Right now I’m Head of English at ALPS, an after-school education service in Richmond, working with students from kindergarten to grade 7. Before that I spent a year teaching in Fuzhou, China.',
  stats: [
    { label: 'Grades I teach', value: 'K–7' },
    { label: 'Students in the program', value: '80+' },
    { label: 'Ages taught in Fuzhou', value: '3–15' },
  ],
  places: [
    { role: 'Head of English, teacher and tutor', org: 'ALPS Education', where: 'Richmond, BC', when: 'Sep 2025 – present',
      text: 'I run the English side of the program: I design the curriculum, teach a mixed-grade class, tutor students one-on-one, and keep parents and staff up to date on how students are doing.' },
    { role: 'International teacher', org: 'English First', where: 'Fuzhou, China', when: 'May 2024 – May 2025',
      text: 'I taught English as a second language at a private English school, with students from age 3 to 15. I was also the school’s health and safety lead.' },
  ],
  areas: ['English Language Arts (K–7)', 'ESL / ELL', 'Curriculum design', 'Mixed-grade classes', 'One-on-one tutoring', 'Assessment & progress reporting'],
}

export const studies = [
  { degree: 'Advanced Certificate in Forensic Investigations', school: 'British Columbia Institute of Technology', when: 'Sep 2025 – present',
    courses: [
      { code: 'FSCT 8431', name: 'Open-source intelligence', text: 'Media scanning, deep-web research and social media monitoring.' },
      { code: 'FSCT 8436', name: 'i2 Analyst’s Notebook', text: 'Link analysis of people, accounts, transactions and entities.', projects: ['eholdup'] },
      { code: 'FSCT 8434', name: 'ArcGIS', text: 'Geospatial analysis of crime patterns.', projects: ['surrey-density', 'green-timbers', 'caper'] },
    ] },
  { degree: 'Bachelor of Arts, Criminal Justice (Criminology)', school: 'University of the Fraser Valley', when: '2019 – 2023',
    courses: [{ name: 'Coursework', text: 'Criminal law, organized crime and financial crime, evidence and procedure, research methods (SPSS).' }] },
]

export const certifications = [
  { name: 'TEFL', text: 'Teaching English as a Foreign Language' },
  { name: 'TKT Young Learners', text: 'Cambridge Teaching Knowledge Test' },
  { name: 'TKT Module 1', text: 'Cambridge Teaching Knowledge Test' },
]
