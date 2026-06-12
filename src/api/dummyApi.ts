const API_URL: string = 'https://jsonplaceholder.typicode.com/posts'

export type FormPayload = {
  name: string
  email: string
  age: number
  zip: number
  password: string
  message: string
  anliegen: string
  agb: boolean
  newsletter: boolean
}

export type SubmitResult = {
  success: boolean
  error?: string
}

export async function submitFormData(data: FormPayload): Promise<SubmitResult> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      return { success: false, error: `API request failed with status ${response.status}` }
    }

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: 'Unknown error during request' }
  }
}
