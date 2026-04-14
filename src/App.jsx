import { useState, useEffect, useCallback } from 'react';
import { META } from './data/products';
import { genId } from './utils';

import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import ProductModal from './components/ProductModal';
import Hero from './components/Hero';
import ProductSection from './components/ProductSection';
import OrderSection from './components/OrderSection';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import ReviewsPage from './components/ReviewsPage';

export default function App() {
  const [page, setPage] = useState('main');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Scroll reveal for main page
  useEffect(() => {
    if (page !== 'main') return;
    const timer = setTimeout(() => {
      const els = document.querySelectorAll('#page-main .rev');
      const ro = new IntersectionObserver(es => {
        es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
      }, { threshold: 0.1 });
      els.forEach(el => ro.observe(el));
      return () => ro.disconnect();
    }, 80);
    return () => clearTimeout(timer);
  }, [page]);

  // Lock body scroll when overlay open
  useEffect(() => {
    document.body.style.overflow = (cartOpen || modalOpen) ? 'hidden' : '';
  }, [cartOpen, modalOpen]);

  const changePage = (id) => {
    setPage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openModal = (key, editId = null) => {
    setModalKey(key);
    setEditingId(editId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const handleCartConfirm = (newItems, groupId, isEdit) => {
    setCart(prev => {
      let base = isEdit ? prev.filter(i => i.editGroup !== groupId && i.id !== groupId) : prev;
      return [...base, ...newItems];
    });
  };

  const removeItem = (id) => {
    setCart(prev => {
      const item = prev.find(i => i.id === id);
      if (item?.editGroup) return prev.filter(i => i.editGroup !== item.editGroup);
      return prev.filter(i => i.id !== id);
    });
    if (editingId) setEditingId(null);
  };

  const editCartItem = (gid) => {
    const item = cart.find(i => i.id === gid || i.editGroup === gid);
    if (!item || !META[item.pKey]) return;
    const pKey = item.pKey === 'gift'
      ? (item.size === '50ml' ? 'jar50' : item.size === '100ml' ? 'jar100' : 'jar500')
      : item.pKey;
    setCartOpen(false);
    openModal(pKey, item.editGroup || item.id);
  };

  const cartCount = cart.filter(i => i.type !== 'gift').reduce((s, i) => s + i.qty, 0);

  const gotoOrder = () => {
    changePage('main');
    setTimeout(() => document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' }), 80);
  };

  const scrollToShop = () => {
    changePage('main');
    setTimeout(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }), 80);
  };

  const scrollToOrder = () => {
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Navbar
        page={page}
        setPage={changePage}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onGotoOrder={gotoOrder}
      />

      <CartDrawer
        open={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onRemove={removeItem}
        onCheckout={() => { setCartOpen(false); scrollToOrder(); }}
      />

      <ProductModal
        open={modalOpen}
        productKey={modalKey}
        editingId={editingId}
        cartItems={cart}
        onClose={closeModal}
        onConfirm={handleCartConfirm}
      />

      {/* MAIN PAGE */}
      <div className={`page${page === 'main' ? ' active' : ''}`} id="page-main">
        <Hero
          onGoShop={scrollToShop}
          onGoAbout={() => changePage('about')}
        />
        <ProductSection
          cart={cart}
          onOpenModal={openModal}
          onOpenCart={() => setCartOpen(true)}
          onScrollToOrder={scrollToOrder}
        />
        <OrderSection
          cart={cart}
          editingId={editingId}
          setEditingId={setEditingId}
          onEdit={editCartItem}
          onRemove={removeItem}
          onClearCart={() => setCart([])}
        />
        <Footer
          setPage={changePage}
          scrollToShop={scrollToShop}
          scrollToOrder={scrollToOrder}
        />
      </div>

      {/* ABOUT PAGE */}
      <div className={`page${page === 'about' ? ' active' : ''}`}>
        {page === 'about' && (
          <AboutPage setPage={changePage} gotoOrder={gotoOrder} />
        )}
      </div>

      {/* REVIEWS PAGE */}
      <div className={`page${page === 'reviews' ? ' active' : ''}`}>
        {page === 'reviews' && (
          <ReviewsPage setPage={changePage} gotoOrder={gotoOrder} />
        )}
      </div>
    </>
  );
}
