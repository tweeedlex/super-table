import React, {memo, useState, useCallback, useRef, useLayoutEffect} from 'react';
import memoize from 'memoize-one';
import {FixedSizeList as List, areEqual} from 'react-window';
import {Button, Input} from "antd";
import './FormAssetVirtual.css';
import NestedArrayModal from "./NestedArrayModal.tsx";

type NestedItem = {
  value: number;
  isActive: boolean;
};

type Item = {
  value: number;
  items: NestedItem[];
  isActive: boolean;
};

type RowProps = {
  data: {
    items: Item[];
    updateItem: (index: number, value: number) => void;
    setData: React.Dispatch<React.SetStateAction<Item[]>>;
  };
  index: number;
  style: React.CSSProperties;
};

const RowVirtual = memo(({data, index, style}: RowProps) => {
  const {items, updateItem, setData} = data;
  const item = items[index];
  const [localValue, setLocalValue] = useState(item.value);
  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setLocalValue(newValue);
    updateItem(index, newValue);
  };

  const handleDuplicate = () => {
    setData(prevData => {
      const newData = [...prevData];
      const duplicateData = Array.from({length: localValue}, () => ({
        value: item.value,
        items: item.items,
        isActive: item.isActive
      }));
      newData.splice(index + 1, 0, ...duplicateData);
      return newData;
    });
  };

  return (
    <div style={style} className="table-row">
      <div className="table-cell" style={{width: '50px'}}>{index + 1}</div>
      <div className="table-cell" style={{width: '100px'}}>
        <Input
          type="number"
          value={localValue}
          onChange={handleChange}
          min={0}
        />
      </div>
      <div className="table-cell" style={{width: '100px'}}>
        <Input
          type="number"
          value={localValue}
          onChange={handleChange}
          min={0}
        />
      </div>
      <div className="table-cell" style={{width: '100px'}}>
        <Input
          type="number"
          value={localValue}
          onChange={handleChange}
          min={0}
        />
      </div>
      <div className="table-cell" style={{width: '100px'}}>
        <Input
          type="number"
          value={localValue}
          onChange={handleChange}
          min={0}
        />
      </div>
      <div className="table-cell" style={{width: '100px'}}>
        <Input
          type="number"
          value={localValue}
          onChange={handleChange}
          min={0}
        />
      </div>

      <div className="table-cell" style={{width: '100px'}}>
        <Button onClick={handleDuplicate}>Duplicate</Button>
      </div>
      <div className="table-cell" style={{width: '100px'}}>
        <Button onClick={() => setIsModalVisible1(true)}>Modal 1</Button>
      </div>
      <div className="table-cell" style={{width: '100px'}}>
        <Button onClick={() => setIsModalVisible2(true)}>Modal 2</Button>
      </div>

      <NestedArrayModal
        visible={isModalVisible1}
        onClose={() => setIsModalVisible1(false)}
        nestedItems={item.items[0]}
      />

      <NestedArrayModal
        visible={isModalVisible2}
        onClose={() => setIsModalVisible2(false)}
        nestedItems={item.items[1]}
      />
    </div>
  );
}, areEqual);

const createItemData = memoize((items, updateItem, setData) => ({
  items,
  updateItem,
  setData
}));

const FormAssetVirtual = () => {
  const initialData = Array.from({length: 2000}, (_, index) => ({
    value: index,
    items: [
      Array.from({length: 10}, (_, i) => ({
        value: i,
        isActive: i % 2 === 0
      })),
      Array.from({length: 20}, (_, i) => ({
        value: i,
        isActive: i % 2 === 0
      })),
    ],
    isActive: index % 2 === 0
  }));

  const [data, setData] = useState<Item[]>(initialData);
  const [colWidth, setColWidth] = useState<number>(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const updateItem = useCallback((index: number, value: number) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        value: value,
      };
      return newData;
    });
  }, []);

  const itemData = createItemData(data, updateItem, setData);

  useLayoutEffect(() => {
    if (headerRef.current) {
      setColWidth(headerRef.current.offsetWidth);
    }
  }, []);

  const syncScroll = () => {
    if (headerRef.current && bodyRef.current) {
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
    }
  };

  return (
    <div>
      <div className="table-wrapper">
        <div className="table-header" ref={headerRef}>
          <div className="table-row">
            <div className="table-cell" style={{width: '50px'}}>№</div>
            <div className="table-cell" style={{width: '100px'}}>Кількість</div>
            <div className="table-cell" style={{width: '100px'}}>Серійний номер</div>
            <div className="table-cell" style={{width: '100px'}}>Ціна за одиницю</div>
            <div className="table-cell" style={{width: '100px'}}>Дата створення</div>
            <div className="table-cell" style={{width: '100px'}}>Категорія</div>
            <div className="table-cell" style={{width: '100px'}}>Дія</div>
          </div>
        </div>
        <div className="table-body" ref={bodyRef} onScroll={syncScroll}>
          <List
            height={600}
            itemCount={data.length}
            itemSize={35}
            width={colWidth}
            itemData={itemData}
          >
            {RowVirtual}
          </List>
        </div>
      </div>
    </div>
  );
};

export default FormAssetVirtual;
