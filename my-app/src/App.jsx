// import './App.scss';
import Catalog from "./pages/Catalog/Catalog"
import Home from "./pages/Home/Home"

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
        {actualPage}
    </div>
  );
}

export default App;
