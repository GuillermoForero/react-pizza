import { useState, useEffect } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import { getCart, selectTotalPrice } from '../cart/cartSlice';
import { selectUsername, selectAddress, selectPosition, selectError, fetchAddress, selectStatus, setAddress } from '../user/userSlice';
import { clearCart } from '../cart/cartSlice';
import store from '../../store';
import { formatCurrency } from '../../utils/helpers';
import EmptyCart from '../cart/EmptyCart';


// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const navigation = useNavigation();
  const cart = useSelector(getCart);
  const username = useSelector(selectUsername);
  const address = useSelector(selectAddress);
  const position = useSelector(selectPosition);
  const adressStatus = useSelector(selectStatus);
  const adressError = useSelector(selectError);
  const isLoadingAddress = adressStatus === 'loading';
  const isLoading = navigation.state === 'submitting';
  const errors = useActionData();
  const dispatch = useDispatch();
  const totalCartPrice = useSelector(selectTotalPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  useEffect(() => {
    if (isLoadingAddress) dispatch(setAddress('Loading...'));
  }, [dispatch, isLoadingAddress]);

  if (!cart.length) return <EmptyCart />;
  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">
        Ready to order? Let&apos;s go!
      </h2>

      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            defaultValue={username}
            className="input grow"
            type="text"
            name="customer"
            required
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
            {errors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center relative">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              className="input w-full"
              type="text"
              name="address"
              disabled={isLoadingAddress}
              defaultValue={address}
              onChange={(e) => dispatch(setAddress(e.target.value))}
              required
            />
            {adressStatus === 'error' && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {adressError}
              </p>
            )}
          </div>

          {!position.latitude && !position.longitude && (
            <span className='absolute right-[1px] top-[3px] z-50 md:right-[5px] md:top-[5px]'>
            <Button type='small' onClick={(e) => {e.preventDefault(); dispatch(fetchAddress());}}>Get address</Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-500 focus:outline-none focus:ring focus:ring-yellow-400"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label className="font-medium" htmlFor="priority">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input type="hidden" name="position" value={position.latitude && position.longitude ? `${position.latitude},${position.longitude}` : ''} />
          <Button disabled={isLoading || isLoadingAddress}>
            {isLoading ? 'Placing order...' : `Order now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const orderData = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true',
  };

  const newOrder = await createOrder(orderData);
  const errors = {};
  if (!isValidPhone(data.phone))
    errors.phone = 'Please enter a valid phone number';
  if (Object.keys(errors).length > 0) return errors;

  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
