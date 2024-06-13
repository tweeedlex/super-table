import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Popconfirm, Table, TableColumnsType} from 'antd';
import {DeleteFilled, PlusOutlined} from '@ant-design/icons';
import {v4 as uuid} from "uuid";
import {IAssetFormDetail, IAssetSets} from "../../../type/IAsset.ts";


type NestedArrayModalProps = {
    visible: boolean;
    onClose: () => void;
    addSets: (item: IAssetSets[], idDetail: string | number) => void
    item: IAssetFormDetail,
};


const ModalAssetSets = ({ visible, onClose, addSets, item }: NestedArrayModalProps) => {
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState<IAssetSets[]>([]);
    useEffect(() => {
        if(item.defaultWarehouse.length > 0){
            setDataSource(item.defaultWarehouse)
        }
    }, []);

    const handleAdd = () => {
        const newData: IAssetSets = {
            key: uuid(),
            warehouse: '',
            rack: '',
            shelf: '',
            cell: '',
            count: item.count,
        };
        setDataSource(prevState => [...prevState, newData]);
    };
    const handleSave = () => {
        form.validateFields().then((values) => {
            const groupedData = dataSource.map(row => ({
                key: row.key,
                warehouse: values[`warehouse_${row.key}`],
                rack: values[`rack_${row.key}`],
                shelf: values[`shelf_${row.key}`],
                cell: values[`cell_${row.key}`],
                count: values[`count_${row.key}`],
            }));
            addSets(groupedData, item.idDetail);
            onClose();
        });
    };

    const handleDelete = (key: string) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };

    const columns:TableColumnsType<IAssetSets> = [
        {
            title: '№',
            dataIndex: 'index',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Склад',
            dataIndex: 'warehouse',
            render: (_, record) => (
                <Form.Item
                    name={`warehouse_${record.key}`}
                    style={{ margin: 0 }}
                    rules={[{ required: true, message: 'Будь ласка, введіть склад' }]}
                    initialValue={record.warehouse}
                >
                    <Input/>
                </Form.Item>
            ),
        },
        {
            title: 'Стелаж',
            dataIndex: 'rack',
            render: (_, record) => (
                <Form.Item
                    name={`rack_${record.key}`}
                    style={{ margin: 0 }}
                    rules={[{ required: true, message: 'Будь ласка, введіть стелаж' }]}
                    initialValue={record.rack}
                >
                    <Input />
                </Form.Item>
            ),
        },
        {
            title: 'Полиця',
            dataIndex: 'shelf',
            render: (_, record) => (
                <Form.Item
                    name={`shelf_${record.key}`}
                    style={{ margin: 0 }}
                    rules={[{ required: true, message: 'Будь ласка, введіть полицю' }]}
                    initialValue={record.shelf}
                >
                    <Input/>
                </Form.Item>
            ),
        },
        {
            title: 'Комірка',
            dataIndex: 'cell',
            render: (_, record) => (
                <Form.Item
                    name={`cell_${record.key}`}
                    style={{ margin: 0 }}
                    rules={[{ required: true, message: 'Будь ласка, введіть комірку' }]}
                    initialValue={record.cell}
                >
                    <Input />
                </Form.Item>
            ),
        },
        {
            title: 'Кількість',
            dataIndex: 'count',
            render: (_, record) => (
                <Form.Item
                    name={`count_${record.key}`}
                    style={{ margin: 0 }}
                    rules={[{ required: true, message: 'Будь ласка, введіть кількість' }]}
                    initialValue={record.count}
                >
                    <Input type="number" min={0} />
                </Form.Item>
            ),
        },
        {
            title: 'Дія',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="Ви впевнені, що хочете видалити?" onConfirm={() => handleDelete(record.key)}>
                        <Button icon={<DeleteFilled />} />
                    </Popconfirm>
                ) : null,
        },
    ];

    return (
        <Modal
            width={'max-width'}
            title="Розміщення майна"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="add" type="dashed" onClick={handleAdd} icon={<PlusOutlined />}>
                    Додати рядок
                </Button>,
                <Button key="close" onClick={onClose}>
                    Закрити
                </Button>,
                <Button key="submit" type="primary" onClick={() => form.submit()}>
                    Зберегти
                </Button>,
            ]}
        >
            <Form
                form={form}
                component={false}
                onFinish={(values) => {
                    handleSave()
                    onClose();
                }}
            >
                <Table
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    rowClassName="editable-row"
                    pagination={false}
                    scroll={{y: window.innerHeight / 2}}
                />
            </Form>
        </Modal>
    );
};

export default ModalAssetSets;
