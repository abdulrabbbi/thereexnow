import {
  EmailSvgIcon,
  PrintSvgIcon,
  QRCodeSvgIcon,
} from "@/assets/icons/share-icons";
import { useLoginModal } from "@/components/login-modal/use-login-modal";
import { ShareDialog } from "@/components/share-dialogs";
import { SimplifiedExercise } from "@/types";
import useLocales from "./use-locales";
import { useModal } from "./use-modal";
import { useUser } from "./use-user";

type NavIconProps = {
  size?: number;
  color?: string;
  icon: string;
};

type Props = {
  note?: string;
  exercises: Array<SimplifiedExercise>;
};

export function useShare() {
  const { t } = useLocales();
  const { userData } = useUser();
  const withLoginModal = useLoginModal();
  const { handleOpenModal } = useModal();

  const emailIcon = (props?: Omit<NavIconProps, "icon">) => {
    return <EmailSvgIcon />;
  };

  const printIcon = (props?: Omit<NavIconProps, "icon">) => {
    return <PrintSvgIcon />;
  };

  const qrCodeIcon = (props?: Omit<NavIconProps, "icon">) => {
    return <QRCodeSvgIcon />;
  };

  const handleEmail = ({ note, exercises }: Props) => {
    if (!userData) {
      return withLoginModal.run();
    }

    handleOpenModal({
      title: "Share via email",
      body: (props) => (
        <ShareDialog.email
          note={note}
          exercises={exercises}
          handleClose={props.handleCloseModal}
        />
      ),
      options: {
        maxWidth: "sm",
      },
    });
  };

  const handlePrint = ({ note, exercises }: Props) => {
    if (!userData) {
      return withLoginModal.run();
    }

    handleOpenModal({
      title: t("PRINT"),
      body: (props) => (
        <ShareDialog.print
          note={note}
          exercises={exercises}
          handleClose={props.handleCloseModal}
        />
      ),
      options: {
        maxWidth: "md",
      },
    });
  };

  const handleQrCode = ({ note, exercises }: Props) => {
    if (!userData) {
      return withLoginModal.run();
    }

    handleOpenModal({
      title: "QR Code",
      body: (props) => (
        <ShareDialog.qrCode
          note={note}
          exercises={exercises}
          handleClose={props.handleCloseModal}
        />
      ),
      options: {
        maxWidth: "sm",
      },
    });
  };

  return {
    email: {
      title: t("EMAIL"),
      icon: emailIcon(),
      onClick: handleEmail,
    },
    print: {
      title: t("PRINT"),
      icon: printIcon(),
      onClick: handlePrint,
    },
    qrCode: {
      title: t("QR_CODE"),
      icon: qrCodeIcon(),
      onClick: handleQrCode,
    },
  };
}
