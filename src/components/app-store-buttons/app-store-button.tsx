import {
  alpha,
  Box,
  Button,
  buttonClasses,
  ButtonProps,
  styled,
} from "@mui/material";
import { Iconify } from "../iconify";

type StyledButtonProps = ButtonProps & {
  title: string;
  caption: string;
};

const StyledButton = styled(
  ({ title, caption, ...other }: StyledButtonProps) => (
    <Button {...other}>
      <div>
        <Box
          component="span"
          sx={{
            opacity: 0.72,
            display: "block",
            textAlign: "left",
            typography: "caption",
            fontSize: 10,
          }}
        >
          {caption}
        </Box>

        <Box
          component="span"
          sx={{ mt: -0.5, typography: "body1", fontSize: 13 }}
        >
          {title}
        </Box>
      </div>
    </Button>
  )
)(({ theme }) => ({
  flexShrink: 0,
  padding: "5px 12px",
  color: theme.palette.common.white,
  border: `solid 1px ${alpha(theme.palette.common.black, 0.24)}`,
  background: `linear-gradient(180deg, ${theme.palette.grey[900]}, ${theme.palette.common.black})`,
  [`& .${buttonClasses.startIcon}`]: {
    marginLeft: 0,
  },
}));

const AppStoreButtons = () => (
  <Box
    sx={{
      gap: 1.5,
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
    }}
  >
    <a
      target="_blank"
      href="https://apps.apple.com/us/app/therexnow/id6447003398"
    >
      <StyledButton
        title="Apple Store"
        caption="Download on the"
        startIcon={<Iconify width={21} icon="ri:apple-fill" />}
      />
    </a>

    <a
      target="_blank"
      href="https://play.google.com/store/apps/details?id=com.therexnow&utm_source=na_Med"
    >
      <StyledButton
        title="Google Play"
        caption="Download from"
        startIcon={<Iconify width={21} icon="logos:google-play-icon" />}
      />
    </a>
  </Box>
);

export default AppStoreButtons;
