import React, {useEffect} from 'react';
import {useSignInMutation} from '../../services/endpoints/authEndpoints';
import {StyleSheet, View} from "react-native";
import {useRouter, usePathname } from "expo-router";
import {Route} from "@/shared/types";
import { Button, Input, Text } from '@rneui/themed';
import { makeStyles } from '@rneui/themed';
import {ThemeChangeProvider} from "@/providers/ThemeChangeProvider";
import {ThemedView} from "@/components/ThemedView";
import {useSelector} from "react-redux";
import {RootState} from "@/features/store";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type Props = {
    fullWidth?: boolean;
};

interface IFormInput {
    email: string;
    password: string;
}

const schema = yup.object({
    email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

const makeThemeStyles = makeStyles((theme, props: Props) => ({
    container: {
        background: theme.colors.white,
        width: props.fullWidth ? '100%' : 'auto',
    },
    text: {
        color: theme.colors.primary,
    },
}));


const SignInScreen = (props: Props) => {
    const router = useRouter();
    const [signIn, { isLoading, isError, isSuccess, error, reset }] = useSignInMutation();
    const authState = useSelector((state: RootState) => state.auth);
    const pathname = usePathname();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<IFormInput>({
        resolver: yupResolver(schema),
    });

    // const onSubmit2: SubmitHandler<IFormInput> = async (data) => {
    //     try {
    //         const response = await axios.post("/api/auth/signIn", data);
    //         console.log("Login successful:", response.data);
    //     } catch (error: any) {
    //         if (error.response?.status === 400) {
    //             const serverErrors = error.response?.data?.errors;
    //             // Якщо сервер повертає помилки, відображаємо їх
    //             if (serverErrors?.email) {
    //                 setError("email", { type: "server", message: serverErrors.email });
    //             }
    //             if (serverErrors?.password) {
    //                 setError("password", { type: "server", message: serverErrors.password });
    //             }
    //         } else {
    //             console.error("Unexpected error:", error);
    //         }
    //     }
    // };


    interface SignInFormValues {
        email: string;
        password: string;
    }

    const onSubmit: SubmitHandler<SignInFormValues> = async (data) => {
        try {
            const response = await signIn(data).unwrap(); // Витягує успішну відповідь
            console.log('Sign in successful:', response);
        } catch (err) {
            console.error('Sign in failed:', err); // Обробка помилок
        }
    };

    useEffect(() => {
        reset();

        if (authState.isAuth) {
            router.push(Route.ProfileInfo);
        }

    }, [reset, pathname]);

    // const handleLogin = async () => {
    //     const credentials = { email: 'iomm31@ukr.net', password: '12345678' };
    //
    //     try {
    //         const result = await signIn(credentials).unwrap();
    //         router.push(Route.ProfileInfo);
    //     } catch (error) {
    //         console.error('Login failed', error);
    //     }
    // };

    return (
        <ThemeChangeProvider>
            <ThemedView style={styles.container}>

                <form onSubmit={handleSubmit(onSubmit)} style={{maxWidth: "300px", margin: "auto"}}>

                    {/*<div>*/}
                    {/*    <label>Email</label>*/}
                    {/*    <input type="text" {...register("email")} />*/}

                    {/*</div>*/}

                    <Text>Enter site</Text>
                    <Input
                        placeholder="Email"
                        // value={email}
                        {...register("email")}
                        leftIcon={{type: 'material', name: 'email'}}
                    />

                    {errors.email && <p style={{color: "red"}}>{errors.email.message}</p>}

                    <Input
                        placeholder="Password"
                        // value={password}
                        {...register("password")}
                        secureTextEntry
                        leftIcon={{type: 'material', name: 'lock'}}
                    />
                    {errors.password && <p style={{color: "red"}}>{errors.password.message}</p>}*/}


                    {/*<div>*/}
                    {/*    <label>Password</label>*/}
                    {/*    <input type="password" {...register("password")} />*/}
                    {/*    {errors.password && <p style={{color: "red"}}>{errors.password.message}</p>}*/}
                    {/*</div>*/}

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Sign In'}
                    </button>
                </form>


                {/*<Text>Enter site</Text>*/}
                {/*<Input */}
                {/*    placeholder="Email"*/}
                {/*    value={email}*/}
                {/*    onChangeText={setEmail}*/}
                {/*    leftIcon={{type: 'material', name: 'email'}}*/}
                {/*/>*/}

                {/*<Input*/}
                {/*    placeholder="Password"*/}
                {/*    value={password}*/}
                {/*    onChangeText={setPassword}*/}
                {/*    secureTextEntry*/}
                {/*    leftIcon={{type: 'material', name: 'lock'}}*/}
                {/*/>*/}

                {/*<Text>*/}
                {/*    {isLoading ? 'Loading...' : ''}*/}
                {/*</Text>*/}

                {/*<Button title="Login" onPress={async () => {*/}
                {/*    console.log('Login');*/}
                {/*    await handleLogin();*/}
                {/*}*/}
                {/*}/>*/}


                {isSuccess && <Text>Login successful!</Text>}

                {isError && error && (
                    <Text>
                        {
                            typeof error === 'string' ? (
                                <> Error: {error}</>
                            ) : (
                                <> Error: {JSON.stringify(error)}</>
                            )
                        }
                    </Text>
                )}

            </ThemedView>
        </ThemeChangeProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 10,
        textAlign: 'right',
        alignItems: 'center',
        height: 500,
        borderStyle: 'solid',
        borderColor: 'red',
        borderWidth: 1,
        width: '100%',
    },
});

export default SignInScreen;