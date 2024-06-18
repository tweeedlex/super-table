import React, {FC, memo, useCallback, useState} from 'react';
import memoize from 'memoize-one';
import {areEqual, FixedSizeList as List} from 'react-window';
import {Button, Col, DatePicker, Dropdown, Input, InputNumber, MenuProps, Popconfirm, Row, Select} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import './FormAssetVirtual.css';
import AutoSizer from "react-virtualized-auto-sizer";
// import {IAssetSets} from "../../../type/IAsset.ts";
import {Dayjs} from "dayjs";
// import {mutateCategory} from "../../../helper/mutateDataForSelect.ts";
// import {FetchLoadData} from "../../../helper/fetchLoadData.ts";
// import {ICategory} from "../../../type/IType.ts";
// import {getCategories} from "../../../api/types/types.ts";
import {DashOutlined, DiffOutlined} from "@ant-design/icons";
import ModalAssetPlacing from "./ModalAssetPlacing.tsx";
import ModalAssetSets from "./ModalAssetSets.tsx";
import {v4 as uuid} from "uuid";
import {highlightElement, IAssetFormDetail, IAssetSets} from "../App.tsx";

const mutateCategory = (data: ICategory[]) => {
    return data.map((item) => ({
        label: item.name,
        value: item.id
    }))
}

type ICategory = {
    id: number,
    name: string
}

interface RowDataProps {
    items: IAssetFormDetail[];
    updateItem: (index: number, key: string, value: number | string | Dayjs ) => void;
    duplicateItem: (item: IAssetFormDetail, count: number) => void;
    category: {
        items: ICategory[] | undefined
        loadingCategory: boolean
    }
    addSets: (item: IAssetSets[], idDetail: string | number) => void
}

interface RowProps {
    data: RowDataProps
    index: number;
    style: React.CSSProperties;
}

interface DropdownAssetActionsProps {
    duplicateItem: (item: IAssetFormDetail, count: number) => void;
    item: IAssetFormDetail,
    addSets: (item: IAssetSets[], idDetail: string | number) => void
}

const DropdownAssetActions: FC<DropdownAssetActionsProps> = ({duplicateItem, item, addSets}) => {
    const [countAddAsset, setCountAddAsset] = useState<number>(1)
    const [isAddAsset, setIsAddAsset] = useState(false)
    const [isAssetPlacing, setIsAssetPlacing] = useState(false)
    const [isAssetSets, setIsAssetSets] = useState(false)

    const onClick: MenuProps['onClick'] = ({key}) => {
        if (key === '0') {
            setIsAssetPlacing(true)
        } else if (key === '1') {
            setIsAssetSets(true)
        } else if (key === '2') {
            setIsAddAsset(true)
        }
    };

    const items: MenuProps['items'] = [
        {
            label: 'Розміщення',
            key: '0',
        },
        {
            label: 'Комплекти',
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: 'Дублювати майно',
            key: '2',
        },
    ];

    if (isAddAsset) {
        return (
            <Popconfirm
                icon={<DiffOutlined/>}
                title={'Дублювати майно'}
                open={isAddAsset}
                onCancel={() => setIsAddAsset(false)}
                description={
                    <InputNumber
                        min={1}
                        defaultValue={1}
                        style={{width: '100%'}}
                        value={countAddAsset}
                        placeholder={'Кількість записів'}
                        onChange={(value) => {
                            if (value)
                                setCountAddAsset(value)
                        }}
                    />
                }
                okText={'Дублювати'}
                onConfirm={() => {
                    duplicateItem(item, countAddAsset)
                }}
            >
                <Button icon={<DashOutlined/>}/>
            </Popconfirm>
        )
    }

    if (isAssetPlacing) {
        return (<ModalAssetPlacing visible={isAssetPlacing} onClose={() => setIsAssetPlacing(false)} addSets={addSets}
                                   item={item} />)
    }

    if (isAssetSets) {
        return (<ModalAssetSets visible={isAssetSets} onClose={() => setIsAssetSets(false)}/>)
    }

    return (
        <Dropdown menu={{items, onClick}} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()}>
                <Button icon={<DashOutlined/>}/>
            </a>
        </Dropdown>
    )
}

