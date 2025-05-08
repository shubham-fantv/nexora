const styles = {
  wrapper: {
    display: "flex",
    width: "100%",

    "& .allmargin": {
      marginTop: "40px",
      "@media(max-width:668px)": {
        marginTop: "25px",
      },
    },
  },
  sidebar: {
    display: "flex",
    width: "272px",
    flexDirection: "column",
    flex: "0 0 272px",
    height: "auto",
    position: "fixed",
    height: "100vh",
    overflow: "auto",
    paddingBottom: "40px",
    // borderRight: (theme) => ({ xs: theme.palette.borderRight.borderNav }),
    "@media(max-width:668px)": {
      position: "fixed",
      bottom: "0",
      width: "100%",
      zIndex: "99",
      display: "none",
    },
  },

  mainWrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginTop: "0px",
    minHeight: "100vh",
    // overflow: "clip",
    marginLeft: "270px",
    paddingRight: "32px",
    "@media(max-width:767px)": {
      marginLeft: "15px",
      // marginRight: "10px",
    },
  },
  contentFavtv: {
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    "@media(max-width:668px)": {
      padding: "0px",
    },
  },
};

export default styles;
