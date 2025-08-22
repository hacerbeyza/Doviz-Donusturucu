import { useState } from 'react'
import ChartComponent from './components/ChartComponent'
import Currency from './components/Currency'
import Table from './components/Table'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="app">
        <Currency />
        <Table />
        <ChartComponent />
      </div>
    </>
  )
}

export default App
