//import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedMenu from './components/FeaturedMenu';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedMenu />
      </main>
      {/* <Footer /> */}
    </>
  );
}

export default App;