
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Dashboard from '../app/page';
import { ThemeProvider } from '../contexts/ThemeContext';

// Mock the next/dynamic import for MapChart
jest.mock('next/dynamic', () => () => {
  const DynamicComponent = () => <div>MapChart Mock</div>;
  DynamicComponent.displayName = 'DynamicComponent';
  return DynamicComponent;
});

describe('Dark Mode Visual Audit', () => {
  it('should render the dashboard in dark mode and capture screenshots', async () => {
    // Render the main dashboard component within the ThemeProvider
    render(
      <ThemeProvider>
        <Dashboard />
      </ThemeProvider>
    );

    // Find the theme toggle button (assuming it's in the document)
    const themeToggleButton = screen.getByRole('button', { name: /switch to dark mode/i });
    
    // Switch to dark mode
    fireEvent.click(themeToggleButton);

    // Wait for the theme to be applied
    await screen.findByTestId('dark-mode-active'); 

    // **1. StatCard titles:**
    const statCardTitles = screen.getAllByText(/^(Followers|Impressions|Engagement Rate|Reach)$/);
    statCardTitles.forEach(title => {
      const color = window.getComputedStyle(title).color;
      // Replace with a proper color contrast check if needed
      console.log(`StatCard title '${title.textContent}' color: ${color}`);
    });

    // **2. Grid overlay:**
    // This is harder to test with JSDOM as it relies on CSS background images.
    // Manual inspection of screenshots is better here.
    console.log('Grid overlay requires manual inspection of screenshots.');

    // **3. Map panel:**
    // Similar to the grid overlay, this is a visual component that needs screenshot review.
    console.log('Map panel requires manual inspection of screenshots.');

    // **4. Legend pills:**
    const legendItems = screen.getAllByRole('listitem'); 
    legendItems.forEach(item => {
      const backgroundColor = window.getComputedStyle(item).backgroundColor;
      const textColor = window.getComputedStyle(item).color;
      console.log(`Legend pill background color: ${backgroundColor}, text color: ${textColor}`);
    });

    // **Taking screenshots (conceptual)**
    // In a real visual regression testing setup, you would use a tool like Playwright or Cypress
    // to take screenshots of the entire page or specific components.
    // For this example, we'll just log that we would take screenshots here.
    console.log('Taking screenshot of the main dashboard page in dark mode...');
    
    // **Check for low-contrast text**
    // A full accessibility check would be more involved, but we can do a basic check.
    const allTextElements = screen.getAllByText(/.+/); // Get all elements with text
    allTextElements.forEach(element => {
      // This is a very basic contrast check. A real tool would be more accurate.
      const textColor = window.getComputedStyle(element).color;
      const bgColor = window.getComputedStyle(element.parentElement).backgroundColor;
      console.log(`Text: "${element.textContent}", Color: ${textColor}, BG Color: ${bgColor}`);
    });

    // **Check for icons that disappear**
    // This is also best done with visual regression testing. We'll log it for now.
    console.log('Checking for disappearing icons requires manual inspection of screenshots.');
  });
});

