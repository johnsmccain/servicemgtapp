"use client"

import { Box, Typography, Container, Link } from "@mui/material"
import { GitHub, LinkedIn, Twitter } from "@mui/icons-material"

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: "primary.main",
        py: 3, 
        color: "white",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="h6" component="h3" align="center">
            Footer
          </Typography>

          {/* Social media links */}
          <Box sx={{ display: "flex", gap: 2, my: 1 }}>
            <Link href="#" color="inherit" aria-label="GitHub">
              <GitHub />
            </Link>
            <Link href="#" color="inherit" aria-label="LinkedIn">
              <LinkedIn />
            </Link>
            <Link href="#" color="inherit" aria-label="Twitter">
              <Twitter />
            </Link>
          </Box>

          <Typography variant="body2" align="center">
            &copy; {currentYear} by Feyishola. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

