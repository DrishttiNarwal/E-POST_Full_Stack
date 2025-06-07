import { SignupForm } from "../components/auth/SignupForm"
import 'react-toastify/dist/ReactToastify.css'; 
import { Navbar } from "../components/home/Navbar";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
      <Navbar/>
      <SignupForm />
    </div>
  )
}

