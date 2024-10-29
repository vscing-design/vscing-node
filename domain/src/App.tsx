import { useState } from 'react'
import { Button } from "@/shadcn-ui/ui/button"
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Vite + React</h1>
      <Button>Click me</Button>
      <Button variant="outline">Button</Button>
      &nbsp;
      <Button variant="destructive">Destructive</Button>
    </>
  )
}

export default App
