# AWS Deployment Guide using Docker & Docker Compose

This guide walks you through deploying the **Ferto Smart Fertilizer Recommendation** application onto an Amazon EC2 instance using the Docker Compose setup.

---

## Prerequisites

Before starting, make sure you have:
1. An AWS Account.
2. A key pair (`.pem` file) created in your AWS console for SSH access.
3. Git installed locally (to push your code) or access to the repository on GitHub.

---

## Step 1: Provision an AWS EC2 Instance

1. **Log in** to your AWS Management Console.
2. Navigate to **EC2** -> **Instances** -> **Launch an instance**.
3. Configure the instance parameters:
   - **Name**: `ferto-recommendation-server`
   - **AMI**: Select **Ubuntu Server 22.04 LTS (HVM)** or **Ubuntu Server 24.04 LTS**.
   - **Instance Type**: Select **t3.medium** (2 vCPUs, 4 GiB Memory) or higher.
     > [!WARNING]
     > The Spring Boot Java backend + Python machine learning service (with `pandas`, `scikit-learn`, `joblib`, etc.) requires a minimum of **2 GB RAM** to build and run reliably. Running on a `t2.micro` (1 GB) may lead to out-of-memory errors. If using `t2.micro` or `t3.micro`, you **must** configure swap space (see Appendix).
   - **Key Pair**: Choose your existing key pair or create a new one.
4. **Network Settings**:
   - Create a new Security Group.
   - Allow **SSH** traffic from **Anywhere** (or your IP for extra security) on port `22`.
   - Allow **HTTP** traffic from **Anywhere** on port `80`.
   - (Optional) Allow **HTTPS** traffic on port `443` if setting up SSL.
5. Launch the instance and wait for it to transition to the **Running** state.

---

## Step 2: Connect to your EC2 Instance

Open a terminal (or Git Bash on Windows) on your local computer and run:

```bash
# Set secure permissions for your private key (required on Linux/macOS)
chmod 400 /path/to/your-key.pem

# SSH into the EC2 instance using its Public DNS or Public IP
ssh -i /path/to/your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

---

## Step 3: Install Docker and Docker Compose on the EC2 Instance

Once connected to your Ubuntu instance, run the following commands to install Docker:

```bash
# Update package database
sudo apt-get update

# Install prerequisites
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the stable repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine & Compose
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add your user to the docker group so you don't need 'sudo' for docker commands
sudo usermod -aG docker $USER

# Log out and log back in for the group changes to take effect
exit
```

Now, SSH back into the instance:
```bash
ssh -i /path/to/your-key.pem ubuntu@<EC2_PUBLIC_IP>
```
Verify the installation works:
```bash
docker --version
docker compose version
```

---

## Step 4: Clone the Repository & Configure Environment Variables

1. Clone your project repository onto the EC2 instance:
   ```bash
   git clone <YOUR_REPOSITORY_GIT_URL> ferto
   cd ferto
   ```
2. Modify the OpenWeatherMap API Key or other configurations if necessary. You can pass them as environment variables or create a `.env` file in the root directory:
   ```bash
   nano .env
   ```
   Add the following variables:
   ```env
   FERTO_WEATHER_API_KEY=your_actual_openweathermap_api_key
   ```
   Save the file (`Ctrl+O`, `Enter`, `Ctrl+X`).

---

## Step 5: Launch the Application

Use Docker Compose to build and run all 4 containers in detached mode:

```bash
docker compose up --build -d
```

Docker will now:
1. Pull the PostgreSQL 15 image.
2. Build the Python FastAPI image (`ml-model`).
3. Compile the Java code and build the Spring Boot jar image (`backend`).
4. Build the React/Vite code and bundle it inside the Nginx web server image (`frontend`).
5. Run all 4 containers together inside a virtual bridge network.

### Verifying the Setup

Check if all containers are running successfully:
```bash
docker compose ps
```
You should see:
- `ferto-db` (Up / healthy)
- `ferto-ml-model` (Up)
- `ferto-backend` (Up)
- `ferto-frontend` (Up)

To check the logs of any container (e.g., the backend):
```bash
docker compose logs -f backend
```

---

## Step 6: Access the Application

1. Open your browser and navigate to: `http://<EC2_PUBLIC_IP>` (Port 80).
2. The React Frontend will load!
3. Log in with the pre-seeded credentials:
   - **Farmer account**: Username: `farmer`, Password: `farmer123`
   - **Admin account**: Username: `admin`, Password: `admin123`
4. Go to the prediction page, enter parameters, and verify the model yields fertilizer recommendations.

---

## Appendix: Setting up Swap Space (Crucial for free-tier / small memory instances)

If you are running on a `t2.micro` or `t3.micro` instance with only 1 GB RAM, Maven compilations or docker builds will likely freeze or run out of memory. Setting up a swap file acts as extra memory to prevent this:

```bash
# Create a 2GB swap file
sudo fallocate -l 2G /swapfile

# Set correct permissions
sudo chmod 600 /swapfile

# Format it as swap space
sudo mkswap /swapfile

# Enable the swap file
sudo swapon /swapfile

# Make the swap persistent on reboots
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Check memory status to verify
free -h
```
