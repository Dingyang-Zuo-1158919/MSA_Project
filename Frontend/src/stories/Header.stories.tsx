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
    isLoggedIn: { control: 'boolean' },
    darkMode: { control: 'boolean' },
  },
} as Meta;

const theme = createTheme(); 

const mockStore = (isLoggedIn: boolean) => ({
  getState: () => ({
    auth: {
      isLoggedIn,
      userName: isLoggedIn ? 'testuser' : '',
    },
  } as RootState),
  subscribe: () => {},
  dispatch: action('dispatch'),
});

const Template: StoryFn<HeaderProps> = (args) => {
  const { isLoggedIn, darkMode } = args;
  const handleThemeChange = () => {
    action('handleThemeChange')(true); 
  };

  return(
  <BrowserRouter>
    <Provider store={mockStore(isLoggedIn) as any}>
      <ThemeProvider theme={theme}>
        <Header {...args} darkMode={darkMode} handleThemeChange={handleThemeChange} />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>
);
};

export const Default = Template.bind({});
Default.args = {
  darkMode: false,
  handleThemeChange: () => {},
  isLoggedIn: false,
};