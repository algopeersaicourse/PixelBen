import { IsometricExercise } from '../types';

export const isometricExercises: IsometricExercise[] = [
  {
    id: 'iso-cube-1',
    title: 'The Fundamental 30° Isometric Cube & Negative Carving',
    difficulty: 'Foundation',
    timeEstimate: '10 min',
    description: 'Master the primary 30° isometric coordinate triad (90°, 30°, 150°). Practice drawing the bounding cube, then carve an interior step out of the top right corner.',
    instructions: [
      'Enable the 30° Snap tool or align with the isometric dot grid.',
      'Draw the central vertical edge first (Z-axis, height: 120px).',
      'Draw the right 30° baseline and left 150° baseline (length: 120px each).',
      'Complete the outer diamond boundary box.',
      'Slice into the front face to carve an L-shaped step cutout, remembering that all horizontal cuts follow 30° and 150°.'
    ],
    referenceArtwork: '/src/assets/images/isometric_architecture_art_1791048441839.jpg',
    ghostGuideSvg: `
      <g stroke="#C0C4CC" stroke-width="1.5" stroke-dasharray="4,4" fill="none" opacity="0.6">
        <!-- Center Origin: 400, 300 -->
        <!-- Front Leading Vertical -->
        <line x1="400" y1="200" x2="400" y2="340" />
        <!-- Base 30 deg right -->
        <line x1="400" y1="340" x2="520" y2="270.7" />
        <!-- Base 150 deg left -->
        <line x1="400" y1="340" x2="280" y2="270.7" />
        <!-- Right vertical -->
        <line x1="520" y1="270.7" x2="520" y2="130.7" />
        <!-- Left vertical -->
        <line x1="280" y1="270.7" x2="280" y2="130.7" />
        <!-- Top right 30 deg -->
        <line x1="400" y1="200" x2="520" y2="130.7" />
        <!-- Top left 150 deg -->
        <line x1="400" y1="200" x2="280" y2="130.7" />
        <!-- Top rear right 150 deg -->
        <line x1="520" y1="130.7" x2="400" y2="61.4" />
        <!-- Top rear left 30 deg -->
        <line x1="280" y1="130.7" x2="400" y2="61.4" />
        <!-- Cutout step ghost -->
        <line x1="400" y1="270" x2="460" y2="235.3" />
        <line x1="460" y1="235.3" x2="460" y2="165.3" />
        <line x1="460" y1="165.3" x2="400" y2="200" />
      </g>
    `
  },
  {
    id: 'iso-cantilever-2',
    title: 'The Cantilevered Modernist Pavilion',
    difficulty: 'Intermediate',
    timeEstimate: '20 min',
    description: 'Learn how architects use axonometric projection to visualize floating cantilevered concrete roof slabs, glass curtain walls, and sunken garden terraces.',
    instructions: [
      'Draw the solid rear concrete anchor core first (heavy vertical mass).',
      'Extend the horizontal floor platform along the 30° axis.',
      'Project the expansive thin roof plane extending past the walls by 4 grid units.',
      'Draw floor-to-ceiling structural glass mullions (recessed by 1 grid unit to create depth).',
      'Add deep cast shadow lines beneath the cantilever slab using fine 60-degree diagonal hatch marks.'
    ],
    referenceArtwork: '/src/assets/images/isometric_architecture_art_1791048441839.jpg',
    ghostGuideSvg: `
      <g stroke="#C0C4CC" stroke-width="1.5" stroke-dasharray="4,4" fill="none" opacity="0.6">
        <!-- Lower Terrace -->
        <polygon points="200,360 480,200 640,290 360,450" />
        <!-- Podium Vertical Drop -->
        <line x1="200" y1="360" x2="200" y2="390" />
        <line x1="360" y1="450" x2="360" y2="480" />
        <line x1="640" y1="290" x2="640" y2="320" />
        <line x1="200" y1="390" x2="360" y2="480" />
        <line x1="360" y1="480" x2="640" y2="320" />
        <!-- Cantilever Upper Roof Slab -->
        <polygon points="260,180 540,20 680,100 400,260" />
        <!-- Roof Slab Thickness -->
        <line x1="260" y1="180" x2="260" y2="200" />
        <line x1="400" y1="260" x2="400" y2="280" />
        <line x1="680" y1="100" x2="680" y2="120" />
        <line x1="260" y1="200" x2="400" y2="280" />
        <line x1="400" y1="280" x2="680" y2="120" />
        <!-- Columns / Mullions -->
        <line x1="320" y1="230" x2="320" y2="390" />
        <line x1="580" y1="150" x2="580" y2="290" />
      </g>
    `
  },
  {
    id: 'iso-audio-station-3',
    title: 'The Music Studio Audio Console & Desktop Rack',
    difficulty: 'Intermediate',
    timeEstimate: '15 min',
    description: 'Construct a musician and designer workspace featuring angled studio monitor speakers, keyboard synthesizer tier, and studio headphones.',
    instructions: [
      'Draft the main wooden studio desk surface at a comfortable isometric height.',
      'Add the raised top monitor bridge for acoustic speakers and display screens.',
      'Construct two angled isometric speaker wedges flanking the monitor bridge.',
      'Draw the 49-key synthesizer on the lower pull-out tray with precise keyboard key dividing lines.',
      'Detail with volume potentiometer knobs and VU meter rectangles.'
    ],
    referenceArtwork: '/src/assets/images/isometric_gaming_station_1791048470439.jpg',
    ghostGuideSvg: `
      <g stroke="#C0C4CC" stroke-width="1.5" stroke-dasharray="4,4" fill="none" opacity="0.6">
        <!-- Desk Surface -->
        <polygon points="260,300 480,170 620,250 400,380" />
        <!-- Desk Legs -->
        <line x1="270" y1="305" x2="270" y2="440" />
        <line x1="390" y1="375" x2="390" y2="490" />
        <line x1="610" y1="255" x2="610" y2="390" />
        <!-- Top Shelf Riser -->
        <polygon points="340,240 480,160 560,205 420,285" />
        <!-- Left Speaker Wedge -->
        <polygon points="340,230 380,205 400,215 360,240" />
        <line x1="340" y1="230" x2="340" y2="170" />
        <line x1="360" y1="240" x2="360" y2="180" />
        <line x1="400" y1="215" x2="400" y2="155" />
        <polygon points="340,170 380,145 400,155 360,180" />
        <!-- Right Speaker Wedge -->
        <polygon points="500,180 540,155 560,165 520,190" />
        <line x1="500" y1="180" x2="500" y2="120" />
        <line x1="520" y1="190" x2="520" y2="130" />
        <line x1="560" y1="165" x2="560" y2="105" />
        <polygon points="500,120 540,95 560,105 520,130" />
      </g>
    `
  },
  {
    id: 'iso-stairs-4',
    title: 'Multi-Level Architectural Courtyard & Stepped Terraces',
    difficulty: 'Mastery',
    timeEstimate: '25 min',
    description: 'Stepped surfaces are the ultimate test of isometric line discipline. Learn the recurring tread/riser rhythm and how to construct water basins with depth.',
    instructions: [
      'Establish the uniform riser height (1 unit down) and tread depth (1 unit along 30°).',
      'Repeat the stair zigzag cadence for 6 steps.',
      'Extend the horizontal stair treads across the 150° axis.',
      'Construct a flanking concrete retaining wall with top coping.',
      'Add a reflective courtyard pool reflecting the underside of the upper terrace.'
    ],
    referenceArtwork: '/src/assets/images/isometric_architecture_art_1791048441839.jpg',
    ghostGuideSvg: `
      <g stroke="#C0C4CC" stroke-width="1.5" stroke-dasharray="4,4" fill="none" opacity="0.6">
        <!-- Step 1 to 5 Zig-Zag -->
        <path d="M 280,360 L 280,340 L 310,322 L 310,302 L 340,284 L 340,264 L 370,246 L 370,226 L 400,208 L 400,188 L 430,170" />
        <!-- Step Treads Extrusion 150 deg -->
        <line x1="280" y1="360" x2="380" y2="420" />
        <line x1="280" y1="340" x2="380" y2="400" />
        <line x1="310" y1="322" x2="410" y2="382" />
        <line x1="340" y1="284" x2="440" y2="344" />
        <line x1="370" y1="246" x2="470" y2="306" />
        <line x1="400" y1="208" x2="500" y2="268" />
        <line x1="430" y1="170" x2="530" y2="230" />
        <!-- Upper Courtyard Plateau -->
        <polygon points="430,170 530,230 670,150 570,90" />
      </g>
    `
  }
];
