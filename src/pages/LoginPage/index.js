import IntroContainer from '../../components/IntroContainer';
import { Button, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppState } from '../../state';
import { ReactComponent as GoogleLogo } from './google-logo.svg';
import styles from './styles.module.css'
import { useCallback, useEffect } from 'react';

export default function LoginPage() {
    const { signIn, user, isAuthReady, ecRender } = useAppState();
    const navigate = useNavigate();
    const location = useLocation();

    const login = useCallback(() => {
        signIn()
    }, [signIn]);

    useEffect(() => {
        if (user) {
            // Go back to previous url
            navigate(location?.state?.from || { pathname: '/' })
        }
    }, [user, navigate, location])

    useEffect(() => {
        if (ecRender) {
          login()
        }
      }, [ecRender, login])
    

    if (!isAuthReady || ecRender) {
        return null;
    }

    return (
        <IntroContainer>
            <Typography variant="h5" className={styles.gutterBottom}>
                Sign in to join a room
            </Typography>
            <Typography variant="body1">Sign in using your Google Account</Typography>
            <Button variant="contained" id={styles.googleButton} onClick={login} startIcon={<GoogleLogo />}>
                Sign in with Google
            </Button>
        </IntroContainer>
    )

}