import { Button } from "@/components/ui/button"
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-lg border shadow-lg">
        <div className="text-center p-6">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your tarot reading account
          </p>
        </div>
        <div className="px-6 pb-6">
          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                required
                aria-describedby="email-description"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                required
                aria-describedby="password-description"
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="flex items-center space-x-2 mt-6">
            <input
              id="demo-mode"
              type="checkbox"
              className="h-4 w-4 rounded border border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-describedby="demo-description"
            />
            <label htmlFor="demo-mode" className="text-sm text-foreground select-none">
              Use Demo Account
            </label>
          </div>

          <div className="mt-6 text-center">
            <Button variant="link" size="sm" className="text-sm p-0 h-auto">
              Don't have an account? Sign up
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App