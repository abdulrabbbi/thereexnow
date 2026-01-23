import { ConfirmDialog } from "@/components/custom-dialog";
import { useGetTranslatedRoutine } from "@/hooks/helpers/translated-hooks";
import useLocales from "@/hooks/use-locales";
import { useShare } from "@/hooks/use-share";
import { ListItemButton, Skeleton, Stack } from "@mui/material";

type Props = {
  open: boolean;
  routineId: number;
  onClose: VoidFunction;
};

export function RoutineShareDialog({ open, onClose, routineId }: Props) {
  const share = useShare();
  const { t } = useLocales();

  const { routineData: routine, routineLoading } = useGetTranslatedRoutine(
    Number(routineId)
  );

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={t("SHARE_WITH")}
      content={
        <Stack
          minHeight={56}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          {routineLoading ? (
            <>
              {Array(3)
                .fill(0)
                .map((item, index) => (
                  <Skeleton
                    key={index}
                    variant="rounded"
                    sx={{ width: 56, height: 56, borderRadius: 1 }}
                  />
                ))}
            </>
          ) : (
            <>
              <Button
                disabled={!routine}
                icon={share.email.icon}
                onClick={() =>
                  share.email.onClick({
                    note: routine?.description,
                    exercises: routine?.routineExercises as Array<any>,
                  })
                }
              />
              <Button
                disabled={!routine}
                icon={share.print.icon}
                onClick={() =>
                  share.print.onClick({
                    note: routine?.description,
                    exercises: routine?.routineExercises as Array<any>,
                  })
                }
              />
              <Button
                disabled={!routine}
                icon={share.qrCode.icon}
                onClick={() =>
                  share.qrCode.onClick({
                    note: routine?.description,
                    exercises: routine?.routineExercises as Array<any>,
                  })
                }
              />
            </>
          )}
        </Stack>
      }
      cancelProps={{ fullWidth: true, color: "inherit" }}
    />
  );
}

type ButtonProps = {
  icon: any;
  disabled?: boolean;
  onClick: VoidFunction;
};

function Button({ icon, onClick, disabled }: ButtonProps) {
  return (
    <Stack alignItems="center">
      <ListItemButton
        onClick={onClick}
        disabled={disabled}
        sx={{
          p: 0,
          minWidth: 56,
          minHeight: 56,
          display: "flex",
          borderRadius: 1,
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #CCC",
          bgcolor: "secondary.lighter",
        }}
      >
        {icon}
      </ListItemButton>
    </Stack>
  );
}
