import urllib.request
from PIL import Image, ImageChops
import io
import sys

def crop_background(image_url, output_path):
    print("Downloading image...")
    req = urllib.request.Request(image_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        img_data = response.read()
        
    img = Image.open(io.BytesIO(img_data)).convert("RGBA")
    
    # Create a white image of the same size
    bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
    
    # Compute difference between original and white background
    diff = ImageChops.difference(img, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    
    # Get bounding box of the difference
    bbox = diff.getbbox()
    
    if bbox:
        # Crop the image to the bounding box
        img_cropped = img.crop(bbox)
        
        # Now make the white background transparent
        datas = img_cropped.getdata()
        newData = []
        for item in datas:
            # If pixel is close to white, make it transparent
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
                
        img_cropped.putdata(newData)
        
        # Save the cropped image
        img_cropped.save(output_path, "PNG")
        print(f"Image successfully cropped (size: {img_cropped.size}) and saved to {output_path}")
    else:
        print("Image is entirely white or empty.")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python crop_logo.py <image_url> <output_path>")
        sys.exit(1)
    
    crop_background(sys.argv[1], sys.argv[2])
