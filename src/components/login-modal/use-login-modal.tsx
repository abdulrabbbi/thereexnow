import useLocales from "@/hooks/use-locales";
import { useModal } from "@/hooks/use-modal";
import { LoginModal } from ".";

export function useLoginModal() {
  const { t } = useLocales();
  const { handleOpenModal } = useModal();

  const run = () => {
    handleOpenModal({
      title: t("GUEST_MODE"),
      body: (props) => <LoginModal handleClose={props.handleCloseModal} />,
    });
  };

  return {
    run,
  };
}
