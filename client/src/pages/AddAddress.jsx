import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const InputField = ({ type, placeholder, name, handleChange, address, required }) => (
    <input
        className='w-full px-2.5 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-[#4fbf8b] transition'
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        name={name}
        value={address[name]}
        required={required}
    />
)

const AddAddress = () => {

    const { axios, user, navigate } = useAppContext()

    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }))
    }

    // Validate the form data
    const validateForm = () => {
        const { firstName, lastName, email, street, city, state, zipcode, country, phone } = address;
        if (!firstName || !lastName || !email || !street || !city || !state || !zipcode || !country || !phone) {
            toast.error("Please fill in all fields.");
            return false;
        }
        // Add additional validations if necessary (e.g., for phone or email format)
        return true;
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        // Validate form before submitting
        if (!validateForm()) return;

        try {
            const { data } = await axios.post('/api/address/add', { address })
            if (data.success) {
                toast.success(data.message)
                navigate('/cart')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (!user) {
            navigate('/cart')
        }
    }, [user, navigate])

    return (
        <div className='mt-16 pb-16'>
            <p className='text-2xl md:text-3xl text-gray-500'>
                Add Shipping <span className='font-semibold text-[#4fbf8c]'>Address</span>
            </p>
            <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
                <div className="flex-1 max-w-md">
                    <form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'>

                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name="firstName" type="text" placeholder="First Name" required />
                            <InputField handleChange={handleChange} address={address} name="lastName" type="text" placeholder="Last Name" required />
                        </div>

                        <InputField handleChange={handleChange} address={address} name="email" type="email" placeholder="Email address" required />
                        <InputField handleChange={handleChange} address={address} name="street" type="text" placeholder="Street" required />

                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name="city" type="text" placeholder="City" required />
                            <InputField handleChange={handleChange} address={address} name="state" type="text" placeholder="State" required />
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name="zipcode" type="text" placeholder="Zipcode" required />
                            <InputField handleChange={handleChange} address={address} name="country" type="text" placeholder="Country" required />
                        </div>

                        <InputField handleChange={handleChange} address={address} name="phone" type="tel" placeholder="Phone" required />

                        <button className='w-full mt-6 bg-[#4fbf8c] text-white py-3 hover:bg-[#44ae7c] transition cursor-pointer uppercase'>
                            Save address
                        </button>
                    </form>
                </div>
                <img className='md:mr-16 mb-16 md:mt-0' src={assets.add_address_iamge} alt="Add" />
            </div>
        </div>
    )
}

export default AddAddress
