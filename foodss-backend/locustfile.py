"""
HOW TO RUN
In the terminal, on the folder where this file is, run the command:
locust --host=http://localhost:5000

Make sure that the IP and port of the host are the same as the .NET Application that is running.

Then in a browser head on over to http://localhost:8089/ and start a test.

WARNING
This test can create storages and products. Maybe use a temporary account to run the tests
"""

from locust import HttpLocust, TaskSet, task
import random
from gevent.pool import Group

EMAIL = "pemiolsi@gmail.com"
PASSWORD = "password"
MAX_STORAGES = 4
MAX_PRODUCTS_PER_STORAGE = 20

def randbool():
    return random.choice([True, False])

class UserBehavior(TaskSet):
    def headers (self):
        if (self.token != None):
            return {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + self.token}
        else:
            return {'Content-Type': 'application/json'}

    def on_start(self):
        self.token = None

        """ on_start is called when a Locust start before any task is scheduled """
        self.login()

    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        self.logout()

    def login(self):
        response = self.client.post("/api/user/authenticate", json = {"email": EMAIL, "password": PASSWORD}, headers = self.headers())

        self.token = response.json()["token"]

    def logout(self):
        self.token = None

    @task(10)
    def listStorages(self):
        """ retrieves list of storages and their products"""
        self.client.get("/api/storage?includeProducts=true", headers = self.headers())
        #group = Group()
        #group.spawn(lambda: self.client.get("/some_url")
        #group.spawn(lambda: self.client.get("/some_url")
        #group.join() # wait for greenlets to finish

    @task(5)
    def changeQuantity(self):
        response = self.client.get("/api/storage", headers = self.headers()).json()

        if (len(response) == 0):
            return

        storage = random.choice(response)

        code = random.randint(10000, 99999)

        name = "/api/storage/:storage/product"

        products = self.client.get("/api/storage/" + str(storage[ "id" ]) + "/product", name = name, headers = self.headers()).json()

        if (len(products) == 0):
            return

        product = random.choice(products)

        # Decrease quantity
        if (randbool()):
            name = "/api/storage/:storage/product/:product/item"

            items = self.client.get("/api/storage/" + str(storage[ "id" ]) + "/product/" + str(product[ "id" ]) + "/item", name = name, headers = self.headers()).json()

            if (len(items) == 0):
                return

            item = random.choice(items)

            name = "/api/storage/:storage/product/:product/item/:item/consume"

            self.client.post("/api/storage/" + str(storage["id"]) + "/product/" + str(product["id"]) + "/item/" + str(item["id"]) + "/consume", name = name, headers = self.headers()).json()
        # Increase quantity
        else:
            name = "/api/storage/:storage/product/:product/item"

            self.client.post("/api/storage/" + str(storage["id"]) + "/product/" + str(product["id"]) + "/item", name = name, json = {
                "shared": randbool(),
	            "expiryDate": "2019-07-09T17:54:55.714942+03:00",
	            "quantity": 1
            }, headers = self.headers()).json()


    @task(1)
    def createProduct (self):
        response = self.client.get("/api/storage", headers = self.headers()).json()

        if (len(response) == 0):
            return

        storage = random.choice(response)

        name = "/api/storage/:storage/product"

        products = self.client.get("/api/storage/" + str(storage[ "id" ]) + "/product", name = name, headers = self.headers()).json()

        if (len(products) >= MAX_PRODUCTS_PER_STORAGE):
            return

        code = random.randint( 10000, 99999 )

        name = "/api/storage/:storage/product"

        self.client.post("/api/storage/" + str(storage[ "id" ]) + "/product", name = name, json = {
            "name": "Bolachas " + str(code),
            "barcode": str(code)
        }, headers = self.headers())


    @task(1)
    def createStorage (self):
        response = self.client.get("/api/storage", headers = self.headers()).json()

        if (len(response) >= MAX_STORAGES):
            return

        self.client.post("/api/storage", json = {
            "name": "Despensa " + str(len(response) + 1),
            "invitations": []
        }, headers = self.headers())


class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait = 300
    max_wait = 1000
