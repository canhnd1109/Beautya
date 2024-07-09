import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { Box, IconButton, useMediaQuery } from "@mui/material";
import { useState } from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Chat from "./Chat/Chat";

const Layout = ({ children }) => {
  const [isChatOpen, setChatOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const handleToggleChat = () => {
    setChatOpen(!isChatOpen);
  };
  return (
    <Box
      sx={{
        backgroundColor: "var(--background, #FAF9F5);",
      }}
    >
      <Header />

      {children}

      {isChatOpen && <Chat onClose={handleToggleChat} />}

      {!isChatOpen && (
        <IconButton
          color="primary"
          style={{
            position: "fixed",
            bottom: isSmallScreen ? 24 : 48, // Adjust bottom position for small screens
            right: isSmallScreen ? 24 : 48,
            zIndex: 9999,
            opacity: 0.6,
          }}
          onClick={handleToggleChat}
        >
          <SupportAgentIcon sx={{ fontSize: isSmallScreen ? 60 : 100 }} />
        </IconButton>
      )}
      <Footer />
    </Box>
  );
};

export default Layout;
