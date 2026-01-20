UX/UI Space Missions Explorer

A data exploration interface built with Next.js (App Router), React 18, TypeScript, and Material UI, focused on clear UX, filtering, and visual hierarchy for space mission data.

Designed my: Micaela Arslanian.

/////////////////////////////////////////////////////////////////

1. Setup Instructions:

Requirements:
- Node.js 18+
- npm

Run: 
npm install
npm run dev

Then open: 
http://localhost:3000

/////////////////////////////////////////////////////////////////

2. Project notes:
This project was originally scaffolded with Vite, but I migrated it to Next.js as required. 
I removed Vite-specific files:
rm -f index.html vite.config.mts
rm -f src/main.tsx src/App.tsx

Generated a Next.js project using App Router:
npx create-next-app@latest . --ts --eslint --app --src-dir --import-alias "@/*"

Replaced the old Vite entry files (index.html, main.tsx, App.tsx) with:
layout.tsx
page.tsx

Installed Material UI and Next.js helpers:
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install @mui/material-nextjs @emotion/cache

/////////////////////////////////////////////////////////////////

3. Design Decisions

- Layout Choice:
I chose a card-based layout because the dataset is not extremely dense and each mission can be represented clearly using a structured visual container. Cards allow quick scanning, easy comparison, and clear hierarchy between mission name, agency, status, and year. For this type of dataset, cards feel more approachable than tables.

- Filtering:
The application has many possible filters (status, mission type, agency, cost, year range), so placing them in a sidebar that is always present, avoids cluttering the main content area. This keeps the grid clean while still making filtering accessible. Filters apply instantly to give immediate visual feedback.
On mobile, filters become a full-screen drawer to preserve space and maintain usability. 

- Navigation Pattern (Modal vs Routing)
I used a modal dialog instead of separate pages because the detailed view does not contain a large amount of content. Keeping users in context makes exploration faster: they can open a mission, read details, and move to the next or previous mission easily, without losing their place in the grid. Also, it makes navigation between the detailed view cards easy. 

- Responsive Strategy
The design minimizes design changes between desktop and mobile.
Only the filter sidebar changes behavior, becoming a hidden drawer on small screens. Cards, search, and sorting remain visually consistent to reduce cognitive load when switching devices. 

- Accessibility
All icon buttons include clear aria-label attributes so screen readers can describe their purpose accurately. The dialog uses accessible labeling so assistive technologies can identify its title and content. Clickable cards support keyboard navigation, allowing users to open them using Enter or Space. Error messages appear when users enter invalid values in the year fields, guiding them to correct their input instead of silently failing. All inputs have visible labels and supporting hints so their purpose is always clear.

- Material UI components:
Cards and CardActionArea are used to display mission previews in a way that is visually structured and easy to scan. Dialog is used for the detailed mission view so users can explore without losing their place. Drawer is used for filters on mobile, where screen space is limited. Chips are used both for filters and for mission status indicators because they are compact and visually expressive. Sliders and numeric inputs are combined for cost filtering to support both dragging and precise typing. TextField is used for searching and year filtering because it provides accessibility and validation functions. Stack and Box are used throughout the layout to create flexible spacing and alignment. 


- Visual Design Choices: 
The interface uses dark mode to create strong contrast and a more technical, space-themed atmosphere. Dark brown and dark gray tones are used for background layers, while lighter brown tones are used for cards and content surfaces to create visual depth. Orange is used for interactive elements such as filters, favorites, and focus states because it feels energetic, modern, and slightly futuristic. Green, red, blue, and gray are used to represent mission statuses, where orange represents user interaction, green means success, red means failure, blue means ongoing, and gray means planned (because its not active at the moment).

Typography follows a clear hierarchy. Mission names use large, bold text to immediately draw attention. Agencies and subtitles use medium weight so they remain readable but with a lower hierarchy. Data such as mission type and year use small, uppercase styling to visually separate them from descriptive text. Secondary information uses lighter color and smaller size so it does not compete with primary content. 

Spacing and visual rhythm are handled consistently using MUI’s Stack for vertical layout and predictable spacing between elements. Dividers are used to separate major content sections so information feels grouped and organized. Status is always displayed as a colored chip, allowing users to instantly understand the outcome of a mission. This helps fast comparison across the cards.


- Improvements:
With more time, I would improve the UX by adding a light mode option so users can choose between dark and light themes. I would also add clearer empty-state messages, such as telling users when no missions or no agencies match their search. I would also create a functionality for the user to hide the filters side bar or make it smaller. 

I would polish the design further by adding smoother animations for dialog opening, filter changes, and card hover transitions. I would also polish the dialog box so that it always has the same size no matter the information. I would handle the empty data more gracefully (for ej: in 'Crew' and display a message saying 'No crew found'.)

For user testing, I would give the explorer to people who are unfamiliar with the project and ask them to rate how easy it was to use the filters, find a mission, understand the statuses, and navigate between missions. Based on their feedback, I would iterate on the areas where they struggled the most.


/////////////////////////////////////////////////////////////////

Links
You can view the full source code for this project on GitHub and the design process in Figma.

GitHub:
https://github.com/your-username/uxui-spacemissions

Figma file:
https://www.figma.com/design/zll6tiLSAbVdLAWfUERTxn/Space-Missions?node-id=0-1&p=f&t=9LFsEKP3lWwtcjta-0

Vercel:
https://uiux-spacemissions.vercel.app/


