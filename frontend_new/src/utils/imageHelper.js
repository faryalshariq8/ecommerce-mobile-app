export const getProductImage = (image) => {
  if (!image) return null;
  
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return { uri: image };
  }

  // Local assets map
  switch (image) {
    case 'abstract1.jpg':
      return require('../../assets/images/posters/abstract1.jpg');
    case 'abstract2.jpg':
      return require('../../assets/images/posters/abstract2.jpg');
    case 'minimal1.jpg':
      return require('../../assets/images/posters/minimal1.jpg');
    case 'minimal2.jpg':
      return require('../../assets/images/posters/minimal2.jpg');
    case 'movie1.jpg':
      return require('../../assets/images/posters/movie1.jpg');
    case 'movie2.jpg':
      return require('../../assets/images/posters/movie2.jpg');
    case 'music1.jpg':
      return require('../../assets/images/posters/music1.jpg');
    case 'music2.jpg':
      return require('../../assets/images/posters/music2.jpg');
    case 'music3.jpg':
      return require('../../assets/images/posters/music3.jpg');
    case 'music4.jpg':
      return require('../../assets/images/posters/music4.jpg');
    default:
      // Fallback
      return { uri: image };
  }
};
