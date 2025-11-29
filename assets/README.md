# Assets Directory

This folder is for images, textures, and other media files.

## Adding a Background Texture

To add a subtle background texture to enhance the dark theme:

1. **Download a dark texture** from one of these free sources:
   - [Transparent Textures](https://www.transparenttextures.com/) - Try "Carbon Fibre", "Black Linen", or "Asfalt Dark"
   - [Unsplash](https://unsplash.com/) - Search for "dark texture" or "abstract dark"
   - [Pexels](https://www.pexels.com/) - Search for "dark geometric" or "black marble texture"

2. **Save the image** as `dark-texture.png` (or similar) in this `assets/` folder

3. **Uncomment the background lines** in `styles.css`:
   ```css
   body {
       /* ... other styles ... */
       background-image: url('assets/dark-texture.png');
       background-size: cover;
       background-repeat: repeat;
       background-attachment: fixed;
   }
   ```

4. **Adjust as needed**:
   - Use `background-size: cover` for large images
   - Use `background-repeat: repeat` for seamless patterns
   - Use `background-attachment: fixed` for a parallax effect

## Recommended Search Terms

- Dark texture
- Carbon fiber pattern
- Subtle noise texture
- Dark geometric pattern
- Abstract dark blue
- Minimalist black texture
