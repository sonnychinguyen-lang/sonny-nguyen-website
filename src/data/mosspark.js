// Transcribed from the coursework charts. Day-of-week values are read from the chart and approximate.
export const neighbourhood = { households: 11535, population: 20506, center: [-79.3675, 43.6545] }
export const householdTypes = [
  { type: '1 person', count: 12099 },
  { type: 'Non-family', count: 1435 },
  { type: 'Family with children', count: 2461 },
  { type: 'Couples, no children', count: 4101 },
  { type: 'Multi-family', count: 0 },
]
export const income = [
  { band: 'Under $30k', count: 6972 }, { band: '$30–39.9k', count: 1230 }, { band: '$40–49.9k', count: 1230 },
  { band: '$50–59.9k', count: 1025 }, { band: '$60–69.9k', count: 1025 }, { band: '$70–79.9k', count: 820 },
  { band: '$80–89.9k', count: 820 }, { band: '$90–99.9k', count: 820 }, { band: '$100–124.9k', count: 1435 },
  { band: '$125–149.9k', count: 1025 }, { band: '$150–199.9k', count: 1230 }, { band: '$200k+', count: 1435 },
]
export const maintainerAge = [
  { age: '15–24', count: 1230 }, { age: '25–34', count: 5947 }, { age: '35–44', count: 4306 }, { age: '45–54', count: 3691 },
  { age: '55–64', count: 2871 }, { age: '65–74', count: 1435 }, { age: '75–84', count: 410 }, { age: '85+', count: 0 },
]
export const compstat = [
  { type: 'B&E', y: { 2019: 275, 2020: 231, 2021: 176, 2022: 149, 2023: 182 }, avg: 202.6, sd: 44.84, range: '158–247', current: 156, change: -23, z: -1.04 },
  { type: 'Robbery', y: { 2019: 167, 2020: 149, 2021: 103, 2022: 75, 2023: 80 }, avg: 114.8, sd: 36.96, range: '78–152', current: 101, change: -12, z: -0.37 },
  { type: 'Assault', y: { 2019: 635, 2020: 751, 2021: 625, 2022: 548, 2023: 617 }, avg: 635.2, sd: 65.5, range: '570–701', current: 591, change: -7, z: -0.67 },
  { type: 'Auto theft', y: { 2019: 63, 2020: 62, 2021: 76, 2022: 85, 2023: 91 }, avg: 75.4, sd: 11.57, range: '64–87', current: 105, change: 39, z: 2.56 },
]
export const years = [2019, 2020, 2021, 2022, 2023]
export const yearlySeries = years.map((yr) => Object.fromEntries([['year', String(yr)], ...compstat.map((c) => [c.type, c.y[yr]])]))
export const dow = [
  { day: 'Mon', total: 895 }, { day: 'Tue', total: 920 }, { day: 'Wed', total: 845 }, { day: 'Thu', total: 910 },
  { day: 'Fri', total: 900 }, { day: 'Sat', total: 950 }, { day: 'Sun', total: 850 },
]
export const dowNotes = [
  'Alcohol is the most-used substance in Toronto, with three in four adults reporting use (Toronto Public Health, 2019).',
  'Assault offences are most common among persons aged about 15–24, with a peak around age 17 (Statistics Canada, 2016).',
]
