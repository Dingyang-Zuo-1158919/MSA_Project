import { Meta, StoryFn } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { action } from '@storybook/addon-actions';
import DropdownMenu from '../components/DropdownMenu'; // Adjust the import path as per your project structure
import { RootState } from '../Redux/store';

export default {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
} as Meta;

// Create a default MUI theme
const theme = createTheme();

// Mock Redux store with a getState function to simulate the state
const mockStore = {
  getState: () => ({
    auth: {
      // Simulated userId for authentication state
      userId: 2,
    },
  } as RootState),
  // Placeholder subscribe function
  subscribe: () => { },
  // Action for Storybook logging
  dispatch: action('dispatch'),
};

// Template component for Storybook
const Template: StoryFn = () => (
  <BrowserRouter>
    {/* Provide the mock Redux store */}
    <Provider store={mockStore as any}>
      <ThemeProvider theme={theme}>
        <DropdownMenu />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>
);

// Story for the default state of the DropdownMenu
export const Default = Template.bind({});