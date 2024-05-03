import * as React from "react";
import { useBoolean } from "@fluentui/react-hooks";
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog";
import { DefaultButton, PrimaryButton } from "@fluentui/react";
import styles from "./Chat.module.css";

const modalPropsStyles = { main: { minWidth: "70vw" } };
const dialogContentProps = {
  type: DialogType.normal,
  title: "Update System Message",
  subText:
    "Updating the system message will start a new chat session. Previous messages won't be included in new API requests.",
};

export const ConfirmDialog = (props: any) => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(!props.open);
  const modalProps = React.useMemo(
    () => ({
      isBlocking: true,
      styles: {
        main: styles.systemMessageConfirmDialog,
      },
    }),
    []
  );

  return (
    <Dialog
      hidden={hideDialog}
      onDismiss={toggleHideDialog}
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
    >
      <DialogFooter>
        <DefaultButton
          onClick={() => {
            props.onCancel();
          }}
          text="Cancel"
        />
        <PrimaryButton
          onClick={() => {
            props.onContinue();
          }}
          text="Continue"
        />
      </DialogFooter>
    </Dialog>
  );
};
