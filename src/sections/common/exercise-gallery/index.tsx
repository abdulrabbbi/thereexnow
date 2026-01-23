import {
  Carousel,
  CarouselThumb,
  CarouselThumbs,
  useCarousel,
} from "@/components/carousel";
import { Iconify } from "@/components/iconify";
import { MediaType } from "@/types";
import { getAssetsUrl } from "@/utils";
import { Box, Button, Stack } from "@mui/material";

type Props = {
  id?: number;
  data: Array<MediaType>;
  onMirrorImage?: (id: number, index: number) => void;
};

export function ExerciseGallery({ id, data, onMirrorImage }: Props) {
  const carousel = useCarousel({
    thumbs: {
      axis: "y",
      slidesToShow: 3.5,
    },
  });

  const index = carousel.dots.selectedIndex;
  const selected = data[index];

  return (
    <>
      <Stack direction="row">
        <Carousel carousel={carousel} sx={{ borderRadius: 2 }}>
          {data.map((item, index) => (
            <Box key={index} sx={{ position: "relative" }}>
              <Box
                controls
                alt={item.fileName}
                src={getAssetsUrl(item.url)}
                component={item.type === "image" ? "img" : "video"}
                sx={{
                  maxHeight: 360,
                  borderRadius: 1,
                  bgcolor: "black",
                  objectFit: "contain",
                  border: `0.5px solid #EAEAEA`,
                  aspectRatio: { xs: "3/4", sm: "16/10" },
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
          }}
        >
          <CarouselThumbs
            sx={{ height: 360 }}
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
                  width: 85,
                  height: 85,
                  border: "1px solid grey",
                  ...(item.mirror && { transform: "scaleX(-1)" }),
                }}
              />
            ))}
          </CarouselThumbs>
        </Box>
      </Stack>

      {onMirrorImage && selected.type === "image" ? (
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
