import React from 'react'
import { Link } from 'react-router-dom'
import styles from './HeroSection.module.css'

export default function HeroSection() {
  return (
    <>
      <div className={styles.heroSection}>
        <div className={styles.leftPart}>
          <h1>Welcome to Apni Dukaan</h1>
          <p>Your One-Stop Solution for Daily Essentials. Shop Now and Enjoy Effortless!</p>
          <Link to="/categories"><button className={styles.exploreButton}>Explore Categories</button></Link>
        </div>

        <div className={styles.rightPart}>
          <img src="\images\hero.png" alt="hero" />
        </div>
      </div>
    </>
  )
}
