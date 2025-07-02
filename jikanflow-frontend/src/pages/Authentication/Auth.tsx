import { useLoginUser, useRegisterUser } from "@/apiQuery/apiQuery"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useUserStore from "@/store/userToken"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

type LoginForm = {
    username: string
    password: string
}

type SignupForm = {
    username: string
    email: string
    password: string
}

function Auth() {

    const { setToken } = useUserStore();
    const navigate = useNavigate();
    const {
        register: registerLogin,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginErrors, isSubmitting: loginLoading },
        reset: resetLogin,
    } = useForm<LoginForm>()

    const {
        register: registerSignup,
        handleSubmit: handleSignupSubmit,
        formState: { errors: signupErrors, isSubmitting: signupLoading },
    } = useForm<SignupForm>()

    const useLoginMutation = useLoginUser()
    const onLogin = async (data: LoginForm) => {
        console.log("🔐 Logging in with", data)
        // await loginMutation.mutateAsync(data)
        try {
            const responseData = await useLoginMutation.mutateAsync(data);
            localStorage.setItem("token", JSON.stringify(responseData?.token))
            setToken(responseData?.token);
            toast.success("User logged in successfully.")
            navigate("/")
        } catch (error: any) {
            toast.error(error?.response?.data)
        } finally {
            resetLogin()
        }

    }

    const registerUserMutation = useRegisterUser();

    const onSignup = async (data: SignupForm) => {
        registerUserMutation.mutate(data, {
            onSuccess: (responseData) => {
                toast.success(responseData);
            },
            onError: (error: any) => {
                toast.error(error?.response?.data)
            }
        });
    };


    return (
        <div className="flex min-h-screen flex-col md:flex-row items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md space-y-6">
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white shadow rounded-lg mb-6">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    {/* 🔑 Login */}
                    <TabsContent value="login">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                                <CardDescription>Enter your credentials to log in</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleLoginSubmit(onLogin)} className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="you123"
                                            {...registerLogin("username", { required: "Username is required" })}
                                        />
                                        {loginErrors.username && (
                                            <p className="text-sm text-red-500">{loginErrors.username.message}</p>
                                        )}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            {...registerLogin("password", { required: "Password is required" })}
                                        />
                                        {loginErrors.password && (
                                            <p className="text-sm text-red-500">{loginErrors.password.message}</p>
                                        )}
                                    </div>

                                    <div className="text-right text-sm">
                                        <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
                                    </div>

                                    <Button type="submit" disabled={loginLoading} className="w-full">
                                        {loginLoading ? "Logging in..." : "Login"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* 📝 Signup */}
                    <TabsContent value="signup">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Create an Account</CardTitle>
                                <CardDescription>Fill in the details to get started</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSignupSubmit(onSignup)} className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="@john"
                                            {...registerSignup("username", { required: "Username is required" })}
                                        />
                                        {signupErrors.username && (
                                            <p className="text-sm text-red-500">{signupErrors.username.message}</p>
                                        )}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email-signup">Email</Label>
                                        <Input
                                            id="email-signup"
                                            type="email"
                                            placeholder="you@example.com"
                                            {...registerSignup("email", { required: "Email is required" })}
                                        />
                                        {signupErrors.email && (
                                            <p className="text-sm text-red-500">{signupErrors.email.message}</p>
                                        )}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password-signup">Password</Label>
                                        <Input
                                            id="password-signup"
                                            type="password"
                                            {...registerSignup("password", { required: "Password is required" })}
                                        />
                                        {signupErrors.password && (
                                            <p className="text-sm text-red-500">{signupErrors.password.message}</p>
                                        )}
                                    </div>

                                    <Button type="submit" disabled={signupLoading} className="w-full">
                                        {signupLoading ? "Signing up..." : "Sign Up"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Image Section */}
            <div className="hidden md:block w-full md:w-2/5 px-6">
                <img
                    src="/auth-image.png"
                    alt="Authentication Illustration"
                    className="w-full h-auto rounded-xl object-cover shadow-lg"
                />
            </div>
        </div>
    )
}

export default Auth
