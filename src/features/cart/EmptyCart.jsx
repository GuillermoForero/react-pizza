import { Link } from 'react-router-dom';
import LinkButton from '../../ui/LinkButton';

function EmptyCart() {
  return (
    <div className="mt-8 text-center">
      <LinkButton to="/menu">&larr; Back to menu</LinkButton>

      <p className="mt-4 font-semibold">
        Your cart is still empty. Start adding some pizzas :D
      </p>
    </div>
  );
}

export default EmptyCart;
