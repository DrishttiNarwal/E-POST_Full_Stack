import { LoginForm } from "../components/auth/LoginForm"
import 'react-toastify/dist/ReactToastify.css'; 
import { Navbar } from "../components/home/Navbar";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
      <Navbar/>
      <LoginForm />
    </div>
  )
}

