import React from 'react'
import { useInput } from './useInput'

const UseInputEx = () => {
	const { bind, val } = useInput('')
	return <input {...bind} placeholder='Enter city' />
}

export default UseInputEx
