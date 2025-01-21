import { useState } from 'react'
import UpdateUserModal from '../../Modal/UpdateUserModal'
import PropTypes from 'prop-types'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { toast } from 'react-hot-toast';
const UserDataRow = ({ user, refetch }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { email, role, status } = user || {};
  const axiosSecure = useAxiosSecure()
  const updateRole = async (selectedRole) => {

    if (role === selectedRole) return toast.error('Already he holds this role');
    try {
      await axiosSecure.patch(`/user/role/${email}`, { role: selectedRole })
      toast.success(`This user is now ${selectedRole}`)
      refetch()
    } catch (err) {
      console.log(err);
    } finally {
      setIsOpen(false)
    }

  }

  return (
    <tr>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{email}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{role}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        {status ? <p className={`${status === 'requested' ? 'text-yellow-500' : 'text-green-500'} whitespace-no-wrap`}>{status}</p> : <p className='text-red-500'>unavailable</p>}
      </td>

      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <span
          onClick={() => setIsOpen(true)}
          className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight'
        >
          <span
            aria-hidden='true'
            className='absolute inset-0 bg-green-200 opacity-50 rounded-full'
          ></span>
          <span className='relative'>Update Role</span>
        </span>
        {/* Modal */}
        <UpdateUserModal isOpen={isOpen} role={role} updateRole={updateRole} setIsOpen={setIsOpen} />
      </td>
    </tr>
  )
}

UserDataRow.propTypes = {
  user: PropTypes.object,
  refetch: PropTypes.func,
}

export default UserDataRow
