import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PhoneSelect from "./ui/phone-select"
import NavbarContainer from "@/Home/NavbarContainer"
import Navbar from "@/Home/Navbar"
import { useEffect, useState } from "react"
import axios, { AxiosResponse, AxiosError } from 'axios'
import { FacebookUserData } from "@/types/facebook-types"
import { useNavigate } from "react-router"
import { PhoneSelectData } from "@/types/phone-select-types"
import { passwordRegex } from "./password-regex"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword:'',
    countryCode: '',
    phoneNumber: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const handleFacebookLogin = async () => {
    if (window.FB) {
      window.FB.login(
        (response) => {
          if (response.authResponse) {
            const { accessToken } = response.authResponse;
            console.log("AccessToke", { accessToken })
            navigate('/phone', { state: { accessToken } })
          } else {
            console.log('User cancelled login or did not fully authorize.');
          }
        },
      );
    } else {
      console.error('Facebook SDK is not loaded.');
    }
  }

  const [isPasswordValid, setPasswordValidity] = useState(true)
  const [isPasswordMatching, setPasswordMatch] = useState(true)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await axios.post("http://localhost:5086/api/auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        countryCode: formData.countryCode,
        phoneNumber: formData.phoneNumber
      })
      if (response.status === 200) {
        navigate("/login")
      }
      alert("Signup successful! Please login.")
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(error.response?.data?.message || "Signup failed")
      }
      else if (error instanceof Error) {
        alert(error.message || "Signup failed")
      }
      else {
        alert("Signup failed");
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneChange = (phoneData: PhoneSelectData) => {
    setFormData({
      ...formData,
      phoneNumber: phoneData.nationalNumber,
      countryCode: phoneData.country.dialCode
    })
  }
  useEffect(() => {
    console.log(formData);

  }, [formData])
  return (
    <>
      <NavbarContainer>
        <Navbar />
      </NavbarContainer>
      <div className="bg-[url('/lost_found.jpg')] bg-no-repeat w-full min-h-screen flex justify-center items-center">
        <div className={cn("max-w-sm sm:max-w-md opacity-97", className)} {...props}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>
                Signup with your Facebook or Google account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit }>
                <div className="grid gap-6">
                  <div className="flex flex-col gap-4">
                    <Button onClick={handleFacebookLogin} variant="outline" className="w-full cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                          d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                          fill="currentColor"
                        />
                      </svg>
                      Signup with Facebook
                    </Button>
                    <Button variant="outline" className="w-full cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      Signup with Google
                    </Button>
                  </div>
                  <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                      Or continue with
                    </span>
                  </div>
                  <div className="grid gap-6">
                    <div className="flex gap-2">
                      <div className="grid gap-3">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <PhoneSelect
                        onChange={handlePhoneChange}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => {
                          if (e.target.value.match(passwordRegex) != null) {
                            setPasswordValidity(true)
                          }
                          else {
                            setPasswordValidity(false)
                          }
                          setFormData({ ...formData, password: e.target.value })
                        }
                        }
                        disabled={isLoading}
                      />
                      <Label hidden={isPasswordValid} className="font-normal text-sm text-red-500">*Password must be 8 to 12 chars and must contain a special character</Label>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="password">Confirm Password</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => {
                          if (e.target.value.match(formData.password) != null || e.target.value=='') {
                            setPasswordMatch(true)
                          }
                          else{
                            setPasswordMatch(false)
                          }
                          setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        }
                        disabled={isLoading}
                      />
                      <Label hidden={isPasswordMatching} className="font-normal text-sm text-red-500">*Passwords do not match</Label>
                      </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading || !isPasswordValid || !isPasswordMatching}
                    >
                      {isLoading ? "Creating account..." : "Signup"}
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Have an account?{" "}
                    <a href="/login" className="underline underline-offset-4">
                      Login
                    </a>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}