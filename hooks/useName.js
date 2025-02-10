import { useDebugValue, useState } from 'react'

export const useName = () => {
	const [name, setName] = useState('')

	useDebugValue(name ? 'Is name' : 'Without name')

	return { name, setName }
}
