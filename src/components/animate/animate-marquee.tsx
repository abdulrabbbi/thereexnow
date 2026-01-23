import { Box, BoxProps, Typography, TypographyProps } from "@mui/material";
import { m } from "framer-motion";
import React, { ReactNode } from "react";

interface MarqueeProps {
  text: string | ReactNode;
  slotProps?: {
    box?: BoxProps;
    typography?: TypographyProps;
  };
}

const AnimateMarquee: React.FC<MarqueeProps> = ({ text, slotProps }) => {
  const marqueeVariants = {
    animate: {
      x: ["100%", "-100%"],
      transition: {
        x: {
          duration: 10,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      },
    },
  };

  return (
    <Box
      {...slotProps?.box}
      sx={{
        width: "100%",
        overflow: "hidden",
        whiteSpace: "nowrap",
        ...slotProps?.box?.sx,
      }}
    >
      <m.div animate="animate" className="track" variants={marqueeVariants}>
        <Typography variant="body1" fontWeight={600} {...slotProps?.typography}>
          {text}
        </Typography>
      </m.div>
    </Box>
  );
};

export default AnimateMarquee;
