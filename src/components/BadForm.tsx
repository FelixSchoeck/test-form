import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { submitFormData, type FormPayload } from '../api/dummyApi'

const anliegenOptions = [
  { value: '', label: 'Bitte wählen' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'support', label: 'Support' },
  { value: 'complaint', label: 'Beschwerde' },
  { value: 'other', label: 'Sonstiges' },
] as const

const allowedAnliegen: string[] = anliegenOptions
  .map((option) => option.value)
  .filter((value) => value !== '')

const formSchema = z.object({
  name: z.string().trim().min(1, 'Name ist erforderlich').max(80, 'Max. 80 Zeichen'),
  email: z
    .string()
    .trim()
    .min(1, 'E-Mail ist erforderlich')
    .email('Bitte eine gültige E-Mail angeben')
    .max(254, 'Max. 254 Zeichen'),
  age: z
    .number({ error: 'Alter muss eine Zahl sein' })
    .int('Alter muss eine ganze Zahl sein')
    .min(1, 'Alter muss mindestens 1 sein')
    .max(120, 'Alter darf höchstens 120 sein'),
  zip: z
    .number({ error: 'PLZ muss eine Zahl sein' })
    .int('PLZ muss eine ganze Zahl sein')
    .min(1000, 'PLZ ist zu kurz')
    .max(99999, 'PLZ darf höchstens 5-stellig sein'),
  password: z
    .string()
    .min(8, 'Passwort muss mindestens 8 Zeichen haben')
    .max(128, 'Passwort darf höchstens 128 Zeichen haben'),
  message: z
    .string()
    .trim()
    .min(1, 'Nachricht ist erforderlich')
    .max(1000, 'Nachricht darf höchstens 1000 Zeichen haben'),
  anliegen: z.string().refine((value) => allowedAnliegen.includes(value), {
    message: 'Bitte ein Anliegen auswählen',
  }),
  agb: z.boolean().refine((value) => value, {
    message: 'Bitte AGB akzeptieren',
  }),
  newsletter: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

function sanitizeInput(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function toPayload(values: FormValues): FormPayload {
  return {
    ...values,
    name: sanitizeInput(values.name),
    email: sanitizeInput(values.email),
    message: sanitizeInput(values.message),
    anliegen: sanitizeInput(values.anliegen),
  }
}

export default function BadForm() {
  const [status, setStatus] = useState('Warte auf Eingabe...')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      anliegen: '',
      password: '',
      newsletter: true,
      agb: false,
    },
  })

  const onSubmit = async (values: FormValues): Promise<void> => {
    setStatus('⏳ Sende Formular...')
    const result = await submitFormData(toPayload(values))

    if (result.success) {
      setStatus('✅ Form submitted successfully!')
      reset({
        name: '',
        email: '',
        age: undefined,
        zip: undefined,
        password: '',
        message: '',
        anliegen: '',
        newsletter: true,
        agb: false,
      })
      return
    }

    setStatus(`❌ Error: ${result.error}`)
  }

  function handleReset(): void {
    const confirmed = window.confirm('Wirklich zurücksetzen? Alle Daten weg!')
    if (confirmed) {
      reset({
        name: '',
        email: '',
        age: undefined,
        zip: undefined,
        password: '',
        message: '',
        anliegen: '',
        newsletter: true,
        agb: false,
      })
      setStatus(`🔄 Form was reset at ${new Date().toLocaleString()}`)
    }
  }

  const containerStyle = {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Arial',
  }

  const fieldsetStyle = {
    border: '2px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
  }

  const inputStyle = {
    width: '100%',
    padding: '8px',
    margin: '4px 0 12px 0',
    fontSize: '16px',
    border: '1px solid #ddd',
  }

  const labelStyle = { fontWeight: 'bold', display: 'block' }
  const buttonStyle = {
    padding: '10px 24px',
    fontSize: '16px',
    marginRight: '10px',
    cursor: 'pointer',
  }
  const errorTextStyle = {
    color: '#b00020',
    marginTop: '-8px',
    marginBottom: '10px',
    fontSize: '14px',
  }

  const secondaryButtonStyle = {
    padding: '10px 24px',
    fontSize: '16px',
    marginRight: '10px',
    cursor: 'pointer',
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>
        📝 Showcase Formular
      </h1>
      <p style={{ textAlign: 'center', color: '#666' }}>Mit Validierung und sicheren API-Calls.</p>

      <form id="myForm" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={fieldsetStyle}>
          <h2>Persönliche Daten</h2>

          <label htmlFor="name" style={labelStyle}>
            Name:
          </label>
          <input
            id="name"
            type="text"
            style={inputStyle}
            placeholder="Max Mustermann"
            maxLength={80}
            {...register('name')}
          />
          {errors.name && <p style={errorTextStyle}>{errors.name.message}</p>}

          <label htmlFor="email" style={labelStyle}>
            E-Mail:
          </label>
          <input
            id="email"
            type="email"
            style={inputStyle}
            placeholder="user@example.com"
            maxLength={254}
            {...register('email')}
          />
          {errors.email && <p style={errorTextStyle}>{errors.email.message}</p>}

          <label htmlFor="age" style={labelStyle}>
            Alter:
          </label>
          <input
            id="age"
            type="number"
            style={inputStyle}
            placeholder="z.B. 25"
            min={1}
            max={120}
            {...register('age', { valueAsNumber: true })}
          />
          {errors.age && <p style={errorTextStyle}>{errors.age.message}</p>}

          <label htmlFor="plz" style={labelStyle}>
            Postleitzahl:
          </label>
          <input
            id="plz"
            type="number"
            style={inputStyle}
            placeholder="12345"
            min={1000}
            max={99999}
            {...register('zip', { valueAsNumber: true })}
          />
          {errors.zip && <p style={errorTextStyle}>{errors.zip.message}</p>}

          <label htmlFor="password" style={labelStyle}>
            Passwort:
          </label>
          <input
            id="password"
            type="password"
            style={inputStyle}
            placeholder="••••••••"
            minLength={8}
            maxLength={128}
            {...register('password')}
          />
          {errors.password && <p style={errorTextStyle}>{errors.password.message}</p>}
        </div>

        <div style={fieldsetStyle}>
          <h2>Details</h2>

          <label htmlFor="anliegen" style={labelStyle}>
            Anliegen:
          </label>
          <select id="anliegen" style={inputStyle} {...register('anliegen')}>
            {anliegenOptions.map((option) => (
              <option key={option.value || 'empty'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.anliegen && <p style={errorTextStyle}>{errors.anliegen.message}</p>}

          <label htmlFor="message" style={labelStyle}>
            Nachricht:
          </label>
          <textarea
            id="message"
            style={{ ...inputStyle, height: '120px' }}
            placeholder="Deine Nachricht..."
            maxLength={1000}
            {...register('message')}
          ></textarea>
          {errors.message && <p style={errorTextStyle}>{errors.message.message}</p>}
        </div>

        <div style={fieldsetStyle}>
          <h2>Einstellungen</h2>

          <label htmlFor="agb">
            <input id="agb" type="checkbox" {...register('agb')} /> Ich akzeptiere die AGB
          </label>
          {errors.agb && <p style={errorTextStyle}>{errors.agb.message}</p>}
          <br />
          <label htmlFor="newsletter">
            <input id="newsletter" type="checkbox" {...register('newsletter')} /> Newsletter
            abonnieren
          </label>
        </div>

        <div>
          <button type="submit" style={buttonStyle} disabled={isSubmitting}>
            🚀 Absenden
          </button>
          <button type="button" onClick={handleReset} style={secondaryButtonStyle}>
            🔄 Zurücksetzen
          </button>
        </div>
      </form>

      <div
        id="status"
        style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
        }}
      >
        {status}
      </div>
    </div>
  )
}
