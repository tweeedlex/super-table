import './App.css'
import FormAssetVirtual from "./components/FormAssetVirtual.tsx";
import {Button} from "antd";
import {v4 as uuid} from "uuid";
import {useRef, useState} from "react";
import {Dayjs} from "dayjs";

export type IAssetFormDetail = {
  count: number,
  serialNumber: string,
  price: number | undefined,
  dateOfManufacture: Dayjs | undefined,
  categorySelect: number | undefined,
  idDetail: string,
  defaultWarehouse: IAssetSets[]
}

export type IAssetSets = {
  key: string,
  warehouse: string,
  rack: string,
  shelf: string,
  cell: string,
  count: number,
}

export const highlightElement = (selector: string, color: string) => {
  setTimeout(() => {
    const element = document.querySelector(selector)
    if (element) {
      element.style.backgroundColor = color
      setTimeout(() => {
        element.style.backgroundColor = ''
      }, 2000)
    }
  }, 600)
}

export const highlightRow = (id: string) => {
  setTimeout(() => {
    const element = document.querySelector(`[id="${id}"]`);
    if (element) {
      element.classList.add("active")
      setTimeout(() => {
        element.classList.remove("active")
      }, 2000)
    }
  }, 600)
}

function App() {

  const initialData: IAssetFormDetail[] = Array.from({length: 1000}, () => ({
    count: 1,
    serialNumber: 'Б/Н',
    price: undefined,
    dateOfManufacture: undefined,
    categorySelect: undefined,
    idDetail: uuid(),
    defaultWarehouse: []
  }));

  const [formAssetData, setFormAssetData] = useState(initialData);
  const formAssetListRef = useRef(null);

  const handleSave = (event) => {
    event.preventDefault();
    const firstEmpty = formAssetData.find(item => !item.count || !item.serialNumber || !item.price || !item.dateOfManufacture);
    console.log(firstEmpty)
    if (firstEmpty) {
      formAssetListRef?.current?.scrollToItem(formAssetData.indexOf(firstEmpty), "center");
      highlightRow(firstEmpty.idDetail);
    }
  }

  return (
    <>
      <FormAssetVirtual data={formAssetData} setData={setFormAssetData} listRef={formAssetListRef} />
      <Button onClick={handleSave} style={{marginTop: 20}}>Зберегти</Button>
    </>
  )
}

export default App
