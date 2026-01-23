import {
  Carousel,
  CarouselThumb,
  CarouselThumbs,
  useCarousel,
} from "@/components/carousel";
import { Image } from "@/components/image";
import { getAssetsUrl } from "@/utils";
import { Box } from "@mui/material";

type Props = {
  data: Array<string>;
};

export function ProductGallery({ data }: Props) {
  const carousel = useCarousel({
    thumbs: {
      slidesToShow: "auto",
    },
  });

  return (
    <div>
      <Box sx={{ mb: 2.5, position: "relative" }}>
        <Carousel
          carousel={carousel}
          sx={{
            borderRadius: 2,
            bgcolor: "black",
            ul: {
              paddingInlineStart: 0,
            },
          }}
        >
          {data?.map((slide, index) => (
            <Image alt="" ratio="3/2" key={index} src={getAssetsUrl(slide)} />
          ))}
        </Carousel>
      </Box>

      <CarouselThumbs
        ref={carousel.thumbs.thumbsRef}
        options={carousel.options?.thumbs}
        slotProps={{ disableMask: true }}
        sx={{ width: 360 }}
      >
        {data?.map((item, index) => (
          <CarouselThumb
            key={index}
            index={index}
            src={getAssetsUrl(item)}
            selected={index === carousel.thumbs.selectedIndex}
            onClick={() => carousel.thumbs.onClickThumb(index)}
            // sx={{ width: 85, height: 85 }}
          />
        ))}
      </CarouselThumbs>
    </div>
  );
}