const SerialSearch = ({submitSerialSearch}) => {
    const [serialToSearch, setSerialToSearch] = useState<string>('')

    return (
      <Dropdown
        trigger={['click']}
        dropdownRender={() => (
          <div style={{
            padding: "10px",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "10px",
            marginLeft: "-60px",
            width: "220px",
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
            gap: "10px",
          }}>
            <Input
              placeholder={"Серійний номер..."}
              value={serialToSearch}
              onChange={e => setSerialToSearch(e.target.value)}
            />
            <Button onClick={() => submitSerialSearch(serialToSearch)}>
              <SearchOutlined />
              Пошук
            </Button>
          </div>
        )}
      >
        <a onClick={(e) => e.preventDefault()}>
          <SearchOutlined style={{marginRight: 3}} />
          Серійний номер
        </a>
      </Dropdown>
    )
}

const RowVirtual = memo(({data, index, style}: RowProps) => {

    const {items, updateItem, duplicateItem, category, addSets} = data;
    const item = items[index];

    const handleChangeNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        updateItem(index, e.target.name, newValue);
    };

    const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = String(e.target.value);
        updateItem(index, e.target.name, newValue);
    };

    const handleChangeDate = (e: Dayjs) => {
        updateItem(index, 'dateOfManufacture', e);
    };

    // const handleChangeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const newValue = Number(e.target.value);
    //     updateItem(index, e.target.name, newValue);
    // };

    return (
        <div
            style={{
              ...style,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center'
            }}
        >
            <Row style={{width: '100%', border: '1px solid #ccc', position: "relative"}}>
                <div className={"highlight"} id={item.idDetail}></div>
                <Col span={1} style={{borderRight: '1px solid #ccc'}}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '15px',
                        marginRight: '5px',
                    }}>{index + 1}.
                    </div>
                </Col>
                <Col span={4} style={{borderRight: '1px solid #ccc'}}>
                    <Input
                        name="count"
                        placeholder={'Кількість'}
                        type="number"
                        value={item.count}
                        onChange={handleChangeNumber}
                        min={0}
                    />
                </Col>
                <Col span={6} style={{borderRight: '1px solid #ccc'}}>
                    <Input
                        name='serialNumber'
                        placeholder={'Серійний номер'}
                        value={item.serialNumber}
                        onChange={handleChangeText}
                    />
                </Col>
                <Col span={4} style={{borderRight: '1px solid #ccc'}}>
                    <Input
                        name='price'
                        placeholder={'Ціна за одиницю'}
                        value={item.price}
                        type="number"
                        onChange={handleChangeNumber}
                        min={0}
                    />
                </Col>
                <Col span={4} style={{borderRight: '1px solid #ccc'}}>
                    <DatePicker
                        name="dateOfManufacture"
                        value={item.dateOfManufacture}
                        style={{width: '100%'}}
                        placeholder="Дата створення"
                        onChange={handleChangeDate}
                    />
                </Col>
                <Col span={4} style={{borderRight: '1px solid #ccc'}}>
                    <Select
                        placeholder="Категорія"
                        style={{width: '100%'}}
                        options={category.items && mutateCategory(category.items)}
                        loading={category.loadingCategory}
                    />
                </Col>
                <Col span={1}>
                    <DropdownAssetActions duplicateItem={duplicateItem} item={item} addSets={addSets}/>
                </Col>
            </Row>
        </div>
    );
}, areEqual);

interface IPropsItemData {
    items: IAssetFormDetail[]
    updateItem: (index: number, key: string, value:  number | string | Dayjs) => void
    duplicateItem: (item: IAssetFormDetail, count: number) => void
    category: ICategory[] | undefined
    loadingCategory: boolean
    addSets: (item: IAssetSets[], idDetail: string | number) => void
}


