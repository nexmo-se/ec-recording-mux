import IntroContainer from '../../components/IntroContainer';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../state';
import { ReactComponent as GoogleLogo } from './google-logo.svg';
import styles from './styles.module.css'
import { useEffect } from 'react';

export default function LoginPage() {
    const { signIn, user, isAuthReady } = useAppState();
    const navigate = useNavigate();

    const login = () => {
        signIn()
    };

    useEffect(() => {
      if (user && isAuthReady) {
        navigate('/');
      }
    }, [user, isAuthReady, navigate])


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