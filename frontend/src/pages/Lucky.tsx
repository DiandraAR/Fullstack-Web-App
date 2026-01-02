import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRandomByCategory } from '../api/frasesApi'
import { getDailyContent } from '../utils/dailyContent'
import '../styles/pageLayout.css'

export default function Lucky() {
  const navigate = useNavigate()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [texto, setTexto] = useState<string | null>(null)
  const [locked, setLocked] = useState(false)
  const [loading, setLoading] = useState(false)

  const config = {
    key: 'lucky',
    limit: 2,
    emptyMessage: 'Las señales se aquietaron.',
  }

  const reproducirSonido = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/sonidos/lucky.mp3')
      audioRef.current.volume = 0.3
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

  const lanzarAugurio = async () => {
    setLoading(true)

    const result = await getDailyContent(config, () =>
      getRandomByCategory('lucky')
    )

    // 🔒 YA NO HAY MÁS AUGURIOS
    if (result.locked) {
      detenerSonido()
      setTexto(result.message || null)
      setLocked(true)
      setLoading(false)
      return
    }

    // 🌿 AÚN HAY AUGURIO → ahora sí ritual
    setTexto('Un duende leyó las hojas…')
    reproducirSonido()

    setTimeout(() => {
      setTexto(result.data?.message || null)
      setLocked(false)
      setLoading(false)
    }, 3000)
  }

  // Primer augurio al entrar
  useEffect(() => {
    lanzarAugurio()

    return () => {
      detenerSonido()
    }
  }, [])

  return (
    <div className="page-container">
      <h1 className="page-title">Augurios</h1>

      {texto && (
        <p className={`page-text fade-text ${loading ? 'subtle' : locked ? 'muted' : ''}`}>
          {texto}
        </p>
      )}

      {!locked && !loading && (
        <button className="page-button" onClick={lanzarAugurio}>
          Otra señal
        </button>
      )}

      <button className="back-btn" onClick={() => navigate('/')}>
        ← Regresar
      </button>
    </div>
  )
}















