import React, { useState, useEffect, useRef } from 'react';

// Main App component for the YouTube Media Player Web Interface
const App = () => {
  // State to hold the YouTube URL entered by the user
  const [url, setUrl] = useState('');
  // State to display the current status of the player (e.g., "Ready", "Playing...", "Paused")
  const [status, setStatus] = useState('Digite a URL do YouTube para carregar a mídia.');
  // State to manage if the media is currently playing
  const [isPlaying, setIsPlaying] = useState(false);
  // State to manage the loading state of the media
  const [isLoading, setIsLoading] = useState(false);
  // State for simulated playback progress (0-100)
  const [progress, setProgress] = useState(0);
  // Ref for the interval to simulate playback
  const progressIntervalRef = useRef(null);

  // Effect to manage the simulated playback interval
  useEffect(() => {
    if (isPlaying && progress < 100) {
      // Start a new interval if playing and not at the end
      progressIntervalRef.current = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(progressIntervalRef.current);
            setIsPlaying(false);
            setStatus('✅ Reprodução finalizada!');
            return 100;
          }
          return prevProgress + 1; // Increment progress by 1%
        });
      }, 100); // Update every 100ms for a total of 10 seconds playback simulation
    } else if (!isPlaying && progressIntervalRef.current) {
      // Clear interval if paused or playback finished
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    // Cleanup on component unmount
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, progress]);

  // Function to handle loading and playing the media
  const handleLoadAndPlay = async () => {
    // Basic URL validation
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setStatus('❌ URL inválida! Use http:// ou https://');
      return;
    }

    setIsLoading(true); // Set loading state
    setIsPlaying(false); // Ensure not playing while loading
    setProgress(0); // Reset progress
    setStatus('⏳ Carregando mídia... (Simulado)');

    try {
      // Simulate an API call to a backend to "prepare" the media for playback
      // In a real application, a backend might process the YouTube URL
      // to get a direct audio/video stream URL or prepare an embed.
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate 2 seconds loading

      // After simulated loading, start playing
      setIsLoading(false);
      setIsPlaying(true);
      setStatus('▶️ Reproduzindo...');
    } catch (error) {
      console.error("Erro simulado na requisição:", error);
      setIsLoading(false);
      setStatus('❌ Ocorreu um erro ao carregar a mídia. (Erro de conexão simulado)');
    }
  };

  // Function to toggle play/pause
  const togglePlayPause = () => {
    if (!url || isLoading) return; // Cannot play/pause if no URL or still loading
    setIsPlaying(!isPlaying);
    setStatus(isPlaying ? '⏸️ Pausado.' : '▶️ Reproduzindo...');
  };

  // Function to seek (simulate changing progress)
  const handleProgressClick = (e) => {
    if (!url || isLoading) return;
    const progressBar = e.currentTarget;
    const clickX = e.clientX - progressBar.getBoundingClientRect().left;
    const newProgress = (clickX / progressBar.offsetWidth) * 100;
    setProgress(Math.min(100, Math.max(0, newProgress))); // Ensure progress stays between 0 and 100
    if (newProgress < 100 && !isPlaying && url) { // If user seeks and it's not playing, start playing
      setIsPlaying(true);
      setStatus('▶️ Reproduzindo...');
    } else if (newProgress === 100) { // If user seeks to end, stop playing
      setIsPlaying(false);
      setStatus('✅ Reprodução finalizada!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-teal-900 flex items-center justify-center p-4 font-inter text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-blue-700">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-blue-300">
          YouTube Player Web
        </h1>

        {/* URL Input Section */}
        <div className="mb-6">
          <label htmlFor="media-url" className="block text-sm font-medium text-gray-300 mb-2">
            URL do Vídeo/Áudio do YouTube:
          </label>
          <input
            id="media-url"
            type="text"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 outline-none transition duration-200 ease-in-out"
            placeholder="Ex: https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading} // Disable input while loading
          />
        </div>

        {/* Load Media Button */}
        <button
          onClick={handleLoadAndPlay}
          className={`w-full py-3 px-6 rounded-lg text-lg font-semibold transition duration-300 ease-in-out transform
            ${isLoading
              ? 'bg-blue-600 cursor-not-allowed opacity-75'
              : 'bg-blue-700 hover:bg-blue-800 hover:scale-105 active:bg-blue-900'
            } shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Carregando...
            </div>
          ) : (
            'Carregar e Reproduzir'
          )}
        </button>

        {/* Player Controls (visible only after loading) */}
        {url && !isLoading && (
          <div className="mt-6">
            {/* Progress Bar */}
            <div
              className="w-full h-2 bg-gray-600 rounded-full cursor-pointer overflow-hidden mb-4"
              onClick={handleProgressClick}
              title="Clique para buscar"
            >
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              className={`w-full py-2 px-4 rounded-lg text-lg font-semibold transition duration-300 ease-in-out transform
                ${(isLoading || !url)
                  ? 'bg-gray-600 cursor-not-allowed opacity-75'
                  : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:bg-blue-800'
                } shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
              disabled={isLoading || !url} // Disable if loading or no URL
            >
              {isPlaying ? (
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
                    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                  </svg>
                  Pausar
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.38 2.872-1.667l11.559 6.416c1.18 1.18 1.18 3.29 0 4.47l-11.56 6.416c-1.342.713-2.872-.241-2.872-1.667V5.653z" clipRule="evenodd" />
                  </svg>
                  Reproduzir
                </div>
              )}
            </button>
          </div>
        )}

        {/* Status Message */}
        <p className="mt-6 text-center text-gray-300 text-sm">
          {status}
        </p>
      </div>
    </div>
  );
};

export default App;

            
