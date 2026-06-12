import { submitFormData } from '../api/dummyApi'

var formCounter: number = 0

const anliegenOptions: any[] = [
  { value: 'feedback', label: 'Feedback' },
  { value: 'support', label: 'Support' },
  { value: 'complaint', label: 'Beschwerde' },
  { value: '', label: 'Bitte wählen' },
  { value: 'other', label: 'Sonstiges' },
]

export default function BadForm(): any {
  function handleSubmit(event: any): void {
    event.preventDefault()

    var formData: any = {
      name: document.querySelector<HTMLInputElement>('#name')!.value,
      email: document.querySelector<HTMLInputElement>('#email')!.value,
      age: document.querySelector<HTMLInputElement>('#age')!.value,
      zip: document.querySelector<HTMLInputElement>('#plz')!.value,
      password: document.querySelector<HTMLInputElement>('#password')!.value,
      message: document.querySelector<HTMLTextAreaElement>('#message')!.value,
      anliegen: document.querySelector<HTMLSelectElement>('#anliegen')!.value,
      agb:
        document.querySelector<HTMLInputElement>('#agb')!.checked === true
          ? 'accepted'
          : 'rejected',
      newsletter:
        document.querySelector<HTMLInputElement>('#newsletter')!.checked === true
          ? 'yes'
          : 'no',
    }

    formCounter++
    console.log('📋 Form submitted #' + formCounter + ':', formData)

    // Bad practice: eval to "process" the form data
    eval("console.log('🚀 Processing form #" + formCounter + "')")

    var result: any = submitFormData(formData)
    console.log('📨 Result:', result)

    setTimeout(function () {
      alert(
        'Formular gesendet! Check die Konsole für Details.\nPassword: ' +
          formData.password
      )
    }, 200)
  }

  function handleReset(): void {
    var confirmed: any = confirm('Wirklich zurücksetzen? Alle Daten weg!')
    if (confirmed === true) {
      ;(document.getElementById('myForm') as any).reset()
      document.getElementById('status')!.innerHTML =
        '🔄 Form was reset at ' + new Date().toLocaleString()
    }
  }

  // Bad practice: inline styles everywhere
  var containerStyle: any = {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Arial',
  }

  var fieldsetStyle: any = {
    border: '2px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
  }

  var inputStyle: any = {
    width: '100%',
    padding: '8px',
    margin: '4px 0 12px 0',
    fontSize: '16px',
    border: '1px solid #ddd',
  }

  var labelStyle: any = { fontWeight: 'bold', display: 'block' }
  var buttonStyle: any = {
    padding: '10px 24px',
    fontSize: '16px',
    marginRight: '10px',
    cursor: 'pointer',
  }
  var errorButtonStyle: any = {
    padding: '10px 24px',
    fontSize: '16px',
    marginRight: '10px',
    cursor: 'pointer',
    backgroundColor: '#ff4444',
    color: 'white',
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>
        📝 Showcase Formular
      </h1>
      <p style={{ textAlign: 'center', color: '#666' }}>
        Dieses Formular hat <strong style={{ color: 'red' }}>KEINE</strong>{' '}
        Validierung. Viel Spaß!
      </p>

      <form id="myForm" onSubmit={handleSubmit}>
        <div style={fieldsetStyle}>
          <h2>Persönliche Daten</h2>

          <label style={labelStyle}>Name:</label>
          <input id="name" type="text" style={inputStyle} placeholder="Max Mustermann" />

          <label style={labelStyle}>E-Mail:</label>
          <input id="email" type="text" style={inputStyle} placeholder="user@example.com" />

          <label style={labelStyle}>Alter:</label>
          <input id="age" type="text" style={inputStyle} placeholder="z.B. 25" />

          <label style={labelStyle}>Postleitzahl:</label>
          <input id="plz" type="text" style={inputStyle} placeholder="12345" maxLength={5} />

          <label style={labelStyle}>Passwort:</label>
          <input id="password" type="password" style={inputStyle} placeholder="••••••••" />
        </div>

        <div style={fieldsetStyle}>
          <h2>Details</h2>

          <label style={labelStyle}>Anliegen:</label>
          <select id="anliegen" style={inputStyle}>
            {anliegenOptions.map(function (opt: any, index: any) {
              return (
                <option key={index} value={opt.value}>
                  {opt.label}
                </option>
              )
            })}
          </select>

          <label style={labelStyle}>Nachricht:</label>
          <textarea
            id="message"
            style={{ ...inputStyle, height: '120px' }}
            placeholder="Deine Nachricht..."
          ></textarea>
        </div>

        <div style={fieldsetStyle}>
          <h2>Einstellungen</h2>

          <label>
            <input id="agb" type="checkbox" /> Ich akzeptiere die AGB
          </label>
          <br />
          <label>
            <input id="newsletter" type="checkbox" defaultChecked={true} /> Newsletter
            abonnieren
          </label>
          <br />
          <label>
            <input id="newsletter" type="checkbox" /> Nochmal Newsletter (Bug: gleiche ID)
          </label>
        </div>

        <div>
          <button type="submit" style={buttonStyle}>
            🚀 Absenden
          </button>
          <button type="button" onClick={handleReset} style={buttonStyle}>
            🔄 Zurücksetzen
          </button>
          <button
            type="button"
            style={errorButtonStyle}
            onClick={function () {
              throw new Error('Manueller Fehler!')
            }}
          >
            💥 Fehler auslösen
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
        Warte auf Eingabe...
      </div>

      <div
        style={{
          marginTop: '40px',
          padding: '15px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '4px',
        }}
      >
        <strong>⚠️ Bad Practices in dieser App:</strong>
        <ul>
          <li>Keine Validierung (alles erlaubt)</li>
          <li>Passwort wird im Klartext in localStorage gespeichert</li>
          <li>console.log von sensitiven Daten</li>
          <li>Direct DOM manipulation statt React State</li>
          <li>{'<any>'} Types überall (TypeScript ignoriert)</li>
          <li>var statt let/const</li>
          <li>Kein Error Handling bei Fetch</li>
          <li>Duplizierte IDs im HTML</li>
          <li>eval() wird verwendet</li>
          <li>Fehlende Keys in Liste (nur index)</li>
        </ul>
      </div>
    </div>
  )
}
