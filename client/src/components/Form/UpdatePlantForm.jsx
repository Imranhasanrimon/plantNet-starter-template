import PropTypes from "prop-types"

const UpdatePlantForm = ({ inventoryData }) => {
  const { image, name, category, price, quantity, description, _id } = inventoryData || {};

  const handleUpdate = async (e) => {
    e.preventDefault()
    console.log('update button is clicked', _id);

  }
  return (
    <div className='w-full flex flex-col justify-center items-center text-gray-800 rounded-xl bg-gray-50'>
      <form>
        <div className='grid grid-cols-1 gap-10'>
          <div className='space-y-6'>
            {/* Name */}
            <div className='space-y-1 text-sm'>
              <label htmlFor='name' className='block text-gray-600'>
                Name
              </label>
              <input
                defaultValue={name}
                className='w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                name='name'
                id='name'
                type='text'
                placeholder='Plant Name'
                required
              />
            </div>
            {/* Category */}
            <div className='space-y-1 text-sm'>
              <label htmlFor='category' className='block text-gray-600 '>
                Category
              </label>
              <select
                defaultValue={category}
                required
                className='w-full px-4 py-3 border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                name='category'
              >
                <option value='Indoor'>Indoor</option>
                <option value='Outdoor'>Outdoor</option>
                <option value='Succulent'>Succulent</option>
                <option value='Flowering'>Flowering</option>
              </select>
            </div>
            {/* Description */}
            <div className='space-y-1 text-sm'>
              <label htmlFor='description' className='block text-gray-600'>
                Description
              </label>

              <textarea
                defaultValue={description}
                id='description'
                placeholder='Write plant description here...'
                className='block rounded-md focus:lime-300 w-full h-32 px-4 py-3 text-gray-800  border border-lime-300 bg-white focus:outline-lime-500 '
                name='description'
              ></textarea>
            </div>
          </div>
          <div className='space-y-6 flex flex-col'>
            {/* Price & Quantity */}
            <div className='flex justify-between gap-2'>
              {/* Price */}
              <div className='space-y-1 text-sm'>
                <label htmlFor='price' className='block text-gray-600 '>
                  Price
                </label>
                <input
                  defaultValue={price}
                  className='w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                  name='price'
                  id='price'
                  type='number'
                  placeholder='Price per unit'
                  required
                />
              </div>

              {/* Quantity */}
              <div className='space-y-1 text-sm'>
                <label htmlFor='quantity' className='block text-gray-600'>
                  Quantity
                </label>
                <input
                  defaultValue={quantity}
                  className='w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                  name='quantity'
                  id='quantity'
                  type='number'
                  placeholder='Available quantity'
                  required
                />
              </div>
            </div>
            {/* Image */}
            <div className=' p-4  w-full  m-auto rounded-lg flex-grow'>
              <div className='file_upload px-5 py-3 relative border-4 border-dotted border-gray-300 rounded-lg'>
                <div className='flex flex-col w-max mx-auto text-center'>
                  <label>
                    <input
                      className='text-sm cursor-pointer w-36 hidden'
                      type='file'
                      name='image'
                      id='image'
                      accept='image/*'
                      hidden
                    />
                    <div className='bg-lime-500 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-lime-500'>
                      Upload Image
                    </div>
                  </label>
                </div>
              </div>
              {image && <div className='flex items-center gap-5 mt-3 '>
                <p className='text-lime-500 font-semibold text-lg'>size: {20} Bytes</p>
                <img className='w-28 h-20 object-cover rounded-md border border-lime-500 p-1' src={image} alt="" />
              </div>}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleUpdate}
              type='submit'
              className='w-full p-3 mt-5 text-center font-medium text-white transition duration-200 rounded shadow-md bg-lime-500 '
            >
              Update Plant
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
UpdatePlantForm.propTypes = {
  inventoryData: PropTypes.object,
}
export default UpdatePlantForm


// todo: Dynamic default image for the update plant item