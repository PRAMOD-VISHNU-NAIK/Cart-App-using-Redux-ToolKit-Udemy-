import { useDispatch, useSelector } from 'react-redux';
import classes from './CartButton.module.css';
import { uiAction } from '../../store/ui-slice';

const CartButton = (props) => {

  const dispatch = useDispatch();

  const cartQuantitiy = useSelector(state => state.cart.totalQuantity);

  const handleClick = () =>{
    dispatch(uiAction.toggle())
  }

  return (
    <button className={classes.button} onClick={handleClick}>
      <span>My Cart</span>
      <span className={classes.badge}>{cartQuantitiy}</span>
    </button>
  );
};

export default CartButton;
