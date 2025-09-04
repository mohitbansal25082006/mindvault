"use client"
import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSession, signOut } from "next-auth/react"
import { User, Mail, Calendar, FileText, Loader2, Save, AlertTriangle, Trash2 } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { toast } from "sonner"
import { z } from "zod"
import { formatDistanceToNow } from "date-fns"

const ProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

type ProfileData = z.infer<typeof ProfileSchema>

// Make password optional in schema, enforce when needed client-side
const DeleteAccountSchema = z.object({
  password: z.string().optional(),
})

type DeleteAccountData = z.infer<typeof DeleteAccountSchema>

interface UserProfile {
  id: string
  name: string | null
  email: string
  image: string | null
  createdAt: string
  _count: {
    documents: number
  }
  hasPassword?: boolean
}

interface ErrorResponse {
  error?: string
  message?: string
}

export function SettingsInterface() {
  const { data: session, update } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileData>({
    resolver: zodResolver(ProfileSchema)
  })

  const {
    register: registerDelete,
    handleSubmit: handleSubmitDelete,
    reset: resetDelete,
    formState: { errors: deleteErrors }
  } = useForm<DeleteAccountData>({
    resolver: zodResolver(DeleteAccountSchema)
  })

  const fetchProfile = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data: UserProfile = await response.json()
        setProfile(data)
        reset({
          name: data.name || "",
          email: data.email || "",
        })
      } else {
        toast.error("Failed to load profile")
      }
    } catch (error) {
      console.error("fetchProfile error:", error)
      toast.error("Something went wrong while loading profile")
    } finally {
      setIsLoading(false)
    }
  }, [reset])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  // Reset delete form each time dialog opens
  useEffect(() => {
    if (isDeleteDialogOpen) {
      resetDelete()
    }
  }, [isDeleteDialogOpen, resetDelete])

  const onSubmit = async (data: ProfileData) => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(prev => ({ ...prev!, ...updatedProfile } as UserProfile))

        try {
          await update({
            ...session,
            user: {
              ...session?.user,
              name: data.name,
              email: data.email,
            }
          })
          await update()
        } catch (err) {
          console.warn("session update error:", err)
        }

        toast.success("Profile updated successfully!")
      } else {
        const err: ErrorResponse = await response.json()
        toast.error(err.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("update profile error:", error)
      toast.error("Something went wrong")
    } finally {
      setIsSaving(false)
    }
  }

  const onDeleteAccount = async (data: DeleteAccountData) => {
    // Determine if the user actually has a password stored
    const userHasPassword = profile?.hasPassword ?? false

    if (userHasPassword && !data.password) {
      toast.error("Please enter your password to delete your account")
      return
    }

    setIsDeleting(true)
    try {
      const body = userHasPassword ? { password: data.password } : {}
      const response = await fetch("/api/user/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        setIsDeleteDialogOpen(false)
        toast.success("Your account has been deleted successfully")
        await signOut({ callbackUrl: "/" })
      } else {
        let errJson: ErrorResponse = { error: "Failed to delete account" }
        try {
          errJson = await response.json()
        } catch {
          // ignore
        }
        toast.error(errJson.error || "Failed to delete account")
      }
    } catch (error) {
      console.error("onDeleteAccount error:", error)
      toast.error("Something went wrong while deleting your account")
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
        <p className="text-muted-foreground">Unable to load your profile information.</p>
      </div>
    )
  }

  const hasPassword = typeof profile.hasPassword === "boolean"
    ? profile.hasPassword
    : !(session?.user?.email?.includes("gmail.com") || session?.user?.email?.includes("github.com"))

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Profile Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-20 h-20 mb-4">
                <AvatarImage src={profile.image || ""} />
                <AvatarFallback className="text-2xl">
                  {profile.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">{profile.name}</h3>
              <p className="text-muted-foreground">{profile.email}</p>
              <Badge variant="outline" className="mt-2">
                {hasPassword ? "Password Account" : "OAuth Account"}
              </Badge>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Member since</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Documents</p>
                  <p className="text-xs text-muted-foreground">
                    {profile._count.documents} created
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...register("name")}
                      id="name"
                      placeholder="Enter your full name"
                      className="pl-10"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...register("email")}
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={!isDirty || isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Appearance</CardTitle>
              <CardDescription>
                Customize how MindVault looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose between light and dark themes
                  </p>
                </div>
                <ModeToggle />
              </div>
            </CardContent>
          </Card>

          {/* Account Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Statistics</CardTitle>
              <CardDescription>
                Overview of your MindVault usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{profile._count.documents}</p>
                  <p className="text-sm text-muted-foreground">Total Documents</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {Math.ceil((Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                  </p>
                  <p className="text-sm text-muted-foreground">Days Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-lg text-red-600 dark:text-red-400">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 border rounded-lg border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <div className="flex-1">
                  <p className="font-medium text-red-900 dark:text-red-100">Delete Account</p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Permanently delete your account and all associated data
                  </p>
                </div>

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-red-600 dark:text-red-400">Delete Account</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmitDelete(onDeleteAccount)} className="space-y-4 py-4">
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Deleting your account will remove all your documents, chats, and other associated data. This action is irreversible.
                        </AlertDescription>
                      </Alert>

                      {hasPassword && (
                        <div className="space-y-2">
                          <Label htmlFor="password">Confirm your password to delete your account</Label>
                          <Input
                            {...registerDelete("password")}
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                          />
                          {deleteErrors.password && (
                            <p className="text-red-500 text-sm">{deleteErrors.password.message}</p>
                          )}
                        </div>
                      )}

                      {!hasPassword && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            You&apos;re using an OAuth account. Deleting your account will permanently remove your access to this service.
                          </AlertDescription>
                        </Alert>
                      )}

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          variant="destructive" 
                          type="submit"
                          disabled={isDeleting}
                        >
                          {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Delete Account
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
