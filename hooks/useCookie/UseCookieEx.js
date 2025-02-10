import React from 'react'
import { useCookie } from './useCookie'

const UseCookieEx = () => {
	const [value, updateCookie, deleteCookie] = useCookie('token', '')

	return (
		<>
			<div>Token: {value}</div>

			<button onClick={() => updateCookie(String(new Date()))}>
				Change token
			</button>

			<button onClick={deleteCookie}>Remove token</button>
		</>
	)
}

export default UseCookieEx
