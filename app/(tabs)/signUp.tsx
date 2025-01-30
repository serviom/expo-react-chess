import React, {useState} from 'react';
import {useSignInMutation} from '../../services/endpoints/authEndpoints';
import {StyleSheet} from "react-native";
import {usePathname, useRouter, Link} from "expo-router";
import {Text, Icon } from '@rneui/themed';
import {ThemeChangeProvider} from "@/providers/ThemeChangeProvider";
import {ThemedView} from "@/components/ThemedView";
import {useSelector} from "react-redux";
import {RootState} from "@/features/store";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import ControlledInput from "@/components/new/forms/ControlledInput";
import SubmitButton from "@/components/new/forms/SubmitButton";
import BlockAnotherEnter from "@/components/new/ui/BlockAnotherEnter";
import {Route} from "@/shared/types";
import BlockAnotherRegister from "@/components/new/ui/BlockAnotherRegister";
import {handleFormSubmission} from "@/common";
import PasswordInput from "@/components/new/forms/PasswordInput";


const schema = yup.object({
    email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),
    username: yup
        .string()
        .required("Username is required")
        .min(2, "Username must be at least 6 characters"),
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    re_password: yup
        .string()
        .required("Repeat password is required")
        .oneOf([yup.ref("password")], "Passwords must match"),
}).required();

export interface SignUpFormValues {
    email: string;
    password: string;
    re_password: string;
    username: string;
}

const SignUpScreen = () => {
    const [signUp, { isLoading, isError, isSuccess, error, reset }] = useSignInMutation();
    const authState = useSelector((state: RootState) => state.auth);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
        setValue,
    } = useForm<SignUpFormValues>(
        {
            resolver: yupResolver(schema, { abortEarly: false }),
            defaultValues: {
                email: process.env.EXPO_PUBLIC_DEFAULT_AUTH_EMAIL as string,
                password: process.env.EXPO_PUBLIC_DEFAULT_AUTH_PASSWORD as string,
            },
        }
    );

    const onSubmit: SubmitHandler<SignUpFormValues> = async (data: SignUpFormValues) => {
        await handleFormSubmission(
            () => signUp(data).unwrap(),
            setError
        );
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
            <Text>Register</Text>
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
                        name="username"
                        placeholder="Username"
                        leftIcon={{type: 'material', name: 'face'}}
                        errors={errors}
                    />

                    <ControlledInput
                        control={control}
                        name="username1"
                        placeholder="Username1"
                        leftIcon={{type: 'material', name: 'badge'}}
                        errors={errors}
                    />

                    <ControlledInput
                        control={control}
                        name="username2"
                        placeholder="Username2"
                        leftIcon={{type: 'material', name: 'person-outline'}}
                        errors={errors}
                    />

                    <ControlledInput
                        control={control}
                        name="username3"
                        placeholder="Username3"
                        leftIcon={{type: 'material', name: 'person'}}
                        errors={errors}
                    />

                    <ControlledInput
                        control={control}
                        name="username3"
                        placeholder="Username3"
                        leftIcon={{type: 'material', name: 'account-circle'}}
                        errors={errors}
                    />

                    <PasswordInput control={control} errors={errors} />

                    <PasswordInput control={control} errors={errors} name="re_password" placeholder="Repeat password" />

                    <SubmitButton
                        isLoading={isLoading}
                        onPress={handleSubmit(onSubmit)}
                        title="Sign Up"
                        loadingText="Loading..."
                    />

                    <Text>Або</Text>
                    <BlockAnotherRegister />

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

export default SignUpScreen;