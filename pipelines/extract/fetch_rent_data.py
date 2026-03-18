import requests

API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI2IiwianRpIjoiZDUxZmExMjU3NDM1MDA3MDcwOGVhYjQ5YWNkOGMyZGE3ZjE0Mzg3MTdjMGM5ZWI0NDNkMTExN2Y0NDI0OGVhMzdmOGY4N2YyM2NiNWI1MTAiLCJpYXQiOjE3NzM4NjAyNDAuOTA4Mzc2LCJuYmYiOjE3NzM4NjAyNDAuOTA4MzgsImV4cCI6MjA4OTQ3OTQ0MC45MDM5NzcsInN1YiI6IjEyMzE1MSIsInNjb3BlcyI6W119.Mqkl0oLZ8J58c4YgXBGZ2IE0icetjrLO7gJWK2WANzJ1oytZQU8eslCtfmmk8AfTeIVNko8UPhrZuMYv0fE0GQ'

def fetch_rent_data():
    base_url = "https://www.huduser.gov/hudapi/public/fmr"
    headers = {"Authorization": f"Bearer {API_KEY}"}
    list_states_endpoint = f"{base_url}/listStates"


    # list_counties_endpoint = f"{base_url}/listCounties?api_key={API_KEY}"
    response = requests.get(list_states_endpoint, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to fetch rent data: {response.status_code}")
    

if __name__ == "__main__":
    try:
        rent_data = fetch_rent_data()
        print(rent_data)
    except Exception as e:
        print(str(e))