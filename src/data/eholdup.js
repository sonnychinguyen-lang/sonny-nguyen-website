// Fictional training scenario (BCIT FSCT 8436). Coordinates are approximate geocodes of the scenario addresses.
export const incidents = [
  { file: '543011', date: '2025-04-26', dow: 'Sat', time: '12:24', address: '9210 Scott Rd, Surrey', zone: 'SU1', kind: 'Robbery', position: [-122.8925, 49.1695] },
  { file: '544441', date: '2025-04-30', dow: 'Wed', time: '13:10', address: '12447 96 Ave, Surrey', zone: 'SU1', kind: 'Robbery', position: [-122.879, 49.1765] },
  { file: '544778', date: '2025-05-04', dow: 'Sun', time: '15:20', address: '8856 Scott Rd, Surrey', zone: 'SU3', kind: 'Robbery', position: [-122.8925, 49.163] },
  { file: '544984', date: '2025-05-08', dow: 'Thu', time: '14:20', address: '11950 Nordel Way, Delta', zone: 'DEL', kind: 'Robbery', position: [-122.896, 49.156] },
  { file: '546475', date: '2025-05-12', dow: 'Mon', time: '14:00', address: '8081 Scott Rd, Delta', zone: 'DEL', kind: 'Robbery', position: [-122.8935, 49.149] },
  { file: '559501', date: '2025-05-20', dow: 'Tue', time: '13:40', address: '9210 Scott Rd, Surrey', zone: 'SU1', kind: 'Robbery', position: [-122.8928, 49.1698] },
  { file: '560007', date: '2025-05-27', dow: 'Tue', time: '20:05', address: '1701 152 St, Surrey', zone: 'SU3', kind: 'Suspicious circumstance', position: [-122.8015, 49.033] },
]
export const places = [
  { name: 'Suspect residence', note: 'Firearm pick-up location', position: [-122.845, 49.1955], kind: 'residence' },
  { name: "Smith's House of Gold", note: 'Pre-operational reconnaissance, May 8', position: [-122.8685, 49.1765], kind: 'recon' },
  { name: 'The Vault (Vancouver)', note: 'Suspected fence · 4-hour meeting, May 5', position: [-123.1005, 49.247], kind: 'fence' },
]

