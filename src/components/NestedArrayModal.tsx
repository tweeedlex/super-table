import { Modal, Button } from 'antd';

type NestedArrayModalProps = {
  visible: boolean;
  onClose: () => void;
  nestedItems: { value: number, isActive: boolean }[];
};

const NestedArrayModal = ({ visible, onClose, nestedItems }: NestedArrayModalProps) => {
  return (
    <Modal
      title="Nested Array Data"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
    >
      {nestedItems.map((nestedItem, index) => (
        <div key={index} style={{ display: 'flex', marginBottom: '8px' }}>
          <div style={{ width: '100px', padding: '8px' }}>{nestedItem.value}</div>
        </div>
      ))}
    </Modal>
  );
};

export default NestedArrayModal;
