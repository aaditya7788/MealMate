import requests

# Fetch data from the API
url = "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    data = response.json()

    # Extract the ingredient names
    ingredients = [item["strIngredient"] for item in data["meals"]]

    # Save the ingredients to a text file
    with open("ingredient.txt", "w") as file:
        file.write("\n".join(ingredients))


    print("Ingredients saved to ingredient.txt successfully.")
else:
    print(f"Failed to fetch data. Status code: {response.status_code}")
