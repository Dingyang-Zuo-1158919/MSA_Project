import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../Redux/Slices/authSlice';

export interface AuthWrapperProps {
    children: React.ReactNode; 
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
            dispatch(login({
                userId: Number(localStorage.getItem('userId')),
                userName: localStorage.getItem('userName')!,
                token: storedToken
            }));
        }
    }, [dispatch]);

    return <>{children}</>;
};

export default AuthWrapper;