import {Modal} from "antd";

type ModalAssetSetsProps = {
  visible: boolean;
  onClose: () => void;
}

const ModalAssetSets = ({visible, onClose}: ModalAssetSetsProps) => {
  return (
    <Modal
      title="Розміщення майна"
      open={visible}
      onCancel={onClose}
    >
      ModalAssetSets
    </Modal>
  );
};

export default ModalAssetSets;