import os
from dotenv import load_dotenv

import requests

load_dotenv()

API_KEY = os.getenv("API_KEY")

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