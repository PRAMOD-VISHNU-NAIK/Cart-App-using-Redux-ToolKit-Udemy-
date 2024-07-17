import { createSlice } from "@reduxjs/toolkit";
import { uiAction } from "./ui-slice";

const initialState = {
  items: [],
  totalQuantity: 0,
  changed: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    replaceCart(state, action) {
      state.totalQuantity = action.payload.totalQuantity;
      state.items = action.payload.items;
    },
    addItemToCart(state, action) {
      const newItem = action.payload;

      const existingItem = state.items.find((item) => item.id === newItem.id);

      state.totalQuantity++;
      state.changed = true;

      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          name: newItem.title,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      }
    },

    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      state.totalQuantity--;
      state.changed = true;
      if (existingItem.quantity === 1) {
        state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      }
    },
  },
});

// --------------------Creating Custom Actions to handle Async, Side effects and so on which cannot be handled by the Redux Reduceers------------

export const fetchCartData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(
        "https://react-firebase-916ef-default-rtdb.firebaseio.com/cart.json"
      );

      if (!response.ok) {
        throw new Error("Failed to Fetch Cart Data!!");
      }

      const data = response.data;

      return data;
    };

    try {
      const cartData = await fetchData();
      //  replaceCart()
      cartSlice.actions.replaceCart({
        items: cartData.items || [],
        totalQuantity: cartData.totalQuantity
      });
    } catch (error) {
      dispatch(
        uiAction.showNotification({
          status: "error",
          title: "Error....",
          message: "Fetching Cart Data Failed!!",
        })
      );
    }
  };
};

export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiAction.showNotification({
        status: "Pendign",
        title: "Sending....",
        message: "Sending Cart Data",
      })
    );

    const sendRequest = async () => {
      const response = await fetch(
        "https://react-firebase-916ef-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify({
            items: cart.items,
            totalQuantity: cart.totalQuantity
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Sending Cart Data Failed!!");
      }
    };

    try {
      await sendRequest();
      dispatch(
        uiAction.showNotification({
          status: "success",
          title: "Success....",
          message: "Sent Cart Data Successfully!",
        })
      );
    } catch (error) {
      dispatch(
        uiAction.showNotification({
          status: "error",
          title: "Error....",
          message: "Send Cart Data Failed!!",
        })
      );
    }
  };
};

export const cartActions = cartSlice.actions;

export default cartSlice;
