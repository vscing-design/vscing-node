import { useState } from 'react'
import { Button } from "@/components/ui/button"
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Vite + React</h1>
      <Button>Click me</Button>
    </>
  )
}

export default App
