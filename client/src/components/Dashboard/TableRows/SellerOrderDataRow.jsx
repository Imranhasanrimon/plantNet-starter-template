import PropTypes from 'prop-types'
import { useState } from 'react'
import DeleteModal from '../../Modal/DeleteModal'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'
const SellerOrderDataRow = ({ myOrder, refetch }) => {
  let [isOpen, setIsOpen] = useState(false)
  const closeModal = () => setIsOpen(false)
  const { name, customer, price, quantity, address, status, _id, plantId } = myOrder || {}
  const axiosSecure = useAxiosSecure()
  //handle order delete or cancelation
  const handleDelete = async () => {
    try {
      await axiosSecure.delete(`orders/${_id}`)
      //decrease quantity from plantsCollection
      await axiosSecure.patch(`/orders/quantity/${plantId}`, { quantityToUpdate: quantity, status: 'increase' });
      refetch()
      toast.success('Order Cancelled.')
    } catch (err) {
      console.log(err);
      toast.error(err.response.data)
    } finally {
      closeModal()
    }

  }

  return (
    <tr>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{name}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{customer?.email}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>${price}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{quantity}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{address}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className={`text-gray-900 whitespace-no-wrap ${status === 'delivered' ? 'text-green-500' : 'text-red-500'}`}>{status}</p>
      </td>

      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <div className='flex items-center gap-2'>
          <select
            defaultValue={status}
            required
            className='p-1 border-2 border-lime-300 focus:outline-lime-500 rounded-md text-gray-900 whitespace-no-wrap bg-white'
            name='category'
          >
            <option value='pending'>Pending</option>
            <option value='in progress'>Start Processing</option>
            <option value='delivered'>Delivered</option>
          </select>
          <button
            onClick={() => setIsOpen(true)}
            className='relative disabled:cursor-not-allowed cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight'
          >
            <span
              aria-hidden='true'
              className='absolute inset-0 bg-red-200 opacity-50 rounded-full'
            ></span>
            <span className='relative'>Cancel</span>
          </button>
        </div>
        <DeleteModal isOpen={isOpen} handleDelete={handleDelete} closeModal={closeModal} />
      </td>
    </tr>
  )
}

SellerOrderDataRow.propTypes = {
  myOrder: PropTypes.object,
  refetch: PropTypes.func,
}

export default SellerOrderDataRow
