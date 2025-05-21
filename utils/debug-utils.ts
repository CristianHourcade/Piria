/**
 * Utility functions for debugging authentication and role issues
 */

export function logUserRole(user: any) {
  if (!user) {
    console.log("🔍 Debug: No user object found")
    return
  }

  console.log("🔍 Debug: User ID:", user.id)
  console.log("🔍 Debug: User email:", user.email)
  console.log("🔍 Debug: User metadata:", user.user_metadata)

  const role = user.user_metadata?.role || "No role found"
  console.log("🔍 Debug: User role:", role)

  return role
}
