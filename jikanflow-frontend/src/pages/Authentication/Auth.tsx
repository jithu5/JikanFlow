import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function Auth() {
    return (
        <div className="flex flex-col md:flex-row min-h-screen items-center justify-center bg-gray-100 p-4">
            {/* Left - Form Section */}
            <div className="w-full md:w-3/5 max-w-lg mx-auto">
                <Tabs defaultValue="account">
                    <TabsList className="w-full mb-4 bg-white">
                        <TabsTrigger className="w-full" value="account">Account</TabsTrigger>
                        <TabsTrigger className="w-full" value="password">Password</TabsTrigger>
                    </TabsList>

                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account</CardTitle>
                                <CardDescription>
                                    Make changes to your account here. Click save when you&apos;re done.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-name">Name</Label>
                                    <Input id="tabs-demo-name" defaultValue="Pedro Duarte" />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-username">Username</Label>
                                    <Input id="tabs-demo-username" defaultValue="@peduarte" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save changes</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="password">
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Login to your account</CardTitle>
                                <CardDescription>
                                    Enter your email below to login to your account
                                </CardDescription>
                                <CardAction>
                                    <Button variant="link">Sign Up</Button>
                                </CardAction>
                            </CardHeader>
                            <CardContent>
                                <form>
                                    <div className="flex flex-col gap-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="m@example.com"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <div className="flex items-center">
                                                <Label htmlFor="password">Password</Label>
                                                <a
                                                    href="#"
                                                    className="ml-auto text-sm underline hover:underline-offset-4"
                                                >
                                                    Forgot your password?
                                                </a>
                                            </div>
                                            <Input id="password" type="password" required />
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                                <Button type="submit" className="w-full">Login</Button>
                           
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Right - Image Section */}
            <div className="hidden md:block w-full md:w-2/5 p-6">
                <img
                    src="/auth-image.png" // 📸 Replace with your image path (in /public)
                    alt="Auth illustration"
                    className="w-full h-auto rounded-xl shadow-lg object-cover"
                />
            </div>
        </div>
    )
}

export default Auth
