// This example shows you how to set up React Stripe.js and use Elements.
// Learn how to accept a payment using the official Stripe docs.
// https://stripe.com/docs/payments/accept-a-payment#web

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

import './CheckoutForm.css';
import Button from '../Shared/Button/Button';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const CheckoutForm = ({ closeModal, handlePurchase, purchaseInfo }) => {
    const [clientSecret, setClientSecret] = useState('');
    const axiosSecure = useAxiosSecure()
    useEffect(() => {
        getPaymentIntent()
    }, [purchaseInfo]);
    console.log(clientSecret);
    const getPaymentIntent = async () => {
        try {
            const { data } = await axiosSecure.post(`/create-payment-intent`, { quantity: purchaseInfo?.quantity, plantId: purchaseInfo?.plantId })
            setClientSecret(data);
        } catch (err) {
            console.log(err);
        }
    }
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        // Block native form submission.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const card = elements.getElement(CardElement);

        if (card == null) {
            return;
        }

        // Use your card Element with other Stripe.js APIs
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            console.log('[error]', error);
        } else {
            console.log('[PaymentMethod]', paymentMethod);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement
                options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }}
            />
            <div className='flex gap-5'>
                <Button disabled={!stripe} label={`Pay $${purchaseInfo?.price}`} type='submit' />
                <button type='button' onClick={closeModal} className='btn btn-error'>Cancel</button>
            </div>
        </form>
    );
};
CheckoutForm.propTypes = {
    closeModal: PropTypes.func,
    handlePurchase: PropTypes.func,
    purchaseInfo: PropTypes.object,
}

export default CheckoutForm;