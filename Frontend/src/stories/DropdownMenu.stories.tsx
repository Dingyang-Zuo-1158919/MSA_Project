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

const theme = createTheme(); 

const mockStore = {
  getState: () => ({
    auth: {
      userId: 2, 
    },
  } as RootState),
  subscribe: () => {},
  dispatch: action('dispatch'),
};

const Template: StoryFn = () => (
  <BrowserRouter>
    <Provider store={mockStore as any}>
      <ThemeProvider theme={theme}>
        <DropdownMenu />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>
);

export const Default = Template.bind({});