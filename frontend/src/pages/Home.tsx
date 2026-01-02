import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import './Home.css'

export default function Home() {
  const [mostrarDuende, setMostrarDuende] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio('/sonidos/duende.mp3')
    audioRef.current.volume = 0.4

    let timeoutAparecer: number
    let timeoutOcultar: number

    const intentarMostrar = () => {
      //probabilidad (30%)
      const probabilidad = Math.random()

      if (probabilidad < 0.3) {
        setMostrarDuende(true)
        audioRef.current?.play().catch(() => {})

        
        timeoutOcultar = window.setTimeout(() => {
          setMostrarDuende(false)
        }, 3000)
      }

      
      const siguiente = Math.random() * (15000 - 7000) + 7000
      timeoutAparecer = window.setTimeout(intentarMostrar, siguiente)
    }

    
    timeoutAparecer = window.setTimeout(intentarMostrar, 5000)

    return () => {
      clearTimeout(timeoutAparecer)
      clearTimeout(timeoutOcultar)
      audioRef.current?.pause()
    }
  }, [])

  return (
    <div className="home-container">
      <h1 className="home-title">Mis Buenos Presagios</h1>

      <div className="home-subtitle-wrapper">
        {mostrarDuende && (
          <img
            src="/imagenes/duende.png"
            alt="Duende"
            className="home-duende visible"
          />
        )}

        <p className="home-subtitle">
          It's lucky season
        </p>
      </div>

      <div className="home-buttons">
        <Link to="/magic"><button className="forest-btn">Mensaje</button></Link>
        <Link to="/lucky"><button className="forest-btn">Augurios</button></Link>
        <Link to="/naughty"><button className="forest-btn">Susurro Travieso</button></Link>
      </div>
    </div>
  )
}





