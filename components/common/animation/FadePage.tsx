import { ReactElement, useEffect, useState } from "react";
import styles from "./FadePage.module.scss";

interface FadePageProps {
  children: ReactElement;
}

const FadePage = ({ children }: FadePageProps) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className={`${styles.fadePage} ${visible && styles.pageVisible}`}>
      {children}
    </div>
  );
};

export default FadePage;
