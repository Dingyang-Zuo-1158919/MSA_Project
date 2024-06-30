import { Meta, StoryFn } from '@storybook/react';
import { ArrowProps, PrevArrow } from '../components/Arrows'; 

export default {
  // Title of the Storybook category
  title: 'Components/Arrows',
  // Component being documented
  component: PrevArrow, 
} as Meta;

// Template for rendering the component
const Template: StoryFn<ArrowProps> = (args:any) => <PrevArrow {...args} />;

// Story for the Previous arrow
export const Prev = Template.bind({});
Prev.args = {
  // Example style props
  style: { color: 'red', fontSize: '24px' },
  // Example onClick handler
  onClick: () => console.log('Previous arrow clicked'),
};

// Story for the Next arrow
export const Next = Template.bind({});
Next.args = {
  // Example style props
  style: { color: 'blue', fontSize: '24px' },
  // Example onClick handler
  onClick: () => console.log('Next arrow clicked'),
};