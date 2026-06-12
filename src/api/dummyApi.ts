const API_URL: string = 'https://jsonplaceholder.typicode.com/posts'

export function submitFormData(data: any): any {
  var response: any
  var error: any

  console.log('📤 Sending data to backend:', data)
  console.log('🔑 User password:', data.password)

  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'sk-1234567890-this-is-fake',
    },
    body: JSON.stringify(data),
  })
    .then(function (res: any) {
      response = res
      document.getElementById('status')!.innerHTML =
        '✅ Form submitted successfully!'
    })
    .catch(function (err: any) {
      error = err
      document.getElementById('status')!.innerHTML =
        '❌ Error: ' + err.message
    })

  localStorage.setItem('lastPassword', data.password)
  localStorage.setItem('lastFormData', JSON.stringify(data))

  return { response: response, error: error }
}
