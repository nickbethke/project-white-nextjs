import {SignUpForm} from "./components/signup-form";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default function Register() {


    return (
        <main className="flex justify-center items-center h-80vh">
            <Card className="w-full sm:w-[600px]">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                </CardHeader>
                <CardContent>
                    <SignUpForm/>
                </CardContent>
            </Card>
        </main>
    );
}
