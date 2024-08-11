import './App.scss'
import Info from "./components/Info/Info.tsx";
import Content from "./components/Content/Content.tsx";

function App() {

  return (
    <div className={'app'}>
        <Content />
        <Info />
    </div>
  )
}

export default App
