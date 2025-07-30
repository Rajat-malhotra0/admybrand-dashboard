# Dark Mode Visual Audit Testing Guide

## Prerequisites
1. Ensure the development server is running: `npm run dev`
2. Navigate to `http://localhost:3001`
3. Have browser developer tools ready for contrast checking
4. Prepare screenshot tool for documentation

## Step-by-Step Testing Process

### Phase 1: Initial Setup and Theme Toggle
1. **Access the Application**
   - Open `http://localhost:3001` in your browser
   - Verify the application loads in light mode by default

2. **Locate and Test Theme Toggle**
   - Find the theme toggle button in the ConsolidatedHeader (moon/sun icon)
   - Click to switch to dark mode
   - Verify the entire interface switches to dark mode
   - Test toggling back and forth to ensure state persistence

3. **Verify Theme Persistence**
   - Refresh the page while in dark mode
   - Confirm dark mode is maintained after refresh

### Phase 2: Component-by-Component Audit

#### A. StatCard Components
**Location**: Main dashboard page, top section (2x2 grid)

**Screenshot Requirements**:
- [ ] Take screenshot of all 4 StatCards in dark mode
- [ ] Close-up of individual StatCard showing text hierarchy

**Visual Checks**:
- [ ] **Title Text**: Can you easily read the card titles? (e.g., "Total Reach", "Engagement")
- [ ] **Value Numbers**: Are the large numbers clearly visible?
- [ ] **Description Text**: Is the subtitle/description text legible?
- [ ] **Icon Visibility**: Are the orange-background icons visible against dark cards?
- [ ] **Card Borders**: Are card boundaries clearly defined?

**Contrast Issues to Document**:
- [ ] Any text that appears too dim or hard to read
- [ ] Icons that blend into backgrounds
- [ ] Insufficient contrast between text and background

#### B. Map Panel and Legend
**Location**: Main dashboard page, right side of layout

**Screenshot Requirements**:
- [ ] Full map panel in dark mode
- [ ] Map legend (if visible)
- [ ] Tooltip when hovering over countries
- [ ] Campaign statistics overlay (left side of map)

**Visual Checks**:
- [ ] **Country Colors**: Can you distinguish between countries with/without data?
- [ ] **Grid Pattern**: Is the subtle grid background visible?
- [ ] **Legend Pills**: Are legend items clearly readable?
- [ ] **Tooltips**: Hover over countries and check tooltip visibility
- [ ] **Statistics Overlay**: Numbers and labels on the left side
- [ ] **Zoom Controls**: Reset zoom button and other controls

**Interactive Testing**:
- [ ] Hover over different countries to test tooltip contrast
- [ ] Use zoom controls to ensure they remain visible
- [ ] Click on countries to test selection states

#### C. Sidebar Navigation
**Location**: Left side of the application

**Screenshot Requirements**:
- [ ] Full sidebar in dark mode
- [ ] User profile section at top
- [ ] Navigation items (both active and inactive states)
- [ ] Pro Access card at bottom

**Visual Checks**:
- [ ] **User Profile**: Name and username readability
- [ ] **Navigation Items**: All menu items clearly visible
- [ ] **Active State**: Current page highlighting is visible
- [ ] **Hover States**: Test hover effects on navigation items
- [ ] **Pro Card**: Gradient background and text visibility
- [ ] **Icons**: All Lucide icons are visible

**Interactive Testing**:
- [ ] Hover over each navigation item
- [ ] Click through different pages to test active states
- [ ] Check icon visibility at different hover states

#### D. Header and Search
**Location**: Top of the application

**Screenshot Requirements**:
- [ ] Full header in dark mode
- [ ] Search input field (both empty and with text)
- [ ] Status indicator and user controls
- [ ] Theme toggle button

**Visual Checks**:
- [ ] **Search Input**: Placeholder text and border visibility
- [ ] **Input Text**: Typed text contrast and readability
- [ ] **Status Indicator**: Green dot and "Active" text
- [ ] **Icons**: Bell notification, user avatar, menu icons
- [ ] **Theme Toggle**: Current state icon visibility

**Interactive Testing**:
- [ ] Type in search field to test text visibility
- [ ] Hover over all interactive elements
- [ ] Test focus states with keyboard navigation

### Phase 3: Page-by-Page Audit

#### Dashboard Pages to Test
Navigate to each page and repeat visual checks:

1. **Main Dashboard** (`/`)
   - [ ] All components mentioned above
   - [ ] Charts and data visualizations
   - [ ] Platform tabs (LinkedIn, Instagram, Facebook)

2. **Campaigns Page** (`/campaigns`)
   - [ ] Campaign cards/lists
   - [ ] Any data tables
   - [ ] Action buttons

3. **Payments Page** (`/payments`)
   - [ ] Financial data display
   - [ ] Tables and charts
   - [ ] Form elements

