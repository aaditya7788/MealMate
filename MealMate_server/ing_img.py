import os
import requests

# Load ingredients from the text file
with open("ingredient.txt", "r") as file:
    ingredients = file.read().splitlines()

# Create a folder named "ingredients" to store the images
os.makedirs("ingredients", exist_ok=True)

# Base URL for downloading ingredient images
base_url = "https://www.themealdb.com/images/ingredients/"

# Iterate through each ingredient and download its image
for ingredient in ingredients:
    try:
        # Construct the image URL
        image_url = f"{base_url}{ingredient}.png"
        
        # Download the image
        response = requests.get(image_url, stream=True)
        if response.status_code == 200:
            # Save the image to the folder
            image_path = os.path.join("ingredients", f"{ingredient}.png")
            with open(image_path, "wb") as image_file:
                for chunk in response.iter_content(1024):
                    image_file.write(chunk)
            print(f"Downloaded: {ingredient}.png")
        else:
            print(f"Image not found for: {ingredient}")
    except Exception as e:
        print(f"Error downloading {ingredient}: {e}")

print("Download process completed!")
