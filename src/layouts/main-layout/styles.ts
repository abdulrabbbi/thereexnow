import { Container, styled } from "@mui/material";

export const DesktopNavRoot = styled(Container)(({ theme }) => ({
  width: "100%",
  display: "flex",
  padding: "0 16px",
  alignItems: "center",
  justifyContent: "space-between",
  position: "relative",
}));