4. **Influencers Page** (`/influencers`)
   - [ ] Influencer table
   - [ ] Pagination controls
   - [ ] Filter options

5. **Team Page** (`/team`)
   - [ ] Team member cards
   - [ ] Profile information
   - [ ] Management controls

6. **Admin Panel** (`/admin`)
   - [ ] Administrative controls
   - [ ] Data management interfaces
   - [ ] System status indicators

7. **Data Editor** (`/data-editor`)
   - [ ] Form inputs
   - [ ] Data editing interfaces
   - [ ] Save/cancel buttons

8. **Settings** (`/settings`)
   - [ ] Configuration options
   - [ ] Toggle switches
   - [ ] Form elements

### Phase 4: Charts and Data Visualization

#### Chart Components to Test
- [ ] **AudienceAgeGenderChart**: Age and gender distribution
- [ ] **RadarChart**: Follower interests
- [ ] **InfluencerTable**: Data table with pagination

**Visual Checks for Charts**:
- [ ] **Chart Colors**: All data series clearly distinguishable
- [ ] **Axis Labels**: X and Y axis text readable
- [ ] **Legend Items**: Chart legends clearly visible
- [ ] **Data Points**: Individual data points visible
- [ ] **Tooltips**: Hover states show readable information
- [ ] **Chart Backgrounds**: Charts don't blend with card backgrounds

### Phase 5: Interactive Elements Testing

#### Form Controls
- [ ] **Input Fields**: Text inputs, search boxes
- [ ] **Checkboxes**: The "Use Backend Data" checkbox and others
- [ ] **Buttons**: Primary, secondary, and icon buttons
- [ ] **Dropdowns**: Platform selection and other selectors
- [ ] **Tabs**: Platform tabs (LinkedIn, Instagram, Facebook)

#### Loading and Error States
- [ ] **Loading Spinners**: Blue spinning indicators
- [ ] **Error Messages**: Red error text and backgrounds
- [ ] **Success Indicators**: Green status messages
- [ ] **Empty States**: Placeholder content

### Phase 6: Contrast Ratio Testing

#### Browser DevTools Method
1. Open browser developer tools
2. Go to Elements tab
3. Select text elements
4. Check computed styles for color values
5. Use online contrast checkers to verify WCAG compliance

#### Automated Testing Tools
- Install browser extension like "Colour Contrast Analyser"
- Use axe DevTools for accessibility scanning
- Run Lighthouse accessibility audit

### Phase 7: Documentation

#### Screenshot Organization
Create folders for:
- `screenshots/dashboard-overview/`
- `screenshots/components/statcards/`
- `screenshots/components/map/`
- `screenshots/components/sidebar/`
- `screenshots/pages/[page-name]/`
- `screenshots/issues/[issue-description]/`

#### Issue Documentation Template
For each issue found, document:
```markdown
## Issue: [Brief Description]
- **Component**: [Component Name]
- **Location**: [Page/Section]
- **Priority**: [High/Medium/Low]
- **Description**: [Detailed description]
- **Screenshot**: [Path to screenshot]
- **Contrast Ratio**: [If measured]
- **Recommended Fix**: [Suggested solution]
```

### Phase 8: Report Generation

#### Final Checklist Summary
- [ ] All components tested in dark mode
- [ ] All pages navigated and documented
- [ ] Screenshots organized and labeled
- [ ] Contrast ratios measured where possible
- [ ] Issues prioritized and documented
- [ ] Recommendations provided for each issue

#### Deliverables
1. **Screenshot Collection**: Organized visual documentation
2. **Issue Report**: Detailed findings with priorities
3. **Recommendations**: Specific fixes for each problem
4. **Accessibility Report**: WCAG compliance status

## Common Issues to Watch For

### High Priority Issues
- Text that's completely unreadable
- Icons that disappear entirely
- Critical navigation elements that blend in
- Form inputs that can't be seen

### Medium Priority Issues
- Low contrast text that's hard to read
- Borders that are barely visible
- Hover states that don't show properly
- Charts with poor color differentiation

### Low Priority Issues
- Subtle visual elements that could be improved
- Minor contrast improvements
- Polish items for better aesthetics

## Tools and Resources

### Browser Extensions
- Colour Contrast Analyser
- axe DevTools
- WAVE Web Accessibility Evaluator

### Online Tools
- WebAIM Contrast Checker
- Colour Contrast Analyser (Paciello Group)
- WCAG Color Contrast Checker

### Screenshot Tools
- Built-in browser screenshot tools
- Snipping Tool (Windows)
- Screenshot (macOS)
- Third-party tools like Lightshot or Greenshot

This comprehensive testing approach will ensure all aspects of the dark mode implementation are thoroughly evaluated and documented.