const propsItemData: ({items, updateItem, duplicateItem, category, loadingCategory, addSets}: IPropsItemData) => {
    duplicateItem: (item: IAssetFormDetail, count: number) => void;
    updateItem: (index: number, key: string, value:  number | string | Dayjs) => void;
    category: { items: ICategory[] | undefined; loadingCategory: boolean };
    items: IAssetFormDetail[]
    addSets: (item: IAssetSets[], idDetail: (string | number)) => void
} = memoize(({items, updateItem, duplicateItem, category, loadingCategory, addSets}: IPropsItemData) => {
    return {
        items: items,
        updateItem: updateItem,
        duplicateItem: duplicateItem,
        category: {
            items: category,
            loadingCategory: loadingCategory
        },
        addSets: addSets
    }
});

interface FormAssetVirtualProps {
    data: IAssetFormDetail[];
    setData: React.Dispatch<React.SetStateAction<IAssetFormDetail[]>>;
    listRef?: React.RefObject<List>;
}

const FormAssetVirtual = ({data, setData, listRef}: FormAssetVirtualProps) => {

    const updateItem = useCallback((index: number, key: string, value:  number | string | Dayjs) => {
        setData(prevData => {
            const newData = [...prevData];
            newData[index][key] = value;
            return newData;
        });
    }, []);

    const addSets = useCallback((item: IAssetSets[], idDetail: string | number) => {
        setData(prevState => prevState.map(value => {
            if (value.idDetail === idDetail) {
                return {
                    ...value,
                    defaultWarehouse: item
                }
            } else {
                return value
            }
        }))
    }, [])

    const duplicateItem = useCallback((item: IAssetFormDetail, count: number) => {
        const initialData: IAssetFormDetail[] = Array.from({length: count}, () => ({
            ...item,
            idDetail: uuid()
        }));
        setData(prevState => [...prevState, ...initialData]);
    }, [])

    const category = [
        {id: 1, name: 'Категорія 1'},
        {id: 2, name: 'Категорія 2'},
        {id: 3, name: 'Категорія 3'},
        {id: 4, name: 'Категорія 4'},
    ]
    const loadingCategory = false;

    const itemData: RowDataProps = propsItemData({
        items: data,
        updateItem: updateItem,
        duplicateItem: duplicateItem,
        category: category,
        loadingCategory: loadingCategory,
        addSets: addSets
    });

    const submitSerialSearch = (serialToSearch: string) => {
        console.log(serialToSearch)
        data.forEach((item) => {
            if (item.serialNumber === serialToSearch) {
                listRef?.current?.scrollToItem(data.indexOf(item), "center")
                highlightElement(`[value="${serialToSearch}"][name="serialNumber"]`, '#53d0e1')
            }
        });
    }

    return (
        <>
            <Row style={{width: 1800}}>
                <Col span={12}>
                    <Row style={{textAlign: 'center', marginRight: '17px', border: '1px solid #ccc'}}>
                        <Col span={1} style={{borderRight: '1px solid #ccc'}}>
                            №
                        </Col>
                        <Col span={4} style={{borderRight: '1px solid #ccc'}}>
                            Кількість
                        </Col>
                        <Col span={6} style={{borderRight: '1px solid #ccc', cursor: "pointer"}} >
                            <SerialSearch submitSerialSearch={submitSerialSearch} />
                        </Col>
                        <Col span={4} style={{borderRight: '1px solid #ccc'}}>
                            Ціна за одиницю
                        </Col>
                        <Col span={4} style={{borderRight: '1px solid #ccc'}}>
                            Дата створення
                        </Col>
                        <Col span={4} style={{borderRight: '1px solid #ccc'}}>
                            Категорія
                        </Col>
                        <Col span={1}>
                            Дія
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row style={{width: 1800}}>
                <Col span={12} style={{height: '500px'}}>
                    <AutoSizer>
                        {({width, height}) =>
                            <List
                                style={{overflowY: 'scroll'}}
                                ref={listRef}
                                height={height}
                                itemCount={data.length}
                                itemSize={35}
                                width={width}
                                itemData={itemData}
                                itemKey={(index) => index}
                            >
                                {RowVirtual}
                            </List>
                        }
                    </AutoSizer>
                </Col>
            </Row>
        </>
    )
};

export default FormAssetVirtual;