// Association chart → graph. Groups: person, vehicle, device, org, place
export const association = {
  nodes: [
    { id: 'smith', name: 'Conrad SMITH "Smokey"', group: 'person', kind: 'person', size: 5, role: 'Primary gunman · coordinator', profile: 'Assessed as the gunman in all six robberies. Physical description matches Suspect 1 throughout: tall, thin, dressed in black, carrying a firearm. Subject to a lifetime firearms prohibition, a curfew and a no-contact order with THOMPSON. His blue 2022 Dodge Ram (5555AAA) was seen at multiple locations and a partial plate "AAA" was noted fleeing Robbery 6. Stopped on May 5 leaving The Vault with a blue backpack, claiming a jewelry-store job he does not have.' },
    { id: 'mcneil', name: 'Sheila MCNEIL', group: 'person', kind: 'person', size: 4, role: 'Getaway driver · reconnaissance', profile: 'SMITH\'s girlfriend. Witness BRAR described the getaway driver after Robbery 1 as pale with long straight black hair — her profile. Observed driving SMITH\'s truck on May 8, meeting THOMPSON and an unknown male, and attending Smith\'s House of Gold three hours before Robbery 4. A female matching her description entered target stores before Robberies 2 and 4.' },
    { id: 'jsandhu', name: 'Jimmy SANDHU "GMoney"', group: 'person', kind: 'person', size: 4, role: 'Hammer man', profile: 'Source B12345 (assessed reliable) identifies GMoney as the one who smashes display cases and collects the jewelry. About 5\'6", stocky, South Asian, very short hair — consistent with Suspect 2 across the victim statements. Recruited into the crew by VARGAS. Twin brother of Harj SANDHU.' },
    { id: 'vargas', name: 'William VARGAS "Bill"', group: 'person', kind: 'person', size: 4, role: 'Recruiter · armed participant', profile: 'Visited SMITH\'s residence to obtain a firearm before the series began, and recruited SANDHU. His handset is the central node of the call network — most calls, most unique contacts. Overheard praise at the brew pub: "Bill did a good job recruiting him." Also reported as dealing cocaine.' },
    { id: 'hsandhu', name: 'Harj SANDHU', group: 'person', kind: 'person', size: 3, role: 'Twin · unconfirmed', profile: 'Jimmy SANDHU\'s twin. Source reporting that he also commits robberies is of unknown reliability and remains an investigative gap. A phone number listed under his name also appears under TIDERINGTON — a shared or passed device.' },
    { id: 'thompson', name: 'Matthew THOMPSON', group: 'person', kind: 'person', size: 3, role: 'Associate · breach of conditions', profile: 'Court-ordered not to contact SMITH, yet seen with MCNEIL and the unknown male on May 8 — a breach. Source reporting places "Matt" in the jewelry robberies carrying a gun or bear spray. His exact role is unconfirmed; he may be one of the unidentified numbers in the call network. Arrest for breach recommended.' },
    { id: 'hawg', name: 'Maxwell HAWG', group: 'person', kind: 'person', size: 5, role: 'Fence · head of the organization', profile: 'President and sole director of Gold Exchange BC Ltd, an import/export company with three subsidiaries including a cash exchange and The Vault. Special-interest police flag; associate of the Demon Riders. Met SMITH privately for four hours on May 5 and shares a registered work phone with him. Assessed as the fence for the stolen jewelry.' },
    { id: 'twinkie', name: 'William TIDERINGTON "Twinkie"', group: 'person', kind: 'person', size: 3, role: 'Middleman', profile: 'Listed associate of HAWG. Overheard at the brew pub: "Twinkie connected them to the right people" to move stolen goods. Shares a phone number with Harj SANDHU on paper — same person, shared handset, or a burner passed between associates.' },
    { id: 'ram', name: 'Blue 2022 Dodge Ram · 5555AAA', group: 'vehicle', kind: 'car', size: 3, role: 'Getaway vehicle', profile: 'Registered to SMITH. Seen fleeing Robbery 1 with a female driver, at the suspect residence, and by partial plate "AAA" after Robbery 6. A blue full-size Dodge pickup was also reported at Robbery 5.' },
    { id: 'hummer', name: 'Black 2025 Hummer H2 · FFNE727', group: 'vehicle', kind: 'car', size: 3, role: 'HAWG personal vehicle', profile: 'Registered to Gold Exchange BC Ltd and driven by HAWG. Observed at The Vault on May 5.' },
    { id: 'workphone', name: 'Work phone · 604-222-5555', group: 'device', kind: 'phone', size: 3, role: 'Shared device', profile: 'Listed as the work phone for both SMITH and HAWG and registered to Gold Exchange BC Ltd. SMITH has no listed employer — the shared number is the clearest link between the crew and the fencing network.' },
    { id: 'shared', name: 'Shared device · 604-784-1526', group: 'device', kind: 'phone', size: 3, role: 'Listed under two names', profile: 'Appears under TIDERINGTON in HAWG\'s profile and under Harj SANDHU in SMITH\'s profile. Whether it is one person, a shared phone, or a burner is an open gap; subscriber data recommended.' },
    { id: 'goldex', name: 'Gold Exchange BC Ltd', group: 'org', kind: 'building', size: 4, role: 'Import/export company', profile: 'Incorporated November 2023, HAWG as president and sole director. An import/export business is a convenient channel for moving stolen goods. Financial investigation recommended, including its subsidiaries.' },
    { id: 'bikes', name: 'Hawg Wyld Custom Bikes', group: 'org', kind: 'building', size: 3, role: 'Subsidiary · Langley', profile: 'Subsidiary of Gold Exchange BC Ltd at 20801 Langley Bypass.' },
    { id: 'cashfast', name: 'Cashfast Money Exchange', group: 'org', kind: 'building', size: 3, role: 'Subsidiary · cash exchange', profile: 'Subsidiary at 12605 124 St, Surrey. A cash exchange is a known vehicle for laundering proceeds — of analytical interest for where the money goes after the jewelry is sold.' },
    { id: 'vault', name: 'The Vault', group: 'org', kind: 'building', size: 3, role: 'Subsidiary · Vancouver', profile: '4277 Main St, Vancouver. Where HAWG and SMITH met for four hours on May 5, SMITH carrying the blue backpack. Assessed as a likely storage point for stolen goods before resale or export; search warrant recommended.' },
    { id: 'omg', name: 'Demon Riders OMG', group: 'org', kind: 'bike', size: 3, role: 'Outlaw motorcycle gang', profile: 'HAWG is a known associate. The broader organization behind the fencing network is a subject of the recommended financial investigation.' },
    { id: 'house', name: 'SMITH residence · 137 St', group: 'place', kind: 'house', size: 3, role: 'Firearm pick-up', profile: 'Where VARGAS obtained a firearm before the series, and where MCNEIL departed from on May 8 driving the Ram. Five of six robberies fall within about 4.5 km of it. Search warrant recommended: firearms (possibly an AR-15), stolen jewelry, the blue backpack.' },
  ],
  links: [
    { source: 'smith', target: 'house', label: 'Residence' },
    { source: 'smith', target: 'ram', label: 'Personal vehicle' },
    { source: 'mcneil', target: 'ram', label: 'Drove getaway', directed: true },
    { source: 'mcneil', target: 'smith', label: 'Relationship' },
    { source: 'smith', target: 'jsandhu', label: 'Associate' },
    { source: 'smith', target: 'vargas', label: 'Associate' },
    { source: 'vargas', target: 'jsandhu', label: 'Recruited', directed: true },
    { source: 'vargas', target: 'house', label: 'Obtained firearm', directed: true },
    { source: 'jsandhu', target: 'hsandhu', label: 'Twins' },
    { source: 'smith', target: 'thompson', label: 'No-contact order' },
    { source: 'smith', target: 'workphone', label: 'Shared device' },
    { source: 'hawg', target: 'workphone', label: 'Business phone' },
    { source: 'smith', target: 'hawg', label: 'Associate' },
    { source: 'hawg', target: 'goldex', label: 'President' },
    { source: 'goldex', target: 'bikes', label: 'Subsidiary' },
    { source: 'goldex', target: 'cashfast', label: 'Subsidiary' },
    { source: 'goldex', target: 'vault', label: 'Subsidiary' },
    { source: 'hawg', target: 'omg', label: 'Member' },
    { source: 'hawg', target: 'hummer', label: 'Personal vehicle' },
    { source: 'hawg', target: 'twinkie', label: 'Associate' },
    { source: 'twinkie', target: 'goldex', label: 'Middleman / fence' },
    { source: 'twinkie', target: 'shared', label: 'Phone number' },
    { source: 'hsandhu', target: 'shared', label: 'Phone number' },
  ],
}

