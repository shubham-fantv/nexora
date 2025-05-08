import { Box } from "@mui/material";
import { memo } from "react";
import useIsMobile from "../../hooks/useIsMobile";
import styles from "./style";

const HeaderNew = ({ app }) => {
  const isMobile = useIsMobile(app?.deviceParsedInfo?.device?.isMobile);

  return (
    <>
      <Box sx={styles.navbar} onClick={(e) => e.stopPropagation()}>
        <Box className="nav-container">
          <Box display="flex">
            <Box
              className="nav-logo"
              onClick={() => window?.open("/", "_self", "noopener,noreferrer")}
            >
              {isMobile ? (
                <Box className="fan__TigerMobileLogo">
                  <img
                    src={"/images/logo.svg"}
                    alt="mobile FanTV logo"
                    loading="eager"
                    decoding="async"
                  />
                </Box>
              ) : (
                <Box>
                  <img
                    src={"/images/logo.svg"}
                    alt="FanTV Logo"
                    width={40}
                    loading="eager"
                    decoding="async"
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default memo(HeaderNew);
