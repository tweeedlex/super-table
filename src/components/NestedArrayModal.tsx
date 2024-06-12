import {Modal, Button, Input} from 'antd';

type NestedArrayModalProps = {
  visible: boolean;
  onClose: () => void;
  nestedItems: { value: number, isActive: boolean }[];
};

const NestedArrayModal = ({ visible, onClose, nestedItems }: NestedArrayModalProps) => {
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
      width={800}
    >
      <div className="table-wrapper">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell" style={{width: '50px'}}>№</div>
            <div className="table-cell" style={{width: '100px'}}>Кількість</div>
            <div className="table-cell" style={{width: '100px'}}>Серійний номер</div>
            <div className="table-cell" style={{width: '100px'}}>Ціна за одиницю</div>
            <div className="table-cell" style={{width: '100px'}}>Дата створення</div>
            <div className="table-cell" style={{width: '100px'}}>Категорія</div>
          </div>
        </div>
        <div className="table-body">
          {nestedItems && nestedItems.map((nestedItem, index) => (
            <div className="table-row" key={nestedItem.value}>
              <div className="table-cell" style={{width: '50px'}}>{index + 1}</div>
              <div className="table-cell" style={{width: '100px'}}>
                <Input
                  type="number"
                  min={0}
                  defaultValue={nestedItem.value}
                />
              </div>
              <div className="table-cell" style={{width: '100px'}}>
                <Input
                  type="number"
                  min={0}
                  defaultValue={nestedItem.value}
                />
              </div>
              <div className="table-cell" style={{width: '100px'}}>
                <Input
                  type="number"
                  min={0}
                  defaultValue={nestedItem.value}
                />
              </div>
              <div className="table-cell" style={{width: '100px'}}>
                <Input
                  type="number"
                  min={0}
                  defaultValue={nestedItem.value}
                />
              </div>
              <div className="table-cell" style={{width: '100px'}}>
                <Input
                  type="number"
                  min={0}
                  defaultValue={nestedItem.value}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default NestedArrayModal;
