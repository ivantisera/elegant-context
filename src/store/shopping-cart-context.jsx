import { createContext, useState, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  updateItemQuantity: () => {},
});

const shoppingCartReducer = (state, action) => {
  console.log(state, action);
  switch (action.type) {
    case "ADD_ITEM":
      const updatedItems = [...state.items];

      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === action.payload
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find(
          (product) => product.id === action.payload
        );
        updatedItems.push({
          id: action.payload,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return {
        ...state,
        items: updatedItems,
      };
    case "UPDATE_CART_ITEM_QUANTITY":
      const updatedItemsArr = [...state.items];
      const updatedItemIndex = updatedItemsArr.findIndex(
        (item) => item.id === action.payload.productId
      );

      const updatedItem = {
        ...updatedItemsArr[updatedItemIndex],
      };

      updatedItem.quantity += action.payload.amount;

      if (updatedItem.quantity <= 0) {
        updatedItemsArr.splice(updatedItemIndex, 1);
      } else {
        updatedItemsArr[updatedItemIndex] = updatedItem;
      }

      return {
        ...state,
        items: updatedItemsArr,
      };
  }
  return state;
};

export const CartContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(shoppingCartReducer, {
    items: [],
  });

  function handleAddItemToCart(id) {
    dispatch({
      type: "ADD_ITEM",
      payload: id,
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    dispatch({
      type: "UPDATE_CART_ITEM_QUANTITY",
      payload: { productId, amount },
    });
  }

  const ctxValue = {
    items: state.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity,
  };

  return (
    <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
  );
};
