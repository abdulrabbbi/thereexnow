import { ConfirmDialog } from "@/components/custom-dialog";
import {
  Routines,
  useRoutine_DeleteRoutineMutation,
} from "@/graphql/generated";
import useLocales from "@/hooks/use-locales";
import { Button } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  open: boolean;
  routine: Routines;
  onClose: VoidFunction;
};

export function RoutineRemoveDialog({ open, onClose, routine }: Props) {
  const { t } = useLocales();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useRoutine_DeleteRoutineMutation();

  const onRemove = () => {
    mutate(
      { id: routine.id },
      {
        onSuccess: (res) => {
          if (res.routine_deleteRoutine?.status.code === 1) {
            queryClient.invalidateQueries({
              queryKey: ["routine_getRoutines"],
            });

            onClose();
          } else {
            toast.warning(res.routine_deleteRoutine?.status.value);
          }
        },
      }
    );
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={t("DELETE")}
      content={t("ARE_YOU_SURE_YOU_WANT_DELETE")}
      cancelProps={{ fullWidth: true, color: "inherit" }}
      action={
        <Button fullWidth onClick={onRemove} loading={isPending}>
          {t("DELETE")}
        </Button>
      }
    />
  );
}
