import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRandomByCategory } from '../api/frasesApi'
import { getDailyContent } from '../utils/dailyContent'
import '../styles/pageLayout.css'

export default function Naughty() {
  const navigate = useNavigate()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [texto, setTexto] = useState<string | null>(null)
  const [locked, setLocked] = useState(false)
  const [loading, setLoading] = useState(false)

  const config = {
    key: 'naughty',
    limit: 3,
    emptyMessage: 'El duende sonríe, pero ya no dice más.',
  }

  const reproducirSonido = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/sonidos/naughty.mp3')
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

  const lanzarSusurro = async () => {
    setLoading(true)

    // Texto titilando inicial
    setTexto('Se oye una risa baja…')

    const result = await getDailyContent(config, () =>
      getRandomByCategory('naughty')
    )

    // Si ya no hay más susurros → NO música
    if (result.locked) {
      setTexto(result.message || null)
      setLocked(true)
      setLoading(false)
      return
    }

    
    reproducirSonido()

    
    setTimeout(() => {
      setTexto(result.data?.message || null)
      setLocked(false)
      setLoading(false)
      // NO detenemos el audio aquí (igual que Lucky)
    }, 1500)
  }

  // Primer susurro al entrar
  useEffect(() => {
    lanzarSusurro()

    return () => {
      detenerSonido()
    }
  }, [])

  return (
    <div className="page-container">
      <h1 className="page-title">Susurro Travieso</h1>

      {texto && (
        <p className={`page-text fade-text ${loading ? 'subtle' : locked ? 'muted' : ''}`}>
          {texto}
        </p>
      )}

      {!locked && !loading && (
        <button className="page-button" onClick={lanzarSusurro}>
          Otro susurro
        </button>
      )}

      <button className="back-btn" onClick={() => navigate('/')}>
        ← Regresar
      </button>
    </div>
  )
}







