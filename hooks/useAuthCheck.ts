import { useRouter } from 'expo-router';
import {RootState} from '@/features/store';
import {useSelector} from "react-redux";
import {useEffect} from "react";
import {Route} from "@/shared/types";

const useAuthCheck = () => {
    const router = useRouter();
    const authState = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!authState.isAuth) {
            router.push(Route.SignIn);
        }
    }, [router]);

};

export default useAuthCheck;