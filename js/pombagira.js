// Controla los botones de reproducción de audio de la sección Pombagira.
// Solo un audio suena a la vez: al reproducir uno, se pausan los demás.

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.play-btn');

  function setPlayingState(button, isPlaying) {
    const playIcon = button.querySelector('.play-btn__icon--play');
    const pauseIcon = button.querySelector('.play-btn__icon--pause');
    button.classList.toggle('is-playing', isPlaying);
    button.setAttribute('aria-pressed', String(isPlaying));
    playIcon.hidden = isPlaying;
    pauseIcon.hidden = !isPlaying;
  }

  function pauseAllExcept(exceptButton) {
    buttons.forEach((btn) => {
      if (btn === exceptButton) return;
      const audio = document.getElementById(`audio-${btn.dataset.audio}`);
      if (audio && !audio.paused) {
        audio.pause();
      }
      setPlayingState(btn, false);
    });
  }

  buttons.forEach((button) => {
    const audio = document.getElementById(`audio-${button.dataset.audio}`);
    if (!audio) return;

    button.addEventListener('click', () => {
      if (audio.paused) {
        pauseAllExcept(button);
        audio.play().catch(() => {
          // El archivo mp3 todavía no existe en /audio o no pudo cargarse.
          button.classList.add('is-unavailable');
          setPlayingState(button, false);
        });
        setPlayingState(button, true);
      } else {
        audio.pause();
        setPlayingState(button, false);
      }
    });

    audio.addEventListener('ended', () => setPlayingState(button, false));
    audio.addEventListener('error', () => button.classList.add('is-unavailable'));
  });
});
