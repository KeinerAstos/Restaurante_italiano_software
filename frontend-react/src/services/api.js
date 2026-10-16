const apiBase = import.meta.env.VITE_API_URL ?? '/api'
export async function checkApiHealth() {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 2500)
  try {
    const response = await fetch(`${apiBase.replace(/\/api\/?$/, '')}/health`, { signal: controller.signal })
    return response.ok
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}
