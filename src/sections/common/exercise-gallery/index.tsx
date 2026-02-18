import { Iconify } from "@/components/iconify";
import { Image } from "@/components/image";
import { Player } from "@/components/player";
import { MediaType } from "@/types";
import { getAssetsUrl } from "@/utils";
import { Box, Button, ButtonBase, Stack } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

type Props = {
  id?: number;
  data: Array<MediaType>;
  onMirrorImage?: (id: number, index: number) => void;
};

export function ExerciseGallery({ id, data, onMirrorImage }: Props) {
  const mediaItems = useMemo(
    () =>
      (data ?? []).map((item, index) => ({
        ...item,
        key: `${item.type}-${item.url}-${index}`,
        src: getAssetsUrl(item.url),
      })),
    [data]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [imageFitMode, setImageFitMode] = useState<"contain" | "cover">(
    "contain"
  );

  useEffect(() => {
    if (!mediaItems.length) {
      return;
    }

    if (activeIndex > mediaItems.length - 1) {
      setActiveIndex(0);
    }
  }, [activeIndex, mediaItems.length]);

  useEffect(() => {
    setImageFitMode("contain");
  }, [activeIndex]);

  const handleThumbClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleToggleImageFit = useCallback(() => {
    setImageFitMode((prev) => (prev === "contain" ? "cover" : "contain"));
  }, []);

  if (!mediaItems.length) {
    return null;
  }

  const selected = mediaItems[activeIndex] ?? mediaItems[0];
  const selectedTransform = selected.mirror ? "scaleX(-1)" : undefined;
  const previewAspectRatio =
    selected.type === "video"
      ? { xs: "16 / 9", sm: "16 / 9", md: "16 / 9" }
      : { xs: "4 / 3", sm: "16 / 9", md: "16 / 9" };
  const imageInset =
    imageFitMode === "cover"
      ? { xs: 0.5, sm: 0.75, md: 1 }
      : { xs: 1, sm: 1.25, md: 1.5 };

  return (
    <>
      <Box sx={{ width: 1, minWidth: 0 }}>
        <Box
          sx={{
            width: 1,
            maxWidth: "100%",
            aspectRatio: previewAspectRatio,
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
            bgcolor: "grey.50",
            border: "0.5px solid #EAEAEA",
          }}
        >
          {selected.type === "image" ? (
            <Button
              size="small"
              variant="outlined"
              onClick={handleToggleImageFit}
              sx={{
                top: 8,
                right: 8,
                zIndex: 2,
                minWidth: 0,
                px: 1.25,
                py: 0.25,
                position: "absolute",
                bgcolor: "background.paper",
              }}
            >
              {imageFitMode === "contain" ? "Fill" : "Fit"}
            </Button>
          ) : null}

          {selected.type === "image" ? (
            <Box
              sx={{
                position: "absolute",
                inset: imageInset,
                borderRadius: 1.5,
                overflow: "hidden",
                bgcolor: "grey.100",
              }}
            >
              <Image
                visibleByDefault
                disablePlaceholder
                alt={selected.fileName ?? `exercise-media-${activeIndex}`}
                src={selected.src}
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: 1,
                  height: 1,
                  display: "block",
                }}
                slotProps={{
                  img: {
                    style: {
                      objectFit: imageFitMode,
                      objectPosition: "center",
                      transform: selectedTransform,
                    },
                  },
                }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                transform: selectedTransform,
                transformOrigin: "center",
                bgcolor: "black",
              }}
            >
              <Player
                controls
                playsinline
                width="100%"
                height="100%"
                url={selected.src}
              />
            </Box>
          )}
        </Box>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            mt: 1,
            pb: 0.5,
            width: 1,
            minWidth: 0,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {mediaItems.map((item, index) => {
            const thumbTransform = item.mirror ? "scaleX(-1)" : undefined;

            return (
              <ButtonBase
                key={item.key}
                onClick={() => handleThumbClick(index)}
                sx={(theme) => ({
                  width: { xs: 64, sm: 72, md: 84 },
                  height: { xs: 64, sm: 72, md: 84 },
                  flexShrink: 0,
                  borderRadius: 1.25,
                  overflow: "hidden",
                  scrollSnapAlign: "start",
                  border: `2px solid ${
                    index === activeIndex
                      ? theme.palette.primary.main
                      : theme.palette.divider
                  }`,
                  boxShadow:
                    index === activeIndex
                      ? `0 0 0 1px ${theme.palette.primary.main}`
                      : "none",
                  bgcolor: "grey.100",
                })}
              >
                {item.type === "image" ? (
                  <Image
                    visibleByDefault
                    disablePlaceholder
                    alt={item.fileName ?? `exercise-thumb-${index}`}
                    src={item.src}
                    sx={{ width: 1, height: 1, display: "block" }}
                    slotProps={{
                      img: {
                        style: {
                          objectFit: "cover",
                          transform: thumbTransform,
                        },
                      },
                    }}
                  />
                ) : (
                  <Box
                    muted
                    preload="metadata"
                    playsInline
                    component="video"
                    src={item.src}
                    sx={{
                      width: 1,
                      height: 1,
                      objectFit: "cover",
                      transform: thumbTransform,
                      bgcolor: "black",
                    }}
                  />
                )}
              </ButtonBase>
            );
          })}
        </Stack>
      </Box>

      {onMirrorImage && typeof id === "number" && selected.type === "image" ? (
        <Stack alignItems="flex-end">
          <Button
            variant="soft"
            color="secondary"
            onClick={() => onMirrorImage(id, activeIndex)}
            startIcon={<Iconify icon="solar:flip-horizontal-line-duotone" />}
          >
            Mirror
          </Button>
        </Stack>
      ) : null}
    </>
  );
}