// Phone network → graph. Two handsets, commonly linked numbers, unique contacts. Fictional scenario numbers.
const fmt = (n) => n.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
const vOnly = ['6047841526', '7785900006', '6046781988', '7781863882', '6046811828', '7788636882', '8019838472', '6042769863', '6042666654', '7784459847', '6042148957']
const sOnly = ['6048329599', '6042225555', '6047781357', '6048871595']
const common = ['6045448475', '6048995526']
export const phoneNetwork = {
  nodes: [
    { id: 'vargas', name: 'William VARGAS · 778-990-4578', group: 'hub', size: 6 },
    { id: 'smith', name: 'Conrad SMITH · 604-888-5512', group: 'hub', size: 6 },
    ...common.map((n) => ({ id: 'c' + n, name: fmt(n) + ' · common', group: 'common', size: 4 })),
    ...vOnly.map((n) => ({ id: 'v' + n, name: fmt(n), group: 'contact', size: 2 })),
    ...sOnly.map((n) => ({ id: 's' + n, name: fmt(n) + (n === '6042225555' ? ' · HAWG work phone' : ''), group: n === '6042225555' ? 'common' : 'contact', size: n === '6042225555' ? 4 : 2 })),
  ],
  links: [
    { source: 'vargas', target: 'smith', label: 'Incoming / outgoing', directed: true },
    { source: 'smith', target: 'vargas', label: 'Incoming / outgoing', directed: true },
    ...common.flatMap((n) => [{ source: 'vargas', target: 'c' + n, directed: true }, { source: 'smith', target: 'c' + n, directed: true }]),
    ...vOnly.map((n) => ({ source: 'vargas', target: 'v' + n, directed: true })),
    ...sOnly.map((n) => ({ source: 'smith', target: 's' + n, directed: true })),
  ],
}
