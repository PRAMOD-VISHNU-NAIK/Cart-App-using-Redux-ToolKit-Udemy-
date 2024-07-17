import { useDispatch, useSelector } from "react-redux";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { useEffect } from "react";
import Notification from "./components/UI/Notification";
import { sendCartData } from "./store/cart-slice";
import {fetchCartData} from "./store/cart-slice"

let isInitial = true;

function App() {
  const showCart = useSelector((state) => state.ui.cartIsVisible);

  const cart = useSelector((state) => state.cart);

  const notification = useSelector((state) => state.ui.notification);

  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch])

  useEffect(() => {

    // In case it is a initial render then I dont have anything to send to the backend so do not execute sendCartData() function.
    if (isInitial) {
      isInitial = false;
      return;
    }

    if(cart.changed){
      dispatch(sendCartData(cart));
    }
    
  }, [cart, dispatch]); // Here dispatch is added for simplicity and to avoid squidly line, so it doesn't make any difference.

  return (
    <>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </>
  );
}

export default App;
