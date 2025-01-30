import React, {useEffect} from 'react';
import {useSignInMutation} from '../../services/endpoints/authEndpoints';
import {useRouter, usePathname, Link } from "expo-router";
import {Route} from "@/shared/types";
import {Text} from '@rneui/themed';
import {ThemeChangeProvider} from "@/providers/ThemeChangeProvider";
import {useSelector} from "react-redux";
import {RootState} from "@/features/store";
import { useForm, SubmitHandler, Controller  } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ControlledInput from "@/components/new/forms/ControlledInput";
import SubmitButton from "@/components/new/forms/SubmitButton";


const schema = yup.object({
    email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
}).required();

interface SignInFormValues {
    email: string;
    password: string;
}

const SignInScreen = () => {
    const router = useRouter();
    const [signIn, { isLoading, isError, isSuccess, error, reset }] = useSignInMutation();
    const authState = useSelector((state: RootState) => state.auth);
    const pathname = usePathname();

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
        setValue,
    } = useForm<SignInFormValues>(
        {
            resolver: yupResolver(schema, { abortEarly: false }),
            defaultValues: {
                email: process.env.EXPO_PUBLIC_DEFAULT_AUTH_EMAIL as string,
                password: process.env.EXPO_PUBLIC_DEFAULT_AUTH_PASSWORD as string,
            },
        }
    );

    const onSubmit: SubmitHandler<SignInFormValues> = async (data: SignInFormValues) => {
        try {
            const response = await signIn(data).unwrap();
        } catch (err: any) {
            if (err.status === 400) {
                err.data.errors.forEach((error: any) => {
                    const fieldName = error.property as keyof SignInFormValues;
                    const errorMessage = Object.values(error.constraints || {}).join(", ");
                    setError(fieldName, {
                        type: "server",
                        message: errorMessage,
                    });
                });
            }
        }
    };


    // useEffect(() => {
    //     reset();
    //
    //     if (authState.isAuth) {
    //         // router.push(Route.ProfileInfo);
    //     }
    //
    // }, [reset, pathname]);

    return (
        <ThemeChangeProvider>
            <Text>Enter site</Text>

            {!authState.isAuth &&
                <>
                    <ControlledInput
                            control={control}
                        name="email"
                        placeholder="Email"
                        leftIcon={{type: 'material', name: 'email'}}
                        errors={errors}
                    />

                    <ControlledInput
                        control={control}
                        name="password"
                        placeholder="Password"
                        secureTextEntry
                        leftIcon={{type: 'material', name: 'lock'}}
                        errors={errors}
                    />

                    <Link href={Route.ForgotPassword}>
                        <Text>
                            Forgot Password?
                        </Text>
                    </Link>

                    <SubmitButton
                        isLoading={isLoading}
                        onPress={handleSubmit(onSubmit)}
                        title="Sign In"
                        loadingText="Loading..."
                    />

                    <Link href={Route.SignUp}>
                        <Text>
                            New? Sign up - and start playing chess!
                        </Text>
                    </Link>
                </>
            }

            {authState.isAuth && <Text>Login successful!</Text>}


            {isError && error && (
                <Text>
                    {
                        typeof error === 'string' ? (
                            <Text> Error: {error}</Text>
                        ) : (
                            <Text> Error: {JSON.stringify(error)}</Text>
                        )
                    }
                </Text>
            )}
        </ThemeChangeProvider>
    );
};

export default SignInScreen;