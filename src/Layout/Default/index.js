import { Box } from "@mui/system";
import { memo } from "react";
import styles from "./styles";
import RevampFooter from "../../component/Footer";
import Sidebar from "../../component/Sidebar";
import HeaderNew from "../../component/Header/HeaderNew";

const DefaultLayout = ({ withSideBar = true, children, customStyles = {} }) => {
  return (
    <Box sx={{ ...styles.wrapper, ...customStyles.wrapper }}>
      <Box sx={{ ...styles.wrapper, ...customStyles.wrapper }}>
        <HeaderNew />

        {withSideBar ? (
          <Box sx={{ minHeight: "100vh" }}>
            <Sidebar> {children} </Sidebar>
          </Box>
        ) : (
          <div style={{ overflow: "visible" }}>{children}</div>
        )}
        {/* <RevampFooter /> */}
      </Box>
    </Box>
  );
};

export default memo(DefaultLayout);
