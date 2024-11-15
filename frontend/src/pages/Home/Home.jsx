import styles from './Home.module.css'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className={styles.home}>
      <nav className={styles.home_navbar}>
        <Link to="/login" className={styles.btn}>
          Login
        </Link>
        <Link to="/register" className={styles.btn}>
          Register
        </Link>
        {/* <Link to="/face-dection" className={styles.btn}>
        Face-Detected
        </Link> */}
      </nav>
      <ul id={styles.shape}>
        <li className={styles.square}></li>
        <li className={styles.circle}></li>
        <li className={styles.square}></li>
        <li className={styles.circle}></li>
        <li className={styles.circle}></li>
        <li className={styles.square}></li>
        <li className={styles.circle}></li>
        <li className={styles.square}></li>
        <li className={styles.gradiant_circle1}></li>
        <li className={styles.gradiant_circle2}></li>
        <li className={styles.gradiant_circle3}></li>
        <li className={styles.gradiant_circle4}></li>
      </ul>
      <div className={styles.hero_text}>
        <div className={styles.hero_heading}>
          WORK
          {/* <span className={styles.hero_heading_span}></span> */}
          PLACE
        </div>
        <div className={styles.hero_subtext}>Let the party begin!</div>
        <Link to="/login" className={styles.hero_cta}>
          LET'S GO
        </Link>
      </div>
    </div>
  )
}

export default Home
