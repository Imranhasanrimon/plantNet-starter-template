import { Calendar } from 'react-date-range'
import { FaUserAlt, FaDollarSign } from 'react-icons/fa'
import { BsFillCartPlusFill, BsFillHouseDoorFill } from 'react-icons/bs'
import useRole from '../../../hooks/useRole'
import { Navigate } from 'react-router-dom'
import LoadingSpinner from '../../Shared/LoadingSpinner'
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import Chart from '../../../pages/Dashboard/charts/Chart'

const AdminStatistics = () => {
  const [role, isLoading] = useRole();
  const axiosSecure = useAxiosSecure()
  const { data = {}, isLoading: isLoadingForUseQuery } = useQuery({
    queryKey: ['adminStat'],
    queryFn: async () => {
      const { data } = await axiosSecure('/admin-stat');
      return data
    }
  })

  if (isLoading || isLoadingForUseQuery) return <LoadingSpinner />
  if (role === 'customer') return <Navigate to='/dashboard/my-orders' />
  if (role === 'seller') return <Navigate to='/dashboard/my-inventory' />
  return (
    role === "admin" && <div>
      <div className='mt-12'>
        {/* small cards */}
        <div className='mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 flex-grow'>
          {/* Sales Card */}
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md'>
            <div
              className={`bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center from-orange-600 to-orange-400 text-white shadow-orange-500/40`}
            >
              <FaDollarSign className='w-6 h-6 text-white' />
            </div>
            <div className='p-4 text-right'>
              <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600'>
                Total Revenue
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900'>
                ${data?.totalRevenue}
              </h4>
            </div>
          </div>
          {/* Total Orders */}
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md'>
            <div
              className={`bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center from-blue-600 to-blue-400 text-white shadow-blue-500/40`}
            >
              <BsFillCartPlusFill className='w-6 h-6 text-white' />
            </div>
            <div className='p-4 text-right'>
              <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600'>
                Total Orders
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900'>
                {data?.totalOrders}
              </h4>
            </div>
          </div>
          {/* Total Plants */}
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md'>
            <div
              className={`bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center from-pink-600 to-pink-400 text-white shadow-pink-500/40`}
            >
              <BsFillHouseDoorFill className='w-6 h-6 text-white' />
            </div>
            <div className='p-4 text-right'>
              <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600'>
                Total Plants
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900'>
                {data?.totalPlants}
              </h4>
            </div>
          </div>
          {/* Users Card */}
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md'>
            <div
              className={`bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center from-green-600 to-green-400 text-white shadow-green-500/40`}
            >
              <FaUserAlt className='w-6 h-6 text-white' />
            </div>
            <div className='p-4 text-right'>
              <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600'>
                Total User
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900'>
                {data?.totalUsers}
              </h4>
            </div>
          </div>
        </div>

        <div className='mb-4 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'>
          {/*Sales Bar Chart */}
          <div className='relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2'>
            {/* Chart goes here.. */}
            <Chart chartData={data?.chartData} />
          </div>
          {/* Calender */}
          <div className=' relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden'>
            <Calendar color='#4cc718' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminStatistics
