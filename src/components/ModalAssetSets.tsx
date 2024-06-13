import {Modal} from "antd";

type ModalAssetSetsProps = {
  visible: boolean;
  onClose: () => void;
}

const ModalAssetSets = ({visible, onClose}: ModalAssetSetsProps) => {
  return (
    <Modal visible={visible} onClose={onClose}>
      ModalAssetSets
    </Modal>
  );
};

export default ModalAssetSets;