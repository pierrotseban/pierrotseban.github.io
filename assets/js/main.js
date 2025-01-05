function switchImage(anchor) {
    const img = anchor.querySelector('img');
    const images = anchor.dataset.images.split(',');
    const currentIndex = images.indexOf(img.src.split('/').pop());
    const nextIndex = (currentIndex + 1) % images.length;
    img.src = images[nextIndex];
  }