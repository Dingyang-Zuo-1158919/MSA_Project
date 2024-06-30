import { Button, ButtonGroup, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";

export default function DropdownMenu() {
    // State for managing menu open/close
    const [open, setOpen] = React.useState(false);
    // Reference for the anchor element (Button)
    const anchorRef = React.useRef<HTMLDivElement>(null);
    // State for tracking selected menu item index
    const [selectedIndex, setSelectedIndex] = React.useState(-1);
    // State for displaying selected menu item label
    const [selectedLabel, setSelectedLabel] = React.useState('Console');
    // Hook for navigation
    const navigate = useNavigate();
    // Hook for location
    const location = useLocation();
    // Get user information from Redux store
    const userId = useSelector((state: RootState) => state.auth.userId);
    // Dropdown menu options
    const options = [
        { label: 'My\u00A0Collection', path: `/mycollection/${userId}` },
        { label: 'My\u00A0Upload', path: `/myupload/${userId}` },
    ];

    // Effect to update selected label based on current path
    useEffect(() => {
        const currentPath = location.pathname;
        const isOptionPath = options.some(option => option.path === currentPath);
        setSelectedLabel(isOptionPath ? options.find(option => option.path === currentPath)?.label || 'Console' : 'Console');
    }, [location.pathname, options]);

    // Handle click on menu item
    const handleMenuItemClick = (
        _event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setOpen(false);
        setSelectedLabel(options[index].label);
        if (options[index].path) {
            navigate(options[index].path);
        }
    };

    // Handle toggle for opening/closing the menu
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    // Handle closing the menu when clicking away
    const handleClose = (event: Event) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpen(false);
    };

    return (
        <React.Fragment>
            <ButtonGroup
                variant="contained"
                ref={anchorRef}
                aria-label="Button group with a nested menu"
            >
                {/* Display selected label */}
                <Button>{selectedLabel}</Button>
                <Button
                    size="small"
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    onClick={handleToggle}
                >
                    {/* Dropdown icon */}
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            {/* Popper component for displaying the menu */}
            <Popper
                sx={{
                    zIndex: 1,
                }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal={false}
                placement="bottom-start"
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu" autoFocusItem>
                                    {options.map((option, index) => (
                                        <MenuItem
                                            key={option.label}
                                            selected={index === selectedIndex}
                                            onClick={(event) => handleMenuItemClick(event, index)}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </React.Fragment>
    )
}