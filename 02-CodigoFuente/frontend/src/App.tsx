import { CarritoProvider } from './context/CarritoContext';
import Header from './components/Header';
import Hero from './components/Hero'; 
import FeaturedMenu from './components/FeaturedMenu';
import ShoppingCarrito from './components/ShoppingCarrito';

function App() {
  return (
   
    <CarritoProvider>
      <Header />
      <main className="pt-20"> 
        <Hero />
        <FeaturedMenu />
      </main>
      <ShoppingCarrito /> 
    
    </CarritoProvider>
  )
}

export default App;