import numpy as np
from PIL import Image
import random
import math

def generate_random_image(width, height, color1, color2, exponent=5):
    # Create an empty array for the image
    img_array = np.zeros((height, width, 4), dtype=np.uint8)
    
    # Loop through each pixel
    for y in range(height):
        for x in range(width):
            r = random.random()
            t = math.pow(r, exponent)
            r = int(color1[0] + (1 - t) * (color2[0] - color1[0]))
            g = int(color1[1] + (1 - t) * (color2[1] - color1[1]))
            b = int(color1[2] + (1 - t) * (color2[2] - color1[2]))
            a = int(random.random() * 255)
            img_array[y, x] = [r, g, b, a]
    
    # Create an image from the array
    img = Image.fromarray(img_array)
    return img

# Define the colors (white and sky blue)
white = (255, 255, 255)
sky_blue = (65, 168, 211)

# Generate the image (1920x1080) with exponential distribution favoring white
image = generate_random_image(1920, 1080, sky_blue, white, exponent=5)

# Save the image
image.save("random_color_image_exponential.png")

print("Image generated successfully!")