import styles from "./FoldingBoxesLoader.module.scss";

type Props = {};

const FoldingBoxesLoader = () => {
  return (
    <div className={styles.cubeWrapper}>
      <div className={styles.cubeFolding}>
        <span className={styles.leaf1}></span>
        <span className={styles.leaf2}></span>
        <span className={styles.leaf3}></span>
        <span className={styles.leaf4}></span>
        <span className={styles.leaf5}></span>
        <span className={styles.leaf6}></span>
        <span className={styles.leaf7}></span>
        <span className={styles.leaf8}></span>
        <span className={styles.leaf9}></span>
      </div>
    </div>
  );
};

export default FoldingBoxesLoader;
