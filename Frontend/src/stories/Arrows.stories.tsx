import { Meta, StoryFn } from '@storybook/react';
import { ArrowProps, PrevArrow } from '../components/Arrows'; 

export default {
  title: 'Components/Arrows',
  component: PrevArrow, 
} as Meta;

const Template: StoryFn<ArrowProps> = (args:any) => <PrevArrow {...args} />;

export const Prev = Template.bind({});
Prev.args = {
  style: { color: 'red', fontSize: '24px' },
  onClick: () => console.log('Previous arrow clicked'),
};

export const Next = Template.bind({});
Next.args = {
  style: { color: 'blue', fontSize: '24px' },
  onClick: () => console.log('Next arrow clicked'),
};