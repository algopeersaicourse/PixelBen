import { ArchitecturalLesson } from '../types';

export const architecturalLessons: ArchitecturalLesson[] = [
  {
    id: 'lesson-1',
    title: 'One-Point Perspective & Vanishing Intuition',
    category: 'Perspective Fundamentals',
    subtitle: 'Mastering depth foreshortening, eye-level horizons, and the colonnade corridor',
    duration: '25 min',
    difficulty: 'Beginner',
    summary: 'One-point perspective is the foundation of architectural depth. Learn how a single vanishing point locked to your horizon line dictates human perception, floor grid intervals, and architectural colonnades.',
    heroImage: '/src/assets/images/drawing_lesson_perspective_1791048454032.jpg',
    keyPrinciples: [
      'The Horizon Line strictly represents the observer’s eye level (standing at 1.6m vs crouching vs aerial bird-eye view).',
      'All receding horizontal surfaces converge strictly to the single Vanishing Point (VP).',
      'All frontal vertical and horizontal lines remain perfectly true 90-degree orthogonal edges.',
      'Column spacing decreases exponentially into depth according to the diagonal measuring method.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Establish the Eye-Level Horizon & Anchor the Vanishing Point',
        instructions: 'Draw a single horizontal reference line across the middle third of your canvas. Place a sharp pin-dot vanishing point (VP). Avoid placing the VP dead-center unless intentionally creating an authoritative cinematic symmetry.',
        proTip: 'A low horizon (lower third) makes architectural volumes feel monumental, towering, and heroic.'
      },
      {
        stepNumber: 2,
        title: 'Project Floor and Ceiling Orthogonals',
        instructions: 'From the VP, project four dynamic rays outward to define the floor edges, ceiling soffit, and wall planes. Keep pencil pressure light (use 2H or 20% opacity drafting pen).',
        proTip: 'Lock your wrist and draw from your shoulder or elbow for fluid, arrow-straight guideline rays.'
      },
      {
        stepNumber: 3,
        title: 'Construct Spaced Architectural Portals (Colonnades)',
        instructions: 'Draw the first frontal rectangle portal. To find the accurate foreshortened position of the next portal, draw a diagonal from the top corner through the midpoint of the far edge to intersect the base guideline.',
        proTip: 'This diagonal trick (Thales theorem) guarantees mathematically correct optical depth without measuring with a ruler.'
      },
      {
        stepNumber: 4,
        title: 'Establish Line Weight Hierarchy (Micron Inking)',
        instructions: 'Foreground portal edges receive the thickest, boldest line weight (0.8mm). Guidelines remain faint. Cast shadows under the soffit using fine 45-degree crosshatching.',
        proTip: 'Contrast between razor-thin guidelines and decisive foreground ink is what gives architectural sketches professional authority.'
      }
    ],
    canvasSetup: {
      gridType: 'one-point',
      prompt: 'Construct a sunlit modernist colonnade with 4 portals receding into a distant vanishing point.'
    }
  },
  {
    id: 'lesson-2',
    title: 'Two-Point Perspective & Cantilevered Volumes',
    category: 'Spatial Geometry',
    subtitle: 'Constructing modern minimalist villas, corner views, and floating slabs',
    duration: '35 min',
    difficulty: 'Intermediate',
    summary: 'Two-point perspective mimics natural human vision when viewing the corner of a building. Learn how left and right vanishing points interact with cantilevered balconies, glass facades, and structural massing.',
    heroImage: '/src/assets/images/isometric_architecture_art_1791048441839.jpg',
    keyPrinciples: [
      'Two vanishing points (VP Left and VP Right) both sit on the exact same continuous Horizon Line.',
      'To prevent unnatural fish-eye distortion, keep VP-L and VP-R spaced wide—often beyond the visible edges of the canvas.',
      'All vertical corners (corner pilasters, wall seams) remain strictly vertical (90 degrees to horizon).',
      'The leading corner closest to the viewer is the primary measuring stick for all heights.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Anchor Wide Vanishing Points and the Leading Vertical Corner',
        instructions: 'Define the horizon line. Place VP-L far left and VP-R far right. In the center-right zone, draw the leading vertical edge that marks the front corner of the villa.',
        proTip: 'If your vanishing points are too close together, your building will look pinched like a 90s video game polygon.'
      },
      {
        stepNumber: 2,
        title: 'Construct the Primary Bounding Volume (The Glass Box)',
        instructions: 'Connect the top and bottom of the leading vertical edge to both VP-L and VP-R. Terminate the rear vertical edges to form a solid two-point rectangular prism.',
        proTip: 'Think in transparent volumes (x-ray vision). Draw the unseen back walls lightly to ensure floor planes are level.'
      },
      {
        stepNumber: 3,
        title: 'Project the Cantilevered Balcony Slab',
        instructions: 'Extend the roof slab line past the leading corner along the VP-L ray. Drop a vertical edge to give the cantilever slab structural thickness (at least 300mm scale).',
        proTip: 'Cantilevers look convincing when the underside receives deep ambient occlusion shading.'
      },
      {
        stepNumber: 4,
        title: 'Fenestration, Mullions & Surface Reflection Lines',
        instructions: 'Draw thin vertical window mullions receding toward the vanishing point. Add subtle 60-degree diagonal gloss glare strokes across glass panes.',
        proTip: 'Leave breaks in glass glare lines; don’t run them edge-to-edge. White space creates luminosity.'
      }
    ],
    canvasSetup: {
      gridType: 'two-point',
      prompt: 'Draw a two-story cantilevered concrete pavilion with an open glass ground floor and floating upper deck.'
    }
  },
  {
    id: 'lesson-3',
    title: 'Axonometric & Isometric Projections',
    category: 'Precision Technical Drawing',
    subtitle: 'True-scale 30-degree isometric drafting for studio gear, pavilions, and exploded details',
    duration: '30 min',
    difficulty: 'Intermediate',
    summary: 'Unlike perspective drawing where lines converge, isometric drawing maintains parallel lines along 30-degree angles. This preserves exact dimensional proportions, making it the preferred language of designers, architects, and studio builders.',
    heroImage: '/src/assets/images/isometric_gaming_station_1791048470439.jpg',
    keyPrinciples: [
      'The Isometric Triad: The three coordinate axes are oriented at 90° (vertical), 30° above horizontal (right), and 150° above horizontal (left).',
      'Parallel lines remain strictly parallel everywhere; there are no vanishing points or focal distortions.',
      'Dimensions along the X, Y, and Z axes are drawn to the exact same 1:1 scale ratio.',
      'Isometric circles become precise 35°16′ isometric ellipses inside isometric square faces.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Construct the Primary 30° Isometric Y-Anchor',
        instructions: 'Draw a vertical line (Z-axis). From its base, draw two lines angled 30 degrees upward from horizontal (X and Y axes). This inverted "Y" tripod is the seed of every isometric volume.',
        proTip: 'Use PixelBen’s 30° snap tool to ensure your lines stay true to the 30° coordinate grid.'
      },
      {
        stepNumber: 2,
        title: 'Build the Isometric Modular Cube',
        instructions: 'Mark identical units of measurement along all three axes. Complete the top diamond face and two side diamond faces with parallel strokes.',
        proTip: 'Check the top face: it should form a diamond with 60° and 120° internal angles.'
      },
      {
        stepNumber: 3,
        title: 'Carve Negative Space (Step Cuts & Recesses)',
        instructions: 'Draw secondary 30-degree lines slicing into the cube to carve out interior courtyards, keyboard recesses, or stepped terraces.',
        proTip: 'Always carry cut lines through all three visible planes to keep structural continuity.'
      },
      {
        stepNumber: 4,
        title: 'Axonometric Line Hierarchy & Hatching',
        instructions: 'Ink the exterior boundary profile with a heavyweight outer contour line. Use a lighter line for internal edges, and fine parallel 60° lines for tonal shadows.',
        proTip: 'A heavy outer contour line makes isometric objects immediately pop off the drafting page.'
      }
    ],
    canvasSetup: {
      gridType: 'isometric',
      prompt: 'Construct a modular audio workstation with dual studio speakers, desktop rack, and keyboard shelf.'
    }
  },
  {
    id: 'lesson-4',
    title: 'Light Angles & Cast Shadows (45° Solar Construction)',
    category: 'Shading & Value',
    subtitle: 'Constructing physically accurate architectural cast shadows using parallel sunlight vectors',
    duration: '20 min',
    difficulty: 'Intermediate',
    summary: 'Shading turns flat geometry into palpable physical space. Learn the classic architectural 45-degree sun convention, core shadow terminations, and how ground cast shadows reveal underlying terrain steps.',
    heroImage: '/src/assets/images/drawing_lesson_perspective_1791048454032.jpg',
    keyPrinciples: [
      'Architectural convention sets sunlight coming over the left shoulder at 45° in elevation and 45° in plan.',
      'Every shadow has two components: Form Shadow (the face turned away from the light) and Cast Shadow (the silhouette cast onto other surfaces).',
      'The Cast Shadow is always noticeably darker and has sharper edges than the form shadow.',
      'Ambient Occlusion: The tightest crevices where surfaces meet receive zero bounce light and are the deepest black.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Determine the Light Source Direction & Ground Direction',
        instructions: 'Choose a light angle (commonly 45° from top-left). Establish the corresponding ground angle (horizontal or 45° diagonal along the ground plane).',
        proTip: 'Consistency is everything. One stray shadow pointing toward a different direction instantly ruins the drawing illusion.'
      },
      {
        stepNumber: 2,
        title: 'Project Shadow Rays from Volume Vertices',
        instructions: 'From each top corner of your building, cast a 45° downward ray. From the corresponding base corner on the ground, project a ground ray until the two intersect.',
        proTip: 'The intersection point is the exact shadow vertex on the pavement.'
      },
      {
        stepNumber: 3,
        title: 'Trace and Tone the Ground Shadow Envelope',
        instructions: 'Connect all shadow vertices to form the complete cast shadow silhouette. Fill with uniform 45-degree diagonal hatching or a soft charcoal wash.',
        proTip: 'Keep your hatching strokes spaced evenly. Irregular hatching looks like dirty dirt; uniform hatching reads as clean shadow.'
      }
    ],
    canvasSetup: {
      gridType: 'isometric',
      prompt: 'Draw an L-shaped concrete wall and cast physically accurate 45° ground shadows across a stepped pavement.'
    }
  },
  {
    id: 'lesson-5',
    title: 'Architectural Textures & Material Rendering',
    category: 'Materiality',
    subtitle: 'Board-formed concrete, timber battens, polished glass, and metal panels',
    duration: '30 min',
    difficulty: 'Advanced',
    summary: 'A drawing gains soul through its material honesty. Discover how simple pen marks evoke the coolness of raw concrete, the warmth of vertical cedar battens, and the crisp transparency of structural glazing.',
    heroImage: '/src/assets/images/isometric_architecture_art_1791048441839.jpg',
    keyPrinciples: [
      'Less is more: Never texture 100% of a surface. Suggest texture near edges and shadows, and let the viewer’s eye fill in the center.',
      'Board-formed concrete is characterized by subtle horizontal formwork seams and circular tie-rod holes.',
      'Timber slats require rhythmic, disciplined parallel vertical lines with varied spacing to show grain vibration.',
      'Glass is drawn by what is behind it and what reflects off it, never as a flat opaque blue.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Block Out Material Zoning on Primary Facades',
        instructions: 'Segment the building envelope into distinct material zones: base podium (concrete), upper curtain wall (glass), and warm accent screen (timber louvers).',
        proTip: 'Contrast smooth surfaces with textured surfaces to create visual rhythm.'
      },
      {
        stepNumber: 2,
        title: 'Render Board-Formed Concrete Seams',
        instructions: 'Draw horizontal formwork lines spaced approximately 600mm to 900mm scale. Add pairs of tiny dots for form tie holes. Add subtle stippling for aggregate texture.',
        proTip: 'Slightly vary the density of stippling around the lower corners where rain weathering occurs.'
      },
      {
        stepNumber: 3,
        title: 'Timber Louver Slat Rhythm',
        instructions: 'Using a fine 0.2mm pen, draft disciplined vertical parallel strokes. Emphasize every fourth slat with a micro cast shadow to give depth.',
        proTip: 'Warm the timber zone with a soft ochre or beige pencil tint for immediate warmth.'
      }
    ],
    canvasSetup: {
      gridType: 'one-point',
      prompt: 'Render a modernist facade segment combining rough board-formed concrete, vertical timber battens, and steel-framed glass.'
    }
  },
  {
    id: 'lesson-6',
    title: 'Architectural Entourage: Figures, Vegetation & Human Scale',
    category: 'Scale & Context',
    subtitle: 'Giving architecture life, scale, and atmosphere with stylized figures and minimalist trees',
    duration: '20 min',
    difficulty: 'Beginner',
    summary: 'Architecture without humans has no scale. Learn the classic architectural figure drawing technique (clean 7.5-head silhouettes) and how to anchor trees without cluttering structural linework.',
    heroImage: '/src/assets/images/drawing_lesson_perspective_1791048454032.jpg',
    keyPrinciples: [
      'In a one-point or two-point perspective, the heads of all standing people will align with the Horizon Line, regardless of distance (if on the same level ground).',
      'Architectural figures are simplified silhouettes—focus on gesture, posture, and line of action rather than facial features.',
      'Trees should be drawn with loose, organic branch structures that frame the building rather than obscure key facades.',
      'Include contextual objects like bicycles, studio chairs, or outdoor planters to establish genuine human inhabitation.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'The Eye-Level Alignment Rule for Figures',
        instructions: 'Locate the horizon line. Every adult figure’s head or eye level will rest right on this line if they are standing on flat ground.',
        proTip: 'A person far in the distance will have their feet high up near the horizon, but their head will still touch the horizon!'
      },
      {
        stepNumber: 2,
        title: 'Quick 3-Stroke Silhouette Method',
        instructions: 'Stroke 1: Elongated oval torso/head. Stroke 2: Clean straight leg line. Stroke 3: Supporting leg angled slightly. Keep linework decisive and minimal.',
        proTip: 'Avoid drawing fingers, facial expressions, or detailed clothing seams. Clean silhouettes look far more sophisticated.'
      },
      {
        stepNumber: 3,
        title: 'Structural Tree & Canopy Framing',
        instructions: 'Draw thin, elegant trunk gestures that branch in natural Y-forks. Use light, stippled or cloud-like outlines for the canopy foliage.',
        proTip: 'Break the outline of the building slightly with vegetation foliage to create true visual depth.'
      }
    ],
    canvasSetup: {
      gridType: 'two-point',
      prompt: 'Add 3 scale figures and a delicate birch tree to animate a modern gallery courtyard.'
    }
  }
];
