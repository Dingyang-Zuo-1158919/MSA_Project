import { Meta, StoryFn } from '@storybook/react';
import LoadingComponent, { Props } from '../components/LoadingComponent'; // Adjust the import path as per your project structure

export default {
  // Storybook title for the LoadingComponent stories
  title: 'Components/LoadingComponent',
  // Component being documented in Storybook
  component: LoadingComponent,
  argTypes: {
    // Storybook control for the 'message' prop (text input)
    message: { control: 'text' },
  },
} as Meta;

// Template component for Storybook
const Template: StoryFn<Props> = (args) => <LoadingComponent {...args} />;

// Story for the default state of the LoadingComponent
export const Default = Template.bind({});
Default.args = {
  // Default message prop value
  message: 'Loading...',
};