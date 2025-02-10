import {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useMemo,
	useState,
} from 'react'

interface AuthContext {
	isAuth: boolean
	setIsAuth: Dispatch<SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContext>({} as AuthContext)

export const AuthProvider: FC = ({ children }) => {
	const [isAuth, setIsAuth] = useState(false)

	const value = useMemo(
		() => ({
			isAuth,
			setIsAuth,
		}),
		[isAuth]
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
