import { useDispatch, useSelector } from "react-redux";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { useEffect } from "react";
import { uiAction } from "./store/ui-slice";
import Notification from "./components/UI/Notification";

let isInitial = true;

function App() {
  const showCart = useSelector((state) => state.ui.cartIsVisible);

  const cart = useSelector((state) => state.cart);

  const notification = useSelector((state) => state.ui.notification);

  const dispatch = useDispatch();

  useEffect(() => {
    
    const sendCartData = async () => {
      dispatch(
        uiAction.showNotification({
          status: "Pendign",
          title: "Sending....",
          message: "Sending Cart Data",
        })
      );
      const response = await fetch(
        "https://react-firebase-916ef-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );

      if (!response.ok) {
        throw new Error("Sending Cart Data Failed!!");
      }

      dispatch(
        uiAction.showNotification({
          status: "success",
          title: "Success....",
          message: "Sent Cart Data Successfully!",
        })
      );
    };

    // In case it is a initial render then I dont have anything to send to the backend so do not execute sendCartData() function.
    if (isInitial) {
      isInitial = false;
      return;
    }

    sendCartData().catch((error) => {
      dispatch(
        uiAction.showNotification({
          status: "error",
          title: "Error....",
          message: "Sending Cart Data Failed!!",
        })
      );
    });
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
