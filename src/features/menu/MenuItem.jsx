import { formatCurrency } from '../../utils/helpers';
import Button from '../../ui/Button';
import { addItem, getCurrentQuantity } from '../cart/CartSlice';
import { useDispatch, useSelector } from 'react-redux';
import DeleteItem from '../cart/DeleteItem';
function MenuItem({ pizza }) {
  const { name, unitPrice, ingredients, soldOut, imageUrl, id } = pizza;
  const currentQuantity = useSelector(getCurrentQuantity(id));
  const isInCart = currentQuantity > 0;
  const dispatch = useDispatch();
  const handleAddToCart = () => {
    const newItem = {
      pizzaId: id,
      name,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice,
    };
    dispatch(addItem(newItem));
  };

  return (
    <li className="flex gap-4 py-2">
      <img
        className={`h-24 ${soldOut ? 'opacity-70 grayscale' : ''}`}
        src={imageUrl}
        alt={name}
      />
      <div className="flex grow flex-col justify-between pt-0.5">
        <p className="font-medium">{name}</p>
        <p className="text-sm capitalize text-stone-500">
          {ingredients.join(', ')}
        </p>
        <div className="mt-auto flex items-center justify-between">
          {!soldOut ? (
            <p className="text-sm">{formatCurrency(unitPrice)}</p>
          ) : (
            <p className="text-sm font-medium uppercase text-stone-500">
              Sold out
            </p>
          )}

          {isInCart && (
            <div className="flex items-center gap-3 sm:gap-6">
              <p className="text-sm">{currentQuantity}&times;</p>
              <DeleteItem pizzaId={id} />
            </div>
          )}

          {!soldOut && !isInCart && (
            <Button onClick={handleAddToCart} type="small" disabled={soldOut}>
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
