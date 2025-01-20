import PropTypes from 'prop-types'
import { useState } from 'react'
import DeleteModal from '../../Modal/DeleteModal'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
const CustomerOrderDataRow = ({ myOrder, refetch }) => {
  const { price, quantity, status, name, image, category, plantId, _id } = myOrder || {}
  let [isOpen, setIsOpen] = useState(false)
  const closeModal = () => setIsOpen(false)
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
        <div className='flex items-center'>
          <div className='flex-shrink-0'>
            <div className='block relative'>
              <Link to={`/plant/${plantId}`}> <img
                alt='profile'
                src={image}
                className='mx-auto object-cover rounded h-10 w-15 '
              /></Link>
            </div>
          </div>
        </div>
      </td>

      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{name}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{category}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>${price}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{quantity}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className={`text-gray-900 whitespace-no-wrap ${status === 'delivered' ? 'text-green-500' : 'text-red-500'}`}>{status}</p>
      </td>

      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <button
          onClick={() => setIsOpen(true)}
          className='relative disabled:cursor-not-allowed cursor-pointer inline-block px-3 py-1 font-semibold text-lime-900 leading-tight'
        >
          <span className='absolute cursor-pointer inset-0 bg-red-200 opacity-50 rounded-full'></span>
          <span className='relative cursor-pointer'>Cancel</span>
        </button>

        <DeleteModal handleDelete={handleDelete} isOpen={isOpen} closeModal={closeModal} />
      </td>
    </tr>
  )
}

CustomerOrderDataRow.propTypes = {
  order: PropTypes.object,
  refetch: PropTypes.func,
  myOrder: PropTypes.object
}

export default CustomerOrderDataRow
