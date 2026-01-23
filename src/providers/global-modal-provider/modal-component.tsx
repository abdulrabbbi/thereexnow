"use client";

import { useModal } from "@/hooks/use-modal";
import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material";

const GlobalModal = () => {
  const { modal, handleCloseModal } = useModal();

  return (
    <Dialog
      fullWidth
      open={modal.isOpen}
      onClose={handleCloseModal}
      {...modal.options}
    >
      {modal.title ? <DialogTitle className="hide-in-print">{modal.title}</DialogTitle> : null}

      <DialogContent>
        {/* Render the body component and pass handleCloseModal as a prop */}

        <Box pt={1}>{modal.body && modal.body({ handleCloseModal })}</Box>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalModal;
