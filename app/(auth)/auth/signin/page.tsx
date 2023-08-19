import {SigninForm} from "./components/signin-form";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function Signin() {
    return (
        <main className="flex flex-col justify-center items-center h-80vh gap-4">
            <Card className="w-full sm:w-96">
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                    <SigninForm/>
                </CardContent>
            </Card>
            <Button variant="link">
                <Link href="/auth/register">
                    <p className="text-muted-foreground">Don&apos;t have an account? Register here.</p>
                </Link>
            </Button>
        </main>
    );
}
