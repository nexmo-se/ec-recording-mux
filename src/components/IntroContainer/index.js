import React from 'react';
import { Typography } from '@mui/material';
import styles from './styles.module.css'

export default function IntroContainer(props) {

    return (
        <div className={styles.background}>
          <div className={styles.container}>
            <div className={styles.innerContainer}>
              <div className={styles.swooshContainer}>
                <div className={styles.logoContainer}>
                  <Typography variant="h6" className={styles.title}>
                    Mux Real-Time Video
                  </Typography>
                </div>
              </div>
              <div className={styles.content}>{props.children}</div>
            </div>
          </div>
        </div>
      );

}