import styles from "./Sidebar.module.scss";
import Logo from "../../common/Logo";
import { Source_Sans_3 } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { navbarLogoSize } from "@/util/constants";
import { ProjectSection } from "@/util/enums";
import { IconType } from "react-icons/lib";
import { AiOutlineCamera } from "react-icons/ai";
import { CgLoadbarSound } from "react-icons/cg";
import { BsLink45Deg } from "react-icons/bs";
import { BiColorFill } from "react-icons/bi";

type Props = {
  projectSection: ProjectSection;
  setProjectSection: (section: ProjectSection) => void;
};

const listItemData: { section: ProjectSection; icon: IconType }[] = [
  { section: ProjectSection.IMAGES, icon: AiOutlineCamera },
  { section: ProjectSection.LINKS, icon: BsLink45Deg },
  { section: ProjectSection.PALETTE, icon: BiColorFill },
  { section: ProjectSection.MUSIC, icon: CgLoadbarSound },
];

const font = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const Sidebar = ({ projectSection, setProjectSection }: Props) => {
  const theme = useTheme();
  const router = useRouter();

  const [minimized, setMinimized] = useState(false);

  const handleResize = () => {
    if (window.innerWidth <= 800) {
      setMinimized(true);
    } else {
      setMinimized(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={`${styles.sidebar} ${minimized && styles.sidebarMinimized}`}
      style={{
        borderColor: theme.palette.grey300.main,
        backgroundColor: theme.palette.bgColor.main,
      }}
    >
      <div className={styles.logoWrapper}>
        <Logo
          color={theme.palette.textColor.main}
          fontSize={navbarLogoSize}
          hideText={minimized}
        />
      </div>
      <ul className={styles.menuItems}>
        {listItemData.map((section) => (
          <li
            key={section.section}
            className={`${styles.menuItem} ${
              minimized && styles.menuItemMinimized
            }`}
          >
            <button
              className={styles.listItemBtn}
              onClick={() => {
                setProjectSection(section.section);
              }}
            >
              <span
                className={`${styles.itemText} ${font.className}`}
                style={
                  projectSection === section.section
                    ? {
                        backgroundColor: theme.palette.grey100.main,
                        color: theme.palette.grey500.main,
                      }
                    : {}
                }
              >
                {<section.icon size={20} />}
                {!minimized && section.section}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {/* {minimized ? (
        <IconButton
          sx={{
            margin: "0 1rem",
            position: "absolute",
            bottom: "1rem",
            alignSelf: "center",
          }}
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          <HiArrowLeft />
        </IconButton>
      ) : (
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
      )} */}
    </div>
  );
};

export default Sidebar;
