import { Modal } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

interface SuccessModalProps {
  open: boolean;
  message: string;
  buttonActions: JSX.Element;
  modalImage?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  message,
  buttonActions,
}) => {
  return (
    <Modal open={open} className="modalOuterContainer">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="modalInnerContainer modalBgColor shadow-lg relative"
      >
        <div className="flex justify-center">
          <Image
            src="/success.svg"
            width={250}
            height={250}
            alt="modal-image"
          />
        </div>
        <div>
          <div className="flex flex-col gap-">
            <h1 className="text-xl verdanaFont text-center darkCharcoal">
              SUCCESS!
            </h1>
            <h3 className="robotoFont text-sm m-6 text-gray-500">
              {message}
              {/* Your exercise template has been saved successfully. You can now
              re-use this template to log your exercises next time! */}
            </h3>
          </div>
          <div className="mt-2 flex flex-col gap-4 px-4 items-center">
            {buttonActions}
          </div>
        </div>
      </motion.div>
    </Modal>
  );
};

export default SuccessModal;
