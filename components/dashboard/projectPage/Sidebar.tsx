import styles from "./Sidebar.module.scss";
import Logo from "../../common/Logo";
import { Button, useTheme } from "@mui/material";
import { navbarLogoSize } from "@/util/constants";
import { useRouter } from "next/router";
import { ProjectSection } from "@/util/enums";
import { IconType } from "react-icons/lib";
import { Playfair_Display } from "next/font/google";

type Props = {
  projectSection: ProjectSection;
  setProjectSection: (section: ProjectSection) => void;
};

const listItemData: { section: ProjectSection; icon: IconType }[] = [];

const font = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const Sidebar = ({ projectSection, setProjectSection }: Props) => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <div
      className={`${styles.sidebar}`}
      style={{
        borderColor: theme.palette.grey300.main,
        backgroundColor: theme.palette.bgColor.main,
      }}
    >
      <div className={styles.logoWrapper}>
        <Logo color={theme.palette.textColor.main} fontSize={navbarLogoSize} />
      </div>
      <ul className={styles.menuItems}>
        {Object.values(ProjectSection).map((section) => (
          <li key={section} className={`${styles.menuItem}`}>
            <button
              className={styles.listItemBtn}
              onClick={() => {
                setProjectSection(section);
              }}
            >
              <span
                className={`${styles.itemText} ${font.className}`}
                style={
                  projectSection === section
                    ? {
                        backgroundColor: theme.palette.grey200.main,
                        color: theme.palette.grey600.main,
                      }
                    : {}
                }
              >
                {section}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          router.push("/dashboard");
        }}
        sx={{
          margin: "0 1rem",
          position: "absolute",
          bottom: "1rem",
          alignSelf: "center",
        }}
      >
        back to dashboard
      </Button>
    </div>
  );
};

export default Sidebar;
