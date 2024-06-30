import { Box, Button, Modal, Typography } from "@mui/material";

export interface Props {
    // Controls whether the modal is open or closed
    open: boolean;
    // Callback function to handle modal close
    onClose: () => void;
    // Callback function to handle delete confirmation
    onConfirmDelete: () => void;
}

export default function DeleteConfirmationModal({open, onClose, onConfirmDelete}:Props){
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="delete-confirmation-modal"
            aria-describedby="confirm-delete-scenery"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
            }}>
                {/* Modal content */}
                <Typography variant="h6" gutterBottom>
                    Confirm Delete
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Are you sure you want to delete this scenery?
                </Typography>
                {/* Buttons for cancel and delete actions */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={onClose} color="primary" sx={{ mr: 2 }}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}