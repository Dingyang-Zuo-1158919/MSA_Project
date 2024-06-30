import { Meta, StoryFn } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { action } from '@storybook/addon-actions';
import Header, { HeaderProps } from '../components/Header';
import { RootState } from '../Redux/store';

export default {
  title: 'Components/Header',
  component: Header,
  argTypes: {
    // Storybook control for isLoggedIn prop (boolean toggle)
    isLoggedIn: { control: 'boolean' },
    // Storybook control for darkMode prop (boolean toggle)
    darkMode: { control: 'boolean' },
  },
} as Meta;

// Create a default MUI theme
const theme = createTheme(); 

// Mock Redux store generator function
const mockStore = (isLoggedIn: boolean) => ({
  getState: () => ({
    auth: {
      // Simulated isLoggedIn state
      isLoggedIn,
      // Simulated userName based on isLoggedIn state
      userName: isLoggedIn ? 'testuser' : '',
    },
  } as RootState),
  // Placeholder subscribe function
  subscribe: () => {},
  // Action for Storybook logging
  dispatch: action('dispatch'),
});

// Template component for Storybook
const Template: StoryFn<HeaderProps> = (args) => {
  const { isLoggedIn, darkMode } = args;
  // Placeholder function for handling theme change
  const handleThemeChange = () => {
    // Log theme change action in Storybook
    action('handleThemeChange')(true); 
  };

  return(
  <BrowserRouter>
    {/* Provide the mock Redux store */}
    <Provider store={mockStore(isLoggedIn) as any}>
      <ThemeProvider theme={theme}>
        <Header {...args} darkMode={darkMode} handleThemeChange={handleThemeChange} />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>
);
};

// Story for the default state of the Header component
export const Default = Template.bind({});
Default.args = {
  darkMode: false,
  handleThemeChange: () => {},
  isLoggedIn: false,
};