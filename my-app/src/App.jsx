// Hooks
import { useEffect, useState } from "react"

// Components
import Catalog from "./pages/Catalog/Catalog"
import Home from "./pages/Home/Home"
import Navbar from "./components/Navbar/Navbar"                                                                                                                                                                             

function App() {
  let actualPage
  switch (window.location.pathname) {
    case "/catalog":
      actualPage = <Catalog />
    break
    default: actualPage = <Home />
    break
  }
  return (
    <div className="App">
      <Navbar>
        <CustomLink href="/catalog" label="Catlogue"/>
      </Navbar>
        {actualPage}
    </div>
  );
}

function CustomLink(props) {
  return (<>
    <a className={(window.location.pathname === props.href) ? "active" : ""} href={props.href}>{props.label}</a>
  </>
  )
}

export default App;
