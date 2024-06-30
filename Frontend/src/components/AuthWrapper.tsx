import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../Redux/Slices/authSlice';

export interface AuthWrapperProps {
    // Children components wrapped by AuthWrapper
    children: React.ReactNode; 
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
    // Hook for dispatching actions to Redux store
    const dispatch = useDispatch();

    useEffect(() => {
        // Check for stored token in localStorage
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
            // If token exists, dispatch login action to authenticate user
            dispatch(login({
                // Retrieve and parse user ID from localStorage
                userId: Number(localStorage.getItem('userId')),
                // Retrieve user name from localStorage
                userName: localStorage.getItem('userName')!,
                // Pass stored token to login action payload
                token: storedToken
            }));
        }
    }, [dispatch]);

    // Render children components
    return <>{children}</>;
};

export default AuthWrapper;