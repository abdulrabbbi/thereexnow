import ButtonBase from "@mui/material/ButtonBase";
import { styled } from "@mui/material/styles";

import { carouselClasses } from "../classes";

import type { CarouselThumbProps } from "../types";

// ----------------------------------------------------------------------

export function CarouselThumb({
  sx,
  src,
  index,
  selected,
  className,
  mediaType,
  ...other
}: CarouselThumbProps) {
  const component = mediaType === "video" ? "video" : "img";
  return (
    <ThumbRoot
      selected={selected}
      className={carouselClasses.thumbs.item}
      sx={sx}
      {...other}
    >
      {mediaType === "video" ? (
        <video src={src} className={carouselClasses.thumbs.image} />
      ) : (
        <img
          alt={`carousel-thumb-${index}`}
          src={src}
          className={carouselClasses.thumbs.image}
        />
      )}
    </ThumbRoot>
  );
}

// ----------------------------------------------------------------------

const ThumbRoot = styled(ButtonBase, {
  shouldForwardProp: (prop: string) => !["selected", "sx"].includes(prop),
})<Pick<CarouselThumbProps, "selected">>(({ theme }) => ({
  width: 64,
  height: 64,
  opacity: 0.48,
  flexShrink: 0,
  cursor: "pointer",
  borderRadius: theme.shape.borderRadius * 1.25,
  transition: theme.transitions.create(["opacity", "box-shadow"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.short,
  }),
  [`& .${carouselClasses.thumbs.image}`]: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "inherit",
  },
  variants: [
    {
      props: { selected: true },
      style: {
        opacity: 1,
        boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
      },
    },
  ],
}));
