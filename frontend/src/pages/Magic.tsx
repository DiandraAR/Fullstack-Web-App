import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDailyContent } from '../utils/dailyContent'
import '../styles/pageLayout.css'

type TrebolTipo = 4 | 5 | 6

export default function Magic() {
  const navigate = useNavigate()

  const [texto, setTexto] = useState<string | null>(null)
  const [locked, setLocked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mostrarTrebol, setMostrarTrebol] = useState(false)
  const [trebolTipo, setTrebolTipo] = useState<TrebolTipo | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const config = {
    key: 'magic',
    limit: 1,
    emptyMessage: 'El duende ya habló hoy.',
  }

  const elegirTrebol = (): TrebolTipo => {
    const r = Math.random()
    if (r < 0.05) return 6
    if (r < 0.35) return 5
    return 4
  }

  const reproducirSonido = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/sonidos/magic.mp3')
      audioRef.current.volume = 0.3
      audioRef.current.loop = false
    }
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})
  }

  const detenerSonido = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const cargarMensaje = async () => {
    setLoading(true)

    const result = await getDailyContent(config, async () => {
      const res = await fetch('/api/magic')
      return res.json()
    })

    if (result.locked) {
      setTexto(result.message ?? null)
      setLocked(true)

      const hoy = new Date().toDateString()
      const guardado = localStorage.getItem('trebol-magic')

      let tipo: TrebolTipo
      if (!guardado || JSON.parse(guardado).date !== hoy) {
        tipo = elegirTrebol()
        localStorage.setItem('trebol-magic', JSON.stringify({ date: hoy, tipo }))
      } else {
        tipo = JSON.parse(guardado).tipo
      }

      detenerSonido()

      setTimeout(() => {
        setTexto(null)
        setTrebolTipo(tipo)
        setMostrarTrebol(true)
      }, 3000)
    } else if (result.data) {
      setTexto(result.data.message)
      setLocked(false)
    }

    setLoading(false)
  }

  useEffect(() => {
    const hoy = new Date().toDateString()
    const guardado = localStorage.getItem('trebol-magic')

    // 🔒 YA USADO HOY → solo música + trébol
    if (guardado && JSON.parse(guardado).date === hoy) {
      const tipo = JSON.parse(guardado).tipo
      reproducirSonido()
      setTrebolTipo(tipo)
      setMostrarTrebol(true)
      setLocked(true)
      setLoading(false)
      return
    }

    // 🔮 RITUAL NORMAL
    setTexto('El bosque guarda silencio…')
    reproducirSonido()

    const timer = setTimeout(() => {
      cargarMensaje()
    }, 4000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="page-container">
      <h1 className="page-title">Mensaje</h1>

      {texto && (
        <p className={`page-text ${loading ? 'subtle' : locked ? 'muted fade-text' : 'fade-text'}`}>
          {texto}
        </p>
      )}

      {!locked && !loading && (
        <button className="page-button" onClick={cargarMensaje}>
          Escuchar otra vez
        </button>
      )}

      {mostrarTrebol && trebolTipo && (
        <div className="fade-text" style={{ marginTop: '2rem' }}>
          <img
            src={`/imagenes/trebol-${trebolTipo}.png`}
            alt={`Trébol de ${trebolTipo} hojas`}
            style={{ width: '160px' }}
          />
          <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
            Has encontrado un trébol de {trebolTipo} hojas
          </p>
        </div>
      )}

      <button className="back-btn" onClick={() => navigate('/')}>
        ← Regresar
      </button>
    </div>
  )
}






















