import React from "react";
import { Box, Container, Grid, Typography, Link } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import Discord from "@mui/icons-material/Forum";

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: "#FFF",
        py: "50px",
        fontFamily: "Nohemi",
        zIndex: 99999,
      }}
    >
      <Container>
        <Grid container>
          {/* Logo and Description Section */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box component="img" src="/images/logo.svg" alt="videoNation" sx={{ height: 36 }} />
            </Box>
            <Typography variant="body2" sx={{ mb: 2, color: "#000" }}>
              The end-to-end platform for
              <br /> creators powered by AI
            </Typography>
            <Typography variant="body2" sx={{ color: "#000", fontSize: "0.875rem" }}>
              Crafted with ❤️ in India
            </Typography>
            <Typography variant="body2" sx={{ color: "#000", fontSize: "0.875rem" }}>
              © 2024 videoNation. All rights reserved.
            </Typography>
          </Grid>

          {/* Company Section */}
          <Grid item xs={12} md={2} sx={{ fontFamily: "Nohemi", fontSize: "16px" }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, color: "#000", fontFamily: "Nohemi", fontSize: "16px" }}
            >
              Company
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {["Privacy", "Terms & Conditions"].map((text) => (
                <Link
                  key={text}
                  href="#"
                  sx={{
                    color: "#000",
                    fontWeight: "400",
                    fontSize: "16px",
                    fontFamily: "Nohemi",
                    textDecoration: "none",
                    "&:hover": {
                      color: "#000",
                    },
                  }}
                >
                  {text}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Keep in touch Section */}
          <Grid item xs={12} md={2}>
            <Typography
              variant="h6"
              sx={{ mb: 2, color: "#000", fontFamily: "Nohemi", fontSize: "16px" }}
            >
              Keep in touch
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.6 }}>
              {[
                {
                  text: "Twitter",
                  icon: <TwitterIcon />,
                  link: "https://twitter.com/videoNation_official",
                },
                {
                  text: "Telegram",
                  icon: <TelegramIcon />,
                  link: "https://t.me/videoNationDiscussions",
                },
              ].map((item) => (
                <Link
                  key={item.text}
                  href={item?.link}
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    color: "#000",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "400",
                    fontSize: "16px",
                    fontFamily: "Nohemi",

                    gap: 1,
                    "&:hover": {
                      color: "#000",
                    },
                  }}
                >
                  {item.icon}
                  <Typography>{item.text}</Typography>
                </Link>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
