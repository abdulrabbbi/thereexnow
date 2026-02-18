import {
  Carousel,
  CarouselThumb,
  CarouselThumbs,
  useCarousel,
} from "@/components/carousel";
import { Iconify } from "@/components/iconify";
import { MediaType } from "@/types";
import { getAssetsUrl } from "@/utils";
import { Box, Button, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";

type Props = {
  id?: number;
  data: Array<MediaType>;
  onMirrorImage?: (id: number, index: number) => void;
};

export function ExerciseGallery({ id, data, onMirrorImage }: Props) {
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"));
  const carouselOptions = useMemo(
    () => ({
      thumbs: {
        axis: (smUp ? "y" : "x") as "x" | "y",
        slidesToShow: smUp ? 3.5 : 4.5,
      },
    }),
    [smUp]
  );

  const carousel = useCarousel(carouselOptions);

  if (!data?.length) {
    return null;
  }

  const index = carousel.dots.selectedIndex;
  const selected = data[index] ?? data[0];

  return (
    <>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <Carousel carousel={carousel} sx={{ borderRadius: 2, flex: 1 }}>
          {data.map((item, index) => (
            <Box
              key={index}
              sx={{
                width: 1,
                minWidth: 0,
                aspectRatio: "16 / 9",
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "grey.100",
                border: "0.5px solid #EAEAEA",
              }}
            >
              <Box
                {...(item.type === "video" ? { controls: true } : {})}
                alt={item.fileName}
                src={getAssetsUrl(item.url)}
                component={item.type === "image" ? "img" : "video"}
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  bgcolor: "black",
                  objectFit: "contain",
                  ...(item.mirror && { transform: "scaleX(-1)" }),
                }}
              />
            </Box>
          ))}
        </Carousel>

        <Box
          sx={{
            p: 0.5,
            borderRadius: 1.25,
            bgcolor: "background.paper",
            width: { xs: 1, sm: "auto" },
          }}
        >
          <CarouselThumbs
            sx={{
              width: { xs: 1, sm: "auto" },
              height: { xs: "auto", sm: "100%" },
              maxHeight: { sm: 400 },
            }}
            slotProps={{ disableMask: !smUp }}
            ref={carousel.thumbs.thumbsRef}
            options={carousel.options?.thumbs}
          >
            {data.map((item, index) => (
              <CarouselThumb
                key={index}
                index={index}
                mediaType={item.type}
                src={getAssetsUrl(item.url)}
                selected={index === carousel.thumbs.selectedIndex}
                onClick={() => carousel.thumbs.onClickThumb(index)}
                sx={{
                  width: { xs: 72, sm: 85 },
                  height: { xs: 72, sm: 85 },
                  border: "1px solid grey",
                  ...(item.mirror && { transform: "scaleX(-1)" }),
                }}
              />
            ))}
          </CarouselThumbs>
        </Box>
      </Stack>

      {onMirrorImage && typeof id === "number" && selected.type === "image" ? (
        <Stack alignItems="flex-end">
          <Button
            variant="soft"
            color="secondary"
            onClick={() => onMirrorImage(id, index)}
            startIcon={<Iconify icon="solar:flip-horizontal-line-duotone" />}
          >
            Mirror
          </Button>
        </Stack>
      ) : null}
    </>
  );
}
