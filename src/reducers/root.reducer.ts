import {ADD_ITEM_TO_CART, APP_ACTIONS} from '../shared/immutables';
import {Book, CartItem} from '../shared/models';

export interface IAppContext {
  searchText: string;
  books: Book[];
  cartItems: Partial<CartItem>[];
}

export const RootReducer = (
  state: IAppContext,
  action: {type: string; data?: any},
) => {
  const newState = {...state};
  const {type, data} = action;
  switch (type) {
    case APP_ACTIONS.UPDATE_SEARCH_TEXT:
      newState.searchText = data;
      break;
    case APP_ACTIONS.UPDATE_USER_INFO:
      // newState.user = {...newState.user, ...data};
      break;
    case APP_ACTIONS.SET_BOOKS:
      newState.books = [...data];
      break;
    case APP_ACTIONS.UPDATE_ADDRESS:
      // if (!!newState.user) {
      //   const address = {...data};
      //   newState.user.addresses = [address];
      // }
      break;
    case APP_ACTIONS.SET_CART:
      const items = [];
      data?.orderDetails.forEach(order => {
        const cartItem: Partial<CartItem> = {
          ...order.bookId,
          id: order._id,
          qtyOrdered: order.quantity,
        };
        items.push(cartItem);
      });
      newState.cartItems = [...items];
      break;
    case APP_ACTIONS.UPDATE_CART:
      if (data.action === ADD_ITEM_TO_CART) {
        newState.cartItems = [...newState.cartItems, data.item];
      } else {
        // find appropriate book, _id depicts bookId
        if (data.value) {
          const item = newState.cartItems.find(item => item._id === data.id);
          item.qtyOrdered = data.value;
        } else {
          newState.cartItems = newState.cartItems.filter(
            item => item._id != data.id,
          );
        }
      }
      break;
    default:
    // do nothing
  }
  return newState;
};
