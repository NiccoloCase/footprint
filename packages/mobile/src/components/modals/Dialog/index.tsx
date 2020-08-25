import React from "react";
import {View, StyleSheet} from "react-native";
import Modal from "react-native-modal";

interface DialogHelpers {
  closeModal: () => void;
}

interface DialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: (helpers: DialogHelpers) => React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  setIsOpen,
  children,
}) => {
  const closeModal = () => setIsOpen(false);

  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      onSwipeComplete={closeModal}>
      <View style={styles.dialogContent}>
        {children
          ? typeof children === "function"
            ? children({closeModal})
            : children
          : null}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  dialogContent: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
  },
});
