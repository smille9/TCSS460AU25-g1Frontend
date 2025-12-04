import Link from 'next/link';
import styles from './MovieShowCard.module.css';

export interface MovieShowCardProps {
  name: string;
  subtext: string;
  imgUrl: string;
  link: string;
}

export default function MovieShowCard({name, subtext, imgUrl, link}: MovieShowCardProps) {
  return (
    <div className={styles.posterContainer}>
      <div className={styles.posterArea}>
        <img
          src={imgUrl}
          alt={`Image of ${name}`}
          width="125"
          height="188"
        />
      </div>
      <div className={styles.posterTitle}>
        <div className={styles.titleText}>{name}</div>
        <div className={styles.subtext}>{subtext}</div>
      </div>
      <Link className={styles.cardLink} href={link}></Link>
    </div>
  );
}
