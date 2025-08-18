import React from 'react'
import SouthOutlinedIcon from '@mui/icons-material/SouthOutlined';
import type { Metadata } from "next";
import bgImg from "@/../public/Screen Shot 2020-03-12 at 9.26.39 AM.png"
import Image from "next/legacy/image";
import Aboutus from './Aboutus';
import styles from './aboutus.module.css';

export const metadata: Metadata = {
  title: "About Us | Upin",
  description: "Learn about Upin's mission to connect people in real life and build stronger communities",
};

const AboutUs = () => {
  return (
    <div className={styles.container}>
      <Image 
        src={bgImg}
        alt='Background pattern'
        layout='fill'
        objectFit='cover'
        className={styles.backgroundImage}
        priority
      />
      
      <div className={styles.content}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            <Aboutus />
          </h1>         
        </div>
        
        <div className={styles.subtitleSection}>
          <p className={styles.subtitle}>
            We believe we are one and we value the importance of connecting with people in real life.
          </p>
        </div>
        
        <div className={styles.contentCard}>
          <div className={styles.card}>
            <p className={styles.cardText}>
              <span className={styles.cardTitle}>Our Mission - </span>
              Upin is 100% fully committed to creating the best platform for keeping your real social life in one place. We create the best experience for hosting and joining local activities by making it more convenient, organized, and safe. Our mission is to create more real-life interaction by being able to create & join gatherings of people anywhere at any time. We are focused on creating more peace and oneness amongst each other by being more openly social. With Upin, you will never feel alone again.
            </p>
          </div>
        </div>
        
        <div className={styles.iconSection}>
          <SouthOutlinedIcon className={styles.icon}/>
        </div>
        
        <div className={styles.contentCard}>
          <div className={styles.card}>
            <p className={styles.cardText}>
              <span className={styles.cardTitle}>We Value & Provide - </span>
              Connection, Relationships, Community. Connection is key to growing in a community. It takes strong relationships to have strong community, and with strong community we grow together in power!
            </p>
          </div>
        </div>
        
        <div className={styles.iconSection}>
          <SouthOutlinedIcon className={styles.icon}/>
        </div>
        
        <div className={styles.contentCard}>
          <div className={styles.card}>
            <p className={styles.cardText}>
              <span className={styles.cardTitle}>Our Philosophy - </span>
              Stands behind living longer & stronger with more loving community & social interaction. We are backed by our philosophy, mission, & life guidelines at{' '}
              <span className={styles.underlineText}>All Is One Movement.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs