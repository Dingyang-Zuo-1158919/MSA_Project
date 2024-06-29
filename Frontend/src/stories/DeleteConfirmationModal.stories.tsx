import { Meta, StoryFn } from '@storybook/react';
import { Button } from '@mui/material';
import DeleteConfirmationModal, { Props as DeleteConfirmationModalProps } from '../components/DeleteConfirmationModal'; // Adjust the import path as per your project structure
import { useState } from 'react';

export default {
  title: 'Components/DeleteConfirmationModal',
  component: DeleteConfirmationModal,
  argTypes: {
    onConfirmDelete: { action: 'confirmed deletion' }, 
    onClose: { action: 'closed modal' },
  },
} as Meta;

const Template: StoryFn<DeleteConfirmationModalProps> = (args) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    args.onClose(); 
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleConfirmDelete = () => {
    args.onConfirmDelete(); 
    handleClose(); 
  };

  return (
    <div>
      <Button onClick={handleOpen}>Open Delete Confirmation Modal</Button>
      <DeleteConfirmationModal {...args} open={open} onClose={handleClose} onConfirmDelete={handleConfirmDelete}/>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  open: false,
  onConfirmDelete: () => {}, 
};