import { Meta, StoryFn } from '@storybook/react';
import LoadingComponent, { Props } from '../components/LoadingComponent'; // Adjust the import path as per your project structure

export default {
  title: 'Components/LoadingComponent',
  component: LoadingComponent,
  argTypes: {
    message: { control: 'text' },
  },
} as Meta;

const Template: StoryFn<Props> = (args) => <LoadingComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
  message: 'Loading...',
};