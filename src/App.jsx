import Canvas from "./canvas";
import Customizer from "./pages/Customizer";
import Home from "./pages/Home";

function App() {
     return (
          // <div>
          //      <h1 className="head-text">React</h1>
          // </div>
          <main className="app transition-all ease-in">
               <Home></Home>
               <Canvas></Canvas>
               <Customizer></Customizer>
          </main>
     );
}

export default App;
