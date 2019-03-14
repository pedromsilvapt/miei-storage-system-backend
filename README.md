# food-storage-management-backend
Back-end application of a food storage management system.

# Requirements
 - .NET Core 2.2
 - NodeJS/NPM

# Installation
When cloning this repository one should use the `--recurse-submodules` to automatically fetch the frontend repository as well.

```shell
git clone --recurse-submodules https://github.com/pedromsilvapt/miei-foodss-backend ./backend/
```

When the project is cloned, head into the `backend/ClientApp` folder and install the required dependencies

```shell
cd backend/ClientApp
npm install
```

# Usage
To launch the server, in the root project folder, simply run the command
```shell
dotnet run
```

To update the frontend, run the command
```shell
git submodule update --remote
```
 > **WARNING**: This will erase any local changes you've made inside the `ClientApp/` folder. To preserve them try using the `--merge` option when updating the submodule
