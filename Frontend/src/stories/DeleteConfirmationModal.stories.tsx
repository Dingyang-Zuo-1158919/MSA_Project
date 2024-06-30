import { Meta, StoryFn } from '@storybook/react';
import { Button } from '@mui/material';
import DeleteConfirmationModal, { Props as DeleteConfirmationModalProps } from '../components/DeleteConfirmationModal'; // Adjust the import path as per your project structure
import { useState } from 'react';

export default {
  title: 'Components/DeleteConfirmationModal',
  component: DeleteConfirmationModal,
  argTypes: {
    // Storybook action logging for onConfirmDelete
    onConfirmDelete: { action: 'confirmed deletion' }, 
    // Storybook action logging for onClose
    onClose: { action: 'closed modal' },
  },
} as Meta;

// Template component for Storybook
const Template: StoryFn<DeleteConfirmationModalProps> = (args) => {
  const [open, setOpen] = useState(false);

  // Function to close the modal
  const handleClose = () => {
    setOpen(false);
    args.onClose(); 
  };

  // Function to open the modal
  const handleOpen = () => {
    setOpen(true);
  };

  // Function to handle confirmation of deletion
  const handleConfirmDelete = () => {
    // Trigger the onConfirmDelete action (for Storybook logging)
    args.onConfirmDelete(); 
    // Close the modal after confirmation
    handleClose(); 
  };

  return (
    <div>
      <Button onClick={handleOpen}>Open Delete Confirmation Modal</Button>
      <DeleteConfirmationModal {...args} open={open} onClose={handleClose} onConfirmDelete={handleConfirmDelete}/>
    </div>
  );
};

// Story for the default state of the DeleteConfirmationModal
export const Default = Template.bind({});
Default.args = {
  // Initial state of the modal (closed by default)
  open: false,
  // Placeholder function for confirming deletion
  onConfirmDelete: () => {}, 
};